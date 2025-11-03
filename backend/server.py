# ---------------- Core Imports ----------------
import os
import importlib
import asyncio
import re
import requests  # <-- Added for downloading WhatsApp media
import urllib.parse  # <-- Added for parsing media URLs

from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from cachetools import TTLCache
# 🔵 Deepfake detection import
# from detect_real import analyze_image

# ---------------- Media Processing Imports (Self-contained) ----------------
from newspaper import Article, Config
from PIL import Image
import pytesseract
# import whisper
from moviepy.editor import VideoFileClip

# ---------------- Twilio Imports (NEW) ----------------
from twilio.rest import Client as TwilioClient
from twilio.twiml.messaging_response import MessagingResponse

# ---------------- Load Environment ----------------
from dotenv import load_dotenv
load_dotenv()

import requests

# ---------------- App Setup ----------------
app = FastAPI()
cache = TTLCache(maxsize=500, ttl=3600)

@app.get("/healthz")
def health_check():
    return {"status": "ok"}

# --- CORS Middleware (Existing) ---
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# def upload_to_imgbb(image_path, api_key="dcdadc1d756947a4074f6d548b0e28c0"):
def upload_to_imgbb(image_path):
    api_key = os.getenv("IMGBB_API_KEY")
    if not api_key:
        # Handle the case where the key is missing
        raise ValueError("IMGBB_API_KEY not found in environment variables.")
    with open(image_path, "rb") as file:
        response = requests.post(
            "https://api.imgbb.com/1/upload",
            params={"key": api_key},
            files={"image": file},
        )
    data = response.json()
    return data["data"]["url"]


# --- Twilio Client Setup (NEW) ---
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")  # Your Twilio WhatsApp number (e.g., 'whatsapp:+14155238886')

if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_PHONE_NUMBER:
    print("WARNING: Twilio credentials not fully set in .env file. WhatsApp bot will not work.")
    twilio_client = None
else:
    twilio_client = TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


# --- Pydantic Request Model for Text/URL (Existing) ---
class AnalyzeRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None
    input_type: Optional[str] = "text"

# ---------------- Self-Contained Text Extraction Logic (Existing) ----------------
# (These functions are reused by the WhatsApp hook)

def get_text_from_url_server(url):
    try:
        print("📥 Extracting text from URL...")
        user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
        config = Config()
        config.browser_user_agent = user_agent
        article = Article(url, config=config)
        article.download()
        article.parse()
        print("✅ Text extracted successfully.")
        return article.text
    except Exception as e:
        print(f"❌ Error extracting from URL: {e}")
        return None

def get_text_from_image_server(image_path):
    try:
        print("🖼️ Extracting text from image...")
        text = pytesseract.image_to_string(Image.open(image_path))
        print("✅ Text extracted successfully.")
        return text
    except Exception as e:
        print(f"❌ Error extracting from image: {e}")
        return None

# def get_text_from_media_server(media_path):
#     try:
#         print("🎤 Transcribing media file...")
#         audio_path_to_process = media_path
#         if media_path.lower().endswith(('.mp4', '.mov', '.avi')):
#             print("📹 Video file detected. Extracting audio...")
#             video = VideoFileClip(media_path)
#             audio_path_to_process = "temp_audio.wav"
#             video.audio.write_audiofile(audio_path_to_process, codec='pcm_s16le')
#
#         model = whisper.load_model("base")
#         result = model.transcribe(audio_path_to_process)
#
#         if audio_path_to_process != media_path and os.path.exists(audio_path_to_process):
#             os.remove(audio_path_to_process)
#
#         print("✅ Transcription complete.")
#         return result["text"]
#     except Exception as e:
#         print(f"❌ Error transcribing media: {e}")
#         return None

# ---------------- Pipeline Runner (Existing) ----------------
async def run_analysis_pipeline(input_text: str):
    """Runs the main analysis pipeline with the extracted text."""
    if not input_text or not input_text.strip():
        # Return a structured error that the reply formatter can understand
        return {
            "error": "Could not extract any meaningful text from the source."
        }

    try:
        pipeline_module = importlib.import_module("pipeline_xai")
        if hasattr(pipeline_module, "pipeline"):
            return await pipeline_module.pipeline(input_text)
        raise AttributeError("The required 'pipeline' function was not found in pipeline_xai.py")
    except Exception as e:
        print(f"❌ Pipeline execution error: {e}")
        return {
            "error": f"An error occurred during analysis: {e}"
        }

# ---------------- API ENDPOINTS (Existing) ----------------

@app.post("/analyze")
async def analyze_text_or_url(req: AnalyzeRequest):
    """(Existing) Handles text and URL submissions which arrive as application/json."""
    raw_text = None
    cache_key = None

    if req.text:
        raw_text = req.text
        cache_key = f"text:{req.text}"
    elif req.url:
        raw_text = get_text_from_url_server(req.url)
        cache_key = f"url:{req.url}"
    else:
        raise HTTPException(status_code=400, detail="No text or url provided in JSON body.")

    if not raw_text:
        raise HTTPException(status_code=400, detail="Failed to extract text from the provided URL.")

    if cache_key in cache:
        print(f"✅ Returning cached response for: {cache_key}")
        return {"success": True, "results": cache[cache_key], "from_cache": True}

    try:
        results = await run_analysis_pipeline(raw_text)
        if results.get("error"): # Handle pipeline errors
            raise HTTPException(status_code=500, detail=results["error"])
        cache[cache_key] = results
        return {"success": True, "results": results}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-file")
async def analyze_file(file: UploadFile = File(...)):
    # --- Move the import here ---
    from detect_real import analyze_image

    """(Existing) Handles file uploads (images, media) which arrive as multipart/form-data."""
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    raw_text = None
    try:
        ext = file.filename.split(".")[-1].lower()
        if ext in ["png", "jpg", "jpeg"]:
            raw_text = await asyncio.to_thread(get_text_from_image_server, temp_path)
        # elif ext in ["mp3", "wav", "mp4", "mov", "avi"]:
        #     raw_text = await asyncio.to_thread(get_text_from_media_server, temp_path)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")

        results = await run_analysis_pipeline(raw_text)
        if results.get("error"): # Handle pipeline errors
            raise HTTPException(status_code=500, detail=results["error"])
        return {"success": True, "results": results}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"An error occurred during file processing: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


# ---------------- NEW WHATSAPP WEBHOOK ----------------

def format_whatsapp_reply(results: dict) -> str:
    """
    Formats the complex JSON response from the pipeline into a
    user-friendly string for WhatsApp.
    """
    if "error" in results:
        return f"⚠️ *Verifact Error*\n\n{results['error']}"

    try:
        verdict = results.get("final_verdict", {})
        explanation = results.get("explanation", {})
        print("EXPLANATION:", explanation)
        decision = verdict.get("decision", "Unverifiable")
        reasoning = verdict.get("reasoning", "No reasoning provided.")
        tag = explanation.get("explanatory_tag", "N/A")
        corrected = explanation.get("corrected_news", "").strip()

        # Emojis for decisions
        emoji_map = {
            "True": "✅",
            "False": "❌",
            "Misleading": "⚠️",
            "Unverifiable": "❓",
            "Error": "⚙️"
        }
        emoji = emoji_map.get(decision, "ℹ️")

        reply = f"{emoji} *Verifact Analysis*\n\n"
        reply += f"*Verdict: {decision}* ({tag})\n\n"
        reply += f"_{reasoning}_\n\n"

        if corrected:
            reply += "*Corrected Info:*\n"
            reply += f"{corrected}\n\n"

        techniques = explanation.get("misinformation_techniques", [])
        if techniques:
            reply += "*Techniques Detected:*\n"
            for tech in techniques:
                reply += f"- {tech}\n"

        return reply

    except Exception as e:
        print(f"❌ Error formatting WhatsApp reply: {e}")
        return "⚙️ *Verifact Error*\n\nAn unexpected error occurred while formatting the analysis. Please try again."

# ---------------- User Session Cache ----------------
user_state = TTLCache(maxsize=500, ttl=1800)  # user session expires in 30 mins

@app.post("/whatsapp-hook")
async def whatsapp_webhook(
        Body: str = Form(None),
        From: str = Form(...),
        NumMedia: int = Form(0),
        MediaUrl0: str = Form(None),
        MediaContentType0: str = Form(None)
):
    print(f"📲 Received WhatsApp message from {From}")
    print(f"  Body: {Body}")
    print(f"  Media: {NumMedia}")

    if not twilio_client:
        return Response(status_code=500, content="Twilio client not configured")

    user_input = Body.strip().lower() if Body else ""

    # 🟢 1. New User
    if From not in user_state:
        welcome_text = (
            "👋 *Welcome to Verifact!*\n"
            "I'm your AI assistant for verifying news and analyzing media.\n\n"
            "Please choose what you’d like to do:\n"
            "1️⃣ Claim / News Verification\n"
            "2️⃣ Deepfake Detection\n\n"
            "Reply with *1* or *2* to continue."
        )
        await asyncio.to_thread(
            twilio_client.messages.create,
            body=welcome_text,
            from_=TWILIO_PHONE_NUMBER,
            to=From
        )
        user_state[From] = "awaiting_main_choice"
        return Response(status_code=200)

    # 🟡 2. Waiting for Main Option
    elif user_state[From] == "awaiting_main_choice":
        if "1" in user_input:
            await asyncio.to_thread(
                twilio_client.messages.create,
                body="✍️ You selected *Claim Verification*.\n\nPlease send me the *text, image, audio, or URL* you want verified.",
                from_=TWILIO_PHONE_NUMBER,
                to=From
            )
            user_state[From] = "awaiting_verification_input"

        elif "2" in user_input:
            await asyncio.to_thread(
                twilio_client.messages.create,
                body="🧠 You selected *Deepfake Detection*.\n\nPlease upload an *image or video* to analyze.",
                from_=TWILIO_PHONE_NUMBER,
                to=From
            )
            user_state[From] = "awaiting_deepfake_input"

        else:
            await asyncio.to_thread(
                twilio_client.messages.create,
                body="Please reply with *1* for Claim Verification or *2* for Deepfake Detection.",
                from_=TWILIO_PHONE_NUMBER,
                to=From
            )
        return Response(status_code=200)

    # 🧠 3. Deepfake Detection Flow
    elif user_state[From] == "awaiting_deepfake_input":
        if NumMedia == 0 or not MediaUrl0:
            await asyncio.to_thread(
                twilio_client.messages.create,
                body="⚠️ Please upload an image or video for Deepfake detection.",
                from_=TWILIO_PHONE_NUMBER,
                to=From
            )
            return Response(status_code=200)

        await asyncio.to_thread(
            twilio_client.messages.create,
            body="🔍 Analyzing your media for Deepfake traces... please wait.",
            from_=TWILIO_PHONE_NUMBER,
            to=From
        )

        try:
            # --- Move the import here ---
            from detect_real import analyze_image

            ext = MediaContentType0.split("/")[-1]
            temp_path = f"temp_deepfake_{urllib.parse.quote_plus(From)}.{ext}"

            # Download the file from WhatsApp
            media_data = requests.get(MediaUrl0, auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN))
            with open(temp_path, "wb") as f:
                f.write(media_data.content)

            # Run the deepfake detection model
            label, score, heatmap_path = await asyncio.to_thread(analyze_image, temp_path)

            # Example
            try:
                url = upload_to_imgbb(heatmap_path)
            except Exception as e:
                print(f"❌ Error uploading image to imgbb: {e}")
                url = "Image upload failed."
            # Send prediction result
            result_msg = (
                f"🤖 *Deepfake Analysis Result*\n\n"
                f"🟩 *Prediction:* {label}\n"
                f"📊 *Confidence:* {score}%\n\n"
                f"🧠 Generating explainability heatmap..."
            )

            await asyncio.to_thread(
                twilio_client.messages.create,
                body=result_msg,
                from_=TWILIO_PHONE_NUMBER,
                to=From
            )

            # Send heatmap image
            await asyncio.to_thread(
                twilio_client.messages.create,
                media_url=[url],  # <-- replace with your media hosting path
                from_=TWILIO_PHONE_NUMBER,
                to=From
            )

        except Exception as e:
            print(f"❌ Deepfake detection error: {e}")
            await asyncio.to_thread(
                twilio_client.messages.create,
                body=f"⚠️ Error during Deepfake detection: {e}",
                from_=TWILIO_PHONE_NUMBER,
                to=From
            )
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

        # After result, return to main menu
        user_state[From] = "awaiting_main_choice"
        await asyncio.to_thread(
            twilio_client.messages.create,
            body="✅ Analysis complete.\n\nReply *1* for Claim Verification or *2* for another Deepfake check.",
            from_=TWILIO_PHONE_NUMBER,
            to=From
        )
        return Response(status_code=200)

    # 🧩 4. Claim Verification Flow (unchanged from your original)
    elif user_state[From] == "awaiting_verification_input":
        if not (Body or NumMedia > 0):
            await asyncio.to_thread(
                twilio_client.messages.create,
                body="Please send something to verify — text, image, or URL.",
                from_=TWILIO_PHONE_NUMBER,
                to=From
            )
            return Response(status_code=200)

        await asyncio.to_thread(
            twilio_client.messages.create,
            body="🔍 Analyzing your message... please wait a few seconds.",
            from_=TWILIO_PHONE_NUMBER,
            to=From
        )

        raw_text = None
        temp_path = None
        try:
            # --- (your existing media, URL, and text handling code) ---
            if NumMedia > 0 and MediaUrl0:
                content_type = MediaContentType0.split('/')[0]
                ext = MediaContentType0.split('/')[-1]
                temp_path = f"temp_whatsapp_{urllib.parse.quote_plus(From)}.{ext}"
                media_data = requests.get(MediaUrl0, auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN))
                with open(temp_path, "wb") as f:
                    f.write(media_data.content)
                if content_type == "image":
                    raw_text = await asyncio.to_thread(get_text_from_image_server, temp_path)
                # elif content_type in ["audio", "video"]:
                #     raw_text = await asyncio.to_thread(get_text_from_media_server, temp_path)
            elif Body and re.search(r'https?://\S+', Body):
                url = re.search(r'(https?://\S+)', Body).group(1)
                raw_text = await asyncio.to_thread(get_text_from_url_server, url)
            elif Body:
                raw_text = Body

            # --- Run your pipeline ---
            if raw_text:
                results = await run_analysis_pipeline(raw_text)

                # ---- 1️⃣ Create Summary Message ----
                verdict = results.get("final_verdict", {})
                explanation = results.get("explanation", {})
                print("EXPLANATION:", explanation)
                emoji_map = {"True": "✅", "False": "❌", "Misleading": "⚠️", "Unverifiable": "❓", "Error": "⚙️"}
                decision = verdict.get("decision", "Unverifiable")
                emoji = emoji_map.get(decision, "ℹ️")
                tag = explanation.get("explanatory_tag", "N/A")
                reasoning = verdict.get("reasoning", "No reasoning provided.")
                corrected = explanation.get("corrected_news", "").strip()

                summary_msg = (
                    f"{emoji} *Verifact Summary*\n\n"
                    f"🏷️ *Tag:* {tag}\n"
                    f"🟩 *Verdict:* {decision}\n\n"
                    f"🧠 *Reasoning:* {reasoning}\n\n"
                    f"✅ *Corrected Info:*\n{corrected}"
                )

                await asyncio.to_thread(
                    twilio_client.messages.create,
                    body=summary_msg,
                    from_=TWILIO_PHONE_NUMBER,
                    to=From
                )
                await asyncio.sleep(1)

                # ---- 2️⃣ Create Detailed Explainability Message ----
                explain_parts = []
                detailed_expl = explanation.get("claim_breakdown", [])
                for idx, claim in enumerate(detailed_expl, start=1):
                    subclaim = claim.get("sub_claim", "")
                    status = claim.get("status", "")
                    evidence = claim.get("evidence", "")
                    reason = claim.get("reason_for_decision", "")
                    sources = claim.get("source_url", "")

                    explain_parts.append(
                        f"🔹 *Sub-Claim {idx}:* {subclaim}\n"
                        f"📊 *Status:* {status}\n\n"
                        f"📚 *Evidence:*\n{evidence}\n\n"
                        f"💡 *Reason:*\n{reason}\n"
                        f"🌐 *Sources:*\n{sources}\n"
                        f"{'-'*40}"
                    )

                if explain_parts:
                    explain_text = "*🧩 Detailed Explainability:*\n\n" + "\n\n".join(explain_parts)
                    # Split into chunks if long
                    MAX_LEN = 1500
                    for i in range(0, len(explain_text), MAX_LEN):
                        await asyncio.to_thread(
                            twilio_client.messages.create,
                            body=explain_text[i:i+MAX_LEN],
                            from_=TWILIO_PHONE_NUMBER,
                            to=From
                        )
                        await asyncio.sleep(1)
                print("✅ WhatsApp analysis complete.")
            else:
                await asyncio.to_thread(
                    twilio_client.messages.create,
                    body="⚠️ Sorry, I couldn't find any readable content. Try again with text or image.",
                    from_=TWILIO_PHONE_NUMBER,
                    to=From
                )

        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)

        user_state[From] = "awaiting_main_choice"
        await asyncio.to_thread(
            twilio_client.messages.create,
            body="✅ Analysis complete.\n\nReply *1* for Claim Verification or *2* for another Deepfake check.",
            from_=TWILIO_PHONE_NUMBER,
            to=From
        )

        return Response(status_code=200)

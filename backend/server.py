# ---------------- Core Imports ----------------
import os
import importlib
import asyncio
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from cachetools import TTLCache

# ---------------- Load Environment ----------------
from dotenv import load_dotenv
load_dotenv()

# ---------------- Media Processing Imports (Self-contained) ----------------
from newspaper import Article, Config
from PIL import Image
import pytesseract
import whisper
from moviepy.editor import VideoFileClip

# ---------------- App Setup ----------------
app = FastAPI()
cache = TTLCache(maxsize=500, ttl=3600)

# --- CORS Middleware ---
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Request Model for Text/URL ---
class AnalyzeRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None
    input_type: Optional[str] = "text"

# ---------------- Self-Contained Text Extraction Logic ----------------
# Using these robust functions ensures the server works independently

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

def get_text_from_media_server(media_path):
    try:
        print("🎤 Transcribing media file...")
        audio_path_to_process = media_path
        if media_path.lower().endswith(('.mp4', '.mov', '.avi')):
            print("📹 Video file detected. Extracting audio...")
            video = VideoFileClip(media_path)
            audio_path_to_process = "temp_audio.wav"
            video.audio.write_audiofile(audio_path_to_process, codec='pcm_s16le')

        model = whisper.load_model("base")
        result = model.transcribe(audio_path_to_process)

        if audio_path_to_process != media_path and os.path.exists(audio_path_to_process):
            os.remove(audio_path_to_process)

        print("✅ Transcription complete.")
        return result["text"]
    except Exception as e:
        print(f"❌ Error transcribing media: {e}")
        return None

# ---------------- Pipeline Runner ----------------
async def run_analysis_pipeline(input_text: str):
    """Runs the main analysis pipeline with the extracted text."""
    if not input_text or not input_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract any meaningful text from the source.")

    pipeline_module = importlib.import_module("pipeline_xai")
    if hasattr(pipeline_module, "pipeline"):
        return await pipeline_module.pipeline(input_text)
    raise AttributeError("The required 'pipeline' function was not found in pipeline_xai.py")

# ---------------- API ENDPOINTS (Dual Endpoint Architecture) ----------------

@app.post("/analyze")
async def analyze_text_or_url(req: AnalyzeRequest):
    """Handles text and URL submissions which arrive as application/json."""
    raw_text = None
    cache_key = None

    if req.text:
        raw_text = req.text
        cache_key = f"text:{req.text}"
    elif req.url:
        # FastAPI handles running synchronous functions like this in a threadpool
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
        cache[cache_key] = results
        return {"success": True, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-file")
async def analyze_file(file: UploadFile = File(...)):
    """Handles file uploads (images, media) which arrive as multipart/form-data."""
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    raw_text = None
    try:
        ext = file.filename.split(".")[-1].lower()
        if ext in ["png", "jpg", "jpeg"]:
            raw_text = await asyncio.to_thread(get_text_from_image_server, temp_path)
        elif ext in ["mp3", "wav", "mp4", "mov", "avi"]:
            raw_text = await asyncio.to_thread(get_text_from_media_server, temp_path)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")

        results = await run_analysis_pipeline(raw_text)
        return {"success": True, "results": results}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"An error occurred during file processing: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


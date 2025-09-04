# ---------------- Core Imports ----------------
import os
import asyncio
import time
import re
import streamlit as st
import requests
import json 
from dotenv import load_dotenv

# ---------------- LangChain & AI Imports ----------------
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from tavily import TavilyClient

# ---------------- Media Processing Imports ----------------
from newspaper import Article, Config
from PIL import Image
import pytesseract
import whisper
from moviepy import VideoFileClip

# ---------------- Setup & Configuration ----------------
# --- Load Environment Variables ---
load_dotenv()

# --- API Keys & Tracing ---
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LangSmith_API_KEY")
API_KEY_FCTA = os.getenv("FACT_CHECK_API")
TAVILY_API_KEY = os.getenv("TAVILY_API")

# --- Tesseract OCR Configuration ---
# NOTE: Update this path to where you have installed Tesseract-OCR
try:
    pytesseract.pytesseract.tesseract_cmd = r'D:\Tesseract-OCR\tesseract.exe'
except Exception as e:
    st.error(f"Tesseract not configured correctly: {e}")

# --- Initialize Clients & Models ---
tavily_client = TavilyClient(api_key=TAVILY_API_KEY)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest") # Updated model name for better performance

# --- Trusted Domains for Web Search ---
trusted_domains = [
    "bbc.com", "reuters.com", "apnews.com", "npr.org", "pbs.org",
    "gov.in", "thehindu.com", "timesofindia.indiatimes.com", "indianexpress.com",
    "politifact.com", "snopes.com", "factcheck.org"
]

# ---------------- Text Extraction Functions (from main.py) ----------------

def get_text_from_url(url):
    """Extracts the main article text from a URL."""
    try:
        st.info("📥 Extracting text from URL...")
        user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
        config = Config()
        config.browser_user_agent = user_agent
        config.request_timeout = 10

        article = Article(url, config=config)
        article.download()
        article.parse()
        st.success("✅ Text extracted successfully.")
        return article.text
    except Exception as e:
        st.error(f"❌ Error extracting from URL: {e}")
        return None

def get_text_from_image(image_path):
    """Extracts text from an image using OCR."""
    try:
        st.info("🖼️ Extracting text from image...")
        text = pytesseract.image_to_string(Image.open(image_path))
        st.success("✅ Text extracted successfully.")
        return text
    except Exception as e:
        st.error(f"❌ Error extracting from image: {e}")
        return None

def get_text_from_media(media_path):
    """Transcribes text from an audio or video file using Whisper."""
    audio_path = media_path
    try:
        st.info("🎤 Transcribing media file...")
        if media_path.endswith(('.mp4', '.mov', '.avi')):
            st.info("📹 Video file detected. Extracting audio...")
            video = VideoFileClip(media_path)
            audio_path = "temp_audio.wav"
            video.audio.write_audiofile(audio_path, codec='pcm_s16le')

        model = whisper.load_model("base")
        result = model.transcribe(audio_path)
        st.success("✅ Transcription complete.")
        return result["text"]
    except Exception as e:
        st.error(f"❌ Error transcribing media: {e}")
        return None
    finally:
        # Clean up temporary audio file if it was created
        if audio_path != media_path and os.path.exists(audio_path):
            os.remove(audio_path)

# ---------------- Summarization Prompt ----------------
Summarize_prompt = ChatPromptTemplate.from_messages(
    [
        ("system",
         "You are a helpful and precise assistant. Summarize the given text in 150–200 characters. "
         "Do not add any external information or assumptions. Only use facts explicitly mentioned in the text. "
         "Preserve all important details, names, dates, numbers, and context. "
         "Ensure the summary is clear, concise, and faithful to the original content. "
         "If something is unclear or missing in the input, do not try to infer or create details—just omit them."),
        ("user", "news:{news}")
    ]
)
summarizer = Summarize_prompt | llm | StrOutputParser()

# ---------------- Fact-Checking & Web Search Functions ----------------

def fact_check(news):
    """Queries the Google Fact Check API."""
    BASE_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
    params = {"query": news, "key": API_KEY_FCTA, "languageCode": "en"}
    response = requests.get(BASE_URL, params=params)
    data = response.json()
    return data.get("claims", [])

def web_search(news):
    """Performs a web search using Tavily on trusted domains."""
    try:
        response = tavily_client.search(
            query=news,
            include_domains=trusted_domains,
            search_depth="advanced",
            include_raw_content=True,
            max_results=5
        )
        docs = [
            Document(
                page_content=(r.get("raw_content") or r.get("content") or "")[:4000],
                metadata={"title": r.get("title", ""), "url": r.get("url", "")}
            ) for r in response.get("results", []) if (r.get("raw_content") or r.get("content"))
        ]
        return docs
    except Exception as e:
        st.warning(f"Tavily search failed: {e}")
        return []

# ---------------- Detection Chain ----------------
detection_prompt = ChatPromptTemplate.from_messages([
    ("system",
     "You are a meticulous fact-checking assistant. Your task is to analyze whether the given news is true, false, or misleading based ONLY on the information from the provided sources. Do not make assumptions or add information that is not in the sources."),
    ("human",
     "Sources:\n{context}\n\n"
     "News to verify:\n{query}\n\n"
     "Instructions:\n"
     "1. Carefully analyze the sources step by step.\n"
     "2. Compare the claims in the news with the evidence from the sources.\n"
     "3. If sources contradict each other, explain the conflict clearly.\n"
     "4. If there is not enough information, your decision must be \"Unverifiable\".\n"
     "5. The 'fake_score' should represent your confidence that the claim is NOT TRUE (0 = completely true, 100 = completely false/fabricated). For 'Unverifiable', the score should be 50.\n"
     "6. Your reasoning must be a concise, one-paragraph explanation based strictly on the provided sources.\n\n"
     "Output Format (strict JSON):\n"
     "{{\n"
     "  \"decision\": \"True / False / Misleading / Unverifiable\",\n"
     "  \"fake_score\": 0-100,\n"
     "  \"reasoning\": \"Your brief explanation here.\"\n"
     "}}"
    )
])

# Using create_stuff_documents_chain for better performance with fewer documents
detection_chain = create_stuff_documents_chain(llm, detection_prompt)

# ---------------- Main Pipeline ----------------
async def pipeline(news):
    """The main fact-checking pipeline."""
    # Step 1: Summarize input text
    st.info("✍️ Summarizing the claim...")
    concise_news = await summarizer.ainvoke({"news": news})
    st.write(f"**Generated Summary:** {concise_news}")

    # Step 2 & 3: Run Google Fact Check and Web Search concurrently
    st.info("🕵️ Searching for evidence...")
    fact_check_task = asyncio.to_thread(fact_check, concise_news)
    web_search_task = asyncio.to_thread(web_search, concise_news)
    fact_check_res, web_res = await asyncio.gather(fact_check_task, web_search_task)
    
    # Step 4: Process results and generate final verdict
    st.info("🧠 Analyzing evidence and making a decision...")
    if web_res:
        verdict_output = await detection_chain.ainvoke(
            {"context": web_res, "query": concise_news}
        )
        # Attempt to parse the JSON output
        try:
            # Use regex to find the JSON block, ignoring surrounding text/markdown
            match = re.search(r'\{.*\}', verdict_output, re.DOTALL)
            if match:
                json_str = match.group(0)
                verdict = json.loads(json_str)
            else:
                # If no JSON block is found, raise an error to be caught by the except block
                raise ValueError("No JSON object found in the model's response.")
        except json.JSONDecodeError:
            verdict = {"decision": "Error", "fake_score": 0, "reasoning": f"Failed to parse model's response. Error: {e}. Raw output: '{verdict_output}'"}
    else:
        verdict = {
            "decision": "Unverifiable",
            "fake_score": 50,
            "reasoning": "Could not find sufficient information from trusted web sources to verify the claim."
        }

    return {
        "summary": concise_news,
        "fact_check_api": fact_check_res,
        "web_results": web_res,
        "final_verdict": verdict
    }

# ---------------- Streamlit UI ----------------
if __name__ == "__main__":
    st.set_page_config(page_title="AI Fact-Checker", page_icon="📰", layout="wide")
    st.title("📰 AI Fact-Checker")
    st.write("Verify news from text, URLs, images, or audio/video files.")

    raw_text = ""
    input_source = None

    # --- Input Tabs ---
    tab1, tab2, tab3 = st.tabs(["▶️ Text or URL", "🖼️ Image", "🎤 Audio/Video"])

    with tab1:
        text_input = st.text_area("Paste a news article, claim, or URL:", height=200)

    with tab2:
        image_file = st.file_uploader("Upload an image file", type=["png", "jpg", "jpeg"])

    with tab3:
        media_file = st.file_uploader("Upload an audio or video file", type=["mp3", "wav", "mp4", "mov", "avi"])

    # --- Verification Button and Logic ---
    if st.button("🔍 Verify", use_container_width=True):
        # Determine the input source
        if text_input.strip():
            # Check if input is a URL
            if re.match(r'https?://\S+', text_input):
                input_source = text_input
                with st.spinner("Processing URL..."):
                    raw_text = get_text_from_url(text_input)
            else:
                input_source = "User-provided text"
                raw_text = text_input
        elif image_file is not None:
            input_source = image_file.name
            # Save temporary file to pass its path
            with open(image_file.name, "wb") as f:
                f.write(image_file.getbuffer())
            with st.spinner("Processing Image..."):
                raw_text = get_text_from_image(image_file.name)
            os.remove(image_file.name) # Clean up temp file
        elif media_file is not None:
            input_source = media_file.name
            # Save temporary file
            with open(media_file.name, "wb") as f:
                f.write(media_file.getbuffer())
            with st.spinner("Processing Media File (this may take a while)..."):
                raw_text = get_text_from_media(media_file.name)
            os.remove(media_file.name) # Clean up temp file

        # --- Run Pipeline if text was extracted ---
        if raw_text and raw_text.strip():
            st.markdown("---")
            st.subheader("📊 Fact-Checking In Progress...")
            
            start_time = time.time()
            results = asyncio.run(pipeline(raw_text))
            end_time = time.time()

            st.markdown("---")
            st.subheader("✅ Final Report")
            
            verdict = results["final_verdict"]
            decision = verdict.get("decision", "N/A")
            color = {"True": "green", "False": "red", "Misleading": "orange", "Unverifiable": "blue"}.get(decision, "gray")

            st.markdown(f"### Decision: <span style='color:{color};'>{decision}</span>", unsafe_allow_html=True)
            
            # Display fake score with a progress bar
            fake_score = verdict.get("fake_score", 0)
            st.progress(fake_score, text=f"Confidence Score (Likely Fake): {fake_score}%")
            
            st.info(f"**Reasoning:**\n{verdict.get('reasoning', 'No reasoning provided.')}")
            
            st.write(f"*Analysis completed in {end_time - start_time:.2f} seconds.*")

            # --- Display sources in an expander ---
            with st.expander("📚 View Evidence Sources"):
                st.write("**Web Search Results:**")
                if results["web_results"]:
                    for doc in results["web_results"]:
                        st.markdown(f"- **{doc.metadata.get('title', 'No Title')}**: [Link]({doc.metadata.get('url', '#')})")
                else:
                    st.write("No web sources were found.")

                st.write("**Google Fact-Check API Results:**")
                if results["fact_check_api"]:
                    for claim in results["fact_check_api"][:3]: # Show top 3
                        review = claim['claimReview'][0]
                        st.markdown(f"- **Claim:** {claim.get('text', 'N/A')}")
                        st.markdown(f"  - **Publisher:** {review.get('publisher', {}).get('name', 'N/A')}")
                        st.markdown(f"  - **Rating:** {review.get('textualRating', 'N/A')}")

                else:
                    st.write("No matching claims found in the Google Fact-Check database.")

        else:
            st.error("No text could be extracted from the provided input. Please try a different source.")
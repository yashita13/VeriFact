import os
import sys
import json
from dotenv import load_dotenv
import google.generativeai as genai
from newspaper import Article, Config 
from PIL import Image
import pytesseract
import whisper
from moviepy import VideoFileClip


pytesseract.pytesseract.tesseract_cmd = r'D:\Tesseract-OCR\tesseract.exe'
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("Error: GOOGLE_API_KEY not found. Please set it in the .env file.")
    sys.exit(1)
genai.configure(api_key=api_key)



def get_text_from_url(url):
    """Extracts the main article text from a URL."""
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

def get_text_from_image(image_path):
    """Extracts text from an image using OCR."""
    try:
        print("🖼️ Extracting text from image...")
        text = pytesseract.image_to_string(Image.open(image_path))
        print("✅ Text extracted successfully.")
        return text
    except Exception as e:
        print(f"❌ Error extracting from image: {e}")
        return None

def get_text_from_media(media_path):
    """Transcribes text from an audio or video file using Whisper."""
    try:
        print("🎤 Transcribing media file...")
        if media_path.endswith(('.mp4', '.mov', '.avi')):
            print("📹 Video file detected. Extracting audio...")
            video = VideoFileClip(media_path)
            audio_path = "temp_audio.wav"
            video.audio.write_audiofile(audio_path, codec='pcm_s16le')
            media_path = audio_path
        
        model = whisper.load_model("base")
        result = model.transcribe(media_path)
        
        if os.path.exists("temp_audio.wav"):
            os.remove("temp_audio.wav")
            
        print("✅ Transcription complete.")
        return result["text"]
    except Exception as e:
        print(f"❌ Error transcribing media: {e}")
        return None



def generate_headline(news_text):
    """Summarizes text into a concise, fact-based headline using Gemini."""
    if not news_text or len(news_text.strip()) < 50:
        print("⚠️ Text too short for summarization, skipping.")
        return news_text
        
    print("✍️ Generating headline...")
    
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    prompt = f"""
    Analyze the following news text and summarize it into a single, neutral, fact-based headline that represents the core claim being made. Remove any promotional language or opinions.

    Text: \"\"\"
    {news_text}
    \"\"\"

    Headline:
    """
    try:
        response = model.generate_content(prompt)
        headline = response.text.strip()
        print(f"Generated Headline: {headline}")
        return headline
    except Exception as e:
        print(f"❌ Error generating headline: {e}")
        return None



def fact_check_headline(headline):
    """Fact-checks a headline using Gemini and returns a JSON object."""
    print("🕵️ Fact-checking headline...")
    
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    
    prompt = f"""
    You are a meticulous fact-checker. Your task is to verify the following news headline.
    1. Search for information from multiple reputable and neutral sources.
    2. Analyze the evidence you find.
    3. Determine a verdict: "True", "False", "Misleading", or "Unverifiable".
    4. Provide a brief, one-paragraph explanation for your conclusion, citing key sources.
    5. Return the result as a single JSON object with two keys: "verdict" and "explanation".

    Headline to Fact-Check: "{headline}"
    """
    
    try:
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        result = json.loads(cleaned_response)
        print("✅ Fact-check complete.")
        return result
    except Exception as e:
        print(f"❌ Error during fact-checking: {e}")
        return {"verdict": "Error", "explanation": f"Failed to get a valid fact-check response. Details: {e}"}



def analyze_news(input_source, input_type):
    """Main function to run the full fake news detection pipeline."""
    raw_text = ""
    if input_type == 'url':
        raw_text = get_text_from_url(input_source)
    elif input_type == 'text':
        raw_text = input_source
    elif input_type == 'image':
        raw_text = get_text_from_image(input_source)
    elif input_type == 'media':
        raw_text = get_text_from_media(input_source)
    else:
        print("❌ Invalid input type.")
        return

    if not raw_text or not raw_text.strip():
        print("❌ Could not extract any text from the source. Aborting.")
        return

    headline = generate_headline(raw_text)
    if not headline:
        print("❌ Failed to generate headline. Aborting.")
        return

    fact_check_result = fact_check_headline(headline)

    print("\n" + "="*50)
    print("🔎 FINAL REPORT")
    print("="*50)
    print(f"Source: {input_source}")
    print(f"Claim/Headline: {headline}")
    print(f"Verdict: {fact_check_result.get('verdict', 'N/A')}")
    print(f"Explanation: {fact_check_result.get('explanation', 'N/A')}")
    print("="*50 + "\n")


if __name__ == '__main__':
    
    
   
    # analyze_news("https://www.bbc.com/news/live/cz93ve1p952t", "url")

   
    #analyze_news("images/Screenshot 2025-08-22 000043.png", "image")

   
    analyze_news("videos/Standing Firmly With India Against Trump s Tariffs, Says China _ India China Relations _ News18.mp3", "media")
    
   
    # text_input = """
    # A stunning new study published by the Institute of Feline Aeronautics has conclusively proven
    # that domestic cats can achieve supersonic speeds using purr-based propulsion. The lead scientist, 
    # Dr. Alistair Whiskerton, claims this changes everything we know about physics.
    # """
    # analyze_news(text_input, "text")
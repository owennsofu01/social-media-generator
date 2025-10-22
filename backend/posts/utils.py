import os
import traceback
import google.generativeai as genai

# ✅ Try Whisper fallback for local use
def transcribe_audio(voice_path):
    """
    Converts an audio file to text using Google Cloud Speech-to-Text.
    Falls back to Whisper if Google is not configured or fails.
    """
    try:
        # 🔹 Try Google Cloud Speech first
        if os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            from google.cloud import speech
            client = speech.SpeechClient()

            with open(voice_path, "rb") as audio_file:
                content = audio_file.read()

            audio = speech.RecognitionAudio(content=content)
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
                sample_rate_hertz=48000,
                language_code="en-US",
            )

            response = client.recognize(config=config, audio=audio)
            if response.results:
                return response.results[0].alternatives[0].transcript

        # 🔹 Fallback to Whisper (offline)
        import whisper
        model = whisper.load_model("base")
        result = model.transcribe(voice_path)
        return result["text"]

    except Exception as e:
        print("❌ Transcription error:", e)
        print(traceback.format_exc())
        return None


def generate_marketing_post(user_text=None, image_path=None, voice_path=None):
    """
    Generates an AI-powered social media marketing post using Gemini.
    Supports text, image, and voice input.
    """
    try:
        # ✅ Step 1: Combine user text
        combined_text = user_text.strip() if user_text else ""
        if not combined_text and not image_path:
            raise ValueError("Please provide text, image, or voice input.")

        # ✅ Step 2: Create Gemini model
        model = genai.GenerativeModel(model_name="gemini-2.0-flash")

        # ✅ Step 3: Dynamic prompt
        prompt = f"""
        You are a professional social media marketer.
        Create one single highly engaging post based on this input:

        "{combined_text or 'Use the attached image or voice as context to inspire the post.'}"

        Guidelines:
        - Hook the audience immediately
        - Include emojis where appropriate
        - Add trending hashtags relevant to the content
        - Use persuasive and concise wording
        - Make it ready to post on Instagram, Twitter, Facebook, Threads
        - Do not give multiple options, only the best single post
        - The post should grab attention and encourage interaction
        """

        contents = [prompt]

        # ✅ Attach image bytes if provided
        if image_path and os.path.exists(image_path):
            with open(image_path, "rb") as f:
                contents.append({"mime_type": "image/jpeg", "data": f.read()})

        # ✅ Attach voice bytes if provided
        if voice_path and os.path.exists(voice_path):
            with open(voice_path, "rb") as f:
                contents.append({"mime_type": "audio/webm", "data": f.read()})

        # ✅ Step 4: Generate post
        response = model.generate_content(contents)

        post_text = getattr(response, "text", "").strip()
        if not post_text and hasattr(response, "candidates"):
            post_text = response.candidates[0].content.parts[0].text.strip()

        if not post_text:
            raise ValueError("No text returned from Gemini API")

        # ✅ Add emoji flair if missing
        if not any(char in post_text for char in "😀😃😄😁😆🔥✨🎉💥"):
            post_text = "🔥 " + post_text + " ✨"

        return {"post": post_text}

    except Exception as e:
        print("❌ Gemini generation error:", e)
        return {"error": str(e)}

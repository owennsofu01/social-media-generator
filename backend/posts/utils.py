import os
import traceback
import google.generativeai as genai
import base64
import openai  # for image generation

def transcribe_audio(voice_path):
    try:
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

        import whisper
        model = whisper.load_model("base")
        result = model.transcribe(voice_path)
        return result["text"]

    except Exception as e:
        print("❌ Transcription error:", e)
        print(traceback.format_exc())
        return None


def generate_social_post(user_text=None, image_path=None, voice_path=None,
                         post_type="marketing", generate_image=False):
    """
    Generates an AI-powered social media post (marketing or personal brand) using Gemini for text
    and OpenAI v1 Images API for optional image generation.
    """
    try:
        if not user_text and not image_path and not voice_path:
            raise ValueError("Please provide text, image, or voice input.")

        # Combine text
        combined_text = user_text.strip() if user_text else ""
        if voice_path:
            voice_text = transcribe_audio(voice_path)
            combined_text += " " + (voice_text or "")

        # Gemini model (text generation)
        model = genai.GenerativeModel(model_name="gemini-2.0-flash")

        post_type_prompt = (
            "You are a professional personal brand strategist."
            if post_type == "personal_brand"
            else "You are a professional social media marketer."
        )

        prompt = f"""
        {post_type_prompt}
        Create one single highly engaging post based on this input:

        "{combined_text or 'Use the attached image or voice as context to inspire the post.'}"

        Guidelines:
        - Hook the audience immediately
        - Include emojis where appropriate
        - Add trending hashtags relevant to the content
        - Use persuasive and concise wording
        - Make it ready to post on Instagram, Twitter, Facebook, Threads
        - Do not give multiple options, only the best single post
        - Encourage engagement and interaction
        """

        contents = [prompt]

        # Attach image/voice if provided
        if image_path and os.path.exists(image_path):
            with open(image_path, "rb") as f:
                contents.append({"mime_type": "image/jpeg", "data": f.read()})
        if voice_path and os.path.exists(voice_path):
            with open(voice_path, "rb") as f:
                contents.append({"mime_type": "audio/webm", "data": f.read()})

        response = model.generate_content(contents)
        post_text = getattr(response, "text", "").strip()
        if not post_text and hasattr(response, "candidates"):
            post_text = response.candidates[0].content.parts[0].text.strip()
        if not post_text:
            raise ValueError("No text returned from Gemini API")

        # Remove unwanted asterisks
        post_text = post_text.replace("*", "")

        # Add emojis if missing
        if not any(char in post_text for char in "😀😃😄😁😆🔥✨🎉💥"):
            post_text = "🔥 " + post_text + " ✨"

        result = {"post": post_text}

        # ✅ Optional: generate image via new OpenAI Images API
        if generate_image:
            openai.api_key = os.getenv("OPENAI_API_KEY")
            image_resp = openai.images.generate(
                model="gpt-image-1",
                prompt=post_text,
                size="1024x1024",
                n=1
            )
            if image_resp and "data" in image_resp:
                img_bytes = base64.b64decode(image_resp["data"][0]["b64_json"])
                result["image_bytes"] = img_bytes

        return result

    except Exception as e:
        print("❌ Gemini generation error:", e)
        return {"error": str(e)}

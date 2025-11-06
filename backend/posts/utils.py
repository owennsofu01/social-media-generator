import os
import traceback
import google.generativeai as genai
import base64
import openai  # for image generation


def transcribe_audio(voice_path):
    """Handles voice transcription using Google Speech-to-Text or Whisper."""
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
                         post_type="marketing", generate_image=False,
                         tone="default", platform="general"):
    """
    Generates an AI-powered social media post using Gemini for text
    and OpenAI Images API for optional image generation.
    Supports tone & platform-specific formatting.
    """
    try:
        if not user_text and not image_path and not voice_path:
            raise ValueError("Please provide text, image, or voice input.")

        # Combine text + voice
        combined_text = user_text.strip() if user_text else ""
        if voice_path:
            voice_text = transcribe_audio(voice_path)
            combined_text += " " + (voice_text or "")

        # Define tone styles
        tone_descriptions = {
            "professional": "Use a confident, expert tone that builds trust.",
            "funny": "Use humor, puns, or relatable jokes to engage the reader.",
            "motivational": "Inspire and energize the reader with positivity.",
            "formal": "Maintain a serious, structured, and respectful tone.",
            "casual": "Write as if chatting with a friend — friendly and relaxed.",
            "default": ""
        }

        # Define platform styles
        platform_styles = {
            "instagram": "Use emojis, short lines, and relevant hashtags. Make it visually appealing and conversational.",
            "linkedin": "Use a professional, insightful tone with structured paragraphs. Avoid excessive emojis.",
            "twitter": "Keep it concise and witty, under 280 characters. Include hashtags if relevant.",
            "facebook": "Friendly and conversational. Suitable for general audiences. Use emojis moderately.",
            "tiktok": "Trendy and fun. Focus on short, viral-style hooks and use popular hashtags.",
            "general": "Generic and engaging for any platform."
        }

        tone_prompt = tone_descriptions.get(tone, "")
        platform_prompt = platform_styles.get(platform, "")

        # Post type guidance
        post_type_prompt = (
            "You are a personal brand strategist helping professionals grow their audience."
            if post_type == "personal_brand"
            else "You are a marketing strategist creating viral brand content."
        )

        # Combine prompt
        prompt = f"""
        {post_type_prompt}

        Create one single {tone} post optimized for {platform}.
        Topic: "{combined_text or 'Use the image or voice input as context.'}"

        Guidelines:
        - {tone_prompt}
        - {platform_prompt}
        - Hook the audience immediately in the first line
        - Include emojis where appropriate (avoid on LinkedIn)
        - Add trending and relevant hashtags
        - Keep the tone consistent and engaging
        - Make it ready to post directly
        - Do not give multiple options, only the best single post
        """

        # Send prompt to Gemini
        model = genai.GenerativeModel(model_name="gemini-2.0-flash")
        contents = [prompt]

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

        # Clean & polish
        post_text = post_text.replace("*", "").strip()
        if not any(emoji in post_text for emoji in "😀😃😄😁😆🔥✨🎉💥"):
            post_text = "🔥 " + post_text + " ✨"

        result = {"post": post_text}

        # ✅ Optional: generate image via OpenAI API
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
        print(traceback.format_exc())
        return {"error": str(e)}

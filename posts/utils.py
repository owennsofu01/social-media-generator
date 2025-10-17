import os
from google.generativeai import GenerativeModel

def generate_marketing_post(user_text, image_path=None, voice_path=None):
    try:
        model = GenerativeModel(model_name="gemini-2.0-flash")
        prompt = f"""
        You are a professional social media marketer.
        Create one single highly engaging post based on this input:

        "{user_text}"

        Guidelines:
        - Hook the audience immediately
        - Include emojis where appropriate
        - Add trending hashtags relevant to the content
        - Use persuasive and concise wording
        - Make it ready to post on Instagram, Twitter, Facebook, Threads
        - Do not give multiple options, only the best single post
        - Consider image or voice context if provided
        - The post should grab attention and encourage interaction
        """
        contents = [prompt]

        if image_path:
            contents.append({
                "mime_type": f"image/{image_path.split('.')[-1]}",
                "data": open(image_path, "rb").read()
            })

        if voice_path:
            contents.append({
                "mime_type": "audio/webm",
                "data": open(voice_path, "rb").read()
            })

        response = model.generate_content(contents)
        post_text = response.text.strip()

        if not any(char in post_text for char in "😀😃😄😁😆🔥✨🎉💥"):
            post_text = "🔥 " + post_text + " ✨"

        return {"post": post_text}

    except Exception as e:
        return {"error": str(e)}

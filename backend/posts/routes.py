import os
from flask import Blueprint, request, jsonify, url_for
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, ALLOWED_IMAGE_EXTENSIONS, ALLOWED_AUDIO_EXTENSIONS
from posts.utils import generate_marketing_post, transcribe_audio

posts_bp = Blueprint("posts", __name__)

@posts_bp.route("/generate", methods=["POST"])
def generate_post():
    text = request.form.get("text", "").strip()
    image = request.files.get("image")
    voice = request.files.get("voice")

    if not text and not voice:
        return jsonify({"error": "Provide text or voice"}), 400

    image_path, voice_path = None, None

    try:
        # ✅ Save uploaded image
        if image and image.filename.split(".")[-1].lower() in ALLOWED_IMAGE_EXTENSIONS:
            filename = secure_filename(image.filename)
            image_path = os.path.join(UPLOAD_FOLDER, filename)
            image.save(image_path)

        # ✅ Save uploaded voice
        if voice and voice.filename.split(".")[-1].lower() in ALLOWED_AUDIO_EXTENSIONS:
            filename = secure_filename(voice.filename)
            voice_path = os.path.join(UPLOAD_FOLDER, filename)
            voice.save(voice_path)

            # 🔹 Transcribe voice (Google or Whisper fallback)
            transcribed_text = transcribe_audio(voice_path)
            if transcribed_text:
                text = f"{text}\n\n(Voice input: {transcribed_text})" if text else transcribed_text

        # ✅ Generate AI marketing post
        result = generate_marketing_post(text, image_path, voice_path)

        image_url = url_for('uploads', filename=os.path.basename(image_path)) if image_path else None
        voice_url = url_for('uploads', filename=os.path.basename(voice_path)) if voice_path else None

        # ✅ Clean up uploaded files
        if image_path and os.path.exists(image_path):
            os.remove(image_path)
        if voice_path and os.path.exists(voice_path):
            os.remove(voice_path)

        return jsonify({
            "post": result.get("post"),
            "image_url": image_url,
            "voice_url": voice_url
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

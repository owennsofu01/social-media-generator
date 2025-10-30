import os
import uuid
from flask import Blueprint, request, jsonify, url_for
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, ALLOWED_IMAGE_EXTENSIONS, ALLOWED_AUDIO_EXTENSIONS
from posts.utils import generate_social_post, transcribe_audio

posts_bp = Blueprint("posts", __name__)

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def save_uploaded_file(file, allowed_extensions):
    """Save an uploaded file and return its path."""
    if file and file.filename.split(".")[-1].lower() in allowed_extensions:
        filename = secure_filename(file.filename)
        path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(path)
        return path
    return None

@posts_bp.route("/generate", methods=["POST"])
def generate_post():
    text = request.form.get("text", "").strip()
    post_type = request.form.get("type", "marketing")  # "marketing" or "personal_brand"
    generate_image_flag = request.form.get("generate_image", "false").lower() == "true"

    # Handle uploaded files
    image_file = request.files.get("image")
    voice_file = request.files.get("voice")
    image_path = save_uploaded_file(image_file, ALLOWED_IMAGE_EXTENSIONS)
    voice_path = save_uploaded_file(voice_file, ALLOWED_AUDIO_EXTENSIONS)

    # Transcribe voice if provided
    if voice_path:
        transcribed_text = transcribe_audio(voice_path)
        if transcribed_text:
            text = f"{text}\n\n(Voice input: {transcribed_text})" if text else transcribed_text

    if not text and not image_path and not voice_path:
        return jsonify({"error": "Provide text, voice, or image input"}), 400

    try:
        # Generate AI post (text + optional image)
        result = generate_social_post(
            user_text=text,
            image_path=image_path,
            voice_path=voice_path,
            post_type=post_type,
            generate_image=generate_image_flag
        )

        # Save generated image if returned
        generated_image_url = None
        if generate_image_flag and result.get("image_bytes"):
            gen_image_filename = f"generated_{uuid.uuid4().hex}.jpg"
            gen_image_path = os.path.join(UPLOAD_FOLDER, gen_image_filename)
            with open(gen_image_path, "wb") as f:
                f.write(result["image_bytes"])
            generated_image_url = url_for("uploads", filename=gen_image_filename)

        # Build voice URL before cleanup
        voice_url = url_for('uploads', filename=os.path.basename(voice_path)) if voice_path else None

        # Cleanup uploaded files
        for path in [image_path, voice_path]:
            if path and os.path.exists(path):
                os.remove(path)

        return jsonify({
            "post": result.get("post"),
            "image_url": generated_image_url,
            "voice_url": voice_url
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

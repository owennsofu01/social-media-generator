from flask import Blueprint, request, jsonify
from posts.utils import generate_marketing_post
from db import get_db_connection
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, ALLOWED_IMAGE_EXTENSIONS, ALLOWED_AUDIO_EXTENSIONS
import os
from datetime import datetime

posts_bp = Blueprint("posts", __name__)

@posts_bp.route("/generate", methods=["POST"])
def generate_post():
    text = request.form.get("text", "").strip()
    image = request.files.get("image")
    voice = request.files.get("voice")

    if not text and not voice:
        return jsonify({"error": "Provide text or voice"}), 400

    image_path, voice_path = None, None
    if image and image.filename.split(".")[-1].lower() in ALLOWED_IMAGE_EXTENSIONS:
        image_path = os.path.join(UPLOAD_FOLDER, secure_filename(image.filename))
        image.save(image_path)
    if voice and voice.filename.split(".")[-1].lower() in ALLOWED_AUDIO_EXTENSIONS:
        voice_path = os.path.join(UPLOAD_FOLDER, secure_filename(voice.filename))
        voice.save(voice_path)

    result = generate_marketing_post(text, image_path, voice_path)

    # Cleanup
    if image_path and os.path.exists(image_path):
        os.remove(image_path)
    if voice_path and os.path.exists(voice_path):
        os.remove(voice_path)

    return jsonify(result)

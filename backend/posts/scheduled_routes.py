import os
from flask import Blueprint, request, jsonify, url_for
from firebase_init import db
from datetime import datetime
from dateutil import parser
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, ALLOWED_IMAGE_EXTENSIONS, ALLOWED_AUDIO_EXTENSIONS
from posts.utils import generate_social_post, transcribe_audio

scheduled_bp = Blueprint("scheduled", __name__)


def save_uploaded_file(file, allowed_extensions):
    """Save uploaded file and return its path."""
    if file and file.filename.split(".")[-1].lower() in allowed_extensions:
        filename = secure_filename(file.filename)
        path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(path)
        return path
    return None


@scheduled_bp.route("/schedule", methods=["POST"])
def schedule_post():
    data = request.form.to_dict()
    user_id = data.get("user_id")
    text = data.get("text", "").strip()
    post_type = data.get("type", "marketing")  # marketing or personal_brand
    generate_image_flag = data.get("generate_image", "false").lower() == "true"
    scheduled_time = data.get("scheduled_time")
    platforms = data.get("platforms", "all")

    if not user_id:
        return jsonify({"error": "User not logged in"}), 401
    if not scheduled_time:
        return jsonify({"error": "scheduled_time is required"}), 400

    # Validate scheduled time
    try:
        scheduled_dt = parser.isoparse(scheduled_time)
        if scheduled_dt < datetime.utcnow():
            return jsonify({"error": "Scheduled time must be in the future"}), 400
    except Exception:
        return jsonify({"error": "Invalid scheduled_time format"}), 400

    # Handle uploaded files
    image_path = save_uploaded_file(request.files.get("image"), ALLOWED_IMAGE_EXTENSIONS)
    voice_path = save_uploaded_file(request.files.get("voice"), ALLOWED_AUDIO_EXTENSIONS)

    # Transcribe voice if provided
    if voice_path:
        transcribed_text = transcribe_audio(voice_path)
        if transcribed_text:
            text = f"{text}\n\n(Voice input: {transcribed_text})" if text else transcribed_text

    try:
        # Generate AI post if text is provided or empty
        result = generate_social_post(
            user_text=text,
            image_path=image_path,
            voice_path=voice_path,
            post_type=post_type,
            generate_image=generate_image_flag
        )

        # Handle generated AI image
        generated_image_url = None
        if generate_image_flag and result.get("image_bytes"):
            gen_image_filename = f"gen_{datetime.utcnow().timestamp()}.jpg"
            gen_image_path = os.path.join(UPLOAD_FOLDER, gen_image_filename)
            with open(gen_image_path, "wb") as f:
                f.write(result["image_bytes"])
            generated_image_url = url_for("uploads", filename=gen_image_filename)

        # Save post to Firebase
        new_post_ref = db.collection("scheduled_posts").document()
        new_post_ref.set({
            "user_id": user_id,
            "content": result.get("post"),
            "scheduled_time": scheduled_time,
            "platforms": platforms,
            "image_url": generated_image_url,
            "voice_url": url_for("uploads", filename=os.path.basename(voice_path)) if voice_path else None,
            "created_at": datetime.utcnow().isoformat(),
            "post_type": post_type
        })

        # Cleanup uploaded files
        for path in [image_path, voice_path]:
            if path and os.path.exists(path):
                os.remove(path)

        return jsonify({
            "success": "Post scheduled successfully",
            "post_id": new_post_ref.id,
            "post": result.get("post"),
            "generated_image_url": generated_image_url
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@scheduled_bp.route("/scheduled_posts", methods=["GET"])
def get_scheduled_posts():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 401

    try:
        posts_query = db.collection("scheduled_posts").where("user_id", "==", user_id).stream()
        posts = [{"id": post.id, **post.to_dict()} for post in posts_query]
        posts.sort(key=lambda x: x["scheduled_time"])
        return jsonify(posts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@scheduled_bp.route("/scheduled_posts", methods=["DELETE"])
def delete_scheduled_post():
    data = request.get_json()
    post_id = data.get("id")
    if not post_id:
        return jsonify({"error": "Post ID is required"}), 400

    try:
        doc_ref = db.collection("scheduled_posts").document(post_id)
        if not doc_ref.get().exists:
            return jsonify({"error": "Post not found"}), 404

        doc_ref.delete()
        return jsonify({"success": "Post deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

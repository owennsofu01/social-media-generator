from flask import Blueprint, request, jsonify
from firebase_init import db
from datetime import datetime

scheduled_bp = Blueprint("scheduled", __name__)

# Schedule a new post
@scheduled_bp.route("/schedule", methods=["POST"])
def schedule_post():
    data = request.get_json()
    user_id = data.get("user_id")
    content = data.get("content")
    scheduled_time = data.get("scheduled_time")
    platforms = data.get("platforms", "all")

    if not user_id:
        return jsonify({"error": "User not logged in"}), 401
    if not content or not scheduled_time:
        return jsonify({"error": "Content and scheduled_time are required"}), 400

    try:
        new_post_ref = db.collection("scheduled_posts").document()
        new_post_ref.set({
            "user_id": user_id,
            "content": content,
            "scheduled_time": scheduled_time,
            "platforms": platforms,
            "created_at": datetime.utcnow().isoformat()
        })
        return jsonify({"success": "Post scheduled successfully", "post_id": new_post_ref.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get all scheduled posts for a user
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


# Delete a scheduled post
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

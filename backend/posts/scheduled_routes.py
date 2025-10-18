# posts/scheduled_routes.py
from flask import Blueprint, request, jsonify
from db import get_db_connection
from datetime import datetime

scheduled_bp = Blueprint("scheduled", __name__)

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

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO scheduled_posts (user_id, content, scheduled_time, platforms, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, (user_id, content, scheduled_time, platforms, datetime.now().isoformat()))
    conn.commit()
    conn.close()
    return jsonify({"success": "Post scheduled successfully"})


@scheduled_bp.route("/scheduled_posts", methods=["GET"])
def get_scheduled_posts():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, content, scheduled_time, platforms, created_at
        FROM scheduled_posts
        WHERE user_id=?
        ORDER BY scheduled_time ASC
    """, (user_id,))
    posts = cursor.fetchall()
    conn.close()

    result = [{"id": p["id"], "content": p["content"], "scheduled_time": p["scheduled_time"],
               "platforms": p["platforms"], "created_at": p["created_at"]} for p in posts]
    return jsonify(result)

@scheduled_bp.route("/scheduled_posts", methods=["DELETE"])
def delete_scheduled_post():
    data = request.get_json()
    post_id = data.get("id")

    if not post_id:
        return jsonify({"error": "Post ID is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM scheduled_posts WHERE id=?", (post_id,))
    conn.commit()
    deleted = cursor.rowcount  # number of rows deleted
    conn.close()

    if deleted:
        return jsonify({"success": "Post deleted successfully"})
    else:
        return jsonify({"error": "Post not found"}), 404

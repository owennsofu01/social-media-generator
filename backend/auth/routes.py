from flask import Blueprint, request, jsonify
from db import get_db_connection
from auth.utils import hash_password
from datetime import datetime

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    hashed_password = hash_password(password)
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (username, email, password, created_at)
            VALUES (?, ?, ?, ?)
        """, (username, email, hashed_password, datetime.now().isoformat()))
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return jsonify({"success": "User registered successfully", "user_id": user_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    hashed_password = hash_password(password)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username FROM users WHERE email=? AND password=?", (email, hashed_password))
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({"success": "Login successful", "user_id": user["id"], "username": user["username"]})
    return jsonify({"error": "Invalid credentials"}), 401

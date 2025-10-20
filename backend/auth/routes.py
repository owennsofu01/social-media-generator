from flask import Blueprint, request, jsonify
from firebase_init import auth, db
from datetime import datetime

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")  # optional for social login
    id_token = data.get("idToken")   # token from Firebase client

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        uid = None

        if id_token:
            # Social login: verify token
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token["uid"]

            # Check if user exists in Firestore
            user_doc = db.collection("users").document(uid).get()
            if user_doc.exists:
                return jsonify({"error": "User already exists"}), 400
        else:
            # Email/password registration
            if not password:
                return jsonify({"error": "Password is required"}), 400

            # Check if email already exists in Firebase Auth
            try:
                existing_user = auth.get_user_by_email(email)
                if existing_user:
                    return jsonify({"error": "User already exists"}), 400
            except auth.UserNotFoundError:
                pass  # Email not in use, continue

            # Create new user
            user_record = auth.create_user(email=email, password=password)
            uid = user_record.uid

        # Store user info in Firestore (for new users only)
        user_doc = db.collection("users").document(uid).get()
        if not user_doc.exists:
            db.collection("users").document(uid).set({
                "email": email,
                "created_at": datetime.utcnow().isoformat()
            })

        return jsonify({"success": "User registered successfully", "uid": uid}), 201

    except Exception as e:
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500

import os
import json
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# --- Load environment variables ---
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# --- Initialize Flask ---
app = Flask(__name__)
CORS(app)

# --- Initialize Firebase (Firestore only) ---
firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")

if firebase_credentials and firebase_credentials.strip().startswith("{"):
    # ✅ Loaded from environment variable (Render)
    cred_dict = json.loads(firebase_credentials)
    cred = credentials.Certificate(cred_dict)
else:
    # ✅ Local fallback using a file
    cred_path = firebase_credentials or "firebase_key.json"
    if not os.path.exists(cred_path):
        raise FileNotFoundError(f"Firebase credentials file not found: {cred_path}")
    cred = credentials.Certificate(cred_path)

# Initialize Firebase only once
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# Firestore client
db = firestore.client()

# --- Ensure uploads folder exists ---
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Register Blueprints ---
from auth.routes import auth_bp
from posts.routes import posts_bp
from posts.scheduled_routes import scheduled_bp

app.register_blueprint(auth_bp)
app.register_blueprint(posts_bp)
app.register_blueprint(scheduled_bp)

# --- Start Scheduler ---
import scheduler  # Auto-posting background job

# --- Root Endpoint ---
@app.route("/")
def index():
    return {"message": "🔥 SocialAI Backend (Firestore + Flask) is running!"}

# --- Run Flask server ---
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

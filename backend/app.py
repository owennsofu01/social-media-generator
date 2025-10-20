import os
import json
from flask import Flask
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

# --- Load environment variables ---
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# --- Initialize Flask ---
app = Flask(__name__)
CORS(app)

# --- Initialize Firebase using JSON content from environment variable ---
firebase_key_json = os.getenv("FIREBASE_KEY_JSON")

if firebase_key_json:
    cred_dict = json.loads(firebase_key_json)
    cred = credentials.Certificate(cred_dict)
else:
    # fallback to local file
    cred_path = "firebase_key.json"
    if not os.path.exists(cred_path):
        raise FileNotFoundError(f"Firebase credentials file not found: {cred_path}")
    cred = credentials.Certificate(cred_path)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

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
import scheduler

# --- Root Endpoint ---
@app.route("/")
def index():
    return {"message": "🔥 SocialAI Backend (Firestore + Flask) is running!"}

# --- Run Flask server ---
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

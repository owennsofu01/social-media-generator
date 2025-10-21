import os
import json
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# --------------------------
# Load local environment variables (for development)
# --------------------------
load_dotenv()  # Will load .env file locally

# --------------------------
# Required environment variables
# --------------------------
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS")

# --------------------------
# Initialize Firebase (Firestore)
# --------------------------
if not firebase_admin._apps:
    if FIREBASE_CREDENTIALS and FIREBASE_CREDENTIALS.strip().startswith("{"):
        # Load from environment variable (Render)
        cred_dict = json.loads(FIREBASE_CREDENTIALS)
        cred = credentials.Certificate(cred_dict)
    else:
        # Local fallback to file
        cred_path = FIREBASE_CREDENTIALS or "firebase_key.json"
        if not os.path.exists(cred_path):
            raise FileNotFoundError(f"Firebase credentials file not found: {cred_path}")
        cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# --------------------------
# Initialize Flask
# --------------------------
app = Flask(__name__)
CORS(app)

# --------------------------
# Ensure uploads folder exists
# --------------------------
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --------------------------
# Register Blueprints
# --------------------------
from auth.routes import auth_bp
from posts.routes import posts_bp
from posts.scheduled_routes import scheduled_bp

app.register_blueprint(auth_bp)
app.register_blueprint(posts_bp)
app.register_blueprint(scheduled_bp)

# --------------------------
# Start Scheduler (background jobs)
# --------------------------
import scheduler  # Auto-posting background job

# --------------------------
# Root endpoint
# --------------------------
@app.route("/")
def index():
    return {"message": "🔥 SocialAI Backend (Firestore + Flask) is running!"}

# --------------------------
# Run Flask
# --------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Render sets PORT
    app.run(host="0.0.0.0", port=port)

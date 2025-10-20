import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# --- Load environment variables ---
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# --- Initialize Flask ---
app = Flask(__name__)
CORS(app)

# --- Import Firebase (db is Firestore client) ---
from firebase_init import db

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

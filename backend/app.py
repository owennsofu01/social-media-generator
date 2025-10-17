import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from db import init_db

# --- Load environment variables ---
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# --- Initialize Flask ---
app = Flask(__name__)
CORS(app)

# --- Initialize Database ---
init_db()

# --- Ensure uploads folder exists ---
from config import UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Register Blueprints ---
from auth.routes import auth_bp
from posts.routes import posts_bp
from posts.scheduled_routes import scheduled_bp

app.register_blueprint(auth_bp)
app.register_blueprint(posts_bp)
app.register_blueprint(scheduled_bp)

# --- Start Scheduler ---
import scheduler  # This will run automatic posting in the background

# --- Run Flask server ---
if __name__ == "__main__":
   app.run(host="0.0.0.0", debug=True)


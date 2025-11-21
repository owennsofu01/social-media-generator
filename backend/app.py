import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# --------------------------
# Load environment variables (local dev)
# --------------------------
load_dotenv()

# --------------------------
# Required env variables
# --------------------------
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

# --------------------------
# Initialize Flask
# --------------------------
app = Flask(__name__)

# --- CORS FIX: Explicitly specify the front-end origin ---
# This tells the browser on netlify.app that it is allowed to talk to the
# render.com backend.
# --- CORS FIX: Explicitly specify the front-end origin ---
CORS(app, resources={r"/*": {"origins": [
    "https://owennsofu.com", 
    "https://www.owennsofu.com",
    "http://localhost:5173",   # ✅ Corrected for Vite
    "http://localhost:3000",
    "https://postgenza.com"  # (Optional: keep if you ever use CRA)
]}})


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
from payment.routes import payment_bp  # ✅ NEW

app.register_blueprint(auth_bp)
app.register_blueprint(posts_bp)
app.register_blueprint(scheduled_bp)
app.register_blueprint(payment_bp)  # ✅ NE

# --------------------------
# Start Scheduler (background jobs)
# --------------------------
import scheduler 

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
    port = int(os.environ.get("PORT", 5000)) 
    app.run(host="0.0.0.0", port=port)
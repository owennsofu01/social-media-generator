import os

# Database file
DB_FILE = os.path.join(os.getcwd(), "posts.db")

# Upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allowed file types
ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg"}
ALLOWED_AUDIO_EXTENSIONS = {"webm", "wav", "mp3"}

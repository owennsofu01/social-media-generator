import os
from firebase_admin import storage

def allowed_file(filename: str, allowed_exts: set) -> bool:
    """Check if uploaded file has an allowed extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_exts


def read_file_bytes(path: str) -> bytes:
    """Read a file and return bytes."""
    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")
    with open(path, "rb") as f:
        return f.read()


def upload_to_firebase(local_path: str, firebase_path: str) -> str:
    """
    Upload a local file to Firebase Storage and return its public URL.
    Assumes Firebase Admin SDK is initialized with storage bucket.
    """
    if not os.path.exists(local_path):
        raise FileNotFoundError(f"Cannot upload, file not found: {local_path}")

    bucket = storage.bucket()
    blob = bucket.blob(firebase_path)
    blob.upload_from_filename(local_path)
    blob.make_public()  # optional: make file publicly accessible
    return blob.public_url

import os

def allowed_file(filename: str, allowed_exts: set) -> bool:
    """Check if uploaded file has an allowed extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_exts

def read_file_bytes(path: str) -> bytes:
    """Read a file and return bytes."""
    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")
    with open(path, "rb") as f:
        return f.read()

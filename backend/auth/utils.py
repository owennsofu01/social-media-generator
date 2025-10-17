import hashlib

def hash_password(password: str) -> str:
    """Hash a password for storing in the database."""
    return hashlib.sha256(password.encode()).hexdigest()

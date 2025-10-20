import hashlib
from firebase_admin import auth

def hash_password(password: str) -> str:
    """Hash a password for storing in the database."""
    return hashlib.sha256(password.encode()).hexdigest()



def verify_token(id_token):
    """
    Verifies a Firebase ID token sent from the client.
    Returns the UID if valid, otherwise None.
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token["uid"]
        return uid
    except Exception:
        return None

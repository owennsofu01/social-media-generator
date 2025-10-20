import os
import json
import firebase_admin
from firebase_admin import credentials, firestore, auth

def initialize_firebase():
    """
    Initialize Firebase app using either:
    1. FIREBASE_KEY_JSON environment variable (preferred)
    2. Local firebase_key.json file (fallback)
    """
    firebase_key_json = os.getenv("FIREBASE_KEY_JSON")

    if firebase_key_json:
        # Use JSON content from environment variable
        try:
            cred_dict = json.loads(firebase_key_json)
        except json.JSONDecodeError:
            raise ValueError("FIREBASE_KEY_JSON environment variable is not valid JSON")
        cred = credentials.Certificate(cred_dict)
    else:
        # Fallback to local file
        cred_path = "firebase_key.json"
        if not os.path.exists(cred_path):
            raise FileNotFoundError(f"Firebase credentials file not found: {cred_path}")
        cred = credentials.Certificate(cred_path)

    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)

    # Return Firestore client for easy import
    return firestore.client()

# Initialize Firebase immediately on import
db = initialize_firebase()

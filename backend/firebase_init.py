import os
import json
import firebase_admin
from firebase_admin import credentials, firestore, auth

# Load Firebase credentials from environment variable or local file
FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS")

if not firebase_admin._apps:
    if FIREBASE_CREDENTIALS and FIREBASE_CREDENTIALS.strip().startswith("{"):
        # Production (Render)
        cred_dict = json.loads(FIREBASE_CREDENTIALS)
        cred = credentials.Certificate(cred_dict)
    else:
        # Local fallback
        cred_path = FIREBASE_CREDENTIALS or "firebase_key.json"
        if not os.path.exists(cred_path):
            raise FileNotFoundError(f"Firebase credentials file not found: {cred_path}")
        cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

# Export Firestore client and Auth instance
db = firestore.client()
auth_instance = auth

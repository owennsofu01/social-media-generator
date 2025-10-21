import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")

if firebase_credentials and firebase_credentials.strip().startswith("{"):
    # Loaded from environment variable (Render)
    cred_dict = json.loads(firebase_credentials)
    cred = credentials.Certificate(cred_dict)
else:
    # Local fallback
    cred_path = firebase_credentials or "firebase_key.json"
    if not os.path.exists(cred_path):
        raise FileNotFoundError(f"Firebase credentials file not found: {cred_path}")
    cred = credentials.Certificate(cred_path)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

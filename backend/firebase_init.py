import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")

if not firebase_admin._apps:
    if firebase_credentials and firebase_credentials.strip().startswith("{"):
        cred = credentials.Certificate(json.loads(firebase_credentials))
    else:
        cred_path = firebase_credentials or "firebase_key.json"
        if not os.path.exists(cred_path):
            raise FileNotFoundError(f"Firebase credentials file not found: {cred_path}")
        cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

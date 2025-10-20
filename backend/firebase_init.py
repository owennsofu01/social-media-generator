# firebase_init.py
import os
import json
import firebase_admin
from firebase_admin import credentials, auth, firestore

# Get Firebase credentials from environment variable (preferred) or fallback to local file
firebase_key_json = os.getenv("FIREBASE_KEY_JSON")

if firebase_key_json:
    # If environment variable is set, parse it as JSON
    cred_dict = json.loads(firebase_key_json)
    cred = credentials.Certificate(cred_dict)
else:
    # Fallback to local file
    cred_path = "firebase_key.json"
    if not os.path.exists(cred_path):
        raise FileNotFoundError(f"Firebase credentials file not found: {cred_path}")
    cred = credentials.Certificate(cred_path)

# Initialize Firebase app
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# Firestore client
db = firestore.client()

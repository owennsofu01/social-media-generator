# firebase_init.py
import os
import firebase_admin
from firebase_admin import credentials, auth, firestore

cred = credentials.Certificate(os.getenv("FIREBASE_KEY", "firebase_key.json"))

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()  # Firestore client

import json

with open("firebase_key.json", "r") as f:
    data = json.load(f)
    print(json.dumps(data))

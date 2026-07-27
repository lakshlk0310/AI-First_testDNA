import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "ai_first_dna")

client = None
db = None

try:
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=3000)
    db = client[DB_NAME]
    print(f"[Python MongoDB] Connected to MongoDB database '{DB_NAME}' at '{MONGODB_URI}'")
except Exception as e:
    print(f"[Python MongoDB Warning] Connection error: {e}")

def get_projects_collection():
    if db is not None:
        return db["projects"]
    return None

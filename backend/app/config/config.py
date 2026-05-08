import os
from dotenv import load_dotenv

# Explicitly load .env from the current directory
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '../../.env'))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    MONGO_URI = os.getenv('MONGO_URI')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt_secret_key')
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    
    RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID')
    RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')
    
    UPLOAD_FOLDER = 'uploads'
    
    if not MONGO_URI:
        print("CRITICAL: MONGO_URI not found in .env. Falling back to localhost.")
        MONGO_URI = 'mongodb://localhost:27017/clearnest'
    else:
        print(f"MongoDB URI loaded successfully (Starts with: {MONGO_URI[:15]}...)")

from flask import request
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt
from app.database.mongodb import mongo
from app.utils.responses import success_response, error_response
from app.extensions import bcrypt
from app.config.config import Config
import datetime
from bson import ObjectId
import jwt
from jwt import PyJWKClient
from jwt.exceptions import PyJWTError

GOOGLE_CERTS_URL = "https://www.googleapis.com/oauth2/v3/certs"

class AuthController:
    @staticmethod
    def register():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name')
        role = data.get('role', 'RESIDENT')
        society_code = data.get('society_code')
        flat_number = data.get('flat_number')
        
        if not email or not password:
            return error_response("Email and password are required")
            
        if mongo.db['users'].find_one({"email": email}):
            return error_response("User already exists")
            
        society_id = None
        if role != 'SUPER_ADMIN':
            if not society_code:
                return error_response("Society code is required for non-admin registration")
            
            society = mongo.db['societies'].find_one({"society_code": society_code.upper()})
            if not society:
                return error_response("Invalid society code")
            society_id = str(society['_id'])

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        user_id = mongo.db['users'].insert_one({
            "email": email,
            "password": hashed_password,
            "full_name": full_name,
            "role": role,
            "society_id": society_id,
            "flat_number": flat_number,
            "created_at": datetime.datetime.utcnow(),
            "is_verified": False
        }).inserted_id
        
        return success_response("Account created successfully", {"user_id": str(user_id)}, 201)

    @staticmethod
    def login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        user = mongo.db['users'].find_one({"email": email})
        
        if not user:
            return error_response("User not found", 404)
            
        if not user.get('password'):
            return error_response("This account is linked with Google. Please use Google Login.", 400)

        if bcrypt.check_password_hash(user['password'], password):
            # Create token with multi-tenant claims
            access_token = create_access_token(
                identity=str(user['_id']),
                additional_claims={
                    "role": user['role'],
                    "society_id": user.get('society_id')
                }
            )
            return success_response("Login successful", {
                "token": access_token,
                "user": {
                    "email": user['email'],
                    "role": user['role'],
                    "full_name": user['full_name'],
                    "society_id": user.get('society_id')
                }
            })
            
        return error_response("Invalid credentials", 401)

    @staticmethod
    def google_login():
        data = request.get_json()
        credential = data.get('credential')
        society_code = data.get('society_code') # Required for first-time login
        role = data.get('role', 'RESIDENT')
        flat_number = data.get('flat_number')

        if not Config.GOOGLE_CLIENT_ID or Config.GOOGLE_CLIENT_ID.startswith('your_'):
            return error_response("Google Client ID is not configured", 500)

        if not credential:
            return error_response("Google credential is required")

        try:
            jwks_client = PyJWKClient(GOOGLE_CERTS_URL)
            signing_key = jwks_client.get_signing_key_from_jwt(credential)
            google_profile = jwt.decode(
                credential,
                signing_key.key,
                algorithms=["RS256"],
                audience=Config.GOOGLE_CLIENT_ID,
                issuer=["accounts.google.com", "https://accounts.google.com"],
                leeway=300
            )
        except Exception as e:
            return error_response(f"Invalid Google credential: {str(e)}", 401)

        if not google_profile.get('email_verified'):
            return error_response("Google email is not verified", 401)

        google_id = google_profile.get('sub')
        email = google_profile.get('email')
        full_name = google_profile.get('name') or email

        if role not in ['RESIDENT', 'SOCIETY_ADMIN']:
            role = 'RESIDENT'
        
        user = mongo.db['users'].find_one({"email": email})
        
        if not user:
            # First time login with Google
            if not society_code:
                return error_response("Society code required for first-time registration", 400)
                
            society = mongo.db['societies'].find_one({"society_code": society_code.upper()})
            if not society:
                return error_response("Invalid society code")
                
            user_id = mongo.db['users'].insert_one({
                "email": email,
                "full_name": full_name,
                "google_id": google_id,
                "auth_provider": "google",
                "role": role,
                "society_id": str(society['_id']),
                "flat_number": flat_number,
                "created_at": datetime.datetime.utcnow(),
                "is_verified": True
            }).inserted_id
            user = mongo.db['users'].find_one({"_id": user_id})
        elif not user.get('google_id'):
            mongo.db['users'].update_one(
                {"_id": user['_id']},
                {"$set": {
                    "google_id": google_id,
                    "auth_provider": user.get('auth_provider', 'google'),
                    "is_verified": True
                }}
            )
            user = mongo.db['users'].find_one({"_id": user['_id']})

        access_token = create_access_token(
            identity=str(user['_id']),
            additional_claims={
                "role": user['role'],
                "society_id": user.get('society_id')
            }
        )
        return success_response("Google login successful", {
            "token": access_token,
            "user": {
                "email": user['email'],
                "role": user['role'],
                "full_name": user['full_name'],
                "society_id": user.get('society_id')
            }
        })

    @staticmethod
    def get_profile():
        user_id = get_jwt_identity()
        user = mongo.db['users'].find_one({"_id": ObjectId(user_id)})
        
        if not user:
            return error_response("User not found", 404)
            
        return success_response("Profile fetched", {
            "email": user['email'],
            "role": user['role'],
            "full_name": user['full_name'],
            "society_id": user.get('society_id')
        })

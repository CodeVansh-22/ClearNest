from flask import request
from app.database.mongodb import mongo
from app.utils.responses import success_response, error_response
import datetime
import uuid

class SocietyController:
    @staticmethod
    def register_society():
        print("DEBUG: Society Registration request received")
        data = request.get_json()
        print(f"DEBUG: Payload: {data}")
        name = data.get('society_name')
        city = data.get('city')
        address = data.get('address')
        total_flats = data.get('total_flats')
        admin_email = data.get('admin_email')
        
        if not all([name, city, admin_email]):
            return error_response("Missing required fields")
            
        # Check if society name already exists
        if mongo.db['societies'].find_one({"society_name": name}):
            return error_response("Society with this name already exists")
            
        # Generate unique society code
        society_code = str(uuid.uuid4())[:8].upper()
        
        society_id = mongo.db['societies'].insert_one({
            "society_name": name,
            "society_code": society_code,
            "city": city,
            "address": address,
            "total_flats": total_flats,
            "is_active": True,
            "subscription_plan": "Free Trial",
            "created_at": datetime.datetime.utcnow()
        }).inserted_id
        
        # Initialize Society Wallet
        mongo.db['society_wallets'].insert_one({
            "society_id": str(society_id),
            "balance": 0.0,
            "last_updated": datetime.datetime.utcnow()
        })
        
        return success_response("Society registered successfully", {
            "society_id": str(society_id),
            "society_code": society_code
        }, 201)

    @staticmethod
    def get_society_by_code(code):
        society = mongo.db['societies'].find_one({"society_code": code.upper()})
        if not society:
            return error_response("Invalid society code", 404)
            
        return success_response("Society found", {
            "society_id": str(society['_id']),
            "society_name": society['society_name']
        })

    @staticmethod
    def get_all_societies():
        societies = list(mongo.db['societies'].find())
        for s in societies:
            s['_id'] = str(s['_id'])
        return success_response("Societies fetched", societies)

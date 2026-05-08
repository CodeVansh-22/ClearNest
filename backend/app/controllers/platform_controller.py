from flask import request
from app.database.mongodb import mongo
from app.utils.responses import success_response, error_response
import datetime
from bson import ObjectId

class PlatformController:
    @staticmethod
    def get_platform_stats():
        # Only accessible by SUPER_ADMIN
        total_societies = mongo.db['societies'].count_documents({})
        active_societies = mongo.db['societies'].count_documents({"is_active": True})
        
        platform_wallet = mongo.db['platform_wallet'].find_one({})
        revenue = platform_wallet.get('total_commission', 0) if platform_wallet else 0
        
        return success_response("Platform stats fetched", {
            "total_societies": total_societies,
            "active_societies": active_societies,
            "platform_revenue": revenue,
            "monthly_growth": "+12%" # Placeholder
        })

    @staticmethod
    def process_transaction(society_id, amount, description, type="Maintenance"):
        # Commission Engine Logic
        COMMISSION_RATE = 0.02 # 2%
        
        commission = amount * COMMISSION_RATE
        society_share = amount - commission
        
        # 1. Record Transaction
        transaction_id = mongo.db['transactions'].insert_one({
            "society_id": str(society_id),
            "amount": amount,
            "commission": commission,
            "society_share": society_share,
            "description": description,
            "type": type,
            "status": "COMPLETED",
            "created_at": datetime.datetime.utcnow()
        }).inserted_id
        
        # 2. Update Society Wallet
        mongo.db['society_wallets'].update_one(
            {"society_id": str(society_id)},
            {"$inc": {"balance": society_share}, "$set": {"last_updated": datetime.datetime.utcnow()}},
            upsert=True
        )
        
        # 3. Update Platform Wallet (Revenue Tracking)
        mongo.db['platform_wallet'].update_one(
            {},
            {"$inc": {"total_commission": commission}, "$set": {"last_updated": datetime.datetime.utcnow()}},
            upsert=True
        )
        
        return str(transaction_id)

    @staticmethod
    def toggle_society_status(society_id):
        society = mongo.db['societies'].find_one({"_id": ObjectId(society_id)})
        if not society:
            return error_response("Society not found")
            
        new_status = not society.get('is_active', True)
        mongo.db['societies'].update_one(
            {"_id": ObjectId(society_id)},
            {"$set": {"is_active": new_status}}
        )
        
        return success_response(f"Society {'enabled' if new_status else 'disabled'} successfully")

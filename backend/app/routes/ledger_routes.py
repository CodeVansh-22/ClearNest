from flask import Blueprint, request
from app.database.mongodb import mongo
from app.utils.responses import success_response, error_response
from flask_jwt_extended import jwt_required, get_jwt
from app.middleware.role_middleware import committee_required
import datetime

ledger_bp = Blueprint('ledger', __name__)

@ledger_bp.route('', methods=['GET'])
@jwt_required()
def get_ledger():
    claims = get_jwt()
    society_id = claims.get('society_id')
    
    expenses = list(mongo.db['ledger'].find({"society_id": society_id}).sort("date", -1))
    for exp in expenses:
        exp['_id'] = str(exp['_id'])
    return success_response("Ledger fetched", expenses)

@ledger_bp.route('', methods=['POST'])
@committee_required
def add_transaction():
    data = request.get_json()
    claims = get_jwt()
    society_id = claims.get('society_id')
    
    transaction = {
        "description": data.get('description'),
        "amount": data.get('amount'),
        "type": data.get('type'), # Income / Expense
        "category": data.get('category'),
        "society_id": society_id,
        "date": datetime.datetime.utcnow()
    }
    
    trans_id = mongo.db['ledger'].insert_one(transaction).inserted_id
    return success_response("Transaction added", {"id": str(trans_id)}, 201)

@ledger_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    claims = get_jwt()
    society_id = claims.get('society_id')
    
    pipeline = [
        {"$match": {"society_id": society_id}},
        {"$group": {"_id": "$type", "total": {"$sum": "$amount"}}}
    ]
    results = list(mongo.db['ledger'].aggregate(pipeline))
    analytics = {res['_id']: res['total'] for res in results}
    return success_response("Analytics fetched", analytics)

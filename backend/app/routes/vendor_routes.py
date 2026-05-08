from flask import Blueprint, request
from app.database.mongodb import mongo
from app.utils.responses import success_response, error_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.middleware.auth_middleware import committee_required
import datetime

vendor_bp = Blueprint('vendors', __name__)

@vendor_bp.route('/bids', methods=['POST'])
@jwt_required()
def submit_bid():
    data = request.get_json()
    vendor_name = data.get('vendor_name')
    project_title = data.get('project_title')
    amount = data.get('amount')
    proposal_url = data.get('proposal_url')
    
    if not vendor_name or not amount:
        return error_response("Vendor name and amount are required")
        
    bid = {
        "vendor_name": vendor_name,
        "project_title": project_title,
        "amount": float(amount),
        "proposal_url": proposal_url,
        "status": "Submitted",
        "submitted_by": get_jwt_identity(),
        "created_at": datetime.datetime.utcnow()
    }
    
    bid_id = mongo.db['vendor_bids'].insert_one(bid).inserted_id
    return success_response("Bid submitted", {"id": str(bid_id)}, 201)

@vendor_bp.route('/bids', methods=['GET'])
@jwt_required()
@committee_required
def get_bids():
    bids = list(mongo.db['vendor_bids'].find().sort("created_at", -1))
    for b in bids:
        b['_id'] = str(b['_id'])
    return success_response("Bids fetched", bids)

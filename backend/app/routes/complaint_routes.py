from flask import Blueprint, request
from app.database.mongodb import mongo
from app.utils.responses import success_response, error_response
from flask_jwt_extended import jwt_required, get_jwt
import datetime
from bson import ObjectId

complaint_bp = Blueprint('complaints', __name__)

@complaint_bp.route('', methods=['GET'])
@jwt_required()
def get_complaints():
    claims = get_jwt()
    society_id = claims.get('society_id')
    
    if not society_id:
        return error_response("Society ID missing from token", 400)
        
    complaints = list(mongo.db['complaints'].find({"society_id": society_id}).sort("created_at", -1))
    for c in complaints:
        c['_id'] = str(c['_id'])
    return success_response("Complaints fetched", complaints)

@complaint_bp.route('', methods=['POST'])
@jwt_required()
def create_complaint():
    data = request.get_json()
    claims = get_jwt()
    society_id = claims.get('society_id')
    
    complaint = {
        "title": data.get('title'),
        "description": data.get('description'),
        "image_url": data.get('image_url'),
        "status": "Pending",
        "society_id": society_id,
        "created_by": claims.get('sub'),
        "created_at": datetime.datetime.utcnow()
    }
    
    c_id = mongo.db['complaints'].insert_one(complaint).inserted_id
    return success_response("Complaint created", {"id": str(c_id)}, 201)

@complaint_bp.route('/<id>', methods=['PATCH'])
@jwt_required()
def update_status(id):
    data = request.get_json()
    status = data.get('status')
    resolution = data.get('resolution')
    
    claims = get_jwt()
    society_id = claims.get('society_id')
    
    update_data = {}
    if status: update_data['status'] = status
    if resolution: update_data['resolution'] = resolution
    update_data['updated_at'] = datetime.datetime.utcnow()
    
    # Enforce society isolation
    result = mongo.db['complaints'].update_one(
        {"_id": ObjectId(id), "society_id": society_id}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        return error_response("Complaint not found or access denied", 404)
        
    return success_response("Complaint updated")

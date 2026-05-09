from flask import Blueprint, request
from app.database.mongodb import mongo
from app.utils.responses import success_response, error_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.middleware.auth_middleware import committee_required
from bson import ObjectId
import datetime

voting_bp = Blueprint('voting', __name__)

@voting_bp.route('/create', methods=['POST'])
@jwt_required()
@committee_required
def create_poll():
    data = request.get_json()
    question = data.get('question')
    options = data.get('options') # List of strings
    
    if not question or not options or not isinstance(options, list):
        return error_response("Question and a list of options are required")
        
    poll = {
        "question": question,
        "options": [{"text": opt, "votes": 0} for opt in options],
        "voters": [],
        "created_at": datetime.datetime.utcnow(),
        "created_by": get_jwt_identity()
    }
    
    p_id = mongo.db['polls'].insert_one(poll).inserted_id
    return success_response("Poll created", {"id": str(p_id)}, 201)

@voting_bp.route('/cast', methods=['POST'])
@jwt_required()
def cast_vote():
    data = request.get_json()
    poll_id = data.get('poll_id')
    option_index = data.get('option_index')
    user_id = get_jwt_identity()
    
    poll = mongo.db['polls'].find_one({"_id": ObjectId(poll_id)})
    if not poll:
        return error_response("Poll not found", 404)
        
    if user_id in poll.get('voters', []):
        return error_response("You have already voted in this poll", 403)
        
    # Update vote count and add voter to list
    mongo.db['polls'].update_one(
        {"_id": ObjectId(poll_id)},
        {
            "$inc": {f"options.{option_index}.votes": 1},
            "$push": {"voters": user_id}
        }
    )
    
    return success_response("Vote cast successfully")

@voting_bp.route('/results/<id>', methods=['GET'])
@jwt_required()
def get_results(id):
    poll = mongo.db['polls'].find_one({"_id": ObjectId(id)})
    if not poll:
        return error_response("Poll not found", 404)
        
    poll['_id'] = str(poll['_id'])
    return success_response("Results fetched", poll)

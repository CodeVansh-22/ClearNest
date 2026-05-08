from flask import Blueprint
from app.controllers.society_controller import SocietyController
from flask_jwt_extended import jwt_required

society_bp = Blueprint('societies', __name__)

@society_bp.route('/register', methods=['POST'])
def register_society():
    return SocietyController.register_society()

@society_bp.route('/verify-code/<code>', methods=['GET'])
def verify_code(code):
    return SocietyController.get_society_by_code(code)

@society_bp.route('', methods=['GET'])
@jwt_required()
def get_societies():
    # Admin only list (handled inside controller if needed)
    return SocietyController.get_all_societies() # I'll add this to controller

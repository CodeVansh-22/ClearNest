from flask import Blueprint
from app.controllers.upload_controller import UploadController
from flask_jwt_extended import jwt_required

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/image', methods=['POST'])
@jwt_required()
def upload_image():
    return UploadController.upload_image()

@upload_bp.route('/document', methods=['POST'])
@jwt_required()
def upload_document():
    return UploadController.upload_document()

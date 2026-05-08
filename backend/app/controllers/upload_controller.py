from flask import request
from app.services.upload_service import UploadService
from app.utils.responses import success_response, error_response

class UploadController:
    @staticmethod
    def upload_image():
        if 'file' not in request.files:
            return error_response("No file provided")
        
        file = request.files['file']
        try:
            file_path = UploadService.upload_image(file)
            return success_response("Image uploaded successfully", {"file_path": file_path})
        except ValueError as e:
            return error_response(str(e))
        except Exception as e:
            return error_response(f"Internal server error: {str(e)}")

    @staticmethod
    def upload_document():
        if 'file' not in request.files:
            return error_response("No file provided")
        
        file = request.files['file']
        try:
            file_path = UploadService.upload_document(file)
            return success_response("Document uploaded successfully", {"file_path": file_path})
        except ValueError as e:
            return error_response(str(e))
        except Exception as e:
            return error_response(f"Internal server error: {str(e)}")

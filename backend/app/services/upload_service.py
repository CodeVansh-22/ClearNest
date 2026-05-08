import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app

ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
ALLOWED_DOC_EXTENSIONS = {'pdf', 'docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

class UploadService:
    @staticmethod
    def validate_file(file, allowed_extensions):
        if not file or not file.filename:
            return False, "No file provided"
        
        ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        if ext not in allowed_extensions:
            return False, f"Invalid file type. Allowed: {allowed_extensions}"
        
        # Check size
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)
        
        if size > MAX_FILE_SIZE:
            return False, "File size exceeds 10MB limit"
            
        return True, None

    @staticmethod
    def save_file(file, folder):
        upload_path = os.path.join(current_app.root_path, '..', 'uploads', folder)
        if not os.path.exists(upload_path):
            os.makedirs(upload_path)
            
        ext = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{ext}"
        full_path = os.path.join(upload_path, unique_filename)
        
        file.save(full_path)
        
        # Return the relative URL for frontend access
        return f"/uploads/{folder}/{unique_filename}"

    @staticmethod
    def upload_image(file):
        is_valid, error = UploadService.validate_file(file, ALLOWED_IMAGE_EXTENSIONS)
        if not is_valid:
            raise ValueError(error)
        return UploadService.save_file(file, "complaints")

    @staticmethod
    def upload_document(file):
        is_valid, error = UploadService.validate_file(file, ALLOWED_DOC_EXTENSIONS)
        if not is_valid:
            raise ValueError(error)
        return UploadService.save_file(file, "documents")

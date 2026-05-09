from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from app.extensions import jwt, bcrypt
from app.config.config import Config
from app.database.mongodb import init_mongodb
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize Extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    bcrypt.init_app(app)
    jwt.init_app(app)
    init_mongodb(app)

    @app.before_request
    def require_mongodb():
        if request.path.startswith('/api/') and not app.config.get("MONGODB_AVAILABLE", False):
            return jsonify({
                "success": False,
                "message": "Database connection is unavailable. Check backend/.env MONGO_URI and your network/DNS access to MongoDB Atlas.",
                "details": app.config.get("MONGODB_ERROR")
            }), 503
    
    # Route for serving uploaded files
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(os.path.join(app.root_path, '..', 'uploads'), filename)
    
    # Register Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.society_routes import society_bp
    from app.routes.ledger_routes import ledger_bp
    from app.routes.complaint_routes import complaint_bp
    from app.routes.voting_routes import voting_bp
    from app.routes.vendor_routes import vendor_bp
    from app.routes.payment_routes import payment_bp
    from app.routes.upload_routes import upload_bp
    from app.routes.platform_routes import platform_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(society_bp, url_prefix='/api/societies')
    app.register_blueprint(ledger_bp, url_prefix='/api/ledger')
    app.register_blueprint(complaint_bp, url_prefix='/api/complaints')
    app.register_blueprint(voting_bp, url_prefix='/api/votes')
    app.register_blueprint(vendor_bp, url_prefix='/api/vendors')
    app.register_blueprint(payment_bp, url_prefix='/api/payments')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')
    app.register_blueprint(platform_bp, url_prefix='/api/platform')
    
    return app

from flask import Blueprint
from app.controllers.platform_controller import PlatformController
from app.middleware.role_middleware import super_admin_required

platform_bp = Blueprint('platform', __name__)

@platform_bp.route('/stats', methods=['GET'])
@super_admin_required
def get_stats():
    return PlatformController.get_platform_stats()

@platform_bp.route('/societies/<id>/toggle', methods=['POST'])
@super_admin_required
def toggle_society(id):
    return PlatformController.toggle_society_status(id)

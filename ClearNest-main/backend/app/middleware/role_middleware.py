from functools import wraps
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from app.utils.responses import error_response

def role_required(roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") not in roles:
                return error_response("Access forbidden: Insufficient permissions", 403)
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def super_admin_required(fn):
    return role_required(["SUPER_ADMIN"])(fn)

def society_admin_required(fn):
    return role_required(["SUPER_ADMIN", "SOCIETY_ADMIN"])(fn)

def committee_required(fn):
    return role_required(["SUPER_ADMIN", "SOCIETY_ADMIN", "COMMITTEE_MEMBER"])(fn)

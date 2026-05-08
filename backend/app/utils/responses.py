from flask import jsonify

def success_response(message="Operation successful", data=None, status=200):
    response = {
        "success": True,
        "message": message,
        "data": data if data is not None else {}
    }
    return jsonify(response), status

def error_response(message="Something went wrong", status=400):
    response = {
        "success": False,
        "message": message
    }
    return jsonify(response), status

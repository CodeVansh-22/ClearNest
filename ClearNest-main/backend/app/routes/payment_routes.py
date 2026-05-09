from flask import Blueprint, request
from app.utils.responses import success_response, error_response
import razorpay
from flask import current_app
from flask_jwt_extended import jwt_required

payment_bp = Blueprint('payments', __name__)

def get_razorpay_client():
    return razorpay.Client(auth=(current_app.config['RAZORPAY_KEY_ID'], current_app.config['RAZORPAY_KEY_SECRET']))

@payment_bp.route('/create-order', methods=['POST'])
@jwt_required()
def create_order():
    data = request.get_json()
    amount = data.get('amount') # In paise
    currency = data.get('currency', 'INR')
    
    if not amount:
        return error_response("Amount is required")
        
    client = get_razorpay_client()
    order_data = {
        "amount": int(amount),
        "currency": currency,
        "payment_capture": 1
    }
    
    order = client.order.create(data=order_data)
    return success_response("Order created", order)

@payment_bp.route('/verify', methods=['POST'])
@jwt_required()
def verify_payment():
    data = request.get_json()
    razorpay_order_id = data.get('razorpay_order_id')
    razorpay_payment_id = data.get('razorpay_payment_id')
    razorpay_signature = data.get('razorpay_signature')
    
    client = get_razorpay_client()
    params_dict = {
        'razorpay_order_id': razorpay_order_id,
        'razorpay_payment_id': razorpay_payment_id,
        'razorpay_signature': razorpay_signature
    }
    
    try:
        client.utility.verify_payment_signature(params_dict)
        # Here you would typically update the ledger or mark a bill as paid
        return success_response("Payment verified successfully")
    except Exception as e:
        return error_response("Payment verification failed", 400)

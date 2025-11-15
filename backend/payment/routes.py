import os
from flask import Blueprint, request, jsonify
import requests
from flask_cors import cross_origin  # Optional per-route CORS

payment_bp = Blueprint("payment", __name__, url_prefix="/api/payments")

# --------------------------
# Zynle Credentials from .env
# --------------------------
ZYNLE_URL = os.getenv("ZYNLE_BASE_URL")
ZYNLE_URL_STATUS = os.getenv("ZYNLE_BASE_URL_STATUS")  # Payment status endpoint
API_ID = os.getenv("ZYNLE_API_ID")
MERCHANT_ID = os.getenv("ZYNLE_MERCHANT_ID")
API_KEY = os.getenv("ZYNLE_API_KEY")


# ============================================================
# MOBILE MONEY DEPOSIT (customer → merchant)
# ============================================================
@payment_bp.route("/deposit", methods=["POST", "OPTIONS"])
@cross_origin()  # Handles CORS preflight automatically
def deposit():
    if request.method == "OPTIONS":
        return '', 200

    try:
        body = request.json
        customer_phone = body.get("customer_phone")
        reference_no = body.get("reference_no")
        amount = body.get("amount")

        if not customer_phone or not reference_no or not amount:
            return jsonify({
                "error": "customer_phone, reference_no, amount are required"
            }), 400

        payload = {
            "auth": {
                "api_id": API_ID,
                "merchant_id": MERCHANT_ID,
                "api_key": API_KEY,
                "channel": "mobile_money"
            },
            "data": {
                "method": "runCollectPayment",   # ✅ Deposit method
                "customer_phone": customer_phone,
                "reference_no": reference_no,
                "amount": amount,
                "description": f"Deposit via mobile money from {customer_phone}"
            }
        }

        response = requests.post(ZYNLE_URL, json=payload)
        return jsonify({
            "status": "success",
            "zynle_response": response.json()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# MOBILE MONEY WITHDRAWAL (merchant → customer)
# ============================================================
@payment_bp.route("/pay-to-ewallet", methods=["POST", "OPTIONS"])
@cross_origin()
def pay_to_ewallet():
    if request.method == "OPTIONS":
        return '', 200

    try:
        body = request.json
        receiver_id = body.get("receiver_id")
        reference_no = body.get("reference_no")
        amount = body.get("amount")

        if not receiver_id or not reference_no or not amount:
            return jsonify({"error": "receiver_id, reference_no, amount are required"}), 400

        payload = {
            "auth": {
                "api_id": API_ID,
                "merchant_id": MERCHANT_ID,
                "api_key": API_KEY,
                "channel": "mobile_money"
            },
            "data": {
                "method": "runPayToEwallet",
                "receiver_id": receiver_id,
                "reference_no": reference_no,
                "amount": amount,
                "description": f"Withdrawal to mobile money for {receiver_id}"
            }
        }

        response = requests.post(ZYNLE_URL, json=payload)
        return jsonify({
            "status": "success",
            "zynle_response": response.json()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# CARD PAYMENT
# ============================================================
@payment_bp.route("/pay-with-card", methods=["POST", "OPTIONS"])
@cross_origin()
def pay_with_card():
    if request.method == "OPTIONS":
        return '', 200

    try:
        body = request.json

        required_fields = [
            "reference_no", "amount", "description",
            "first_name", "last_name", "address",
            "email", "phone", "city", "state",
            "zip_code", "country", "currency"
        ]

        for field in required_fields:
            if not body.get(field):
                return jsonify({"error": f"{field} is required"}), 400

        payload = {
            "auth": {
                "merchant_id": MERCHANT_ID,
                "api_id": API_ID,
                "api_key": API_KEY,
                "channel": "card"
            },
            "data": {
                "method": "runTranAuthCapture",
                **{key: body[key] for key in required_fields}
            }
        }

        response = requests.post(ZYNLE_URL, json=payload)

        return jsonify({
            "status": "success",
            "zynle_response": response.json()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# CHECK PAYMENT STATUS
# ============================================================
@payment_bp.route("/status", methods=["POST", "OPTIONS"])
@cross_origin()
def payment_status():
    if request.method == "OPTIONS":
        return '', 200

    try:
        body = request.json
        reference_no = body.get("reference_no")
        channel = body.get("channel", "mobile_money")

        if not reference_no:
            return jsonify({"error": "reference_no is required"}), 400

        payload = {
            "auth": {
                "api_id": API_ID,
                "merchant_id": MERCHANT_ID,
                "api_key": API_KEY,
                "channel": channel
            },
            "data": {
                "method": "getPaymentStatus",
                "reference_no": reference_no
            }
        }

        response = requests.post(ZYNLE_URL_STATUS, json=payload)

        return jsonify({
            "status": "success",
            "zynle_response": response.json()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# TEST ENDPOINT
# ============================================================
@payment_bp.route("/test", methods=["GET", "OPTIONS"])
@cross_origin()
def test():
    if request.method == "OPTIONS":
        return '', 200
    return jsonify({"message": "Payment API running successfully!"})

from flask import Blueprint, request, jsonify
import requests
import os

payment_bp = Blueprint("payment", __name__, url_prefix="/api/payments")

ZYNLE_URL = os.getenv("ZYNLE_BASE_URL")
ZYNLE_URL_STATUS = os.getenv("ZYNLE_BASE_URL_STATUS")  # for payment status
API_ID = os.getenv("ZYNLE_API_ID")
MERCHANT_ID = os.getenv("ZYNLE_MERCHANT_ID")
API_KEY = os.getenv("ZYNLE_API_KEY")


# ------------------------
# Mobile Money Payment
# ------------------------
# Mobile Money
@payment_bp.route("/pay-to-ewallet", methods=["POST"])
def pay_to_ewallet():
    try:
        body = request.json
        receiver_id = body.get("receiver_id")
        reference_no = body.get("reference_no")
        amount = body.get("amount")

        if not receiver_id or not reference_no or not amount:
            return jsonify({"error": "receiver_id, reference_no and amount are required"}), 400

        # Include mobile number in the description or data field so it shows on Zynle
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
                "description": f"Mobile money payment for {receiver_id}"  # <-- add number here
            }
        }

        response = requests.post(ZYNLE_URL, json=payload)
        zynle_response = response.json()

        # Optionally: Save transaction in your database
        # Example: save_transaction(reference_no, receiver_id, amount, zynle_response)

        return jsonify({"status": "success", "zynle_response": zynle_response}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------------
# Card Payment
# ------------------------
@payment_bp.route("/pay-with-card", methods=["POST"])
def pay_with_card():
    try:
        body = request.json
        required_fields = [
            "reference_no", "amount", "description", "first_name", "last_name",
            "address", "email", "phone", "city", "state", "zip_code", "country", "currency"
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
        return jsonify({"status": "success", "zynle_response": response.json()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------------
# Check Payment Status
# ------------------------
@payment_bp.route("/status", methods=["POST"])
def payment_status():
    try:
        body = request.json
        reference_no = body.get("reference_no")
        if not reference_no:
            return jsonify({"error": "reference_no is required"}), 400

        payload = {
            "auth": {
                "api_id": API_ID,
                "merchant_id": MERCHANT_ID,
                "api_key": API_KEY,
                "channel": "mobile_money"  # or "card" depending on the payment
            },
            "data": {
                "method": "getPaymentStatus",
                "reference_no": reference_no
            }
        }

        response = requests.post(ZYNLE_URL_STATUS, json=payload)
        return jsonify({"status": "success", "zynle_response": response.json()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------------
# Test Endpoint
# ------------------------
@payment_bp.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Payment blueprint is working!"})

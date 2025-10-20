import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_talisman import Talisman
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import stripe

app = Flask(__name__)
CORS(app, resources={r"/create-checkout-session": {"origins": ["https://yourdomain.com"]}})
Talisman(app, content_security_policy=None)  # set CSP correctly
limiter = Limiter(app, key_func=get_remote_address)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
PRICE_IDS = {"basic": os.getenv("PRICE_BASIC"), "pro": os.getenv("PRICE_PRO"), "premium": os.getenv("PRICE_PREMIUM")}

@app.route("/create-checkout-session", methods=["POST"])
@limiter.limit("10/minute")
def create_checkout_session():
    data = request.get_json() or {}
    plan = data.get("plan")
    if plan not in PRICE_IDS:
        return jsonify({"error": "Invalid plan selected"}), 400

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{"price": PRICE_IDS[plan], "quantity": 1}],
            mode="subscription",
            success_url="https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="https://yourdomain.com/cancel",
            metadata={"plan": plan},
            idempotency_key=data.get("idempotency_key")  # optional client provided
        )
        return jsonify({"url": session.url})
    except stripe.error.StripeError as e:
        app.logger.error("Stripe error: %s", str(e))
        return jsonify({"error": "Payment service error"}), 500

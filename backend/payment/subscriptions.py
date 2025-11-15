from firebase_init import db
from datetime import datetime, timedelta
import pytz


def save_subscription(user_id, plan, duration_days):
    """Save or update user subscription."""
    expires_at = datetime.utcnow() + timedelta(days=duration_days)

    sub_ref = db.collection("subscriptions").document(user_id)
    sub_ref.set({
        "user_id": user_id,
        "plan": plan,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.utcnow().isoformat()
    })

    return {
        "user_id": user_id,
        "plan": plan,
        "expires_at": expires_at.isoformat()
    }


def get_subscription(user_id):
    """Return subscription or None."""
    ref = db.collection("subscriptions").document(user_id).get()
    return ref.to_dict() if ref.exists else None


def check_subscription_active(user_id):
    """Check if subscription is active."""
    sub = get_subscription(user_id)
    if not sub:
        return False, None

    expires_at = datetime.fromisoformat(sub["expires_at"].replace("Z", ""))

    if datetime.utcnow() > expires_at:
        return False, "Subscription expired"

    return True, sub

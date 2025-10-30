from apscheduler.schedulers.background import BackgroundScheduler
from firebase_init import db
from datetime import datetime
import requests
import time

def post_to_platform(content, platforms, image_url=None, voice_url=None):
    """
    Replace with real social media API calls.
    For example, use Twitter API v2, Instagram Graph API, Facebook Graph API, etc.
    """
    results = {}
    if "twitter" in platforms or "all" in platforms:
        # Example placeholder
        results["twitter"] = f"Posted to Twitter: {content[:50]}..."
    if "facebook" in platforms or "all" in platforms:
        results["facebook"] = f"Posted to Facebook: {content[:50]}..."
    if "instagram" in platforms or "all" in platforms:
        results["instagram"] = f"Posted to Instagram: {content[:50]}..."
    if "threads" in platforms or "all" in platforms:
        results["threads"] = f"Posted to Threads: {content[:50]}..."
    return results


def check_scheduled_posts():
    print("[Scheduler] Checking scheduled posts...")
    now = datetime.utcnow().isoformat()
    posts_query = db.collection("scheduled_posts").where("scheduled_time", "<=", now).stream()

    for post in posts_query:
        post_data = post.to_dict()
        post_id = post.id
        try:
            results = post_to_platform(
                post_data["content"],
                post_data.get("platforms", "all"),
                post_data.get("image_url"),
                post_data.get("voice_url")
            )
            # Mark post as sent
            db.collection("scheduled_posts").document(post_id).update({
                "posted": True,
                "posted_at": datetime.utcnow().isoformat(),
                "platform_results": results
            })
            print(f"[Scheduler] Successfully posted {post_id}")
        except Exception as e:
            db.collection("scheduled_posts").document(post_id).update({
                "posted": False,
                "error": str(e)
            })
            print(f"[Scheduler] Failed to post {post_id}: {e}")


def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_scheduled_posts, 'interval', minutes=1)  # check every minute
    scheduler.start()
    print("[Scheduler] Background scheduler started")

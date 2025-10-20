from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import atexit
from firebase_init import db  # Use the already initialized Firestore client

def post_scheduled_content():
    now = datetime.now().isoformat()
    print(f"[Scheduler Running] Checking for posts <= {now}...")

    # Query posts ready to publish
    posts_ref = db.collection("scheduled_posts")
    ready_posts = posts_ref.where("scheduled_time", "<=", now).stream()

    for post in ready_posts:
        post_data = post.to_dict()
        print(f"[AUTO POST] User: {post_data['user_id']} | Platforms: {post_data.get('platforms', 'all')} | Content: {post_data['content']}")
        
        # Optionally you can mark as 'posted' instead of deleting
        posts_ref.document(post.id).delete()
        print(f"Deleted post {post.id} after posting")

# Initialize scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(post_scheduled_content, 'interval', seconds=30)
scheduler.start()

atexit.register(lambda: scheduler.shutdown())

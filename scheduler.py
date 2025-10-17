from apscheduler.schedulers.background import BackgroundScheduler
from db import get_db_connection
from datetime import datetime
import atexit

def post_scheduled_content():
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute("SELECT id, user_id, content, platforms FROM scheduled_posts WHERE scheduled_time <= ?", (now,))
    posts = cursor.fetchall()
    for post in posts:
        print(f"[AUTO POST] User: {post['user_id']} | Platforms: {post['platforms']} | Content: {post['content']}")
        cursor.execute("DELETE FROM scheduled_posts WHERE id=?", (post["id"],))
    conn.commit()
    conn.close()

scheduler = BackgroundScheduler()
scheduler.add_job(post_scheduled_content, 'interval', seconds=30)
scheduler.start()
atexit.register(lambda: scheduler.shutdown())

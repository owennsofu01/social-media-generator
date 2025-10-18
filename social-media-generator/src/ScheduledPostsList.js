import React, { useEffect, useState } from "react";
import "./ScheduledPostsList.css"; // <-- New CSS Import

const scheduledPostsUrl = "https://social-media-generator-jhsl.onrender.com/scheduled_posts";

const ScheduledPostsList = () => {
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const userId = localStorage.getItem("user_id"); // get logged-in user id

  // Fetch scheduled posts for the logged-in user
  const fetchScheduledPosts = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`${scheduledPostsUrl}?user_id=${userId}`);
      const data = await res.json();
      setScheduledPosts(data || []);
    } catch (err) {
      console.error("❌ Failed to fetch scheduled posts:", err);
    }
  };

  useEffect(() => {
    fetchScheduledPosts();
    const interval = setInterval(fetchScheduledPosts, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [userId]);

  // Delete a scheduled post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`${scheduledPostsUrl}/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setScheduledPosts((prev) => prev.filter((post) => post.id !== id));
      } else {
        alert(data.error || "❌ Failed to delete post");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting post");
    }
  };

  return (
    <div className="scheduled-posts">
      <h3>📅 My Scheduled Posts</h3>
      <div className="list-controls">
        <button onClick={fetchScheduledPosts} className="refresh-btn">🔄 Refresh List</button>
      </div>
      {scheduledPosts.length === 0 ? (
        <p className="no-posts-message">✅ No upcoming posts currently scheduled.</p>
      ) : (
        <ul className="post-list">
          {scheduledPosts.map((post) => (
            <li key={post.id} className="post-item">
              <div className="post-details">
                <div className="detail-row">
                  <span className="detail-label">Time:</span>
                  <span className="detail-value time">{new Date(post.scheduled_time).toLocaleString()}</span>
                </div>
                <div className="detail-row content">
                  <span className="detail-label">Content:</span>
                  <span className="detail-value">{post.content}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Platforms:</span>
                  <span className="detail-value platforms">{post.platforms || "All"}</span>
                </div>
                <div className="detail-row created-at">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">{new Date(post.created_at).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(post.id)} className="delete-btn">🗑️ Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScheduledPostsList;
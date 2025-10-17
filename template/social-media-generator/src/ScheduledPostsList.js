import React, { useEffect, useState } from "react";

const scheduledPostsUrl = "http://127.0.0.1:5000/scheduled_posts";

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
      <button onClick={fetchScheduledPosts}>🔄 Refresh</button>
      {scheduledPosts.length === 0 ? (
        <p>No scheduled posts</p>
      ) : (
        <ul>
          {scheduledPosts.map((post) => (
            <li key={post.id}>
              <div>
                <strong>Time:</strong> {new Date(post.scheduled_time).toLocaleString()}
              </div>
              <div>
                <strong>Content:</strong> {post.content}
              </div>
              <div>
                <strong>Platforms:</strong> {post.platforms || "All"}
              </div>
              <div>
                <strong>Created At:</strong> {new Date(post.created_at).toLocaleString()}
              </div>
              <button onClick={() => handleDelete(post.id)}>🗑️ Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScheduledPostsList;

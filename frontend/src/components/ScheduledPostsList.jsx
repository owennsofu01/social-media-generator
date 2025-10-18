import React, { useEffect, useState } from "react";

const scheduledPostsUrl = "https://social-media-generator-jhsl.onrender.com/scheduled_posts";

const ScheduledPostsList = () => {
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const userId = localStorage.getItem("user_id");

  // Fetch scheduled posts
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

  // Delete post (send ID in JSON body)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(scheduledPostsUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }), // pass post ID in body
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
    <div className="scheduled-posts bg-white p-6 rounded-2xl shadow space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-[#231F20]">📅 My Scheduled Posts</h3>
        <button
          onClick={fetchScheduledPosts}
          className="bg-[#AD974F] hover:bg-[#8E793E] text-white px-4 py-2 rounded-xl transition-colors duration-200"
        >
          🔄 Refresh List
        </button>
      </div>

      {scheduledPosts.length === 0 ? (
        <p className="text-gray-600">✅ No upcoming posts currently scheduled.</p>
      ) : (
        <ul className="space-y-4">
          {scheduledPosts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-1 space-y-1 text-gray-800">
                <div className="flex gap-2">
                  <span className="font-medium">Time:</span>
                  <span>{new Date(post.scheduled_time).toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium">Content:</span>
                  <span className="break-words">{post.content}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium">Platforms:</span>
                  <span>{post.platforms || "All"}</span>
                </div>
                <div className="flex gap-2 text-gray-500 text-sm">
                  <span className="font-medium">Created:</span>
                  <span>{new Date(post.created_at).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(post.id)}
                className="mt-2 md:mt-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors duration-200"
              >
                🗑️ Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScheduledPostsList;

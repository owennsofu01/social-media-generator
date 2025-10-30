import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaRedoAlt } from "react-icons/fa"; 
// import Sidebar from "../../layout/Sidebar"; // Assuming Sidebar is handled externally

const scheduledPostsUrl = "http://127.0.0.1:5000/scheduled_posts";

const ScheduledPostsList = () => {
    const [scheduledPosts, setScheduledPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    // State to manage the post ID being considered for deletion
    const [postToDelete, setPostToDelete] = useState(null); 
    const userId = localStorage.getItem("user_id");

    const fetchScheduledPosts = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await fetch(`${scheduledPostsUrl}?user_id=${userId}`);
            const data = await res.json();
            setScheduledPosts(data || []);
        } catch (err) {
            console.error("❌ Failed to fetch scheduled posts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScheduledPosts();
        // Fetch every 30 seconds
        const interval = setInterval(fetchScheduledPosts, 30000); 
        return () => clearInterval(interval);
    }, [userId]);

    // Function to handle the actual deletion after confirmation
    const confirmDelete = async (id) => {
        setPostToDelete(null); // Clear confirmation state
        
        try {
            const res = await fetch(scheduledPostsUrl, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            
            if (data.success) {
                // Optimistically update UI
                setScheduledPosts((prev) => prev.filter((post) => post.id !== id));
            } else {
                console.error(data.error || "❌ Failed to delete post");
            }
        } catch (err) {
            console.error(err);
        }
    };
    
    // Function to initiate deletion confirmation
    const handleDelete = (id) => {
        // Sets the state to show the confirmation UI
        setPostToDelete(id); 
    };

    // Helper function for rendering platform badges
    const renderPlatforms = (platformsString) => {
        const platforms = platformsString ? platformsString.split(',') : [];
        return platforms.map((platform, index) => (
            <span 
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full"
            >
                {platform.trim().toUpperCase()}
            </span>
        ));
    };

    const PostCard = ({ post }) => (
        <li
            key={post.id}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-5 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
        >
            <div className="flex-1 space-y-3 text-gray-800 w-full">
                
                {/* Scheduled Time */}
                <div className="flex items-center text-sm font-medium text-blue-600">
                    <span className="mr-2">⏰</span>
                    {new Date(post.scheduled_time).toLocaleString()}
                </div>

                {/* Content */}
                <div>
                    <span className="font-semibold text-gray-700">Content: </span>
                    <p className="text-gray-600 line-clamp-3 mt-1 text-sm">{post.content}</p>
                </div>

                {/* Platforms & Type (Badges) */}
                <div className="flex items-center flex-wrap gap-2 text-sm pt-2 border-t border-gray-100">
                    <span className="font-semibold text-gray-700">Platforms:</span>
                    {renderPlatforms(post.platforms)}
                    <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {post.type.toUpperCase()}
                    </span>
                </div>
            </div>
            
            {/* Actions and Deletion Confirmation */}
            <div className="mt-4 lg:mt-0 flex flex-col items-end w-full lg:w-auto lg:pl-6">
                {postToDelete === post.id ? (
                    <div className="flex flex-col sm:flex-row gap-2 bg-red-50 p-3 rounded-lg border border-red-200 shadow-inner">
                        <span className="text-red-700 text-sm font-medium whitespace-nowrap">Confirm Delete?</span>
                        <button
                            onClick={() => confirmDelete(post.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded-lg transition-colors w-full sm:w-auto"
                        >
                            Yes, Delete
                        </button>
                        <button
                            onClick={() => setPostToDelete(null)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 text-sm rounded-lg transition-colors w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => handleDelete(post.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 w-full lg:w-auto font-medium flex items-center justify-center gap-2 shadow-md"
                        title="Delete Post"
                    >
                        <FaTrashAlt size={14} /> Delete
                    </button>
                )}
            </div>
        </li>
    );

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar component is assumed to be handled externally */}
            {/* <Sidebar /> */}

            <div className="flex-1 max-w-5xl mx-auto p-4 md:p-8 overflow-y-auto">
                
                {/* Header and Refresh */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-6">
                    <h3 className="text-3xl font-bold text-gray-800">📅 Scheduled Posts</h3>
                    <button
                        onClick={fetchScheduledPosts}
                        className={`bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition duration-200 mt-4 md:mt-0 shadow-md flex items-center gap-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : (
                            <>
                                <FaRedoAlt size={14} /> Refresh List
                            </>
                        )}
                    </button>
                </div>

                {/* List Content */}
                {scheduledPosts.length === 0 ? (
                    <div className="p-10 bg-white rounded-xl shadow-lg text-center">
                        <p className="text-xl text-gray-500 font-medium">
                            ✅ No upcoming posts currently scheduled.
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            Use the Post Generator to schedule your first post!
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-6">
                        {scheduledPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ScheduledPostsList;

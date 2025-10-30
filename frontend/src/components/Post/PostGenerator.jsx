import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Sidebar from "../../layout/Sidebar"; // Commented out unused import as it was in the original context

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ScheduleModal from "./ScheduleModal";
import { FaTimesCircle } from "react-icons/fa";

const backendUrl = "http://127.0.0.1:5000/generate";
const scheduleUrl = "http://127.0.0.1:5000/schedule";

// Simple Notification/Toast Component
const Notification = ({ message, type, onClose }) => {
    if (!message) return null;

    const baseClasses = "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl z-[9999] transition-opacity duration-300 flex items-center gap-3";
    const typeClasses = type === 'error'
        ? "bg-red-500 text-white"
        : "bg-blue-600 text-white";

    return (
        <div className={`${baseClasses} ${typeClasses}`}>
            {message}
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10">
                <FaTimesCircle size={20} />
            </button>
        </div>
    );
};

const PostGenerator = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [inputText, setInputText] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Notification State
    const [notification, setNotification] = useState(null);

    // Post options
    const [postType, setPostType] = useState("marketing");
    const [generateImageFlag, setGenerateImageFlag] = useState(false);

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalText, setModalText] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    
    // Refs
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const messagesEndRef = useRef(null);

    // Notification handler
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    // Scroll to bottom effect
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    useEffect(() => {
        const id = localStorage.getItem("user_id");
        if (!id) {
            // Replaced alert() with showNotification
            showNotification("⚠️ You must be logged in to use the generator.", 'error');
            navigate("/login");
        } else {
            setUserId(id);
        }
    }, [navigate]);

    const addMessage = (sender, text, extra = {}) =>
        setMessages((prev) => [...prev, { sender, text, ...extra }]);

    const togglePlatform = (platform) =>
        setSelectedPlatforms((prev) =>
            prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
        );

    // 🎙️ Voice Recording
    const handleRecord = async () => {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) audioChunksRef.current.push(e.data);
                };
                mediaRecorder.onstop = () => {
                    const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                    setAudioBlob(blob);
                    addMessage("system", "🎙️ Voice recorded!");
                };

                mediaRecorder.start();
                setIsRecording(true);
            } catch {
                addMessage("system", "❌ Microphone not accessible");
                showNotification("Microphone access denied. Please check your browser settings.", 'error');
            }
        } else {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // 📤 Send input to backend
    const handleSend = async () => {
        if (!inputText && !audioBlob && !imageFile) return;

        // Use a clearer message when input is not just text
        const userMessage = inputText || (audioBlob ? "🎤 Voice input" : "🖼️ Image input");
        addMessage("user", userMessage);

        const formData = new FormData();
        if (inputText) formData.append("text", inputText);
        if (imageFile) formData.append("image", imageFile);
        if (audioBlob) formData.append("voice", audioBlob, "voice.webm");
        formData.append("type", postType);
        formData.append("generate_image", generateImageFlag);

        setInputText("");
        setImageFile(null);
        setAudioBlob(null);
        setLoading(true);

        try {
            const res = await fetch(backendUrl, { method: "POST", body: formData });
            const data = await res.json();

            addMessage("ai", data.post || "❌ Could not generate post", {
                id: Date.now(),
                image_url: data.image_url || null,
            });
        } catch {
            addMessage("ai", "❌ Server error", { id: Date.now() });
        } finally {
            setLoading(false);
        }
    };

    // 📋 Copy text
    const handleCopy = (text) => {
        // Replaced alert() with showNotification
        navigator.clipboard.writeText(text).then(() => {
            showNotification("Copied content to clipboard!", 'success');
        }).catch(() => {
            showNotification("Failed to copy.", 'error');
        });
    };

    // 🗓️ Schedule post
    const openScheduleModal = (text) => {
        setModalText(text);
        setModalOpen(true);
        setScheduledTime("");
        setSelectedPlatforms([]);
    };

    const submitSchedule = async () => {
        if (!scheduledTime || selectedPlatforms.length === 0) {
            // Replaced alert() with showNotification
            showNotification("Please select a date/time and at least one platform.", 'error');
            return;
        }

        try {
            const res = await fetch(scheduleUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: modalText,
                    scheduled_time: scheduledTime,
                    user_id: userId,
                    platforms: selectedPlatforms.join(","),
                    type: postType,
                    generate_image: generateImageFlag
                }),
            });
            const data = await res.json();
            
            // Replaced alert() with showNotification
            if (data.success) {
                showNotification(data.success, 'success');
            } else {
                showNotification(data.error || "❌ Failed to schedule post", 'error');
            }
            
            setModalOpen(false);
        } catch {
            // Replaced alert() with showNotification
            showNotification("❌ Failed to schedule post due to server error.", 'error');
        }
    };

    return (
        // The main container should handle the screen height
        <div className="flex h-screen bg-gray-50 pt-16 md:pt-0"> {/* Added padding for mobile header */}
            {/* Main content - Centered and max-width for better readability */}
            <div className="flex-1 flex flex-col mx-auto max-w-4xl w-full h-full"> 
                
                {/* Options - Sticky to keep settings visible */}
                <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4 shadow-sm flex gap-6 items-center">
                    <label className="text-sm font-medium text-gray-700">Post Type:</label>
                    <select
                        value={postType}
                        onChange={(e) => setPostType(e.target.value)}
                        className="border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="marketing">🎯 Marketing</option>
                        <option value="personal_brand">👤 Personal Brand</option>
                    </select>

                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                        <input
                            type="checkbox"
                            checked={generateImageFlag}
                            onChange={() => setGenerateImageFlag(!generateImageFlag)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        🖼️ Generate Image
                    </label>
                </div>

                {/* Chat messages - Scrollable area - Removed 'overflow-y-auto' as requested. Note: This assumes the outer flex structure correctly forces scroll behavior. */}
                <div className="flex-1 p-4 space-y-6 overflow-y-auto"> 
                    {messages.map((msg, i) => (
                        <ChatMessage
                            key={i}
                            msg={msg}
                            handleCopy={handleCopy}
                            openScheduleModal={openScheduleModal}
                        />
                    ))}
                    {loading && (
                        <div className="max-w-xl p-4 rounded-lg bg-blue-50 shadow self-start italic text-gray-600 animate-pulse"> 
                            🤖 Generating post content and image...
                        </div>
                    )}
                    {/* Ref for auto-scrolling */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Chat input - Sticky at the bottom, clearer separation */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
                    <ChatInput
                        inputText={inputText}
                        setInputText={setInputText}
                        handleSend={handleSend}
                        handleRecord={handleRecord}
                        isRecording={isRecording}
                        setImageFile={setImageFile}
                    />
                </div>
            </div>

            {/* Schedule modal */}
            <ScheduleModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                modalText={modalText}
                scheduledTime={scheduledTime}
                setScheduledTime={setScheduledTime}
                selectedPlatforms={selectedPlatforms}
                togglePlatform={togglePlatform}
                submitSchedule={submitSchedule}
            />

            {/* Global Notification */}
            <Notification 
                message={notification?.message} 
                type={notification?.type} 
                onClose={() => setNotification(null)}
            />
        </div>
    );
};

export default PostGenerator;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ScheduleModal from "./ScheduleModal";
import { FaTimesCircle } from "react-icons/fa";

const backendUrl = "https://social-media-generator-jhsl.onrender.com/generate";
const scheduleUrl = "https://social-media-generator-jhsl.onrender.com/schedule";

// --- FIX START: Notification Component JSX Completion ---
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const baseClasses =
    "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl z-[9999] transition-opacity duration-300 flex items-center gap-3";
  const typeClasses =
    type === "error"
      ? "bg-red-500 text-white"
      : "bg-blue-600 text-white";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
      <button onClick={onClose} className="text-xl opacity-90 hover:opacity-100">
        <FaTimesCircle />
      </button>
    </div>
  );
};
// --- FIX END ---

const PostGenerator = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [postType, setPostType] = useState("marketing");
  const [generateImageFlag, setGenerateImageFlag] = useState(false);
  const [tone, setTone] = useState("default");
  const [platform, setPlatform] = useState("general");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) {
      showNotification("⚠️ You must be logged in to use the generator.", "error");
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

  // Voice Recording
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
        showNotification("Microphone access denied. Please check your browser settings.", "error");
      }
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = async () => {
    if (!inputText && !audioBlob && !imageFile) return;
    const userMessage = inputText || (audioBlob ? "🎤 Voice input" : "🖼️ Image input");
    addMessage("user", userMessage);

    const formData = new FormData();
    if (inputText) formData.append("text", inputText);
    if (imageFile) formData.append("image", imageFile);
    if (audioBlob) formData.append("voice", audioBlob, "voice.webm");
    formData.append("type", postType);
    formData.append("generate_image", generateImageFlag);
    formData.append("tone", tone);
    formData.append("platform", platform);

    setInputText("");
    setImageFile(null);
    setAudioBlob(null);
    setLoading(true);

    try {
      const res = await fetch(backendUrl, { method: "POST", body: formData });
      const data = await res.json();

      // Handle AI-generated image if present
      let imageUrl = null;
      if (data.image_bytes) {
        const blob = new Blob([new Uint8Array(data.image_bytes)], { type: "image/png" });
        imageUrl = URL.createObjectURL(blob);
      }

      addMessage("ai", data.post || "❌ Could not generate post", {
        id: Date.now(),
        image_url: imageUrl,
      });
      showNotification("🤖 AI post generated!", "success");
    } catch (err) {
      addMessage("ai", "❌ Server error", { id: Date.now() });
      showNotification("❌ Failed to generate post.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showNotification("Copied content to clipboard!", "success");
    }).catch(() => showNotification("Failed to copy.", "error"));
  };

  const openScheduleModal = (text) => {
    setModalText(text);
    setModalOpen(true);
    setScheduledTime("");
    setSelectedPlatforms([]);
  };

  const submitSchedule = async () => {
    if (!scheduledTime || selectedPlatforms.length === 0) {
      showNotification("Please select a date/time and at least one platform.", "error");
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
          generate_image: generateImageFlag,
        }),
      });
      const data = await res.json();

      if (data.success) showNotification(data.success, "success");
      else showNotification(data.error || "❌ Failed to schedule post", "error");

      setModalOpen(false);
    } catch {
      showNotification("❌ Failed to schedule post due to server error.", "error");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Options: Type, Tone, Platform, Generate Image */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4 shadow-sm flex flex-wrap gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Post Type:</label>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="marketing">🎯 Marketing</option>
            <option value="personal_brand">👤 Personal Brand</option>
          </select>

          <label className="text-sm font-medium text-gray-700">Tone:</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="default">Default</option>
            <option value="professional">Professional</option>
            <option value="funny">Funny</option>
            <option value="motivational">Motivational</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
          </select>

          <label className="text-sm font-medium text-gray-700">Platform:</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="general">General</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter / X</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
          </select>

          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={generateImageFlag}
              onChange={() => setGenerateImageFlag(!generateImageFlag)}
            />{" "}
            Generate Image
          </label>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              sender={msg.sender}
              text={msg.text}
              imageUrl={msg.image_url}
              onCopy={handleCopy}
              onSchedule={msg.sender === "ai" ? openScheduleModal : undefined} // Pass schedule handler only for AI posts
            />
          ))}
          {loading && (
            <div className="italic text-gray-600 animate-pulse">
              🤖 Generating post content...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          handleSend={handleSend}
          imageFile={imageFile}
          setImageFile={setImageFile}
          audioBlob={audioBlob}
          handleRecord={handleRecord}
          isRecording={isRecording}
        />
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Schedule Modal */}
      {modalOpen && (
        <ScheduleModal
          text={modalText}
          onClose={() => setModalOpen(false)}
          scheduledTime={scheduledTime}
          setScheduledTime={setScheduledTime}
          selectedPlatforms={selectedPlatforms}
          togglePlatform={togglePlatform}
          onSubmit={submitSchedule}
        />
      )}
    </div>
  );
};

export default PostGenerator;
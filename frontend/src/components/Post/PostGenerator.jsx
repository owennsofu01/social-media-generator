import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ScheduleModal from "./ScheduleModal";
import { FaTimesCircle } from "react-icons/fa";

const backendUrl = "http://127.0.0.1:5000/generate";
const scheduleUrl = "http://127.0.0.1:5000/schedule";

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  const baseClasses =
    "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl z-[9999] transition-opacity duration-300 flex items-center gap-3";
  const typeClasses =
    type === "error" ? "bg-red-500 text-white" : "bg-blue-600 text-white";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
      <button
        onClick={onClose}
        className="text-xl opacity-90 hover:opacity-100"
        aria-label="Close notification"
      >
        <FaTimesCircle />
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
  const [notification, setNotification] = useState(null);
  const [postType, setPostType] = useState("marketing");
  const [generateImageFlag, setGenerateImageFlag] = useState(false);
  const [tone, setTone] = useState("default");
  const [platform, setPlatform] = useState("general");
  const [wordCount, setWordCount] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);

  // --- Notifications ---
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- Scroll to latest message ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Load user ---
  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) {
      showNotification("⚠️ You must be logged in to use the generator.", "error");
      navigate("/login");
    } else {
      setUserId(id);
    }

    const savedMessages = localStorage.getItem("chat_messages");
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, [navigate]);

  // --- Persist messages ---
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  const addMessage = (sender, text, extra = {}) =>
    setMessages((prev) => [...prev, { sender, text, ...extra }]);

  const togglePlatform = (platform) =>
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );

  // --- Send post to AI backend ---
  const handleSend = async () => {
    if (!inputText && !audioBlob && !imageFile) return;

    const userMessage = inputText || (audioBlob ? "🎤 Voice input" : "🖼️ Image input");
    addMessage("user", userMessage);

    const placeholderId = Date.now();
    addMessage("ai", "🤖 AI is generating...", { id: placeholderId });

    const formData = new FormData();
    if (inputText) formData.append("text", inputText);
    if (imageFile) formData.append("image", imageFile);
    if (audioBlob) formData.append("voice", audioBlob, "voice.webm");
    formData.append("type", postType);
    formData.append("generate_image", generateImageFlag);
    formData.append("tone", tone);
    formData.append("platform", platform);
    if (wordCount) formData.append("word_count", wordCount);

    setInputText("");
    setImageFile(null);
    setAudioBlob(null);
    setLoading(true);

    try {
      const res = await fetch(backendUrl, { method: "POST", body: formData });
      const data = await res.json();

      let imageUrl = null;
      if (data.image_bytes) {
        const blob = new Blob([new Uint8Array(data.image_bytes)], { type: "image/png" });
        imageUrl = URL.createObjectURL(blob);
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === placeholderId
            ? { ...msg, text: data.post || "❌ Could not generate post", image_url: imageUrl }
            : msg
        )
      );

      showNotification("✅ Post generated successfully!", "success");
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === placeholderId ? { ...msg, text: "❌ Error generating post." } : msg
        )
      );
      showNotification("❌ Unable to generate post. Try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Open Schedule Modal from ChatMessage ---
  const handleOpenScheduleModal = (text) => {
    setModalText(text);
    setModalOpen(true);
  };

  // --- Handle scheduling ---
  const handleSchedule = async () => {
    if (!modalText.trim()) {
      showNotification("Please enter post content before scheduling.", "error");
      return;
    }

    try {
      const res = await fetch(scheduleUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: modalText,
          scheduled_at: scheduledTime,
          platforms: selectedPlatforms,
          user_id: userId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification("✅ Post scheduled successfully!", "success");
        setModalOpen(false);
        setModalText("");
        setSelectedPlatforms([]);
      } else {
        showNotification(data.error || "Failed to schedule post.", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("❌ An error occurred while scheduling.", "error");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Options */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4 shadow-sm flex flex-wrap gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Post Type:</label>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="marketing">🎯 Marketing</option>
            <option value="personal_brand">👤 Personal Brand</option>
          </select>

          <label className="text-sm font-medium text-gray-700">Tone:</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-sm"
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
            className="border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="general">General</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter / X</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
          </select>

          <label className="text-sm font-medium text-gray-700">Word Count:</label>
          <input
            type="number"
            min="10"
            placeholder="e.g. 100"
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
            className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          />

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={generateImageFlag}
              onChange={() => setGenerateImageFlag(!generateImageFlag)}
            />{" "}
            Generate Image
          </label>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              sender={msg.sender}
              text={msg.text}
              imageUrl={msg.image_url}
              onSchedule={handleOpenScheduleModal}
            />
          ))}
          {loading && (
            <div className="italic text-gray-600 animate-pulse">
              🤖 Generating post...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input field */}
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          handleSend={handleSend}
          imageFile={imageFile}
          setImageFile={setImageFile}
          audioBlob={audioBlob}
          isRecording={isRecording}
          setModalOpen={setModalOpen}
          setModalText={setModalText}
        />
      </div>

      {/* Schedule modal */}
      {modalOpen && (
        <ScheduleModal
          onClose={() => setModalOpen(false)}
          modalText={modalText}
          scheduledTime={scheduledTime}
          setScheduledTime={setScheduledTime}
          selectedPlatforms={selectedPlatforms}
          togglePlatform={togglePlatform}
          onSubmit={handleSchedule}
        />
      )}

      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default PostGenerator;

import React, { useState, useRef, useEffect } from "react";
import {
  FaMicrophone,
  FaStop,
  FaUpload,
  FaPaperPlane,
  FaRegCopy,
  FaCalendarAlt,
  FaShareAlt,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const backendUrl = "https://social-media-generator-jhsl.onrender.com/generate";
const scheduleUrl = "https://social-media-generator-jhsl.onrender.com/schedule";

const PostGenerator = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) {
      alert("⚠️ You must be logged in.");
      navigate("/login");
    } else {
      setUserId(id);
    }
  }, [navigate]);

  const addMessage = (sender, text, extra = {}) => {
    setMessages((prev) => [...prev, { sender, text, ...extra }]);
  };

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
      }
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = async () => {
    if (!inputText && !audioBlob && !imageFile) return;
    addMessage("user", inputText || "🎤 Voice/Image input");

    const formData = new FormData();
    if (inputText) formData.append("text", inputText);
    if (imageFile) formData.append("image", imageFile);
    if (audioBlob) formData.append("voice", audioBlob, "voice.webm");

    setInputText("");
    setImageFile(null);
    setAudioBlob(null);
    setLoading(true);

    try {
      const res = await fetch(backendUrl, { method: "POST", body: formData });
      const data = await res.json();
      addMessage("ai", data.post || "❌ Could not generate post", { id: Date.now() });
    } catch {
      addMessage("ai", "❌ Server error", { id: Date.now() });
    } finally {
      setLoading(false);
    }
  };

  // Copy text to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Schedule post (prompt modal or direct scheduling logic)
  const handleSchedulePost = (text) => {
    const scheduledTime = prompt("Enter schedule datetime (YYYY-MM-DDTHH:MM):");
    if (!scheduledTime) return;

    fetch(scheduleUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: text,
        scheduled_time: scheduledTime,
        user_id: userId,
        platforms: "x,linkedin,facebook,instagram,threads",
      }),
    })
      .then((res) => res.json())
      .then((data) => alert(data.success || data.error))
      .catch(() => alert("Failed to schedule post"));
  };

  // Share button (opens prompt for platform)
  const handleShare = (text) => {
    const platform = prompt(
      "Enter platform: x, linkedin, facebook, instagram, threads"
    );
    if (!platform) return;

    const url = encodeURIComponent("https://example.com");
    const content = encodeURIComponent(text);

    switch (platform.toLowerCase()) {
      case "x":
        window.open(`https://twitter.com/intent/tweet?text=${content}&url=${url}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
        break;
      case "facebook":
        alert("Facebook only shares URLs. Copy manually.");
        break;
      case "instagram":
      case "threads":
        alert("Copy post manually for this platform.");
        break;
      default:
        alert("Unknown platform");
    }
  };

  return (
    <div className="flex h-screen bg-[#F7F7F8]">
      {/* Sidebar */}
      <Sidebar />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-xl p-4 rounded-xl shadow ${
                msg.sender === "user"
                  ? "bg-[#AD974F] text-white self-end"
                  : msg.sender === "ai"
                  ? "bg-white text-gray-800 self-start"
                  : "bg-gray-300 text-gray-800 self-start italic"
              }`}
            >
              <div>{msg.text}</div>
              {msg.sender === "ai" && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleCopy(msg.text)}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <FaRegCopy />
                  </button>
                  <button
                    onClick={() => handleSchedulePost(msg.text)}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <FaCalendarAlt />
                  </button>
                  <button
                    onClick={() => handleShare(msg.text)}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <FaShareAlt />
                  </button>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="max-w-xl p-4 rounded-xl shadow bg-gray-300 self-start italic">
              Generating...
            </div>
          )}
        </div>

        {/* Input Bar like ChatGPT */}
        <div className="p-4 border-t bg-white flex items-center gap-2">
          <label className="text-gray-500 hover:text-gray-800 cursor-pointer">
            <FaUpload size={20} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="hidden"
            />
          </label>
          <button
            onClick={handleRecord}
            className={`text-gray-500 hover:text-gray-800 ${
              isRecording ? "text-red-600" : ""
            }`}
          >
            {isRecording ? <FaStop size={20} /> : <FaMicrophone size={20} />}
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="ml-2 bg-[#AD974F] hover:bg-[#8E793E] text-white rounded-full p-2 flex items-center justify-center"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostGenerator;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ScheduleModal from "./ScheduleModal";

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

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

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

  const addMessage = (sender, text, extra = {}) =>
    setMessages((prev) => [...prev, { sender, text, ...extra }]);

  const togglePlatform = (platform) =>
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );

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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const openScheduleModal = (text) => {
    setModalText(text);
    setModalOpen(true);
    setScheduledTime("");
    setSelectedPlatforms([]);
  };

  const submitSchedule = async () => {
    if (!scheduledTime || selectedPlatforms.length === 0) {
      alert("Please select date/time and at least one platform");
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
        }),
      });
      const data = await res.json();
      alert(data.success || data.error);
      setModalOpen(false);
    } catch {
      alert("❌ Failed to schedule post");
    }
  };

  return (
    <div className="flex h-screen bg-[#F7F7F8]">
      {/* Sidebar */}
      

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              msg={msg}
              handleCopy={handleCopy}
              openScheduleModal={openScheduleModal}
            />
          ))}
          {loading && (
            <div className="max-w-xl p-4 rounded-xl shadow bg-gray-300 self-start italic">
              Generating...
            </div>
          )}
        </div>

        {/* Chat input fixed at bottom */}
        <div className="sticky bottom-0 bg-white border-t z-10">
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
    </div>
  );
};

export default PostGenerator;

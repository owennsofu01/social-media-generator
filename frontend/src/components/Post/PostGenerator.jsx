// PostGenerator.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ScheduleModal from "./ScheduleModal";
import { FaTimesCircle, FaRecycle } from "react-icons/fa";

const backendUrl = "http://127.0.0.1:5000/generate";
const scheduleUrl = "http://127.0.0.1:5000/schedule";

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  const baseClasses =
    "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl z-[9999] transition-opacity duration-300 flex items-center gap-3";
  const typeClasses = type === "error" ? "bg-red-500 text-white" : "bg-blue-600 text-white";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
      <button onClick={onClose} className="text-xl opacity-90 hover:opacity-100" aria-label="Close notification">
        <FaTimesCircle />
      </button>
    </div>
  );
};

const PostGenerator = () => {
  const navigate = useNavigate();

  // Basic states
  const [userId, setUserId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // AUDIO STATES
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Chat + UI states
  const [messages, setMessages] = useState([]); // messages contain { sender, text, id?, image_url?, meta? }
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Post parameter states (restored)
  const [postType, setPostType] = useState("marketing");
  const [tone, setTone] = useState("default");
  const [platform, setPlatform] = useState("general");
  const [wordCount, setWordCount] = useState("");

  // Schedule modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  // Regenerate modal states
  const [regenOpen, setRegenOpen] = useState(false);
  const [regenTargetId, setRegenTargetId] = useState(null);
  const [regenForm, setRegenForm] = useState({
    text: "",
    postType: "marketing",
    tone: "default",
    platform: "general",
    wordCount: "",
    includeImage: false,
    includeAudio: false,
  });
  const [regenLoading, setRegenLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // -------------------------------
  // Recording
  // -------------------------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (ev) => {
        audioChunksRef.current.push(ev.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      showNotification("🎤 Microphone access denied or error.", "error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // -------------------------------
  // Notifications & scroll
  // -------------------------------
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -------------------------------
  // Load user + saved messages
  // -------------------------------
  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) {
      showNotification("⚠️ You must be logged in to use the generator.", "error");
      navigate("/login");
    } else {
      setUserId(id);
    }
    const saved = localStorage.getItem("chat_messages");
    if (saved) setMessages(JSON.parse(saved));
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  // -------------------------------
  // Helpers: add and update messages
  // -------------------------------
  const addMessage = (sender, text, extra = {}) => {
    setMessages((prev) => [...prev, { sender, text, ...extra }]);
  };

  const updateMessageById = (id, patch) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  // -------------------------------
  // Send to backend (normal send)
  // -------------------------------
  const handleSend = async (opts = null) => {
    // opts optionally overrides current UI params (used when regenerating)
    const useText = opts?.text ?? inputText;
    const useImage = (opts && opts.includeImage) ? imageFile : imageFile && !opts; // default include image if present and not overriding
    const useAudio = (opts && opts.includeAudio) ? audioBlob : audioBlob && !opts;

    if (!useText && !useAudio && !useImage) return;

    // Show user message
    const userMessage = useText || (useAudio ? "🎤 Voice input" : "🖼️ Image input");
    addMessage("user", userMessage);

    // Prepare placeholder AI message with metadata (meta used for regen)
    const placeholderId = Date.now();
    const meta = {
      prompt: useText,
      postType: opts?.postType ?? postType,
      tone: opts?.tone ?? tone,
      platform: opts?.platform ?? platform,
      wordCount: opts?.wordCount ?? wordCount,
      hasImage: Boolean(useImage),
      hasAudio: Boolean(useAudio),
    };

    addMessage("ai", "🤖 AI is generating...", { id: placeholderId, meta });

    const formData = new FormData();
    if (useText) formData.append("text", useText);
    if (useImage) formData.append("image", useImage);
    if (useAudio) formData.append("voice", useAudio, "voice.webm");

    formData.append("type", meta.postType);
    formData.append("tone", meta.tone);
    formData.append("platform", meta.platform);
    if (meta.wordCount) formData.append("word_count", meta.wordCount);

    // Reset inputs (only if this was the normal send, not a regen call where user may want to keep)
    if (!opts) {
      setInputText("");
      setImageFile(null);
      setAudioBlob(null);
      setAudioUrl(null);
    }

    setLoading(true);

    try {
      const res = await fetch(backendUrl, { method: "POST", body: formData });
      const data = await res.json();

      let imageUrl = null;
      if (data.image_bytes) {
        const blob = new Blob([new Uint8Array(data.image_bytes)], { type: "image/png" });
        imageUrl = URL.createObjectURL(blob);
      }

      updateMessageById(placeholderId, {
        text: data.post || "❌ Could not generate post",
        image_url: imageUrl,
        meta,
      });

      showNotification("✅ Post generated successfully!");
    } catch (err) {
      console.error(err);
      updateMessageById(placeholderId, { text: "❌ Error generating post." });
      showNotification("❌ Unable to generate post.", "error");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Regenerate flow (open modal prefilled)
  // -------------------------------
  const openRegenForMessage = (msg) => {
    // msg is AI message object
    const meta = msg.meta || {};
    setRegenTargetId(msg.id ?? null);

    setRegenForm({
      text: meta.prompt ?? msg.text ?? "",
      postType: meta.postType ?? postType,
      tone: meta.tone ?? tone,
      platform: meta.platform ?? platform,
      wordCount: meta.wordCount ?? wordCount,
      includeImage: Boolean(meta.hasImage),
      includeAudio: Boolean(meta.hasAudio),
    });

    setRegenOpen(true);
  };

  const openRegenForLatest = () => {
    // find latest AI message
    const latestAi = [...messages].reverse().find((m) => m.sender === "ai");
    if (!latestAi) {
      showNotification("No AI message to regenerate.", "error");
      return;
    }
    openRegenForMessage(latestAi);
  };

  const openRegenFromInput = () => {
    // open modal using current input content as base
    setRegenTargetId(null); // will append a new AI message rather than replace
    setRegenForm({
      text: inputText,
      postType,
      tone,
      platform,
      wordCount,
      includeImage: Boolean(imageFile),
      includeAudio: Boolean(audioBlob),
    });
    setRegenOpen(true);
  };

  const submitRegenerate = async () => {
    // user confirmed regen with values in regenForm
    setRegenLoading(true);

    try {
      // If regenTargetId exists, we'll replace that message; otherwise create new conversation turn
      const opts = {
        text: regenForm.text,
        postType: regenForm.postType,
        tone: regenForm.tone,
        platform: regenForm.platform,
        wordCount: regenForm.wordCount,
        includeImage: regenForm.includeImage,
        includeAudio: regenForm.includeAudio,
      };

      // If we're replacing an existing AI message, we'll show a placeholder in its place and call backend.
      if (regenTargetId) {
        // Replace target AI message with a loading placeholder (keep same id)
        updateMessageById(regenTargetId, { text: "🤖 Regenerating...", image_url: null, meta: opts });
        // send request that will update this id once backend responds:
        const formData = new FormData();
        if (opts.text) formData.append("text", opts.text);
        if (opts.includeImage && imageFile) formData.append("image", imageFile);
        if (opts.includeAudio && audioBlob) formData.append("voice", audioBlob, "voice.webm");
        formData.append("type", opts.postType);
        formData.append("tone", opts.tone);
        formData.append("platform", opts.platform);
        if (opts.wordCount) formData.append("word_count", opts.wordCount);

        try {
          const res = await fetch(backendUrl, { method: "POST", body: formData });
          const data = await res.json();
          let imageUrl = null;
          if (data.image_bytes) {
            const blob = new Blob([new Uint8Array(data.image_bytes)], { type: "image/png" });
            imageUrl = URL.createObjectURL(blob);
          }
          updateMessageById(regenTargetId, {
            text: data.post || "❌ Could not regenerate post",
            image_url: imageUrl,
            meta: opts,
          });
          showNotification("✅ Post regenerated!");
        } catch (err) {
          console.error(err);
          updateMessageById(regenTargetId, { text: "❌ Error regenerating post." });
          showNotification("❌ Error regenerating post.", "error");
        }
      } else {
        // treat as a fresh send that the user wanted to craft from input
        await handleSend(opts);
      }
    } finally {
      setRegenLoading(false);
      setRegenOpen(false);
      setRegenTargetId(null);
    }
  };

  // -------------------------------
  // Schedule
  // -------------------------------
  const handleOpenScheduleModal = (text) => {
    setModalText(text);
    setModalOpen(true);
  };

  const togglePlatform = (platform) =>
    setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]));

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
        showNotification("✅ Post scheduled!");
        setModalOpen(false);
        setModalText("");
        setSelectedPlatforms([]);
      } else {
        showNotification(data.error || "Failed to schedule post.", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("❌ Scheduling error.", "error");
    }
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Options bar (keeps the param controls visible) */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4 shadow-sm flex flex-wrap gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Post Type:</label>
          <select value={postType} onChange={(e) => setPostType(e.target.value)} className="border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-sm">
            <option value="marketing">🎯 Marketing</option>
            <option value="personal_brand">👤 Personal Brand</option>
          </select>

          <label className="text-sm font-medium text-gray-700">Tone:</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-sm">
            <option value="default">Default</option>
            <option value="professional">Professional</option>
            <option value="funny">Funny</option>
            <option value="motivational">Motivational</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
          </select>

          <label className="text-sm font-medium text-gray-700">Platform:</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-sm">
            <option value="general">General</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter / X</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
          </select>

          <label className="text-sm font-medium text-gray-700">Word Count:</label>
          <input type="number" min="10" placeholder="e.g. 100" value={wordCount} onChange={(e) => setWordCount(e.target.value)} className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm" />
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <ChatMessage sender={msg.sender} text={msg.text} imageUrl={msg.image_url} audioUrl={msg.audio_url} onSchedule={handleOpenScheduleModal} onCopy={(t) => { navigator.clipboard?.writeText(t); showNotification("Copied to clipboard"); }} />
              
              {/* Regenerate button under every AI message */}
              {msg.sender === "ai" && (
                <div className="self-start mt-1">
                  <button
                    onClick={() => openRegenForMessage(msg)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm"
                    title="Regenerate this post (choose parameters)"
                  >
                    <FaRecycle /> Regenerate
                  </button>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="italic text-gray-600 animate-pulse">🤖 Generating post...</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Floating regenerate-from-input button (beside input) */}
        <div className="absolute left-6 bottom-28 z-30">
          <button
            onClick={openRegenFromInput}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50"
            title="Regenerate from current input"
          >
            <FaRecycle /> Regenerate (from input)
          </button>
        </div>

        {/* Input */}
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          handleSend={() => handleSend()}
          imageFile={imageFile}
          setImageFile={setImageFile}
          audioBlob={audioBlob}
          setAudioBlob={setAudioBlob}
          audioUrl={audioUrl}
          setAudioUrl={setAudioUrl}
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      </div>

      {/* Schedule Modal */}
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

      {/* Regenerate Modal */}
      {regenOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col gap-4 border border-gray-100">
            <h3 className="text-lg font-bold">Regenerate Post — customize parameters</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Prompt / Text</label>
                <textarea value={regenForm.text} onChange={(e) => setRegenForm((s) => ({ ...s, text: e.target.value }))} rows={4} className="w-full border rounded-lg p-3" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Post Type</label>
                <select value={regenForm.postType} onChange={(e) => setRegenForm((s) => ({ ...s, postType: e.target.value }))} className="w-full border rounded-lg p-2">
                  <option value="marketing">Marketing</option>
                  <option value="personal_brand">Personal Brand</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Tone</label>
                <select value={regenForm.tone} onChange={(e) => setRegenForm((s) => ({ ...s, tone: e.target.value }))} className="w-full border rounded-lg p-2">
                  <option value="default">Default</option>
                  <option value="professional">Professional</option>
                  <option value="funny">Funny</option>
                  <option value="motivational">Motivational</option>
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Platform</label>
                <select value={regenForm.platform} onChange={(e) => setRegenForm((s) => ({ ...s, platform: e.target.value }))} className="w-full border rounded-lg p-2">
                  <option value="general">General</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="facebook">Facebook</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Word Count</label>
                <input type="number" min="10" value={regenForm.wordCount} onChange={(e) => setRegenForm((s) => ({ ...s, wordCount: e.target.value }))} className="w-full border rounded-lg p-2" />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={regenForm.includeImage} onChange={(e) => setRegenForm((s) => ({ ...s, includeImage: e.target.checked }))} />
                  Include Image
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={regenForm.includeAudio} onChange={(e) => setRegenForm((s) => ({ ...s, includeAudio: e.target.checked }))} />
                  Include Audio
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button onClick={() => { setRegenOpen(false); setRegenTargetId(null); }} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={submitRegenerate} disabled={regenLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                {regenLoading ? "Regenerating..." : "Regenerate Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default PostGenerator;

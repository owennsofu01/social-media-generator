import React, { useState, useRef, useEffect } from "react";
import {
  FaMicrophone,
  FaStop,
  FaUpload,
  FaMagic,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { SiThreads } from "react-icons/si";
import { MdGraphicEq } from "react-icons/md";
import ScheduledPostsList from "../ScheduledPostsList";
import { useNavigate } from "react-router-dom";
import "./PostGenerator.css";

const backendUrl = "http://127.0.0.1:5000/generate";
const scheduleUrl = "http://127.0.0.1:5000/schedule";

const PostGenerator = () => {
  const navigate = useNavigate();
  const [userText, setUserText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordStatus, setRecordStatus] = useState("");
  const [postResult, setPostResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Get user from localStorage
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      alert("⚠️ You must be logged in to schedule posts.");
      navigate("/login");
    }
  }, [userId, navigate]);

  // 🎙️ Voice recording
  const handleRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          setAudioBlob(blob);
          setRecordStatus("✅ Recording complete");
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordStatus("🎙️ Recording...");
      } catch (error) {
        console.error(error);
        setRecordStatus("❌ Microphone not accessible");
      }
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordStatus("🛑 Recording stopped");
    }
  };

  // ⚡ Generate marketing post
  const handleGenerate = async () => {
    if (!userText && !audioBlob) {
      alert("Please type some text or record your voice.");
      return;
    }

    const formData = new FormData();
    if (userText) formData.append("text", userText);
    if (imageFile) formData.append("image", imageFile);
    if (audioBlob) formData.append("voice", audioBlob, "voice.webm");

    setLoading(true);
    setPostResult("");

    try {
      const res = await fetch(backendUrl, { method: "POST", body: formData });
      const data = await res.json();
      setPostResult(data.post || "Unable to generate post.");
    } catch (err) {
      console.error(err);
      setPostResult("❌ Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  // ⏰ Schedule post
  const handleSchedule = async () => {
    if (!userId) {
      return alert("⚠️ You must be logged in to schedule a post.");
    }
    if (!postResult || !scheduledTime) return alert("Post text or scheduled time missing");

    try {
      const res = await fetch(scheduleUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postResult,
          scheduled_time: scheduledTime,
          user_id: userId, // associate post with logged-in user
        }),
      });
      const data = await res.json();
      alert(data.success || data.error);
      setScheduledTime("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to schedule post");
    }
  };

  // 🌍 Social sharing
  const sharePost = (platform) => {
    const text = encodeURIComponent(postResult);
    const url = "https://example.com";

    switch (platform) {
      case "facebook":
        alert("Facebook only shares URLs. Copy the post manually.");
        break;
      case "x":
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
        break;
      case "instagram":
      case "threads":
        alert(`${platform.charAt(0).toUpperCase() + platform.slice(1)} does not support direct web sharing. Copy manually.`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="post-generator-wrapper">
      <div className="main-content">
        <div className="container">
          <div className="header">
            <MdGraphicEq size={28} style={{ marginRight: 8 }} />
            Social Media Post Generator
          </div>

          {/* 📝 Generated Post */}
          <div className="result">
            <h3>Generated Post:</h3>
            {loading ? <p>Loading...</p> : <p>{postResult}</p>}
          </div>

          {/* ✍️ Input Section */}
          <div className="inputs">
            <div className="inline-inputs">
              <input
                type="text"
                placeholder="Type your text here..."
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
              />
              <label htmlFor="file-upload" className="file-label">
                <FaUpload />
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                style={{ display: "none" }}
              />
              <button
                className={`record-btn ${isRecording ? "recording" : ""}`}
                onClick={handleRecord}
              >
                {isRecording ? <FaStop /> : <FaMicrophone />}
              </button>
            </div>

            {recordStatus && <p className="record-status">{recordStatus}</p>}

            <button className="generate-btn" onClick={handleGenerate}>
              <FaMagic style={{ marginRight: 8 }} /> Generate Post
            </button>
          </div>

          {/* ⏰ Schedule Post */}
          {postResult && !loading && (
            <div className="schedule-post">
              <h3>Schedule Post</h3>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
              <button onClick={handleSchedule}>Schedule Post</button>
            </div>
          )}

          {/* 🌍 Share Buttons */}
          {postResult && !loading && (
            <div className="share-section">
              <h3>Share on Social Media</h3>
              <div className="share-buttons">
                <button onClick={() => sharePost("facebook")}>
                  <FaFacebook /> Facebook
                </button>
                <button onClick={() => sharePost("x")}>
                  <FaTwitter /> X / Twitter
                </button>
                <button onClick={() => sharePost("linkedin")}>
                  <FaLinkedin /> LinkedIn
                </button>
                <button onClick={() => sharePost("instagram")}>
                  <FaInstagram /> Instagram
                </button>
                <button onClick={() => sharePost("threads")}>
                  <SiThreads /> Threads
                </button>
              </div>
            </div>
          )}

          <ScheduledPostsList />
        </div>
      </div>
    </div>
  );
};

export default PostGenerator;

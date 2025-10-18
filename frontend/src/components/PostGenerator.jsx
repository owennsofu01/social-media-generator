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
import ScheduledPostsList from "./ScheduledPostsList";
import { useNavigate } from "react-router-dom";

const backendUrl = "https://social-media-generator-jhsl.onrender.com/generate";
const scheduleUrl = "https://social-media-generator-jhsl.onrender.com/schedule";

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
  const [selectedPlatforms, setSelectedPlatforms] = useState([]); // ✅ Added

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      alert("⚠️ You must be logged in to schedule posts.");
      navigate("/login");
    }
  }, [userId, navigate]);

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

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

  const handleGenerate = async () => {
    if (!userText && !audioBlob) return alert("Please type some text or record your voice.");

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

  const handleSchedule = async () => {
    if (!userId) return alert("⚠️ You must be logged in to schedule a post.");
    if (!postResult || !scheduledTime) return alert("Post text or scheduled time missing");
    if (selectedPlatforms.length === 0) return alert("Select at least one platform");

    try {
      const res = await fetch(scheduleUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postResult,
          scheduled_time: scheduledTime,
          user_id: userId,
          platforms: selectedPlatforms.join(", "),
        }),
      });
      const data = await res.json();
      alert(data.success || data.error);
      setScheduledTime("");
      setSelectedPlatforms([]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to schedule post");
    }
  };

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
    <div className="min-h-screen bg-[#EAEAEA] py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center text-2xl font-bold text-[#231F20] mb-8">
          <MdGraphicEq size={28} className="mr-2 text-[#AD974F]" />
          AI Social Media Content Generator
        </div>

        {/* Section 1: Input */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">1. Create Content</h2>
          <p className="text-gray-600 mb-4">Type text, upload an image, or record voice to generate your post.</p>

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <input
              type="text"
              placeholder="Type your content idea..."
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
            />

            <label
              htmlFor="file-upload"
              className="bg-[#8E793E] hover:bg-[#AD974F] text-white px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 transition-colors duration-200"
            >
              <FaUpload /> Upload Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="hidden"
            />

            <button
              onClick={handleRecord}
              className={`px-4 py-2 rounded-xl text-white flex items-center gap-2 transition-colors duration-200 ${
                isRecording ? "bg-red-600 hover:bg-red-700" : "bg-[#8E793E] hover:bg-[#AD974F]"
              }`}
            >
              {isRecording ? <FaStop /> : <FaMicrophone />}
              {isRecording ? "Stop Recording" : "Record Voice"}
            </button>
          </div>

          {imageFile && <p className="text-gray-700 mt-2">🖼️ File attached: {imageFile.name}</p>}
          {recordStatus && <p className="text-gray-700 mt-1">{recordStatus}</p>}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 bg-[#AD974F] hover:bg-[#8E793E] text-white font-semibold px-6 py-2 rounded-xl flex items-center gap-2 transition-colors duration-200"
          >
            <FaMagic /> {loading ? "Generating..." : "Generate Post"}
          </button>
        </div>

        {/* Section 2: Result & Actions */}
        {postResult && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">2. Review & Deploy</h2>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Generated Post Preview:</h3>
              {loading ? <p>Loading...</p> : <p className="text-gray-800">{postResult}</p>}
            </div>

            {/* Schedule Post with platform selection */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">🗓️ Schedule Post</h4>
              <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
                />
                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                  {["x", "linkedin", "facebook", "instagram", "threads"].map((platform) => (
                    <label
                      key={platform}
                      className={`px-4 py-2 border rounded-xl cursor-pointer select-none transition-colors duration-200 ${
                        selectedPlatforms.includes(platform)
                          ? "bg-[#AD974F] text-white border-[#AD974F]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-[#EAEAEA]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedPlatforms.includes(platform)}
                        onChange={() => togglePlatform(platform)}
                      />
                      {platform === "x"
                        ? "X / Twitter"
                        : platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleSchedule}
                  disabled={!scheduledTime || selectedPlatforms.length === 0}
                  className="bg-[#8E793E] hover:bg-[#AD974F] text-white px-4 py-2 rounded-xl transition-colors duration-200"
                >
                  Schedule Post
                </button>
              </div>
            </div>

            {/* Share Buttons */}
            <div>
              <h4 className="font-semibold mb-2">🌐 Share Directly</h4>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => sharePost("x")} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors duration-200">
                  <FaTwitter /> X / Twitter
                </button>
                <button onClick={() => sharePost("linkedin")} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-xl transition-colors duration-200">
                  <FaLinkedin /> LinkedIn
                </button>
                <button onClick={() => sharePost("facebook")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors duration-200">
                  <FaFacebook /> Facebook
                </button>
                <button onClick={() => sharePost("instagram")} className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl transition-colors duration-200">
                  <FaInstagram /> Instagram
                </button>
                <button onClick={() => sharePost("threads")} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-xl transition-colors duration-200">
                  <SiThreads /> Threads
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Scheduled Posts */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">3. Scheduled Posts</h2>
          <ScheduledPostsList />
        </div>
      </div>
    </div>
  );
};

export default PostGenerator;

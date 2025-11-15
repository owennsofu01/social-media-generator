import React from "react";
import { FaUpload, FaMicrophone, FaStop, FaPaperPlane, FaTimes } from "react-icons/fa";

const ChatInput = ({
  inputText,
  setInputText,
  handleSend,
  handleRecord,
  isRecording,
  imageFile,
  setImageFile,
  audioBlob,
  audioUrl, // new prop
  setAudioUrl, // new prop
}) => {
  const isSendActive = inputText.trim() !== "" || audioBlob || Boolean(imageFile);

  const handleImageRemove = () => setImageFile(null);
  const handleAudioRemove = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-white border-t border-gray-200 shadow-lg">
      
      {/* Preview Section */}
      {imageFile && (
        <div className="relative w-24 h-24 mb-2">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-full h-full object-cover rounded-xl border border-gray-300"
          />
          <button
            onClick={handleImageRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
            aria-label="Remove image"
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}

      {/* Audio Preview */}
      {audioBlob && audioUrl && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-gray-100 rounded-lg border border-gray-300">
          <audio controls src={audioUrl} className="flex-1" />
          <button
            onClick={handleAudioRemove}
            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
            aria-label="Remove audio"
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Upload Button */}
        <label
          className="relative text-gray-500 hover:text-blue-600 transition duration-150 cursor-pointer p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
          title="Upload Image"
          aria-label="Upload Image"
        >
          <FaUpload size={20} />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (file) setImageFile(file);
            }}
            className="hidden"
          />
        </label>

        {/* Microphone Button */}
        <button
          onClick={handleRecord}
          className={`p-2 rounded-full transition duration-150 flex-shrink-0 
            ${isRecording 
              ? "bg-red-500 text-white hover:bg-red-600" 
              : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
            }`}
          title={isRecording ? "Stop Recording" : "Start Voice Recording"}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? <FaStop size={20} className="animate-pulse" /> : <FaMicrophone size={20} />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Describe your post idea or upload media..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && isSendActive && handleSend()}
          className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-base 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            shadow-inner transition duration-150"
          aria-label="Post input"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!isSendActive}
          className={`p-3 rounded-full flex-shrink-0 transition duration-200 ease-in-out
            ${isSendActive 
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          title="Generate Post"
          aria-label="Generate Post"
        >
          <FaPaperPlane size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

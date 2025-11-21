import React from "react";
import { FaUpload, FaMicrophone, FaStop, FaPaperPlane, FaTimes } from "react-icons/fa";

const ChatInput = ({
  inputText,
  setInputText,
  handleSend,
  startRecording,
  stopRecording,
  isRecording,
  imageFile,
  setImageFile,
  audioBlob,
  setAudioBlob,
  audioUrl,
  setAudioUrl,
}) => {
  const isSendActive =
    inputText.trim() !== "" || audioBlob || Boolean(imageFile);

  const handleImageRemove = () => setImageFile(null);

  const handleAudioRemove = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-white border-t border-gray-200 shadow-lg">
      {/* Image Preview */}
      {imageFile && (
        <div className="relative w-24 h-24 mb-2">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-full h-full object-cover rounded-xl border border-gray-300"
          />
          <button
            onClick={handleImageRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}

      {/* Audio Preview */}
      {audioBlob && audioUrl && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-gray-100 rounded-lg border">
          <audio controls src={audioUrl} className="flex-1" />
          <button
            onClick={handleAudioRemove}
            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Upload Image */}
        <label className="text-gray-500 hover:text-blue-600 cursor-pointer p-2 rounded-full hover:bg-gray-100">
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

        {/* Microphone Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-2 rounded-full ${
            isRecording
              ? "bg-red-500 text-white hover:bg-red-600"
              : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
          }`}
        >
          {isRecording ? (
            <FaStop size={20} className="animate-pulse" />
          ) : (
            <FaMicrophone size={20} />
          )}
        </button>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Describe your post idea or upload media..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && isSendActive && handleSend()}
          className="flex-1 rounded-xl border px-4 py-3"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!isSendActive}
          className={`p-3 rounded-full ${
            isSendActive
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <FaPaperPlane size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

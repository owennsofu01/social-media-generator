import React from "react";
import { FaUpload, FaMicrophone, FaStop, FaPaperPlane } from "react-icons/fa";

const ChatInput = ({
  inputText,
  setInputText,
  handleSend,
  handleRecord,
  isRecording,
  setImageFile,
}) => {
  // Determine if the send button should be primary (if there's any content)

  // **Note:** I've removed the redundant `audioBlob` check here since it's not a prop,
  // but if you pass it down, you should include it in `hasContent`.
  // For now, let's keep it simple based on text and recording state.
  const isSendActive = inputText.trim() !== "";

  return (
    <div className="flex items-center gap-2 p-3 bg-white">
      {/* Upload Button (Action Button 1) */}
      <label 
        className="relative text-gray-500 hover:text-blue-600 transition duration-150 cursor-pointer p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
        title="Upload Image"
      >
        <FaUpload size={20} />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
                setImageFile(file);
                // Optional: set a confirmation message in the input or chat
                // setInputText(`🖼️ Image selected: ${file.name}`); 
            }
          }}
          className="hidden"
        />
      </label>

      {/* Microphone Button (Action Button 2) */}
      <button
        onClick={handleRecord}
        className={`p-2 rounded-full transition duration-150 flex-shrink-0 
          ${isRecording 
            ? "bg-red-500 text-white hover:bg-red-600" 
            : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
          }`
        }
        title={isRecording ? "Stop Recording" : "Start Voice Recording"}
      >
        {isRecording ? <FaStop size={20} className="animate-pulse" /> : <FaMicrophone size={20} />}
      </button>

      {/* Text Input - Elevated and Focused */}
      <input
        type="text"
        placeholder="Describe your post idea or upload media..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-base 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   shadow-inner transition duration-150" // Added shadow-inner for depth
      />

      {/* Send Button - Clear Activation */}
      <button
        onClick={handleSend}
        disabled={!isSendActive}
        className={`p-3 rounded-full flex-shrink-0 transition duration-200 ease-in-out
          ${isSendActive 
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`
        }
        title="Generate Post"
      >
        <FaPaperPlane size={18} />
      </button>
    </div>
  );
};

export default ChatInput;
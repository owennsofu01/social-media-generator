import React from "react";
import { FaUpload, FaMicrophone, FaStop, FaPaperPlane } from "react-icons/fa";

const ChatInput = ({
  inputText,
  setInputText,
  handleSend,
  handleRecord,
  isRecording,
  setImageFile,
}) => (
  <div className="p-3 bg-white border-t flex items-center gap-2 md:gap-4">
    {/* Upload Button */}
    <label className="relative text-gray-500 hover:text-gray-800 cursor-pointer flex-shrink-0">
      <FaUpload size={20} />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="hidden"
      />
    </label>

    {/* Text Input */}
    <input
      type="text"
      placeholder="Type a message..."
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSend()}
      className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
    />

    {/* Microphone Button */}
    <button
      onClick={handleRecord}
      className={`text-gray-500 hover:text-gray-800 flex-shrink-0 ${
        isRecording ? "text-red-600" : ""
      }`}
    >
      {isRecording ? <FaStop size={20} /> : <FaMicrophone size={20} />}
    </button>

    {/* Send Button */}
    <button
      onClick={handleSend}
      className="bg-[#AD974F] hover:bg-[#8E793E] text-white p-2 rounded-full flex-shrink-0"
    >
      <FaPaperPlane size={18} />
    </button>
  </div>
);

export default ChatInput;

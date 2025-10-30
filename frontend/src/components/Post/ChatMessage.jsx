import React from "react";
import { FaRegCopy, FaCalendarAlt } from "react-icons/fa";
import ShareButtons from "./ShareButtons";

const ChatMessage = ({ msg, handleCopy, openScheduleModal }) => {
  // Use a modern, blue-based theme for user, and clean white for AI.
  const bgClass =
    msg.sender === "user"
      ? "bg-blue-600 text-white self-end rounded-br-md" // Primary color for user
      : msg.sender === "ai"
      ? "bg-white text-gray-800 self-start rounded-tl-md border border-gray-100" // Elevated AI response
      : "bg-gray-100 text-gray-600 self-start italic"; // System/status message

  const actionButtonClass = "p-1 rounded transition duration-150 text-gray-500 hover:text-blue-600 hover:bg-gray-100";

  return (
    <div
      className={`w-full max-w-lg p-4 rounded-xl shadow-md break-words ${bgClass}`} // Increased padding and stronger shadow
    >
      {/* Message Text */}
      <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div> 

      {/* AI-generated Image */}
      {msg.sender === "ai" && msg.image_url && (
        <div className="mt-4"> {/* Increased margin for separation */}
          <img
            src={msg.image_url}
            alt="AI Generated"
            className="rounded-lg shadow-lg w-full h-auto object-cover" // Added object-cover and w-full for consistent image sizing
          />
        </div>
      )}

      {/* Buttons and Actions */}
      {msg.sender === "ai" && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          
          {/* Action Buttons (Copy & Schedule) */}
          <div className="flex gap-1">
            <button
              onClick={() => handleCopy(msg.text)}
              className={actionButtonClass}
              title="Copy text to clipboard"
            >
              <FaRegCopy size={18} />
            </button>
            <button
              onClick={() => openScheduleModal(msg.text)}
              className={actionButtonClass}
              title="Schedule post for later"
            >
              <FaCalendarAlt size={18} />
            </button>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-2 items-center">
            <span className="text-xs font-medium text-gray-500 mr-1 hidden sm:inline">Share:</span>
            <ShareButtons
              post={{
                title: msg.text,
                url: msg.image_url 
                  ? msg.image_url
                  : window.location.href, // fallback to current page
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
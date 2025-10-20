import React from "react";
import { FaRegCopy, FaCalendarAlt } from "react-icons/fa";
import ShareButtons from "./ShareButtons";

const ChatMessage = ({ msg, handleCopy, openScheduleModal }) => {
  const bgClass =
    msg.sender === "user"
      ? "bg-[#AD974F] text-white self-end"
      : msg.sender === "ai"
      ? "bg-white text-gray-800 self-start"
      : "bg-gray-300 text-gray-800 self-start italic";

  return (
    <div
      className={`w-full sm:max-w-xl p-3 sm:p-4 rounded-xl shadow break-words ${bgClass}`}
    >
      <div>{msg.text}</div>

      {msg.sender === "ai" && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(msg.text)}
              className="text-gray-500 hover:text-gray-800 p-1 rounded"
              title="Copy text"
            >
              <FaRegCopy />
            </button>
            <button
              onClick={() => openScheduleModal(msg.text)}
              className="text-gray-500 hover:text-gray-800 p-1 rounded"
              title="Schedule post"
            >
              <FaCalendarAlt />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <ShareButtons text={msg.text} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

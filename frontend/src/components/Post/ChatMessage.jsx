import React, { useState } from "react";
import { FaRegCopy, FaCalendarAlt } from "react-icons/fa";
import ShareButtons from "./ShareButtons";

const ChatMessage = ({ sender, text, imageUrl, onCopy, onSchedule }) => {
const [copied, setCopied] = useState(false);

const bgClass =
sender === "user"
? "bg-blue-600 text-white self-end rounded-br-md"
: sender === "ai"
? "bg-white text-gray-800 self-start rounded-tl-md border border-gray-100 hover:shadow-xl transition-shadow duration-200"
: "bg-gray-100 text-gray-600 self-start italic";

const actionButtonClass =
"p-1 rounded transition duration-150 text-gray-500 hover:text-blue-600 hover:bg-gray-100";

const handleCopyClick = () => {
if (onCopy) {
onCopy(text);
setCopied(true);
setTimeout(() => setCopied(false), 2000); // reset after 2s
}
};

return (
<div
className={`w-full max-w-lg p-4 rounded-xl shadow-md break-words ${bgClass}`}
>
{/* Message Text */} <div className="text-sm leading-relaxed whitespace-pre-wrap">{text}</div>

```
  {/* AI-generated Image */}
  {sender === "ai" && imageUrl && (
    <div className="mt-4">
      <img
        src={imageUrl}
        alt={`Generated image for: ${text.slice(0, 30)}...`}
        className="rounded-lg shadow-lg w-full h-auto object-cover"
      />
    </div>
  )}

  {/* Buttons and Actions */}
  {sender === "ai" && (
    <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap justify-between items-center gap-2">
      {/* Action Buttons */}
      <div className="flex gap-1">
        <button
          onClick={handleCopyClick}
          className={actionButtonClass}
          title="Copy text to clipboard"
          aria-label="Copy text to clipboard"
        >
          <FaRegCopy size={18} />
        </button>

        {copied && (
          <span className="text-xs text-green-600 font-medium ml-1">
            Copied!
          </span>
        )}

        {onSchedule && (
          <button
            onClick={() => onSchedule(text)}
            className={actionButtonClass}
            title="Schedule post for later"
            aria-label="Schedule this post"
          >
            <FaCalendarAlt size={18} />
          </button>
        )}
      </div>

      {/* Share Buttons */}
      <div className="flex gap-2 items-center">
        <span className="text-xs font-medium text-gray-500 hidden sm:inline">
          Share:
        </span>
        <ShareButtons
          post={{
            title: text,
            url: imageUrl ? imageUrl : window.location.href,
          }}
        />
      </div>
    </div>
  )}
</div>


);
};

export default ChatMessage;

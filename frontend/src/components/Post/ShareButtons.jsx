import React from "react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";

const ShareButtons = ({ text }) => {
  const url = encodeURIComponent("https://example.com"); // your link
  const content = encodeURIComponent(text);
  const iconSize = 20; // base icon size

  const shareToPlatform = (platform) => {
    switch (platform) {
      case "x":
        window.open(`https://twitter.com/intent/tweet?text=${content}&url=${url}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
        break;
      case "facebook":
        alert("Facebook only shares URLs. Copy manually.");
        break;
      case "instagram":
      case "threads":
        alert("Copy post manually for this platform.");
        break;
      default:
        alert("Unknown platform");
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <button
        onClick={() => shareToPlatform("x")}
        className="text-blue-500 hover:text-blue-700 p-2 rounded"
        title="Share on X / Twitter"
      >
        <FaTwitter size={iconSize} />
      </button>

      <button
        onClick={() => shareToPlatform("linkedin")}
        className="text-blue-700 hover:text-blue-900 p-2 rounded"
        title="Share on LinkedIn"
      >
        <FaLinkedin size={iconSize} />
      </button>

      <button
        onClick={() => shareToPlatform("facebook")}
        className="text-blue-600 hover:text-blue-800 p-2 rounded"
        title="Share on Facebook"
      >
        <FaFacebook size={iconSize} />
      </button>

      <button
        onClick={() => shareToPlatform("instagram")}
        className="text-pink-500 hover:text-pink-700 p-2 rounded"
        title="Share on Instagram"
      >
        <FaInstagram size={iconSize} />
      </button>

      <button
        onClick={() => shareToPlatform("threads")}
        className="text-gray-700 hover:text-gray-900 p-2 rounded"
        title="Share on Threads"
      >
        <SiThreads size={iconSize} />
      </button>
    </div>
  );
};

export default ShareButtons;

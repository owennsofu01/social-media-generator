import React from "react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";

const ShareButtons = ({ post }) => {
  if (!post) return null;

  const url = encodeURIComponent(post.url || window.location.href);
  const content = encodeURIComponent(post.title || "");

  const shareToPlatform = (platform) => {
    switch (platform) {
      case "x":
        window.open(`https://twitter.com/intent/tweet?text=${content}&url=${url}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
        break;
      case "instagram":
      case "threads":
        // Since Instagram and Threads don't have direct sharing APIs for text/images,
        // we'll prompt the user and copy the text for them.
        navigator.clipboard.writeText(post.title);
        alert(`Content copied! Open ${platform} to paste manually.`);
        break;
      default:
        alert("Unknown platform");
    }
  };

  // Standard size for action icons
  const iconSize = 18;
  
  // Unified style for all share buttons: subtle background, primary color on hover
  const baseButtonClass = "p-2 rounded-full transition duration-150 text-gray-500 hover:text-white hover:bg-blue-600";

  // Use platform-specific colors only for the hover effect, for a splash of recognition
  const platformHoverColors = {
      x: "hover:bg-black",
      linkedin: "hover:bg-blue-700",
      facebook: "hover:bg-blue-600",
      instagram: "hover:bg-pink-600",
      threads: "hover:bg-black",
  };

  return (
    <div className="flex gap-2"> {/* Removed mt-2 since the parent (ChatMessage) handles the vertical spacing */}
      <button
        onClick={() => shareToPlatform("x")}
        className={`${baseButtonClass} ${platformHoverColors.x}`}
        title="Share on X / Twitter"
      >
        <FaTwitter size={iconSize} />
      </button>

      <button
        onClick={() => shareToPlatform("linkedin")}
        className={`${baseButtonClass} ${platformHoverColors.linkedin}`}
        title="Share on LinkedIn"
      >
        <FaLinkedin size={iconSize} />
      </button>

      <button
        onClick={() => shareToPlatform("facebook")}
        className={`${baseButtonClass} ${platformHoverColors.facebook}`}
        title="Share on Facebook"
      >
        <FaFacebook size={iconSize} />
      </button>

      <button
        onClick={() => shareToPlatform("instagram")}
        className={`${baseButtonClass} ${platformHoverColors.instagram}`}
        title="Share on Instagram (Copies text to clipboard)"
      >
        <FaInstagram size={iconSize} />
      </button>

      <button
        onClick={() => shareToPlatform("threads")}
        className={`${baseButtonClass} ${platformHoverColors.threads}`}
        title="Share on Threads (Copies text to clipboard)"
      >
        <SiThreads size={iconSize} />
      </button>
    </div>
  );
};

export default ShareButtons;
import React from "react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";

const ShareButtons = ({ post, onNotification }) => {
if (!post) return null;

const url = encodeURIComponent(post.url || window.location.href);
const content = encodeURIComponent(post.title || "");

const platforms = [
{ name: "x", icon: <FaTwitter />, title: "Share on X / Twitter", hover: "hover:bg-black" },
{ name: "linkedin", icon: <FaLinkedin />, title: "Share on LinkedIn", hover: "hover:bg-blue-700" },
{ name: "facebook", icon: <FaFacebook />, title: "Share on Facebook", hover: "hover:bg-blue-600" },
{ name: "instagram", icon: <FaInstagram />, title: "Share on Instagram (copies text)", hover: "hover:bg-pink-600" },
{ name: "threads", icon: <SiThreads />, title: "Share on Threads (copies text)", hover: "hover:bg-black" },
];

const iconSize = 18;
const baseButtonClass = "p-2 rounded-full transition duration-150 text-gray-500 hover:text-white shadow-sm";

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
navigator.clipboard.writeText(post.title)
.then(() => {
onNotification?.(
`Content copied! Paste it into ${platform.charAt(0).toUpperCase() + platform.slice(1)} manually.`,
"info"
);
})
.catch(() => {
onNotification?.(`Failed to copy content for ${platform}.`, "error");
});
break;
default:
onNotification?.("Unknown platform.", "error");
}
};

return ( <div className="flex gap-2">
{platforms.map((p) => (
<button
key={p.name}
onClick={() => shareToPlatform(p.name)}
className={`${baseButtonClass} ${p.hover} flex items-center justify-center`}
title={p.title}
>
{React.cloneElement(p.icon, { size: iconSize })} </button>
))} </div>
);
};

export default ShareButtons;

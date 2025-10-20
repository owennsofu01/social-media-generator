/* eslint-disable react-refresh/only-export-components */
import React from "react";

// --------------------
// Inline SVG Icons
// --------------------

const IconRobot = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
    <path d="M78 304v136H434V304H78zm16-48h40V168h-40v88zm360 0h40V168h-40v88zm-344-96h40V88h-40v80zm320 0h40V88h-40v80zM78 32h356v32H78V32zm30 136h316v32H108v-32zm0 160h316v32H108v-32zm0 96h316v32H108v-32zM216 112h80v32h-80v-32zm0 192h80v32h-80v-32z" />
  </svg>
);

const IconCalendar = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
    <path d="M12 192h424V80H12v112zm424 48H12v240h424V240z" />
  </svg>
);

const IconShare = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
    <path d="M448 160c-26.5 0-48 21.5-48 48s21.5 48 48 48c4.2 0 8.3-.5 12.3-1.5L256 384v-72c0-26.5-21.5-48-48-48H48v-32h160c26.5 0 48-21.5 48-48V128l204.3 129.5c-4 .9-8.1 1.5-12.3 1.5z" />
  </svg>
);

const IconUsers = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor">
    <path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64c-35.3 0-64 28.7-64 64s28.7 64 64 64zM544 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zM320 256c53 0 96-43 96-96S373 64 320 64s-96 43-96 96 43 96 96 96zM96 288C43 288 0 331 0 384v32h192v-32c0-53-43-96-96-96zm448 0c-53 0-96 43-96 96v32h192v-32c0-53-43-96-96-96zM320 288c-61.9 0-112 50.1-112 112v48h224v-48c0-61.9-50.1-112-112-112z" />
  </svg>
);

// --------------------
// Export Benefits Array
// --------------------

export const benefits = [
  {
    icon: <IconRobot className="w-10 h-10 text-[#8E793E]" />,
    title: "AI-Powered Content",
    desc: "Generate engaging posts, headlines, and captions instantly with our intelligent AI algorithms.",
  },
  {
    icon: <IconCalendar className="w-10 h-10 text-[#AD974F]" />,
    title: "Schedule & Automate",
    desc: "Visually plan your entire content calendar and automate posting across all channels.",
  },
  {
    icon: <IconShare className="w-10 h-10 text-[#231F20]" />,
    title: "Multi-Platform Mastery",
    desc: "Connect and share across Instagram, Facebook, Twitter, and LinkedIn effortlessly.",
  },
  {
    icon: <IconUsers className="w-10 h-10 text-[#8E793E]" />,
    title: "Intuitive Collaboration",
    desc: "Modern interface for teams, making content approval and creation seamless.",
  },
];

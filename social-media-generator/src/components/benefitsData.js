import React from 'react';

// Inline SVG Icons
const IconRobot = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M78 304v136H434V304H78zm16-48h40V168h-40v88zm360 0h40V168h-40v88zm-344-96h40V88h-40v80zm320 0h40V88h-40v80zM78 32h356v32H78V32zm30 136h316v32H108v-32zm0 160h316v32H108v-32zm0 96h316v32H108v-32zM216 112h80v32h-80v-32zm0 192h80v32h-80v-32z"/>
  </svg>
);

const IconCalendar = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path d="M12 192h424V80H12v112zm424 48H12v240h424V240z"/>
  </svg>
);

const IconShare = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M448 160c-26.5 0-48 21.5-48 48s21.5 48 48 48..."/>
  </svg>
);

const IconUsers = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
    <path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64..."/>
  </svg>
);

export const benefits = [
  {
    icon: <IconRobot className="benefit-icon" />,
    title: "AI-Powered Content",
    desc: "Generate engaging posts, headlines, and captions instantly with our intelligent AI algorithms.",
  },
  {
    icon: <IconCalendar className="benefit-icon" />,
    title: "Schedule & Automate",
    desc: "Visually plan your entire content calendar and automate posting across all channels.",
  },
  {
    icon: <IconShare className="benefit-icon" />,
    title: "Multi-Platform Mastery",
    desc: "Connect and share across Instagram, Facebook, Twitter, and LinkedIn effortlessly.",
  },
  {
    icon: <IconUsers className="benefit-icon" />,
    title: "Intuitive Collaboration",
    desc: "Modern interface for teams, making content approval and creation seamless.",
  },
];

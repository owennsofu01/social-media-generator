import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaPaperPlane,
  FaCalendarAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu open

  const menuItems = [
    { icon: <FaHome />, label: "Home", path: "/" },
    { icon: <FaPaperPlane />, label: "Post Generator", path: "/post-generator" },
    { icon: <FaCalendarAlt />, label: "Scheduled Posts", path: "/scheduled-posts" },
    { icon: <FaUser />, label: "Profile", path: "/profile" },
    { icon: <FaCog />, label: "Settings", path: "/settings" },
    { icon: <FaSignOutAlt />, label: "Logout", path: "/login" },
  ];

  const handleNavigation = (path) => {
    if (path === "/login") localStorage.removeItem("user_id");
    navigate(path);
    setIsOpen(false); // Close mobile menu
  };

  return (
    <>
      {/* Header with Hamburger (mobile only) */}
      <header className="md:hidden flex items-center justify-between bg-[#231F20] text-white p-4 shadow-md fixed w-full z-50">
        <h2 className="text-xl font-bold">Owenito AI</h2>
        <button onClick={() => setIsOpen(true)}>
          <FaBars size={24} />
        </button>
      </header>

      {/* Sidebar overlay + slide-in menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#231F20] text-white shadow-lg z-50 w-64 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <FaTimes size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-2 px-4 mt-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 w-full text-left ${
                  isActive
                    ? "bg-[#AD974F] text-white shadow-inner"
                    : "hover:bg-[#AD974F] text-gray-200"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Push content down so header does not cover it */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Sidebar;

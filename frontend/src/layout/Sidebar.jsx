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
  // NOTE: This component assumes React Router (useNavigate, useLocation) is available.
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu open state

  const menuItems = [
    { icon: <FaHome />, label: "Home", path: "/" },
    { icon: <FaPaperPlane />, label: "Post Generator", path: "/post-generator" },
    { icon: <FaCalendarAlt />, label: "Scheduled Posts", path: "/scheduled-posts" },
    { icon: <FaUser />, label: "Profile", path: "/profile" },
    { icon: <FaCog />, label: "Settings", path: "/settings" },
    { icon: <FaSignOutAlt />, label: "Logout", path: "/login" },
  ];

  const handleNavigation = (path) => {
    if (path === "/login") {
      // Assuming a simple logout mechanism for demonstration
      localStorage.removeItem("user_id");
      // Add more robust authentication clear logic if necessary
    }
    navigate(path);
    setIsOpen(false); // Close mobile menu after navigation
  };

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path;
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left w-full font-medium";
    
    // Using blue as the primary active color
    const activeClass = "bg-blue-600 text-white shadow-lg"; 
    const inactiveClass = "hover:bg-gray-700 text-gray-200";

    return (
      <button
        onClick={() => handleNavigation(item.path)}
        className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
      >
        {item.icon}
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* ======= Header for Mobile (Fixed Top Bar) ======= */}
      <header className="md:hidden flex items-center justify-between bg-gray-800 text-white p-4 shadow-xl sticky top-0 w-full z-50">
        <h2 className="text-xl font-bold text-blue-400">Owenito AI</h2>
        <button onClick={() => setIsOpen(true)} className="p-1 rounded hover:bg-gray-700 transition">
          <FaBars size={24} />
        </button>
      </header>

      {/* ======= Desktop Sidebar (Always visible) ======= */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-xl flex-col p-5 z-40">
        <h2 className="text-3xl font-extrabold mb-8 text-blue-400 border-b border-gray-700 pb-3">Owenito AI</h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <NavLink key={index} item={item} />
          ))}
        </nav>
      </aside>

      {/* ======= Mobile Sidebar (Slide-in) ======= */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-2xl z-50 w-64 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-blue-400">Owenito AI</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-gray-800 transition">
            <FaTimes size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-4 mt-4">
          {menuItems.map((item, index) => (
            <NavLink key={index} item={item} />
          ))}
        </nav>
      </div>

      {/* ======= Overlay for Mobile ======= */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* ======= Spacing below mobile header (to prevent content overlap) ======= */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Sidebar;

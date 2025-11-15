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
  FaColumns,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: <FaHome size={20} />, label: "Home", path: "/" },
    { icon: <FaPaperPlane size={20} />, label: "Post Generator", path: "/post-generator" },
    { icon: <FaCalendarAlt size={20} />, label: "Scheduled Posts", path: "/scheduled-posts" },
    { icon: <FaUser size={20} />, label: "Profile", path: "/profile" },
    { icon: <FaCog size={20} />, label: "Settings", path: "/settings" },
    { icon: <FaSignOutAlt size={20} />, label: "Logout", path: "/login" },
  ];

  const handleNavigation = (path) => {
    if (path === "/login" && typeof localStorage !== "undefined") {
      localStorage.removeItem("user_id");
    }
    navigate(path);
    setIsOpen(false);
  };

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path;
    const baseClass =
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left w-full font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800";
    const activeClass = "bg-blue-600 text-white shadow-lg";
    const inactiveClass = "text-gray-300 hover:bg-gray-700 hover:text-white";

    return (
      <button
        onClick={() => handleNavigation(item.path)}
        onKeyPress={(e) => e.key === "Enter" && handleNavigation(item.path)}
        aria-current={isActive ? "page" : undefined}
        className={`${baseClass} ${isActive ? activeClass : inactiveClass} relative group`}
      >
        {item.icon}
        <span
          className={`transition-opacity duration-300 ease-in-out ${
            isCollapsed ? "opacity-0 w-0 h-0 hidden" : "opacity-100 w-auto ml-3"
          }`}
        >
          {item.label}
        </span>

        {isCollapsed && (
          <span className="absolute z-50 left-full ml-4 px-3 py-1 bg-gray-700 text-white text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {item.label}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <header className="md:hidden fixed top-0 left-0 w-full bg-gray-900 text-white flex justify-between items-center p-4 z-40 shadow-2xl">
        <h1 className="text-2xl font-extrabold text-blue-400">Owenito AI</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl text-gray-200 hover:bg-gray-700 transition focus:ring-2 focus:ring-blue-500"
          aria-label="Open Menu"
        >
          <FaBars size={24} />
        </button>
      </header>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={`hidden md:flex h-screen bg-gray-800 text-white shadow-xl flex-col p-5 z-40 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } overflow-y-auto flex-shrink-0`}
      >
        {/* Logo + Collapse Button */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-3">
          <h2
            className={`text-3xl font-extrabold text-blue-400 transition-opacity duration-300 overflow-hidden ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            }`}
          >
            Owenito AI
          </h2>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-200 hover:text-blue-400 p-2 rounded-full hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <FaColumns size={20} /> : <FaTimes size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, idx) => (
            <NavLink key={idx} item={item} />
          ))}
        </nav>
      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-2xl z-50 w-64 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-blue-400">Owenito AI</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full text-gray-200 hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close Menu"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-4 mt-4">
          {menuItems.map((item, idx) => (
            <NavLink key={idx} item={item} />
          ))}
        </nav>
      </div>

      {/* ================= BACKDROP ================= */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Mobile Spacer (prevent overlap with header) */}
      <div className="md:hidden h-20"></div>
    </>
  );
};

export default Sidebar;

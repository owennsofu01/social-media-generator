import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Determine text color based on scroll state for better visibility
  const baseTextColor = isScrolled ? "text-gray-700" : "text-black";
  const logoTextColor = isScrolled ? "text-gray-900" : "text-black";
  const mobileIconColor = isScrolled ? "text-gray-800" : "text-black";
  const mobileNavBg = isScrolled ? "bg-white" : "bg-gray-800"; // Use a dark background for mobile menu when transparent

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/404", label: "Pricing" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-xl py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-10">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          // Dynamic text color
          className={`text-2xl font-bold ${logoTextColor} hover:text-blue-600 transition-colors`}
        >
          Owenito <span className="text-blue-600">Social Studio</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className={`text-2xl ${mobileIconColor} md:hidden focus:outline-none`}
          aria-label={menuOpen ? "Close Menu" : "Open Menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links (Desktop & Mobile) */}
        <nav
          className={`absolute md:static top-16 left-0 w-full md:w-auto ${mobileNavBg} md:bg-transparent shadow-xl md:shadow-none transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-y-0" : "-translate-y-[150%]"
          } md:translate-y-0 rounded-b-xl md:rounded-none`}
        >
          <ul className="flex flex-col md:flex-row items-center md:space-x-8 py-2 md:py-0">
            {navLinks.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={closeMenu}
                  className={`block px-6 py-3 md:p-0 font-medium transition-colors border-b-2 border-transparent md:border-none ${
                    location.pathname === item.path
                      ? "text-blue-600 md:border-blue-600"
                      : `${baseTextColor} hover:text-blue-500`
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            
            <li>
              {/* Get Started Button */}
              <Link
                to="/register"
                onClick={closeMenu}
                // Updated to primary blue color
                className="mt-2 mb-4 md:my-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

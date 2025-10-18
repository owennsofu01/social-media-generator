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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-10">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-bold text-[#231F20] hover:text-[#AD974F] transition-colors"
        >
          Owenito <span className="text-[#8E793E]">Social Studio</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="text-2xl text-[#231F20] md:hidden focus:outline-none"
          aria-label={menuOpen ? "Close Menu" : "Open Menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <nav
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-y-0" : "-translate-y-[150%]"
          } md:translate-y-0`}
        >
          <ul className="flex flex-col md:flex-row items-center md:space-x-8">
            <li>
              <Link
                to="/"
                onClick={closeMenu}
                className={`block px-6 py-3 md:p-0 font-medium transition-colors ${
                  location.pathname === "/"
                    ? "text-[#AD974F]"
                    : "text-[#231F20] hover:text-[#8E793E]"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                onClick={closeMenu}
                className={`block px-6 py-3 md:p-0 font-medium transition-colors ${
                  location.pathname === "/pricing"
                    ? "text-[#AD974F]"
                    : "text-[#231F20] hover:text-[#8E793E]"
                }`}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                onClick={closeMenu}
                className="mt-2 md:mt-0 bg-[#8E793E] hover:bg-[#AD974F] text-white font-semibold rounded-full px-6 py-2 transition-all duration-200"
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

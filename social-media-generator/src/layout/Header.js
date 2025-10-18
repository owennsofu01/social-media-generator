import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation(); // To highlight the active link

  // Toggle menu state
  const toggleMenu = () => setMenuOpen(!menuOpen);
  // Close menu and reset focus
  const closeMenu = () => setMenuOpen(false);

  // Effect to handle header shrink/shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect to close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <header className={`main-header ${isScrolled ? "scrolled" : ""}`}>
      <Link to="/" className="logo" onClick={closeMenu}>
        Owenito Social Studio
      </Link>

      {/* Hamburger Icon for Mobile */}
      <button
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label={menuOpen ? "Close Menu" : "Open Menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`nav-links ${menuOpen ? "active" : ""}`} aria-label="Main Navigation">
        <Link
          to="/"
          className={`nav-item ${location.pathname === "/" ? "active-link" : ""}`}
          onClick={closeMenu}
        >
          Home
        </Link>
        <Link
          to="/pricing"
          className={`nav-item ${location.pathname === "/pricing" ? "active-link" : ""}`}
          onClick={closeMenu}
        >
          Pricing
        </Link>
        <Link
          to="/register"
          className="btn-get-started"
          onClick={closeMenu}
        >
          Get Started
        </Link>
      </nav>
    </header>
  );
};

export default Header;
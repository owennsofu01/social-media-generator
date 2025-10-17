import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="main-header">
      <div className="logo animate-logo">AI Post Maker</div>
      <nav className="nav-links animate-nav">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/pricing" className="nav-item">Pricing</Link>
        <Link to="/register" className="btn-get-started">Get Started</Link>
      </nav>
    </header>
  );
};

export default Header;

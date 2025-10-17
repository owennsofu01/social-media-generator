import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">AI Post Maker</div>
        <p>© {new Date().getFullYear()} AI Post Maker. All rights reserved.</p>

        <div className="social-icons">
          <button onClick={() => alert("Facebook link coming soon")} aria-label="Facebook">
            <FaFacebook />
          </button>
          <button onClick={() => alert("Twitter link coming soon")} aria-label="Twitter">
            <FaTwitter />
          </button>
          <button onClick={() => alert("LinkedIn link coming soon")} aria-label="LinkedIn">
            <FaLinkedin />
          </button>
          <button onClick={() => alert("Instagram link coming soon")} aria-label="Instagram">
            <FaInstagram />
          </button>
          <button onClick={() => alert("Threads link coming soon")} aria-label="Threads">
            <SiThreads />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

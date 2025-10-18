import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-[#231F20] text-white py-10">
      <div className="container mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo and Copyright */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2">AI Post Maker</h2>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} AI Post Maker. All rights reserved.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 text-xl">
          <button
            onClick={() => alert("Facebook link coming soon")}
            aria-label="Facebook"
            className="hover:text-[#AD974F] transition-colors duration-200"
          >
            <FaFacebook />
          </button>
          <button
            onClick={() => alert("Twitter link coming soon")}
            aria-label="Twitter"
            className="hover:text-[#AD974F] transition-colors duration-200"
          >
            <FaTwitter />
          </button>
          <button
            onClick={() => alert("LinkedIn link coming soon")}
            aria-label="LinkedIn"
            className="hover:text-[#AD974F] transition-colors duration-200"
          >
            <FaLinkedin />
          </button>
          <button
            onClick={() => alert("Instagram link coming soon")}
            aria-label="Instagram"
            className="hover:text-[#AD974F] transition-colors duration-200"
          >
            <FaInstagram />
          </button>
          <button
            onClick={() => alert("Threads link coming soon")}
            aria-label="Threads"
            className="hover:text-[#AD974F] transition-colors duration-200"
          >
            <SiThreads />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

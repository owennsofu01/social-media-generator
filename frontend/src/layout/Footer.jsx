import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";
import { Link } from "react-router-dom"; // Import Link for navigation

const Footer = () => {
  // Define social links (use '#' as a temporary placeholder)
  const socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook" },
  
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
 
  ];

  return (
    // Updated background to a dark, professional blue/gray
    <footer className="bg-gray-800 text-white py-12 border-t-4 border-blue-600">
      <div className="container mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Logo and Copyright */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-extrabold mb-2 text-white">
            Owenito <span className="text-blue-400">Social Studio</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            © {new Date().getFullYear()} Owenito Social Studio. All rights reserved.
          </p>
        </div>

        {/* Navigation Links (Optional addition for utility) */}
        <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2 text-gray-300 text-sm font-medium">
            <Link to="/about" className="hover:text-blue-400 transition-colors">About</Link>
            <Link to="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link>
            <Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-6 text-2xl">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                // Updated to use blue accent color
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <Icon />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

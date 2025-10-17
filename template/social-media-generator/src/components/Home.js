import React from "react";
import { Link } from "react-router-dom";
import { FaRobot, FaCalendarAlt, FaShareAlt, FaUsers } from "react-icons/fa";
import "./Home.css";

const benefits = [
  {
    icon: <FaRobot />,
    title: "AI-Powered Content",
    desc: "Generate engaging posts instantly with our AI algorithms.",
  },
  {
    icon: <FaCalendarAlt />,
    title: "Schedule & Automate",
    desc: "Plan your content in advance and save time on posting.",
  },
  {
    icon: <FaShareAlt />,
    title: "Multi-Platform Sharing",
    desc: "Share your content across multiple social media platforms effortlessly.",
  },
  {
    icon: <FaUsers />,
    title: "User-Friendly Interface",
    desc: "Clean and intuitive design, easy to navigate for everyone.",
  },
];

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">Supercharge Your Social Media</h1>
          <p className="hero-subtitle">
            Create, schedule, and share your posts effortlessly with AI-powered tools.
          </p>
          <Link to="/post-generator" className="btn-hero">
            Get Started
          </Link>
        </div>
        <div className="hero-image">
          <img
            src="https://via.placeholder.com/500x350.png?text=AI+Post+Maker"
            alt="AI Post Maker"
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <h2 className="section-title">Why Choose AI Post Maker?</h2>
        <div className="benefits-grid">
          {benefits.map((item, idx) => (
            <div key={idx} className="benefit-card">
              <div className="benefit-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
            {/* Call-to-Action Section */}
<section className="cta-section">
  {/* Floating Icons */}
  <div className="cta-icon cta-icon-1">🚀</div>
  <div className="cta-icon cta-icon-2">✨</div>
  <div className="cta-icon cta-icon-3">📢</div>

  <h2 className="cta-title">Ready to Boost Your Social Media?</h2>
  <p className="cta-subtitle">Get started today or talk to us to learn more!</p>
  <div className="cta-buttons">
    <Link to="/pricing" className="btn-cta btn-plan">View Plans</Link>
    <Link to="/contact" className="btn-cta btn-contact">Talk to Us</Link>
  </div>
</section>

    </div>
  );
};

export default Home;

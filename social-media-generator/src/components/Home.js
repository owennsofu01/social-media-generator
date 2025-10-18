import React from 'react';
import './Home.css';
import { benefits } from './benefitsData';
import { testimonials } from './testimonialsData';

// Mock Link component (if react-router-dom not available)
const Link = ({ to, children, className, onClick }) => (
  <a href={to} className={className} onClick={onClick} style={{ cursor: 'pointer', textDecoration: 'none' }}>
    {children}
  </a>
);

// --- Inline SVG Icon for Testimonials ---
const IconQuote = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M464 256h-80c-26.5 0-48 21.5-48 48v160c0 26.5 21.5 48 48 48h80c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-448 0H16c-26.5 0-48 21.5-48 48v160c0 26.5 21.5 48 48 48h80c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"/>
  </svg>
);

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Supercharge Your <span>Social Media</span>
          </h1>
          <p className="hero-subtitle">
            Create, schedule, and analyze your social posts effortlessly with AI-powered tools. Get started in minutes, not hours.
          </p>
          <Link to="/post-generator" className="btn-hero">
            Start Generating Content
          </Link>
        </div>

        <div className="hero-image" aria-label="Mockup of AI Post Generator Interface">
          <img
            src="https://placehold.co/500x350/16a34a/ffffff?text=AI+Dashboard+Mockup"
            alt="AI Post Maker Dashboard Mockup"
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <h2 className="section-title">Why Owenito Social Studio?</h2>
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

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">Trusted by Modern Marketers</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="testimonial-card">
              <IconQuote className="quote-icon" />
              <p className="testimonial-quote">{testimonial.quote}</p>
              <p className="testimonial-name">{testimonial.name}</p>
              <p className="testimonial-title">{testimonial.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <div className="cta-icon cta-icon-1">🚀</div>
        <div className="cta-icon cta-icon-2">✨</div>
        <div className="cta-icon cta-icon-3">📢</div>
        <div className="cta-icon cta-icon-4">🤖</div>

        <h2 className="cta-title">Ready to Boost Your Social Media?</h2>
        <p className="cta-subtitle">Start your free trial today. No credit card required.</p>

        <div className="cta-buttons">
          <Link to="/pricing" className="btn-cta btn-plan">View Plans & Pricing</Link>
          <Link to="/contact" className="btn-cta btn-contact">Request a Demo</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

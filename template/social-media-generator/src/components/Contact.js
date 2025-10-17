import React, { useState } from "react";
import "./Contact.css";
import { FaPhone, FaEnvelope, FaWhatsapp } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can send formData to backend or email API
    console.log(formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">
      <h2 className="contact-title">Contact Us</h2>

      <div className="contact-container">
        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows="6"
            required
          ></textarea>
          <button type="submit">Send Message</button>
          {submitted && <p className="success-msg">Message sent successfully!</p>}
        </form>

        {/* Contact Details */}
        <div className="contact-details">
          <h3>Get in Touch</h3>
          <p>
            <FaPhone className="contact-icon" /> Phone: +260 123 456 789
          </p>
          <p>
            <FaEnvelope className="contact-icon" /> Email: info@aipostmaker.com
          </p>
          <p>
            <FaWhatsapp className="contact-icon" /> WhatsApp: +260 987 654 321
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

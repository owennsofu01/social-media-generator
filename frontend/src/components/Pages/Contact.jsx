import React, { useState } from "react";
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
    // Send formData to backend or email API here
    console.log(formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#EAEAEA] py-16 px-6">
      <h2 className="text-4xl font-bold text-[#231F20] text-center mb-12">Contact Us</h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <form
          className="bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows="6"
            required
            className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
          ></textarea>
          <button
            type="submit"
            className="bg-[#8E793E] hover:bg-[#AD974F] text-white font-semibold py-2 rounded-xl transition-colors duration-200"
          >
            Send Message
          </button>
          {submitted && (
            <p className="text-green-600 font-semibold mt-2 text-center">
              Message sent successfully!
            </p>
          )}
        </form>

        {/* Contact Details */}
        <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-[#231F20]">Get in Touch</h3>
          <p className="flex items-center gap-3 text-gray-700">
            <FaPhone className="text-[#AD974F]" /> +260 123 456 789
          </p>
          <p className="flex items-center gap-3 text-gray-700">
            <FaEnvelope className="text-[#AD974F]" /> info@aipostmaker.com
          </p>
          <p className="flex items-center gap-3 text-gray-700">
            <FaWhatsapp className="text-[#AD974F]" /> +260 987 654 321
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

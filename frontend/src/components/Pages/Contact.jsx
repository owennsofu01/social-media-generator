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
    // In a real app, this would send data to a service (e.g., Firebase, email API)
    console.log(formData); 
    setSubmitted(true);
    // Reset form after a slight delay for better UX
    setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
        setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-6 md:px-10">
      <h2 className="text-4xl md:text-5xl font-extrabold text-blue-800 text-center mb-6">
        Get in Touch
      </h2>
      <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
        We'd love to hear from you. Reach out to our team using the form or the direct links below.
      </p>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        
        {/* Contact Form */}
        <form
          className="bg-white p-10 rounded-2xl shadow-xl flex flex-col gap-6 transform transition-all duration-300 hover:shadow-2xl"
          onSubmit={handleSubmit}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 transition-colors"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 transition-colors"
          />
          <textarea
            name="message"
            placeholder="Tell us how we can help..."
            value={formData.message}
            onChange={handleChange}
            rows="6"
            required
            className="px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 resize-none transition-colors"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl disabled:opacity-50"
            disabled={submitted}
          >
            {submitted ? "Message Sent!" : "Send Message"}
          </button>
          
          {submitted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-2" role="alert">
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline"> Your message has been received.</span>
            </div>
          )}
        </form>

        {/* Contact Details */}
        <div className="bg-blue-600 text-white p-10 rounded-2xl shadow-xl flex flex-col justify-center gap-8">
          <h3 className="text-3xl font-bold mb-4">Direct Contact</h3>
          <p className="text-blue-200">
            Prefer a direct line? You can reach us via phone, email, or WhatsApp.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-xl">
              <FaPhone className="text-blue-200 w-6 h-6 flex-shrink-0" /> 
              <span className="font-medium">+260 123 456 789</span>
            </div>
            <div className="flex items-center gap-4 text-xl">
              <FaEnvelope className="text-blue-200 w-6 h-6 flex-shrink-0" /> 
              <span className="font-medium">info@aipostmaker.com</span>
            </div>
            <div className="flex items-center gap-4 text-xl">
              <FaWhatsapp className="text-blue-200 w-6 h-6 flex-shrink-0" /> 
              <span className="font-medium">+260 987 654 321</span>
            </div>
          </div>
          
          <div className="mt-4">
              <p className="text-sm text-blue-300">
                  Business Hours: Mon - Fri, 9:00 AM - 5:00 PM (CAT)
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

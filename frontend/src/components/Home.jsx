import React from "react";
import { Link } from "react-router-dom"; // React Router Link
import { benefits } from "./benefitsData.jsx";
import { testimonials } from "./testimonialsData.js";

// Inline SVG Icon for Testimonials
const IconQuote = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
  >
    <path d="M464 256h-80c-26.5 0-48 21.5-48 48v160c0 26.5 21.5 48 48 48h80c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-448 0H16c-26.5 0-48 21.5-48 48v160c0 26.5 21.5 48 48 48h80c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z" />
  </svg>
);

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="bg-[#EAEAEA] py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-10 flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Hero Text */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-[#231F20] mb-6">
              Supercharge Your <span className="text-[#AD974F]">Social Media</span>
            </h1>
            <p className="text-gray-700 mb-8 text-lg md:text-xl">
              Create, schedule, and analyze your social posts effortlessly with
              AI-powered tools. Get started in minutes, not hours.
            </p>
            <Link
              to="/post-generator"
              className="bg-[#8E793E] hover:bg-[#AD974F] text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200 inline-block"
            >
              Start Generating Content
            </Link>
          </div>

          {/* Hero Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://placehold.co/500x350/16a34a/ffffff?text=AI+Dashboard+Mockup"
              alt="AI Post Maker Dashboard Mockup"
              className="rounded-2xl shadow-lg w-full max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#231F20] mb-12">
          Why Owenito Social Studio?
        </h2>
        <div className="container mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4 text-4xl">{item.icon}</div>
              <h3 className="text-xl font-semibold text-[#231F20] mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#F9F9F9]">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#231F20] mb-12">
          Trusted by Modern Marketers
        </h2>
        <div className="container mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <IconQuote className="w-8 h-8 text-[#AD974F] mb-4 mx-auto" />
              <p className="text-gray-700 italic mb-4">{testimonial.quote}</p>
              <p className="text-[#231F20] font-semibold">{testimonial.name}</p>
              <p className="text-gray-500 text-sm">{testimonial.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-[#8E793E] relative overflow-hidden text-white text-center">
        {/* Decorative Icons */}
        <div className="absolute top-0 left-0 text-6xl opacity-10 animate-pulse">🚀</div>
        <div className="absolute top-20 right-10 text-6xl opacity-10 animate-bounce">✨</div>
        <div className="absolute bottom-10 left-20 text-6xl opacity-10 animate-bounce">📢</div>
        <div className="absolute bottom-0 right-0 text-6xl opacity-10 animate-pulse">🤖</div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Boost Your Social Media?
        </h2>
        <p className="text-lg md:text-xl mb-8">
          Start your free trial today. No credit card required.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Link
            to="/pricing"
            className="bg-[#AD974F] hover:bg-[#231F20] text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200"
          >
            View Plans & Pricing
          </Link>
          <Link
            to="/contact"
            className="border border-white hover:bg-white hover:text-[#231F20] text-white font-semibold px-8 py-3 rounded-full transition-all duration-200"
          >
            Request a Demo
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

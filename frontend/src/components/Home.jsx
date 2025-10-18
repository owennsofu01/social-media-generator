import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ Framer Motion import
import { benefits } from "./benefitsData.jsx";
import { testimonials } from "./testimonialsData.js";

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
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="bg-[#EAEAEA] py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-10 flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Hero Text */}
          <motion.div
            className="md:w-1/2 text-center md:text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            variants={fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#231F20] mb-6">
              Supercharge Your <span className="text-[#AD974F]">Social Media</span>
            </h1>
            <p className="text-gray-700 mb-8 text-lg md:text-xl">
              Create, schedule, and analyze your social posts effortlessly with
              AI-powered tools. Get started in minutes, not hours.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/post-generator"
                className="bg-[#8E793E] hover:bg-[#AD974F] text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200 inline-block"
              >
                Start Generating Content
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <img
              src="https://placehold.co/500x350/16a34a/ffffff?text=AI+Dashboard+Mockup"
              alt="AI Post Maker Dashboard Mockup"
              className="rounded-2xl shadow-lg w-full max-w-md"
            />
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      {/* Why Choose Us Section */}
<section className="py-20">
  <h2 className="text-3xl md:text-4xl font-bold text-center text-[#231F20] mb-12">
    Why Owenito Social Studio?
  </h2>

  {/* Parent motion div for stagger */}
  <motion.div
    className="container mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      visible: {
        transition: {
          staggerChildren: 0.2, // ⬅ stagger animation for children
        },
      },
    }}
  >
    {benefits.map((item, idx) => (
      <motion.div
        key={idx}
        className="bg-white rounded-2xl shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-4 text-4xl">{item.icon}</div>
        <h3 className="text-xl font-semibold text-[#231F20] mb-2">{item.title}</h3>
        <p className="text-gray-600">{item.desc}</p>
      </motion.div>
    ))}
  </motion.div>
</section>


      {/* Testimonials Section */}
      <section className="py-20 bg-[#F9F9F9]">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#231F20] mb-12">
          Trusted by Modern Marketers
        </h2>
        <div className="container mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              variants={fadeInUp}
            >
              <IconQuote className="w-8 h-8 text-[#AD974F] mb-4 mx-auto" />
              <p className="text-gray-700 italic mb-4">{testimonial.quote}</p>
              <p className="text-[#231F20] font-semibold">{testimonial.name}</p>
              <p className="text-gray-500 text-sm">{testimonial.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-[#8E793E] relative overflow-hidden text-white text-center">
        <motion.div
          className="absolute top-0 left-0 text-6xl opacity-10"
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          🚀
        </motion.div>
        <motion.div
          className="absolute top-20 right-10 text-6xl opacity-10"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-20 text-6xl opacity-10"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          📢
        </motion.div>
        <motion.div
          className="absolute bottom-0 right-0 text-6xl opacity-10"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          🤖
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Ready to Boost Your Social Media?
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Start your free trial today. No credit card required.
        </motion.p>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/pricing"
              className="bg-[#AD974F] hover:bg-[#231F20] text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200"
            >
              View Plans & Pricing
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact"
              className="border border-white hover:bg-white hover:text-[#231F20] text-white font-semibold px-8 py-3 rounded-full transition-all duration-200"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

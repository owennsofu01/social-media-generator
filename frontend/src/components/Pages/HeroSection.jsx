import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  return (
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
            Create, schedule, and analyze your social posts effortlessly with AI-powered tools.
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
  );
};

export default HeroSection;

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import HeroVideo from "../../assets/video.mp4";

const HeroSection = () => {
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  return (
    // Updated background to white for a cleaner look
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-6 md:px-10 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Hero Text */}
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          variants={fadeInUp}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Supercharge Your <span className="text-blue-600">Social Media</span>
          </h1>
          <p className="text-gray-600 mb-10 text-xl md:text-2xl font-light">
            Create, schedule, and analyze your social posts effortlessly with powerful, "AI-driven tools".
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/post-generator"
              // Updated to use the primary blue color
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-10 py-4 rounded-xl transition-all duration-300 inline-block shadow-lg hover:shadow-xl transform"
            >
              Start Generating Content
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Video/Placeholder */}
        <motion.div
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <div className="relative w-full max-w-md bg-gray-100 rounded-3xl shadow-2xl overflow-hidden aspect-video">
            {/* Using an element that visually represents a video placeholder in case the external URL fails */}
            <video
              src={HeroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-3xl"
              poster="https://placehold.co/500x300/3B82F6/FFFFFF?text=AI+Workflow+Demo" // Poster for loading state
            >
              <p className="p-4 text-gray-500 text-center">Your workflow demonstration video will appear here.</p>
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

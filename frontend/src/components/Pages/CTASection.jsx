import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CTASection = () => (
  <section className="py-20 bg-[#8E793E] relative overflow-hidden text-white text-center">
    {["🚀", "✨", "📢", "🤖"].map((emoji, idx) => (
      <motion.div
        key={idx}
        className={`absolute text-6xl opacity-10 ${idx === 0 ? "top-0 left-0" : idx === 1 ? "top-20 right-10" : idx === 2 ? "bottom-10 left-20" : "bottom-0 right-0"}`}
        animate={{ y: [0, 15 * (idx % 2 === 0 ? 1 : -1), 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        {emoji}
      </motion.div>
    ))}

    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold mb-4">
      Ready to Boost Your Social Media?
    </motion.h2>
    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="text-lg md:text-xl mb-8">
      Start your free trial today. No credit card required.
    </motion.p>

    <div className="flex flex-col md:flex-row justify-center gap-6">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link to="/pricing" className="bg-[#AD974F] hover:bg-[#231F20] text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200">
          View Plans & Pricing
        </Link>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link to="/contact" className="border border-white hover:bg-white hover:text-[#231F20] text-white font-semibold px-8 py-3 rounded-full transition-all duration-200">
          Contact Us
        </Link>
      </motion.div>
    </div>
  </section>
);

export default CTASection;

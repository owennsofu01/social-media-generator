import React from "react";
import { Link } from "react-router-dom";


const CTASection = () => (
  // Updated background to a striking blue for high contrast
  <section className="py-20 bg-blue-700 relative overflow-hidden text-white text-center rounded-t-3xl">
    {/* Animated background elements (emojis) */}
    {["🚀", "✨", "📢", "🤖"].map((emoji, idx) => (
      <motion.div
        key={idx}
        className={`absolute text-6xl opacity-10 ${
          idx === 0 ? "top-0 left-0" : idx === 1 ? "top-20 right-10" : idx === 2 ? "bottom-10 left-20" : "bottom-0 right-0"
        }`}
        animate={{ y: [0, 15 * (idx % 2 === 0 ? 1 : -1), 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        {emoji}
      </motion.div>
    ))}

    <div className="relative z-10"> {/* Ensure content is above the animated emojis */}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        viewport={{ once: true }} 
        className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
      >
        Ready to Boost Your Social Media?
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.2 }} 
        viewport={{ once: true }} 
        className="text-lg md:text-xl mb-10 font-light"
      >
        Start your free trial today. No credit card required.
      </motion.p>

      <div className="flex flex-col md:flex-row justify-center gap-6">
        {/* Primary Button: Inverted to white for maximum contrast */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/register" 
            className="bg-white hover:bg-gray-100 text-blue-700 font-bold 
                       px-10 py-3.5 rounded-full transition-colors duration-200 
                       shadow-2xl text-lg inline-block"
          >
            Start Free Trial
          </Link>
        </motion.div>
        
        {/* Secondary Button: Outlined white border */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/pricing" 
            className="border-2 border-white hover:bg-white hover:text-blue-700 text-white 
                       font-semibold px-8 py-3.5 rounded-full transition-all duration-200 
                       text-lg inline-block"
          >
            View Plans & Pricing
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CTASection;

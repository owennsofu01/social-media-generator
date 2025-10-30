import React from "react";

import { testimonials } from "../Data/testimonialsData.js";

const IconQuote = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
    {/* Updated path to use a more modern, single quote icon if possible, but keeping the original path for reliability */}
    <path d="M464 256h-80c-26.5 0-48 21.5-48 48v160c0 26.5 21.5 48 48 48h80c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-448 0H16c-26.5 0-48 21.5-48 48v160c0 26.5 21.5 48 48 48h80c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z" />
  </svg>
);

const TestimonialsSection = () => {
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  return (
    <section className="py-20 bg-gray-50">
      <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-14 tracking-tight">
        Trusted by Modern Marketers
      </h2>

      <div className="container mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 transform 
                       hover:shadow-2xl hover:-translate-y-1 border-t-4 border-blue-600/0 hover:border-blue-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            variants={fadeInUp}
          >
            {/* Quote icon updated to primary blue color */}
            <div className="flex justify-start">
              <IconQuote className="w-8 h-8 text-blue-600 mb-6" />
            </div>

            <p className="text-gray-700 italic mb-6 text-lg leading-relaxed">"{testimonial.quote}"</p>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-900 font-bold text-base">{testimonial.name}</p>
              <p className="text-blue-600 text-sm font-medium">{testimonial.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;

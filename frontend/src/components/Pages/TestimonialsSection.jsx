import React from "react";
import { motion } from "framer-motion";
import { testimonials } from "../Data/testimonialsData.js";

const IconQuote = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
    <path d="M464 256h-80c-26.5 0-48 21.5-48 48v160c0 26.5 21.5 48 48 48h80c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-448 0H16c-26.5 0-48 21.5-48 48v160c0 26.5 21.5 48 48 48h80c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z" />
  </svg>
);

const TestimonialsSection = () => {
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  return (
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
  );
};

export default TestimonialsSection;

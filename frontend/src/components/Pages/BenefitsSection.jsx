import React from "react";

import { benefits } from "../Data/benefitsData.jsx";

const BenefitsSection = () => {
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  return (
    <section className="py-20 ">
      <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-14 tracking-tight">
        Why Owenito Social Studio?
      </h2>

      <motion.div
        className="container mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {benefits.map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-xl shadow-lg p-8 text-center cursor-pointer 
                       hover:shadow-2xl hover:border-blue-500 border border-transparent 
                       transition-all duration-300 transform hover:-translate-y-1"
            whileHover={{ scale: 1.02 }} // Slightly reduced scale for cleaner look
            whileTap={{ scale: 0.98 }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            {/* Icon updated to use primary blue color */}
            <div className="flex justify-center mb-5 text-5xl text-blue-600">
              {item.icon}
            </div>
            {/* Title updated for better contrast */}
            <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
            {/* Description remains clean and readable */}
            <p className="text-gray-500 text-base">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default BenefitsSection;

import React from "react";
import { motion } from "framer-motion";
import { benefits } from "../Data/benefitsData.jsx";

const BenefitsSection = () => {
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  return (
    <section className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#231F20] mb-12">
        Why Owenito Social Studio?
      </h2>

      <motion.div
        className="container mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        {benefits.map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-4 text-4xl">{item.icon}</div>
            <h3 className="text-xl font-semibold text-[#231F20] mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default BenefitsSection;

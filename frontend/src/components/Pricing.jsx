import React from "react";
import { motion } from "framer-motion";

const plans = [
  {
    title: "Basic",
    price: "$4.99/month",
    features: [
      "Generate up to 5 text posts/day",
      "Basic post scheduling",
      "Share to 1 platform",
      "No image upload",
      "No voice recording",
    ],
  },
  {
    title: "Pro",
    price: "$9.99/month",
    features: [
      "Unlimited text posts",
      "Upload images",
      "Record voice for posts",
      "Advanced post scheduling",
      "Share to multiple platforms (X, LinkedIn, Facebook)",
      "Email support",
    ],
  },
  {
    title: "Premium",
    price: "$19.99/month",
    features: [
      "All Pro features",
      "Priority AI generation",
      "Full social media automation",
      "Share to all supported platforms (including Instagram & Threads)",
      "Dedicated support",
    ],
  },
];

const Pricing = () => {
  return (
    <section className="bg-[#EAEAEA] min-h-screen py-16 px-6 md:px-10">
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-[#231F20] mb-8">
          Pricing Plans
        </h2>
        <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
          Choose a plan that fits your social media needs. Upgrade anytime to unlock more features.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl font-semibold text-[#231F20] mb-4">
                {plan.title}
              </h3>
              <p className="text-3xl font-bold text-[#8E793E] mb-6">
                {plan.price}
              </p>
              <ul className="text-gray-700 mb-6 space-y-2 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#AD974F] font-bold">✔</span> {feature}
                  </li>
                ))}
              </ul>
              <button className="bg-[#AD974F] hover:bg-[#8E793E] text-white font-semibold px-6 py-2 rounded-full w-full">
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Pricing;

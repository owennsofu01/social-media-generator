import React from "react";


// Define animation variants for the grid container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay between each card's animation start
    },
  },
};

// Define animation variants for each individual plan card
const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

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
    <section className="bg-gray-50 min-h-screen py-20 px-6 md:px-10">
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }} // Update the main header block to animate slightly
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Simple, Transparent <span className="text-blue-600">Pricing Plans</span>
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
          Choose a plan that fits your social media needs. Upgrade anytime to unlock more features.
        </p>

        {/* This motion.div now controls the staggered scroll-in animation */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              className={`rounded-3xl shadow-xl p-8 transition-all duration-500 flex flex-col ${
                idx === 1
                  ? "bg-blue-600 text-white transform scale-[1.02]" // Highlighted Pro plan
                  : "bg-white hover:shadow-2xl"
              }`}
              whileHover={{ scale: idx === 1 ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants} // Apply the item animation for stagger effect
            >
              <h3 className={`text-3xl font-bold mb-2 ${idx !== 1 ? "text-gray-900" : "text-white"}`}>
                {plan.title}
              </h3>
              <p className={`text-4xl font-extrabold mb-6 ${idx !== 1 ? "text-blue-600" : "text-white"}`}>
                {plan.price}
              </p>

              <ul className="mb-8 space-y-3 text-left flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className={`flex items-start gap-3 ${idx !== 1 ? "text-gray-700" : "text-blue-100"}`}>
                    <span className={`flex-shrink-0 text-xl ${idx !== 1 ? "text-blue-500" : "text-blue-100"}`}>
                      {/* Using Lucide React icons with a small fallback SVG if not available */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`font-semibold px-8 py-3 rounded-xl w-full text-lg transition-all duration-300 shadow-md ${
                  idx === 1
                    ? "bg-white text-blue-600 hover:bg-blue-50/90" // Highlighted button
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Choose Plan
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Pricing;

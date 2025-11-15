import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import CardPaymentForm from "./CardPaymentForm";
import axios from "axios";

const plans = [
  {
    title: "Basic",
    price: "$4.99/month",
    amount: "5",
    features: [
      { name: "Generate 2 posts per day", available: true },
      { name: "Schedule on 1 social media platform", available: true },
      { name: "Can copy posts", available: true },
      { name: "Schedule on 3 social media platforms", available: false },
      { name: "Image generation", available: false },
      { name: "Word count feature", available: false },
      { name: "Unlimited post generation", available: false },
      { name: "Full access to all features", available: false },
      { name: "Copy & share posts", available: false },
    ],
  },
  {
    title: "Pro",
    price: "$9.99/month",
    amount: "10",
    features: [
      { name: "Generate 4 posts per day", available: true },
      { name: "Schedule on 3 social media platforms", available: true },
      { name: "Image generation", available: true },
      { name: "Word count feature", available: true },
      { name: "Can copy posts", available: true },
      { name: "Unlimited post generation", available: false },
      { name: "Full access to all features", available: false },
      { name: "Copy & share posts", available: false },
    ],
  },
  {
    title: "Premium",
    price: "$19.99/month",
    amount: "20",
    features: [
      { name: "Unlimited post generation", available: true },
      { name: "Full scheduling on all platforms", available: true },
      { name: "Copy & share posts", available: true },
      { name: "Image generation", available: true },
      { name: "Word count feature", available: true },
      { name: "All features unlocked", available: true },
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("mobile_money");

  const handleChoosePlan = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

 // ---------- Mobile Money Payment (Demo Simulation) ----------
const handleMobilePayment = async () => {
  if (!mobileNumber) {
    toast.error("Please enter your mobile number for Mobile Money payment.");
    return;
  }

  const referenceNo = `INV-${Date.now()}`;
  setShowPaymentModal(false); // hide modal while "processing"
  toast.loading("Processing payment...", { id: "payment" });

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 seconds delay

    // Simulate a successful transaction response
    const simulatedResponse = {
      transaction_id: referenceNo,
      status: "success",
      amount: selectedPlan.amount,
      customer_phone: mobileNumber,
      plan: selectedPlan.title,
    };

    toast.success(
      `Payment successful! Transaction ID: ${simulatedResponse.transaction_id}`,
      { id: "payment" }
    );

    // Navigate to post-generator after success
    navigate("/post-generator");
  } catch (err) {
    console.error(err);
    toast.error("Payment failed.", { id: "payment" });
    navigate("/cancel");
  }
};


  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold text-center mb-8">Pricing Plans</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-2xl shadow-lg flex flex-col border transition-transform hover:scale-105 ${
              plan.title === "Premium"
                ? "border-blue-500 shadow-2xl"
                : "border-gray-200"
            }`}
          >
            {plan.title === "Premium" && (
              <div className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full w-max mb-3">
                Featured
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
            <p className="text-3xl font-extrabold mb-6">{plan.price}</p>

            <ul className="mb-6 space-y-2">
              {plan.features.map((feature, fIdx) => (
                <li
                  key={fIdx}
                  className={`flex items-center gap-2 ${
                    feature.available
                      ? plan.title === "Premium"
                        ? "text-green-600 font-semibold"
                        : "text-gray-800"
                      : "text-gray-400 line-through"
                  }`}
                >
                  {feature.available ? <FaCheckCircle /> : <FaTimesCircle />}
                  {feature.name}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleChoosePlan(plan)}
              className={`mt-auto py-3 rounded-lg text-white font-semibold transition-colors flex justify-center items-center gap-2 ${
                plan.title === "Premium"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Choose Plan
            </button>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-xl p-8 m-10 w-200 relative shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4">Select Payment Method</h3>

              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
              >
                <option value="mobile_money">Mobile Money</option>
                <option value="card">Card</option>
              </select>

              {selectedMethod === "mobile_money" ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter your mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleMobilePayment}
                    className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Pay {selectedPlan?.price}
                  </button>
                </>
              ) : (
                <CardPaymentForm plan={selectedPlan} />
              )}

              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pricing;

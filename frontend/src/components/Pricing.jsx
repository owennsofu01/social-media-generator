import React from "react";

const Pricing = () => {
  const handleCheckout = (plan) => {
    alert(`You selected the ${plan} plan. Payment integration coming soon!`);
  };

  return (
    <section className="bg-[#EAEAEA] min-h-screen py-16">
      <div className="container mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-4xl font-bold text-[#231F20] mb-4">
          Pricing Plans
        </h2>
        <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
          Choose a plan that suits your needs. Upgrade anytime for more
          features.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="bg-white shadow-md rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#231F20] mb-2">
              Basic
            </h3>
            <p className="text-3xl font-bold text-[#8E793E] mb-6">
              $4.99<span className="text-base font-normal">/month</span>
            </p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>Generate up to 5 posts per day</li>
              <li>Upload images</li>
              <li>Basic scheduling</li>
            </ul>
            <button
              onClick={() => handleCheckout("Basic")}
              className="bg-[#8E793E] hover:bg-[#AD974F] text-white font-semibold px-6 py-2 rounded-full transition-colors duration-200"
            >
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white shadow-lg border-t-4 border-[#AD974F] rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-semibold text-[#231F20] mb-2">
              Pro
            </h3>
            <p className="text-3xl font-bold text-[#AD974F] mb-6">
              $9.99<span className="text-base font-normal">/month</span>
            </p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>Unlimited posts per day</li>
              <li>Upload images & voice</li>
              <li>Advanced scheduling</li>
              <li>Email support</li>
            </ul>
            <button
              onClick={() => handleCheckout("Pro")}
              className="bg-[#AD974F] hover:bg-[#8E793E] text-white font-semibold px-6 py-2 rounded-full transition-colors duration-200"
            >
              Choose Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white shadow-md rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#231F20] mb-2">
              Premium
            </h3>
            <p className="text-3xl font-bold text-[#8E793E] mb-6">
              $19.99<span className="text-base font-normal">/month</span>
            </p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>All Pro features</li>
              <li>Priority AI generation</li>
              <li>Full social media automation</li>
              <li>Dedicated support</li>
            </ul>
            <button
              onClick={() => handleCheckout("Premium")}
              className="bg-[#231F20] hover:bg-[#8E793E] text-white font-semibold px-6 py-2 rounded-full transition-colors duration-200"
            >
              Go Premium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

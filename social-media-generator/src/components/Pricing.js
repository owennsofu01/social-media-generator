import React from "react";
import "./Pricing.css";

const Pricing = () => {
  return (
    <div className="pricing-page">
      <h2 className="pricing-title">Pricing Plans</h2>
      <p className="pricing-subtitle">
        Choose a plan that suits your needs. Upgrade anytime for more features.
      </p>

      <div className="pricing-cards">
        <div className="card">
          <h3>Basic</h3>
          <p className="price">$4.99/month</p>
          <ul>
            <li>Generate up to 5 posts per day</li>
            <li>Upload images</li>
            <li>Basic scheduling</li>
          </ul>
          <button className="btn">Get Started</button>
        </div>

        <div className="card card-pro">
          <h3>Pro</h3>
          <p className="price">$9.99/month</p>
          <ul>
            <li>Unlimited posts per day</li>
            <li>Upload images & voice</li>
            <li>Advanced scheduling</li>
            <li>Email support</li>
          </ul>
          <button className="btn btn-pro">Choose Plan</button>
        </div>

        <div className="card card-premium">
          <h3>Premium</h3>
          <p className="price">$19.99/month</p>
          <ul>
            <li>All Pro features</li>
            <li>Priority AI generation</li>
            <li>Full social media automation</li>
            <li>Dedicated support</li>
          </ul>
          <button className="btn btn-premium">Go Premium</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

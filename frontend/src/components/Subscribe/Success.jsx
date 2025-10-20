import React from "react";
import { useLocation } from "react-router-dom";

const Success = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");

  return (
    <div style={{ padding: "100px", textAlign: "center" }}>
      <h1>Payment Successful!</h1>
      {plan && <p>You have selected the <strong>{plan}</strong> plan. 🎉</p>}
      <p>Thank you for subscribing!</p>
    </div>
  );
};

export default Success;

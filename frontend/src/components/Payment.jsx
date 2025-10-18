import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_YOUR_PUBLISHABLE_KEY"); // Replace with your key

const CheckoutForm = ({ plan, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Send plan to backend to create a PaymentIntent
    const res = await fetch("http://127.0.0.1:5000/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const { clientSecret } = await res.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      alert("Payment successful!");
      onClose();
    }
  };

  return (
    <form className="modal-content" onSubmit={handleSubmit}>
      <h3>Pay for {plan} plan</h3>
      <CardElement />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
      <button type="button" className="btn-cancel" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export const PaymentModal = ({ plan, onClose }) => (
  <div className="payment-modal">
    <Elements stripe={stripePromise}>
      <CheckoutForm plan={plan} onClose={onClose} />
    </Elements>
  </div>
);

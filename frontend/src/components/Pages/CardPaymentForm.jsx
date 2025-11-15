import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CardPaymentForm = ({ plan }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reference_no: `CARD-${Date.now()}`,
    amount: plan?.amount || "",
    description: `Subscription: ${plan?.title}`,
    first_name: "",
    last_name: "",
    address: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    currency: "USD",
    // Card info (sandbox test)
    card_number: "4111111111111111",
    cvv: "971",
    expiry_date: "20/2028",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/payments/pay-with-card",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(
        `Card payment successful! Transaction ID: ${
          response.data.zynle_response.transaction_id || "N/A"
        }`
      );
      navigate("/success");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Card payment failed.");
      navigate("/cancel");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    "first_name",
    "last_name",
    "address",
    "email",
    "phone",
    "city",
    "state",
    "zip_code",
    "country",
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Pay with Card</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium capitalize mb-1">
                {key.replace("_", " ")}
              </label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Card info (read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input
              type="text"
              value={formData.card_number}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CVV</label>
            <input
              type="text"
              value={formData.cvv}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expiry</label>
            <input
              type="text"
              value={formData.expiry_date}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : `Pay ${plan?.price}`}
        </button>
      </form>
    </div>
  );
};

export default CardPaymentForm;

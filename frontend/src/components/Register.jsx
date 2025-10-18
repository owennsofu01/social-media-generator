import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const backendUrl = "https://social-media-generator-jhsl.onrender.com/register";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("username", username);
        setMessage("✅ Registration successful!");
        navigate("/post-generator");
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setLoading(false);
      setMessage("❌ Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAEAEA] px-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#231F20] mb-2 text-center">Create Account</h2>
        <p className="text-gray-600 mb-6 text-center">
          Join now and start generating AI-powered social posts!
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8E793E] hover:bg-[#AD974F] text-white font-semibold py-2 rounded-xl transition-colors duration-200 flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {message && <p className="mt-4 text-center">{message}</p>}

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#AD974F] font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

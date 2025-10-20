// src/components/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaApple } from "react-icons/fa";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../../firebase";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email || !password) {
      setMessage("❌ All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem("user_id", user.uid);
      localStorage.setItem("username", user.email); // always use email

      navigate("/post-generator");
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setMessage("❌ No user found with this email.");
          break;
        case "auth/wrong-password":
          setMessage("❌ Incorrect password.");
          break;
        case "auth/invalid-email":
          setMessage("❌ Invalid email address.");
          break;
        default:
          setMessage(`❌ ${err.message}`);
      }
    }

    setLoading(false);
  };

  // Social login
  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setMessage("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem("user_id", user.uid);
      localStorage.setItem("username", user.email); // always use email

      navigate("/post-generator");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAEAEA] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#231F20] mb-2 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-600 mb-6 text-center text-sm md:text-base">
          Log in to access your AI-powered post generator
        </p>

        {/* Email login */}
        <form className="space-y-4" onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8E793E] hover:bg-[#AD974F] text-white font-semibold py-2 rounded-xl transition-colors duration-200 flex justify-center items-center gap-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Social login */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            onClick={() => handleSocialLogin(googleProvider)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
          >
            <FaGoogle /> Google
          </button>
          <button
            onClick={() => handleSocialLogin(appleProvider)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl"
          >
            <FaApple /> Apple
          </button>
        </div>

        {/* Error/Info message */}
        {message && (
          <p className="mt-4 text-center text-red-600 text-sm sm:text-base">{message}</p>
        )}

        <p className="mt-6 text-center text-gray-600 text-sm sm:text-base">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#AD974F] font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

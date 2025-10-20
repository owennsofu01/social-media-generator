// src/components/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaApple } from "react-icons/fa";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../../firebase";

const backendUrl = "https://social-media-generator-jhsl.onrender.com/register";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Email/password registration
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // Call backend
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, email }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem("uid", data.uid);
        localStorage.setItem("username", user.email); // use email as username
        navigate("/post-generator");
      } else {
        setMessage(data.error || "❌ Registration failed");
      }
    } catch (err) {
      setLoading(false);
      switch (err.code) {
        case "auth/email-already-in-use":
          setMessage("❌ User already exists with this email.");
          break;
        case "auth/invalid-email":
          setMessage("❌ Invalid email address.");
          break;
        case "auth/weak-password":
          setMessage("❌ Password should be at least 6 characters.");
          break;
        default:
          setMessage(`❌ ${err.message}`);
      }
    }
  };

  // Social login (Google/Apple)
  const handleSocialRegister = async (provider) => {
    setLoading(true);
    setMessage("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Call backend
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, email: user.email }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem("uid", data.uid);
        localStorage.setItem("username", user.email); // always use email
        navigate("/post-generator");
      } else {
        setMessage(data.error || "❌ Registration failed");
      }
    } catch (err) {
      setLoading(false);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAEAEA] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#231F20] mb-2 text-center">
          Create Account
        </h2>
        <p className="text-gray-600 mb-6 text-center text-sm md:text-base">
          Join now and start generating AI-powered social posts!
        </p>

        {/* Email registration */}
        <form className="space-y-4" onSubmit={handleEmailRegister}>
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
            className="w-full bg-[#8E793E] hover:bg-[#AD974F] text-white font-semibold py-2 rounded-xl transition-colors duration-200"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Social registration */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            onClick={() => handleSocialRegister(googleProvider)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
          >
            <FaGoogle /> Google
          </button>
          <button
            onClick={() => handleSocialRegister(appleProvider)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl"
          >
            <FaApple /> Apple
          </button>
        </div>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-red-600 text-sm sm:text-base">{message}</p>
        )}

        <p className="mt-6 text-center text-gray-600 text-sm sm:text-base">
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

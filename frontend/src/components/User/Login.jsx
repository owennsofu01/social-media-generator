// src/components/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../../firebase";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);

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
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem("user_id", user.uid);
      localStorage.setItem("username", user.email);

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

  // Forgot password handler
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email) {
      setMessage("❌ Please enter your email to reset your password.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset link sent to your email.");
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setMessage("❌ No user found with this email.");
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
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem("user_id", user.uid);
      localStorage.setItem("username", user.email);

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
          {resetMode ? "Reset Password" : "Welcome Back"}
        </h2>
        <p className="text-gray-600 mb-6 text-center text-sm md:text-base">
          {resetMode
            ? "Enter your email to receive a password reset link"
            : "Log in to access your AI-powered post generator"}
        </p>

        {/* Email login or reset form */}
        <form
          className="space-y-4"
          onSubmit={resetMode ? handlePasswordReset : handleEmailLogin}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
            required
          />

          {!resetMode && (
            <>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AD974F] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#AD974F]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="accent-[#AD974F]"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() => setResetMode(true)}
                  className="text-[#AD974F] hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8E793E] hover:bg-[#AD974F] text-white font-semibold py-2 rounded-xl transition-colors duration-200 flex justify-center items-center gap-2"
          >
            {loading
              ? resetMode
                ? "Sending..."
                : "Logging in..."
              : resetMode
              ? "Send Reset Link"
              : "Login"}
          </button>
        </form>

        {/* Social login (only in login mode) */}
        {!resetMode && (
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
        )}

        {/* Info or error message */}
        {message && (
          <p
            className={`mt-4 text-center text-sm sm:text-base ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-gray-600 text-sm sm:text-base">
          {resetMode ? (
            <>
              Remembered your password?{" "}
              <button
                onClick={() => setResetMode(false)}
                className="text-[#AD974F] font-semibold hover:underline"
              >
                Back to Login
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-[#AD974F] font-semibold hover:underline"
              >
                Create one
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;

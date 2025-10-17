import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const backendUrl = "https://social-media-generator-jhsl.onrender.com/login";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("username", data.username);
        setMessage("✅ Login successful!");
        navigate("/post-generator"); // redirect to post generator page
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage("❌ Error connecting to server");
    }
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <h2>Welcome Back</h2>
        <p className="subtitle">Log in to access your AI-powered post generator</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-login">Login</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="register-link">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const backendUrl = "https://social-media-generator-jhsl.onrender.com/register";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("username", username);
        setMessage("✅ Registration successful!");
        navigate("/post-generator"); // redirect to post generator page
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage("❌ Error connecting to server");
    }
  };

  return (
    <div className="register-page">
      <div className="form-container">
        <h2>Create Account</h2>
        <p className="subtitle">Join now and start generating AI-powered social posts!</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
          <button type="submit" className="btn-register">Create Account</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

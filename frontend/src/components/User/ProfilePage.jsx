// src/components/ProfilePage.jsx
import React, { useState } from "react";
import { auth } from "../../firebase";
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";

const ProfilePage = () => {
  const user = auth.currentUser;

  const [username, setUsername] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (username !== user.displayName) {
        await updateProfile(user, { displayName: username });
      }

      if (email !== user.email) {
        await updateEmail(user, email);
      }

      if (password) {
        await updatePassword(user, password);
      }

      setMessage("✅ Profile updated successfully!");
      setPassword("");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAEAEA] p-4">
      <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <h2 className="text-xl md:text-2xl font-bold text-[#231F20] mb-6 text-center md:text-left">
          Profile Settings
        </h2>

        <form className="space-y-4" onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
            required
          />
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
            placeholder="New Password (leave blank to keep current)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AD974F]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8E793E] hover:bg-[#AD974F] text-white font-semibold py-2 rounded-xl transition-colors duration-200"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

// src/components/Sidebar.js
import React, { useEffect, useState } from "react";

const Sidebar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user_profile");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) return null;

  return (
    <div className="w-64 bg-white shadow-lg rounded-2xl p-6 sticky top-4 h-fit">
      <div className="flex flex-col items-center text-center">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
        <h3 className="text-xl font-semibold text-[#231F20]">{user.name}</h3>
        <p className="text-gray-600">{user.email}</p>
      </div>
      <div className="mt-6">
        <h4 className="font-semibold text-gray-700 mb-2">Subscription:</h4>
        <p className="text-[#AD974F] font-bold">{user.subscription || "Free"}</p>
      </div>
    </div>
  );
};

export default Sidebar;

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <FaExclamationTriangle className="text-6xl text-yellow-500 mb-6" />
      <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="inline-block bg-blue-600 text-white font-semibold rounded-full px-6 py-3 shadow-lg hover:bg-blue-700 transition-colors"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFoundPage;

import React, { useState } from "react";

const ScheduleModal = ({
  modalOpen,
  setModalOpen,
  modalText,
  scheduledTime,
  setScheduledTime,
  selectedPlatforms,
  togglePlatform,
  submitSchedule,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!scheduledTime || selectedPlatforms.length === 0) {
      alert("Please select date/time and at least one platform");
      return;
    }

    setLoading(true);
    try {
      await submitSchedule();
    } finally {
      setLoading(false);
    }
  };

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-center md:text-left">Schedule Post</h3>
        <p className="text-gray-600 break-words">Post: {modalText}</p>

        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD974F] w-full"
        />

        <div className="flex flex-wrap gap-2">
          {["x", "linkedin", "facebook", "instagram", "threads"].map((platform) => (
            <label
              key={platform}
              className={`px-4 py-2 border rounded-xl cursor-pointer select-none transition-colors duration-200 flex-1 text-center ${
                selectedPlatforms.includes(platform)
                  ? "bg-[#AD974F] text-white border-[#AD974F]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-[#EAEAEA]"
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={selectedPlatforms.includes(platform)}
                onChange={() => togglePlatform(platform)}
              />
              {platform === "x" ? "X / Twitter" : platform.charAt(0).toUpperCase() + platform.slice(1)}
            </label>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-end gap-2 mt-2">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 w-full md:w-auto"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#AD974F] text-white rounded-xl hover:bg-[#8E793E] w-full md:w-auto flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && (
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
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {loading ? "Scheduling..." : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;

import React, { useState } from "react";

const ScheduleModal = ({
  onClose,
  modalText,
  scheduledTime,
  setScheduledTime,
  selectedPlatforms,
  togglePlatform,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const handleSubmit = async () => {
    if (!scheduledTime || selectedPlatforms.length === 0) {
      setValidationMessage("⚠️ Please select a date/time and at least one platform.");
      return;
    }

    setValidationMessage("");
    setLoading(true);

    try {
      await onSubmit();
    } finally {
      setLoading(false);
    }
  };

  const platforms = ["x", "linkedin", "facebook", "instagram", "threads"];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl max-w-lg w-full shadow-2xl flex flex-col gap-5 border border-gray-100">

        {/* Header */}
        <h3 className="text-xl font-extrabold text-gray-800 border-b pb-3">
          📅 Schedule Your Post
        </h3>

        {/* Post preview */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm max-h-40 overflow-y-auto">
          <strong className="text-gray-700">Content:</strong>
          <p className="mt-1 text-gray-600 italic">{modalText}</p>
        </div>

        {/* Date-time */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Scheduled Time</label>
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => {
              setScheduledTime(e.target.value);
              setValidationMessage("");
            }}
            className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Platforms */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Choose Platforms</label>

          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform);
              return (
                <label
                  key={platform}
                  className={`px-3 py-1.5 rounded-full cursor-pointer text-xs font-semibold border transition
                    ${isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isSelected}
                    onChange={() => {
                      togglePlatform(platform);
                      setValidationMessage("");
                    }}
                  />
                  {platform === "x" ? "X / Twitter" : platform.charAt(0).toUpperCase() + platform.slice(1)}
                </label>
              );
            })}
          </div>
        </div>

        {/* Validation */}
        {validationMessage && (
          <p className="text-red-500 text-sm font-semibold bg-red-50 p-2 border border-red-200 rounded-lg">
            {validationMessage}
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 w-full sm:w-auto"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto flex items-center gap-2"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5"
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
            {loading ? "Scheduling..." : "Schedule Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;

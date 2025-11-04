import React, { useState } from "react";
import { useCalculateTrip } from "../../hooks/useCalculateTrip";
import { motion } from "motion/react";
import type { TripInput, TripResult } from "../../types/type";

interface TripInputModuleProps {
  onResult: (data: TripResult) => void;
}

const TripInputModule: React.FC<TripInputModuleProps> = ({ onResult }) => {
  const mutation = useCalculateTrip();

  const [formData, setFormData] = useState<TripInput>({
    currentLocation: "-74.0060, 40.7128", // Lon, Lat
    pickupLocation: "-75.1652, 39.9526",
    dropoffLocation: "-77.0369, 38.9072",
    currentCycleUsed: 45.5,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "currentCycleUsed" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Trigger the TanStack Mutation
      const result = await mutation.mutateAsync(formData);
      onResult(result);
    } catch (err: unknown) {
      // Error handling is handled by the mutation state (mutation.isError)
      console.error("Mutation failed:", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-2xl h-full">
      <h2 className="text-2xl font-extrabold text-blue-800 mb-6">
        1. Plan Your Route
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["currentLocation", "pickupLocation", "dropoffLocation"].map((key) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {key.replace(/([A-Z])/g, " $1").trim()} (Lon, Lat)
            </label>
            <input
              type="text"
              name={key}
              value={formData[key as keyof TripInput] as string}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
              placeholder="e.g., -74.0060, 40.7128"
              required
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Current Cycle Used (Hrs)
          </label>
          <input
            type="number"
            name="currentCycleUsed"
            value={formData.currentCycleUsed}
            onChange={handleChange}
            min="0"
            max="70"
            step="0.1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>

        {mutation.isError && (
          <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg">
            Error:{" "}
            {typeof mutation.error === "object" &&
            mutation.error !== null &&
            "message" in mutation.error
              ? (mutation.error as { message?: string }).message
              : "An unknown error occurred."}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className={`w-full p-3 mt-4 text-white font-bold rounded-lg transition duration-300 transform hover:scale-[1.01] cursor-pointer ${
            mutation.isPending
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-lg"
          }`}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Calculating Route...
            </span>
          ) : (
            "Calculate Trip & HOS"
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default TripInputModule;

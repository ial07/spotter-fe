import React from "react";
import { motion } from "motion/react";
import type { DailyLog, LogbookEvent } from "../../types/type";

interface LogbookDisplayProps {
  logbookEvents: DailyLog[];
}

const LogbookDisplay: React.FC<LogbookDisplayProps> = ({ logbookEvents }) => {
  const LOG_COLORS: Record<LogbookEvent["status"], string> = {
    OFF_DUTY: "bg-green-100 text-green-800",
    SLEEPER_BERTH: "bg-green-200 text-green-900",
    DRIVING: "bg-red-100 text-red-800",
    ON_DUTY: "bg-yellow-100 text-yellow-800",
  };

  if (!logbookEvents || logbookEvents.length === 0) {
    return <p className="text-gray-500">No log sheets generated.</p>;
  }

  return (
    <motion.div
      className="mt-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-2xl font-extrabold text-blue-800 mb-6">
        3. Daily HOS Logbook
      </h2>

      <div className="space-y-6">
        {logbookEvents.map((dayLog, dayIndex) => (
          <motion.div
            key={dayLog.day}
            className="border border-gray-200 p-4 rounded-xl bg-gray-50 shadow-sm"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: dayIndex * 0.15,
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Log Sheet - Day {dayLog.day}
            </h3>

            <div className="space-y-2">
              {dayLog.events.map((event, index) => (
                <motion.div
                  key={index}
                  className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-lg ${
                    LOG_COLORS[event.status]
                  } shadow-sm`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  <div className="font-mono text-sm sm:w-1/4">
                    Time: <span className="font-bold">{event.start_time}</span>
                  </div>
                  <div className="font-extrabold sm:w-1/4 text-center">
                    {event.status.replace("_", " ")}
                  </div>
                  <div className="text-sm sm:w-1/4 text-center">
                    Duration:{" "}
                    <span className="font-bold">
                      {event.duration_hours.toFixed(1)} hrs
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 sm:w-1/4 text-center">
                    {event.notes}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LogbookDisplay;

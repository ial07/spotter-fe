import React, { useState } from "react";

import TripInputModule from "./features/TripInputModule/TripInputModule";
import MapDisplay from "./features/ResultsDashboard/MapDisplay";
import LogbookDisplay from "./features/ResultsDashboard/LogbookDisplay";
import type { TripResult } from "./types/type";

export const App: React.FC = () => {
  const [tripResult, setTripResult] = useState<TripResult | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Truck HOS Trip Spotter
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            Ilham Malik | ialilham77@gmail.com
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TripInputModule onResult={setTripResult} />
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-8">
              <h2 className="text-2xl font-extrabold text-blue-800 mb-4 p-6 bg-white rounded-xl shadow-2xl">
                2. Route Map & Summary
              </h2>

              {tripResult ? (
                <>
                  {/* Map Display (takes route data from result) */}
                  <MapDisplay routeData={tripResult.routeData} />

                  {/* Logbook Display (takes log events from result) */}
                  <LogbookDisplay logbookEvents={tripResult.logbookEvents} />
                </>
              ) : (
                <div className="p-10 text-center bg-white border border-dashed rounded-xl shadow-inner text-gray-500">
                  <p>
                    The calculated route and Hours of Service (HOS) log sheets
                    will appear here.
                  </p>
                  <p className="mt-2 text-sm">
                    Input must be in **Longitude, Latitude** format.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

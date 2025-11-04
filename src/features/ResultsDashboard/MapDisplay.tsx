import React, { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import { motion } from "motion/react";
import type { LatLngExpression } from "leaflet";
import type { RouteData, RouteGeometry, Stop } from "../../types/type";
import { decodePolyline } from "../../hooks/polylineDecoder";

// --- Marker Icons ---
const DefaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const createCustomIcon = (color: string, label: string): L.DivIcon => {
  const size = 22;
  return L.divIcon({
    html: `<div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: 600;
        color: white;
      ">${label}</div>`,
    className: "custom-div-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};
const RestIcon = createCustomIcon("rgb(239, 68, 68)", "R");
const FuelIcon = createCustomIcon("rgb(245, 158, 11)", "F");

// --- Auto Fit ---
const AutoFitMap: React.FC<{ coords: L.LatLngLiteral[] }> = ({ coords }) => {
  const map = useMap();

  React.useEffect(() => {
    if (coords.length > 1) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, [map, coords]);

  return null;
};

// --- Main Component ---
interface MapDisplayProps {
  routeData: RouteData;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ routeData }) => {
  const routeGeometry: RouteGeometry = routeData.route_geometry || [];
  const stops: Stop[] = routeData.stops || [];

  const allCoords = useMemo(() => {
    const decoded: L.LatLngLiteral[] = [];
    routeGeometry.forEach((encodedLine) => {
      if (encodedLine) decoded.push(...decodePolyline(encodedLine));
    });
    return decoded;
  }, [routeGeometry]);

  const initialCenter: LatLngExpression = useMemo(() => {
    return allCoords.length > 0
      ? [allCoords[0].lat, allCoords[0].lng]
      : [39.8283, -98.5795];
  }, [allCoords]);

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden shadow-2xl border border-blue-100"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div style={{ height: "420px", width: "100%" }} className="relative">
        <MapContainer
          center={initialCenter}
          zoom={4}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          className="rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {allCoords.length > 0 && <AutoFitMap coords={allCoords} />}

          {allCoords.length > 0 && (
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <Polyline
                positions={allCoords}
                color="#3b82f6"
                weight={6}
                opacity={0.8}
              />
            </motion.div>
          )}

          {stops.map((stop, index) => {
            const position: LatLngExpression = [stop.lat, stop.lon];
            const icon = stop.type === "REST" ? RestIcon : FuelIcon;
            const title = stop.type === "REST" ? "Rest Stop" : "Fuel Stop";
            return (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Marker position={position} icon={icon}>
                  <Tooltip direction="top" offset={[0, -15]}>
                    <strong>{title}</strong>
                    <br />
                    {stop.description}
                    <br />
                    {stop.duration_hours > 0 && (
                      <span className="text-xs text-gray-600">
                        Duration: {stop.duration_hours.toFixed(1)} hrs
                      </span>
                    )}
                  </Tooltip>
                </Marker>
              </motion.div>
            );
          })}

          {allCoords.length > 0 && (
            <>
              <Marker
                position={[allCoords[0].lat, allCoords[0].lng]}
                title="Start (Current Location)"
              >
                <Tooltip permanent>Start Trip</Tooltip>
              </Marker>
              <Marker
                position={[
                  allCoords[allCoords.length - 1].lat,
                  allCoords[allCoords.length - 1].lng,
                ]}
                title="Dropoff Location"
              >
                <Tooltip permanent>Dropoff</Tooltip>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>

      {/* Trip Summary */}
      <motion.div
        className="absolute bottom-4 right-4 bg-white bg-opacity-95 rounded-xl shadow-lg border-l-4 border-blue-500 p-4 w-64 backdrop-blur-sm z-500"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
      >
        <h3 className="text-lg font-bold mb-2 text-blue-700">Trip Summary</h3>
        <div className="space-y-1 text-sm font-medium text-gray-800">
          <p className="flex justify-between">
            <span>Driving Hours:</span>
            <strong className="text-blue-600">
              {routeData.total_driving_hours.toFixed(1)} hrs
            </strong>
          </p>
          <p className="flex justify-between">
            <span>Total Distance:</span>
            <strong className="text-blue-600">
              {routeData.total_miles.toFixed(1)} mi
            </strong>
          </p>
          <p className="flex justify-between">
            <span>Days Required:</span>
            <strong className="text-blue-600">{routeData.required_days}</strong>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MapDisplay;

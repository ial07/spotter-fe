import type { RouteGeometry, Stop } from "./type";

export default interface RouteData {
    deadhead_miles: number;
    transport_miles: number;
    total_miles: number;
    total_driving_hours: number;
    required_days: number;
    route_geometry: RouteGeometry;
    stops: Stop[]; // Array of intermediate rest and fuel stops
}
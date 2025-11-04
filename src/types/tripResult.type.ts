import type { DailyLog, RouteData } from "./type";

export default interface TripResult {
    routeData: RouteData;
    logbookEvents: DailyLog[];
}
import type { LogbookEvent } from "./type";

export default interface DailyLog {
    day: number;
    events: LogbookEvent[];
}

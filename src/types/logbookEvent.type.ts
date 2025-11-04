export default interface LogbookEvent {
    status: 'OFF_DUTY' | 'SLEEPER_BERTH' | 'DRIVING' | 'ON_DUTY';
    duration_hours: number;
    start_time: string;
    notes: string;
    mark?: number; // Optional field to store a numerical mark/score for the event
}
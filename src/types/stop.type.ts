export default interface Stop {
    lat: number;
    lon: number;
    type: 'REST' | 'FUEL'; // Used by MapDisplay to color the marker
    description: string;
    duration_hours: number;
}
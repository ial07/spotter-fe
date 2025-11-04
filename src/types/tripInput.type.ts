export default interface TripInput {
    currentLocation: string; // Lon,Lat
    pickupLocation: string; // Lon,Lat
    dropoffLocation: string; // Lon,Lat
    currentCycleUsed: number;
}
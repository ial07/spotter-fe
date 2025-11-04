import { useMutation } from '@tanstack/react-query';
import type {ErrorResponse, TripInput, TripResult} from '../types/type';
import { calculateTripRequest } from '../services/trip.service';

/**
 * Custom hook for the trip calculation mutation.
 * This hook manages the loading state, error state, and data caching for the API call.
 */
export const useCalculateTrip = () => {
    return useMutation<TripResult, ErrorResponse, TripInput>({
        mutationFn: calculateTripRequest,
    });
};

import axios from 'axios';
import { api } from '../api/api';
import type {ErrorResponse, TripInput, TripResult} from '../types/type';

export const calculateTripRequest = async (data: TripInput): Promise<TripResult> => {
    try {
        const response = await api.post<TripResult>("/calculate-trip/", data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Throw the custom error message from the Django backend
            throw error.response.data as ErrorResponse;
        }
        throw { message: "Network error or server unreachable." } as ErrorResponse;
    }
};
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL; 

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});


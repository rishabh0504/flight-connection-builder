import React from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '../config';

// Setting default base url
axios.defaults.baseURL = API_ENDPOINT;


export const getFlights = async () => {
    try {
        const data = await axios.get(`flights`);
        return data.data;
    } catch (error) {
        return []
    }
};

export const getFlightSchedules = async () => {
    try {
        const data = await axios.get(`flight-schedules`);
        return data.data;
    } catch (error) {
        return []
    }
};

export const searchFlights = async (payload) => {
    try {
        const data = await axios.post(`flights`, payload);
        return data.data;
    } catch (error) {
        return []
    }
};
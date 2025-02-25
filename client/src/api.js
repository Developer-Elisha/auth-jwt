import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth'; 

export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const loginUser = async (credentials) => {
    return await axios.post(`${API_URL}/login`, credentials);
};

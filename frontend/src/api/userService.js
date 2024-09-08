// src/api/userService.js
import axios from '../api/axios';

export const loginUser = async (credentials) => {
    const response = await axios.post('/api/auth/login', credentials);
    return response.data;
};

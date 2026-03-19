// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://dbas2.onrender.com',
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('[Axios Request] Token được gắn:', token ? 'Có token' : 'KHÔNG CÓ TOKEN'); // ← debug
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('[Axios Response] 401 Unauthorized - Token có thể hết hạn hoặc không hợp lệ');
      localStorage.removeItem('token');
      // window.location.href = '/login'; // optional: redirect login
    }
    return Promise.reject(error);
  }
);

export default api;
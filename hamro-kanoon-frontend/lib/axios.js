// src/lib/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Tapaiko backend URL
});

// Request pathaunu aghi Token halne middleware (Interceptor)
api.interceptors.request.use((config) => {
  // LocalStorage bata token nikalne (yadi user login cha bhane)
  if (typeof window !== 'undefined') {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
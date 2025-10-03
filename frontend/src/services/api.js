import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // Adjust this if your backend is on a different port
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

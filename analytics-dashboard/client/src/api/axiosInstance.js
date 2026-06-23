import axios from 'axios';

// CHANGE baseURL to your deployed Render URL when you go live, e.g.
// 'https://analytics-api-abc.onrender.com/api'
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Automatically attach the JWT to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the server returns 401 (expired/invalid token), log the user out
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

import axios from 'axios';

// Local dev defaults to localhost:5000. In production (Vercel), set
// REACT_APP_API_URL to your deployed Render backend, e.g.
// https://analytics-api-abc.onrender.com/api
const api = axios.create({
  baseURL: 'https://analytics-dashboard-efi6.onrender.com/events'
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
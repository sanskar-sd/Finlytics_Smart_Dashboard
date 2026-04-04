import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE,
});

// attach token automatically if present
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('zorvyn_auth');
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {}
  return config;
});

export default api;

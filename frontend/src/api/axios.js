import axios from "axios";
import { getToken, clearAuthData } from "../utils/auth";

// Dev (npm run dev): use same-origin "" so /api is proxied by Vite to Spring (see vite.config.js). This
// avoids wrong-port calls when Spring falls back to a random port: set VITE_API_BASE_URL to the real
// API URL in .env and Vite will use it as the proxy target.
// Production build: set VITE_API_BASE_URL to your deployed API base.
const apiBase = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_BASE_URL || "http://localhost:8090");
const axiosInstance = axios.create({
  baseURL: apiBase,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthData();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
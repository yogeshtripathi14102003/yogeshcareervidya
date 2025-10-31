import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Add token if exists
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Better error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error URL:", error.config?.url);
    console.error("API Error Status:", error.response?.status);
    console.error("API Error Data:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

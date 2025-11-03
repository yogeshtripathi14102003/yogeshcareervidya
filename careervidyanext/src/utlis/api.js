

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://api.careervidya.in/",  
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// ✅ Automatically attach token if available
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

// ✅ Improved safe error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.group("🚨 API Error");
    console.error("URL:", error.config?.baseURL + error.config?.url || "Unknown");
    console.error("Status:", error.response?.status || "No response");
    console.error("Message:", error.response?.data?.message || error.message);
    console.error("Full Data:", error.response?.data);
    console.groupEnd();

    // Return consistent error
    return Promise.reject(
      error.response?.data || { message: error.message, status: error.response?.status }
    );
  }
);

export default api;

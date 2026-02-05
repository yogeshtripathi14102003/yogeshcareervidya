

"use client";

import axios from "axios";

const api = axios.create({
//baseURL: "http://localhost:8080",

baseURL: process.env.NEXT_PUBLIC_BASE_URL || "https://api.careervidya.in",
  withCredentials: true,
});

// Attach Access Token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto Refresh Token Logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // If access token expired
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        // Call refresh token API
        const { data } = await api.get("/api/auth/refresh");

        // Save new access token
        localStorage.setItem("accessToken", data.accessToken);

        // Add new token to header
        original.headers["Authorization"] = `Bearer ${data.accessToken}`;

        // Retry original request
        return api(original);

      } catch (refreshError) {
        console.log("Refresh token expired, logging out");

        // Remove old token
        localStorage.removeItem("accessToken");

        // Redirect to login
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

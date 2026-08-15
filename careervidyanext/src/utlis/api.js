"use client";
import axios from "axios";

const api = axios.create({
  baseURL: "", // Next.js proxy route handles forwarding to the backend
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Clears every session key/cookie in one place so tabs stay in sync
// (AuthContext listens for the "accessToken" key disappearing).
const clearSession = () => {
  ["accessToken", "authUser", "authRole", "admintoken", "usertoken", "user", "token"].forEach(
    (k) => localStorage.removeItem(k)
  );
  document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// Request Interceptor — single source of truth is "accessToken"
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const code = error.response?.data?.code;

    if (code === "INACTIVITY_LOGOUT") {
      clearSession();
      window.location.href = "/login?reason=inactivity";
      return Promise.reject(error);
    }

    // Only attempt a silent refresh when the access token itself expired.
    // A generic 403 ("insufficient role") should NOT trigger a refresh loop.
    const tokenExpired = error.response?.status === 403 && code === "TOKEN_EXPIRED";
    const unauthorized = error.response?.status === 401;

    if (tokenExpired && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          "/api/v1/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        clearSession();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // No token at all / refresh already failed once — bounce to login.
    if (unauthorized && !originalRequest._retry) {
      clearSession();
    }

    return Promise.reject(error);
  }
);

export default api;

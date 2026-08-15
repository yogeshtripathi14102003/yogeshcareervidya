"use client";

import { io } from "socket.io-client";

let socket = null;

/** Opens (or reuses) the shared Socket.IO connection, authenticated with
 * the current access token. Call disconnectSocket() on logout. */
export function connectSocket() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  if (socket && socket.connected) {
    return socket;
  }

  if (socket) {
    // Token may have changed (refresh/login) — reconnect with the new one.
    socket.disconnect();
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!backendUrl) {
    console.error("NEXT_PUBLIC_API_URL is not set — real-time notifications are disabled.");
    return null;
  }

  socket = io(backendUrl, {
    auth: (cb) => cb({ token: localStorage.getItem("accessToken") }),
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

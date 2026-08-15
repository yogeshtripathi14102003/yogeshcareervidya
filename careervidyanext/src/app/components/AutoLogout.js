"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext.jsx";

// Logs the user out after a period of inactivity, for any authenticated role.
// Delegates to AuthContext.logout() so ALL session data (token, user, role,
// cookies) is cleared consistently — and cross-tab logout kicks in for free
// because logout() clears "accessToken" from localStorage, which the
// AuthContext in every other open tab is already listening for.
const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes

export default function AutoLogout() {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    let timer;
    const doLogout = () => logout({ redirectTo: "/login?reason=inactivity" });
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(doLogout, INACTIVITY_LIMIT_MS);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [isAuthenticated, logout]);

  return null;
}

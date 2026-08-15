"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import api from "@/utlis/api.js";
import { markSessionLogin, endAnalyticsSession } from "@/utlis/analytics.js";

/**
 * Centralized authentication state.
 *
 * Storage contract (single source of truth — do not read/write these keys
 * anywhere else in the app; use useAuth() instead):
 *   localStorage.accessToken  -> current JWT access token
 *   localStorage.authUser     -> JSON of the logged-in user/counselor
 *   localStorage.authRole     -> "user" | "admin" | "subadmin" | "counselor"
 *   cookie userRole           -> readable copy of the role, used by middleware.js
 *                                 for coarse route protection (not for API auth)
 *
 * Legacy keys ("admintoken", "usertoken", "user", "token") are cleaned up on
 * logout for backward compatibility with older pages that may still read them.
 */

const AuthContext = createContext(null);

const LEGACY_KEYS = ["admintoken", "usertoken", "user", "token", "authToken", "refreshToken"];

const PROFILE_ENDPOINTS = {
  admin: "/api/v1/me",
  subadmin: "/api/v1/me",
  counselor: "/api/v1/counselor/me",
  user: "/api/v1/students/me",
};

function readStoredRole() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authRole");
}

function cookieOptions() {
  const isLocal =
    typeof window !== "undefined" && window.location.hostname === "localhost";
  return {
    expires: 7,
    path: "/",
    secure: !isLocal,
    domain: isLocal ? undefined : ".careervidya.in",
    sameSite: "lax",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hydrating = useRef(false);

  const clearLocalSession = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("authRole");
    LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
    Cookies.remove("userRole", cookieOptions());
    Cookies.remove("admintoken", cookieOptions());
    Cookies.remove("usertoken", cookieOptions());
    setUser(null);
    setRole(null);
  }, []);

  const hydrate = useCallback(async () => {
    if (hydrating.current) return;
    hydrating.current = true;
    try {
      const token = localStorage.getItem("accessToken");
      const storedRole = readStoredRole();

      if (!token || !storedRole) {
        clearLocalSession();
        setIsLoading(false);
        return;
      }

      const endpoint = PROFILE_ENDPOINTS[storedRole] || PROFILE_ENDPOINTS.user;
      const res = await api.get(endpoint);

      let profile = null;
      if (storedRole === "admin" || storedRole === "subadmin") {
        // getAdminProfile responds with { success, role, permissions } — no user object.
        // Merge with what we already have in storage so the UI keeps name/email.
        const cached = JSON.parse(localStorage.getItem("authUser") || "null");
        profile = res.data.role
          ? { ...cached, role: res.data.role, permissions: res.data.permissions || [] }
          : null;
      } else {
        profile = res.data.student || res.data.data || res.data.user || null;
      }

      if (!profile) {
        clearLocalSession();
      } else {
        setUser(profile);
        setRole(storedRole);
        localStorage.setItem("authUser", JSON.stringify(profile));
      }
    } catch (err) {
      clearLocalSession();
    } finally {
      setIsLoading(false);
      hydrating.current = false;
    }
  }, [clearLocalSession]);

  useEffect(() => {
    hydrate();

    // Cross-tab logout: when another tab clears accessToken, react here too.
    const onStorage = (e) => {
      if (e.key === "accessToken" && !e.newValue) {
        clearLocalSession();
        setIsLoading(false);
      }
      if (e.key === "accessToken" && e.newValue && e.oldValue !== e.newValue) {
        // Another tab logged in / refreshed — re-hydrate this tab too.
        hydrate();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(({ accessToken, user: userData, role: userRole }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
    localStorage.setItem("authRole", userRole);
    Cookies.set("userRole", userRole, cookieOptions());

    setUser(userData);
    setRole(userRole);
    setIsLoading(false);

    markSessionLogin(); // Module 1: capture Login Time on this analytics session
  }, []);

  const logout = useCallback(
    async ({ redirectTo = "/login" } = {}) => {
      try {
        await endAnalyticsSession(); // Module 1: capture Logout Time
      } catch {
        // best-effort
      }
      if (role === "counselor") {
        try {
          await api.post("/api/v1/counselor/session/close"); // Module 9: working hours
        } catch {
          // best-effort
        }
      }
      try {
        await api.post("/api/v1/logout");
      } catch {
        // best-effort — still clear local state even if the request fails
      }
      clearLocalSession();
      if (typeof window !== "undefined") {
        window.location.href = redirectTo;
      }
    },
    [clearLocalSession, role]
  );

  const value = {
    user,
    role,
    permissions: user?.permissions || [],
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refresh: hydrate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

"use client";

import api from "@/utlis/api.js";

const SESSION_KEY = "cv_session_id";
const SESSION_STARTED_KEY = "cv_session_started";
const LANDING_PAGE_KEY = "cv_landing_page";

/* ---------------- Session ---------------- */

export function getSessionId() {
  if (typeof window === "undefined") return null;
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function parseUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    utmContent: params.get("utm_content") || undefined,
  };
}

/** Call once per browser session (first page load of the tab). */
export async function startSession() {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(SESSION_STARTED_KEY)) return; // already started this tab session

  const landingPage = window.location.pathname;
  sessionStorage.setItem(LANDING_PAGE_KEY, landingPage);
  sessionStorage.setItem(SESSION_STARTED_KEY, "true");

  try {
    await api.post("/api/v1/analytics/session/start", {
      sessionId: getSessionId(),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      referrer: document.referrer || "Direct",
      landingPage,
      ...parseUTMParams(),
    });
  } catch (err) {
    console.error("Analytics session start failed:", err);
  }
}

/** Call right after a successful login, so the session gets tied to the user. */
export async function markSessionLogin() {
  try {
    await api.post("/api/v1/analytics/session/start", {
      sessionId: getSessionId(),
      isLogin: true,
    });
  } catch (err) {
    console.error("Analytics login mark failed:", err);
  }
}

/** Call on logout — records logoutTime for Module 1. */
export async function endAnalyticsSession() {
  try {
    await api.post("/api/v1/analytics/session/end", {
      sessionId: getSessionId(),
    });
  } catch (err) {
    console.error("Analytics session end failed:", err);
  }
}

/** Module 10: cheap periodic ping so the admin dashboard can tell who's
 * actually online right now, not just who started a session at some point. */
export async function sendHeartbeat() {
  if (typeof window === "undefined") return;
  if (!sessionStorage.getItem(SESSION_STARTED_KEY)) return; // no session yet — nothing to keep alive
  try {
    await api.post("/api/v1/analytics/session/heartbeat", { sessionId: getSessionId() });
  } catch (err) {
    // silent — a missed heartbeat just means we look "offline" a bit early, not worth logging
  }
}

/* ---------------- Page journey ---------------- */

let currentPageVisitId = null;
let currentPage = null;
let pageScrollMax = 0;
let pageClicks = 0;
let listenersAttached = false;

function attachPageListeners() {
  if (listenersAttached || typeof window === "undefined") return;
  listenersAttached = true;

  window.addEventListener("scroll", () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0;
    if (pct > pageScrollMax) pageScrollMax = pct;
  });

  window.addEventListener("click", () => {
    pageClicks += 1;
  });
}

/** Send the exit beacon for whatever page is currently open, reliably even on tab close. */
function beaconPageExit() {
  if (!currentPageVisitId || typeof navigator === "undefined" || !navigator.sendBeacon) return;

  const payload = JSON.stringify({
    pageVisitId: currentPageVisitId,
    sessionId: getSessionId(),
    page: currentPage,
    scrollPercentage: pageScrollMax,
    clickCount: pageClicks,
  });

  navigator.sendBeacon(
    "/api/v1/analytics/page/exit",
    new Blob([payload], { type: "application/json" })
  );
}

/** Call on every route change (and once on first mount). Closes the previous
 * page (if any) and opens tracking for the new one. */
export async function trackPageChange(page) {
  if (typeof window === "undefined") return;
  attachPageListeners();

  if (currentPageVisitId) {
    beaconPageExit();
  }

  currentPage = page;
  pageScrollMax = 0;
  pageClicks = 0;
  currentPageVisitId = null;

  try {
    const res = await api.post("/api/v1/analytics/page/enter", {
      sessionId: getSessionId(),
      page,
    });
    currentPageVisitId = res.data?.pageVisitId || null;
  } catch (err) {
    console.error("Analytics page/enter failed:", err);
  }
}

/** Call once, e.g. in a root layout's beforeunload handler. */
export function trackFinalExit() {
  beaconPageExit();
}

/* ---------------- Discrete events ---------------- */

export async function trackEvent(type, meta = {}) {
  try {
    await api.post("/api/v1/analytics/event", {
      sessionId: getSessionId(),
      page: currentPage || window.location.pathname,
      pageVisitId: currentPageVisitId,
      type,
      meta,
    });
  } catch (err) {
    console.error("Analytics event tracking failed:", err);
  }
}

/* ---------------- Course analytics (Module 3) ---------------- */

let courseViewStart = null;
let currentCourseRef = null;

export function startCourseView({ courseId, courseSlug }) {
  courseViewStart = Date.now();
  currentCourseRef = { courseId, courseSlug };
}

export async function endCourseView(extra = {}) {
  if (!currentCourseRef) return;
  const timeSpent = courseViewStart ? Math.round((Date.now() - courseViewStart) / 1000) : 0;

  try {
    await api.post("/api/v1/analytics/course-view", {
      ...currentCourseRef,
      sessionId: getSessionId(),
      timeSpent,
      ...extra,
    });
  } catch (err) {
    console.error("Analytics course-view failed:", err);
  }

  courseViewStart = null;
  currentCourseRef = null;
}

/** Fire-and-forget flag updates (apply click / brochure download) without
 * waiting for the visitor to leave the page. */
export async function flagCourseView(flag) {
  if (!currentCourseRef) return;
  try {
    await api.post("/api/v1/analytics/course-view", {
      ...currentCourseRef,
      sessionId: getSessionId(),
      [flag]: true,
    });
  } catch (err) {
    console.error("Analytics course-view flag failed:", err);
  }
}

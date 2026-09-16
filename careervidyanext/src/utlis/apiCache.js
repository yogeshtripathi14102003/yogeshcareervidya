// utlis/apiCache.js
//
// Generic persistent cache for ANY list/data fetch — courses, students,
// leads, counselors, whatever. Backed by localStorage so it survives
// page refresh (unlike a plain in-memory object).
//
// Usage is the same everywhere: pick a unique cache key per page/query,
// check cache before fetching, save after fetching.

const CACHE_PREFIX = "cv_cache_";
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes — tune per page if needed

export const getCached = (key) => {
  if (typeof window === "undefined") return null; // SSR safety
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.data || !parsed?.expiresAt) return null;

    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(CACHE_PREFIX + key); // expired, clean up
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
};

export const setCached = (key, data, ttlMs = DEFAULT_TTL_MS) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, expiresAt: Date.now() + ttlMs })
    );
  } catch {
    // localStorage full/unavailable — fail silently, just skip caching
  }
};

// Clear ONE specific cache key — e.g. after editing a single course/student.
export const clearCached = (key) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_PREFIX + key);
};

// Clear ALL cache keys that start with a given prefix — e.g. clearCachedGroup("students")
// clears every students_* cache entry (different pages/filters) at once.
// Call this after create/update/delete so stale cache doesn't linger.
export const clearCachedGroup = (groupPrefix) => {
  if (typeof window === "undefined") return;
  Object.keys(localStorage)
    .filter((k) => k.startsWith(CACHE_PREFIX + groupPrefix))
    .forEach((k) => localStorage.removeItem(k));
};

// Nuclear option — wipes every cached entry this app has stored.
export const clearAllCache = () => {
  if (typeof window === "undefined") return;
  Object.keys(localStorage)
    .filter((k) => k.startsWith(CACHE_PREFIX))
    .forEach((k) => localStorage.removeItem(k));
};
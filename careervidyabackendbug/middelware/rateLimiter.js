import rateLimit from "express-rate-limit";
import * as rateLimitPkg from "express-rate-limit";
import jwt from "jsonwebtoken";

// express-rate-limit v7.14+/v8 exports an IPv6-safe key helper specifically
// because naive `req.ip` string keying can be bypassed via equivalent IPv6
// representations. Used defensively (not a static named import) since this
// can't be verified by running the package in this environment — falls
// back to plain req.ip if the helper isn't present in whatever version
// ends up installed, rather than risk crashing the server at startup.
const safeIpKey = (req) =>
  typeof rateLimitPkg.ipKeyGenerator === "function"
    ? rateLimitPkg.ipKeyGenerator(req.ip)
    : req.ip;

/**
 * Rate-limit key resolution: prefer the authenticated caller's user id over
 * their IP address.
 *
 * Why this matters: express-rate-limit defaults to keying by IP. Multiple
 * counselors in the same office (or students on the same campus wifi, or
 * anyone behind a mobile carrier's shared NAT) all share one public IP —
 * under IP-only keying they'd all draw from the *same* limit bucket, so one
 * busy user (or just several legitimate users) trips the limit for everyone
 * else on that connection. Keying by user id means each person gets their
 * own budget regardless of who else shares their network.
 *
 * jwt.decode() (not verify()) is intentional here — this is only used to
 * pick a rate-limit bucket, not to authenticate the request (the real
 * authMiddleware still verifies the token on protected routes). Worst case
 * a forged/expired token just gets its own harmless bucket; it can't be
 * used to bypass or inflate anyone else's limit.
 */
const resolveKey = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.decode(token);
      if (decoded?.id) return `user:${decoded.id}`;
    }
  } catch {
    // fall through to IP-based keying
  }
  return `ip:${safeIpKey(req)}`;
};

const buildLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    keyGenerator: resolveKey,
    standardHeaders: true, // adds RateLimit-* headers, and Retry-After only on an actual 429
    legacyHeaders: false,
    message: { msg: message },
  });

/* ---- Login / OTP — the one place a tight, IP-aware limit is actually
   the point (this protects against credential-stuffing / OTP-bombing). ---- */
export const otpRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: "Too many OTP requests. Please wait a minute." },
});

/* ---- Public / anonymous browsing + analytics beacons ----
   This is genuinely high-volume by design now: session heartbeats every
   60s, page enter/exit on every navigation, course-view tracking, visitor
   beacons. None of that is "abuse" — it's the app working as built. */
export const publicApiLimiter = buildLimiter(
  15 * 60 * 1000,
  2000,
  "Too many requests. Please slow down and try again shortly."
);

/* ---- Authenticated user traffic (students, counselors) ----
   Keyed by user id, so this is per-person, not per-shared-IP. */
export const authenticatedApiLimiter = buildLimiter(
  15 * 60 * 1000,
  3000,
  "Too many requests from your account. Please slow down and try again shortly."
);

/* ---- Admin / subadmin dashboards ----
   These poll on a schedule by design (Module 10's live dashboard refreshes
   every 30s, notification bells, report previews) — sized generously on
   purpose since this is trusted internal staff traffic, not the abuse
   vector rate limiting exists to catch. */
export const adminApiLimiter = buildLimiter(
  15 * 60 * 1000,
  5000,
  "Too many requests from your account. Please slow down and try again shortly."
);

/* ---- Last-resort global backstop ----
   Applied to every request as a final DDoS guard, loose enough that it
   should never fire on legitimate traffic (the category-specific limiters
   above are the real protection). IP-keyed on purpose — this is the one
   limiter meant to catch a single bad actor hammering the API regardless
   of whether they're authenticated. */
export const globalBackstopLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6000,
  keyGenerator: (req) => safeIpKey(req),
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: "Too many requests from this network. Please try again later." },
});

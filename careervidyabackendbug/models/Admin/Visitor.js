import mongoose from "mongoose";

// ── Module 1: Visitor Analytics ──────────────────────────────────
// Extended from the original basic IP+pages tracker. Kept the original
// fields (ip, visits, pages, isReturning, lastVisitedAt) so existing
// admin dashboards / queries keep working, and added everything Module 1
// asks for on top.
const visitorSchema = new mongoose.Schema(
  {
    // ---- identity ----
    sessionId: { type: String, index: true }, // one per browser tab session
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null, index: true },
    isGuest: { type: Boolean, default: true },

    ip: String,
    userAgent: String,
    browser: String,
    browserVersion: String,
    device: String, // "Mobile" | "Tablet" | "Desktop"
    os: String,
    osVersion: String,
    screenResolution: String, // e.g. "1920x1080"

    // ---- geo (from geoip-lite, offline lookup — best-effort, may be null for local/VPN IPs) ----
    city: String,
    state: String,
    country: String,

    // ---- acquisition ----
    referrer: String, // raw document.referrer
    referralSource: String, // normalized: "google" | "facebook" | "instagram" | "direct" | "referral" | ...
    landingPage: String, // first page of this session
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    utmTerm: String,
    utmContent: String,

    // ---- session lifecycle ----
    loginTime: Date, // when this session authenticated, if it did
    logoutTime: Date,
    sessionDuration: { type: Number, default: 0 }, // seconds, updated on heartbeat/exit
    lastActiveTime: { type: Date, default: Date.now },

    // ---- legacy fields, kept for backward compatibility ----
    visits: { type: Number, default: 1 },
    pages: [
      {
        page: String,
        count: { type: Number, default: 1 },
      },
    ],
    lastVisitedAt: { type: Date, default: Date.now },
    isReturning: Boolean,
  },
  { timestamps: true }
);

visitorSchema.index({ ip: 1 });
visitorSchema.index({ sessionId: 1 }, { unique: true, sparse: true });
visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ lastActiveTime: -1 }); // Module 10: "online now" dashboard cards, queried every 30s

export default mongoose.model("Visitor", visitorSchema);

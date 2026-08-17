import mongoose from "mongoose";

// ── Module 1: Visitor Analytics ──────────────────────────────────
const visitorSchema = new mongoose.Schema(
  {
    // ---- identity ----
    // ✅ FIX: "index: true" yahan se hata diya (niche unique index declared hai)
    sessionId: { type: String }, 
    // ✅ FIX: "index: true" yahan se hata diya
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
    isGuest: { type: Boolean, default: true },

    ip: String,
    userAgent: String,
    browser: String,
    browserVersion: String,
    device: String, // "Mobile" | "Tablet" | "Desktop"
    os: String,
    osVersion: String,
    screenResolution: String, // e.g. "1920x1080"

    // ---- geo (from geoip-lite, offline lookup) ----
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
visitorSchema.index({ userId: 1 }); // ✅ Clean explicit index for userId
visitorSchema.index({ sessionId: 1 }, { unique: true, sparse: true });
visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ lastActiveTime: -1 }); // Module 10: "online now" dashboard cards

export default mongoose.model("Visitor", visitorSchema);
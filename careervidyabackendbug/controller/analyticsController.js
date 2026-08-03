// import geoip from "geoip-lite";
// import UAParserPkg from "ua-parser-js";
// // ua-parser-js has changed its export shape across major versions; this
// // works whether it's a default export (v1) or a named export (v2).
// const UAParser = UAParserPkg.UAParser || UAParserPkg.default || UAParserPkg;

import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

import mongoose from "mongoose";
import Visitor from "../models/Admin/Visitor.js";
import PageVisit from "../models/Analytics/PageVisit.js";
import CourseView from "../models/Analytics/CourseView.js";
import Course from "../models/Admin/Course.js";
import { findAssignedLeadByContact } from "../utilities/leadMatching.js";
import { notifyCounselor } from "../utilities/notifyCounselor.js";
import Lead from "../models/counselor/Lead.js";
import Counselor from "../models/counselor/Counselor.js";
import RealtimeNotification from "../models/counselor/RealtimeNotification.js";
import { getOnlineCounselorIds } from "../socket.js";
import { ADMITTED_STATUS, LOST_STATUSES } from "../constant/leadStatus.js";

const getClientIP = (req) => {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (xForwardedFor) return xForwardedFor.split(",")[0].trim();
  return req.connection?.remoteAddress || req.socket?.remoteAddress || null;
};

// Normalize a raw referrer URL into a coarse acquisition channel.
const classifyReferralSource = (referrer, utmSource) => {
  if (utmSource) return utmSource.toLowerCase();
  if (!referrer) return "direct";
  const r = referrer.toLowerCase();
  if (r.includes("google")) return "google";
  if (r.includes("facebook") || r.includes("fb.com")) return "facebook";
  if (r.includes("instagram")) return "instagram";
  if (r.includes("youtube")) return "youtube";
  if (r.includes("linkedin")) return "linkedin";
  if (r.includes("careervidya")) return "internal";
  return "referral";
};

// Module 7: Returning Visitor Alert — if this session belongs to a logged-in
// student who matches an already-assigned Lead, tell the counselor right
// away with enough context to act on it immediately. Never awaited by the
// caller — a notification failure must never slow down or break the
// session-tracking beacon itself.
const REVISIT_COOLDOWN_MS = 30 * 60 * 1000; // don't re-alert the same lead more than once per 30 min

const alertReturningLead = async ({ user, currentPage, geo }) => {
  try {
    if (!user?._id) return; // anonymous visitor — nothing to match against

    const lead = await findAssignedLeadByContact({ email: user.email, phone: user.mobileNumber });
    if (!lead) return;

    const recentAlert = await RealtimeNotification.findOne({
      recipient: lead.assignedTo,
      type: "lead_revisited",
      lead: lead._id,
      createdAt: { $gte: new Date(Date.now() - REVISIT_COOLDOWN_MS) },
    }).lean();
    if (recentAlert) return; // already alerted recently — don't spam

    const previousVisit = lead.lastVisitedAt || null;

    await notifyCounselor(lead.assignedTo, {
      type: "lead_revisited",
      title: "Returning Visitor",
      message: `${lead.name} is back on the website right now.`,
      lead: lead._id,
      meta: {
        leadName: lead.name,
        phone: lead.phone,
        currentPage,
        currentTime: new Date(),
        lastVisit: previousVisit,
        courseInterested: lead.course,
        location: [geo?.city, geo?.state, geo?.country].filter(Boolean).join(", ") || "Unknown",
        loginStatus: "Logged In",
      },
    });

    await Lead.updateOne({ _id: lead._id }, { $set: { lastVisitedAt: new Date() } });
  } catch (err) {
    console.error("alertReturningLead failed:", err.message);
  }
};

/* =====================================================
   MODULE 1 — VISITOR ANALYTICS
   Called once per browser session (session start / heartbeat).
===================================================== */
export const startOrUpdateSession = async (req, res) => {
  try {
    const {
      sessionId,
      screenResolution,
      referrer,
      landingPage,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      isLogin, // true when this call marks a fresh login within the session
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "sessionId is required" });
    }

    const ip = getClientIP(req);
    const userAgentString = req.headers["user-agent"] || "";
    let ua = {};
    try {
      ua = new UAParser(userAgentString).getResult();
    } catch (uaErr) {
      console.error("UA parse failed:", uaErr.message);
    }

    let geo = {};
    try {
      // geoip-lite is an offline lookup (bundled DB) — no external network
      // call, but private/local IPs (127.0.0.1, 10.x, 192.168.x in dev)
      // won't resolve to anything, which is expected.
      const lookup = ip ? geoip.lookup(ip) : null;
      if (lookup) {
        geo = {
          city: lookup.city || null,
          state: lookup.region || null,
          country: lookup.country || null,
        };
      }
    } catch {
      geo = {};
    }

    const userId = req.user?._id || null; // authMiddleware populates this when logged in

    let visitor = await Visitor.findOne({ sessionId });

    if (visitor) {
      visitor.lastActiveTime = new Date();
      if (userId) {
        visitor.userId = userId;
        visitor.isGuest = false;
      }
      if (isLogin) visitor.loginTime = new Date();
      await visitor.save();
      return res.status(200).json({ success: true, message: "Session updated" });
    }

    // Legacy dedup: bump the old ip-keyed doc's visit counter too, so the
    // existing admin "total/unique visitors" cards keep working unchanged.
    const existingByIp = ip ? await Visitor.findOne({ ip, sessionId: { $exists: false } }) : null;
    const isReturning = !!existingByIp;
    if (existingByIp) {
      existingByIp.visits += 1;
      existingByIp.isReturning = true;
      existingByIp.lastVisitedAt = new Date();
      await existingByIp.save();
    }

    await Visitor.create({
      sessionId,
      userId,
      isGuest: !userId,
      ip,
      userAgent: userAgentString,
      browser: ua.browser?.name || "Unknown",
      browserVersion: ua.browser?.version || null,
      device: ua.device?.type ? "Mobile" : "Desktop",
      os: ua.os?.name || "Unknown",
      osVersion: ua.os?.version || null,
      screenResolution: screenResolution || null,
      ...geo,
      referrer: referrer || "Direct",
      referralSource: classifyReferralSource(referrer, utmSource),
      landingPage: landingPage || null,
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      utmTerm: utmTerm || null,
      utmContent: utmContent || null,
      loginTime: isLogin ? new Date() : null,
      lastActiveTime: new Date(),
      visits: 1,
      pages: [],
      isReturning,
      lastVisitedAt: new Date(),
    });

    // Module 7: fire-and-forget — don't let this slow down the beacon response.
    if (userId) {
      alertReturningLead({ user: req.user, currentPage: landingPage, geo });
    }

    return res.status(201).json({ success: true, message: "Session created" });
  } catch (error) {
    console.error("startOrUpdateSession error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* Mark logout / session end — updates logoutTime + final sessionDuration. */
export const endSession = async (req, res) => {
  try {
    const { sessionId, sessionDuration } = req.body;
    if (!sessionId) return res.status(400).json({ success: false, message: "sessionId is required" });

    await Visitor.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          logoutTime: new Date(),
          lastActiveTime: new Date(),
          ...(typeof sessionDuration === "number" ? { sessionDuration } : {}),
        },
      }
    );

    res.status(200).json({ success: true });
} catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* Module 10: lightweight heartbeat — updates lastActiveTime only, no
 * geo/UA re-parsing, so it's cheap enough to call every ~60s and still
 * know who's "online right now" for the live dashboard cards. */
export const sessionHeartbeat = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(200).json({ success: true }); // don't error a beacon over a missing id

    await Visitor.updateOne({ sessionId }, { $set: { lastActiveTime: new Date() } });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(200).json({ success: true }); // best-effort — never break the beacon
  }
};

/* =====================================================
   MODULE 2 — USER JOURNEY TRACKING
===================================================== */
export const trackPageEnter = async (req, res) => {
  try {
    const { sessionId, page } = req.body;
    if (!sessionId || !page) {
      return res.status(400).json({ success: false, message: "sessionId and page are required" });
    }

    const visitor = await Visitor.findOne({ sessionId }).select("_id");

    // Legacy: keep the old per-visitor "pages" counter working too.
    if (visitor) {
      await Visitor.updateOne(
        { _id: visitor._id, "pages.page": page },
        { $inc: { "pages.$.count": 1 }, $set: { lastActiveTime: new Date() } }
      );
      await Visitor.updateOne(
        { _id: visitor._id, "pages.page": { $ne: page } },
        { $push: { pages: { page, count: 1 } }, $set: { lastActiveTime: new Date() } }
      );
    }

    const visit = await PageVisit.create({
      sessionId,
      visitorId: visitor?._id,
      page,
      enterTime: new Date(),
    });

    res.status(201).json({ success: true, pageVisitId: visit._id });
  } catch (error) {
    console.error("trackPageEnter error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* Sent via navigator.sendBeacon on route change / tab close, so it's fired
 * even as the page is unloading. */
export const trackPageExit = async (req, res) => {
  try {
    const { pageVisitId, sessionId, page, scrollPercentage, clickCount } = req.body;

    const filter = pageVisitId
      ? { _id: pageVisitId }
      : { sessionId, page, exitTime: { $exists: false } };

    const visit = await PageVisit.findOne(filter).sort({ enterTime: -1 });
    if (!visit) return res.status(200).json({ success: true }); // nothing to update — don't error the beacon

    const now = new Date();
    visit.exitTime = now;
    visit.timeSpent = Math.max(0, Math.round((now - visit.enterTime) / 1000));
    if (typeof scrollPercentage === "number") {
      visit.scrollPercentage = Math.max(visit.scrollPercentage, Math.min(100, scrollPercentage));
    }
    if (typeof clickCount === "number") visit.clickCount = clickCount;
    await visit.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("trackPageExit error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* Discrete events: downloads, apply/register/login clicks, etc. */
export const trackEvent = async (req, res) => {
  try {
    const { sessionId, page, type, meta, pageVisitId } = req.body;
    if (!sessionId || !type) {
      return res.status(400).json({ success: false, message: "sessionId and type are required" });
    }

    const filter = pageVisitId ? { _id: pageVisitId } : { sessionId, page };
    const visit = await PageVisit.findOne(filter).sort({ enterTime: -1 });

    if (visit) {
      visit.events.push({ type, meta: meta || {}, at: new Date() });
      await visit.save();
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("trackEvent error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* Admin: full timeline for one visitor session (Module 2's stated goal). */
export const getVisitorJourney = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const visitor = await Visitor.findOne({ sessionId });
    const pages = await PageVisit.find({ sessionId }).sort({ enterTime: 1 });

    res.status(200).json({ success: true, visitor, timeline: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   MODULE 3 — COURSE ANALYTICS
===================================================== */
export const trackCourseView = async (req, res) => {
  try {
    const { courseId, courseSlug, sessionId, timeSpent, brochureDownloaded, applyClicked, registered } =
      req.body;

    if ((!courseId && !courseSlug) || !sessionId) {
      return res.status(400).json({
        success: false,
        message: "courseId (or courseSlug) and sessionId are required",
      });
    }

    let course = null;
    if (courseId && mongoose.isValidObjectId(courseId)) {
      course = await Course.findById(courseId).select("_id slug");
    } else if (courseSlug) {
      course = await Course.findOne({ slug: courseSlug }).select("_id slug");
    }
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    let view = await CourseView.findOne({ course: course._id, sessionId }).sort({ createdAt: -1 });

    if (!view) {
      view = await CourseView.create({
        course: course._id,
        courseSlug: course.slug,
        sessionId,
        userId: req.user?._id || null,
        timeSpent: timeSpent || 0,
        brochureDownloaded: !!brochureDownloaded,
        applyClicked: !!applyClicked,
        registered: !!registered,
      });
    } else {
      if (typeof timeSpent === "number") view.timeSpent = timeSpent;
      if (brochureDownloaded) view.brochureDownloaded = true;
      if (applyClicked) view.applyClicked = true;
      if (registered) view.registered = true;
      if (req.user?._id && !view.userId) view.userId = req.user._id; // they may have logged in mid-visit
      await view.save();
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("trackCourseView error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* Admin: full analytics for one course. */
export const getCourseAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid course id" });
    }

    const views = await CourseView.find({ course: courseId });
    const totalViews = views.length;
    const sessionCounts = {};
    views.forEach((v) => {
      sessionCounts[v.sessionId] = (sessionCounts[v.sessionId] || 0) + 1;
    });
    const uniqueVisitors = Object.keys(sessionCounts).length;
    const returningVisitors = Object.values(sessionCounts).filter((c) => c > 1).length;
    const avgTime =
      totalViews > 0 ? Math.round(views.reduce((s, v) => s + (v.timeSpent || 0), 0) / totalViews) : 0;

    const brochureDownloads = views.filter((v) => v.brochureDownloaded).length;
    const applyClicks = views.filter((v) => v.applyClicked).length;
    const registrations = views.filter((v) => v.registered).length;
    const conversionRate = totalViews > 0 ? +((registrations / totalViews) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalViews,
        uniqueVisitors,
        returningVisitors,
        avgTime,
        brochureDownloads,
        applyClicks,
        registrations,
        conversionRate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* Admin: top-viewed / top-converted / most-registered courses. */
export const getTopCourses = async (req, res) => {
  try {
    const { by = "views", limit = 10 } = req.query;

    const agg = await CourseView.aggregate([
      {
        $group: {
          _id: "$course",
          totalViews: { $sum: 1 },
          brochureDownloads: { $sum: { $cond: ["$brochureDownloaded", 1, 0] } },
          applyClicks: { $sum: { $cond: ["$applyClicked", 1, 0] } },
          registrations: { $sum: { $cond: ["$registered", 1, 0] } },
          uniqueSessions: { $addToSet: "$sessionId" },
        },
      },
      {
        $addFields: {
          uniqueVisitors: { $size: "$uniqueSessions" },
          conversionRate: {
            $cond: [
              { $gt: ["$totalViews", 0] },
              { $multiply: [{ $divide: ["$registrations", "$totalViews"] }, 100] },
              0,
            ],
          },
        },
      },
      {
        $sort:
          by === "conversion"
            ? { conversionRate: -1 }
            : by === "registrations"
            ? { registrations: -1 }
            : { totalViews: -1 },
      },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          courseId: "$_id",
          name: "$course.name",
          slug: "$course.slug",
          totalViews: 1,
          uniqueVisitors: 1,
          brochureDownloads: 1,
          applyClicks: 1,
          registrations: 1,
          conversionRate: { $round: ["$conversionRate", 2] },
        },
      },
    ]);

    res.status(200).json({ success: true, data: agg });
  } catch (error) {
    console.error("getTopCourses error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   MODULE 10 — ADMIN DASHBOARD (single aggregated call)
===================================================== */
const ONLINE_THRESHOLD_MS = 2 * 60 * 1000; // matches the ~60s heartbeat interval + buffer

export const getDashboardSummary = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const onlineCutoff = new Date(Date.now() - ONLINE_THRESHOLD_MS);

    const [
      liveWebsiteUsers,
      liveLoggedInUsers,
      todayVisitors,
      todayLeads,
      todayAdmissions,
      pendingLeads,
      pendingFollowUps,
      responseTimes,
      topCounselorAgg,
      topCourseAgg,
      topStateAgg,
      trafficSourcesAgg,
    ] = await Promise.all([
      Visitor.countDocuments({ lastActiveTime: { $gte: onlineCutoff }, logoutTime: { $exists: false } }),
      Visitor.countDocuments({
        lastActiveTime: { $gte: onlineCutoff },
        logoutTime: { $exists: false },
        isGuest: false,
      }),
      Visitor.countDocuments({ createdAt: { $gte: todayStart } }),
      Lead.countDocuments({ createdAt: { $gte: todayStart } }),
      Lead.countDocuments({ status: ADMITTED_STATUS, resolvedAt: { $gte: todayStart } }),
      Lead.countDocuments({ status: { $nin: [ADMITTED_STATUS, ...LOST_STATUSES] } }),
      Lead.countDocuments({
        status: { $nin: [ADMITTED_STATUS, ...LOST_STATUSES] },
        followUpDate: { $lte: now },
      }),
      Lead.find({ firstResponseAt: { $exists: true, $ne: null } })
        .select("createdAt firstResponseAt")
        .limit(2000) // representative sample is plenty for a dashboard average
        .lean(),

      Lead.aggregate([
        { $match: { assignedTo: { $ne: null } } },
        {
          $group: {
            _id: "$assignedTo",
            admissions: { $sum: { $cond: [{ $eq: ["$status", ADMITTED_STATUS] }, 1, 0] } },
          },
        },
        { $sort: { admissions: -1 } },
        { $limit: 1 },
        { $lookup: { from: "counselors", localField: "_id", foreignField: "_id", as: "counselor" } },
        { $unwind: { path: "$counselor", preserveNullAndEmptyArrays: true } },
        { $project: { name: "$counselor.name", admissions: 1 } },
      ]),

      Lead.aggregate([
        { $match: { course: { $nin: [null, ""] } } },
        { $group: { _id: "$course", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),

      Lead.aggregate([
        { $match: { state: { $nin: [null, ""] } } },
        { $group: { _id: "$state", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),

      Visitor.aggregate([
        { $match: { createdAt: { $gte: todayStart } } },
        { $group: { _id: "$referralSource", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const avgResponseMinutes =
      responseTimes.length > 0
        ? Math.round(
            responseTimes.reduce((s, l) => s + (new Date(l.firstResponseAt) - new Date(l.createdAt)) / 60000, 0) /
              responseTimes.length
          )
        : null;

    res.status(200).json({
      success: true,
      data: {
        visitorsOnline: liveWebsiteUsers,
        liveWebsiteUsers,
        liveLoggedInUsers,
        todayVisitors,
        todayLeads,
        admissions: todayAdmissions,
        pendingLeads,
        counselorsOnline: getOnlineCounselorIds().length,
        pendingFollowUps,
        avgResponseMinutes,
        topCounselor: topCounselorAgg[0] ? { name: topCounselorAgg[0].name, admissions: topCounselorAgg[0].admissions } : null,
        topCourse: topCourseAgg[0] ? { name: topCourseAgg[0]._id, count: topCourseAgg[0].count } : null,
        topState: topStateAgg[0] ? { name: topStateAgg[0]._id, count: topStateAgg[0].count } : null,
        trafficSources: trafficSourcesAgg.map((t) => ({ source: t._id || "direct", count: t.count })),
      },
    });
  } catch (err) {
    console.error("getDashboardSummary error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

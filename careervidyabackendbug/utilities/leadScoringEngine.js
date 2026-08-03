import Lead from "../models/counselor/Lead.js";
import CourseView from "../models/Analytics/CourseView.js";
import RealtimeNotification from "../models/counselor/RealtimeNotification.js";
import LeadAdmission from "../models/counselor/LeadAdmission.js";
import { findStudentByContact } from "./studentMatching.js";
import { ADMITTED_STATUS, LOST_STATUSES } from "../constant/leadStatus.js";
import { SCORE_POINTS, getTierFromScore } from "../constant/leadScoring.js";

const NO_ACTIVITY_DAYS = 5;

/** Computes and persists a real score for one lead from actual tracked
 * signals. Returns { score, tier, signals } for callers that want detail
 * (e.g. an admin "why this score" view). */
export const recalculateLeadScore = async (lead) => {
  const signals = [];
  let score = 0;

  // Find the matching Student account, if any — this is how we connect an
  // anonymous CourseView/session trail back to a specific lead.
  const student = await findStudentByContact({ email: lead.email, phone: lead.phone });

  if (student) {
    const views = await CourseView.find({ userId: student._id }).select(
      "applyClicked registered"
    ).lean();

    if (views.some((v) => v.applyClicked)) {
      score += SCORE_POINTS.applied;
      signals.push("Applied");
    }
    if (views.some((v) => v.registered)) {
      score += SCORE_POINTS.registered;
      signals.push("Registered");
    }
    if (views.length >= 2) {
      score += SCORE_POINTS.visitedMultipleTimes;
      signals.push("Visited multiple times");
    }
  }

  const [loggedInEvent, revisitEvent] = await Promise.all([
    RealtimeNotification.findOne({ lead: lead._id, type: "lead_logged_in" }).select("_id").lean(),
    RealtimeNotification.findOne({ lead: lead._id, type: "lead_revisited" }).select("_id").lean(),
  ]);

  if (loggedInEvent) {
    score += SCORE_POINTS.loggedIn;
    signals.push("Logged in");
  }
  if (revisitEvent && !signals.includes("Visited multiple times")) {
    score += SCORE_POINTS.visitedMultipleTimes;
    signals.push("Visited multiple times");
  }

  const admission = lead.phone || lead.email
    ? await LeadAdmission.findOne({
        $or: [
          ...(lead.email ? [{ email: lead.email }] : []),
          ...(lead.phone ? [{ phone: lead.phone }] : []),
        ],
      })
        .select("documents")
        .lean()
    : null;

  if (admission?.documents?.length > 0) {
    score += SCORE_POINTS.documentsUploaded;
    signals.push("Uploaded documents");
  }

  // No activity at all, and it's been sitting untouched for a while.
  const isStale =
    signals.length === 0 &&
    !lead.lastFollowUpAt &&
    Date.now() - new Date(lead.createdAt).getTime() > NO_ACTIVITY_DAYS * 24 * 60 * 60 * 1000;

  if (isStale) {
    score += SCORE_POINTS.noActivity;
    signals.push("No activity");
  }

  // Clamp to a sane range — a single lead shouldn't be able to spiral to
  // an absurd score just because it has a lot of CourseView rows.
  score = Math.max(-50, Math.min(150, score));

  await Lead.updateOne({ _id: lead._id }, { $set: { leadScore: score } });

  return { score, tier: getTierFromScore(score), signals };
};

/** Recalculate every still-open lead. Called by the periodic sweep. */
export const recalculateAllOpenLeadScores = async () => {
  const openLeads = await Lead.find({
    status: { $nin: [ADMITTED_STATUS, ...LOST_STATUSES] },
  })
    .select("_id email phone createdAt lastFollowUpAt")
    .limit(2000) // representative cap per sweep — matches the pattern used elsewhere
    .lean();

  let updated = 0;
  for (const lead of openLeads) {
    try {
      await recalculateLeadScore(lead);
      updated += 1;
    } catch (err) {
      console.error(`Lead scoring failed for ${lead._id}:`, err.message);
    }
  }

  return { totalLeads: openLeads.length, updated };
};

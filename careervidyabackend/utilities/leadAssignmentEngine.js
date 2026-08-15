import mongoose from "mongoose";
import Counselor from "../models/counselor/Counselor.js";
import Lead from "../models/counselor/Lead.js";
import AssignmentConfig from "../models/counselor/AssignmentConfig.js";
import { ADMITTED_STATUS, LOST_STATUSES } from "../constant/leadStatus.js";
import { getTierFromScore } from "../constant/leadScoring.js";

let cachedConfig = null;
let cachedAt = 0;
const CONFIG_CACHE_MS = 30 * 1000; // avoid hitting the DB on every single lead insert during a bulk upload

export const getAssignmentConfig = async ({ fresh = false } = {}) => {
  if (!fresh && cachedConfig && Date.now() - cachedAt < CONFIG_CACHE_MS) {
    return cachedConfig;
  }
  let config = await AssignmentConfig.findOne();
  if (!config) {
    config = await AssignmentConfig.create({});
  }
  cachedConfig = config;
  cachedAt = Date.now();
  return config;
};

export const invalidateAssignmentConfigCache = () => {
  cachedConfig = null;
};

/** Lead priority tier, derived from leadScore. Now backed by Module 11's
 * real scoring engine (see constant/leadScoring.js) instead of a guessed
 * placeholder — a lead with no score yet lands in "cold" by default. */
export const getPriorityTier = (lead) => getTierFromScore(lead.leadScore || 0);

/** Current open-lead count per counselor, used for workload-based tie-breaking. */
const getWorkloadMap = async (counselorIds) => {
  if (!counselorIds.length) return {};
  const objectIds = counselorIds.map((id) => new mongoose.Types.ObjectId(id));
  const counts = await Lead.aggregate([
    {
      $match: {
        assignedTo: { $in: objectIds },
        status: { $nin: [ADMITTED_STATUS, ...LOST_STATUSES] },
      },
    },
    { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
  ]);
  const map = {};
  counts.forEach((c) => (map[String(c._id)] = c.count));
  counselorIds.forEach((id) => {
    if (!(String(id) in map)) map[String(id)] = 0;
  });
  return map;
};

/** Oldest-assignment-first pool ordering — a simple, race-safe round robin
 * that doesn't need a persisted rotating pointer: whoever went longest
 * without a new lead (or never got one) goes next. */
const getLastAssignedMap = async (counselorIds) => {
  if (!counselorIds.length) return {};
  const objectIds = counselorIds.map((id) => new mongoose.Types.ObjectId(id));
  const latest = await Lead.aggregate([
    { $match: { assignedTo: { $in: objectIds }, assignedAt: { $exists: true, $ne: null } } },
    { $group: { _id: "$assignedTo", lastAssignedAt: { $max: "$assignedAt" } } },
  ]);
  const map = {};
  latest.forEach((c) => (map[String(c._id)] = c.lastAssignedAt));
  counselorIds.forEach((id) => {
    if (!(String(id) in map)) map[String(id)] = null; // never assigned — goes first
  });
  return map;
};

/** Narrows the counselor pool down using the mapping array for whatever
 * field the active strategy cares about (state/city/course/university). */
const resolveMappedPool = (mapArr, leadValue) => {
  if (!leadValue || !mapArr?.length) return [];
  const match = mapArr.find(
    (m) => m.value?.trim().toLowerCase() === String(leadValue).trim().toLowerCase()
  );
  return match?.counselors?.map(String) || [];
};

/**
 * Core entry point: given a lead (plain object with at least
 * state/city/course/universityName/leadScore), returns
 * { counselorId, counselorName } or null if nobody is eligible right now.
 */
export const autoAssignLead = async (lead) => {
  const config = await getAssignmentConfig();

  const activeCounselors = await Counselor.find({ status: "active" }).select("_id name leadLimit").lean();
  if (!activeCounselors.length) return null;

  const activeIdSet = new Set(activeCounselors.map((c) => String(c._id)));
  const nameById = Object.fromEntries(activeCounselors.map((c) => [String(c._id), c.name]));
  const limitById = Object.fromEntries(activeCounselors.map((c) => [String(c._id), c.leadLimit]));

  let candidateIds = activeCounselors.map((c) => String(c._id)); // default: everyone active

  switch (config.activeStrategy) {
    case "state_wise": {
      const mapped = resolveMappedPool(config.stateMap, lead.state);
      candidateIds = mapped.filter((id) => activeIdSet.has(id));
      break;
    }
    case "city_wise": {
      const mapped = resolveMappedPool(config.cityMap, lead.city);
      candidateIds = mapped.filter((id) => activeIdSet.has(id));
      break;
    }
    case "course_wise": {
      const mapped = resolveMappedPool(config.courseMap, lead.course);
      candidateIds = mapped.filter((id) => activeIdSet.has(id));
      break;
    }
    case "university_wise": {
      const mapped = resolveMappedPool(config.universityMap, lead.universityName);
      candidateIds = mapped.filter((id) => activeIdSet.has(id));
      break;
    }
    case "priority_based": {
      const tier = getPriorityTier(lead);
      const mapped = (config.priorityMap?.[tier] || []).map(String);
      candidateIds = mapped.filter((id) => activeIdSet.has(id));
      break;
    }
    case "workload_based":
    case "round_robin":
    default:
      // candidateIds already = all active counselors
      break;
  }

  // Rule matched nobody — fall back to the full active pool if configured to.
  if (candidateIds.length === 0) {
    if (!config.fallbackToRoundRobin) return null;
    candidateIds = activeCounselors.map((c) => String(c._id));
  }

  if (candidateIds.length === 0) return null;

  // Enforce each counselor's configured lead limit (null = unlimited) —
  // this only governs automatic assignment; an admin manually assigning a
  // lead is not blocked by it.
  const candidateWorkload = await getWorkloadMap(candidateIds);
  const withinLimit = candidateIds.filter((id) => {
    const limit = limitById[id];
    return limit == null || candidateWorkload[id] < limit;
  });

  if (withinLimit.length > 0) {
    candidateIds = withinLimit;
  } else if (!config.fallbackToRoundRobin) {
    // Everyone in the matched pool is at capacity, and we're not allowed
    // to fall back — leave the lead unassigned rather than overload someone.
    return null;
  }
  // else: everyone matched is at capacity, but fallback is allowed — fall
  // through and let the existing pool stand; the lead still needs a home.

  let chosenId;

  if (config.activeStrategy === "workload_based" || config.considerWorkload) {
    const workload = await getWorkloadMap(candidateIds);
    chosenId = candidateIds.reduce((least, id) =>
      workload[id] < workload[least] ? id : least
    , candidateIds[0]);
  } else {
    const lastAssigned = await getLastAssignedMap(candidateIds);
    chosenId = candidateIds.reduce((oldest, id) => {
      const a = lastAssigned[id];
      const b = lastAssigned[oldest];
      if (a === null) return id; // never assigned — highest priority to go next
      if (b === null) return oldest;
      return new Date(a) < new Date(b) ? id : oldest;
    }, candidateIds[0]);
  }

  return { counselorId: chosenId, counselorName: nameById[chosenId] };
};

import Lead from "../models/counselor/Lead.js";

/**
 * Looks up a Lead by email or phone. Returns null if no match, or if the
 * matched lead has no counselor assigned yet (nobody to notify).
 */
export const findAssignedLeadByContact = async ({ email, phone }) => {
  if (!email && !phone) return null;

  const orClauses = [];
  if (email) orClauses.push({ email: email.trim().toLowerCase() });
  if (phone) orClauses.push({ phone: phone.trim() });
  if (!orClauses.length) return null;

  const lead = await Lead.findOne({ $or: orClauses, assignedTo: { $ne: null } })
    .sort({ createdAt: -1 }) // most recent match if somehow more than one
    .select("_id name phone course city state universityName assignedTo lastVisitedAt")
    .lean();

  return lead;
};

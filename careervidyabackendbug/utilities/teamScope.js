import Counselor from "../models/counselor/Counselor.js";

/**
 * Returns the list of counselor _ids the current user may VIEW.
 * - admin/subadmin: null (meaning "no restriction", caller should skip filtering)
 * - counselor (not a TL): just their own id
 * - counselor (is a TL): their own id + every counselor whose reportsTo === their id
 *
 * This is read-only scoping. It must never be used to decide write access —
 * a Team Lead can see their team's records but not edit/delete them; only
 * admin/subadmin or the owning counselor can do that.
 */
export const getViewableCounselorIds = async (user) => {
  if (!user) return [];
  if (["admin", "subadmin"].includes(user.role)) return null; // unrestricted

  const ownId = String(user._id);

  if (!user.isTeamLead) return [ownId];

  const team = await Counselor.find({ reportsTo: user._id }).select("_id").lean();
  return [ownId, ...team.map((c) => String(c._id))];
};

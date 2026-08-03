import Lead from "../models/counselor/Lead.js";
import Visitor from "../models/Admin/Visitor.js";
import { ADMITTED_STATUS, LOST_STATUSES } from "../constant/leadStatus.js";

const PERIOD_LABELS = { daily: "Daily", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly" };

/** Resolves a named period into a concrete [from, to] range. */
export const resolvePeriodRange = (period, referenceDate = new Date()) => {
  const ref = new Date(referenceDate);
  let from, to;

  if (period === "daily") {
    from = new Date(ref);
    from.setHours(0, 0, 0, 0);
    to = new Date(ref);
    to.setHours(23, 59, 59, 999);
  } else if (period === "weekly") {
    const day = ref.getDay(); // 0 = Sunday
    from = new Date(ref);
    from.setDate(ref.getDate() - day);
    from.setHours(0, 0, 0, 0);
    to = new Date(from);
    to.setDate(from.getDate() + 6);
    to.setHours(23, 59, 59, 999);
  } else if (period === "monthly") {
    from = new Date(ref.getFullYear(), ref.getMonth(), 1, 0, 0, 0, 0);
    to = new Date(ref.getFullYear(), ref.getMonth() + 1, 0, 23, 59, 59, 999);
  } else if (period === "yearly") {
    from = new Date(ref.getFullYear(), 0, 1, 0, 0, 0, 0);
    to = new Date(ref.getFullYear(), 11, 31, 23, 59, 59, 999);
  } else {
    throw new Error(`Unknown period "${period}" — expected daily/weekly/monthly/yearly`);
  }

  return { from, to };
};

export const generateReport = async ({ period, from: customFrom, to: customTo }) => {
  const { from, to } = customFrom && customTo
    ? { from: new Date(customFrom), to: new Date(customTo) }
    : resolvePeriodRange(period);

  const dateFilter = { $gte: from, $lte: to };

  const [
    totalLeads,
    admissions,
    lostLeads,
    leadsBySource,
    leadsByStatus,
    topCounselorsAgg,
    topCoursesAgg,
    totalVisitors,
    trafficSourcesAgg,
  ] = await Promise.all([
    Lead.countDocuments({ createdAt: dateFilter }),
    Lead.countDocuments({ status: ADMITTED_STATUS, resolvedAt: dateFilter }),
    Lead.countDocuments({ status: { $in: LOST_STATUSES }, resolvedAt: dateFilter }),

    Lead.aggregate([
      { $match: { createdAt: dateFilter } },
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Lead.aggregate([
      { $match: { createdAt: dateFilter } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Lead.aggregate([
      { $match: { createdAt: dateFilter, assignedTo: { $ne: null } } },
      {
        $group: {
          _id: "$assignedTo",
          totalLeads: { $sum: 1 },
          admissions: { $sum: { $cond: [{ $eq: ["$status", ADMITTED_STATUS] }, 1, 0] } },
        },
      },
      { $sort: { admissions: -1 } },
      { $limit: 5 },
      { $lookup: { from: "counselors", localField: "_id", foreignField: "_id", as: "counselor" } },
      { $unwind: { path: "$counselor", preserveNullAndEmptyArrays: true } },
      { $project: { name: "$counselor.name", totalLeads: 1, admissions: 1 } },
    ]),

    Lead.aggregate([
      { $match: { createdAt: dateFilter, course: { $nin: [null, ""] } } },
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),

    Visitor.countDocuments({ createdAt: dateFilter }),

    Visitor.aggregate([
      { $match: { createdAt: dateFilter } },
      { $group: { _id: "$referralSource", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  const conversionRate = totalLeads > 0 ? +((admissions / totalLeads) * 100).toFixed(2) : 0;

  return {
    periodLabel: period ? PERIOD_LABELS[period] : "Custom Range",
    range: { from, to },
    generatedAt: new Date(),
    summary: {
      totalLeads,
      admissions,
      lostLeads,
      conversionRate,
      totalVisitors,
    },
    leadsBySource: leadsBySource.map((s) => ({ source: s._id || "Website", count: s.count })),
    leadsByStatus: leadsByStatus.map((s) => ({ status: s._id || "New", count: s.count })),
    topCounselors: topCounselorsAgg.map((c) => ({ name: c.name || "—", totalLeads: c.totalLeads, admissions: c.admissions })),
    topCourses: topCoursesAgg.map((c) => ({ course: c._id, count: c.count })),
    trafficSources: trafficSourcesAgg.map((t) => ({ source: t._id || "direct", count: t.count })),
  };
};

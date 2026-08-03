

  import Lead from "../models/counselor/Lead.js";
  import Counselor from "../models/counselor/Counselor.js";
  import XLSX from "xlsx";
  import mongoose from "mongoose";
  import { getViewableCounselorIds } from "../utilities/teamScope.js";
  import { ADMITTED_STATUS, LOST_STATUSES } from "../constant/leadStatus.js";
  import { autoAssignLead, getAssignmentConfig } from "../utilities/leadAssignmentEngine.js";
  import { notifyCounselor } from "../utilities/notifyCounselor.js";
  import { recalculateLeadScore, recalculateAllOpenLeadScores } from "../utilities/leadScoringEngine.js";
  import { getTierFromScore, TIER_LABELS } from "../constant/leadScoring.js";

  /* =====================================================
    LEADS
  ===================================================== */

  export const getLeads = async (req, res) => {
    try {
      const {
        page = 1,
        limit,
        searchTerm,
        status,
        fromDate,
        toDate,
        counselorId,
        unassignedOnly,
        date, // ✅ NEW: LeadsPage dashboard ke liye IST date filter
      } = req.query;

      let query = {};

      if (status) query.status = status;

      // SECURITY: a counselor (or Team Lead) can only ever see their own
      // scope. This used to trust a client-supplied counselorId (or, if
      // omitted, return every lead in the system) with no check at all.
      const viewableIds = await getViewableCounselorIds(req.user);
      if (viewableIds === null) {
        // admin/subadmin — unrestricted, but honor an explicit filter if given
        if (counselorId) query.assignedTo = counselorId;
        if (unassignedOnly === "true") query.assignedTo = { $exists: false };
      } else {
        query.assignedTo = { $in: viewableIds.map((id) => new mongoose.Types.ObjectId(id)) };
      }

      if (searchTerm) {
        query.$or = [
          { name: { $regex: searchTerm, $options: "i" } },
          { phone: { $regex: searchTerm, $options: "i" } },
          { city: { $regex: searchTerm, $options: "i" } },
        ];
      }

      // ✅ LeadsPage dashboard: date param se updatedAt filter (IST → UTC convert)
      // Example: "2025-05-25" → start: 2025-05-24T18:30:00Z, end: 2025-05-25T18:29:59Z
      if (date) {
        const startIST = new Date(`${date}T00:00:00+05:30`); // IST din ki shuruat
        const endIST = new Date(`${date}T23:59:59.999+05:30`); // IST din ka ant
        query.updatedAt = { $gte: startIST, $lte: endIST };
      }

      // ✅ Agar date nahi aaya toh purana fromDate/toDate createdAt filter chalega
  // Yeh createdAt pe hona chahiye daily assignment ke liye
  if (!date && (fromDate || toDate)) {
    query.createdAt = {};  // ✅ createdAt — assignment date
    if (fromDate) query.createdAt.$gte = new Date(`${fromDate}T00:00:00+05:30`);
    if (toDate)   query.createdAt.$lte = new Date(`${toDate}T23:59:59.999+05:30`);
  }

      let leadsQuery = Lead.find(query)
        .populate("assignedTo", "name email")
        .sort({ updatedAt: -1 }); // ✅ updatedAt se sort — latest updated pehle

      if (limit !== "all") {
        const pageSize = parseInt(limit) || 40;
        const skip = (parseInt(page) - 1) * pageSize;
        leadsQuery = leadsQuery.skip(skip).limit(pageSize);
      }

      const [leads, total, statusStats] = await Promise.all([
        leadsQuery.lean(),
        Lead.countDocuments(query),
        Lead.aggregate([
          { $match: query },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
      ]);

      const finalLimit =
        limit === "all" ? total : parseInt(limit) || 40;

      res.json({
        success: true,
        total,
        data: leads,
        stats: statusStats,
        totalPages: Math.ceil(total / finalLimit) || 1,
        currentPage: parseInt(page),
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Error fetching leads: " + err.message });
    }
  };

  export const getLead = async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      const lead = await Lead.findById(req.params.id).lean();

      if (!lead) {
        return res.status(404).json({ success: false, message: "Lead not found" });
      }

      const viewableIds = await getViewableCounselorIds(req.user);
      if (viewableIds !== null && !viewableIds.includes(String(lead.assignedTo))) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      return res.json({ success: true, data: lead });
    } catch (err) {
      console.error("Error in getLead:", err);
      res.status(500).json({ success: false, message: "Server Error: " + err.message });
    }
  };

  const VALID_SOURCES = ["Website Inquiry", "Website Registration", "Manual Upload", "Imported Lead", "Referral", "Campaign", "Other"];

  export const createLead = async (req, res) => {
    try {
      const source = VALID_SOURCES.includes(req.body.source) ? req.body.source : "Manual Upload";
      let assignedTo = req.body.assignedTo || null;
      let assignedToName = req.body.assignedToName || "";

      // Module 5: Smart Lead Assignment — if the caller didn't explicitly
      // pick a counselor, let the configured strategy choose one.
      if (!assignedTo) {
        const config = await getAssignmentConfig();
        if (config.autoAssignOnCreate) {
          const assignment = await autoAssignLead({
            state: req.body.state,
            city: req.body.city,
            course: req.body.course,
            universityName: req.body.universityName,
            leadScore: 0,
          });
          if (assignment) {
            assignedTo = assignment.counselorId;
            assignedToName = assignment.counselorName;
          }
        }
      }

      const lead = await Lead.create({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        course: req.body.course,
        city: req.body.city,
        state: req.body.state,

        referralName: req.body.referralName,
        studentName: req.body.studentName,
        referralMobile: req.body.referralMobile,
        branch: req.body.branch,
        universityName: req.body.universityName,

        remark: req.body.remark,
        action: req.body.action,

        followUpDate: req.body.followUpDate,
        reminderDate: req.body.reminderDate,
        reminderTime: req.body.reminderTime,

        followUpHistory: req.body.followUpHistory || [],

        source,
        assignedTo,
        assignedToName,
        assignedAt: assignedTo ? new Date() : null, // Module 4: Assigned Time
      });

      if (assignedTo) {
        notifyCounselor(assignedTo, {
          type: "lead_assigned",
          title: "New Lead Assigned",
          message: `${lead.name || "A new lead"}${lead.course ? ` (${lead.course})` : ""} has been assigned to you.`,
          lead: lead._id,
        });
      }

      res.json({ success: true, data: lead });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const updateLead = async (req, res) => {
    try {
      const existing = await Lead.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: "Lead not found" });
      }

      // Never let the generic update path be used to directly overwrite
      // server-computed analytics fields from the client.
      const updates = { ...req.body };
      delete updates.leadScore;
      delete updates.firstResponseAt;
      delete updates.assignedAt;
      delete updates.resolvedAt;
      delete updates.firedAutomationSteps;

      const now = new Date();
      const isCounselorAction = "status" in updates || "remark" in updates || "action" in updates;

      // Module 4: First Response Time — the first time a counselor actually
      // touches this lead (status/remark/action change) after it was created.
      if (isCounselorAction && !existing.firstResponseAt) {
        updates.firstResponseAt = now;
      }

      // Module 4: Last Follow-up — bump whenever a follow-up-shaped update lands.
      if (isCounselorAction) {
        updates.lastFollowUpAt = now;
        updates.firedAutomationSteps = []; // Module 8: staleness clock restarts
      }

      // Module 4: Lost Reason — captured automatically when status moves
      // into one of the "lost" buckets; cleared if the lead is re-engaged.
      if ("status" in updates) {
        if (LOST_STATUSES.includes(updates.status) && existing.status !== updates.status) {
          updates.lostReason = updates.remark?.trim() ? updates.remark : updates.status;
        } else if (!LOST_STATUSES.includes(updates.status)) {
          updates.lostReason = null;
        }

        // Module 9: Resolution Time — stamp the moment a lead first lands
        // on a terminal status (won/lost); clear it if reopened.
        const isTerminal = updates.status === ADMITTED_STATUS || LOST_STATUSES.includes(updates.status);
        if (isTerminal && existing.status !== updates.status && !existing.resolvedAt) {
          updates.resolvedAt = now;
        } else if (!isTerminal) {
          updates.resolvedAt = null;
        }
      }

      // If this update is (re)assigning the lead, stamp the assignment time.
      let reassignedTo = null;
      if ("assignedTo" in updates && String(updates.assignedTo || "") !== String(existing.assignedTo || "")) {
        updates.assignedAt = now;
        reassignedTo = updates.assignedTo;
      }

      const updated = await Lead.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (reassignedTo) {
        notifyCounselor(reassignedTo, {
          type: "lead_assigned",
          title: "New Lead Assigned",
          message: `${updated.name || "A lead"}${updated.course ? ` (${updated.course})` : ""} has been assigned to you.`,
          lead: updated._id,
        });
      }

      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const deleteLead = async (req, res) => {
    try {
      await Lead.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: "Lead deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const bulkDeleteLeads = async (req, res) => {
    try {
      const { status, counselorId } = req.query;

      if (!status || !counselorId) {
        return res.status(400).json({
          success: false,
          message: "Status and Counselor ID are required",
        });
      }

      const result = await Lead.deleteMany({
        status: status,
        assignedTo: counselorId,
      });

      res.json({
        success: true,
        message: `${result.deletedCount} leads deleted successfully`,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  /* =====================================================
    UPLOAD EXCEL (Updated with new fields)
  ===================================================== */

  export const uploadLeads = async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "File required" });
      }

      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheet = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      );

      const normalizeRow = (row) => {
        const out = {};
        for (const key of Object.keys(row)) {
          out[key.trim().toLowerCase().replace(/\s+/g, "")] = row[key];
        }
        return out;
      };

      const get = (row, ...variants) => {
        for (const v of variants) {
          const key = v.trim().toLowerCase().replace(/\s+/g, "");
          if (
            row[key] !== undefined &&
            row[key] !== null &&
            String(row[key]).trim() !== ""
          ) {
            return String(row[key]).trim();
          }
        }
        return "";
      };

      const batchSource = VALID_SOURCES.includes(req.body?.source) ? req.body.source : null;

      const leads = sheet
        .map((rawRow) => {
          const l = normalizeRow(rawRow);
          const rowSource = get(l, "source", "leadsource", "lead source");
          return {
            name: get(l, "name", "fullname", "full name", "studentname", "student name"),
            phone: get(l, "phone", "phoneno", "phone no", "mobile", "mobileno", "mobile no", "contact", "contactno"),
            email: get(l, "email", "emailid", "email id", "email address"),
            course: get(l, "course", "program", "programme", "stream"),
            city: get(l, "city", "location", "address", "district"),
            state: get(l, "state", "region"),
            referralName: get(l, "referralname", "referral name", "referral", "referredby", "referred by"),
            studentName: get(l, "studentname", "student name", "student"),
            referralMobile: get(l, "referralmobile", "referral mobile", "referralphone", "referral phone"),
            branch: get(l, "branch", "centre", "center"),
            universityName: get(l, "universityname", "university name", "university", "college", "collegename", "college name"),
            remark: get(l, "remark", "remarks", "note", "notes", "comment", "comments"),
            action: get(l, "action", "actions", "nextstep", "next step"),
            status: "New",
            source: VALID_SOURCES.includes(rowSource) ? rowSource : batchSource || "Imported Lead",
          };
        })
        .filter((l) => l.phone && l.phone.length >= 6);

      if (!leads.length) {
        return res.status(400).json({
          success: false,
          message:
            "No valid leads found. Check that your Excel has a 'phone' column with data.",
        });
      }

      // Manual/bulk uploads must NEVER be swept into automatic assignment
      // just because the global autoAssignOnCreate setting is on for real
      // website leads — that setting governs Website Inquiry/Registration
      // leads only. A bulk upload only gets auto-assigned if the admin
      // explicitly opts in for *this* upload.
      const explicitAutoAssign = req.body?.autoAssign === "true" || req.body?.autoAssign === true;

      if (explicitAutoAssign) {
        // Sequential on purpose — each pick needs to see the effect of the
        // previous one for round-robin/workload distribution to work
        // correctly across the batch, not just per-lead.
        const assignedCountByCounselor = {};
        for (const lead of leads) {
          const assignment = await autoAssignLead(lead);
          if (assignment) {
            lead.assignedTo = assignment.counselorId;
            lead.assignedToName = assignment.counselorName;
            lead.assignedAt = new Date();
            assignedCountByCounselor[assignment.counselorId] =
              (assignedCountByCounselor[assignment.counselorId] || 0) + 1;
          }
        }

        const inserted = await Lead.insertMany(leads, { ordered: false });

        Object.entries(assignedCountByCounselor).forEach(([counselorId, count]) => {
          notifyCounselor(counselorId, {
            type: "lead_assigned",
            title: "New Leads Assigned",
            message: `${count} new lead${count > 1 ? "s" : ""} from a bulk upload ${count > 1 ? "have" : "has"} been assigned to you.`,
            meta: { count },
          });
        });

        return res.json({
          success: true,
          total: inserted.length,
          skipped: leads.length - inserted.length,
        });
      }

      const inserted = await Lead.insertMany(leads, { ordered: false });
      res.json({
        success: true,
        total: inserted.length,
        skipped: leads.length - inserted.length,
      });
    } catch (err) {
      if (err.name === "BulkWriteError") {
        return res.json({
          success: true,
          total: err.result?.nInserted || 0,
          message: `Inserted with some duplicates skipped`,
        });
      }
      res.status(500).json({ success: false, message: err.message });
    }
  };

  /* =====================================================
    ASSIGN LEADS
  ===================================================== */

  export const assignSelectedLeads = async (req, res) => {
    try {
      const { leadIds, assignments } = req.body;

      if (!leadIds?.length || !assignments) {
        return res.status(400).json({
          success: false,
          message: "leadIds & assignments required",
        });
      }

      let shuffled = [...leadIds].sort(() => Math.random() - 0.5);

      for (const [counselorId, count] of Object.entries(assignments)) {
        if (!count || count <= 0) continue;

        const counselor = await Counselor.findById(counselorId);
        if (!counselor) continue;

        const selected = shuffled.splice(0, count);
        if (!selected.length) break;

        await Lead.updateMany(
          { _id: { $in: selected }, assignedTo: null },
          {
            $set: {
              assignedTo: counselor._id,
              assignedToName: counselor.name,
              assignedAt: new Date(), // Module 4: Assigned Time
            },
          }
        );

        if (selected.length > 0) {
          notifyCounselor(counselor._id, {
            type: "lead_assigned",
            title: "New Leads Assigned",
            message: `${selected.length} new lead${selected.length > 1 ? "s" : ""} ${selected.length > 1 ? "have" : "has"} been assigned to you.`,
            meta: { count: selected.length },
          });
        }
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayAssigned = await Lead.countDocuments({
        assignedTo: { $ne: null },
        updatedAt: { $gte: today },
      });

      res.json({
        success: true,
        message: "Leads assigned successfully",
        todayAssigned,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };



//   export const getLeadsByCounselorId = async (req, res) => {
//   try {
//     const {
//       id,
//       page = 1,
//       limit = 30,
//       searchTerm,
//       status,
//       fromDate,
//       toDate,
//     } = req.query;

//     if (!id)
//       return res
//         .status(400)
//         .json({ success: false, message: "Counselor ID is required" });

//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     let query = { assignedTo: id };

//     if (status) query.status = status;
//     if (searchTerm) {
//       query.$or = [
//         { name: { $regex: searchTerm, $options: "i" } },
//         { phone: { $regex: searchTerm, $options: "i" } },
//         { city: { $regex: searchTerm, $options: "i" } },
//       ];
//     }

//     if (fromDate || toDate) {
//       query.createdAt = {};
//       if (fromDate) query.createdAt.$gte = new Date(`${fromDate}T00:00:00+05:30`);
//       if (toDate)   query.createdAt.$lte = new Date(`${toDate}T23:59:59.999+05:30`);
//     }

//     // ── Aaj ki shuruat (IST midnight → UTC) ──
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0); // server local time se, ya neeche IST hardcode

//     // IST ke liye safe version:
//     const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
//     const todayIST = new Date(nowIST);
//     todayIST.setHours(0, 0, 0, 0);
//     // IST midnight ko UTC mein convert
//     const todayStartUTC = new Date(todayIST.getTime() - (5.5 * 60 * 60 * 1000));

//     const [leads, total, statusStats, todayStats] = await Promise.all([
//       Lead.find(query)
//         .sort({ createdAt: -1 })
//         .skip(limit === "all" ? 0 : skip)
//         .limit(limit === "all" ? 0 : parseInt(limit))
//         .lean(),
//       Lead.countDocuments(query),

//       // Overall status counts (sabke liye, filter ignore karke counselor ke saare leads)
//       Lead.aggregate([
//         { $match: { assignedTo: new mongoose.Types.ObjectId(id) } },
//         { $group: { _id: "$status", count: { $sum: 1 } } },
//       ]),

//       // ── AAJ ke status changes (updatedAt >= aaj IST midnight) ──
//       Lead.aggregate([
//         {
//           $match: {
//             assignedTo: new mongoose.Types.ObjectId(id),
//             updatedAt: { $gte: todayStartUTC },
//           },
//         },
//         { $group: { _id: "$status", count: { $sum: 1 } } },
//       ]),
//     ]);

//     res.json({
//       success: true,
//       total,
//       data: leads,
//       stats: statusStats,
//       todayStats,           // ← Frontend ko yeh chahiye tha
//       totalPages: Math.ceil(total / (limit === "all" ? total : parseInt(limit))) || 1,
//       currentPage: parseInt(page),
//     });
//   } catch (err) {
//     console.error("Error in getLeadsByCounselorId:", err);
//     res
//       .status(500)
//       .json({ success: false, message: "Backend Error: " + err.message });
//   }
// };

export const getLeadsByCounselorId = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 30,
      searchTerm,
      status,
      fromDate,
      toDate,
    } = req.query;

    const isStaffAdmin = ["admin", "subadmin"].includes(req.user?.role);
    // SECURITY: a counselor can only ever request their own leads (or, if
    // they're a Team Lead, a team member's leads). This used to trust a
    // client-supplied `id` query param with no check at all, so any
    // counselor could pass another counselor's id and see their entire
    // lead list.
    let id;
    if (isStaffAdmin) {
      id = req.query.id;
    } else {
      const viewableIds = await getViewableCounselorIds(req.user);
      const requestedId = req.query.id ? String(req.query.id) : String(req.user._id);
      if (!viewableIds.includes(requestedId)) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
      id = requestedId;
    }

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Counselor ID is required" });

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let query = { assignedTo: id };

    if (status) query.status = status;

    // ── Escape regex special chars to prevent invalid-regex crashes ──
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    if (searchTerm) {
      const safeSearchTerm = escapeRegex(searchTerm.trim());
      query.$or = [
        { name: { $regex: safeSearchTerm, $options: "i" } },
        { phone: { $regex: safeSearchTerm, $options: "i" } },
        { city: { $regex: safeSearchTerm, $options: "i" } },
      ];
    }

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(`${fromDate}T00:00:00+05:30`);
      if (toDate)   query.createdAt.$lte = new Date(`${toDate}T23:59:59.999+05:30`);
    }

    // ── Aaj ki shuruat (IST midnight → UTC) ──
    const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const todayIST = new Date(nowIST);
    todayIST.setHours(0, 0, 0, 0);
    // IST midnight ko UTC mein convert
    const todayStartUTC = new Date(todayIST.getTime() - (5.5 * 60 * 60 * 1000));

    const [leads, total, statusStats, todayStats] = await Promise.all([
      Lead.find(query)
        .sort({ createdAt: -1 })
        .skip(limit === "all" ? 0 : skip)
        .limit(limit === "all" ? 0 : parseInt(limit))
        .lean(),
      Lead.countDocuments(query),

      // Overall status counts (sabke liye, filter ignore karke counselor ke saare leads)
      Lead.aggregate([
        { $match: { assignedTo: new mongoose.Types.ObjectId(id) } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // ── AAJ ke status changes (updatedAt >= aaj IST midnight) ──
      Lead.aggregate([
        {
          $match: {
            assignedTo: new mongoose.Types.ObjectId(id),
            updatedAt: { $gte: todayStartUTC },
          },
        },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      success: true,
      total,
      data: leads,
      stats: statusStats,
      todayStats,           // ← Frontend ko yeh chahiye tha
      totalPages: Math.ceil(total / (limit === "all" ? total : parseInt(limit))) || 1,
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error("Error in getLeadsByCounselorId:", err);
    res
      .status(500)
      .json({ success: false, message: "Backend Error: " + err.message });
  }
};

/* =====================================================
   🔥 NEW: COUNSELOR DAILY REMARKS & ACTIONS REPORT
   (Pata chalega ki kal kis counselor ne kitne remark change kiye)
===================================================== */
export const getCounselorDailyReport = async (req, res) => {
  try {
    const { counselorId, targetDate } = req.query; // targetDate format: "2026-06-10" (Kal ki date)

    if (!counselorId || !targetDate) {
      return res.status(400).json({
        success: false,
        message: "Counselor ID and targetDate (YYYY-MM-DD) are required",
      });
    }

    // ─── IST Midnight to Next Day Midnight Range Calculation ───
    const startIST = new Date(`${targetDate}T00:00:00+05:30`);
    const endIST = new Date(`${targetDate}T23:59:59.999+05:30`);

    // MongoDB Aggregation Pipeline: Yeh database level par history ko filter karega
    const report = await Lead.aggregate([
      {
        $match: {
          assignedTo: new mongoose.Types.ObjectId(counselorId),
          // Unhi leads ko uthao jinki history mein targetDate ka koi record ho
          "followUpHistory.date": { $gte: startIST, $lte: endIST }
        }
      },
      {
        // followUpHistory array ko rows mein todne ke liye taaki filtration sahi ho
        $unwind: "$followUpHistory"
      },
      {
        $match: {
          // Sirf wahi history entries match karo jo us din ki hain
          "followUpHistory.date": { $gte: startIST, $lte: endIST }
        }
      },
      {
        // Wapas data ko group karke clean format mein lane ke liye
        $project: {
          _id: 1,
          leadName: "$name",
          leadPhone: "$phone",
          course: "$course",
          city: "$city",
          remarkAtThatTime: "$followUpHistory.remark",
          statusAtThatTime: "$followUpHistory.status",
          changedAt: "$followUpHistory.date"
        }
      },
      {
        // Latest changes pehle dikhein
        $sort: { changedAt: -1 }
      }
    ]);

    res.json({
      success: true,
      date: targetDate,
      counselorId,
      totalRemarksChanged: report.length, // 🔥 Kal kul kitne remarks change hue uski ginti
      data: report // 🔥 Un saare leads aur remarks ki list
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Error generating daily report: " + err.message 
    });
  }
};


/* =====================================================
   🔥 NEW: TRANSFER LEADS (Counselor A → Counselor B)
   - Day-wise (targetDate) ya Month-wise (month + year)
   - Status-wise filter (optional)
   - Count-wise limit (optional — kitni leads transfer karni hain)
   - Response mein status-wise breakdown milega (kitni-kitni
     leads kis status ki transfer hui)
===================================================== */

export const transferLeads = async (req, res) => {
  try {
    const {
      fromCounselorId,   // required: jis counselor se leads hatani hain
      toCounselorId,     // required: jis counselor ko leads deni hain
      status,            // optional: specific status ki leads (e.g. "Interested")
      targetDate,        // optional: "2026-06-10"  → sirf isi din ki leads
      month,             // optional: 1-12 → pure month ki leads (year ke saath use karo)
      year,              // optional: "2026" → month ke saath required
      count,             // optional: kitni leads transfer karni hain (na diya to sab)
      dateField = "createdAt", // optional: "createdAt" ya "updatedAt" pe filter karna ho
    } = req.body;

    // ── Basic validation ──
    if (!fromCounselorId || !toCounselorId) {
      return res.status(400).json({
        success: false,
        message: "fromCounselorId and toCounselorId are required",
      });
    }

    if (fromCounselorId === toCounselorId) {
      return res.status(400).json({
        success: false,
        message: "fromCounselorId and toCounselorId cannot be the same",
      });
    }

    if (!targetDate && !(month && year)) {
      return res.status(400).json({
        success: false,
        message:
          "Provide either targetDate (day-wise) OR month & year (month-wise)",
      });
    }

    const toCounselor = await Counselor.findById(toCounselorId);
    if (!toCounselor) {
      return res.status(404).json({
        success: false,
        message: "Target counselor (toCounselorId) not found",
      });
    }

    // ── Date range calculation (IST aware, same pattern as rest of file) ──
    let startIST, endIST;

    if (targetDate) {
      // Day-wise: ek specific din
      startIST = new Date(`${targetDate}T00:00:00+05:30`);
      endIST = new Date(`${targetDate}T23:59:59.999+05:30`);
    } else {
      // Month-wise: pure month ka range
      const m = parseInt(month);
      const y = parseInt(year);

      if (m < 1 || m > 12) {
        return res.status(400).json({
          success: false,
          message: "month must be between 1 and 12",
        });
      }

      const mm = String(m).padStart(2, "0");
      // Month ka pehla din
      startIST = new Date(`${y}-${mm}-01T00:00:00+05:30`);
      // Month ka aakhri din: agle month ke pehle din se 1ms pehle
      const nextMonth = m === 12 ? 1 : m + 1;
      const nextYear = m === 12 ? y + 1 : y;
      const nmm = String(nextMonth).padStart(2, "0");
      endIST = new Date(
        new Date(`${nextYear}-${nmm}-01T00:00:00+05:30`).getTime() - 1
      );
    }

    // ── Build base query ──
    let query = {
      assignedTo: fromCounselorId,
      [dateField]: { $gte: startIST, $lte: endIST },
    };

    if (status) {
      query.status = status;
    }

    // ── Find matching leads (sorted oldest-first by default) ──
    let leadsQuery = Lead.find(query).sort({ [dateField]: 1 });

    const parsedCount = parseInt(count);
    if (count && parsedCount > 0) {
      leadsQuery = leadsQuery.limit(parsedCount);
    }

    const matchedLeads = await leadsQuery.select("_id status").lean();

    if (!matchedLeads.length) {
      return res.json({
        success: true,
        message: "No matching leads found to transfer",
        totalTransferred: 0,
        statusBreakdown: [],
      });
    }

    const leadIds = matchedLeads.map((l) => l._id);

    // ── Perform transfer ──
    await Lead.updateMany(
      { _id: { $in: leadIds } },
      {
        $set: {
          assignedTo: toCounselor._id,
          assignedToName: toCounselor.name,
          assignedAt: new Date(), // Module 4: Assigned Time
        },
      }
    );

    if (leadIds.length > 0) {
      notifyCounselor(toCounselor._id, {
        type: "lead_assigned",
        title: "Leads Transferred To You",
        message: `${leadIds.length} lead${leadIds.length > 1 ? "s" : ""} ${leadIds.length > 1 ? "have" : "has"} been transferred to you.`,
        meta: { count: leadIds.length },
      });
    }

    // ── Status-wise breakdown (kitni-kitni leads kis status ki gayi) ──
    const statusBreakdown = matchedLeads.reduce((acc, lead) => {
      const key = lead.status || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const statusBreakdownArr = Object.entries(statusBreakdown).map(
      ([status, count]) => ({ status, count })
    );

    res.json({
      success: true,
      message: `${leadIds.length} leads transferred successfully`,
      from: fromCounselorId,
      to: { id: toCounselor._id, name: toCounselor.name },
      mode: targetDate ? "day-wise" : "month-wise",
      range: targetDate ? { targetDate } : { month, year },
      statusFilter: status || "all",
      totalTransferred: leadIds.length,
      statusBreakdown: statusBreakdownArr,
    });
  } catch (err) {
    console.error("Error in transferLeads:", err);
    res.status(500).json({
      success: false,
      message: "Error transferring leads: " + err.message,
    });
  }
};
/* =====================================================
   MODULE 4 — LEAD ANALYTICS
===================================================== */
export const getLeadAnalytics = async (req, res) => {
  try {
    const isStaffAdmin = ["admin", "subadmin"].includes(req.user?.role);
    let scopeFilter = {};

    if (!isStaffAdmin) {
      const viewableIds = await getViewableCounselorIds(req.user);
      scopeFilter = { assignedTo: { $in: viewableIds } };
    }

    const { fromDate, toDate } = req.query;
    if (fromDate || toDate) {
      scopeFilter.createdAt = {};
      if (fromDate) scopeFilter.createdAt.$gte = new Date(`${fromDate}T00:00:00+05:30`);
      if (toDate) scopeFilter.createdAt.$lte = new Date(`${toDate}T23:59:59.999+05:30`);
    }

    const leads = await Lead.find(scopeFilter)
      .select("source status createdAt assignedAt firstResponseAt lastFollowUpAt lostReason leadScore")
      .lean();

    const totalLeads = leads.length;
    const admittedCount = leads.filter((l) => l.status === ADMITTED_STATUS).length;
    const overallConversionRate = totalLeads > 0 ? +((admittedCount / totalLeads) * 100).toFixed(2) : 0;

    // ---- By source ----
    const bySourceMap = {};
    leads.forEach((l) => {
      const src = l.source || "Website";
      if (!bySourceMap[src]) bySourceMap[src] = { source: src, total: 0, admitted: 0 };
      bySourceMap[src].total += 1;
      if (l.status === ADMITTED_STATUS) bySourceMap[src].admitted += 1;
    });
    const bySource = Object.values(bySourceMap).map((s) => ({
      ...s,
      conversionRate: s.total > 0 ? +((s.admitted / s.total) * 100).toFixed(2) : 0,
    }));

    // ---- Status funnel ----
    const statusFunnelMap = {};
    leads.forEach((l) => {
      const st = l.status || "New";
      statusFunnelMap[st] = (statusFunnelMap[st] || 0) + 1;
    });
    const statusFunnel = Object.entries(statusFunnelMap).map(([status, count]) => ({ status, count }));

    // ---- Lost reasons ----
    const lostReasonsMap = {};
    leads
      .filter((l) => LOST_STATUSES.includes(l.status))
      .forEach((l) => {
        const reason = l.lostReason || l.status;
        lostReasonsMap[reason] = (lostReasonsMap[reason] || 0) + 1;
      });
    const lostReasons = Object.entries(lostReasonsMap).map(([reason, count]) => ({ reason, count }));

    // ---- Average first-response time (minutes) ----
    const responded = leads.filter((l) => l.firstResponseAt);
    const avgFirstResponseMinutes =
      responded.length > 0
        ? Math.round(
            responded.reduce(
              (sum, l) => sum + (new Date(l.firstResponseAt) - new Date(l.createdAt)) / 60000,
              0
            ) / responded.length
          )
        : null;

    // ---- Average lead age (days) for still-open leads ----
    const openLeads = leads.filter((l) => l.status !== ADMITTED_STATUS && !LOST_STATUSES.includes(l.status));
    const now = Date.now();
    const avgLeadAgeDays =
      openLeads.length > 0
        ? +(
            openLeads.reduce((sum, l) => sum + (now - new Date(l.createdAt).getTime()) / 86400000, 0) /
            openLeads.length
          ).toFixed(1)
        : null;

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        admittedCount,
        overallConversionRate,
        avgFirstResponseMinutes,
        avgLeadAgeDays,
        bySource,
        statusFunnel,
        lostReasons,
      },
    });
  } catch (err) {
    console.error("getLeadAnalytics error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   MODULE 5 — SMART LEAD ASSIGNMENT
===================================================== */

/* Re-run assignment for a single lead (e.g. its counselor went inactive,
 * or it was never assigned). Admin/subadmin only. */
const notifyBulkAssignments = (countByCounselor, title) => {
  Object.entries(countByCounselor).forEach(([counselorId, count]) => {
    notifyCounselor(counselorId, {
      type: "lead_assigned",
      title,
      message: `${count} lead${count > 1 ? "s" : ""} ${count > 1 ? "have" : "has"} been assigned to you.`,
      meta: { count },
    });
  });
};

export const autoAssignSingleLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    const assignment = await autoAssignLead(lead.toObject());
    if (!assignment) {
      return res.status(200).json({
        success: false,
        message: "No eligible active counselor found for this lead right now.",
      });
    }

    lead.assignedTo = assignment.counselorId;
    lead.assignedToName = assignment.counselorName;
    lead.assignedAt = new Date();
    await lead.save();

    notifyCounselor(assignment.counselorId, {
      type: "lead_assigned",
      title: "New Lead Assigned",
      message: `${lead.name || "A lead"}${lead.course ? ` (${lead.course})` : ""} has been assigned to you.`,
      lead: lead._id,
    });

    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* Bulk: assign every currently-unassigned lead using the active strategy. */
export const bulkAutoAssignUnassigned = async (req, res) => {
  try {
    const unassigned = await Lead.find({ assignedTo: null }).limit(1000);

    let assignedCount = 0;
    const countByCounselor = {};
    for (const lead of unassigned) {
      const assignment = await autoAssignLead(lead.toObject());
      if (!assignment) continue;
      lead.assignedTo = assignment.counselorId;
      lead.assignedToName = assignment.counselorName;
      lead.assignedAt = new Date();
      await lead.save();
      assignedCount += 1;
      countByCounselor[assignment.counselorId] = (countByCounselor[assignment.counselorId] || 0) + 1;
    }

    notifyBulkAssignments(countByCounselor, "New Leads Assigned");

    res.status(200).json({
      success: true,
      message: `${assignedCount} of ${unassigned.length} unassigned leads were assigned.`,
      totalUnassigned: unassigned.length,
      assignedCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* "If counselor is inactive then assign another counselor" — finds every
 * still-open lead currently sitting with an inactive counselor and
 * reassigns it. This is an explicit admin action, not something that fires
 * silently as a side effect of changing a counselor's status. */
export const reassignLeadsFromInactiveCounselors = async (req, res) => {
  try {
    const inactiveCounselors = await Counselor.find({ status: { $ne: "active" } }).select("_id");
    const inactiveIds = inactiveCounselors.map((c) => c._id);

    if (!inactiveIds.length) {
      return res.status(200).json({ success: true, message: "No inactive counselors found.", reassignedCount: 0 });
    }

    const stuckLeads = await Lead.find({
      assignedTo: { $in: inactiveIds },
      status: { $nin: [ADMITTED_STATUS, ...LOST_STATUSES] },
    }).limit(1000);

    let reassignedCount = 0;
    const countByCounselor = {};
    for (const lead of stuckLeads) {
      const assignment = await autoAssignLead(lead.toObject());
      if (!assignment) continue;
      lead.assignedTo = assignment.counselorId;
      lead.assignedToName = assignment.counselorName;
      lead.assignedAt = new Date();
      await lead.save();
      reassignedCount += 1;
      countByCounselor[assignment.counselorId] = (countByCounselor[assignment.counselorId] || 0) + 1;
    }

    notifyBulkAssignments(countByCounselor, "Leads Reassigned To You");

    res.status(200).json({
      success: true,
      message: `${reassignedCount} of ${stuckLeads.length} leads stuck with inactive counselors were reassigned.`,
      totalStuck: stuckLeads.length,
      reassignedCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   MODULE 11 — AI LEAD SCORING
===================================================== */

/* On-demand recalculation for one lead — also returns which signals
 * contributed, useful for an admin/counselor "why this score" view. */
export const getLeadScoreDetail = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    const result = await recalculateLeadScore(lead);
    res.status(200).json({ success: true, ...result, tierLabel: TIER_LABELS[result.tier] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* Admin: trigger the full sweep manually, same idea as Module 8's "run now". */
export const rescoreAllLeads = async (req, res) => {
  try {
    const result = await recalculateAllOpenLeadScores();
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* Tier breakdown across all open leads — Cold/Warm/Hot/Priority counts,
 * scoped the same way as Module 4's analytics (counselor/TL/admin). */
export const getScoreBreakdown = async (req, res) => {
  try {
    const isStaffAdmin = ["admin", "subadmin"].includes(req.user?.role);
    let filter = { status: { $nin: [ADMITTED_STATUS, ...LOST_STATUSES] } };

    if (!isStaffAdmin) {
      const viewableIds = await getViewableCounselorIds(req.user);
      filter.assignedTo = { $in: viewableIds };
    }

    const leads = await Lead.find(filter).select("leadScore").lean();

    const breakdown = { cold: 0, warm: 0, hot: 0, priority: 0 };
    leads.forEach((l) => {
      breakdown[getTierFromScore(l.leadScore || 0)] += 1;
    });

    res.status(200).json({ success: true, data: breakdown, total: leads.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

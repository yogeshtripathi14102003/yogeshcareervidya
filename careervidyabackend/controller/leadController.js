

import Lead from "../models/counselor/Lead.js";
import Counselor from "../models/counselor/Counselor.js";
import XLSX from "xlsx";
import mongoose from "mongoose";

/* =====================================================
   COUNSELOR CRUD
===================================================== */

export const getCounselors = async (req, res) => {
  try {
    const counselors = await Counselor.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: counselors,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCounselor = async (req, res) => {
  try {
    const counselor = await Counselor.findById(req.params.id);
    if (!counselor) {
      return res.status(404).json({ success: false, message: "Counselor not found" });
    }
    res.json({ success: true, data: counselor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCounselor = async (req, res) => {
  try {
    const counselor = await Counselor.create(req.body);
    res.json({ success: true, data: counselor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCounselor = async (req, res) => {
  try {
    const updated = await Counselor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCounselor = async (req, res) => {
  try {
    await Counselor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Counselor deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   LEADS
===================================================== */

export const getLeads = async (req, res) => {
  try {
    const { page = 1, limit, searchTerm, status, fromDate, toDate, counselorId } = req.query;

    // Filter Building
    let query = {};
    if (status) query.status = status;
    if (counselorId) query.assignedTo = counselorId;
    
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
        { city: { $regex: searchTerm, $options: "i" } }
      ];
    }

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate + "T23:59:59.999Z");
    }

    // Performance Optimization: Sirf zaroori fields hi nikalna (Selection)
    let leadsQuery = Lead.find(query)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .select("name phone email course city status assignedToName createdAt referralName studentName branch universityName remark");

    // Pagination Logic
    if (limit !== 'all') {
      const pageSize = parseInt(limit) || 40;
      const skip = (parseInt(page) - 1) * pageSize;
      leadsQuery = leadsQuery.skip(skip).limit(pageSize);
    }

    // Parallel execution for speed with .lean() for faster JSON parsing
    const [leads, total, statusStats] = await Promise.all([
      leadsQuery.lean(),
      Lead.countDocuments(query),
      Lead.aggregate([
        { $match: query }, // Filter ke basis pe stats dikhane ke liye
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ])
    ]);

    const finalLimit = limit === 'all' ? total : (parseInt(limit) || 40);

    res.json({
      success: true,
      total,
      data: leads,
      stats: statusStats,
      totalPages: Math.ceil(total / finalLimit) || 1,
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching leads: " + err.message });
  }
};

export const getLead = async (req, res) => {
  try {
    // 1. Auth Check
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const counselorId = req.user._id;
    const { page = 1, limit, searchTerm, status } = req.query;

    // 2. Query Build
    let query = { assignedTo: counselorId };

    if (status) query.status = status;
    
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } }
      ];
    }

    // 3. Query Setup
    let leadsQuery = Lead.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // 4. Dynamic Pagination Logic
    let pageSize = 0;
    if (limit === 'all') {
      // Agar 'all' hai toh skip aur limit apply nahi karenge
      pageSize = 0; 
    } else {
      pageSize = parseInt(limit) || 30; // Default 30
      const skip = (parseInt(page) - 1) * pageSize;
      leadsQuery = leadsQuery.skip(skip).limit(pageSize);
    }

    // 5. Execution
    const [leads, total] = await Promise.all([
      leadsQuery,
      Lead.countDocuments(query)
    ]);

    // 6. Total Pages Calculation
    // Agar limit 'all' hai toh totalPages 1 hi hoga, warna calculation calculation hogi
    const finalPageSize = limit === 'all' ? total : pageSize;
    const totalPages = finalPageSize > 0 ? Math.ceil(total / finalPageSize) : 1;

    res.json({
      success: true,
      total,
      data: leads,
      totalPages: totalPages || 1,
      currentPage: parseInt(page),
      count: leads.length // Debugging ke liye help karega frontend par
    });

  } catch (err) {
    console.error("Error in getLead (MyLeads):", err);
    res.status(500).json({ success: false, message: "Server Error: " + err.message });
  }
};


export const createLead = async (req, res) => {
  try {
    const lead = await Lead.create({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      course: req.body.course,
      city: req.body.city,

      // New fields added here
      referralName: req.body.referralName,
      studentName: req.body.studentName,
      referralMobile: req.body.referralMobile,
      branch: req.body.branch,
      universityName: req.body.universityName,

      remark: req.body.remark,
      action: req.body.action,
      // status: req.body.status || "New",

      followUpDate: req.body.followUpDate,
      reminderDate: req.body.reminderDate,
      reminderTime: req.body.reminderTime,

      followUpHistory: req.body.followUpHistory || [],

      assignedTo: req.body.assignedTo || null,
      assignedToName: req.body.assignedToName || "",
    });

    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const updateLead = async (req, res) => {
  try {
    // Note: $set: req.body will automatically include new fields sent from frontend
    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

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
    // Frontend se hum Query Params bhej rahe hain
    const { status, counselorId } = req.query;

    if (!status || !counselorId) {
      return res.status(400).json({ 
        success: false, 
        message: "Status and Counselor ID are required" 
      });
    }

    // deleteMany use karein multiple leads delete karne ke liye
    const result = await Lead.deleteMany({ 
      status: status, 
      assignedTo: counselorId 
    });

    res.json({ 
      success: true, 
      message: `${result.deletedCount} leads deleted successfully` 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
/* =====================================================
   UPLOAD EXCEL (Updated with new fields)
===================================================== */

// export const uploadLeads = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "File required" });
//     }

//     const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
//     const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

//     const leads = sheet.map((l) => ({
//       name: l.name,
//       phone: l.phone,
//       email: l.email,
//       course: l.course,
//       city: l.city || "",

//       // New fields mapping from Excel
//       referralName: l.referralName || "",
//       studentName: l.studentName || "",
//       referralMobile: l.referralMobile || "",
//       branch: l.branch || "",
//       universityName: l.universityName || "",

//       remark: l.remark || "",
//       action: l.action || "",
//       status: "New", // Default status from your schema enum
//     }));

//     const inserted = await Lead.insertMany(leads);
//     res.json({ success: true, total: inserted.length });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

export const uploadLeads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File required" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    // ── Step 1: Normalize all keys to lowercase+trimmed ──────────────────────
    // Handles: "Name", "NAME", "name", "  Name  " → all become "name"
    const normalizeRow = (row) => {
      const out = {};
      for (const key of Object.keys(row)) {
        out[key.trim().toLowerCase().replace(/\s+/g, "")] = row[key];
      }
      return out;
    };

    // ── Step 2: Try multiple column name variants ─────────────────────────────
    // e.g. get(row, "phone", "mobile", "contact") → first non-empty value wins
    const get = (row, ...variants) => {
      for (const v of variants) {
        const key = v.trim().toLowerCase().replace(/\s+/g, "");
        if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") {
          return String(row[key]).trim();
        }
      }
      return "";
    };

    // ── Step 3: Map rows with flexible column names ───────────────────────────
    const leads = sheet
      .map((rawRow) => {
        const l = normalizeRow(rawRow);
        return {
          name:           get(l, "name", "fullname", "full name", "studentname", "student name"),
          phone:          get(l, "phone", "phoneno", "phone no", "mobile", "mobileno", "mobile no", "contact", "contactno"),
          email:          get(l, "email", "emailid", "email id", "email address"),
          course:         get(l, "course", "program", "programme", "stream"),
          city:           get(l, "city", "location", "address", "district"),

          referralName:   get(l, "referralname", "referral name", "referral", "referredby", "referred by"),
          studentName:    get(l, "studentname", "student name", "student"),
          referralMobile: get(l, "referralmobile", "referral mobile", "referralphone", "referral phone"),
          branch:         get(l, "branch", "centre", "center"),
          universityName: get(l, "universityname", "university name", "university", "college", "collegename", "college name"),

          remark:         get(l, "remark", "remarks", "note", "notes", "comment", "comments"),
          action:         get(l, "action", "actions", "nextstep", "next step"),
          status:         "New",
        };
      })
      // ── Step 4: Skip rows with no phone (blank/header rows) ─────────────────
      .filter((l) => l.phone && l.phone.length >= 6);

    if (!leads.length) {
      return res.status(400).json({
        success: false,
        message: "No valid leads found. Check that your Excel has a 'phone' column with data.",
      });
    }

    const inserted = await Lead.insertMany(leads, { ordered: false }); // ordered:false = skip duplicates, continue rest
    res.json({ success: true, total: inserted.length, skipped: leads.length - inserted.length });

  } catch (err) {
    // insertMany with ordered:false throws but still inserts — handle gracefully
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
        {
          _id: { $in: selected },
          assignedTo: null,
        },
        {
          $set: {
            assignedTo: counselor._id,
            assignedToName: counselor.name,
          },
        }
      );
    }

    res.json({ success: true, message: "Leads assigned successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLeadsByCounselorId = async (req, res) => {
  try {
    const { id, page = 1, limit = 30, searchTerm, status, fromDate, toDate } = req.query;

    if (!id) return res.status(400).json({ success: false, message: "Counselor ID is required" });

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let query = { assignedTo: id };

    if (status) query.status = status;
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
        { city: { $regex: searchTerm, $options: "i" } }
      ];
    }

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate + "T23:59:59.999Z");
    }

    const [leads, total, statusStats] = await Promise.all([
      Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Lead.countDocuments(query),
      Lead.aggregate([
        { $match: { assignedTo: new mongoose.Types.ObjectId(id) } }, 
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      total,
      data: leads,
      stats: statusStats, 
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    console.error("Error in getLeadsByCounselorId:", err);
    res.status(500).json({ success: false, message: "Backend Error: " + err.message });
  }
};


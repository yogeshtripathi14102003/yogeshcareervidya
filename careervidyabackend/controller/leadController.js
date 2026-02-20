

import Lead from "../models/counselor/Lead.js";
import Counselor from "../models/counselor/Counselor.js";
import XLSX from "xlsx";

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

/* ===== GET ALL LEADS (ADMIN) ===== */
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("assignedTo", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: leads.length,
      data: leads,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===== GET SINGLE LEAD ===== */
export const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("assignedTo", "name email phone");
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   CREATE LEAD (Updated with new fields)
===================================================== */

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

/* =====================================================
   UPDATE LEAD
===================================================== */

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

/* =====================================================
   DELETE LEAD
===================================================== */

export const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Lead deleted" });
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
      return res.status(400).json({ success: false, message: "File required" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    const leads = sheet.map((l) => ({
      name: l.name,
      phone: l.phone,
      email: l.email,
      course: l.course,
      city: l.city || "",

      // New fields mapping from Excel
      referralName: l.referralName || "",
      studentName: l.studentName || "",
      referralMobile: l.referralMobile || "",
      branch: l.branch || "",
      universityName: l.universityName || "",

      remark: l.remark || "",
      action: l.action || "",
      status: "New", // Default status from your schema enum
    }));

    const inserted = await Lead.insertMany(leads);
    res.json({ success: true, total: inserted.length });
  } catch (err) {
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

/* =====================================================
   MY LEADS (COUNSELOR)
===================================================== */

export const getMyLeads = async (req, res) => {
  try {
    const counselorId = req.user._id;

    if (!counselorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const leads = await Lead.find({ assignedTo: counselorId })
      .populate("assignedTo", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: leads.length,
      data: leads,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
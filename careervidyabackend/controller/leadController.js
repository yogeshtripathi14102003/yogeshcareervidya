import Lead from "../models/counsler/Lead.js";
import Counselor from "../models/counsler/Counselor.js";
import XLSX from "xlsx";

/* ================== COUNSELOR CRUD ================== */
export const getCounselors = async (req, res) => {
  try {
    const counselors = await Counselor.find();
    res.json({ success: true, data: counselors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCounselor = async (req, res) => {
  try {
    const counselor = await Counselor.findById(req.params.id);
    if (!counselor)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: counselor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCounselor = async (req, res) => {
  try {
    const newCounselor = await Counselor.create(req.body);
    res.json({ success: true, data: newCounselor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCounselor = async (req, res) => {
  try {
    const updated = await Counselor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCounselor = async (req, res) => {
  try {
    await Counselor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================== LEAD CRUD ================== */
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate("assignedTo");
    res.json({ success: true, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("assignedTo");
    if (!lead)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createLead = async (req, res) => {
  try {
    const newLead = await Lead.create(req.body);
    res.json({ success: true, data: newLead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================== UPLOAD LEADS EXCEL ================== */
export const uploadLeads = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "File required" });

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    const inserted = await Lead.insertMany(
      sheet.map((l) => ({
        name: l.name,
        phone: l.phone,
        email: l.email,
        course: l.course,
        city: l.city || "",
        remark: l.remark || "",
        action: l.action || "",
      }))
    );

    res.json({ success: true, total: inserted.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================== ASSIGN SELECTED LEADS ================== */
export const assignSelectedLeads = async (req, res) => {
  try {
    const { leadIds, assignments } = req.body;
    const shuffled = leadIds.sort(() => Math.random() - 0.5);

    for (const [counselorId, count] of Object.entries(assignments)) {
      const assignLeads = shuffled.splice(0, count);
      await Lead.updateMany({ _id: { $in: assignLeads } }, { assignedTo: counselorId });
    }

    res.json({ success: true, message: "Leads assigned" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// leadController.js

export const getMyLeads = async (req, res) => {
  try {
    const counselorId = req.user.id; // logged-in counselor
    const leads = await Lead.find({ assignedTo: counselorId }).populate("assignedTo");
    res.json({ success: true, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

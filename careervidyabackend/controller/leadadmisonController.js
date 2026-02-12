import LeadAdmission from "../models/counselor/leadAdmission.js";

// ================= CREATE ADMISSION =================
// Isme counselor apna naam khud fill karke bhejega (req.body.counselorName)
export const createLeadAdmission = async (req, res) => {
  try {
    const admissionData = req.body;

    // Agar frontend se counselor ki ID nahi aa rahi, 
    // toh hum sirf counselorName (String) ke saath record create karenge.
    const admission = await LeadAdmission.create(admissionData);

    res.status(201).json({
      success: true,
      message: "✅ Admission created successfully!",
      data: admission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "❌ Error creating admission: " + error.message,
    });
  }
};

// ================= GET ALL ADMISSIONS =================
export const getAllLeadAdmissions = async (req, res) => {
  try {
    // counselor (ObjectId) ko populate kar rahe hain agar available ho, 
    // varna counselorName (String) toh list mein aayega hi.
    const admissions = await LeadAdmission.find()
      .sort({ createdAt: -1 }) // Naye admissions pehle dikhenge
      .populate("counselor", "name email phone");

    res.status(200).json({
      success: true,
      count: admissions.length,
      data: admissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "❌ Error fetching admissions: " + error.message,
    });
  }
};

// ================= GET SINGLE ADMISSION BY ID =================
export const getLeadAdmissionById = async (req, res) => {
  try {
    const admission = await LeadAdmission.findById(req.params.id)
      .populate("counselor");

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "❌ Admission record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "❌ Error: " + error.message,
    });
  }
};

// ================= UPDATE ADMISSION =================
export const updateLeadAdmission = async (req, res) => {
  try {
    const admission = await LeadAdmission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, // Updated data return karega
        runValidators: true // Schema rules check karega
      }
    );

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "❌ Admission not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Admission updated successfully",
      data: admission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "❌ Update failed: " + error.message,
    });
  }
};

// ================= DELETE ADMISSION =================
export const deleteLeadAdmission = async (req, res) => {
  try {
    const admission = await LeadAdmission.findByIdAndDelete(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "❌ Admission not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "🗑️ Admission deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "❌ Delete failed: " + error.message,
    });
  }
};
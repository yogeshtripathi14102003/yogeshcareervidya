import Admission from "../models/Admin/Admission.js";
import cloudinary from "../config/cloudinary.js";

// ================= CREATE =================
export const createAdmission = async (req, res) => {
  try {
    const {
      name,
      email,
      mobileNumber,
      gender,
      dob,
      city,
      state,
      course,
      branch,
      university,
    } = req.body;

    const aadhaarNumber = req.files?.aadhaarNumber ? req.files.aadhaarNumber[0].path : null;
    const panNumber = req.files?.panNumber ? req.files.panNumber[0].path : null;
    const photo = req.files?.photo ? req.files.photo[0].path : null;
    const signature = req.files?.signature ? req.files.signature[0].path : null;

    const admission = await Admission.create({
      name,
      email,
      mobileNumber,
      gender,
      dob,
      city,
      state,
      course,
      branch,
      university,
      aadhaarNumber,
      panNumber,
      photo,
      signature,
    });

    res.status(201).json({ success: true, data: admission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ================= GET ALL =================
export const getAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: admissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ================= GET BY ID =================
export const getAdmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const admission = await Admission.findById(id);
    if (!admission) {
      return res.status(404).json({ success: false, message: "Admission not found" });
    }
    res.status(200).json({ success: true, data: admission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// ================= UPDATE =================
export const updateAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    let admission = await Admission.findById(id);
    if (!admission) {
      return res.status(404).json({ success: false, message: "Admission not found" });
    }

    // Update text fields
    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      admission[key] = updates[key];
    });

    // Handle file updates
    if (req.files) {
      const fileFields = ["aadhaarNumber", "panNumber", "photo", "signature"];
      for (const field of fileFields) {
        if (req.files[field]) {
          // Delete old file if it exists
          if (admission[field]) {
             const parts = admission[field].split('/');
             const fileName = parts.pop().split('.')[0];
             // Matches your folder 'admissions'
             await cloudinary.uploader.destroy(`admissions/${fileName}`);
          }
          admission[field] = req.files[field][0].path;
        }
      }
    }

    await admission.save();
    res.status(200).json({ success: true, data: admission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DELETE =================
export const deleteAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    const admission = await Admission.findById(id);
    if (!admission) {
      return res.status(404).json({ success: false, message: "Admission not found" });
    }

    const fileFields = ["aadhaarNumber", "panNumber", "photo", "signature"];
    for (const field of fileFields) {
      if (admission[field]) {
        const parts = admission[field].split('/');
        const fileName = parts.pop().split('.')[0];
        await cloudinary.uploader.destroy(`admissions/${fileName}`);
      }
    }

    // FIXED: Use deleteOne instead of remove
    await Admission.findByIdAndDelete(id); 
    
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// verify admission 
export const verifyAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ message: "Not Found" });

    admission.verified = true; // add a new field 'verified' in your model
    await admission.save();
    res.status(200).json(admission);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
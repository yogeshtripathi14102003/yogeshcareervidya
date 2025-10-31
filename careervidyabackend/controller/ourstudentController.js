import OurStudent from "../models/Admin/ourStudent.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Create new Student
export const createOurStudent = async (req, res) => {
  try {
    const { name, company } = req.body;
    if (!name || !company) {
      return res
        .status(400)
        .json({ success: false, msg: "All fields are required" });
    }

    let imageUrl = "";
    let companyLogoUrl = "";

    // Upload student image
    if (req.files?.image?.[0]) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: "ourstudents",
      });
      imageUrl = result.secure_url;
    }

    // Upload company logo
    if (req.files?.companyLogo?.[0]) {
      const result = await cloudinary.uploader.upload(
        req.files.companyLogo[0].path,
        { folder: "ourstudents/company_logos" }
      );
      companyLogoUrl = result.secure_url;
    }

    // Create student record
    const student = await OurStudent.create({
      name,
      company,
      image: imageUrl,
      companyLogo: companyLogoUrl,
    });

    res.status(201).json({ success: true, data: student });
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// ✅ Get all Students
export const getOurStudents = async (req, res) => {
  try {
    const students = await OurStudent.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: students });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// ✅ Delete Student
export const deleteOurStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await OurStudent.findByIdAndDelete(id);
    if (!student)
      return res
        .status(404)
        .json({ success: false, msg: "Student not found" });

    res.status(200).json({ success: true, msg: "Student deleted" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

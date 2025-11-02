import University from "../models/Admin/University.js";
import { v2 as cloudinary } from "cloudinary";
import "../config/cloudinary.js";

/* -------------------- UPLOAD HELPER -------------------- */
const uploadToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

/* -------------------- ADD NEW UNIVERSITY -------------------- */
export const addUniversity = async (req, res) => {
  try {
    const { name, description } = req.body;

    const courses = [];
    Object.keys(req.body).forEach((key) => {
      const match = key.match(/courses\[(\d+)\]\[(\w+)\]/);
      if (match) {
        const [_, index, field] = match;
        if (!courses[index]) courses[index] = {};
        courses[index][field] = req.body[key];
      }
    });

    let universityImageUrl = "";
    if (req.files?.universityImage?.[0]) {
      universityImageUrl = await uploadToCloudinary(
        req.files.universityImage[0].buffer,
        "universities"
      );
    }

    const courseLogos = req.files?.courseLogos || [];
    for (let i = 0; i < courseLogos.length; i++) {
      const logoUrl = await uploadToCloudinary(courseLogos[i].buffer, "courses");
      if (courses[i]) courses[i].logo = logoUrl;
    }

    const newUniversity = new University({
      name,
      description,
      universityImage: universityImageUrl,
      courses,
    });

    await newUniversity.save();

    res.status(201).json({
      success: true,
      message: "University added successfully",
      data: newUniversity,
    });
  } catch (error) {
    console.error("Add University Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------- ADD COURSE TO EXISTING UNIVERSITY -------------------- */
export const addCourseToUniversity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration } = req.body;
    let logoUrl = "";

    if (req.file) {
      logoUrl = await uploadToCloudinary(req.file.buffer, "courses");
    }

    const university = await University.findById(id);
    if (!university)
      return res.status(404).json({ success: false, message: "University not found" });

    university.courses.push({ name, duration, logo: logoUrl });
    await university.save();

    res.status(200).json({
      success: true,
      message: "Course added successfully to university",
      data: university,
    });
  } catch (error) {
    console.error("Add Course Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------- GET ALL UNIVERSITIES -------------------- */
export const getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: universities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------- GET SINGLE UNIVERSITY -------------------- */
export const getUniversityById = async (req, res) => {
  try {
    const { id } = req.params;
    const university = await University.findById(id);

    if (!university)
      return res
        .status(404)
        .json({ success: false, message: "University not found" });

    res.status(200).json({ success: true, data: university });
  } catch (error) {
    console.error("Get Single University Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------- DELETE UNIVERSITY -------------------- */
export const deleteUniversity = async (req, res) => {
  try {
    const { id } = req.params;
    const uni = await University.findByIdAndDelete(id);

    if (!uni)
      return res.status(404).json({ success: false, message: "University not found" });

    res.status(200).json({
      success: true,
      message: "University deleted successfully",
    });
  } catch (error) {
    console.error("Delete University Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------- UPDATE UNIVERSITY -------------------- */
export const updateUniversity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    let updateData = { name, description };

    // ✅ If a new university image is uploaded
    if (req.files?.universityImage?.[0]) {
      const universityImageUrl = await uploadToCloudinary(
        req.files.universityImage[0].buffer,
        "universities"
      );
      updateData.universityImage = universityImageUrl;
    }

    const updatedUni = await University.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUni)
      return res.status(404).json({ success: false, message: "University not found" });

    res.status(200).json({
      success: true,
      message: "University updated successfully",
      data: updatedUni,
    });
  } catch (error) {
    console.error("Update University Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

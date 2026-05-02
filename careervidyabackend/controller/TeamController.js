// import Team from "../models/Admin/TeamModel.js";

// /* ================= CREATE TEAM MEMBER ================= */
// export const createTeamMember = async (req, res) => {
//   try {
//     const {
//       name,
//       experience,
//       designation,
//       description,
//       fee,
//       education,
//       mobileNumber,
//       expertise,
//       location,
//       highlights,
//       languages,
//     } = req.body;

//     // Image path from multer
//     const image = req.file ? req.file.path : "";

//     // Required fields check
//     if (!name || !experience || !designation || !mobileNumber || !expertise || !location) {
//       return res.status(400).json({
//         message: "Name, Experience, Designation, Mobile Number, Expertise, and Location are required.",
//       });
//     }

//     // Parse highlights and languages safely
//     const parsedHighlights = highlights ? JSON.parse(highlights) : [];
//     const parsedLanguages = languages ? JSON.parse(languages) : [];

//     const teamMember = new Team({
//       name,
//       experience,
//       designation,
//       description,
//       image,
//       fee: fee || 0,
//       education: education || "Not Specified",
//       mobileNumber,
//       expertise,
//       location,
//       highlights: parsedHighlights,
//       languages: parsedLanguages,
//     });

//     await teamMember.save();

//     res.status(201).json({
//       success: true,
//       message: "Team member created successfully",
//       teamMember,
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ message: "Mobile number already exists." });
//     }
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// /* ================= GET ALL TEAM MEMBERS ================= */
// export const getAllTeamMembers = async (req, res) => {
//   try {
//     const team = await Team.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: team });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// /* ================= GET TEAM MEMBER BY ID ================= */
// export const getTeamMemberById = async (req, res) => {
//   try {
//     const member = await Team.findById(req.params.id);
//     if (!member) return res.status(404).json({ message: "Team member not found" });
//     res.status(200).json({ success: true, data: member });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// /* ================= UPDATE TEAM MEMBER ================= */
// export const updateTeamMember = async (req, res) => {
//   try {
//     const {
//       name,
//       experience,
//       designation,
//       description,
//       fee,
//       education,
//       mobileNumber,
//       expertise,
//       location,
//       highlights,
//       languages,
//     } = req.body;

//     const image = req.file ? req.file.path : undefined;

//     const updatedData = {
//       ...(name && { name }),
//       ...(experience && { experience }),
//       ...(designation && { designation }),
//       ...(description && { description }),
//       ...(fee && { fee }),
//       ...(education && { education }),
//       ...(mobileNumber && { mobileNumber }),
//       ...(expertise && { expertise }),
//       ...(location && { location }),
//     };

//     // Parse highlights and languages safely if provided
//     if (highlights) updatedData.highlights = JSON.parse(highlights);
//     if (languages) updatedData.languages = JSON.parse(languages);
//     if (image) updatedData.image = image;

//     const member = await Team.findByIdAndUpdate(req.params.id, updatedData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!member) return res.status(404).json({ message: "Team member not found" });

//     res.status(200).json({
//       success: true,
//       message: "Team member updated successfully",
//       member,
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ message: "Mobile number already exists for another member." });
//     }
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// /* ================= DELETE TEAM MEMBER ================= */
// export const deleteTeamMember = async (req, res) => {
//   try {
//     const member = await Team.findByIdAndDelete(req.params.id);
//     if (!member) return res.status(404).json({ message: "Team member not found" });

//     res.status(200).json({
//       success: true,
//       message: "Team member deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };




import Team from "../models/Admin/TeamModel.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

/* ================= HELPER: Safe JSON Parse ================= */
const safeJSONParse = (value, fieldName, res) => {
  try {
    return value ? JSON.parse(value) : [];
  } catch {
    res.status(400).json({ message: `Invalid JSON format in ${fieldName}` });
    return null;
  }
};

/* ================= HELPER: Validate MongoDB ID ================= */
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ================= HELPER: Upload Image to Cloudinary ================= */
const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "team_members",
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  });
  // Delete local temp file after upload
  fs.unlink(filePath, (err) => {
    if (err) console.error("Temp file delete error:", err.message);
  });
  return { url: result.secure_url, publicId: result.public_id };
};

/* ================= HELPER: Delete Image from Cloudinary ================= */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
};

/* ================= CREATE TEAM MEMBER ================= */
export const createTeamMember = async (req, res) => {
  try {
    const {
      name,
      experience,
      designation,
      description,
      fee,
      education,
      mobileNumber,
      expertise,
      location,
      highlights,
      languages,
    } = req.body;

    // ✅ Required fields check
    if (!name || !experience || !designation || !mobileNumber || !expertise || !location) {
      // Delete uploaded temp file if validation fails
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        message: "Name, Experience, Designation, Mobile Number, Expertise, and Location are required.",
      });
    }

    // ✅ Mobile number format validation (10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobileNumber)) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: "Invalid mobile number format." });
    }

    // ✅ Safe JSON parse
    const parsedHighlights = safeJSONParse(highlights, "highlights", res);
    if (highlights && parsedHighlights === null) return;

    const parsedLanguages = safeJSONParse(languages, "languages", res);
    if (languages && parsedLanguages === null) return;

    // ✅ Cloudinary image upload
    let imageUrl = "";
    let imagePublicId = "";
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.path);
      imageUrl = uploaded.url;
      imagePublicId = uploaded.publicId;
    }

    const teamMember = new Team({
      name: name.trim(),
      experience,
      designation: designation.trim(),
      description: description ? description.trim() : "",
      image: imageUrl,
      imagePublicId,
      fee: fee !== undefined ? fee : 0,
      education: education || "Not Specified",
      mobileNumber,
      expertise: expertise.trim(),
      location: location.trim(),
      highlights: parsedHighlights,
      languages: parsedLanguages,
    });

    await teamMember.save();

    res.status(201).json({
      success: true,
      message: "Team member created successfully",
      teamMember,
    });
  } catch (error) {
    // Delete temp file on error
    if (req.file) fs.unlink(req.file.path, () => {});

    if (error.code === 11000) {
      return res.status(400).json({ message: "Mobile number already exists." });
    }
    console.error("createTeamMember error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ================= GET ALL TEAM MEMBERS (with Pagination) ================= */
export const getAllTeamMembers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // ✅ Sensitive data hide + pagination
    const [team, total] = await Promise.all([
      Team.find()
        .select("-mobileNumber -imagePublicId -__v") // hide sensitive fields
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Team.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: team,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("getAllTeamMembers error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ================= GET TEAM MEMBER BY ID ================= */
export const getTeamMemberById = async (req, res) => {
  try {
    // ✅ MongoDB ID validation
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid team member ID." });
    }

    const member = await Team.findById(req.params.id).select("-imagePublicId -__v");
    if (!member) return res.status(404).json({ message: "Team member not found" });

    res.status(200).json({ success: true, data: member });
  } catch (error) {
    console.error("getTeamMemberById error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ================= UPDATE TEAM MEMBER ================= */
export const updateTeamMember = async (req, res) => {
  try {
    // ✅ MongoDB ID validation
    if (!isValidId(req.params.id)) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: "Invalid team member ID." });
    }

    const {
      name,
      experience,
      designation,
      description,
      fee,
      education,
      mobileNumber,
      expertise,
      location,
      highlights,
      languages,
    } = req.body;

    // ✅ Mobile number validation (if provided)
    if (mobileNumber) {
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(mobileNumber)) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({ message: "Invalid mobile number format." });
      }
    }

    // ✅ Safe JSON parse
    const parsedHighlights = highlights ? safeJSONParse(highlights, "highlights", res) : undefined;
    if (highlights && parsedHighlights === null) return;

    const parsedLanguages = languages ? safeJSONParse(languages, "languages", res) : undefined;
    if (languages && parsedLanguages === null) return;

    // ✅ fee !== undefined fix (fee: 0 bhi update hoga ab)
    const updatedData = {
      ...(name && { name: name.trim() }),
      ...(experience && { experience }),
      ...(designation && { designation: designation.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(fee !== undefined && fee !== null && { fee }),  // 0 bhi chalega
      ...(education && { education }),
      ...(mobileNumber && { mobileNumber }),
      ...(expertise && { expertise: expertise.trim() }),
      ...(location && { location: location.trim() }),
      ...(parsedHighlights !== undefined && { highlights: parsedHighlights }),
      ...(parsedLanguages !== undefined && { languages: parsedLanguages }),
    };

    // ✅ New image upload + old image delete
    if (req.file) {
      const existingMember = await Team.findById(req.params.id).select("imagePublicId");
      if (existingMember?.imagePublicId) {
        await deleteFromCloudinary(existingMember.imagePublicId);
      }

      const uploaded = await uploadToCloudinary(req.file.path);
      updatedData.image = uploaded.url;
      updatedData.imagePublicId = uploaded.publicId;
    }

    const member = await Team.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    }).select("-imagePublicId -__v");

    if (!member) return res.status(404).json({ message: "Team member not found" });

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      member,
    });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});

    if (error.code === 11000) {
      return res.status(400).json({ message: "Mobile number already exists for another member." });
    }
    console.error("updateTeamMember error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ================= DELETE TEAM MEMBER ================= */
export const deleteTeamMember = async (req, res) => {
  try {
    // ✅ MongoDB ID validation
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid team member ID." });
    }

    const member = await Team.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    // ✅ Cloudinary se image bhi delete karo
    if (member.imagePublicId) {
      await deleteFromCloudinary(member.imagePublicId);
    }

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("deleteTeamMember error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

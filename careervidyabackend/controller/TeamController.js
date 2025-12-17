import Team from "../models/Admin/TeamModel.js";

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

    // Image path from multer
    const image = req.file ? req.file.path : "";

    // Required fields check
    if (!name || !experience || !designation || !mobileNumber || !expertise || !location) {
      return res.status(400).json({
        message: "Name, Experience, Designation, Mobile Number, Expertise, and Location are required.",
      });
    }

    // Parse highlights and languages safely
    const parsedHighlights = highlights ? JSON.parse(highlights) : [];
    const parsedLanguages = languages ? JSON.parse(languages) : [];

    const teamMember = new Team({
      name,
      experience,
      designation,
      description,
      image,
      fee: fee || 0,
      education: education || "Not Specified",
      mobileNumber,
      expertise,
      location,
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
    if (error.code === 11000) {
      return res.status(400).json({ message: "Mobile number already exists." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ================= GET ALL TEAM MEMBERS ================= */
export const getAllTeamMembers = async (req, res) => {
  try {
    const team = await Team.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ================= GET TEAM MEMBER BY ID ================= */
export const getTeamMemberById = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ================= UPDATE TEAM MEMBER ================= */
export const updateTeamMember = async (req, res) => {
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

    const image = req.file ? req.file.path : undefined;

    const updatedData = {
      ...(name && { name }),
      ...(experience && { experience }),
      ...(designation && { designation }),
      ...(description && { description }),
      ...(fee && { fee }),
      ...(education && { education }),
      ...(mobileNumber && { mobileNumber }),
      ...(expertise && { expertise }),
      ...(location && { location }),
    };

    // Parse highlights and languages safely if provided
    if (highlights) updatedData.highlights = JSON.parse(highlights);
    if (languages) updatedData.languages = JSON.parse(languages);
    if (image) updatedData.image = image;

    const member = await Team.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!member) return res.status(404).json({ message: "Team member not found" });

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      member,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Mobile number already exists for another member." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ================= DELETE TEAM MEMBER ================= */
export const deleteTeamMember = async (req, res) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

import Team from "../models/Admin/TeamModel.js";

/** ✅ Create new team member */
export const createTeamMember = async (req, res) => {
  try {
    const { name, experience, designation, description } = req.body;
    const image = req.file ? req.file.path : "";

    if (!name || !experience || !designation || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const teamMember = new Team({ name, experience, designation, image, description });
    await teamMember.save();

    res.status(201).json({
      success: true,
      message: "Team member created successfully",
      teamMember,
    });
  } catch (error) {
    console.error("Error creating team member:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/** ✅ Get all team members */
export const getAllTeamMembers = async (req, res) => {
  try {
    const team = await Team.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/** ✅ Get single team member */
export const getTeamMemberById = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    res.status(200).json({ success: true, data: member });
  } catch (error) {
    console.error("Error fetching team member:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/** ✅ Update team member */
export const updateTeamMember = async (req, res) => {
  try {
    const { name, experience, designation, description } = req.body;
    const image = req.file ? req.file.path : undefined;

    const updatedData = { name, experience, designation, description };
    if (image) updatedData.image = image;

    const member = await Team.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!member) return res.status(404).json({ message: "Team member not found" });

    res.status(200).json({ success: true, message: "Team member updated successfully", member });
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/** ✅ Delete team member */
export const deleteTeamMember = async (req, res) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    res.status(200).json({ success: true, message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

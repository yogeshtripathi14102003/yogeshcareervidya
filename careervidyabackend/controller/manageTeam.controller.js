import ManageTeam from "../models/Admin/manageTeam.model.js";

// Add Team Member
export const addTeamMember = async (req, res) => {
  try {
    const team = await ManageTeam.create(req.body);

    res.status(201).json({
      success: true,
      message: "Team member added successfully",
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Team Members
export const getAllTeamMembers = async (req, res) => {
  try {
    const teams = await ManageTeam.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Team Member
export const getSingleTeamMember = async (req, res) => {
  try {
    const team = await ManageTeam.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Team Member
export const updateTeamMember = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      designation: req.body.designation,
      description: req.body.description,
    };

    if (req.file) {
      data.image = req.file.path;
    }
    
    const updatedTeam = await ManageTeam.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updatedTeam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Team Member
export const deleteTeamMember = async (req, res) => {
  try {
    await ManageTeam.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
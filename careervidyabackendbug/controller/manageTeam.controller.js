import ManageTeam from "../models/Admin/manageTeam.model.js";
import fs from "fs";
import path from "path";

// Add Team Member
export const addTeamMember = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      designation: req.body.designation,
      description: req.body.description,
    };

    if (req.file) {
      data.image = req.file.path.replace(/\\/g, "/"); // Windows path fix
    }

    const team = await ManageTeam.create(data);

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
      data.image = req.file.path.replace(/\\/g, "/"); // Windows path fix

      // Delete old image from disk
      const existingMember = await ManageTeam.findById(req.params.id);
      if (existingMember && existingMember.image) {
        const oldImagePath = path.resolve(existingMember.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedTeam = await ManageTeam.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

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
    const member = await ManageTeam.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    // Delete image from disk
    if (member.image) {
      const imagePath = path.resolve(member.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

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
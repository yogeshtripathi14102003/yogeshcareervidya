import Team from "../models/Admin/TeamModel.js";

/** ✅ Create new team member */
export const createTeamMember = async (req, res) => {
  try {
    // model के अनुसार सभी fields destructure किए गए
    const { 
      name, 
      experience, 
      designation, 
      description,
      fee, 
      education, 
      mobileNumber, 
      expertise, // ✅ Added new field
      location, // ✅ Added new field (Replaces 'state')
    } = req.body;
    
    // image field file upload से आ रहा है
    const image = req.file ? req.file.path : "";

    // Required fields check (model के अनुसार mobileNumber, expertise, और location भी required हैं)
    if (!name || !experience || !designation || !mobileNumber || !expertise || !location) {
      return res.status(400).json({ 
        message: "Name, Experience, Designation, Mobile Number, Expertise, and Location fields are required." 
      });
    }

    // New TeamMember instance creation, including all fields
    const teamMember = new Team({ 
      name, 
      experience, 
      designation, 
      description, 
      image,
      fee, 
      education, 
      mobileNumber, 
      expertise, // ✅ Added
      location, // ✅ Added
    });
    
    await teamMember.save();

    res.status(201).json({
      success: true,
      message: "Team member created successfully",
      teamMember,
    });
  } catch (error) {
    // Mobile number unique constraint error handling
    if (error.code === 11000) {
        return res.status(400).json({ message: "Mobile number already exists." });
    }
    console.error("Error creating team member:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/** ✅ Get all team members (No Change) */
export const getAllTeamMembers = async (req, res) => {
  try {
    const team = await Team.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/** ✅ Get single team member (No Change) */
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
    // model के अनुसार सभी fields destructure किए गए
    const { 
      name, 
      experience, 
      designation, 
      description,
      fee, 
      education, 
      mobileNumber, 
      expertise, // ✅ Added new field
      location, // ✅ Added new field (Replaces 'state')
    } = req.body;
    
    const image = req.file ? req.file.path : undefined;

    // UpdatedData object में सभी fields शामिल किए गए
    const updatedData = { 
      name, 
      experience, 
      designation, 
      description,
      fee, 
      education, 
      mobileNumber, 
      expertise, // ✅ Added
      location, // ✅ Added
      // ❌ Removed 'state' field
    };
    
    // केवल अगर एक नई image upload की गई है तो उसे updatedData में जोड़ें
    if (image) updatedData.image = image;

    // Mongoose validation options जोड़ा गया है ताकि update करते समय required और unique constraints लागू हों
    const member = await Team.findByIdAndUpdate(
      req.params.id, 
      updatedData, 
      { 
        new: true,
        runValidators: true, // Validation run करने के लिए
      }
    );

    if (!member) return res.status(404).json({ message: "Team member not found" });

    res.status(200).json({ success: true, message: "Team member updated successfully", member });
  } catch (error) {
    // Mobile number unique constraint error handling during update
    if (error.code === 11000) {
      return res.status(400).json({ message: "Mobile number already exists for another member." });
    }
    console.error("Error updating team member:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/** ✅ Delete team member (No Change) */
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
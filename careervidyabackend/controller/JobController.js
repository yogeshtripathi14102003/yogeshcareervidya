import applyModel from "../models/Admin/applyModel.js";
// CREATE Application
export const addApplication = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      expectedSalary,
      experience,
      noticePeriod,
    } = req.body;

    const resume = req.files?.resume?.[0]?.path;
    const additionalDocument = req.files?.additionalDocument?.[0]?.path;

    if (!resume) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const newApplication = await applyModel.create({
      name,
      email,
      phone,
      expectedSalary,
      experience,
      noticePeriod,
      resume,
      additionalDocument,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      data: newApplication,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL Applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await applyModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Applications fetched",
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET Application BY ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await applyModel.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ data: application });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// UPDATE Application
export const updateApplication = async (req, res) => {
  try {
    const data = req.body;

    if (req.files?.resume)
      data.resume = req.files.resume[0].path;

    if (req.files?.additionalDocument)
      data.additionalDocument = req.files.additionalDocument[0].path;

    const application = await applyModel.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application updated successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE Application Status Only
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = [
      "Pending",
      "Reviewed",
      "Interview Scheduled",
      "Rejected",
      "Hired",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await applyModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// DELETE Application
export const deleteApplication = async (req, res) => {
  try {
    const deleted = await applyModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

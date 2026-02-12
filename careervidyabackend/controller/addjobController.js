// // controllers/addjobController.js

// import {
//   addJobService,
//   getAllJobsService,
//   updateJobService,
//   deleteJobService,
//   getJobByJobIdService,
// } from "../services/jobService.js";

// // ======================== ADD JOB ========================
// export const addJob = async (req, res) => {
//   try {
//     const { title, description, salaryRange, requirements } = req.body;

//     if (!title || !description || !salaryRange) {
//       return res.status(400).json({
//         success: false,
//         message: "Title, description, and salaryRange are required",
//       });
//     }

//     let reqArray = [];
//     if (requirements) {
//       if (!Array.isArray(requirements)) {
//         return res.status(400).json({
//           success: false,
//           message: "Requirements must be an array",
//         });
//       }

//       reqArray = requirements.filter(
//         (r) => typeof r === "string" && r.trim() !== ""
//       );
//     }

//     const job = await addJobService(title, description, salaryRange, reqArray);

//     return res.status(201).json({
//       success: true,
//       message: "Job added successfully",
//       data: job,
//     });
//   } catch (error) {
//     console.error("ADD JOB ERROR =>", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while adding job",
//     });
//   }
// };

// // ======================== GET ALL JOBS ========================
// export const getAllJobs = async (req, res) => {
//   try {
//     const jobs = await getAllJobsService();
//     return res.status(200).json({ success: true, data: jobs });
//   } catch (error) {
//     console.error("GET JOBS ERROR =>", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error fetching jobs",
//     });
//   }
// };

// // ======================== GET JOB BY ID ========================
// export const getJobById = async (req, res) => {
//   try {
//     const job = await getJobByJobIdService(req.params.jobId);

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found",
//       });
//     }

//     return res.status(200).json({ success: true, data: job });
//   } catch (error) {
//     console.error("GET JOB BY ID ERROR =>", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error fetching job",
//     });
//   }
// };

// // ======================== UPDATE JOB ========================
// export const updateJob = async (req, res) => {
//   try {
//     let updates = { ...req.body };

//     if (updates.requirements && !Array.isArray(updates.requirements)) {
//       return res.status(400).json({
//         success: false,
//         message: "Requirements must be an array",
//       });
//     }

//     // FIX: Changed req.params.id to req.params.jobId
//     const job = await updateJobService(req.params.jobId, updates);

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Job updated successfully",
//       data: job,
//     });
//   } catch (error) {
//     console.error("UPDATE JOB ERROR =>", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error updating job",
//     });
//   }
// };

// // ======================== DELETE JOB ========================
// export const deleteJob = async (req, res) => {
//   try {
//     // FIX: Changed req.params.id to req.params.jobId
//     const job = await deleteJobService(req.params.jobId);

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Job deleted successfully",
//     });
//   } catch (error) {
//     console.error("DELETE JOB ERROR =>", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error deleting job",
//     });
//   }
// };

import {
  addJobService,
  getAllJobsService,
  updateJobService,
  deleteJobService,
  getJobByJobIdService,
} from "../services/jobService.js";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ADD JOB
export const addJob = async (req, res) => {
  try {
    const {
      title,
      description,
      salaryRange,
      requirements,
      hrEmail,
      position,
      location,
      department,
      experience,  // ✅ Added
    } = req.body;

    if (!title || !description || !salaryRange)
      return res.status(400).json({ success: false, message: "Missing fields" });

    if (!hrEmail || !position || !location || !department || !experience)
      return res.status(400).json({ success: false, message: "Missing new fields" });

    if (!isValidEmail(hrEmail))
      return res.status(400).json({ success: false, message: "Invalid email" });

    const cleanReq = (requirements || [])
      .map((r) => r.trim())
      .filter((r) => r);

    const job = await addJobService({
      title,
      description,
      salaryRange,
      requirements: cleanReq,
      hrEmail,
      position,
      location,
      department,
      experience,  // ✅ Added
    });

    res.status(201).json({ success: true, message: "Job Added", data: job });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET ALL JOBS
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await getAllJobsService();
    res.status(200).json({ success: true, data: jobs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET JOB BY ID
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await getJobByJobIdService(jobId);

    if (!job) return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, data: job });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// UPDATE JOB
export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const updates = { ...req.body };
    delete updates.jobId;

    if (updates.hrEmail && !isValidEmail(updates.hrEmail))
      return res.status(400).json({ success: false, message: "Invalid email" });

    const job = await updateJobService(jobId, updates);

    if (!job) return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, message: "Updated", data: job });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// DELETE JOB
export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const deleted = await deleteJobService(jobId);

    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

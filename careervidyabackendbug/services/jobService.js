// // services/jobService.js
// import jobModel from "../models/Admin/job.js";

// // Auto-increment Job ID generator
// const generateJobId = async () => {
//   const lastJob = await jobModel
//     .findOne({}, { jobId: 1 })
//     .sort({ jobId: -1 })
//     .lean();

//   return lastJob ? (parseInt(lastJob.jobId) + 1).toString() : "125730";
// };

// export const addJobService = async (
//   title,
//   description,
//   salaryRange,
//   requirements
// ) => {
//   const jobId = await generateJobId();
//   const job = new jobModel({
//     jobId,
//     title,
//     description,
//     salaryRange,
//     requirements,
//   });
//   return await job.save();
// };

// export const getAllJobsService = async () => {
//   return await jobModel.find().sort({ createdAt: -1 });
// };

// export const getJobByJobIdService = async (jobId) => {
//   return await jobModel.findOne({ jobId });
// };

// export const updateJobService = async (jobId, updates) => {
//   return await jobModel.findOneAndUpdate({ jobId }, updates, { new: true });
// };

// export const deleteJobService = async (jobId) => {
//   return await jobModel.findOneAndDelete({ jobId });
// };


import Job from  "../models/Admin/job.js";

// ADD JOB
export const addJobService = async (data) => {
  const job = new Job(data);
  return await job.save();
};

// GET ALL JOBS
export const getAllJobsService = async (filters = {}, options = {}) => {
  const { page = 1, limit = 20 } = options;

  return await Job.find(filters)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
};

// GET JOB BY JOBID
export const getJobByJobIdService = async (jobId) => {
  return await Job.findOne({ jobId });
};

// UPDATE JOB
export const updateJobService = async (jobId, updates) => {
  return await Job.findOneAndUpdate({ jobId }, updates, { new: true });
};

// DELETE JOB
export const deleteJobService = async (jobId) => {
  return await Job.findOneAndDelete({ jobId });
};

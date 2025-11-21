// // models/Admin/job.js
// import mongoose from "mongoose";

// const jobSchema = new mongoose.Schema(
//   {
//     jobId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     requirements: [
//       {
//         type: String,
//       },
//     ],
//     salaryRange: {
//       type: Number,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const jobModel = mongoose.models.Job || mongoose.model("Job", jobSchema);

// export default jobModel;

// models/Admin/job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: [
      {
        type: String,
      },
    ],

    salaryRange: {
      type: Number,
      required: true,
    },

    // NEW FIELDS
    hrEmail: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    // ✅ Added experience field
    experience: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-generate Job ID (JOB-00001)
jobSchema.pre("save", async function (next) {
  if (this.jobId) return next();

  const lastJob = await mongoose.models.Job.findOne().sort({ createdAt: -1 });

  let newId = "JOB-00001";

  if (lastJob && lastJob.jobId) {
    const lastIdNum = parseInt(lastJob.jobId.split("-")[1]);
    newId = `JOB-${String(lastIdNum + 1).padStart(5, "0")}`;
  }

  this.jobId = newId;
  next();
});

const jobModel = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default jobModel;

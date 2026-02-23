
// import mongoose from "mongoose";

// const jobSchema = new mongoose.Schema(
//   {
//     jobId: {
//       type: String,
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

//     // NEW FIELDS
//     hrEmail: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     position: {
//       type: String,
//       required: true,
//     },

//     location: {
//       type: String,
//       required: true,
//     },

//     department: {
//       type: String,
//       required: true,
//     },

//     // ✅ Added experience field
//     experience: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// // Auto-generate Job ID (JOB-00001)
// jobSchema.pre("save", async function (next) {
//   if (this.jobId) return next();

//   const lastJob = await mongoose.models.Job.findOne().sort({ createdAt: -1 });

//   let newId = "JOB-00001";

//   if (lastJob && lastJob.jobId) {
//     const lastIdNum = parseInt(lastJob.jobId.split("-")[1]);
//     newId = `JOB-${String(lastIdNum + 1).padStart(5, "0")}`;
//   }

//   this.jobId = newId;
//   next();
// });

// const jobModel = mongoose.models.Job || mongoose.model("Job", jobSchema);

// export default jobModel;

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
    requirements: [{ type: String }],
    salaryRange: {
      type: Number,
      required: true,
    },
    hrEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // Good practice for emails
    },
    position: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    // --- FIXED DEPARTMENT FIELD ---
    department: {
      type: String,
      required: true,
      trim: true,
      enum: {
        values: [
          "Counselor",
          "Human Resource",
          "Assistant Manager",
          "Software Development",
          "Sales & Growth",
          "Frontend Development",
          "Backend Development",
          "DevOps",
          "Management",
          "Finance & Accounts",
          "Digital Marketing",
          "Software Testing",
          "IT Support",
        ],
        message: "{VALUE} is not a valid department",
      },
    },
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

  // Use this.constructor to refer to the model safely
  const lastJob = await this.constructor.findOne().sort({ createdAt: -1 });

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
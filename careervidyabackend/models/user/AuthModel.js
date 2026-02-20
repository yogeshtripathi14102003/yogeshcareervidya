

// import mongoose from "mongoose";

// const studentSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
//     },

//     mobileNumber: {
//       type: String,
//       match: /^[0-9]{10,15}$/,
//     },

//     state: {
//       type: String,
//       trim: true,
//     },

//     city: {
//       type: String,
//       trim: true,
//     },

//     addresses: {
//       type: String,
//       trim: true,
//     },

//     course: {
//       type: String,
//       trim: true,
//     },

//     // ✅ Branch (CSE, IT, Mechanical etc.)
//     branch: {
//       type: String,
//       trim: true,
//     },

//     // ✅ Specialization (AI, Data Science, Cyber Security etc.)
//     specialization: {
//       type: String,
//       trim: true,
//     },

//     // ✅ Date of Birth
//     dob: {
//       type: Date,
//     },

//     // ✅ Subsidy Coupon Code
//     subsidyCoupon: {
//       type: String,
//       trim: true,
//       uppercase: true,
//     },

//     description: {
//       type: String,
//       trim: true,
//       maxlength: 500,
//     },

//     gender: {
//       type: String,
//       enum: ["male", "female", "other"],
//       default: "other",
//     },

//     role: {
//       type: String,
//       enum: ["user", "admin", "subadmin"],
//       default: "user",
//     },
//       permissions: {
//     type: [String],
//     default: [],
//   },

//     isSystemAdmin: {
//       type: Boolean,
//       default: false,
//     },

//     oauthId: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// const Student = mongoose.model("Student", studentSchema);
// export default Student;


import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true, // Auto index
      lowercase: true,
      trim: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    },

    mobileNumber: {
      type: String,
      match: /^[0-9]{10,15}$/,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    addresses: {
      type: String,
      trim: true,
    },

    course: {
      type: String,
      trim: true,
    },

    // Branch (CSE, IT, Mechanical etc.)
    branch: {
      type: String,
      trim: true,
    },

    // Specialization (AI, Data Science etc.)
    specialization: {
      type: String,
      trim: true,
    },

    dob: {
      type: Date,
    },

    subsidyCoupon: {
      type: String,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    role: {
      type: String,
      enum: ["user", "admin", "subadmin"],
      default: "user",
    },

    permissions: {
      type: [String],
      default: [],
    },

    isSystemAdmin: {
      type: Boolean,
      default: false,
    },

    oauthId: {
      type: String,
    },
  },
  { timestamps: true }
);

/* ===========================
   INDEXES (FOR FAST SEARCH)
=========================== */

// Email (Login / Unique)
studentSchema.index({ email: 1 }, { unique: true });

// Phone search
studentSchema.index({ mobileNumber: 1 });

// Course / Branch / Specialization filters
studentSchema.index({ course: 1 });
studentSchema.index({ branch: 1 });
studentSchema.index({ specialization: 1 });

// Role based filtering
studentSchema.index({ role: 1 });

// Location search
studentSchema.index({ state: 1, city: 1 });

// Text search (Optional - Global search)
studentSchema.index({
  name: "text",
  email: "text",
  course: "text",
});

/* ===========================
   MODEL
=========================== */

const Student = mongoose.model("Student", studentSchema);

export default Student;

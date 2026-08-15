import mongoose from "mongoose";

const counselorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    userid: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: String,
    pan: String,
    aadhar: String,

    dob: Date,
    doj: Date,

    address: String,

    // ✅ NEW STATUS FIELD
    status: {
      type: String,
      enum: ["active", "leave", "Inactive"], // allowed values
      default: "active", // by default active rahega
    },

    // ---- Team Lead (TL) hierarchy — admin-managed only ----
    isTeamLead: {
      type: Boolean,
      default: false,
    },
    // Module 5 extension: caps how many OPEN leads the automatic assignment
    // engine will give this counselor at once. null = unlimited. Manual
    // assignment (admin dragging a lead onto a counselor) is NOT blocked by
    // this — it's a guardrail for automation, not a hard system limit.
    leadLimit: {
      type: Number,
      default: null,
      min: 0,
    },

    reportsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Counselor",
      default: null,
    },

    // Drives configurable inactivity auto-logout in authMiddleware.js —
    // previously only admin/subadmin had this (and even that was broken,
    // see AuthModel.js), counselors had no inactivity tracking at all.
    lastActivity: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Counselor = mongoose.model("Counselor", counselorSchema);

export default Counselor;

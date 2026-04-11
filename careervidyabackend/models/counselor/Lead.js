
import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    course: { type: String },
    city: { type: String },
    remark: { type: String },
    action: { type: String },
    referralName: { type: String }, 
    studentName: { type: String },
    referralMobile: { type: String },
    branch: { type: String },
    universityName: { type: String },
    status: {
      type: String,
      enum: [
        "New", "Not Interested", "Details Shared", "Follow-up", 
        "Hot Lead", "University Issue", "Fee Issue", "Distance Issue", 
        "Language Issue", "Not Picked", "Admission Done",
      ],
      default: "New",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Counselor",
    },
    assignedToName: { type: String },
    followUpDate: { type: Date },
    reminderDate: { type: String },
    reminderTime: { type: String },
    followUpHistory: [
      {
        date: { type: Date, default: Date.now },
        remark: String,
        status: String,
      },
    ],
  },
  { timestamps: true }
);

// 🔥 PERFORMANCE OPTIMIZATION (INDEXES) 🔥
LeadSchema.index({ createdAt: -1 }); // Sorting ke liye
LeadSchema.index({ assignedTo: 1 }); // Counselor wise filter ke liye
LeadSchema.index({ status: 1 });     // Status filter ke liye
LeadSchema.index({ phone: 1 });      // Search ke liye (optional)

export default mongoose.model("Lead", LeadSchema);
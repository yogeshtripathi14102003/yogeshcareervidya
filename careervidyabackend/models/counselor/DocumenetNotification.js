// models/Notification.js
import mongoose from "mongoose";

const DocumenetNotificationSchema = new mongoose.Schema(
  {
    admissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeadAdmission",
      required: true,
    },
    documentId: { type: String },            // sub-document _id
    studentName: { type: String },
    counselorName: { type: String },
    fileName: { type: String },
    type: {
      type: String,
      enum: ["doc_approved", "doc_rejected", "doc_uploaded"],
      required: true,
    },
    message: { type: String, required: true },
    adminRemark: { type: String, default: "" },
    isRead: { type: Boolean, default: false }, // admin ne padha ya nahi
    readAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("DocumentNotification", DocumenetNotificationSchema);
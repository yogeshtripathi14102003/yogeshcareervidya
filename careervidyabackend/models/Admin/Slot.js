import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    // स्लॉट की मुख्य डिटेल्स
    date: {
      type: String, // Format: "YYYY-MM-DD" या "Tue, Jun 10"
      required: true,
    },
    time: {
      type: String, // Format: "11:00 AM"
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false, // शुरुआत में स्लॉट हमेशा फ्री रहेगा
    },

    // ⬇️ छात्र की डिटेल्स (जब स्लॉट बुक होगा, तब ये भरी जाएंगी)
    studentName: {
      type: String,
      trim: true,
      default: "",
    },
    studentEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    studentMobile: {
      type: String,
      trim: true,
      default: "",
    },
    course: {
      type: String, // e.g., "B.Tech", "MBA"
      trim: true,
      default: "",
    },
    branch: {
      type: String, // e.g., "Computer Science", "Finance"
      trim: true,
      default: "",
    },
    description: {
      type: String, // छात्र की समस्या या सवाल
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// एक ही तारीख और समय पर डबल स्लॉट न बने
slotSchema.index({ date: 1, time: 1 }, { unique: true });

export default mongoose.model("Slot", slotSchema);
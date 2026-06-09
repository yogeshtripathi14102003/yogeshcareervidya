// // models/Admin/Slot.js

// import mongoose from "mongoose";

// const slotSchema = new mongoose.Schema(
//   {
//     date: {
//       type: String, // Format: "YYYY-MM-DD"
//       required: true,
//     },
//     time: {
//       type: String, // Format: "11:00 AM"
//       required: true,
//     },

//     // ✅ Kitne slots available hain is date+time par (admin set karega)
//     totalSeats: {
//       type: Number,
//       default: 1,
//       min: 1,
//     },

//     isBooked: {
//       type: Boolean,
//       default: false,
//     },

//     // ✅ NEW: Approval status
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },

//     // ✅ Rejection reason (optional)
//     rejectionReason: {
//       type: String,
//       trim: true,
//       default: "",
//     },

//     // ✅ Admin ne kab approve/reject kiya
//     actionTakenAt: {
//       type: Date,
//       default: null,
//     },

//     // Student details
//     studentName:   { type: String, trim: true, default: "" },
//     studentEmail:  { type: String, trim: true, lowercase: true, default: "" },
//     studentMobile: { type: String, trim: true, default: "" },
//     course:        { type: String, trim: true, default: "" },
//     branch:        { type: String, trim: true, default: "" },
//     description:   { type: String, trim: true, default: "" },
//     city:          { type: String, trim: true, default: "" },
//   },
//   { timestamps: true }
// );

// // Unique slot per date+time
// slotSchema.index({ date: 1, time: 1 }, { unique: true });

// export default mongoose.model("Slot", slotSchema);

// models/Admin/Slot.js

import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    date: {
      type: String, // Format: "YYYY-MM-DD"
      required: true,
    },
    time: {
      type: String, // Format: "11:00 AM"
      required: true,
    },

    // Admin sets total available seats for this date+time
    totalSeats: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Auto-increments on every booking, decrements on rejection
    bookedSeats: {
      type: Number,
      default: 0,
      min: 0,
    },

    // True only when bookedSeats >= totalSeats (all seats filled)
    isBooked: {
      type: Boolean,
      default: false,
    },

    // Admin approval workflow
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },

    actionTakenAt: {
      type: Date,
      default: null,
    },

    // Latest student who booked (for single-seat tracking)
    // For multi-seat, see bookings[] array below
    studentName:   { type: String, trim: true, default: "" },
    studentEmail:  { type: String, trim: true, lowercase: true, default: "" },
    studentMobile: { type: String, trim: true, default: "" },
    course:        { type: String, trim: true, default: "" },
    branch:        { type: String, trim: true, default: "" },
    description:   { type: String, trim: true, default: "" },
    city:          { type: String, trim: true, default: "" },

    // ✅ All bookings for this slot (supports multiple seats)
    bookings: [
      {
        studentName:   { type: String, trim: true },
        studentEmail:  { type: String, trim: true, lowercase: true },
        studentMobile: { type: String, trim: true },
        course:        { type: String, trim: true },
        branch:        { type: String, trim: true },
        description:   { type: String, trim: true, default: "" },
        city:          { type: String, trim: true, default: "" },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        bookedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Unique slot per date+time (one document per time block)
slotSchema.index({ date: 1, time: 1 }, { unique: true });

export default mongoose.model("Slot", slotSchema);
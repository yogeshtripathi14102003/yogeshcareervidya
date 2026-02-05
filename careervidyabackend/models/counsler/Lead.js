// import mongoose from "mongoose";

// const LeadSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     phone: { type: String, required: true },
//     email: { type: String },
//     course: { type: String },
//     city: { type: String },          // NEW FIELD
//     remark: { type: String },        // NEW FIELD
//     action: { type: String },        // NEW FIELD
//     status: {
//       type: String,
//       enum: ["new", "picked", "not-picked", "admission", "closed"],
//       default: "new",
//     },
//     assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Counselor" },
//     followUpDate: { type: Date },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Lead", LeadSchema);

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
    status: {
      type: String,
      enum: ["new", "picked", "not-picked", "admission", "closed"],
      default: "new",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Counselor" },
    assignedToName: { type: String }, 
    
    // ✅ NEW FIELDS FOR REMINDERS AND FOLLOW-UPS
    followUpDate: { type: Date },      // Agli follow-up date
    reminderDate: { type: String },    // Format: YYYY-MM-DD
    reminderTime: { type: String },    // Format: HH:mm (24hr)
    
    // ✅ OPTIONAL: History track karne ke liye array
    followUpHistory: [
      {
        date: { type: Date, default: Date.now },
        remark: String,
        status: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Lead", LeadSchema);
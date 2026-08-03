
import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    course: { type: String },
    city: { type: String },
    state: { type: String }, // Module 5: needed for state-wise auto-assignment
    remark: { type: String },
    action: { type: String },
    referralName: { type: String }, 
    studentName: { type: String },
    referralMobile: { type: String },
    branch: { type: String },
    universityName: { type: String },

    // ---- Module 4: Lead Analytics ----
    source: {
      type: String,
      enum: ["Website Inquiry", "Website Registration", "Manual Upload", "Imported Lead", "Referral", "Campaign", "Other"],
      default: "Manual Upload",
    },
    assignedAt: { type: Date }, // when assignedTo was last set
    firstResponseAt: { type: Date }, // first counselor action after creation
    lastFollowUpAt: { type: Date }, // denormalized from followUpHistory, for fast sorting/queries
    lostReason: { type: String }, // captured when status moves to a "lost" bucket
    leadScore: { type: Number, default: 0 }, // populated by Module 11's scoring engine
    resolvedAt: { type: Date }, // Module 9: when this lead first reached a terminal status
    lastVisitedAt: { type: Date }, // Module 7: last time this lead was seen browsing the site
    firedAutomationSteps: { type: [String], default: [] }, // Module 8: which escalation steps already fired since the last follow-up

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
LeadSchema.index({ state: 1 });      // Module 5: state-wise assignment lookups
LeadSchema.index({ city: 1 });       // Module 5: city-wise assignment lookups

export default mongoose.model("Lead", LeadSchema);
import mongoose from "mongoose";

const mappingEntrySchema = new mongoose.Schema(
  {
    value: { type: String, required: true }, // e.g. a state name, city name, course name, university name
    counselors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Counselor" }],
  },
  { _id: false }
);

const assignmentConfigSchema = new mongoose.Schema(
  {
    // Only one of these is "active" at a time — keeps the mental model
    // simple for an admin instead of trying to blend multiple strategies.
    activeStrategy: {
      type: String,
      enum: [
        "round_robin",
        "state_wise",
        "city_wise",
        "course_wise",
        "university_wise",
        "workload_based",
        "priority_based",
      ],
      default: "round_robin",
    },

    // Whether newly created leads (manual or bulk-upload) get auto-assigned
    // immediately if they don't already specify a counselor.
    autoAssignOnCreate: { type: Boolean, default: true },

    // Tie-breaker within whatever pool the strategy narrows down to —
    // prefer whoever currently has the fewest open leads.
    considerWorkload: { type: Boolean, default: true },

    // If a rule-based strategy finds no matching mapping for a lead,
    // fall back to round-robin among all active counselors instead of
    // leaving the lead unassigned.
    fallbackToRoundRobin: { type: Boolean, default: true },

    stateMap: [mappingEntrySchema],
    cityMap: [mappingEntrySchema],
    courseMap: [mappingEntrySchema],
    universityMap: [mappingEntrySchema],

    // Priority-based: which counselor pool handles which lead tier.
    // Tiers come from Module 11's real scoring engine (see constant/leadScoring.js).
    priorityMap: {
      priority: [{ type: mongoose.Schema.Types.ObjectId, ref: "Counselor" }],
      hot: [{ type: mongoose.Schema.Types.ObjectId, ref: "Counselor" }],
      warm: [{ type: mongoose.Schema.Types.ObjectId, ref: "Counselor" }],
      cold: [{ type: mongoose.Schema.Types.ObjectId, ref: "Counselor" }],
    },
  },
  { timestamps: true }
);

export default mongoose.model("AssignmentConfig", assignmentConfigSchema);

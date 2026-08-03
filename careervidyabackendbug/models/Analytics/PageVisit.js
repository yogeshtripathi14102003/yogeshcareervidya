import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "download",
        "apply_click",
        "register_click",
        "login_click",
        "brochure_download",
        "custom",
      ],
      required: true,
    },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const pageVisitSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    visitorId: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor" },

    page: { type: String, required: true }, // path, e.g. "/course/mba-in-finance"

    enterTime: { type: Date, default: Date.now },
    exitTime: Date,
    timeSpent: { type: Number, default: 0 }, // seconds

    scrollPercentage: { type: Number, default: 0, min: 0, max: 100 }, // max depth reached
    clickCount: { type: Number, default: 0 },

    events: [eventSchema],
  },
  { timestamps: true }
);

pageVisitSchema.index({ sessionId: 1, page: 1, enterTime: -1 });
pageVisitSchema.index({ createdAt: -1 });

export default mongoose.model("PageVisit", pageVisitSchema);

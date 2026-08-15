import mongoose from "mongoose";

const counselorSessionSchema = new mongoose.Schema(
  {
    counselor: { type: mongoose.Schema.Types.ObjectId, ref: "Counselor", required: true, index: true },
    loginAt: { type: Date, default: Date.now },
    logoutAt: { type: Date },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

counselorSessionSchema.index({ counselor: 1, loginAt: -1 });

export default mongoose.model("CounselorSession", counselorSessionSchema);

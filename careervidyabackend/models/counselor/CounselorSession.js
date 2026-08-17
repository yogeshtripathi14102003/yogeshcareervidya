import mongoose from "mongoose";

const counselorSessionSchema = new mongoose.Schema(
  {
    // ✅ FIX: "index: true" yahan se hata diya gaya hai
    counselor: { type: mongoose.Schema.Types.ObjectId, ref: "Counselor", required: true },
    loginAt: { type: Date, default: Date.now },
    logoutAt: { type: Date },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ye compound index "counselor" field ko automatically cover kar leta hai:
counselorSessionSchema.index({ counselor: 1, loginAt: -1 });

export default mongoose.model("CounselorSession", counselorSessionSchema);
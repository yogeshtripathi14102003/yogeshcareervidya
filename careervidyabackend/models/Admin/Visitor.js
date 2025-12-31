import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    ip: String,
    userAgent: String,
    browser: String,
    device: String,
    os: String,
    referrer: String,
    page: String,
    isReturning: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("Visitor", visitorSchema);

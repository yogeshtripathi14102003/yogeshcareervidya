// import mongoose from "mongoose";

// const verificationSchema = new mongoose.Schema(
//   {
//     emailOrPhone: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     countryCode: {
//       type: String,
//     },
//     codeHash: {
//       type: String,
//       required: true,
//     },
//     method: {
//       type: String,
//       enum: ["email", "phone"],
//       required: true,
//     },
//     purpose: {
//       type: String,
//       enum: ["register","login"],
//       required: true,
//     },
//     expiresAt: {
//       type: Date,
//       required: true,
//       index: { expireAfterSeconds: 0 },
//     },
//     verified: {
//       type: Boolean,
//       default: false,
//     },
//     attempts: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// verificationSchema.index({ emailOrPhone: 1, purpose: 1 });

// const VerificationModel =
//   mongoose.models.Verification ||
//   mongoose.model("Verification", verificationSchema);

// export default VerificationModel;

import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    emailOrPhone: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
    },
    codeHash: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      enum: ["email", "phone"],
      required: true,
    },
    purpose: {
      type: String,
      enum: ["register", "login"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound unique index — prevents duplicate OTP records for same user+purpose
verificationSchema.index({ emailOrPhone: 1, purpose: 1 }, { unique: true });

// TTL index — MongoDB automatically deletes expired OTP documents
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const VerificationModel =
  mongoose.models.Verification ||
  mongoose.model("Verification", verificationSchema);

export default VerificationModel;
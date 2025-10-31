import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
  {
    universityId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    universityName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    aicteApproved: {
      type: Boolean,
      default: false,
    },
    nirfRanking: {
      type: String,
      trim: true,
    },
    naacAccreditation: {
      type: String,
      trim: true,
    },
    wes: {
      type: Boolean,
      default: false,
    },
    bci: {
      type: Boolean,
      default: false,
    },
    pci: {
      type: Boolean,
      default: false,
    },
    ncte: {
      type: Boolean,
      default: false,
    },
    paramedicalBoard: {
      type: Boolean,
      default: false,
    },
    deb: {
      type: Boolean,
      default: false,
    },
    indianNursingCouncil: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const University = mongoose.model("University", universitySchema);
export default University;

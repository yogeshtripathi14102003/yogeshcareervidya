

import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    expertise: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    fee: {
      type: Number,
      min: 0,
      default: 0,
    },

    education: {
      type: String,
      trim: true,
      default: "Not Specified",
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    // ✅ BULLET POINTS
    highlights: {
      type: [String],
      default: [],
    },

    // ✅ MULTIPLE LANGUAGES
    languages: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);
export default Team;

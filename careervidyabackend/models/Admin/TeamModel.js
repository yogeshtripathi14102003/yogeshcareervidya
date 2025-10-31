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
      // required: true,
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
      type: String, // store the image URL or file path
      required: false,
      default: "",  // optional default value
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;

import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "University name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    universityImage: {
      type: String, // Image URL or path
      trim: true,
    },
    courses: [
      {
        name: {
          type: String,
          required: [true, "Course name is required"],
          trim: true,
        },
        logo: {
          type: String, // logo image URL or path
          trim: true,
        },
        duration: {
          type: String, // e.g. "2 Years"
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const University =
  mongoose.models.University || mongoose.model("University", universitySchema);

export default University;

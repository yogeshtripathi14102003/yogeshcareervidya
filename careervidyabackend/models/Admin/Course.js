


import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Course duration is required"],
    },
    tag: {
      type: String,
      trim: true,
    },
    specialization: {
      type: [String],
      default: [],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    courseLogo: {
      public_id: { type: String },
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/demo/image/upload/v1699999999/placeholder_course.png",
      },
    },

    overview: [
      {
        heading: { type: String, required: true },
        description: { type: String, required: true },
        image: {
          public_id: { type: String },
          url: { type: String },
        },
        videoLink: { type: String },
      },
    ],

    whyChooseUs: [
      {
        image: {
          public_id: { type: String },
          url: { type: String },
        },
        description: { type: String, required: true },
      },
    ],

    goodThings: {
      type: [String],
      default: [],
    },

    topUniversities: [
      {
        name: { type: String, required: true },
        description: { type: String },
      },
    ],

    keyHighlights: [
      {
        heading: { type: String, required: true },
        subHeading: { type: String },
        description: { type: String },
      },
    ],

    syllabus: [
      {
        semester: { type: String, required: true },
        subjects: { type: [String], default: [] },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ✅ Auto-generate slug if not provided
courseSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);
export default Course;

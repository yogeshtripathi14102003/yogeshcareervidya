// import mongoose from "mongoose";

// const courseSchema = new mongoose.Schema(
//   {
//     category: {
//       type: String,
//       enum: ["UG", "PG","Doctorate","JobGuarantee","StudyAbroad","AdvancedDiploma",],
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     duration: {
//       type: String,
//       required: true,
//     },
//     tag: {
//       type: String,
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

// const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

// export default Course;



import mongoose from "mongoose";

// 🔹 Define schema
const courseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "UG",
        "PG",
        "Doctorate",
        "JobGuarantee",
        "StudyAbroad",
        "AdvancedDiploma",
      ],
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// 🔹 Pre-save middleware to normalize category input
courseSchema.pre("save", function (next) {
  if (this.category) {
    // Capitalize first letter and lowercase the rest
    const formatted =
      this.category.charAt(0).toUpperCase() + this.category.slice(1).toLowerCase();

    // Special handling for multiword categories (e.g., JobGuarantee)
    const validCategories = [
      "UG",
      "PG",
      "Doctorate",
      "JobGuarantee",
      "StudyAbroad",
      "AdvancedDiploma",
    ];

    // Only assign if formatted version is valid
    if (validCategories.includes(formatted)) {
      this.category = formatted;
    }
  }
  next();
});

// 🔹 Create or reuse model (important for hot reload in dev)
const Course =
  mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;


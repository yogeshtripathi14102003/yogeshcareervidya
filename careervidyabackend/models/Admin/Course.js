



// import mongoose from "mongoose";
// import slugify from "slugify";

// const courseSchema = new mongoose.Schema(
//   {
//     category: {
//       type: String,
//       enum: [
//         "UG",
//         "PG",
//         "Doctorate",
//         "JobGuarantee",
//         "StudyAbroad",
//         "AdvancedDiploma",
//       ],
//       required: true,
//       trim: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     duration: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     tag: {
//       type: String,
//       trim: true,
//     },

//     // ✅ Multiple Specializations
//     specialization: {
//       type: [String],
//       default: [],
//     },

//     // ✅ Cloudinary Image
//     courseLogo: {
//       public_id: { type: String },
//       url: { type: String },
//     },

//     slug: {
//       type: String,
//       unique: true,
//       index: true,
//     },
//   },
//   { timestamps: true }
// );

// // 🔹 Auto-generate slug from course name before saving
// courseSchema.pre("save", function (next) {
//   if (this.name && !this.slug) {
//     this.slug = slugify(this.name, { lower: true, strict: true });
//   }
//   next();
// });

// // 🔹 Normalize category input
// courseSchema.pre("save", function (next) {
//   if (this.category) {
//     const formatted =
//       this.category.charAt(0).toUpperCase() + this.category.slice(1).toLowerCase();

//     const validCategories = [
//       "UG",
//       "PG",
//       "Doctorate",
//       "JobGuarantee",
//       "StudyAbroad",
//       "AdvancedDiploma",
//     ];

//     if (validCategories.includes(formatted)) {
//       this.category = formatted;
//     }
//   }
//   next();
// });

// const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
// export default Course;




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

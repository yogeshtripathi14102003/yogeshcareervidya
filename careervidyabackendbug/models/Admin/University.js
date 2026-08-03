

// import mongoose from "mongoose";
// import slugify from "slugify";

// // --- Sub-Schemas ---

// const ApprovalSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   logo: { type: String, default: null },
// });

// const CourseSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   duration: { type: String, default: "N/A" },
//   logo: { type: String, default: null },
// });

// // --- Main Schema ---

// const UniversitySchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },

//     slug: { type: String, unique: true },

//     universityImage: { type: String, default: null },

//     description: { type: String, default: "" },
//     youtubeLink: { type: String, default: "" },
//     shareDescription: { type: String, default: "" },
//     cardDescription: { type: String, default: "" },

//     /* ========= NEW BACKGROUND SECTION ========= */
//     background: {
//       backgroundImage: { type: String, default: null },
//       backgroundDescription: { type: String, default: "" },
//     },

//     highlights: {
//       heading: { type: String, default: "" },
//       points: { type: [String], default: [] },
//     },

//     facts: {
//       factsHeading: { type: String, default: "" },
//       factsSubHeading: { type: String, default: "" },
//       factsPoints: { type: [String], default: [] },
//     },

//     approvals: { type: [ApprovalSchema], default: [] },

//     recognition: {
//       recognitionHeading: { type: String, default: "Recognition" },
//       recognitionDescription: { type: String, default: "" },
//       recognitionPoints: { type: [String], default: [] },
//       certificateImage: { type: String, default: null },
//     },

//     admission: {
//       admissionHeading: { type: String, default: "Admission Process" },
//       admissionSubHeading: { type: String, default: "" },
//       admissionDescription: { type: String, default: "" },
//       admissionPoints: { type: [String], default: [] },
//     },

//     courses: { type: [CourseSchema], default: [] },
//   },
//   { timestamps: true }
// );

// // --- Slug Generation ---
// UniversitySchema.pre("save", function (next) {
//   if (this.isModified("name") || !this.slug) {
//     this.slug = slugify(this.name, { lower: true, strict: true });
//   }
//   next();
// });

// // --- Model ---
// const University = mongoose.model("University", UniversitySchema);
// export default University;



import mongoose from "mongoose";
import slugify from "slugify";

// --- Sub-Schemas ---

const ApprovalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, default: null },
});



// --- Updated Course Sub-Schema (University ke liye) ---
const CourseSchema = new mongoose.Schema({
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course" 
  }, // Base Course ki ID
  name: { type: String, required: true },
  courseSlug: { type: String, default: "" },    // Fetch hoke yahan save hoga
  logo: { type: String, default: null },     // Fetch hoke yahan save hoga
  duration: { type: String, default: "N/A" },// Fetch hoke yahan save hoga
  fees: { type: String, default: "" },       // Aap manual enter karenge
  details: { type: String, default: "" },    // Aap manual enter karenge
});
// --- Main Schema ---

const UniversitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    universityImage: { type: String, default: null },
    description: { type: String, default: "" },
    youtubeLink: { type: String, default: "" },
    shareDescription: { type: String, default: "" },
    cardDescription: { type: String, default: "" },

    /* ========= NEW BACKGROUND SECTION ========= */
    background: {
      backgroundImage: { type: String, default: null },
      backgroundDescription: { type: String, default: "" },
    },

    highlights: {
      heading: { type: String, default: "" },
      points: { type: [String], default: [] },
    },

    facts: {
      factsHeading: { type: String, default: "" },
      factsSubHeading: { type: String, default: "" },
      factsPoints: { type: [String], default: [] },
    },

    approvals: { type: [ApprovalSchema], default: [] },

    recognition: {
      recognitionHeading: { type: String, default: "Recognition" },
      recognitionDescription: { type: String, default: "" },
      recognitionPoints: { type: [String], default: [] },
      certificateImage: { type: String, default: null },
    },

    admission: {
      admissionHeading: { type: String, default: "Admission Process" },
      admissionSubHeading: { type: String, default: "" },
      admissionDescription: { type: String, default: "" },
      admissionPoints: { type: [String], default: [] },
    },

    courses: { type: [CourseSchema], default: [] },
  },
  { timestamps: true }
);

// --- Slug Generation ---
UniversitySchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// --- Model ---
const University = mongoose.model("University", UniversitySchema);
export default University;

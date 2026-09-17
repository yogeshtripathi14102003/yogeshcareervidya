

// import mongoose from "mongoose";
// import slugify from "slugify";

// // --- Sub-Schemas ---

// const ApprovalSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   logo: { type: String, default: null },
// });



// // --- Updated Course Sub-Schema (University ke liye) ---
// const CourseSchema = new mongoose.Schema({
//   courseId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "Course" 
//   }, // Base Course ki ID
//   name: { type: String, required: true },
//   courseSlug: { type: String, default: "" },    // Fetch hoke yahan save hoga
//   logo: { type: String, default: null },     // Fetch hoke yahan save hoga
//   duration: { type: String, default: "N/A" },// Fetch hoke yahan save hoga
//   fees: { type: String, default: "" },       // Aap manual enter karenge
//   details: { type: String, default: "" },    // Aap manual enter karenge
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

// --- FAQ Sub-Schema ---
const FaqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

// --- Updated Course Sub-Schema (University ke liye) ---
const CourseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  name: { type: String, required: true },
  courseSlug: { type: String, default: "" },
  logo: { type: String, default: null },
  duration: { type: String, default: "N/A" },
  fees: { type: String, default: "" },
  details: { type: String, default: "" },
});

// =====================================================
// ✅ NEW: Career Vidya Benefits Sub-Schema
// =====================================================
const CareerVidyaBenefitSchema = new mongoose.Schema({
  title: { type: String, default: "" },        // e.g. "Placement Support"
  description: { type: String, default: "" },  // e.g. "3000+ companies..."
  icon: { type: String, default: null },       // optional icon/image
});

// =====================================================
// ✅ NEW: Eligibility Sub-Schema
// =====================================================
const EligibilitySchema = new mongoose.Schema({
  heading: { type: String, default: "Eligibility Criteria" },
  subHeading: { type: String, default: "" },
  description: { type: String, default: "" },
  // Har course ki alag eligibility ho sakti hai
  criteria: [
    {
      courseName: { type: String, default: "" }, // e.g. "MBA"
      requirement: { type: String, default: "" }, // e.g. "Bachelor's degree with 50%"
    },
  ],
  points: { type: [String], default: [] }, // extra bullet points
});

// =====================================================
// ✅ NEW: Examination Pattern Sub-Schema
// =====================================================
const ExamPatternSchema = new mongoose.Schema({
  heading: { type: String, default: "Examination Pattern" },
  subHeading: { type: String, default: "" },
  description: { type: String, default: "" },
  mode: { type: String, default: "" },           // e.g. "Online Proctored"
  duration: { type: String, default: "" },       // e.g. "2 Hours"
  totalMarks: { type: String, default: "" },     // e.g. "100 Marks"
  passingMarks: { type: String, default: "" },   // e.g. "40 Marks"
  questionTypes: { type: [String], default: [] },// e.g. ["MCQ", "Descriptive"]
  points: { type: [String], default: [] },       // additional info
});

// =====================================================
// ✅ NEW: LMS (Learning Management System) Sub-Schema
// =====================================================
const LmsSchema = new mongoose.Schema({
  heading: { type: String, default: "Learning Management System (LMS)" },
  subHeading: { type: String, default: "" },
  description: { type: String, default: "" },
  features: { type: [String], default: [] }, // e.g. ["Live Classes", "Recorded Lectures", "E-Books"]
  image: { type: String, default: null },    // LMS dashboard screenshot
});

// =====================================================
// ✅ NEW: EMI Options Sub-Schema
// =====================================================
const EmiOptionSchema = new mongoose.Schema({
  heading: { type: String, default: "EMI & Education Loan Support" },
  subHeading: { type: String, default: "" },
  description: { type: String, default: "" },
  lendersCount: { type: String, default: "" },    // e.g. "20+ Lenders"
  approvalTime: { type: String, default: "" },    // e.g. "Sanctioned in less than 24 hours"
  noBankVisit: { type: Boolean, default: true },  // "No Bank Visit" badge
  emiStartingFrom: { type: String, default: "" }, // e.g. "₹5,000/month"
  points: { type: [String], default: [] },        // extra bullet points
  partners: { type: [String], default: [] },      // e.g. ["HDFC", "ICICI", "Axis"]
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

    /* ========= BACKGROUND SECTION ========= */
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

    /* ========= FAQ SECTION ========= */
    faqs: { type: [FaqSchema], default: [] },

    /* ========= ✅ NEW SECTIONS ========= */

    // 1. Career Vidya Benefits
    careerVidyaBenefits: {
      heading: { type: String, default: "Career Vidya Benefits" },
      subHeading: { type: String, default: "" },
      description: { type: String, default: "" },
      benefits: { type: [CareerVidyaBenefitSchema], default: [] },
    },

    // 2. Eligibility
    eligibility: { type: EligibilitySchema, default: () => ({}) },

    // 3. Examination Pattern
    examPattern: { type: ExamPatternSchema, default: () => ({}) },

    // 4. LMS
    lms: { type: LmsSchema, default: () => ({}) },

    // 5. EMI Options
    emiOptions: { type: EmiOptionSchema, default: () => ({}) },

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
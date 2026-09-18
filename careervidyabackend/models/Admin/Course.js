

// import mongoose from "mongoose";

// const courseSchema = new mongoose.Schema(
//   {
//     name: { type: String, trim: true },
//     category: { type: String, trim: true, index: true }, // Index for fast category filtering
//     duration: { type: String },
//     tag: { type: String, trim: true },
//     specializations: { type: [String], default: [] },
    
//     // Unique index for slug (Isse getCourseBySlug super fast ho jayega)
//     slug: { type: String, unique: true, lowercase: true, trim: true, index: true },

//     courseLogo: {
//       public_id: { type: String },
//       url: {
//         type: String,
//         default: "https://res.cloudinary.com/demo/image/upload/v1699999999/placeholder_course.png",
//       },
//     },

//     overview: [
//       {
//         heading: { type: String },
//         description: { type: String },
//         image: {
//           public_id: { type: String },
//           url: { type: String },
//         },
//         videoLink: { type: String },
//       },
//     ],

//     whyChooseUs: [
//       {
//         image: {
//           public_id: { type: String },
//           url: { type: String },
//         },
//         description: { type: String },
//       },
//     ],

//     goodThings: { type: [String], default: [] },

//     topUniversities: [
//       {
//         name: { type: String },
//         description: { type: String },
//       },
//     ],

//     keyHighlights: [
//       {
//         heading: { type: String },
//         subHeading: { type: String },
//         description: { type: String },
//       },
//     ],

//     syllabus: [
//       {
//         semester: { type: String },
//         subjects: { type: [String], default: [] },
//       },
//     ],

//     syllabusPdf: {
//       public_id: { type: String },
//       url: { type: String },
//     },

//     offeredCourses: [
//       {
//         heading: { type: String },
//         points: { type: [String], default: [] },
//       },
//     ],

//     onlineEligibility: [
//       {
//         heading: { type: String },
//         description: { type: String },
//         subHeading: { type: String },
//         subDescription: { type: String },
//       },
//     ],

//     feeStructureSidebar: [
//       {
//         heading: { type: String },
//         points: { type: [String], default: [] },
//       },
//     ],

//     detailedFees: [
//       {
//         heading: { type: String },
//         description: { type: String },
//         table: [
//           {
//             universityName: { type: String },
//             courseFees: { type: String },
//             detailedFeeStructure: { type: String },
//           },
//         ],
//       },
//     ],

//     onlineCourseWorthIt: {
//       description: { type: String },
//       topics: [
//         {
//           subHeading: { type: String },
//           description: { type: String },
//         },
//       ],
//       image: {
//         public_id: { type: String },
//         url: { type: String },
//       },
//     },

//     jobOpportunities: [
//       {
//         heading: { type: String },
//         description: { type: String },
//         jobPost: { type: String },
//         salary: { type: String },
//       },
//     ],

//     topRecruiters: [
//       {
//         companyName: { type: String },
//         packageOffered: { type: String },
//       },
//     ],

//     universities: [
//       {
//         universityId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "University",
//           required: false,
//         },
//         name: { type: String },
//         universitySlug: {
//           type: String,
//           lowercase: true,
//           trim: true,
//           index: true, // Index for searching courses by university
//         },
//         approvals: [
//           {
//             name: { type: String },
//             logo: { type: String, default: null },
//           },
//         ],
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // --- Optimization: Compound Index for Listing Page ---
// // Jab aap category filter aur sort (createdAt) ek saath karte hain
// courseSchema.index({ category: 1, createdAt: -1 });

// // --- Auto-generate course slug ---
// courseSchema.pre("save", function (next) {
//   if (!this.slug && this.name) {
//     this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
//   }
//   next();
// });

// const Course = mongoose.model("Course", courseSchema);
// export default Course;

import mongoose from "mongoose";

// =====================================================
// SUB-SCHEMAS (Chhote-chhote structures)
// =====================================================

// Image (Cloudinary)
const ImageSchema = new mongoose.Schema(
  {
    public_id: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  { _id: false }
);

// FAQ
const FaqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false }
);

// Admission Process Step
const AdmissionStepSchema = new mongoose.Schema(
  {
    step: { type: Number },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

// Testimonial
const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    course: { type: String, trim: true },
    university: { type: String, trim: true },
    review: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    image: { type: ImageSchema, default: () => ({}) },
    year: { type: String, trim: true },
  },
  { _id: false }
);

// =====================================================
// UNIVERSITY SNAPSHOT SCHEMA
// (Course ke andar ek university ka data)
// =====================================================
const CourseUniversitySchema = new mongoose.Schema(
  {
    // --- Reference to University DB ---
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },

    // --- Auto-fetched from University DB ---
    name: { type: String, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    universityImage: { type: String, default: null },
    cardDescription: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    approvals: [
      {
        name: { type: String },
        logo: { type: String, default: null },
      },
    ],

    // --- Course-specific (Admin manually bharega) ---
    courseFees: {
      total: { type: String, default: "" },         // "₹1,50,000"
      perSemester: { type: String, default: "" },   // "₹25,000"
      registration: { type: String, default: "" },  // "₹1,000"
      emiStartsFrom: { type: String, default: "" }, // "₹6,250/month"
    },
    duration: { type: String, default: "" },
    specializations: { type: [String], default: [] },
    mode: { type: String, default: "Online" },
    eligibility: { type: String, default: "" },
    applyLink: { type: String, default: "" },
    brochureLink: { type: String, default: "" },

    // --- Display control ---
    displayOrder: { type: Number, default: 0 },
    isTopRated: { type: Boolean, default: false },
    badgeText: { type: String, default: "" },
  },
  { _id: true }
);

// =====================================================
// MAIN COURSE SCHEMA
// =====================================================
const CourseSchema = new mongoose.Schema(
  {
    // ---------- BASIC INFO ----------
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true, index: true },
    duration: { type: String, trim: true },
    tag: { type: String, trim: true },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    courseLogo: { type: ImageSchema, default: () => ({}) },

    // ---------- OVERVIEW ----------
    overview: [
      {
        heading: { type: String, trim: true },
        description: { type: String, trim: true },
        image: { type: ImageSchema, default: () => ({}) },
        videoLink: { type: String, default: "" },
      },
    ],

    // ---------- WHY CHOOSE US ----------
    whyChooseUs: [
      {
        image: { type: ImageSchema, default: () => ({}) },
        description: { type: String, trim: true },
      },
    ],

    // ---------- GOOD THINGS ----------
    goodThings: { type: [String], default: [] },

    // ---------- KEY HIGHLIGHTS ----------
    keyHighlights: [
      {
        heading: { type: String, trim: true },
        subHeading: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],

    // ---------- SYLLABUS ----------
    syllabus: [
      {
        semester: { type: String, trim: true },
        subjects: { type: [String], default: [] },
      },
    ],
    syllabusPdf: { type: ImageSchema, default: () => ({}) },

    // ---------- OFFERED COURSES ----------
    offeredCourses: [
      {
        heading: { type: String, trim: true },
        points: { type: [String], default: [] },
      },
    ],

    // ---------- SPECIALIZATIONS ----------
    specializations: { type: [String], default: [] },
    specializationDetails: [
      {
        name: { type: String, trim: true },
        description: { type: String, trim: true },
        careerRoles: [
          {
            role: { type: String, trim: true },
            salary: { type: String, trim: true },
          },
        ],
      },
    ],

    // ---------- ELIGIBILITY ----------
    onlineEligibility: [
      {
        heading: { type: String, trim: true },
        description: { type: String, trim: true },
        subHeading: { type: String, trim: true },
        subDescription: { type: String, trim: true },
      },
    ],

    // ---------- ADMISSION PROCESS ----------
    admissionProcess: { type: [AdmissionStepSchema], default: [] },

    // ---------- FEE STRUCTURE ----------
    feeStructureSidebar: [
      {
        heading: { type: String, trim: true },
        points: { type: [String], default: [] },
      },
    ],
    detailedFees: [
      {
        heading: { type: String, trim: true },
        description: { type: String, trim: true },
        table: [
          {
            universityName: { type: String, trim: true },
            courseFees: { type: String, trim: true },
            detailedFeeStructure: { type: String, trim: true },
          },
        ],
      },
    ],

    // ---------- EMI / SCHOLARSHIP ----------
    emiOptions: {
      enabled: { type: Boolean, default: false },
      minMonthly: { type: String, default: "" },
      maxMonthly: { type: String, default: "" },
      tenureMonths: { type: [Number], default: [] },
    },
    scholarships: [
      {
        title: { type: String, trim: true },
        discount: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],

    // ---------- COURSE WORTH IT ----------
    onlineCourseWorthIt: {
      description: { type: String, trim: true },
      topics: [
        {
          subHeading: { type: String, trim: true },
          description: { type: String, trim: true },
        },
      ],
      image: { type: ImageSchema, default: () => ({}) },
    },

    // ---------- JOB OPPORTUNITIES ----------
    jobOpportunities: [
      {
        heading: { type: String, trim: true },
        description: { type: String, trim: true },
        jobPost: { type: String, trim: true },
        salary: { type: String, trim: true },
      },
    ],

    // ---------- TOP RECRUITERS ----------
    topRecruiters: [
      {
        companyName: { type: String, trim: true },
        packageOffered: { type: String, trim: true },
      },
    ],

    // ---------- PLACEMENT SUPPORT ----------
    placementSupport: {
      description: { type: String, trim: true, default: "" },
      stats: {
        placementRate: { type: String, default: "" },
        avgPackage: { type: String, default: "" },
        highestPackage: { type: String, default: "" },
      },
    },

    // ---------- CAREER VIDYA BENEFITS ----------
    Careervidyabenifit: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],

    // ---------- TESTIMONIALS ----------
    courseTestimonials: { type: [TestimonialSchema], default: [] },

    // ---------- FAQ ----------
    faqs: { type: [FaqSchema], default: [] },

    // =====================================================
    // 🎯 UNIVERSITIES (Sabse Important)
    // Yahan sirf wahi universities store hongi
    // jo admin ne is course ke liye select ki hain.
    // =====================================================
    universities: { type: [CourseUniversitySchema], default: [] },

    // ---------- STATUS ----------
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true }
);

// =====================================================
// INDEXES
// =====================================================
CourseSchema.index({ category: 1, createdAt: -1 });
CourseSchema.index({ "universities.universityId": 1 });

// =====================================================
// SLUG AUTO-GENERATE
// =====================================================
CourseSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

// =====================================================
// EXPORT
// =====================================================
const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
export default Course;
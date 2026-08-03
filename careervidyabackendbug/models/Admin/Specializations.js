import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    /* ===== BASIC INFO ===== */
    name: { type: String, trim: true, required: true },
    category: { type: String, trim: true },
    duration: { type: String },
    tag: { type: String, trim: true },

    specializations: { type: [String], default: [] },

    /* ===== SEO FRIENDLY ===== */
    slug: { type: String, unique: true, lowercase: true, trim: true },

    seo: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      keywords: { type: [String], default: [] },
      canonicalUrl: { type: String, trim: true },
    },

    /* ===== COURSE LOGO ===== */
    programLogo: {
      public_id: { type: String },
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/demo/image/upload/v1699999999/placeholder_course.png",
      },
    },

    /* ===== OVERVIEW ===== */
    overview: [
      {
        heading: { type: String },
        description: { type: String },
        image: {
          public_id: { type: String },
          url: { type: String },
        },
        videoLink: { type: String },
      },
    ],

    /* ===== WHY CHOOSE US ===== */
    whyChooseUs: [
      {
        image: {
          public_id: { type: String },
          url: { type: String },
        },
        description: { type: String },
      },
    ],

    goodThings: { type: [String], default: [] },

    /* ===== TOP UNIVERSITIES ===== */
    topUniversities: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],

    /* ===== KEY HIGHLIGHTS ===== */
    keyHighlights: [
      {
        heading: { type: String },
        subHeading: { type: String },
        description: { type: String },
      },
    ],

    /* ===== SYLLABUS ===== */
    syllabus: [
      {
        semester: { type: String },
        subjects: { type: [String], default: [] },
      },
    ],

    syllabusPdf: {
      public_id: { type: String },
      url: { type: String },
    },

    /* ===== OFFERED COURSES ===== */
    offeredCourses: [
      {
        heading: { type: String },
        points: { type: [String], default: [] },
      },
    ],

    /* ===== ELIGIBILITY ===== */
    onlineEligibility: [
      {
        heading: { type: String },
        description: { type: String },
        subHeading: { type: String },
        subDescription: { type: String },
      },
    ],

    /* ===== FEES ===== */
    feeStructureSidebar: [
      {
        heading: { type: String },
        points: { type: [String], default: [] },
      },
    ],

    detailedFees: [
      {
        heading: { type: String },
        description: { type: String },
        table: [
          {
            universityName: { type: String },
            courseFees: { type: String },
            detailedFeeStructure: { type: String },
          },
        ],
      },
    ],

    /* ===== COURSE WORTH IT ===== */
    onlineCourseWorthIt: {
      description: { type: String },
      topics: [
        {
          subHeading: { type: String },
          description: { type: String },
        },
      ],
      image: {
        public_id: { type: String },
        url: { type: String },
      },
    },

    /* ===== JOBS ===== */
    jobOpportunities: [
      {
        heading: { type: String },
        description: { type: String },
        jobPost: { type: String },
        salary: { type: String },
      },
    ],

    /* ===== TOP RECRUITERS ===== */
    topRecruiters: [
      {
        companyName: { type: String },
        packageOffered: { type: String },
      },
    ],

    /* ===== UNIVERSITIES (WITH SLUG) ===== */
    universities: [
      {
        universityId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "University",
        },
        name: { type: String },
        universitySlug: {
          type: String,
          lowercase: true,
          trim: true,
        },
        approvals: [
          {
            name: { type: String },
            logo: { type: String, default: null },
          },
        ],
      },
    ],

    /* ===== FAQ (QUESTION & ANSWER) ===== */
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

/* ===== AUTO SLUG + SEO ===== */
programSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }

  if (!this.seo?.title && this.name) {
    this.seo = this.seo || {};
    this.seo.title = `${this.name} Course | Fees, Syllabus, Admission`;
  }

  if (!this.seo?.description && this.name) {
    this.seo.description = `Complete details of ${this.name} including eligibility, syllabus, fees, admission process, and career opportunities.`;
  }

  next();
});

/* ===== MODEL EXPORT ===== */
export default mongoose.models.Program ||
  mongoose.model("Program", programSchema);

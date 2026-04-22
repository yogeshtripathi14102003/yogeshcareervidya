

import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    category: { type: String, trim: true, index: true }, // Index for fast category filtering
    duration: { type: String },
    tag: { type: String, trim: true },
    specializations: { type: [String], default: [] },
    
    // Unique index for slug (Isse getCourseBySlug super fast ho jayega)
    slug: { type: String, unique: true, lowercase: true, trim: true, index: true },

    courseLogo: {
      public_id: { type: String },
      url: {
        type: String,
        default: "https://res.cloudinary.com/demo/image/upload/v1699999999/placeholder_course.png",
      },
    },

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

    topUniversities: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],

    keyHighlights: [
      {
        heading: { type: String },
        subHeading: { type: String },
        description: { type: String },
      },
    ],

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

    offeredCourses: [
      {
        heading: { type: String },
        points: { type: [String], default: [] },
      },
    ],

    onlineEligibility: [
      {
        heading: { type: String },
        description: { type: String },
        subHeading: { type: String },
        subDescription: { type: String },
      },
    ],

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

    jobOpportunities: [
      {
        heading: { type: String },
        description: { type: String },
        jobPost: { type: String },
        salary: { type: String },
      },
    ],

    topRecruiters: [
      {
        companyName: { type: String },
        packageOffered: { type: String },
      },
    ],

    universities: [
      {
        universityId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "University",
          required: false,
        },
        name: { type: String },
        universitySlug: {
          type: String,
          lowercase: true,
          trim: true,
          index: true, // Index for searching courses by university
        },
        approvals: [
          {
            name: { type: String },
            logo: { type: String, default: null },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// --- Optimization: Compound Index for Listing Page ---
// Jab aap category filter aur sort (createdAt) ek saath karte hain
courseSchema.index({ category: 1, createdAt: -1 });

// --- Auto-generate course slug ---
courseSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
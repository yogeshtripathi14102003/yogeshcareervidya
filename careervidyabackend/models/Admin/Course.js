


// import mongoose from "mongoose";

// const courseSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Course name is required"],
//       trim: true,
//     },
//     category: {
//       type: String,
//       required: [true, "Category is required"],
//       trim: true,
//     },
//     duration: {
//       type: String,
//       required: [true, "Course duration is required"],
//     },
//     tag: {
//       type: String,
//       trim: true,
//     },
//     specialization: {
//       type: [String],
//       default: [],
//     },

//     slug: {
//       type: String,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     courseLogo: {
//       public_id: { type: String },
//       url: {
//         type: String,
//         default:
//           "https://res.cloudinary.com/demo/image/upload/v1699999999/placeholder_course.png",
//       },
//     },

//     overview: [
//       {
//         heading: { type: String, required: true },
//         description: { type: String, required: true },
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
//         description: { type: String, required: true },
//       },
//     ],

//     goodThings: {
//       type: [String],
//       default: [],
//     },

//     topUniversities: [
//       {
//         name: { type: String, required: true },
//         description: { type: String },
//       },
//     ],

//     keyHighlights: [
//       {
//         heading: { type: String, required: true },
//         subHeading: { type: String },
//         description: { type: String },
//       },
//     ],

//     syllabus: [
//       {
//         semester: { type: String, required: true },
//         subjects: { type: [String], default: [] },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// // ✅ Auto-generate slug if not provided
// courseSchema.pre("save", function (next) {
//   if (!this.slug && this.name) {
//     this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
//   }
//   next();
// });

// const Course = mongoose.model("Course", courseSchema);
// export default Course;


// import mongoose from "mongoose";

// const courseSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: [true, "Course name is required"], trim: true },
//     category: { type: String, required: [true, "Category is required"], trim: true },
//     duration: { type: String, required: [true, "Course duration is required"] },
//     tag: { type: String, trim: true },

//     // Fixed name mismatch
//     specializations: { type: [String], default: [] }, // was 'specialization'

//     slug: { type: String, unique: true, lowercase: true, trim: true },

//     courseLogo: {
//       public_id: { type: String },
//       url: {
//         type: String,
//         default: "https://res.cloudinary.com/demo/image/upload/v1699999999/placeholder_course.png",
//       },
//     },

//     overview: [
//       {
//         heading: { type: String, required: true },
//         description: { type: String, required: true },
//         image: { public_id: { type: String }, url: { type: String } },
//         videoLink: { type: String },
//       },
//     ],

//     whyChooseUs: [
//       { image: { public_id: { type: String }, url: { type: String } }, description: { type: String, required: true } },
//     ],

//     goodThings: { type: [String], default: [] },

//     topUniversities: [
//       { name: { type: String, required: true }, description: { type: String } },
//     ],

//     keyHighlights: [
//       { heading: { type: String, required: true }, subHeading: { type: String }, description: { type: String } },
//     ],

//     syllabus: [
//       { semester: { type: String, required: true }, subjects: { type: [String], default: [] } },
//     ],

//     // Added PDF upload
//     syllabusPdf: { public_id: { type: String }, url: { type: String } },

//     offeredCourses: [
//       { heading: { type: String, required: true }, points: { type: [String], default: [] } },
//     ],

//     onlineEligibility: [
//       { heading: { type: String, required: true }, description: { type: String, required: true }, subHeading: { type: String }, subDescription: { type: String } },
//     ],

//     feeStructureSidebar: [
//       { heading: { type: String, required: true }, points: { type: [String], default: [] } },
//     ],

//     detailedFees: [
//       {
//         heading: { type: String, required: true },
//         description: { type: String },
//         table: [
//           { universityName: { type: String, required: true }, courseFees: { type: String, required: true }, detailedFeeStructure: { type: String } },
//         ],
//       },
//     ],

//     onlineCourseWorthIt: {
//       description: { type: String },
//       topics: [{ subHeading: { type: String }, description: { type: String } }],
//       image: { public_id: { type: String }, url: { type: String } },
//     },

//     jobOpportunities: [
//       { heading: { type: String, required: true }, description: { type: String }, jobPost: { type: String }, salary: { type: String } },
//     ],

//       topRecruiters: [
//         { companyName: { type: String, required: true }, packageOffered: { type: String } },
//       ],
//   },
//   { timestamps: true }
// );

// // Auto-generate slug
// courseSchema.pre("save", function (next) {
//   if (!this.slug && this.name) this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
//   next();
// });

// const Course = mongoose.model("Course", courseSchema);
// export default Course;





import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        // 1. Basic Fields (Required removed)
        name: { type: String, trim: true }, // required removed
        category: { type: String, trim: true }, // required removed
        duration: { type: String }, // required removed
        tag: { type: String, trim: true },

        specializations: { type: [String], default: [] }, 

        slug: { type: String, unique: true, lowercase: true, trim: true },

        courseLogo: {
            public_id: { type: String },
            url: {
                type: String,
                default: "https://res.cloudinary.com/demo/image/upload/v1699999999/placeholder_course.png",
            },
        },

        // 2. Overview (Required removed from nested fields)
        overview: [
            {
                heading: { type: String }, // required removed
                description: { type: String }, // required removed
                image: { public_id: { type: String }, url: { type: String } },
                videoLink: { type: String },
            },
        ],

        // 3. Why Choose Us (Required removed)
        whyChooseUs: [
            { image: { public_id: { type: String }, url: { type: String } }, description: { type: String } }, // required removed
        ],

        goodThings: { type: [String], default: [] },

        // 4. Top Universities (Required removed)
        topUniversities: [
            { name: { type: String }, description: { type: String } }, // required removed
        ],

        // 5. Key Highlights (Required removed)
        keyHighlights: [
            { heading: { type: String }, subHeading: { type: String }, description: { type: String } }, // required removed
        ],

        // 6. Syllabus (Required removed)
        syllabus: [
            { semester: { type: String }, subjects: { type: [String], default: [] } }, // required removed
        ],

        syllabusPdf: { public_id: { type: String }, url: { type: String } },

        // 7. Offered Courses (Required removed)
        offeredCourses: [
            { heading: { type: String }, points: { type: [String], default: [] } }, // required removed
        ],

        // 8. Online Eligibility (Required removed)
        onlineEligibility: [
            { heading: { type: String }, description: { type: String }, subHeading: { type: String }, subDescription: { type: String } }, // required removed
        ],

        // 9. Fee Structure Sidebar (Required removed)
        feeStructureSidebar: [
            { heading: { type: String }, points: { type: [String], default: [] } }, // required removed
        ],

        // 10. Detailed Fees (Required removed)
        detailedFees: [
            {
                heading: { type: String }, // required removed
                description: { type: String },
                table: [
                    { universityName: { type: String }, courseFees: { type: String }, detailedFeeStructure: { type: String } }, // required removed
                ],
            },
        ],

        // 11. Online Course Worth It (No required fields initially, retained)
        onlineCourseWorthIt: {
            description: { type: String },
            topics: [{ subHeading: { type: String }, description: { type: String } }],
            image: { public_id: { type: String }, url: { type: String } },
        },

        // 12. Job Opportunities (Required removed)
        jobOpportunities: [
            { heading: { type: String }, description: { type: String }, jobPost: { type: String }, salary: { type: String } }, // required removed
        ],

        // 13. Top Recruiters (Required removed)
        topRecruiters: [
            { companyName: { type: String }, packageOffered: { type: String } }, // required removed
        ],
    },
    { timestamps: true }
);

// Auto-generate slug (Logic is fine, but it will rely on 'name' being present)
courseSchema.pre("save", function (next) {
    if (!this.slug && this.name) this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
    next();
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
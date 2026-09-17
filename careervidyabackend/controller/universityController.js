

// import University from '../models/Admin/University.js';
// import { v2 as cloudinary } from 'cloudinary';
// import slugify from 'slugify';
// import dotenv from 'dotenv';

// dotenv.config();

// // CLOUDINARY CONFIG
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // --- Helpers ---
// const uploadToCloudinary = async (buffer, folder) => {
//     return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//             { folder },
//             (err, result) => {
//                 if (err) return reject(err);
//                 resolve(result.secure_url);
//             }
//         );
//         stream.end(buffer);
//     });
// };

// const getFlattenedFiles = (filesObject) => {
//     if (!filesObject) return [];
//     const result = [];
//     Object.keys(filesObject).forEach((key) => {
//         filesObject[key].forEach(file => {
//             file.fieldname = key;
//             result.push(file);
//         });
//     });
//     return result;
// };

// // --- Main Data Handler ---
// const handleUniversityData = async (body, files, existingData = null) => {
//     let universityImageUrl = existingData ? existingData.universityImage : null;
//     let certificateImageUrl = existingData?.recognition?.certificateImage || null;
//     let backgroundImageUrl = existingData?.background?.backgroundImage || null;

//     const uniImage = files.find(f => f.fieldname === "universityImage");
//     if (uniImage) universityImageUrl = await uploadToCloudinary(uniImage.buffer, "university_assets/images");

//     const certImage = files.find(f => f.fieldname === "certificateImage");
//     if (certImage) certificateImageUrl = await uploadToCloudinary(certImage.buffer, "university_assets/certificates");

//     const bgImage = files.find(f => f.fieldname === "backgroundImage");
//     if (bgImage) backgroundImageUrl = await uploadToCloudinary(bgImage.buffer, "university_assets/backgrounds");

//     const approvals = JSON.parse(String(body.approvals || "[]"));
//     const coursesRaw = JSON.parse(String(body.courses || "[]"));

//     const finalApprovals = await Promise.all(
//         approvals.map(async (item, index) => {
//             const file = files.find(f => f.fieldname === `approvals[${index}][logo]`);
//             if (file) {
//                 const url = await uploadToCloudinary(file.buffer, "university_assets/logos");
//                 return { ...item, logo: url };
//             }
//             return item;
//         })
//     );

//     const finalCourses = await Promise.all(
//         coursesRaw.map(async (item, index) => {
//             let logoUrl = item.logo || null;
//             const file = files.find(f => f.fieldname === `courses[${index}][logo]`);
//             if (file) {
//                 logoUrl = await uploadToCloudinary(file.buffer, "university_assets/logos");
//             }

//             let actualId = null;
//             if (item.courseId) {
//                 actualId = typeof item.courseId === 'object' ? (item.courseId._id || item.courseId.id) : item.courseId;
//             } else if (item._id) {
//                 actualId = typeof item._id === 'object' ? (item._id._id || item._id.id) : item._id;
//             }
//             if (actualId === "null" || actualId === "undefined") actualId = null;

//             let savedCourseSlug = item.courseSlug || item.slug || "";
//             if (!savedCourseSlug && item.name) {
//                 savedCourseSlug = slugify(item.name, { lower: true, strict: true });
//             }

//             return { 
//                 courseId: actualId,
//                 courseSlug: savedCourseSlug,
//                 name: item.name || "", 
//                 duration: item.duration || "N/A",
//                 logo: logoUrl, 
//                 fees: item.fees || "",           
//                 details: item.details || ""      
//             };
//         })
//     );

//     return {
//         name: body.name,
//         description: body.description,
//         universityImage: universityImageUrl,
//         youtubeLink: body.youtubeLink,
//         shareDescription: body.shareDescription,
//         cardDescription: body.cardDescription,
//         background: {
//             backgroundImage: backgroundImageUrl,
//             backgroundDescription: body.backgroundDescription || ""
//         },
//         highlights: {
//             heading: body.heading,
//             points: JSON.parse(String(body.points || "[]"))
//         },
//         facts: {
//             factsHeading: body.factsHeading,
//             factsSubHeading: body.factsSubHeading,
//             factsPoints: JSON.parse(String(body.factsPoints || "[]"))
//         },
//         approvals: finalApprovals,
//         recognition: {
//             recognitionHeading: body.recognitionHeading,
//             recognitionDescription: body.recognitionDescription,
//             recognitionPoints: JSON.parse(String(body.recognitionPoints || "[]")),
//             certificateImage: certificateImageUrl
//         },
//         admission: {
//             admissionHeading: body.admissionHeading,
//             admissionSubHeading: body.admissionSubHeading,
//             admissionDescription: body.admissionDescription,
//             admissionPoints: JSON.parse(String(body.admissionPoints || "[]"))
//         },
//         courses: finalCourses
//     };
// };

// // --- Exported Controller Methods ---

// export const createUniversity = async (req, res) => {
//     try {
//         const files = getFlattenedFiles(req.files);
//         const data = await handleUniversityData(req.body, files);
//         const uni = await University.create(data);
//         res.status(201).json({ success: true, data: uni });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// export const updateUniversity = async (req, res) => {
//     try {
//         const existingUni = await University.findById(req.params.id);
//         if (!existingUni) return res.status(404).json({ success: false, message: "Not found" });
//         const files = getFlattenedFiles(req.files);
//         const updatedData = await handleUniversityData(req.body, files, existingUni);
//         const saved = await University.findByIdAndUpdate(req.params.id, updatedData, { new: true });
//         res.json({ success: true, data: saved });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// export const getUniversities = async (req, res) => {
//     try {
//         const unis = await University.find().sort({ createdAt: -1 });
//         res.json({ success: true, data: unis });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// // ✅ Yeh function missing tha jiski wajah se error aa rahi thi
// export const getUniversityById = async (req, res) => {
//     try {
//         const uni = await University.findById(req.params.id);
//         if (!uni) return res.status(404).json({ success: false, message: "University not found" });
//         res.json({ success: true, data: uni });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// // ✅ Yeh function bhi zaruri hai slug base fetching ke liye
// export const getUniversityBySlug = async (req, res) => {
//     try {
//         const uni = await University.findOne({ slug: req.params.slug });
//         if (!uni) return res.status(404).json({ success: false, message: "University not found" });
//         res.json({ success: true, data: uni });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// export const deleteUniversity = async (req, res) => {
//     try {
//         await University.findByIdAndDelete(req.params.id);
//         res.json({ success: true, message: "Deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };


// // seerhch functionality for universities
// export const searchUniversities = async (req, res) => {
//   try {
//     const { query } = req.query;

//     if (!query || query.trim() === "") {
//       const allUnis = await University.find().sort({ createdAt: -1 });
//       return res.json({ success: true, data: allUnis });
//     }

//     const results = await University.find({
//       $or: [
//         { name: { $regex: query, $options: "i" } },
//         { description: { $regex: query, $options: "i" } },
//         { cardDescription: { $regex: query, $options: "i" } },
//         { shareDescription: { $regex: query, $options: "i" } },

//         // ✅ COURSES
//         { "courses.name": { $regex: query, $options: "i" } },
//         { "courses.fees": { $regex: query, $options: "i" } },
//         { "courses.duration": { $regex: query, $options: "i" } },

//         // ✅ APPROVALS (IMPORTANT FIX)
//         { "approvals.name": { $regex: query, $options: "i" } },
//       ],
//     }).sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: results.length,
//       data: results,
//     });
//   } catch (error) {
//     console.error("Search Error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


// import University from '../models/Admin/University.js';
// import { v2 as cloudinary } from 'cloudinary';
// import slugify from 'slugify';
// import dotenv from 'dotenv';

// dotenv.config();

// // CLOUDINARY CONFIG
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // --- Helpers ---
// const uploadToCloudinary = async (buffer, folder) => {
//     return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//             { folder },
//             (err, result) => {
//                 if (err) return reject(err);
//                 resolve(result.secure_url);
//             }
//         );
//         stream.end(buffer);
//     });
// };

// const getFlattenedFiles = (filesObject) => {
//     if (!filesObject) return [];
//     const result = [];
//     Object.keys(filesObject).forEach((key) => {
//         filesObject[key].forEach(file => {
//             file.fieldname = key;
//             result.push(file);
//         });
//     });
//     return result;
// };

// // --- Safe JSON parser (kabhi crash nahi karega) ---
// const safeParseJSON = (value, fallback = []) => {
//     try {
//         if (value === undefined || value === null || value === "") return fallback;
//         const parsed = JSON.parse(String(value));
//         return parsed ?? fallback;
//     } catch (err) {
//         console.warn("JSON parse failed for value:", value, "→ using fallback");
//         return fallback;
//     }
// };

// // --- Main Data Handler ---
// const handleUniversityData = async (body, files, existingData = null) => {
//     let universityImageUrl = existingData ? existingData.universityImage : null;
//     let certificateImageUrl = existingData?.recognition?.certificateImage || null;
//     let backgroundImageUrl = existingData?.background?.backgroundImage || null;

//     const uniImage = files.find(f => f.fieldname === "universityImage");
//     if (uniImage) universityImageUrl = await uploadToCloudinary(uniImage.buffer, "university_assets/images");

//     const certImage = files.find(f => f.fieldname === "certificateImage");
//     if (certImage) certificateImageUrl = await uploadToCloudinary(certImage.buffer, "university_assets/certificates");

//     const bgImage = files.find(f => f.fieldname === "backgroundImage");
//     if (bgImage) backgroundImageUrl = await uploadToCloudinary(bgImage.buffer, "university_assets/backgrounds");

//     // --- Parse arrays safely ---
//     const approvals = safeParseJSON(body.approvals, []);
//     const coursesRaw = safeParseJSON(body.courses, []);
//     const faqsRaw = safeParseJSON(body.faqs, []);

//     // --- Approvals ---
//     const finalApprovals = await Promise.all(
//         approvals.map(async (item, index) => {
//             const file = files.find(f => f.fieldname === `approvals[${index}][logo]`);
//             if (file) {
//                 const url = await uploadToCloudinary(file.buffer, "university_assets/logos");
//                 return { name: item.name || "", logo: url };
//             }
//             // Existing data se logo preserve karo (update ke case me)
//             const existingLogo =
//                 existingData?.approvals?.[index]?.logo || null;
//             return { name: item.name || "", logo: existingLogo };
//         })
//     );

//     // --- Courses ---
//     const finalCourses = await Promise.all(
//         coursesRaw.map(async (item, index) => {
//             let logoUrl = item.logo || null;
//             const file = files.find(f => f.fieldname === `courses[${index}][logo]`);
//             if (file) {
//                 logoUrl = await uploadToCloudinary(file.buffer, "university_assets/logos");
//             } else if (!logoUrl && existingData?.courses?.[index]?.logo) {
//                 // Existing logo preserve karo
//                 logoUrl = existingData.courses[index].logo;
//             }

//             let actualId = null;
//             if (item.courseId) {
//                 actualId = typeof item.courseId === 'object'
//                     ? (item.courseId._id || item.courseId.id)
//                     : item.courseId;
//             } else if (item._id) {
//                 actualId = typeof item._id === 'object'
//                     ? (item._id._id || item._id.id)
//                     : item._id;
//             }
//             if (actualId === "null" || actualId === "undefined") actualId = null;

//             let savedCourseSlug = item.courseSlug || item.slug || "";
//             if (!savedCourseSlug && item.name) {
//                 savedCourseSlug = slugify(item.name, { lower: true, strict: true });
//             }

//             return {
//                 courseId: actualId,
//                 courseSlug: savedCourseSlug,
//                 name: item.name || "",
//                 duration: item.duration || "N/A",
//                 logo: logoUrl,
//                 fees: item.fees || "",
//                 details: item.details || ""
//             };
//         })
//     );

//     // --- FAQs (sirf valid questions rakho) ---
//     const finalFaqs = faqsRaw
//         .filter((f) => f && (f.question?.trim() || f.answer?.trim()))
//         .map((f) => ({
//             question: f.question?.trim() || "",
//             answer: f.answer?.trim() || ""
//         }));

//     return {
//         name: body.name,
//         description: body.description,
//         universityImage: universityImageUrl,
//         youtubeLink: body.youtubeLink,
//         shareDescription: body.shareDescription,
//         cardDescription: body.cardDescription,
//         background: {
//             backgroundImage: backgroundImageUrl,
//             backgroundDescription: body.backgroundDescription || ""
//         },
//         highlights: {
//             heading: body.heading,
//             points: safeParseJSON(body.points, [])
//         },
//         facts: {
//             factsHeading: body.factsHeading,
//             factsSubHeading: body.factsSubHeading,
//             factsPoints: safeParseJSON(body.factsPoints, [])
//         },
//         approvals: finalApprovals,
//         recognition: {
//             recognitionHeading: body.recognitionHeading,
//             recognitionDescription: body.recognitionDescription,
//             recognitionPoints: safeParseJSON(body.recognitionPoints, []),
//             certificateImage: certificateImageUrl
//         },
//         admission: {
//             admissionHeading: body.admissionHeading,
//             admissionSubHeading: body.admissionSubHeading,
//             admissionDescription: body.admissionDescription,
//             admissionPoints: safeParseJSON(body.admissionPoints, [])
//         },
//         faqs: finalFaqs,
//         courses: finalCourses
//     };
// };

// // --- Exported Controller Methods ---

// export const createUniversity = async (req, res) => {
//     try {
//         const files = getFlattenedFiles(req.files);
//         const data = await handleUniversityData(req.body, files);
//         const uni = await University.create(data);
//         res.status(201).json({ success: true, data: uni });
//     } catch (err) {
//         console.error("createUniversity error:", err);
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// export const updateUniversity = async (req, res) => {
//     try {
//         const existingUni = await University.findById(req.params.id);
//         if (!existingUni) return res.status(404).json({ success: false, message: "Not found" });
//         const files = getFlattenedFiles(req.files);
//         const updatedData = await handleUniversityData(req.body, files, existingUni);
//         const saved = await University.findByIdAndUpdate(req.params.id, updatedData, { new: true });
//         res.json({ success: true, data: saved });
//     } catch (err) {
//         console.error("updateUniversity error:", err);
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// export const getUniversities = async (req, res) => {
//     try {
//         const unis = await University.find().sort({ createdAt: -1 });
//         res.json({ success: true, data: unis });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// export const getUniversityById = async (req, res) => {
//     try {
//         const uni = await University.findById(req.params.id);
//         if (!uni) return res.status(404).json({ success: false, message: "University not found" });
//         res.json({ success: true, data: uni });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// export const getUniversityBySlug = async (req, res) => {
//     try {
//         const uni = await University.findOne({ slug: req.params.slug });
//         if (!uni) return res.status(404).json({ success: false, message: "University not found" });
//         res.json({ success: true, data: uni });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// export const deleteUniversity = async (req, res) => {
//     try {
//         await University.findByIdAndDelete(req.params.id);
//         res.json({ success: true, message: "Deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// // --- Search functionality ---
// export const searchUniversities = async (req, res) => {
//     try {
//         const { query } = req.query;

//         if (!query || query.trim() === "") {
//             const allUnis = await University.find().sort({ createdAt: -1 });
//             return res.json({ success: true, data: allUnis });
//         }

//         const results = await University.find({
//             $or: [
//                 { name: { $regex: query, $options: "i" } },
//                 { description: { $regex: query, $options: "i" } },
//                 { cardDescription: { $regex: query, $options: "i" } },
//                 { shareDescription: { $regex: query, $options: "i" } },

//                 // COURSES
//                 { "courses.name": { $regex: query, $options: "i" } },
//                 { "courses.fees": { $regex: query, $options: "i" } },
//                 { "courses.duration": { $regex: query, $options: "i" } },

//                 // APPROVALS
//                 { "approvals.name": { $regex: query, $options: "i" } },

//                 // ✅ FAQS (NEW)
//                 { "faqs.question": { $regex: query, $options: "i" } },
//                 { "faqs.answer": { $regex: query, $options: "i" } },
//             ],
//         }).sort({ createdAt: -1 });

//         res.json({
//             success: true,
//             count: results.length,
//             data: results,
//         });
//     } catch (error) {
//         console.error("Search Error:", error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

import University from '../models/Admin/University.js';
import { v2 as cloudinary } from 'cloudinary';
import slugify from 'slugify';
import dotenv from 'dotenv';

dotenv.config();

// CLOUDINARY CONFIG
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- Helpers ---
const uploadToCloudinary = async (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (err, result) => {
                if (err) return reject(err);
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};

const getFlattenedFiles = (filesObject) => {
    if (!filesObject) return [];
    const result = [];
    Object.keys(filesObject).forEach((key) => {
        filesObject[key].forEach(file => {
            file.fieldname = key;
            result.push(file);
        });
    });
    return result;
};

// --- Safe JSON parser (kabhi crash nahi karega) ---
const safeParseJSON = (value, fallback = []) => {
    try {
        if (value === undefined || value === null || value === "") return fallback;
        const parsed = JSON.parse(String(value));
        return parsed ?? fallback;
    } catch (err) {
        console.warn("JSON parse failed for value:", value, "→ using fallback");
        return fallback;
    }
};

// --- Safe Object parser (naye sections ke liye) ---
const safeParseObject = (value, fallback = {}) => {
    try {
        if (value === undefined || value === null || value === "") return fallback;
        if (typeof value === "object") return value;
        const parsed = JSON.parse(String(value));
        return parsed ?? fallback;
    } catch (err) {
        console.warn("Object parse failed for value:", value, "→ using fallback");
        return fallback;
    }
};

// --- Helper: parse array of strings safely ---
const safeStringArray = (value, fallback = []) => {
    const parsed = safeParseJSON(value, fallback);
    if (!Array.isArray(parsed)) return fallback;
    return parsed.filter((v) => typeof v === "string" && v.trim() !== "").map((v) => v.trim());
};

// --- Main Data Handler ---
const handleUniversityData = async (body, files, existingData = null) => {
    // Existing images preserve karo
    let universityImageUrl = existingData ? existingData.universityImage : null;
    let certificateImageUrl = existingData?.recognition?.certificateImage || null;
    let backgroundImageUrl = existingData?.background?.backgroundImage || null;
    let lmsImageUrl = existingData?.lms?.image || null;

    const uniImage = files.find(f => f.fieldname === "universityImage");
    if (uniImage) universityImageUrl = await uploadToCloudinary(uniImage.buffer, "university_assets/images");

    const certImage = files.find(f => f.fieldname === "certificateImage");
    if (certImage) certificateImageUrl = await uploadToCloudinary(certImage.buffer, "university_assets/certificates");

    const bgImage = files.find(f => f.fieldname === "backgroundImage");
    if (bgImage) backgroundImageUrl = await uploadToCloudinary(bgImage.buffer, "university_assets/backgrounds");

    // ✅ LMS image upload
    const lmsImage = files.find(f => f.fieldname === "lmsImage");
    if (lmsImage) lmsImageUrl = await uploadToCloudinary(lmsImage.buffer, "university_assets/lms");

    // --- Parse arrays safely ---
    const approvals = safeParseJSON(body.approvals, []);
    const coursesRaw = safeParseJSON(body.courses, []);
    const faqsRaw = safeParseJSON(body.faqs, []);

    // =====================================================
    // ✅ NEW: Career Vidya Benefits
    // =====================================================
    const careerBenefitsRaw = safeParseJSON(body.careerVidyaBenefits, []);
    const finalCareerBenefits = await Promise.all(
        careerBenefitsRaw.map(async (item, index) => {
            const file = files.find(f => f.fieldname === `careerVidyaBenefits[${index}][icon]`);
            let iconUrl = item.icon || null;

            if (file) {
                iconUrl = await uploadToCloudinary(file.buffer, "university_assets/career_benefits");
            } else if (!iconUrl && existingData?.careerVidyaBenefits?.benefits?.[index]?.icon) {
                iconUrl = existingData.careerVidyaBenefits.benefits[index].icon;
            }

            return {
                title: item.title || "",
                description: item.description || "",
                icon: iconUrl,
            };
        })
    );

    // =====================================================
    // ✅ NEW: Eligibility
    // =====================================================
    const eligibilityRaw = safeParseObject(body.eligibility, {});
    const finalEligibility = {
        heading: eligibilityRaw.heading || "Eligibility Criteria",
        subHeading: eligibilityRaw.subHeading || "",
        description: eligibilityRaw.description || "",
        criteria: Array.isArray(eligibilityRaw.criteria)
            ? eligibilityRaw.criteria
                .filter((c) => c && (c.courseName?.trim() || c.requirement?.trim()))
                .map((c) => ({
                    courseName: c.courseName?.trim() || "",
                    requirement: c.requirement?.trim() || "",
                }))
            : [],
        points: Array.isArray(eligibilityRaw.points)
            ? eligibilityRaw.points.filter((p) => typeof p === "string" && p.trim() !== "")
            : [],
    };

    // =====================================================
    // ✅ NEW: Examination Pattern
    // =====================================================
    const examPatternRaw = safeParseObject(body.examPattern, {});
    const finalExamPattern = {
        heading: examPatternRaw.heading || "Examination Pattern",
        subHeading: examPatternRaw.subHeading || "",
        description: examPatternRaw.description || "",
        mode: examPatternRaw.mode || "",
        duration: examPatternRaw.duration || "",
        totalMarks: examPatternRaw.totalMarks || "",
        passingMarks: examPatternRaw.passingMarks || "",
        questionTypes: Array.isArray(examPatternRaw.questionTypes)
            ? examPatternRaw.questionTypes.filter((q) => typeof q === "string" && q.trim() !== "")
            : [],
        points: Array.isArray(examPatternRaw.points)
            ? examPatternRaw.points.filter((p) => typeof p === "string" && p.trim() !== "")
            : [],
    };

    // =====================================================
    // ✅ NEW: LMS
    // =====================================================
    const lmsRaw = safeParseObject(body.lms, {});
    const finalLms = {
        heading: lmsRaw.heading || "Learning Management System (LMS)",
        subHeading: lmsRaw.subHeading || "",
        description: lmsRaw.description || "",
        features: Array.isArray(lmsRaw.features)
            ? lmsRaw.features.filter((f) => typeof f === "string" && f.trim() !== "")
            : [],
        image: lmsImageUrl,
    };

    // =====================================================
    // ✅ NEW: EMI Options
    // =====================================================
    const emiRaw = safeParseObject(body.emiOptions, {});
    const finalEmiOptions = {
        heading: emiRaw.heading || "EMI & Education Loan Support",
        subHeading: emiRaw.subHeading || "",
        description: emiRaw.description || "",
        lendersCount: emiRaw.lendersCount || "",
        approvalTime: emiRaw.approvalTime || "",
        noBankVisit: emiRaw.noBankVisit === true || emiRaw.noBankVisit === "true",
        emiStartingFrom: emiRaw.emiStartingFrom || "",
        points: Array.isArray(emiRaw.points)
            ? emiRaw.points.filter((p) => typeof p === "string" && p.trim() !== "")
            : [],
        partners: Array.isArray(emiRaw.partners)
            ? emiRaw.partners.filter((p) => typeof p === "string" && p.trim() !== "")
            : [],
    };

    // --- Approvals ---
    const finalApprovals = await Promise.all(
        approvals.map(async (item, index) => {
            const file = files.find(f => f.fieldname === `approvals[${index}][logo]`);
            if (file) {
                const url = await uploadToCloudinary(file.buffer, "university_assets/logos");
                return { name: item.name || "", logo: url };
            }
            const existingLogo = existingData?.approvals?.[index]?.logo || null;
            return { name: item.name || "", logo: existingLogo };
        })
    );

    // --- Courses ---
    const finalCourses = await Promise.all(
        coursesRaw.map(async (item, index) => {
            let logoUrl = item.logo || null;
            const file = files.find(f => f.fieldname === `courses[${index}][logo]`);
            if (file) {
                logoUrl = await uploadToCloudinary(file.buffer, "university_assets/logos");
            } else if (!logoUrl && existingData?.courses?.[index]?.logo) {
                logoUrl = existingData.courses[index].logo;
            }

            let actualId = null;
            if (item.courseId) {
                actualId = typeof item.courseId === 'object'
                    ? (item.courseId._id || item.courseId.id)
                    : item.courseId;
            } else if (item._id) {
                actualId = typeof item._id === 'object'
                    ? (item._id._id || item._id.id)
                    : item._id;
            }
            if (actualId === "null" || actualId === "undefined") actualId = null;

            let savedCourseSlug = item.courseSlug || item.slug || "";
            if (!savedCourseSlug && item.name) {
                savedCourseSlug = slugify(item.name, { lower: true, strict: true });
            }

            return {
                courseId: actualId,
                courseSlug: savedCourseSlug,
                name: item.name || "",
                duration: item.duration || "N/A",
                logo: logoUrl,
                fees: item.fees || "",
                details: item.details || ""
            };
        })
    );

    // --- FAQs ---
    const finalFaqs = faqsRaw
        .filter((f) => f && (f.question?.trim() || f.answer?.trim()))
        .map((f) => ({
            question: f.question?.trim() || "",
            answer: f.answer?.trim() || ""
        }));

    return {
        name: body.name,
        description: body.description,
        universityImage: universityImageUrl,
        youtubeLink: body.youtubeLink,
        shareDescription: body.shareDescription,
        cardDescription: body.cardDescription,
        background: {
            backgroundImage: backgroundImageUrl,
            backgroundDescription: body.backgroundDescription || ""
        },
        highlights: {
            heading: body.heading,
            points: safeParseJSON(body.points, [])
        },
        facts: {
            factsHeading: body.factsHeading,
            factsSubHeading: body.factsSubHeading,
            factsPoints: safeParseJSON(body.factsPoints, [])
        },
        approvals: finalApprovals,
        recognition: {
            recognitionHeading: body.recognitionHeading,
            recognitionDescription: body.recognitionDescription,
            recognitionPoints: safeParseJSON(body.recognitionPoints, []),
            certificateImage: certificateImageUrl
        },
        admission: {
            admissionHeading: body.admissionHeading,
            admissionSubHeading: body.admissionSubHeading,
            admissionDescription: body.admissionDescription,
            admissionPoints: safeParseJSON(body.admissionPoints, [])
        },
        faqs: finalFaqs,

        // ✅ NEW SECTIONS
        careerVidyaBenefits: {
            heading: body.careerVidyaHeading || "Career Vidya Benefits",
            subHeading: body.careerVidyaSubHeading || "",
            description: body.careerVidyaDescription || "",
            benefits: finalCareerBenefits,
        },
        eligibility: finalEligibility,
        examPattern: finalExamPattern,
        lms: finalLms,
        emiOptions: finalEmiOptions,

        courses: finalCourses
    };
};

// --- Exported Controller Methods ---

export const createUniversity = async (req, res) => {
    try {
        const files = getFlattenedFiles(req.files);
        const data = await handleUniversityData(req.body, files);
        const uni = await University.create(data);
        res.status(201).json({ success: true, data: uni });
    } catch (err) {
        console.error("createUniversity error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

export const updateUniversity = async (req, res) => {
    try {
        const existingUni = await University.findById(req.params.id);
        if (!existingUni) return res.status(404).json({ success: false, message: "Not found" });
        const files = getFlattenedFiles(req.files);
        const updatedData = await handleUniversityData(req.body, files, existingUni);
        const saved = await University.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.json({ success: true, data: saved });
    } catch (err) {
        console.error("updateUniversity error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getUniversities = async (req, res) => {
    try {
        const unis = await University.find().sort({ createdAt: -1 });
        res.json({ success: true, data: unis });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getUniversityById = async (req, res) => {
    try {
        const uni = await University.findById(req.params.id);
        if (!uni) return res.status(404).json({ success: false, message: "University not found" });
        res.json({ success: true, data: uni });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getUniversityBySlug = async (req, res) => {
    try {
        const uni = await University.findOne({ slug: req.params.slug });
        if (!uni) return res.status(404).json({ success: false, message: "University not found" });
        res.json({ success: true, data: uni });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const deleteUniversity = async (req, res) => {
    try {
        await University.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- Search functionality ---
export const searchUniversities = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
            const allUnis = await University.find().sort({ createdAt: -1 });
            return res.json({ success: true, data: allUnis });
        }

        const results = await University.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { cardDescription: { $regex: query, $options: "i" } },
                { shareDescription: { $regex: query, $options: "i" } },

                // COURSES
                { "courses.name": { $regex: query, $options: "i" } },
                { "courses.fees": { $regex: query, $options: "i" } },
                { "courses.duration": { $regex: query, $options: "i" } },

                // APPROVALS
                { "approvals.name": { $regex: query, $options: "i" } },

                // FAQS
                { "faqs.question": { $regex: query, $options: "i" } },
                { "faqs.answer": { $regex: query, $options: "i" } },

                // ✅ NEW SECTIONS
                { "careerVidyaBenefits.heading": { $regex: query, $options: "i" } },
                { "careerVidyaBenefits.benefits.title": { $regex: query, $options: "i" } },
                { "careerVidyaBenefits.benefits.description": { $regex: query, $options: "i" } },

                { "eligibility.heading": { $regex: query, $options: "i" } },
                { "eligibility.description": { $regex: query, $options: "i" } },
                { "eligibility.criteria.courseName": { $regex: query, $options: "i" } },
                { "eligibility.criteria.requirement": { $regex: query, $options: "i" } },

                { "examPattern.heading": { $regex: query, $options: "i" } },
                { "examPattern.mode": { $regex: query, $options: "i" } },
                { "examPattern.description": { $regex: query, $options: "i" } },

                { "lms.heading": { $regex: query, $options: "i" } },
                { "lms.description": { $regex: query, $options: "i" } },
                { "lms.features": { $regex: query, $options: "i" } },

                { "emiOptions.heading": { $regex: query, $options: "i" } },
                { "emiOptions.description": { $regex: query, $options: "i" } },
                { "emiOptions.partners": { $regex: query, $options: "i" } },
            ],
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: results.length,
            data: results,
        });
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};
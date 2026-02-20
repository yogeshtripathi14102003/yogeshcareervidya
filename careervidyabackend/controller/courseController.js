

//  // updated code  without validation 
// import Course from "../models/Admin/Course.js";
// import cloudinary from "../config/cloudinary.js";
// import slugify from "slugify";
// import mongoose from "mongoose";

// // ======================================================
// // Helper: Safely parse JSON/array/object fields (NO CHANGE)
// // ======================================================
// const parseArrayField = (data) => {
//     if (!data) return [];
//     if (Array.isArray(data)) return data;
//     if (typeof data === "object") {
//         const keys = Object.keys(data);
//         const numeric = keys.every((k) => String(Number(k)) === k);
//         if (numeric) return keys.map((k) => data[k]);
//         return [];
//     }
//     if (typeof data === "string") {
//         try {
//             const parsed = JSON.parse(data);
//             return Array.isArray(parsed) ? parsed : [];
//         } catch {
//             return [];
//         }
//     }
//     return [];
// };
// const parseUniversitiesField = (data) => {
//   const universities = parseArrayField(data);

//   return universities.map((uni) => ({
//     name: uni?.name || "",
//     approvals: parseArrayField(uni?.approvals).map((appr) => ({
//       name: appr?.name || "",
//       logo: appr?.logo || null,
//     })),
//   }));
// };

// const parseObjectField = (data) => {
//     if (!data) return {};
//     if (typeof data === "object") return data;
//     if (typeof data === "string") {
//         try {
//             return JSON.parse(data);
//         } catch {
//             return {};
//         }
//     }
//     return {};
// };

// // ======================================================
// // Helper: map uploaded images to items (Deletion Logic Included)
// // ======================================================
// const mapImagesToItems = async ({ items = [], uploaded = [], existingItems = [] }) => {
//     const result = [];
//     const maxLen = items.length; 

//     for (let i = 0; i < maxLen; i++) {
//         const baseItem = items[i] ? { ...items[i] } : {};
//         const upload = uploaded[i];
//         const existingItem = existingItems[i]; // Get existing item for comparison/deletion

//         // 1. Deletion: If a NEW image is uploaded AND an OLD image existed, delete the old one.
//         if (upload && existingItem?.image?.public_id) {
//             try {
//                 await cloudinary.uploader.destroy(existingItem.image.public_id);
//             } catch (e) {
//                 console.warn("Failed to destroy old image:", e.message);
//             }
//         }

//         // 2. Assign image data
//         if (upload) {
//             // New Upload (New image URL will be saved)
//             baseItem.image = { public_id: upload.public_id, url: upload.secure_url };
//         } 
//         else if (existingItem?.image) {
//             // Keep Old Image (Used during CREATE or if UPDATE has no new upload, but this block is safer for update)
//             baseItem.image = existingItem.image;
//         } 
//         else {
//             // No image uploaded, no image existed (Default to null)
//             baseItem.image = null;
//         }

//         result.push(baseItem);
//     }
//     return result;
// };


// // ======================================================
// // CREATE COURSE (NO CHANGES NEEDED)
// // ======================================================
// export const createCourse = async (req, res) => {
//     // ... (Your original createCourse logic) ...
//     try {
//         const {
//             name, category, duration, tag, specializations, overview, whyChooseUs, goodThings, topUniversities, keyHighlights, syllabus, offeredCourses, onlineEligibility, feeStructureSidebar, detailedFees, onlineCourseWorthIt, jobOpportunities, universities, topRecruiters,
//         } = req.body;

//         // **FIX**: Mongoose required check removed. 
//         // Only keep this line if 'name' is absolutely necessary for business logic (like slug creation).
//         if (!name)
//            return res.status(400).json({ success: false, message: "Course Name is mandatory for creation and slug generation." });
//         
//         // --- Slug ---
//         let baseSlug = slugify(name, { lower: true, strict: true });
//         let slug = baseSlug;
//         let counter = 1;
//         while (await Course.findOne({ slug })) slug = `${baseSlug}-${counter++}`;

//         // --- Course Logo ---
//         let courseLogo = null;
//         if (req.files?.courseLogo?.[0]) {
//             const up = await cloudinary.uploader.upload(req.files.courseLogo[0].path, { folder: "courses/logos" });
//             courseLogo = { public_id: up.public_id, url: up.secure_url };
//         }

//         // --- Syllabus PDF ---
//         let syllabusPdf = null;
//         if (req.files?.syllabusPdf?.[0]) {
//             const up = await cloudinary.uploader.upload(req.files.syllabusPdf[0].path, {
//                 folder: "courses/syllabus",
//                 resource_type: "raw",
//                   access_mode: "public",
//             });
//             syllabusPdf = { public_id: up.public_id, url: up.secure_url };
//         }

//         // --- Overview ---
//         let parsedOverview = parseArrayField(overview);
//         if (req.files?.overviewImages?.length > 0) {
//             const uploaded = await Promise.all(
//                 req.files.overviewImages.map((f) => cloudinary.uploader.upload(f.path, { folder: "courses/overview" }))
//             );
//             // CREATE FIX: existingItems must be empty for creation
//             parsedOverview = await mapImagesToItems({ items: parsedOverview, uploaded, existingItems: [] }); 
//         }

//         // --- Why Choose Us ---
//         let parsedWhy = parseArrayField(whyChooseUs);
//         if (req.files?.whyChooseUsImages?.length > 0) {
//             const uploaded = await Promise.all(
//                 req.files.whyChooseUsImages.map((f) => cloudinary.uploader.upload(f.path, { folder: "courses/whyChooseUs" }))
//             );
//             // CREATE FIX: existingItems must be empty for creation
//             parsedWhy = await mapImagesToItems({ items: parsedWhy, uploaded, existingItems: [] });
//         }

//         // --- Online Course Worth It ---
//         let parsedOCW = parseObjectField(onlineCourseWorthIt);
//         if (req.files?.onlineCourseWorthItImage?.[0]) {
//             const up = await cloudinary.uploader.upload(req.files.onlineCourseWorthItImage[0].path, {
//                 folder: "courses/onlineCourseWorthIt",
//             });
//             parsedOCW.image = { public_id: up.public_id, url: up.secure_url };
//         }

//         const newCourse = new Course({
//             name, slug, category, duration, tag,
//             specializations: parseArrayField(specializations),
//             overview: parsedOverview,
//             whyChooseUs: parsedWhy,
//             goodThings: parseArrayField(goodThings),
//             topUniversities: parseArrayField(topUniversities),
//             keyHighlights: parseArrayField(keyHighlights),
//             syllabus: parseArrayField(syllabus),
//             offeredCourses: parseArrayField(offeredCourses),
//             onlineEligibility: parseArrayField(onlineEligibility),
//             feeStructureSidebar: parseArrayField(feeStructureSidebar),
//             detailedFees: parseArrayField(detailedFees),
//             onlineCourseWorthIt: parsedOCW,
//             jobOpportunities: parseArrayField(jobOpportunities),
//             topRecruiters: parseArrayField(topRecruiters),
//             courseLogo,
//             syllabusPdf,
//    universities: parseUniversitiesField(universities),

//         });

//         await newCourse.save();
//         res.status(201).json({ success: true, message: "Course created successfully", course: newCourse });
//     } catch (error) {
//         console.error("Create Course Error:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// // ======================================================
// // GET ALL COURSES (NO CHANGE)
// // ======================================================
// export const getCourses = async (req, res) => {
//     // ... (Your original getCourses logic) ...
//     try {
//         const courses = await Course.find().sort({ createdAt: -1 });
//         res.status(200).json({ success: true, count: courses.length, courses });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ======================================================
// // GET COURSE BY SLUG (NO CHANGE)
// // ======================================================
// export const getCourseBySlug = async (req, res) => {
//     // ... (Your original getCourseBySlug logic) ...
//     try {
//         const course = await Course.findOne({ slug: req.params.slug });
//         if (!course) return res.status(404).json({ success: false, message: "Course not found" });
//         res.status(200).json({ success: true, course });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ======================================================
// // GET COURSE BY ID (NO CHANGE)
// // ======================================================
// export const getCourseById = async (req, res) => {
//     // ... (Your original getCourseById logic) ...
//     try {
//         const course = await Course.findById(req.params.id);
//         if (!course) return res.status(404).json({ success: false, message: "Course not found" });
//         res.status(200).json({ success: true, data: course });
//     } catch (error) {
//         if (error.kind === "ObjectId")
//             return res.status(400).json({ success: false, message: "Invalid Course ID format." });
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ======================================================
// // UPDATE COURSE
// // ======================================================
// export const updateCourse = async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!mongoose.Types.ObjectId.isValid(id))
//             return res.status(400).json({ success: false, message: "Invalid Course ID." });

//         const existing = await Course.findById(id);
//         if (!existing) return res.status(404).json({ success: false, message: "Course not found" });

//         const data = { ...req.body };

//         // Slug update
//         if (data.name && data.name !== existing.name) {
//             let baseSlug = slugify(data.name, { lower: true, strict: true });
//             let slug = baseSlug;
//             let counter = 1;
//             while (await Course.findOne({ slug, _id: { $ne: id } })) slug = `${baseSlug}-${counter++}`;
//             data.slug = slug;
//         }

//         // Course Logo
//         if (req.files?.courseLogo?.[0]) {
//             if (existing.courseLogo?.public_id) await cloudinary.uploader.destroy(existing.courseLogo.public_id);
//             const up = await cloudinary.uploader.upload(req.files.courseLogo[0].path, { folder: "courses/logos" });
//             data.courseLogo = { public_id: up.public_id, url: up.secure_url };
//         }

//         // Syllabus PDF
//         if (req.files?.syllabusPdf?.[0]) {
//             if (existing.syllabusPdf?.public_id)
//                 await cloudinary.uploader.destroy(existing.syllabusPdf.public_id, { resource_type: "raw" });
//             const up = await cloudinary.uploader.upload(req.files.syllabusPdf[0].path, {
//                 folder: "courses/syllabus",
//                 resource_type: "raw",
//             });
//             data.syllabusPdf = { public_id: up.public_id, url: up.secure_url };
//         }

//         // --- 1. Overview images --- (FIXED)
//         const overviewInput = parseArrayField(data.overview ?? existing.overview);
//         let overviewFinal = overviewInput;
//         
//         if (req.files?.overviewImages?.length > 0) {
//             // A. New images uploaded: Use mapImagesToItems for deletion/upload logic
//             const uploaded = await Promise.all(
//                 req.files.overviewImages.map((f) => cloudinary.uploader.upload(f.path, { folder: "courses/overview" }))
//             );
//             overviewFinal = await mapImagesToItems({ items: overviewInput, uploaded, existingItems: existing.overview });
//         } else {
//             // B. No new images uploaded: Retain old image URLs with new text data (CRITICAL FIX)
//             overviewFinal = overviewInput.map((item, index) => ({
//                 ...item,
//                 image: existing.overview[index]?.image || null,
//             }));
//         }
//         data.overview = overviewFinal;

//         // --- 2. Why Choose Us --- (FIXED)
//         const whyInput = parseArrayField(data.whyChooseUs ?? existing.whyChooseUs);
//         let whyFinal = whyInput;
//         
//         if (req.files?.whyChooseUsImages?.length > 0) {
//             // A. New images uploaded: Use mapImagesToItems for deletion/upload logic
//             const uploaded = await Promise.all(
//                 req.files.whyChooseUsImages.map((f) => cloudinary.uploader.upload(f.path, { folder: "courses/whyChooseUs" }))
//             );
//             whyFinal = await mapImagesToItems({ items: whyInput, uploaded, existingItems: existing.whyChooseUs });
//         } else {
//             // B. No new images uploaded: Retain old image URLs with new text data (CRITICAL FIX)
//             whyFinal = whyInput.map((item, index) => ({
//                 ...item,
//                 image: existing.whyChooseUs[index]?.image || null,
//             }));
//         }
//         data.whyChooseUs = whyFinal;

//         // Online Course Worth It
//       // --- Online Course Worth It (FIXED) ---
// // 1. Parse what came from the frontend
// const ocwInput = parseObjectField(req.body.onlineCourseWorthIt);

// // 2. Prepare the final object
// let ocwFinal = { ...ocwInput };

// if (req.files?.onlineCourseWorthItImage?.[0]) {
//     // A. NEW IMAGE UPLOADED
//     // Delete the old one from Cloudinary if it exists
//     if (existing.onlineCourseWorthIt?.image?.public_id) {
//         await cloudinary.uploader.destroy(existing.onlineCourseWorthIt.image.public_id);
//     }
//     // Upload the new one
//     const up = await cloudinary.uploader.upload(req.files.onlineCourseWorthItImage[0].path, {
//         folder: "courses/onlineCourseWorthIt",
//     });
//     ocwFinal.image = { public_id: up.public_id, url: up.secure_url };
// } else {
//     // B. NO NEW IMAGE: Retain the existing image data
//     ocwFinal.image = existing.onlineCourseWorthIt?.image || null;
// }

// data.onlineCourseWorthIt = ocwFinal;

//         // Other arrays
//         const arrayFields = [
//             "specializations", "goodThings", "topUniversities", "keyHighlights", "syllabus", "offeredCourses",
//             "onlineEligibility", "feeStructureSidebar", "detailedFees", "jobOpportunities", "topRecruiters", 
//         ];
//         arrayFields.forEach((f) => (data[f] = parseArrayField(data[f] ?? existing[f])));

// data.universities = parseUniversitiesField(
//   data.universities ?? existing.universities
// );
//         // **FIX**: Removed runValidators: true since we removed all 'required: true'
//         const updated = await Course.findByIdAndUpdate(id, data, { new: true }); 
//         res.status(200).json({ success: true, message: "Course updated successfully", course: updated });
//     } catch (error) {
//         console.error("Update Error:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ======================================================
// // DELETE COURSE (NO CHANGE)
// // ======================================================
// export const deleteCourse = async (req, res) => {
//     // ... (Your original deleteCourse logic) ...
//     try {
//         const { id } = req.params;
//         if (!mongoose.Types.ObjectId.isValid(id))
//             return res.status(400).json({ success: false, message: "Invalid Course ID." });

//         const course = await Course.findById(id);
//         if (!course) return res.status(404).json({ success: false, message: "Course not found" });

//         // Delete images
//         if (course.courseLogo?.public_id) await cloudinary.uploader.destroy(course.courseLogo.public_id);
//         if (course.syllabusPdf?.public_id)
//             await cloudinary.uploader.destroy(course.syllabusPdf.public_id, { resource_type: "raw" });
//         if (course.onlineCourseWorthIt?.image?.public_id)
//             await cloudinary.uploader.destroy(course.onlineCourseWorthIt.image.public_id);

//         for (const i of course.overview || []) if (i.image?.public_id) await cloudinary.uploader.destroy(i.image.public_id);
//         for (const i of course.whyChooseUs || [])
//             if (i.image?.public_id) await cloudinary.uploader.destroy(i.image.public_id);

//         await course.deleteOne();
//         res.status(200).json({ success: true, message: "Course deleted successfully" });
//     } catch (error) {
//         console.error("Delete Error:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };





 // updated code  without validation 
import Course from "../models/Admin/Course.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";
import mongoose from "mongoose";

const parseArrayField = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "string") {
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch { return []; }
    }
    return [];
};

// University data aur unke slugs handle karne ke liye
const parseUniversitiesField = (data) => {
    const universities = parseArrayField(data);
    return universities.map((uni) => ({
        name: uni?.name || "",
        universitySlug: uni?.name ? slugify(uni.name, { lower: true, strict: true }) : "",
        approvals: parseArrayField(uni?.approvals).map((appr) => ({
            name: appr?.name || "",
            logo: appr?.logo || null,
        })),
    }));
};

const parseObjectField = (data) => {
    if (!data) return {};
    if (typeof data === "object") return data;
    if (typeof data === "string") {
        try {
            return JSON.parse(data);
        } catch {
            return {};
        }
    }
    return {};
};

// ======================================================
// Helper: map uploaded images to items (Deletion Logic Included)
// ======================================================
const mapImagesToItems = async ({ items = [], uploaded = [], existingItems = [] }) => {
    const result = [];
    let uploadPointer = 0;
    const deletePromises = [];

    for (let i = 0; i < items.length; i++) {
        const baseItem = { ...items[i] };
        // Purana data tabhi nikalen agar wo exist karta ho
        const oldItem = existingItems[i] || null;

        // Frontend signal: Agar item.isNew true hai, matlab nayi file upload karni hai
        const needNewImage = baseItem?.isNew === true;

        if (needNewImage && uploaded[uploadPointer]) {
            // 1. Purani image delete karein (Update ke waqt)
            if (oldItem?.image?.public_id) {
                deletePromises.push(
                    cloudinary.uploader.destroy(oldItem.image.public_id)
                );
            }

            // 2. Nayi image set karein
            baseItem.image = {
                public_id: uploaded[uploadPointer].public_id,
                url: uploaded[uploadPointer].secure_url,
            };

            // Safai: isNew flag ab backend ke liye zaroori nahi raha
            delete baseItem.isNew;
            uploadPointer++;
        } 
        else if (oldItem && !needNewImage) {
            // Agar nayi image nahi aayi, to purani image hi rakhen
            baseItem.image = oldItem.image;
        }

        result.push(baseItem);
    }

    await Promise.allSettled(deletePromises);
    return result;
};


// ======================================================
// CREATE COURSE (NO CHANGES NEEDED)
// ======================================================
export const createCourse = async (req, res) => {
    // ... (Your original createCourse logic) ...
    try {
        const {
            name, category, duration, tag, specializations, overview, whyChooseUs, goodThings, topUniversities, keyHighlights, syllabus, offeredCourses, onlineEligibility, feeStructureSidebar, detailedFees, onlineCourseWorthIt, jobOpportunities, universities, topRecruiters,
        } = req.body;

        // **FIX**: Mongoose required check removed. 
        // Only keep this line if 'name' is absolutely necessary for business logic (like slug creation).
        if (!name)
           return res.status(400).json({ success: false, message: "Course Name is mandatory for creation and slug generation." });
        
        // --- Slug ---
        let baseSlug = slugify(name, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;
        while (await Course.findOne({ slug })) slug = `${baseSlug}-${counter++}`;

        // --- Course Logo ---
        let courseLogo = null;
        if (req.files?.courseLogo?.[0]) {
            const up = await cloudinary.uploader.upload(req.files.courseLogo[0].path, { folder: "courses/logos" });
            courseLogo = { public_id: up.public_id, url: up.secure_url };
        }

        // --- Syllabus PDF ---
        let syllabusPdf = null;
        if (req.files?.syllabusPdf?.[0]) {
            const up = await cloudinary.uploader.upload(req.files.syllabusPdf[0].path, {
                folder: "courses/syllabus",
                resource_type: "raw",
                  access_mode: "public",
            });
            syllabusPdf = { public_id: up.public_id, url: up.secure_url };
        }

        // --- Overview ---
        let parsedOverview = parseArrayField(overview);
        if (req.files?.overviewImages?.length > 0) {
            const uploaded = await Promise.all(
                req.files.overviewImages.map((f) => cloudinary.uploader.upload(f.path, { folder: "courses/overview" }))
            );
            // CREATE FIX: existingItems must be empty for creation
            parsedOverview = await mapImagesToItems({ items: parsedOverview, uploaded, existingItems: [] }); 
        }

        // --- Why Choose Us ---
        let parsedWhy = parseArrayField(whyChooseUs);
        if (req.files?.whyChooseUsImages?.length > 0) {
            const uploaded = await Promise.all(
                req.files.whyChooseUsImages.map((f) => cloudinary.uploader.upload(f.path, { folder: "courses/whyChooseUs" }))
            );
            // CREATE FIX: existingItems must be empty for creation
            parsedWhy = await mapImagesToItems({ items: parsedWhy, uploaded, existingItems: [] });
        }

        // --- Online Course Worth It ---
        let parsedOCW = parseObjectField(onlineCourseWorthIt);
        if (req.files?.onlineCourseWorthItImage?.[0]) {
            const up = await cloudinary.uploader.upload(req.files.onlineCourseWorthItImage[0].path, {
                folder: "courses/onlineCourseWorthIt",
            });
            parsedOCW.image = { public_id: up.public_id, url: up.secure_url };
        }

        const newCourse = new Course({
            name, slug, category, duration, tag,
            specializations: parseArrayField(specializations),
            overview: parsedOverview,
            whyChooseUs: parsedWhy,
            goodThings: parseArrayField(goodThings),
            topUniversities: parseArrayField(topUniversities),
            keyHighlights: parseArrayField(keyHighlights),
            syllabus: parseArrayField(syllabus),
            offeredCourses: parseArrayField(offeredCourses),
            onlineEligibility: parseArrayField(onlineEligibility),
            feeStructureSidebar: parseArrayField(feeStructureSidebar),
            detailedFees: parseArrayField(detailedFees),
            onlineCourseWorthIt: parsedOCW,
            jobOpportunities: parseArrayField(jobOpportunities),
            topRecruiters: parseArrayField(topRecruiters),
            courseLogo,
            syllabusPdf,
   universities: parseUniversitiesField(universities),

        });

        await newCourse.save();
        res.status(201).json({ success: true, message: "Course created successfully", course: newCourse });
    } catch (error) {
        console.error("Create Course Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// ======================================================
// GET ALL COURSES (NO CHANGE)
// ======================================================
export const getCourses = async (req, res) => {
    // ... (Your original getCourses logic) ...
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: courses.length, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================================================
// GET COURSE BY SLUG (NO CHANGE)
// ======================================================
export const getCourseBySlug = async (req, res) => {
    // ... (Your original getCourseBySlug logic) ...
    try {
        const course = await Course.findOne({ slug: req.params.slug });
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });
        res.status(200).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================================================
// GET COURSE BY ID (NO CHANGE)
// ======================================================
export const getCourseById = async (req, res) => {
    // ... (Your original getCourseById logic) ...
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        if (error.kind === "ObjectId")
            return res.status(400).json({ success: false, message: "Invalid Course ID format." });
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================================================
// UPDATE COURSE
// ======================================================

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await Course.findById(id);
        if (!existing) return res.status(404).json({ success: false, message: "Course not found" });

        const data = { ...req.body };
        
        // --- 1. JSON Parsing (Fixes CastError) ---
        const arrayFields = ["specializations", "overview", "whyChooseUs", "goodThings", "topUniversities", "keyHighlights", "syllabus", "offeredCourses", "onlineEligibility", "feeStructureSidebar", "detailedFees", "jobOpportunities", "topRecruiters"];
        arrayFields.forEach(field => {
            if (data[field]) data[field] = JSON.parse(data[field]);
        });

        // --- 2. Single Image Deletion & Upload (Logo) ---
        if (req.files?.courseLogo?.[0]) {
            if (existing.courseLogo?.public_id) await cloudinary.uploader.destroy(existing.courseLogo.public_id);
            const up = await cloudinary.uploader.upload(req.files.courseLogo[0].path, { folder: "courses/logos" });
            data.courseLogo = { public_id: up.public_id, url: up.secure_url };
        }

        // --- 3. Single File Deletion & Upload (PDF) ---
        if (req.files?.syllabusPdf?.[0]) {
            if (existing.syllabusPdf?.public_id) await cloudinary.uploader.destroy(existing.syllabusPdf.public_id, { resource_type: "raw" });
            const up = await cloudinary.uploader.upload(req.files.syllabusPdf[0].path, { folder: "courses/syllabus", resource_type: "raw" });
            data.syllabusPdf = { public_id: up.public_id, url: up.secure_url };
        }

        // --- 4. Nested Array Images (Overview & WhyChooseUs) ---
        if (req.files?.overviewImages) {
            const uploaded = await Promise.all(req.files.overviewImages.map(f => cloudinary.uploader.upload(f.path, { folder: "courses/overview" })));
            data.overview = await mapImagesToItems({ items: data.overview, uploaded, existingItems: existing.overview });
        }

        if (req.files?.whyChooseUsImages) {
            const uploaded = await Promise.all(req.files.whyChooseUsImages.map(f => cloudinary.uploader.upload(f.path, { folder: "courses/whyChooseUs" })));
            data.whyChooseUs = await mapImagesToItems({ items: data.whyChooseUs, uploaded, existingItems: existing.whyChooseUs });
        }

        // --- 5. Online Course Worth It (Object Fix) ---
        if (data.onlineCourseWorthIt) {
            let worthIt = JSON.parse(data.onlineCourseWorthIt);
            if (req.files?.onlineCourseWorthItImage?.[0]) {
                if (existing.onlineCourseWorthIt?.image?.public_id) await cloudinary.uploader.destroy(existing.onlineCourseWorthIt.image.public_id);
                const up = await cloudinary.uploader.upload(req.files.onlineCourseWorthItImage[0].path, { folder: "courses/worthit" });
                worthIt.image = { public_id: up.public_id, url: up.secure_url };
            } else {
                worthIt.image = existing.onlineCourseWorthIt?.image || null;
            }
            data.onlineCourseWorthIt = worthIt;
        }

        // --- 6. Save to DB ---
        const updated = await Course.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: false });
        res.status(200).json({ success: true, course: updated });

    } catch (error) {
        console.error("Update Bug:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================================================
// DELETE COURSE (SAFE VERSION)
// ======================================================
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        const deletePromises = [];

        // Collect all public_ids for deletion
        if (course.courseLogo?.public_id) deletePromises.push(cloudinary.uploader.destroy(course.courseLogo.public_id));
        if (course.syllabusPdf?.public_id) deletePromises.push(cloudinary.uploader.destroy(course.syllabusPdf.public_id, { resource_type: "raw" }));
        if (course.onlineCourseWorthIt?.image?.public_id) deletePromises.push(cloudinary.uploader.destroy(course.onlineCourseWorthIt.image.public_id));

        // Nested Array Images
        (course.overview || []).forEach(item => {
            if (item.image?.public_id) deletePromises.push(cloudinary.uploader.destroy(item.image.public_id));
        });
        (course.whyChooseUs || []).forEach(item => {
            if (item.image?.public_id) deletePromises.push(cloudinary.uploader.destroy(item.image.public_id));
        });

        // Parallel execution of all deletes
        await Promise.all(deletePromises).catch(e => console.warn("Some images failed to delete from Cloudinary:", e.message));

        await course.deleteOne();
        res.status(200).json({ success: true, message: "Course and all associated images deleted" });

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};




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


export const getCourses = async (req, res) => {
  try {
    const category = req.query.category || null;
    const filter = category && category !== "All" ? { category } : {};

    // 1. Sirf wahi fields mangwayein jo Card me dikhani hain (Very Important for Speed)
    // Isse heavy fields (like overview, syllabus, detailedFees) skip ho jayengi
    const query = Course.find(filter)
      .select("name slug category courseLogo duration tag") // Sirf zaroori fields
      .sort({ createdAt: -1 })
      .lean(); // Mongoose ki heavy processing hata deta hai

    const courses = await query;

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });

  } catch (error) {
    console.error("Get Courses Error:", error);
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
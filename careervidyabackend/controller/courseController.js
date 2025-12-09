
// import Course from "../models/Admin/Course.js";
// import cloudinary from "../config/cloudinary.js";
// import slugify from "slugify";

// // ======================================================
// // Helper: Safely parse JSON fields
// // ======================================================
// const parseArrayField = (data) => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   if (typeof data === 'object') return data;
//   try {
//     const parsed = JSON.parse(data);
//     return Array.isArray(parsed) ? parsed : [];
//   } catch {
//     return [];
//   }
// };

// // ======================================================
// // CREATE COURSE
// // ======================================================
// export const createCourse = async (req, res) => {
//   try {
//     const {
//       name,
//       category,
//       duration,
//       tag,
//       specializations,
//       overview,
//       whyChooseUs,
//       goodThings,
//       topUniversities,
//       keyHighlights,
//       syllabus,
//       offeredCourses,
//       onlineEligibility,
//       feeStructureSidebar,
//       detailedFees,
//       onlineCourseWorthIt,
//       jobOpportunities,
//       topRecruiters,
//     } = req.body;

//     if (!name || !category || !duration) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, category & duration are required",
//       });
//     }

//     // Generate unique slug
//     let baseSlug = slugify(name, { lower: true, strict: true });
//     let slug = baseSlug;
//     let counter = 1;
//     while (await Course.findOne({ slug })) {
//       slug = `${baseSlug}-${counter++}`;
//     }

//     // -------------------------------
//     // Upload Course Logo
//     // -------------------------------
//     let courseLogo = {};
//     if (req.files?.courseLogo?.[0]) {
//       const upload = await cloudinary.uploader.upload(req.files.courseLogo[0].path, {
//         folder: "courses/logos",
//       });
//       courseLogo = { public_id: upload.public_id, url: upload.secure_url };
//     }

//     // -------------------------------
//     // Upload Syllabus PDF
//     // -------------------------------
//     let syllabusPdf = {};
//     if (req.files?.syllabusPdf?.[0]) {
//       const upload = await cloudinary.uploader.upload(req.files.syllabusPdf[0].path, {
//         folder: "courses/syllabus",
//         resource_type: "raw",
//       });
//       syllabusPdf = { public_id: upload.public_id, url: upload.secure_url };
//     }

//     // -------------------------------
//     // Parse Overview and upload images
//     // -------------------------------
//     let parsedOverview = parseArrayField(overview);
//     if (req.files?.overviewImages?.length > 0) {
//       const uploadedImages = await Promise.all(
//         req.files.overviewImages.map((img) =>
//           cloudinary.uploader.upload(img.path, { folder: "courses/overview" })
//         )
//       );
//       parsedOverview = parsedOverview.map((item, index) => ({
//         ...item,
//         image: uploadedImages[index]
//           ? { public_id: uploadedImages[index].public_id, url: uploadedImages[index].secure_url }
//           : item.image,
//       }));
//     }

//     // -------------------------------
//     // Parse Why Choose Us and upload images
//     // -------------------------------
//     let parsedWhyChooseUs = parseArrayField(whyChooseUs);
//     if (req.files?.whyChooseUsImages?.length > 0) {
//       const uploadedImages = await Promise.all(
//         req.files.whyChooseUsImages.map((img) =>
//           cloudinary.uploader.upload(img.path, { folder: "courses/whyChooseUs" })
//         )
//       );
//       parsedWhyChooseUs = parsedWhyChooseUs.map((item, index) => ({
//         ...item,
//         image: uploadedImages[index]
//           ? { public_id: uploadedImages[index].public_id, url: uploadedImages[index].secure_url }
//           : item.image,
//       }));
//     }

//     // -------------------------------
//     // Online Course Worth It
//     // -------------------------------
//     let parsedOnlineCourseWorthIt = typeof onlineCourseWorthIt === 'object'
//       ? onlineCourseWorthIt
//       : parseArrayField(onlineCourseWorthIt);

//     if (req.files?.onlineCourseWorthItImage?.[0]) {
//       const upload = await cloudinary.uploader.upload(req.files.onlineCourseWorthItImage[0].path, {
//         folder: "courses/onlineCourseWorthIt",
//       });
//       parsedOnlineCourseWorthIt.image = { public_id: upload.public_id, url: upload.secure_url };
//     }

//     // -------------------------------
//     // Create Course
//     // -------------------------------
//     const newCourse = new Course({
//       name,
//       slug,
//       category,
//       duration,
//       tag,
//       specializations: parseArrayField(specializations),
//       overview: parsedOverview,
//       whyChooseUs: parsedWhyChooseUs,
//       goodThings: parseArrayField(goodThings),
//       topUniversities: parseArrayField(topUniversities),
//       keyHighlights: parseArrayField(keyHighlights),
//       syllabus: parseArrayField(syllabus),
//       offeredCourses: parseArrayField(offeredCourses),
//       onlineEligibility: parseArrayField(onlineEligibility),
//       feeStructureSidebar: parseArrayField(feeStructureSidebar),
//       detailedFees: parseArrayField(detailedFees),
//       onlineCourseWorthIt: parsedOnlineCourseWorthIt,
//       jobOpportunities: parseArrayField(jobOpportunities),
//       topRecruiters: parseArrayField(topRecruiters),
//       courseLogo,
//       syllabusPdf,
//     });

//     await newCourse.save();

//     res.status(201).json({
//       success: true,
//       message: "Course created successfully",
//       course: newCourse,
//     });
//   } catch (error) {
//     console.error("Create Course Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ======================================================
// // GET ALL COURSES
// // ======================================================
// export const getCourses = async (req, res) => {
//   try {
//     const courses = await Course.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, count: courses.length, courses });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ======================================================
// // GET COURSE BY SLUG
// // ======================================================
// export const getCourseBySlug = async (req, res) => {
//   try {
//     const course = await Course.findOne({ slug: req.params.slug });
//     if (!course)
//       return res.status(404).json({ success: false, message: "Course not found" });

//     res.status(200).json({ success: true, course });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ======================================================
// // GET COURSE BY ID
// // ======================================================
// export const getCourseById = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     if (!course)
//       return res.status(404).json({ success: false, message: "Course not found" });

//     res.status(200).json({ success: true, data: course });
//   } catch (error) {
//     if (error.kind === 'ObjectId') {
//       return res.status(400).json({ success: false, message: "Invalid Course ID format." });
//     }
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ======================================================
// // UPDATE COURSE
// // ======================================================
// export const updateCourse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const existing = await Course.findById(id);
//     if (!existing)
//       return res.status(404).json({ success: false, message: "Course not found" });

//     const data = req.body;

//     // -------------------------------
//     // Slug update
//     // -------------------------------
//     if (data.name && data.name !== existing.name) {
//       let baseSlug = slugify(data.name, { lower: true, strict: true });
//       let slug = baseSlug;
//       let counter = 1;
//       while (await Course.findOne({ slug, _id: { $ne: id } })) {
//         slug = `${baseSlug}-${counter++}`;
//       }
//       data.slug = slug;
//     }

//     // -------------------------------
//     // Course Logo
//     // -------------------------------
//     if (req.files?.courseLogo?.[0]) {
//       if (existing.courseLogo?.public_id)
//         await cloudinary.uploader.destroy(existing.courseLogo.public_id);
//       const upload = await cloudinary.uploader.upload(req.files.courseLogo[0].path, {
//         folder: "courses/logos",
//       });
//       data.courseLogo = { public_id: upload.public_id, url: upload.secure_url };
//     }

//     // -------------------------------
//     // Syllabus PDF
//     // -------------------------------
//     if (req.files?.syllabusPdf?.[0]) {
//       if (existing.syllabusPdf?.public_id)
//         await cloudinary.uploader.destroy(existing.syllabusPdf.public_id, { resource_type: "raw" });
//       const upload = await cloudinary.uploader.upload(req.files.syllabusPdf[0].path, {
//         folder: "courses/syllabus",
//         resource_type: "raw",
//       });
//       data.syllabusPdf = { public_id: upload.public_id, url: upload.secure_url };
//     }

//     // -------------------------------
//     // Overview Images
//     // -------------------------------
//     const overviewData = parseArrayField(data.overview);
//     if (req.files?.overviewImages?.length > 0) {
//       const uploadedImages = await Promise.all(
//         req.files.overviewImages.map((img) =>
//           cloudinary.uploader.upload(img.path, { folder: "courses/overview" })
//         )
//       );
//       data.overview = overviewData.map((item, index) => ({
//         ...item,
//         image: uploadedImages[index]
//           ? { public_id: uploadedImages[index].public_id, url: uploadedImages[index].secure_url }
//           : item.image,
//       }));
//     } else {
//       data.overview = overviewData;
//     }

//     // -------------------------------
//     // Why Choose Us Images
//     // -------------------------------
//     const whyData = parseArrayField(data.whyChooseUs);
//     if (req.files?.whyChooseUsImages?.length > 0) {
//       const uploadedImages = await Promise.all(
//         req.files.whyChooseUsImages.map((img) =>
//           cloudinary.uploader.upload(img.path, { folder: "courses/whyChooseUs" })
//         )
//       );
//       data.whyChooseUs = whyData.map((item, index) => ({
//         ...item,
//         image: uploadedImages[index]
//           ? { public_id: uploadedImages[index].public_id, url: uploadedImages[index].secure_url }
//           : item.image,
//       }));
//     } else {
//       data.whyChooseUs = whyData;
//     }

//     // -------------------------------
//     // Online Course Worth It
//     // -------------------------------
//     if (req.files?.onlineCourseWorthItImage?.[0]) {
//       if (existing.onlineCourseWorthIt?.image?.public_id)
//         await cloudinary.uploader.destroy(existing.onlineCourseWorthIt.image.public_id);
//       const upload = await cloudinary.uploader.upload(req.files.onlineCourseWorthItImage[0].path, {
//         folder: "courses/onlineCourseWorthIt",
//       });
//       const parsed = typeof data.onlineCourseWorthIt === 'object'
//         ? data.onlineCourseWorthIt
//         : parseArrayField(data.onlineCourseWorthIt);
//       parsed.image = { public_id: upload.public_id, url: upload.secure_url };
//       data.onlineCourseWorthIt = parsed;
//     } else if (data.onlineCourseWorthIt) {
//       data.onlineCourseWorthIt = typeof data.onlineCourseWorthIt === 'object'
//         ? data.onlineCourseWorthIt
//         : parseArrayField(data.onlineCourseWorthIt);
//     }

//     // -------------------------------
//     // All other array fields
//     // -------------------------------
//     data.specializations = parseArrayField(data.specializations);
//     data.goodThings = parseArrayField(data.goodThings);
//     data.topUniversities = parseArrayField(data.topUniversities);
//     data.keyHighlights = parseArrayField(data.keyHighlights);
//     data.syllabus = parseArrayField(data.syllabus);
//     data.offeredCourses = parseArrayField(data.offeredCourses);
//     data.onlineEligibility = parseArrayField(data.onlineEligibility);
//     data.feeStructureSidebar = parseArrayField(data.feeStructureSidebar);
//     data.detailedFees = parseArrayField(data.detailedFees);
//     data.jobOpportunities = parseArrayField(data.jobOpportunities);
//     data.topRecruiters = parseArrayField(data.topRecruiters);

//     // -------------------------------
//     // Update course
//     // -------------------------------
//     const updated = await Course.findByIdAndUpdate(id, data, { new: true, runValidators: true });

//     res.status(200).json({ success: true, message: "Course updated successfully", course: updated });
//   } catch (error) {
//     console.error("Update Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ======================================================
// // DELETE COURSE
// // ======================================================
// export const deleteCourse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const course = await Course.findById(id);
//     if (!course) return res.status(404).json({ success: false, message: "Course not found" });

//     if (course.courseLogo?.public_id)
//       await cloudinary.uploader.destroy(course.courseLogo.public_id);

//     for (const i of course.overview || [])
//       if (i.image?.public_id) await cloudinary.uploader.destroy(i.image.public_id);

//     for (const i of course.whyChooseUs || [])
//       if (i.image?.public_id) await cloudinary.uploader.destroy(i.image.public_id);

//     if (course.onlineCourseWorthIt?.image?.public_id)
//       await cloudinary.uploader.destroy(course.onlineCourseWorthIt.image.public_id);

//     if (course.syllabusPdf?.public_id)
//       await cloudinary.uploader.destroy(course.syllabusPdf.public_id, { resource_type: "raw" });

//     await course.deleteOne();

//     res.status(200).json({ success: true, message: "Course deleted successfully" });
//   } catch (error) {
//     console.error("Delete Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



import Course from "../models/Admin/Course.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";
import mongoose from "mongoose";

// ======================================================
// Helper: Safely parse JSON/array/object fields
// ======================================================
const parseArrayField = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object") {
    const keys = Object.keys(data);
    const numeric = keys.every((k) => String(Number(k)) === k);
    if (numeric) return keys.map((k) => data[k]);
    return [];
  }
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
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
// Helper: map uploaded images to items
// ======================================================
const mapImagesToItems = async ({ items = [], uploaded = [], existingItems = [] }) => {
  const result = [];
  const maxLen = Math.max(items.length, uploaded.length);
  for (let i = 0; i < maxLen; i++) {
    const baseItem = items[i] ? { ...items[i] } : {};
    const upload = uploaded[i];
    if (upload && existingItems[i]?.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(existingItems[i].image.public_id);
      } catch (e) {
        console.warn("Failed to destroy old image:", e.message);
      }
    }
    if (upload) baseItem.image = { public_id: upload.public_id, url: upload.secure_url };
    else baseItem.image = baseItem.image || (existingItems[i]?.image || null);
    result.push(baseItem);
  }
  return result;
};

// ======================================================
// CREATE COURSE
// ======================================================
export const createCourse = async (req, res) => {
  try {
    const {
      name,
      category,
      duration,
      tag,
      specializations,
      overview,
      whyChooseUs,
      goodThings,
      topUniversities,
      keyHighlights,
      syllabus,
      offeredCourses,
      onlineEligibility,
      feeStructureSidebar,
      detailedFees,
      onlineCourseWorthIt,
      jobOpportunities,
      topRecruiters,
    } = req.body;

    if (!name || !category || !duration)
      return res.status(400).json({ success: false, message: "Name, category & duration required" });

    // slug
    let baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await Course.findOne({ slug })) slug = `${baseSlug}-${counter++}`;

    // Course Logo
    let courseLogo = null;
    if (req.files?.courseLogo?.[0]) {
      const up = await cloudinary.uploader.upload(req.files.courseLogo[0].path, { folder: "courses/logos" });
      courseLogo = { public_id: up.public_id, url: up.secure_url };
    }

    // Syllabus PDF
    let syllabusPdf = null;
    if (req.files?.syllabusPdf?.[0]) {
      const up = await cloudinary.uploader.upload(req.files.syllabusPdf[0].path, {
        folder: "courses/syllabus",
        resource_type: "raw",
      });
      syllabusPdf = { public_id: up.public_id, url: up.secure_url };
    }

    // Overview
    let parsedOverview = parseArrayField(overview);
    if (req.files?.overviewImages?.length > 0) {
      const uploaded = await Promise.all(
        req.files.overviewImages.map((f) => cloudinary.uploader.upload(f.path, { folder: "courses/overview" }))
      );
      parsedOverview = await mapImagesToItems({ items: parsedOverview, uploaded, existingItems: [] });
    }

    // Why Choose Us
    let parsedWhy = parseArrayField(whyChooseUs);
    if (req.files?.whyChooseUsImages?.length > 0) {
      const uploaded = await Promise.all(
        req.files.whyChooseUsImages.map((f) => cloudinary.uploader.upload(f.path, { folder: "courses/whyChooseUs" }))
      );
      parsedWhy = await mapImagesToItems({ items: parsedWhy, uploaded, existingItems: [] });
    }

    // Online Course Worth It
    let parsedOCW = parseObjectField(onlineCourseWorthIt);
    if (req.files?.onlineCourseWorthItImage?.[0]) {
      const up = await cloudinary.uploader.upload(req.files.onlineCourseWorthItImage[0].path, {
        folder: "courses/onlineCourseWorthIt",
      });
      parsedOCW.image = { public_id: up.public_id, url: up.secure_url };
    }

    const newCourse = new Course({
      name,
      slug,
      category,
      duration,
      tag,
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
    });

    await newCourse.save();
    res.status(201).json({ success: true, message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
// GET ALL COURSES
// ======================================================
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
// GET COURSE BY SLUG
// ======================================================
export const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
// GET COURSE BY ID
// ======================================================
export const getCourseById = async (req, res) => {
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
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid Course ID." });

    const existing = await Course.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Course not found" });

    const data = { ...req.body };

    // Slug update
    if (data.name && data.name !== existing.name) {
      let baseSlug = slugify(data.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      while (await Course.findOne({ slug, _id: { $ne: id } })) slug = `${baseSlug}-${counter++}`;
      data.slug = slug;
    }

    // Course Logo
    if (req.files?.courseLogo?.[0]) {
      if (existing.courseLogo?.public_id) await cloudinary.uploader.destroy(existing.courseLogo.public_id);
      const up = await cloudinary.uploader.upload(req.files.courseLogo[0].path, { folder: "courses/logos" });
      data.courseLogo = { public_id: up.public_id, url: up.secure_url };
    }

    // Syllabus PDF
    if (req.files?.syllabusPdf?.[0]) {
      if (existing.syllabusPdf?.public_id)
        await cloudinary.uploader.destroy(existing.syllabusPdf.public_id, { resource_type: "raw" });
      const up = await cloudinary.uploader.upload(req.files.syllabusPdf[0].path, {
        folder: "courses/syllabus",
        resource_type: "raw",
      });
      data.syllabusPdf = { public_id: up.public_id, url: up.secure_url };
    }

    // Overview images
    const overviewInput = parseArrayField(data.overview ?? existing.overview);
    let overviewFinal = overviewInput;
    if (req.files?.overviewImages?.length > 0) {
      const uploaded = await Promise.all(
        req.files.overviewImages.map((f) => cloudinary.uploader.upload(f.path, { folder: "courses/overview" }))
      );
      overviewFinal = await mapImagesToItems({ items: overviewInput, uploaded, existingItems: existing.overview });
    }
    data.overview = overviewFinal;

    // Why Choose Us
    const whyInput = parseArrayField(data.whyChooseUs ?? existing.whyChooseUs);
    let whyFinal = whyInput;
    if (req.files?.whyChooseUsImages?.length > 0) {
      const uploaded = await Promise.all(
        req.files.whyChooseUsImages.map((f) => cloudinary.uploader.upload(f.path, { folder: "courses/whyChooseUs" }))
      );
      whyFinal = await mapImagesToItems({ items: whyInput, uploaded, existingItems: existing.whyChooseUs });
    }
    data.whyChooseUs = whyFinal;

    // Online Course Worth It
    const ocwInput = parseObjectField(data.onlineCourseWorthIt ?? existing.onlineCourseWorthIt);
    if (req.files?.onlineCourseWorthItImage?.[0]) {
      if (existing.onlineCourseWorthIt?.image?.public_id)
        await cloudinary.uploader.destroy(existing.onlineCourseWorthIt.image.public_id);
      const up = await cloudinary.uploader.upload(req.files.onlineCourseWorthItImage[0].path, {
        folder: "courses/onlineCourseWorthIt",
      });
      ocwInput.image = { public_id: up.public_id, url: up.secure_url };
    }
    data.onlineCourseWorthIt = ocwInput;

    // Other arrays
    const arrayFields = [
      "specializations",
      "goodThings",
      "topUniversities",
      "keyHighlights",
      "syllabus",
      "offeredCourses",
      "onlineEligibility",
      "feeStructureSidebar",
      "detailedFees",
      "jobOpportunities",
      "topRecruiters",
    ];
    arrayFields.forEach((f) => (data[f] = parseArrayField(data[f] ?? existing[f])));

    const updated = await Course.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: "Course updated successfully", course: updated });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
// DELETE COURSE
// ======================================================
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid Course ID." });

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // Delete images
    if (course.courseLogo?.public_id) await cloudinary.uploader.destroy(course.courseLogo.public_id);
    if (course.syllabusPdf?.public_id)
      await cloudinary.uploader.destroy(course.syllabusPdf.public_id, { resource_type: "raw" });
    if (course.onlineCourseWorthIt?.image?.public_id)
      await cloudinary.uploader.destroy(course.onlineCourseWorthIt.image.public_id);

    for (const i of course.overview || []) if (i.image?.public_id) await cloudinary.uploader.destroy(i.image.public_id);
    for (const i of course.whyChooseUs || [])
      if (i.image?.public_id) await cloudinary.uploader.destroy(i.image.public_id);

    await course.deleteOne();
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

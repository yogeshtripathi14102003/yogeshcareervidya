import Course from "../models/Admin/Course.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";

// ======================================================
// Helpers
// ======================================================
const parseArrayField = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    try { const p = JSON.parse(data); return Array.isArray(p) ? p : []; }
    catch { return []; }
  }
  return [];
};

const parseObjectField = (data) => {
  if (!data) return {};
  if (typeof data === "object" && !Array.isArray(data)) return data;
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch { return {}; }
  }
  return {};
};

const parseUniversitiesField = (data) => {
  return parseArrayField(data).map((uni) => ({
    name: uni?.name || "",
    universitySlug: uni?.name ? slugify(uni.name, { lower: true, strict: true }) : "",
    approvals: parseArrayField(uni?.approvals).map((appr) => ({
      name: appr?.name || "",
      logo: appr?.logo || null,
    })),
  }));
};

const mapImagesToItems = async ({ items = [], uploaded = [], existingItems = [] }) => {
  const result = [];
  let uploadPointer = 0;
  const deletePromises = [];

  for (let i = 0; i < items.length; i++) {
    const baseItem = { ...items[i] };
    const oldItem = existingItems[i] || null;
    const needNewImage = baseItem?.isNew === true;

    if (needNewImage && uploaded[uploadPointer]) {
      if (oldItem?.image?.public_id) {
        deletePromises.push(cloudinary.uploader.destroy(oldItem.image.public_id));
      }
      baseItem.image = {
        public_id: uploaded[uploadPointer].public_id,
        url: uploaded[uploadPointer].secure_url,
      };
      delete baseItem.isNew;
      uploadPointer++;
    } else if (oldItem && !needNewImage) {
      baseItem.image = oldItem.image;
    }
    result.push(baseItem);
  }

  await Promise.allSettled(deletePromises);
  return result;
};

const LIST_FIELDS = "name slug category duration tag courseLogo.url createdAt";

// ======================================================
// ✅ DB INDEXES — Ek baar chalenge, permanently fast
// ======================================================
const ensureIndexes = async () => {
  try {
    await Promise.all([
      Course.collection.createIndex({ slug: 1 }, { unique: true, background: true }),
      Course.collection.createIndex({ category: 1, createdAt: -1 }, { background: true }),
      Course.collection.createIndex({ createdAt: -1 }, { background: true }),
      Course.collection.createIndex({ tag: 1 }, { background: true }),
    ]);
    console.log("✅ Course indexes ensured");
  } catch (err) {
    console.warn("⚠️ Index creation warning:", err.message);
  }
};
ensureIndexes();

// ======================================================
// CREATE COURSE
// ======================================================
export const createCourse = async (req, res) => {
  try {
    const {
      name, category, duration, tag, specializations, overview, whyChooseUs,
      goodThings, topUniversities, keyHighlights, syllabus, offeredCourses,
      onlineEligibility, feeStructureSidebar, detailedFees, onlineCourseWorthIt,
      jobOpportunities, universities, topRecruiters,
    } = req.body;

    if (!name) return res.status(400).json({ success: false, message: "Course name is required" });

    // Slug
    let baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    // ✅ slug index hone se ye query fast hogi
    while (await Course.findOne({ slug }).select("_id").lean()) slug = `${baseSlug}-${counter++}`;

    // ✅ Parallel uploads
    const [logoResult, pdfResult] = await Promise.all([
      req.files?.courseLogo?.[0]
        ? cloudinary.uploader.upload(req.files.courseLogo[0].path, { folder: "courses/logos" })
        : null,
      req.files?.syllabusPdf?.[0]
        ? cloudinary.uploader.upload(req.files.syllabusPdf[0].path, {
            folder: "courses/syllabus",
            resource_type: "raw",
            access_mode: "public",
          })
        : null,
    ]);

    const courseLogo = logoResult ? { public_id: logoResult.public_id, url: logoResult.secure_url } : null;
    const syllabusPdf = pdfResult ? { public_id: pdfResult.public_id, url: pdfResult.secure_url } : null;

    // Overview images
    let parsedOverview = parseArrayField(overview);
    if (req.files?.overviewImages?.length > 0) {
      const uploaded = await Promise.all(
        req.files.overviewImages.map((f) => cloudinary.uploader.upload(f.path, { folder: "courses/overview" }))
      );
      parsedOverview = await mapImagesToItems({ items: parsedOverview, uploaded, existingItems: [] });
    }

    // WhyChooseUs images
    let parsedWhy = parseArrayField(whyChooseUs);
    if (req.files?.whyChooseUsImages?.length > 0) {
      const uploaded = await Promise.all(
        req.files.whyChooseUsImages.map((f) => cloudinary.uploader.upload(f.path, { folder: "courses/whyChooseUs" }))
      );
      parsedWhy = await mapImagesToItems({ items: parsedWhy, uploaded, existingItems: [] });
    }

    // OnlineCourseWorthIt
    let parsedOCW = parseObjectField(onlineCourseWorthIt);
    if (req.files?.onlineCourseWorthItImage?.[0]) {
      const up = await cloudinary.uploader.upload(req.files.onlineCourseWorthItImage[0].path, { folder: "courses/worthit" });
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
      universities: parseUniversitiesField(universities),
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
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 24, 50); // ✅ max 50
    const filter = req.query.category && req.query.category !== "All"
      ? { category: req.query.category } : {};

    // ✅ Parallel count + find
    const [totalCourses, courses] = await Promise.all([
      Course.countDocuments(filter),
      Course.find(filter)
        .select(LIST_FIELDS)        // ✅ sirf zaroori fields
        .sort({ createdAt: -1 })   // ✅ index se fast
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),                   // ✅ plain JS — 2-3x fast
    ]);

    res.set("Cache-Control", "public, max-age=60"); // ✅ 1 min browser cache
    res.status(200).json({
      success: true,
      totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
      courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
// GET COURSE BY SLUG
// ======================================================
export const getCourseBySlug = async (req, res) => {
  try {
    // ✅ slug index hone se O(1) lookup
    const course = await Course.findOne({ slug: req.params.slug }).lean();
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    res.set("Cache-Control", "public, max-age=300"); // ✅ 5 min cache
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
    // ✅ _id default index hota hai MongoDB mein — already fast
    const course = await Course.findById(req.params.id).lean();
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    res.set("Cache-Control", "no-store"); // ✅ admin — fresh data
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

    // ✅ Safe parse
    const arrayFields = [
      "specializations", "goodThings", "topUniversities", "keyHighlights",
      "syllabus", "offeredCourses", "onlineEligibility", "feeStructureSidebar",
      "detailedFees", "jobOpportunities", "topRecruiters",
    ];
    arrayFields.forEach((field) => {
      if (data[field] !== undefined) data[field] = parseArrayField(data[field]);
    });

    if (data.universities !== undefined) {
      data.universities = parseUniversitiesField(data.universities);
    }

    // ✅ Parallel logo + pdf
    const [logoResult, pdfResult] = await Promise.all([
      req.files?.courseLogo?.[0]
        ? (existing.courseLogo?.public_id
            ? cloudinary.uploader.destroy(existing.courseLogo.public_id)
            : Promise.resolve()
          ).then(() => cloudinary.uploader.upload(req.files.courseLogo[0].path, { folder: "courses/logos" }))
        : null,
      req.files?.syllabusPdf?.[0]
        ? (existing.syllabusPdf?.public_id
            ? cloudinary.uploader.destroy(existing.syllabusPdf.public_id, { resource_type: "raw" })
            : Promise.resolve()
          ).then(() => cloudinary.uploader.upload(req.files.syllabusPdf[0].path, { folder: "courses/syllabus", resource_type: "raw" }))
        : null,
    ]);

    if (logoResult) data.courseLogo = { public_id: logoResult.public_id, url: logoResult.secure_url };
    if (pdfResult) data.syllabusPdf = { public_id: pdfResult.public_id, url: pdfResult.secure_url };

    // Overview
    if (req.files?.overviewImages) {
      const uploaded = await Promise.all(
        req.files.overviewImages.map((f) => cloudinary.uploader.upload(f.path, { folder: "courses/overview" }))
      );
      data.overview = await mapImagesToItems({
        items: parseArrayField(data.overview),
        uploaded,
        existingItems: existing.overview,
      });
    } else if (data.overview !== undefined) {
      data.overview = parseArrayField(data.overview);
    }

    // WhyChooseUs
    if (req.files?.whyChooseUsImages) {
      const uploaded = await Promise.all(
        req.files.whyChooseUsImages.map((f) => cloudinary.uploader.upload(f.path, { folder: "courses/whyChooseUs" }))
      );
      data.whyChooseUs = await mapImagesToItems({
        items: parseArrayField(data.whyChooseUs),
        uploaded,
        existingItems: existing.whyChooseUs,
      });
    } else if (data.whyChooseUs !== undefined) {
      data.whyChooseUs = parseArrayField(data.whyChooseUs);
    }

    // OnlineCourseWorthIt
    if (data.onlineCourseWorthIt !== undefined) {
      const worthIt = parseObjectField(data.onlineCourseWorthIt);
      if (req.files?.onlineCourseWorthItImage?.[0]) {
        if (existing.onlineCourseWorthIt?.image?.public_id) {
          await cloudinary.uploader.destroy(existing.onlineCourseWorthIt.image.public_id);
        }
        const up = await cloudinary.uploader.upload(req.files.onlineCourseWorthItImage[0].path, { folder: "courses/worthit" });
        worthIt.image = { public_id: up.public_id, url: up.secure_url };
      } else {
        worthIt.image = existing.onlineCourseWorthIt?.image || null;
      }
      data.onlineCourseWorthIt = worthIt;
    }

    const updated = await Course.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: false });
    res.status(200).json({ success: true, course: updated });
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
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const deletePromises = [];

    if (course.courseLogo?.public_id)
      deletePromises.push(cloudinary.uploader.destroy(course.courseLogo.public_id));
    if (course.syllabusPdf?.public_id)
      deletePromises.push(cloudinary.uploader.destroy(course.syllabusPdf.public_id, { resource_type: "raw" }));
    if (course.onlineCourseWorthIt?.image?.public_id)
      deletePromises.push(cloudinary.uploader.destroy(course.onlineCourseWorthIt.image.public_id));

    (course.overview || []).forEach((item) => {
      if (item.image?.public_id) deletePromises.push(cloudinary.uploader.destroy(item.image.public_id));
    });
    (course.whyChooseUs || []).forEach((item) => {
      if (item.image?.public_id) deletePromises.push(cloudinary.uploader.destroy(item.image.public_id));
    });
    (course.universities || []).forEach((uni) => {
      (uni.approvals || []).forEach((appr) => {
        if (appr.logo?.public_id) deletePromises.push(cloudinary.uploader.destroy(appr.logo.public_id));
      });
    });

    await Promise.allSettled(deletePromises);
    await course.deleteOne();
    res.status(200).json({ success: true, message: "Course and all associated images deleted" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
// GET COURSES SHORT
// ======================================================
export const getCoursesShort = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 12, 50);
    const filter = req.query.category && req.query.category !== "All"
      ? { category: req.query.category } : {};

    const [total, courses] = await Promise.all([
      Course.countDocuments(filter),
      Course.find(filter)
        .select(LIST_FIELDS)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    res.set("Cache-Control", "public, max-age=60");
    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
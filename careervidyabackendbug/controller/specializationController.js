import Course from "../models/Admin/Specializations.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";
import mongoose from "mongoose";

/* ======================================================
   HELPERS
====================================================== */
const parseArrayField = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object") {
    const keys = Object.keys(data);
    if (keys.every((k) => String(Number(k)) === k)) {
      return keys.map((k) => data[k]);
    }
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

const parseSeoField = (data) => ({
  title: data?.title || "",
  description: data?.description || "",
  keywords: data?.keywords || "",
});

const parseFaqsField = (data) =>
  parseArrayField(data).map((f) => ({
    question: f?.question || "",
    answer: f?.answer || "",
  }));

const parseUniversitiesField = (data) =>
  parseArrayField(data).map((u) => ({
    name: u?.name || "",
    universitySlug: u?.universitySlug || "",
    approvals: parseArrayField(u?.approvals),
  }));

/* ======================================================
   CREATE COURSE
====================================================== */
export const createCourse = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ success: false, message: "Course name required" });

    let baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await Course.findOne({ slug })) slug = `${baseSlug}-${counter++}`;

    let courseLogo = null;
    if (req.files?.courseLogo?.[0]) {
      const up = await cloudinary.uploader.upload(req.files.courseLogo[0].path, {
        folder: "courses/logos",
      });
      courseLogo = { public_id: up.public_id, url: up.secure_url };
    }

    const newCourse = await Course.create({
      name,
      slug,
      category: req.body.category,
      duration: req.body.duration,
      tag: req.body.tag,
      seo: parseSeoField(parseObjectField(req.body.seo)),
      faqs: parseFaqsField(req.body.faqs),
      specializations: parseArrayField(req.body.specializations),
      overview: parseArrayField(req.body.overview),
      whyChooseUs: parseArrayField(req.body.whyChooseUs),
      goodThings: parseArrayField(req.body.goodThings),
      keyHighlights: parseArrayField(req.body.keyHighlights),
      syllabus: parseArrayField(req.body.syllabus),
      offeredCourses: parseArrayField(req.body.offeredCourses),
      onlineEligibility: parseArrayField(req.body.onlineEligibility),
      feeStructureSidebar: parseArrayField(req.body.feeStructureSidebar),
      detailedFees: parseArrayField(req.body.detailedFees),
      jobOpportunities: parseArrayField(req.body.jobOpportunities),
      topRecruiters: parseArrayField(req.body.topRecruiters),
      universities: parseUniversitiesField(req.body.universities),
      courseLogo,
    });

    res.status(201).json({ success: true, course: newCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   BULK UPLOAD COURSES
====================================================== */
export const bulkUploadCourses = async (req, res) => {
  try {
    const courses = parseArrayField(req.body.courses);
    if (!courses.length)
      return res.status(400).json({ success: false, message: "No courses provided" });

    const prepared = [];

    for (const c of courses) {
      if (!c.name) continue;

      let baseSlug = slugify(c.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      while (await Course.findOne({ slug })) slug = `${baseSlug}-${counter++}`;

      prepared.push({
        name: c.name,
        slug,
        category: c.category,
        duration: c.duration,
        tag: c.tag,
        seo: parseSeoField(c.seo || {}),
        faqs: parseFaqsField(c.faqs),
        specializations: parseArrayField(c.specializations),
      });
    }

    const inserted = await Course.insertMany(prepared);
    res.status(201).json({
      success: true,
      message: "Bulk upload successful",
      count: inserted.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   GET COURSES (SEARCH + FILTER)
====================================================== */
export const getCourses = async (req, res) => {
  try {
    const { search, category, tag } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { "seo.keywords": { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (tag) query.tag = tag;

    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   GET BY SLUG
====================================================== */
export const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   GET BY ID
====================================================== */
export const getCourseById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   UPDATE COURSE
====================================================== */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const existing = await Course.findById(id);
    if (!existing)
      return res.status(404).json({ success: false, message: "Course not found" });

    const data = req.body;

    if (data.name && data.name !== existing.name) {
      let baseSlug = slugify(data.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      while (await Course.findOne({ slug, _id: { $ne: id } }))
        slug = `${baseSlug}-${counter++}`;
      data.slug = slug;
    }

    data.seo = parseSeoField(parseObjectField(data.seo ?? existing.seo));
    data.faqs = parseFaqsField(data.faqs ?? existing.faqs);
    data.specializations = parseArrayField(data.specializations ?? existing.specializations);
    data.universities = parseUniversitiesField(data.universities ?? existing.universities);

    const updated = await Course.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json({ success: true, course: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   DELETE COURSE
====================================================== */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const course = await Course.findById(id);
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    if (course.courseLogo?.public_id)
      await cloudinary.uploader.destroy(course.courseLogo.public_id);

    await course.deleteOne();
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

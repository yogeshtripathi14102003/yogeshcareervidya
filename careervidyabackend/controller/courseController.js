




// import Course from "../models/Admin/Course.js";
// import cloudinary from "../config/cloudinary.js";
// import fs from "fs";
// import slugify from "slugify"; // npm i slugify

// // ======================================================
// // ✅ CREATE COURSE
// // ======================================================
// export const createCourse = async (req, res) => {
//   try {
//     const {
//       name,
//       category,
//       duration,
//       tag,
//       specialization,
//       overview,
//       whyChooseUs,
//       goodThings,
//       topUniversities,
//       keyHighlights,
//       syllabus,
//     } = req.body;

//     if (!name || !category || !duration) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, category, and duration are required fields.",
//       });
//     }

//     // 🔹 Generate unique slug
//     let baseSlug = slugify(name, { lower: true, strict: true });
//     let slug = baseSlug;
//     let counter = 1;
//     while (await Course.findOne({ slug })) {
//       slug = `${baseSlug}-${counter++}`;
//     }

//     let courseLogo = {};

//     // 🔹 Upload image to Cloudinary (if provided)
//     if (req.file) {
//       try {
//         const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//           folder: "courses/logos",
//           resource_type: "image",
//           timeout: 120000,
//         });

//         courseLogo = {
//           public_id: uploadResult.public_id,
//           url: uploadResult.secure_url,
//         };
//       } catch (uploadErr) {
//         console.error("❌ Cloudinary Upload Error:", uploadErr.message);
//         try {
//           const retryUpload = await cloudinary.uploader.upload(req.file.path, {
//             folder: "courses/logos",
//             resource_type: "image",
//             timeout: 120000,
//           });
//           courseLogo = {
//             public_id: retryUpload.public_id,
//             url: retryUpload.secure_url,
//           };
//         } catch (retryErr) {
//           console.error("❌ Cloudinary Retry Failed:", retryErr.message);
//           return res.status(500).json({
//             success: false,
//             message: "Cloudinary upload failed after retry.",
//             error: retryErr.message,
//           });
//         }
//       } finally {
//         if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//       }
//     }

//     // 🔹 Create new course document
//     const newCourse = new Course({
//       name,
//       slug,
//       category,
//       duration,
//       tag,
//       specialization: specialization
//         ? Array.isArray(specialization)
//           ? specialization
//           : specialization.split(",").map((s) => s.trim())
//         : [],
//       overview:
//         typeof overview === "string" ? JSON.parse(overview) : overview || [],
//       whyChooseUs:
//         typeof whyChooseUs === "string"
//           ? JSON.parse(whyChooseUs)
//           : whyChooseUs || [],
//       goodThings: goodThings
//         ? Array.isArray(goodThings)
//           ? goodThings
//           : goodThings.split(",").map((s) => s.trim())
//         : [],
//       topUniversities:
//         typeof topUniversities === "string"
//           ? JSON.parse(topUniversities)
//           : topUniversities || [],
//       keyHighlights:
//         typeof keyHighlights === "string"
//           ? JSON.parse(keyHighlights)
//           : keyHighlights || [],
//       syllabus:
//         typeof syllabus === "string" ? JSON.parse(syllabus) : syllabus || [],
//       courseLogo,
//     });

//     await newCourse.save();

//     res.status(201).json({
//       success: true,
//       message: "✅ Course created successfully",
//       course: newCourse,
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: `Duplicate slug detected: ${error.keyValue?.slug}. Try changing the course name.`,
//       });
//     }

//     console.error("❌ Create Course Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Server error while creating course.",
//     });
//   }
// };

// // ======================================================
// // ✅ UPDATE COURSE
// // ======================================================
// export const updateCourse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const course = await Course.findById(id);

//     if (!course) {
//       return res.status(404).json({
//         success: false,
//         message: "❌ Course not found",
//       });
//     }

//     const {
//       name,
//       category,
//       duration,
//       tag,
//       specialization,
//       overview,
//       whyChooseUs,
//       goodThings,
//       topUniversities,
//       keyHighlights,
//       syllabus,
//     } = req.body;

//     // ✅ Update slug only if name changed
//     if (name && name !== course.name) {
//       let baseSlug = slugify(name, { lower: true, strict: true });
//       let slug = baseSlug;
//       let counter = 1;
//       while (await Course.findOne({ slug, _id: { $ne: id } })) {
//         slug = `${baseSlug}-${counter++}`;
//       }
//       course.slug = slug;
//     }

//     // ✅ Update course fields
//     if (name) course.name = name;
//     if (category) course.category = category;
//     if (duration) course.duration = duration;
//     if (tag) course.tag = tag;

//     if (specialization) {
//       course.specialization = Array.isArray(specialization)
//         ? specialization
//         : specialization.split(",").map((s) => s.trim());
//     }

//     if (overview) {
//       course.overview =
//         typeof overview === "string" ? JSON.parse(overview) : overview;
//     }

//     if (whyChooseUs) {
//       course.whyChooseUs =
//         typeof whyChooseUs === "string" ? JSON.parse(whyChooseUs) : whyChooseUs;
//     }

//     if (goodThings) {
//       course.goodThings = Array.isArray(goodThings)
//         ? goodThings
//         : goodThings.split(",").map((s) => s.trim());
//     }

//     if (topUniversities) {
//       course.topUniversities =
//         typeof topUniversities === "string"
//           ? JSON.parse(topUniversities)
//           : topUniversities;
//     }

//     if (keyHighlights) {
//       course.keyHighlights =
//         typeof keyHighlights === "string"
//           ? JSON.parse(keyHighlights)
//           : keyHighlights;
//     }

//     if (syllabus) {
//       course.syllabus =
//         typeof syllabus === "string" ? JSON.parse(syllabus) : syllabus;
//     }

//     // ✅ Handle logo update
//     if (req.file) {
//       // Delete old logo if exists
//       if (course.courseLogo?.public_id) {
//         await cloudinary.uploader.destroy(course.courseLogo.public_id);
//       }

//       const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//         folder: "courses/logos",
//         resource_type: "image",
//         timeout: 120000,
//       });

//       course.courseLogo = {
//         public_id: uploadResult.public_id,
//         url: uploadResult.secure_url,
//       };

//       if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//     }

//     await course.save();

//     res.status(200).json({
//       success: true,
//       message: "✅ Course updated successfully",
//       course,
//     });
//   } catch (error) {
//     console.error("❌ Update Course Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Server error while updating course.",
//     });
//   }
// };

// // ======================================================
// // ✅ GET ALL COURSES
// // ======================================================
// export const getCourses = async (req, res) => {
//   try {
//     const courses = await Course.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, count: courses.length, courses });
//   } catch (error) {
//     console.error("❌ Get Courses Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ======================================================
// // ✅ GET COURSE BY SLUG
// // ======================================================
// export const getCourseBySlug = async (req, res) => {
//   try {
//     const { slug } = req.params;
//     const course = await Course.findOne({ slug });
//     if (!course)
//       return res
//         .status(404)
//         .json({ success: false, message: "❌ Course not found" });

//     res.status(200).json({ success: true, course });
//   } catch (error) {
//     console.error("❌ Get Course By Slug Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ======================================================
// // ✅ DELETE COURSE
// // ======================================================
// export const deleteCourse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const course = await Course.findById(id);
//     if (!course)
//       return res
//         .status(404)
//         .json({ success: false, message: "❌ Course not found" });

//     if (course.courseLogo?.public_id) {
//       await cloudinary.uploader.destroy(course.courseLogo.public_id);
//     }

//     await Course.findByIdAndDelete(id);
//     res
//       .status(200)
//       .json({ success: true, message: "✅ Course deleted successfully" });
//   } catch (error) {
//     console.error("❌ Delete Course Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import Course from "../models/Admin/Course.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";

// ======================================================
// ✅ CREATE COURSE
// ======================================================
export const createCourse = async (req, res) => {
  try {
    const {
      name,
      category,
      duration,
      tag,
      specialization,
      overview,
      whyChooseUs,
      goodThings,
      topUniversities,
      keyHighlights,
      syllabus,
    } = req.body;

    if (!name || !category || !duration) {
      return res.status(400).json({
        success: false,
        message: "Name, category, and duration are required fields.",
      });
    }

    // 🔹 Generate unique slug
    let baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await Course.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // ✅ Upload Course Logo
    let courseLogo = {};
    if (req.files?.courseLogo?.[0]) {
      const uploadResult = await cloudinary.uploader.upload(
        req.files.courseLogo[0].path,
        { folder: "courses/logos" }
      );
      courseLogo = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    // ✅ Parse Overview Data
    let parsedOverview =
      typeof overview === "string" ? JSON.parse(overview) : overview || [];

    if (req.files?.overviewImages?.length > 0) {
      const uploadedOverviewImages = await Promise.all(
        req.files.overviewImages.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "courses/overview",
          });
          return { public_id: result.public_id, url: result.secure_url };
        })
      );

      parsedOverview = parsedOverview.map((item, index) => ({
        ...item,
        image: uploadedOverviewImages[index] || {},
      }));
    }

    // ✅ Parse Why Choose Us Data
    let parsedWhyChooseUs =
      typeof whyChooseUs === "string" ? JSON.parse(whyChooseUs) : whyChooseUs || [];

    if (req.files?.whyChooseUsImages?.length > 0) {
      const uploadedWhyImages = await Promise.all(
        req.files.whyChooseUsImages.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "courses/whyChooseUs",
          });
          return { public_id: result.public_id, url: result.secure_url };
        })
      );

      parsedWhyChooseUs = parsedWhyChooseUs.map((item, index) => ({
        ...item,
        image: uploadedWhyImages[index] || {},
      }));
    }

    // ✅ Save Course
    const newCourse = new Course({
      name,
      slug,
      category,
      duration,
      tag,
      specialization: specialization
        ? Array.isArray(specialization)
          ? specialization
          : specialization.split(",").map((s) => s.trim())
        : [],
      overview: parsedOverview,
      whyChooseUs: parsedWhyChooseUs,
      goodThings: goodThings
        ? Array.isArray(goodThings)
          ? goodThings
          : goodThings.split(",").map((s) => s.trim())
        : [],
      topUniversities:
        typeof topUniversities === "string"
          ? JSON.parse(topUniversities)
          : topUniversities || [],
      keyHighlights:
        typeof keyHighlights === "string"
          ? JSON.parse(keyHighlights)
          : keyHighlights || [],
      syllabus:
        typeof syllabus === "string" ? JSON.parse(syllabus) : syllabus || [],
      courseLogo,
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "✅ Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("❌ Error creating course:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating course.",
    });
  }
};

// ======================================================
// ✅ GET ALL COURSES
// ======================================================
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
// ✅ GET COURSE BY SLUG
// ======================================================
export const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
// ✅ UPDATE COURSE
// ======================================================
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Course.findById(id);
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    const data = req.body;

    // Update slug if name changes
    if (data.name && data.name !== existing.name) {
      let baseSlug = slugify(data.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      while (await Course.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter++}`;
      }
      data.slug = slug;
    }

    // ✅ Replace logo if new uploaded
    if (req.files?.courseLogo?.[0]) {
      if (existing.courseLogo?.public_id)
        await cloudinary.uploader.destroy(existing.courseLogo.public_id);
      const uploadResult = await cloudinary.uploader.upload(
        req.files.courseLogo[0].path,
        { folder: "courses/logos" }
      );
      data.courseLogo = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    // ✅ Replace overviewImages
    if (req.files?.overviewImages?.length > 0) {
      const uploadedOverviewImages = await Promise.all(
        req.files.overviewImages.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "courses/overview",
          });
          return { public_id: result.public_id, url: result.secure_url };
        })
      );
      const parsedOverview =
        typeof data.overview === "string"
          ? JSON.parse(data.overview)
          : data.overview || [];
      data.overview = parsedOverview.map((item, index) => ({
        ...item,
        image: uploadedOverviewImages[index] || item.image,
      }));
    }

    // ✅ Replace whyChooseUsImages
    if (req.files?.whyChooseUsImages?.length > 0) {
      const uploadedWhyImages = await Promise.all(
        req.files.whyChooseUsImages.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "courses/whyChooseUs",
          });
          return { public_id: result.public_id, url: result.secure_url };
        })
      );
      const parsedWhyChooseUs =
        typeof data.whyChooseUs === "string"
          ? JSON.parse(data.whyChooseUs)
          : data.whyChooseUs || [];
      data.whyChooseUs = parsedWhyChooseUs.map((item, index) => ({
        ...item,
        image: uploadedWhyImages[index] || item.image,
      }));
    }

    const updated = await Course.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "✅ Course updated successfully",
      course: updated,
    });
  } catch (error) {
    console.error("❌ Update Course Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
// ✅ DELETE COURSE
// ======================================================
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    // Delete Cloudinary images
    if (course.courseLogo?.public_id)
      await cloudinary.uploader.destroy(course.courseLogo.public_id);

    for (const item of course.overview || []) {
      if (item.image?.public_id)
        await cloudinary.uploader.destroy(item.image.public_id);
    }

    for (const item of course.whyChooseUs || []) {
      if (item.image?.public_id)
        await cloudinary.uploader.destroy(item.image.public_id);
    }

    await course.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "🗑️ Course deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

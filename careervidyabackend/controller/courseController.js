





// import Course from "../models/Admin/Course.js";
// import cloudinary from "../config/cloudinary.js";
// import slugify from "slugify";

// // ======================================================
// // ✅ Helper: Parse JSON fields safely
// // ======================================================
// const parseJSON = (data) => {
//   try {
//     return typeof data === "string" ? JSON.parse(data) : data || [];
//   } catch {
//     return [];
//   }
// };

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

//     // 🔹 Generate unique slug
//     let baseSlug = slugify(name, { lower: true, strict: true });
//     let slug = baseSlug;
//     let counter = 1;

//     while (await Course.findOne({ slug })) {
//       slug = `${baseSlug}-${counter++}`;
//     }

//     // ----------------------------------------------------
//     // ✅ Upload Course Logo
//     // ----------------------------------------------------
//     let courseLogo = {};
//     if (req.files?.courseLogo?.[0]) {
//       const upload = await cloudinary.uploader.upload(
//         req.files.courseLogo[0].path,
//         { folder: "courses/logos" }
//       );
//       courseLogo = { public_id: upload.public_id, url: upload.secure_url };
//     }

//     // ----------------------------------------------------
//     // ✅ Upload Syllabus PDF
//     // ----------------------------------------------------
//     let syllabusPdf = {};
//     if (req.files?.syllabusPdf?.[0]) {
//       const upload = await cloudinary.uploader.upload(
//         req.files.syllabusPdf[0].path,
//         {
//           folder: "courses/syllabus",
//           resource_type: "raw", // IMPORTANT for PDF
//         }
//       );

//       syllabusPdf = { public_id: upload.public_id, url: upload.secure_url };
//     }

//     // ----------------------------------------------------
//     // ✅ OVERVIEW (with images)
//     // ----------------------------------------------------
//     let parsedOverview = parseJSON(overview);

//     if (req.files?.overviewImages?.length > 0) {
//       const uploadedImages = await Promise.all(
//         req.files.overviewImages.map((img) =>
//           cloudinary.uploader.upload(img.path, { folder: "courses/overview" })
//         )
//       );

//       parsedOverview = parsedOverview.map((item, index) => ({
//         ...item,
//         image: {
//           public_id: uploadedImages[index]?.public_id,
//           url: uploadedImages[index]?.secure_url,
//         },
//       }));
//     }

//     // ----------------------------------------------------
//     // WHY CHOOSE US (with images)
//     // ----------------------------------------------------
//     let parsedWhyChooseUs = parseJSON(whyChooseUs);

//     if (req.files?.whyChooseUsImages?.length > 0) {
//       const uploadedImages = await Promise.all(
//         req.files.whyChooseUsImages.map((img) =>
//           cloudinary.uploader.upload(img.path, {
//             folder: "courses/whyChooseUs",
//           })
//         )
//       );

//       parsedWhyChooseUs = parsedWhyChooseUs.map((item, index) => ({
//         ...item,
//         image: {
//           public_id: uploadedImages[index]?.public_id,
//           url: uploadedImages[index]?.secure_url,
//         },
//       }));
//     }

//     // ----------------------------------------------------
//     // ⭐ CREATE COURSE DATA
//     // ----------------------------------------------------
//     const newCourse = new Course({
//       name,
//       slug,
//       category,
//       duration,
//       tag,

//       specialization: specialization ? parseJSON(specialization) : [],

//       overview: parsedOverview,
//       whyChooseUs: parsedWhyChooseUs,
//       goodThings: parseJSON(goodThings),
//       topUniversities: parseJSON(topUniversities),
//       keyHighlights: parseJSON(keyHighlights),
//       syllabus: parseJSON(syllabus),

//       offeredCourses: parseJSON(offeredCourses),
//       onlineEligibility: parseJSON(onlineEligibility),
//       feeStructureSidebar: parseJSON(feeStructureSidebar),
//       detailedFees: parseJSON(detailedFees),
//       onlineCourseWorthIt: parseJSON(onlineCourseWorthIt),
//       jobOpportunities: parseJSON(jobOpportunities),
//       topRecruiters: parseJSON(topRecruiters),

//       courseLogo,
      
//       // ⭐ NEW FIELD
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
//       return res
//         .status(404)
//         .json({ success: false, message: "Course not found" });

//     res.status(200).json({ success: true, course });
//   } catch (error) {
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
//       return res.status(404).json({ success: false, message: "Not found" });

//     const data = req.body;

//     // Slug update
//     if (data.name && data.name !== existing.name) {
//       let baseSlug = slugify(data.name, { lower: true, strict: true });
//       let slug = baseSlug;
//       let counter = 1;

//       while (await Course.findOne({ slug, _id: { $ne: id } })) {
//         slug = `${baseSlug}-${counter++}`;
//       }
//       data.slug = slug;
//     }

//     // ----------------------------------------------------
//     // UPDATE COURSE LOGO
//     // ----------------------------------------------------
//     if (req.files?.courseLogo?.[0]) {
//       if (existing.courseLogo?.public_id)
//         await cloudinary.uploader.destroy(existing.courseLogo.public_id);

//       const upload = await cloudinary.uploader.upload(
//         req.files.courseLogo[0].path,
//         { folder: "courses/logos" }
//       );

//       data.courseLogo = {
//         public_id: upload.public_id,
//         url: upload.secure_url,
//       };
//     }

//     // ----------------------------------------------------
//     // ⭐ UPDATE SYLLABUS PDF
//     // ----------------------------------------------------
//     if (req.files?.syllabusPdf?.[0]) {
//       if (existing.syllabusPdf?.public_id)
//         await cloudinary.uploader.destroy(existing.syllabusPdf.public_id);

//       const upload = await cloudinary.uploader.upload(
//         req.files.syllabusPdf[0].path,
//         {
//           folder: "courses/syllabus",
//           resource_type: "raw",
//         }
//       );

//       data.syllabusPdf = {
//         public_id: upload.public_id,
//         url: upload.secure_url,
//       };
//     }

//     // ----------------------------------------------------
//     // UPDATE Overview Images
//     // ----------------------------------------------------
//     if (req.files?.overviewImages?.length > 0) {
//       const uploadedImages = await Promise.all(
//         req.files.overviewImages.map((img) =>
//           cloudinary.uploader.upload(img.path, { folder: "courses/overview" })
//         )
//       );

//       const parsedOverview = parseJSON(data.overview);

//       data.overview = parsedOverview.map((item, index) => ({
//         ...item,
//         image: uploadedImages[index]
//           ? {
//               public_id: uploadedImages[index].public_id,
//               url: uploadedImages[index].secure_url,
//             }
//           : item.image,
//       }));
//     }

//     // ----------------------------------------------------
//     // UPDATE Why Choose Us Images
//     // ----------------------------------------------------
//     if (req.files?.whyChooseUsImages?.length > 0) {
//       const uploadedImages = await Promise.all(
//         req.files.whyChooseUsImages.map((img) =>
//           cloudinary.uploader.upload(img.path, {
//             folder: "courses/whyChooseUs",
//           })
//         )
//       );

//       const parsed = parseJSON(data.whyChooseUs);

//       data.whyChooseUs = parsed.map((item, index) => ({
//         ...item,
//         image: uploadedImages[index]
//           ? {
//               public_id: uploadedImages[index].public_id,
//               url: uploadedImages[index].secure_url,
//             }
//           : item.image,
//       }));
//     }

//     // Parse all JSON fields
//     data.specialization = parseJSON(data.specialization);
//     data.goodThings = parseJSON(data.goodThings);
//     data.topUniversities = parseJSON(data.topUniversities);
//     data.keyHighlights = parseJSON(data.keyHighlights);
//     data.syllabus = parseJSON(data.syllabus);

//     data.offeredCourses = parseJSON(data.offeredCourses);
//     data.onlineEligibility = parseJSON(data.onlineEligibility);
//     data.feeStructureSidebar = parseJSON(data.feeStructureSidebar);
//     data.detailedFees = parseJSON(data.detailedFees);
//     data.onlineCourseWorthIt = parseJSON(data.onlineCourseWorthIt);
//     data.jobOpportunities = parseJSON(data.jobOpportunities);
//     data.topRecruiters = parseJSON(data.topRecruiters);

//     const updated = await Course.findByIdAndUpdate(id, data, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Course updated",
//       course: updated,
//     });
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
//     if (!course)
//       return res
//         .status(404)
//         .json({ success: false, message: "Course not found" });

//     // Delete course logo
//     if (course.courseLogo?.public_id)
//       await cloudinary.uploader.destroy(course.courseLogo.public_id);

//     // Delete overview images
//     for (const i of course.overview || [])
//       if (i.image?.public_id)
//         await cloudinary.uploader.destroy(i.image.public_id);

//     // Delete why choose us images
//     for (const i of course.whyChooseUs || [])
//       if (i.image?.public_id)
//         await cloudinary.uploader.destroy(i.image.public_id);

//     // Delete online course worth it image
//     if (course.onlineCourseWorthIt?.image?.public_id)
//       await cloudinary.uploader.destroy(
//         course.onlineCourseWorthIt.image.public_id
//       );

//     // ⭐ Delete Syllabus PDF
//     if (course.syllabusPdf?.public_id)
//       await cloudinary.uploader.destroy(course.syllabusPdf.public_id, {
//         resource_type: "raw",
//       });

//     await course.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Course deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };






import Course from "../models/Admin/Course.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";

// ======================================================
// Helper: Parse JSON fields safely
// ======================================================
const parseJSON = (data) => {
  try {
    return typeof data === "string" ? JSON.parse(data) : data || [];
  } catch {
    return [];
  }
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

    if (!name || !category || !duration) {
      return res.status(400).json({
        success: false,
        message: "Name, category & duration are required",
      });
    }

    // Generate unique slug
    let baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await Course.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // -------------------------------
    // Upload Course Logo
    // -------------------------------
    let courseLogo = {};
    if (req.files?.courseLogo?.[0]) {
      const upload = await cloudinary.uploader.upload(req.files.courseLogo[0].path, {
        folder: "courses/logos",
      });
      courseLogo = { public_id: upload.public_id, url: upload.secure_url };
    }

    // -------------------------------
    // Upload Syllabus PDF
    // -------------------------------
    let syllabusPdf = {};
    if (req.files?.syllabusPdf?.[0]) {
      const upload = await cloudinary.uploader.upload(req.files.syllabusPdf[0].path, {
        folder: "courses/syllabus",
        resource_type: "raw",
      });
      syllabusPdf = { public_id: upload.public_id, url: upload.secure_url };
    }

    // -------------------------------
    // Parse Overview and upload images
    // -------------------------------
    let parsedOverview = parseJSON(overview);
    if (req.files?.overviewImages?.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.overviewImages.map((img) =>
          cloudinary.uploader.upload(img.path, { folder: "courses/overview" })
        )
      );
      parsedOverview = parsedOverview.map((item, index) => ({
        ...item,
        image: uploadedImages[index]
          ? { public_id: uploadedImages[index].public_id, url: uploadedImages[index].secure_url }
          : item.image,
      }));
    }

    // -------------------------------
    // Parse Why Choose Us and upload images
    // -------------------------------
    let parsedWhyChooseUs = parseJSON(whyChooseUs);
    if (req.files?.whyChooseUsImages?.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.whyChooseUsImages.map((img) =>
          cloudinary.uploader.upload(img.path, { folder: "courses/whyChooseUs" })
        )
      );
      parsedWhyChooseUs = parsedWhyChooseUs.map((item, index) => ({
        ...item,
        image: uploadedImages[index]
          ? { public_id: uploadedImages[index].public_id, url: uploadedImages[index].secure_url }
          : item.image,
      }));
    }

    // -------------------------------
    // Online Course Worth It
    // -------------------------------
    let parsedOnlineCourseWorthIt = parseJSON(onlineCourseWorthIt) || {};
    if (req.files?.onlineCourseWorthItImage?.[0]) {
      const upload = await cloudinary.uploader.upload(req.files.onlineCourseWorthItImage[0].path, {
        folder: "courses/onlineCourseWorthIt",
      });
      parsedOnlineCourseWorthIt.image = { public_id: upload.public_id, url: upload.secure_url };
    }

    // -------------------------------
    // Create Course
    // -------------------------------
    const newCourse = new Course({
      name,
      slug,
      category,
      duration,
      tag,
      specializations: specializations ? parseJSON(specializations) : [],
      overview: parsedOverview,
      whyChooseUs: parsedWhyChooseUs,
      goodThings: parseJSON(goodThings),
      topUniversities: parseJSON(topUniversities),
      keyHighlights: parseJSON(keyHighlights),
      syllabus: parseJSON(syllabus),
      offeredCourses: parseJSON(offeredCourses),
      onlineEligibility: parseJSON(onlineEligibility),
      feeStructureSidebar: parseJSON(feeStructureSidebar),
      detailedFees: parseJSON(detailedFees),
      onlineCourseWorthIt: parsedOnlineCourseWorthIt,
      jobOpportunities: parseJSON(jobOpportunities),
      topRecruiters: parseJSON(topRecruiters),
      courseLogo,
      syllabusPdf,
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
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
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.status(200).json({ success: true, course });
  } catch (error) {
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
    if (!existing)
      return res.status(404).json({ success: false, message: "Not found" });

    const data = req.body;

    // Slug update
    if (data.name && data.name !== existing.name) {
      let baseSlug = slugify(data.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      while (await Course.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter++}`;
      }
      data.slug = slug;
    }

    // Update Course Logo
    if (req.files?.courseLogo?.[0]) {
      if (existing.courseLogo?.public_id)
        await cloudinary.uploader.destroy(existing.courseLogo.public_id);

      const upload = await cloudinary.uploader.upload(req.files.courseLogo[0].path, {
        folder: "courses/logos",
      });
      data.courseLogo = { public_id: upload.public_id, url: upload.secure_url };
    }

    // Update Syllabus PDF
    if (req.files?.syllabusPdf?.[0]) {
      if (existing.syllabusPdf?.public_id)
        await cloudinary.uploader.destroy(existing.syllabusPdf.public_id, { resource_type: "raw" });

      const upload = await cloudinary.uploader.upload(req.files.syllabusPdf[0].path, {
        folder: "courses/syllabus",
        resource_type: "raw",
      });
      data.syllabusPdf = { public_id: upload.public_id, url: upload.secure_url };
    }

    // Update Overview Images
    if (req.files?.overviewImages?.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.overviewImages.map((img) =>
          cloudinary.uploader.upload(img.path, { folder: "courses/overview" })
        )
      );
      const parsedOverview = parseJSON(data.overview);
      data.overview = parsedOverview.map((item, index) => ({
        ...item,
        image: uploadedImages[index]
          ? { public_id: uploadedImages[index].public_id, url: uploadedImages[index].secure_url }
          : item.image,
      }));
    }

    // Update Why Choose Us Images
    if (req.files?.whyChooseUsImages?.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.whyChooseUsImages.map((img) =>
          cloudinary.uploader.upload(img.path, { folder: "courses/whyChooseUs" })
        )
      );
      const parsed = parseJSON(data.whyChooseUs);
      data.whyChooseUs = parsed.map((item, index) => ({
        ...item,
        image: uploadedImages[index]
          ? { public_id: uploadedImages[index].public_id, url: uploadedImages[index].secure_url }
          : item.image,
      }));
    }

    // Update Online Course Worth It Image
    if (req.files?.onlineCourseWorthItImage?.[0]) {
      if (existing.onlineCourseWorthIt?.image?.public_id)
        await cloudinary.uploader.destroy(existing.onlineCourseWorthIt.image.public_id);

      const upload = await cloudinary.uploader.upload(req.files.onlineCourseWorthItImage[0].path, {
        folder: "courses/onlineCourseWorthIt",
      });
      const parsed = parseJSON(data.onlineCourseWorthIt) || {};
      parsed.image = { public_id: upload.public_id, url: upload.secure_url };
      data.onlineCourseWorthIt = parsed;
    }

    // Parse all other JSON fields
    data.specializations = parseJSON(data.specializations);
    data.goodThings = parseJSON(data.goodThings);
    data.topUniversities = parseJSON(data.topUniversities);
    data.keyHighlights = parseJSON(data.keyHighlights);
    data.syllabus = parseJSON(data.syllabus);
    data.offeredCourses = parseJSON(data.offeredCourses);
    data.onlineEligibility = parseJSON(data.onlineEligibility);
    data.feeStructureSidebar = parseJSON(data.feeStructureSidebar);
    data.detailedFees = parseJSON(data.detailedFees);
    data.jobOpportunities = parseJSON(data.jobOpportunities);
    data.topRecruiters = parseJSON(data.topRecruiters);

    const updated = await Course.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    res.status(200).json({ success: true, message: "Course updated", course: updated });
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

    if (course.courseLogo?.public_id)
      await cloudinary.uploader.destroy(course.courseLogo.public_id);

    for (const i of course.overview || [])
      if (i.image?.public_id) await cloudinary.uploader.destroy(i.image.public_id);

    for (const i of course.whyChooseUs || [])
      if (i.image?.public_id) await cloudinary.uploader.destroy(i.image.public_id);

    if (course.onlineCourseWorthIt?.image?.public_id)
      await cloudinary.uploader.destroy(course.onlineCourseWorthIt.image.public_id);

    if (course.syllabusPdf?.public_id)
      await cloudinary.uploader.destroy(course.syllabusPdf.public_id, { resource_type: "raw" });

    await course.deleteOne();

    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// import University from "../models/Admin/University.js";

// /* -------------------------------------------------------------------------- */
// /* 🏫 CREATE a new University                                                  */
// /* -------------------------------------------------------------------------- */
// export const createUniversity = async (req, res) => {
//   try {
//     const { name, description, courses } = req.body;

//     if (!name?.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "University name is required",
//       });
//     }

//     const university = await University.create({
//       name: name.trim(),
//       description: description?.trim() || "",
//       courses: Array.isArray(courses) ? courses.map(c => c.trim()) : [],
//     });

//     res.status(201).json({
//       success: true,
//       message: "University created successfully",
//       data: university,
//     });
//   } catch (error) {
//     console.error("❌ Create University Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* -------------------------------------------------------------------------- */
// /* 📋 GET all Universities                                                     */
// /* -------------------------------------------------------------------------- */
// export const getUniversities = async (req, res) => {
//   try {
//     const universities = await University.find().sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       count: universities.length,
//       data: universities,
//     });
//   } catch (error) {
//     console.error("❌ Get Universities Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* -------------------------------------------------------------------------- */
// /* 🔍 GET a single University by ID                                            */
// /* -------------------------------------------------------------------------- */
// export const getUniversityById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const university = await University.findById(id);

//     if (!university) {
//       return res.status(404).json({
//         success: false,
//         message: "University not found",
//       });
//     }

//     res.status(200).json({ success: true, data: university });
//   } catch (error) {
//     console.error("❌ Get University By ID Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* -------------------------------------------------------------------------- */
// /* ✏️ UPDATE a University                                                      */
// /* -------------------------------------------------------------------------- */
// export const updateUniversity = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description, courses } = req.body;

//     const updatedUni = await University.findByIdAndUpdate(
//       id,
//       {
//         ...(name && { name: name.trim() }),
//         ...(description && { description: description.trim() }),
//         ...(Array.isArray(courses) && { courses }),
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updatedUni) {
//       return res.status(404).json({
//         success: false,
//         message: "University not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "University updated successfully",
//       data: updatedUni,
//     });
//   } catch (error) {
//     console.error("❌ Update University Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* -------------------------------------------------------------------------- */
// /* 🗑️ DELETE a University                                                      */
// /* -------------------------------------------------------------------------- */
// export const deleteUniversity = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedUni = await University.findByIdAndDelete(id);

//     if (!deletedUni) {
//       return res.status(404).json({
//         success: false,
//         message: "University not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "University deleted successfully",
//     });
//   } catch (error) {
//     console.error("❌ Delete University Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



import University from "../models/Admin/University.js";

/* -------------------- ADD NEW UNIVERSITY -------------------- */
export const addUniversity = async (req, res) => {
  try {
    const { name, description, universityImage, courses } = req.body;

    const newUniversity = new University({
      name,
      description,
      universityImage,
      courses,
    });

    await newUniversity.save();

    res.status(201).json({
      success: true,
      message: "University added successfully",
      data: newUniversity,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------- ADD COURSE TO EXISTING UNIVERSITY -------------------- */
export const addCourseToUniversity = async (req, res) => {
  try {
    const { id } = req.params; // university ID
    const { name, logo, duration } = req.body;

    const university = await University.findById(id);
    if (!university)
      return res.status(404).json({ success: false, message: "University not found" });

    // Push new course directly into the university
    university.courses.push({ name, logo, duration });
    await university.save();

    res.status(200).json({
      success: true,
      message: "Course added successfully to university",
      data: university,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------- GET UNIVERSITIES -------------------- */
export const getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: universities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import Course from "../models/Admin/Course.js"; // ✅ Mongoose model

// ✅ Create a new course
export const createCourse = async (req, res) => {
  try {
    const { category, name, duration, tag } = req.body;

    if (!category || !name || !duration) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const newCourse = new Course({ category, name, duration, tag });
    await newCourse.save();

    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error("❌ Create Course Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get all courses OR filtered by category
export const getCourses = async (req, res) => {
  try {
    const { category, tag, name } = req.query;

    // 🔹 Build dynamic filter
    const filter = {};

    if (category && category !== "ALL") filter.category = category;
    if (tag) filter.tag = { $regex: tag, $options: "i" };
    if (name) filter.name = { $regex: name, $options: "i" };

    // 🔹 Fetch from DB
    const courses = await Course.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("❌ Get Courses Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete a course by ID
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: "Course deleted successfully." });
  } catch (error) {
    console.error("❌ Delete Course Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

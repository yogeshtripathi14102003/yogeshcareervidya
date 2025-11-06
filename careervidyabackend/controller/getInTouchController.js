import GetInTouch from "../models/Admin/getInTouch.js";

// ✅ Create new GetInTouch entry
export const createGetInTouch = async (req, res) => {
  try {
    const { name, city, email, mobile, message } = req.body;

    if (!name || !city || !email || !mobile || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQuery = await GetInTouch.create({
      name,
      city,
      email,
      mobile,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Query submitted successfully!",
      data: newQuery,
    });
  } catch (error) {
    console.error("❌ Error creating GetInTouch:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get all queries
export const getAllGetInTouch = async (req, res) => {
  try {
    const data = await GetInTouch.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("❌ Error fetching GetInTouch:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Delete query by ID
export const deleteGetInTouch = async (req, res) => {
  try {
    const { id } = req.params;
    await GetInTouch.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting GetInTouch:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

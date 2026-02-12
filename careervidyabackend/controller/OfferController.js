import Content from "../models/Admin/OfferModel.js";

/* CREATE (Offer / Subsidy / Brochure) */
export const createContent = async (req, res) => {
  try {
    const data = await Content.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* GET ALL CONTENT */
export const getAllContent = async (req, res) => {
  try {
    const data = await Content.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* GET CONTENT BY TYPE (offer / subsidy / brochure) */
export const getByType = async (req, res) => {
  try {
    const data = await Content.find({ type: req.params.type }).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* GET CONTENT BY ID */
export const getContentById = async (req, res) => {
  try {
    const data = await Content.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Content not found" });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* UPDATE CONTENT */
export const updateContent = async (req, res) => {
  try {
    const data = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ success: false, message: "Content not found" });
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* DELETE CONTENT */
export const deleteContent = async (req, res) => {
  try {
    const data = await Content.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Content not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

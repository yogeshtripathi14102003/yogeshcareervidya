import Slot from "../models/Admin/Slot.js";

// ➕ 1. CREATE: एडमिन खाली स्लॉट ऐड करेगा (जैसे तारीख और समय)
export const addSlot = async (req, res) => {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ success: false, message: "Date and Time are required" });
    }

    const existingSlot = await Slot.findOne({ date, time });
    if (existingSlot) {
      return res.status(400).json({ success: false, message: "This slot already exists" });
    }

    const newSlot = await Slot.create({ date, time });
    res.status(201).json({ success: true, message: "Free slot added successfully", data: newSlot });
  } catch (error) {
    console.error("Error adding slot:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 📋 2. READ (Admin): एडमिन को सारे स्लॉट्स और छात्रों की पूरी डिटेल्स दिखेंगी
export const getAllSlotsForAdmin = async (req, res) => {
  try {
    const slots = await Slot.find().sort({ date: 1, time: 1 });
    res.status(200).json({ success: true, data: slots });
  } catch (error) {
    console.error("Error fetching admin slots:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 👀 3. READ (User/Frontend): फ्रंटएंड पर दिखाने के लिए केवल खाली (Free) स्लॉट्स
export const getAvailableSlotsForUsers = async (req, res) => {
  try {
    const freeSlots = await Slot.find({ isBooked: false }).sort({ date: 1, time: 1 });
    res.status(200).json({ success: true, data: freeSlots });
  } catch (error) {
    console.error("Error fetching free slots:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🔒 4. BOOK SLOT: छात्र फ्रंटएंड से स्लॉट सिलेक्ट करके अपनी पूरी डिटेल्स सबमिट करेगा
export const bookSlotDirectly = async (req, res) => {
  try {
    const { id } = req.params; // स्लॉट की ID URL से आएगी
    const { studentName, studentEmail, studentMobile, course, branch, description } = req.body;

    // वैलिडेशन: बुकिंग के समय छात्र की बेसिक जानकारी ज़रूरी है
    if (!studentName || !studentEmail || !studentMobile || !course || !branch) {
      return res.status(400).json({ success: false, message: "Please fill all required student details" });
    }

    const slot = await Slot.findById(id);
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });
    if (slot.isBooked) return res.status(400).json({ success: false, message: "This slot is already booked" });

    // स्लॉट में छात्र का सारा डेटा सेव करें और बुक मार्क करें
    slot.isBooked = true;
    slot.studentName = studentName;
    slot.studentEmail = studentEmail;
    slot.studentMobile = studentMobile;
    slot.course = course;
    slot.branch = branch;
    slot.description = description || "";

    await slot.save();

    res.status(200).json({
      success: true,
      message: "Your Counseling Slot has been booked successfully!",
      data: slot,
    });
  } catch (error) {
    console.error("Error booking slot:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✏️ 5. UPDATE (Admin): एडमिन किसी भी स्लॉट का डेटा मैन्युअली बदल सकता है
export const updateSlotByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body; // एडमिन जो भी फील्ड भेजेगा वो अपडेट हो जाएगा

    const slot = await Slot.findByIdAndUpdate(id, updatedData, { new: true });
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });

    res.status(200).json({ success: true, message: "Slot updated successfully", data: slot });
  } catch (error) {
    console.error("Error updating slot:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🗑️ 6. DELETE (Admin): एडमिन किसी स्लॉट को पूरी तरह डिलीट कर सकता है
export const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await Slot.findByIdAndDelete(id);
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });

    res.status(200).json({ success: true, message: "Slot deleted successfully from system" });
  } catch (error) {
    console.error("Error deleting slot:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
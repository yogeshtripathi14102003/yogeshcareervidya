import express from "express";
import {
  addSlot,
  getAllSlotsForAdmin,
  getAvailableSlotsForUsers,
  bookSlotDirectly,
  updateSlotByAdmin,
  deleteSlot,
} from "../controller/slotController.js";

const router = express.Router();

// स्टूडेंट/यूजर एंडपॉइंट्स
router.get("/available", getAvailableSlotsForUsers); // फ्रंटएंड कैलेंडर पर सिर्फ फ्री स्लॉट दिखाने के लिए
router.put("/book/:id", bookSlotDirectly);            // छात्र द्वारा पूरी डिटेल्स के साथ स्लॉट बुक करने के लिए

// एडमिन एंडपॉइंट्स (CRUD)
router.post("/add", addSlot);                        // एडमिन द्वारा नया टाइम स्लॉट डालने के लिए
router.get("/admin/all", getAllSlotsForAdmin);        // एडमिन डैशबोर्ड पर पूरी लिस्ट (छात्रों की डिटेल्स के साथ) देखने के लिए
router.put("/admin/update/:id", updateSlotByAdmin);   // एडमिन द्वारा स्लॉट मॉडिफाई या वापस फ्री करने के लिए
router.delete("/admin/delete/:id", deleteSlot);      // स्लॉट डिलीट करने के लिए

export default router;

import express from "express";
import multer from "multer";
import {
    createUniversity,
    getUniversities,
    getUniversityById,
    getUniversityBySlug,
    updateUniversity,
    deleteUniversity,
    searchUniversities,
} from "../controller/universityController.js";

const router = express.Router();

/* ===============================
   MULTER CONFIG (Memory Storage)
================================ */
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

/* ===============================
   FILE FIELDS CONFIG
================================
 This must match frontend FormData keys
*/
const universityUploadFields = upload.fields([
    { name: "universityImage", maxCount: 1 },
    { name: "certificateImage", maxCount: 1 },

    /* ===== BACKGROUND IMAGE (ADDED) ===== */
    { name: "backgroundImage", maxCount: 1 },

    // Dynamic approvals logos
    { name: "approvals[0][logo]" },
    { name: "approvals[1][logo]" },
    { name: "approvals[2][logo]" },
    { name: "approvals[3][logo]" },
    { name: "approvals[4][logo]" },

    // Dynamic courses logos
    { name: "courses[0][logo]" },
    { name: "courses[1][logo]" },
    { name: "courses[2][logo]" },
    { name: "courses[3][logo]" },
    { name: "courses[4][logo]" }
]);

/* ===============================
   ROUTES
================================ */

// CREATE
router.post("/", universityUploadFields, createUniversity);

// GET ALL
router.get("/", getUniversities);

// GET BY SLUG (must be above :id)
router.get("/slug/:slug", getUniversityBySlug);

// GET BY ID
router.get("/:id", getUniversityById);

// UPDATE
router.put("/:id", universityUploadFields, updateUniversity);

// DELETE
router.delete("/:id", deleteUniversity);

router.get('/search/all', searchUniversities);
export default router;

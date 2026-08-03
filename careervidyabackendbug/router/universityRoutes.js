import express from "express";
import multer from "multer";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
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
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const universityUploadFields = upload.fields([
    { name: "universityImage", maxCount: 1 },
    { name: "certificateImage", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
    { name: "approvals[0][logo]" },
    { name: "approvals[1][logo]" },
    { name: "approvals[2][logo]" },
    { name: "approvals[3][logo]" },
    { name: "approvals[4][logo]" },
    { name: "courses[0][logo]" },
    { name: "courses[1][logo]" },
    { name: "courses[2][logo]" },
    { name: "courses[3][logo]" },
    { name: "courses[4][logo]" }
]);

/* ---------- Public (site display) ---------- */
router.get("/", getUniversities);
router.get("/slug/:slug", getUniversityBySlug);
router.get("/search/all", searchUniversities);
router.get("/:id", getUniversityById);

/* ---------- Admin only ---------- */
router.post("/", adminOnly, universityUploadFields, createUniversity);
router.put("/:id", adminOnly, universityUploadFields, updateUniversity);
router.delete("/:id", adminOnly, deleteUniversity);

export default router;

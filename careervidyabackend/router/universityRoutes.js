
// // routes/universityRoutes.js
// // routes/universityRoutes.js (No changes needed)

// import express from 'express';
// import multer from 'multer';
// import { 
//     createUniversity, 
//     getUniversities,
//     getUniversityById,
//     updateUniversity,
//     deleteUniversity
// } from '../controller/universityController.js'; 

// const router = express.Router();

// // Configure Multer 
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Define an array of fields to handle all potential file uploads
// const universityUploadFields = [
//     { name: 'universityImage', maxCount: 1 },
//     { name: 'certificateImage', maxCount: 1 },
//     ...Array.from({ length: 10 }, (_, i) => ({ name: `approvals[${i}][logo]`, maxCount: 1 })),
//     ...Array.from({ length: 10 }, (_, i) => ({ name: `courses[${i}][logo]`, maxCount: 1 })),
// ];


// // POST (C - Create)
// router.post(
//     '/', 
//     upload.fields(universityUploadFields), 
//     createUniversity
// );

// // GET (R - Read All)
// router.get('/', getUniversities);

// // GET (R - Read One), PUT (U - Update), DELETE (D - Delete)
// router
//     .route('/:id')
//     .get(getUniversityById)
//     .put(upload.fields(universityUploadFields), updateUniversity)
//     .delete(deleteUniversity);


// export default router;

import express from "express";
import multer from "multer";
import {
    createUniversity,
    getUniversities,
    getUniversityById,
    getUniversityBySlug,
    updateUniversity,
    deleteUniversity
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

export default router;

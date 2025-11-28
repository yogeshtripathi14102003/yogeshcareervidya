
// routes/universityRoutes.js
// routes/universityRoutes.js (No changes needed)

import express from 'express';
import multer from 'multer';
import { 
    createUniversity, 
    getUniversities,
    getUniversityById,
    updateUniversity,
    deleteUniversity
} from '../controller/universityController.js'; 

const router = express.Router();

// Configure Multer 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define an array of fields to handle all potential file uploads
const universityUploadFields = [
    { name: 'universityImage', maxCount: 1 },
    { name: 'certificateImage', maxCount: 1 },
    ...Array.from({ length: 10 }, (_, i) => ({ name: `approvals[${i}][logo]`, maxCount: 1 })),
    ...Array.from({ length: 10 }, (_, i) => ({ name: `courses[${i}][logo]`, maxCount: 1 })),
];


// POST (C - Create)
router.post(
    '/', 
    upload.fields(universityUploadFields), 
    createUniversity
);

// GET (R - Read All)
router.get('/', getUniversities);

// GET (R - Read One), PUT (U - Update), DELETE (D - Delete)
router
    .route('/:id')
    .get(getUniversityById)
    .put(upload.fields(universityUploadFields), updateUniversity)
    .delete(deleteUniversity);


export default router;
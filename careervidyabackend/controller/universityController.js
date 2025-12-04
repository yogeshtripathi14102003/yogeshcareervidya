// // controllers/universityController.js

// import University from '../models/Admin/University.js';
// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';
// dotenv.config();

// // --- Cloudinary Configuration ---
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // --- Cloudinary Upload Function ---
// const uploadToCloudinary = async (fileBuffer, folder) => {
//     return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//             { folder: `university_assets/${folder}` },
//             (error, result) => {
//                 if (error) {
//                     console.error("Cloudinary Upload Error:", error);
//                     return reject(error);
//                 }
//                 resolve(result.secure_url);
//             }
//         );
//         stream.end(fileBuffer); 
//     });
// };

// // --- Upload Service Abstraction ---
// const UploadService = { 
//     uploadFile: async (file, folder) => {
//         return uploadToCloudinary(file.buffer, folder);
//     },
//     deleteFile: async (url) => {
//         if (!url) return true;
//         try {
//             console.log(`Attempting to delete asset at URL: ${url}`);
//             // In production, implement actual Cloudinary deletion logic here
//             return true;
//         } catch (error) {
//             console.error("Cloudinary Deletion Error:", error);
//             return false;
//         }
//     }
// };

// // --- NEW HELPER FUNCTION TO FIX THE ERROR ---
// const getFlattenedFiles = (filesObject) => {
//     if (!filesObject || typeof filesObject !== 'object') {
//         return [];
//     }
//     // Object.values returns an array of all file arrays. .flat() combines them into a single array.
//     return Object.values(filesObject).flat();
// };


// // --- Helper function to handle multiple file uploads and prepare data ---
// const handleUniversityData = async (body, files) => {
//     const uploadPromises = [];
//     let universityImageUrl = body.universityImage_old;
//     let certificateImageUrl = body.certificateImage_old;

//     // 1. Handle Single File Uploads
//     // NOTE: 'files' is now guaranteed to be a flat array thanks to getFlattenedFiles()
//     const universityImageFile = files.find(f => f.fieldname === 'universityImage');
//     const certificateImageFile = files.find(f => f.fieldname === 'certificateImage');

//     if (universityImageFile) {
//         uploadPromises.push(
//             UploadService.uploadFile(universityImageFile, 'images').then(url => universityImageUrl = url)
//         );
//     }
//     if (certificateImageFile) {
//         uploadPromises.push(
//             UploadService.uploadFile(certificateImageFile, 'certificates').then(url => certificateImageUrl = url)
//         );
//     }

//     // 2. Handle Dynamic File Uploads (Approvals and Course Logos)
//     const approvalsData = JSON.parse(body.approvals || '[]');
//     const coursesData = JSON.parse(body.courses || '[]');
    
//     const approvalsWithUrls = approvalsData.map((approval, index) => {
//         const logoFile = files.find(f => f.fieldname === `approvals[${index}][logo]`);
//         if (logoFile) {
//             const promise = UploadService.uploadFile(logoFile, 'logos').then(url => ({ ...approval, logo: url }));
//             uploadPromises.push(promise);
//             return promise; 
//         }
//         return Promise.resolve(approval); 
//     });

//     const coursesWithUrls = coursesData.map((course, index) => {
//         const logoFile = files.find(f => f.fieldname === `courses[${index}][logo]`);
//         if (logoFile) {
//             const promise = UploadService.uploadFile(logoFile, 'logos').then(url => ({ ...course, logo: url }));
//             uploadPromises.push(promise);
//             return promise; 
//         }
//         return Promise.resolve(course); 
//     });
    
//     // 3. Wait for all uploads
//     const allResults = await Promise.all([
//         ...uploadPromises, 
//         ...approvalsWithUrls, 
//         ...coursesWithUrls
//     ]);

//     const finalApprovals = allResults.slice(uploadPromises.length, uploadPromises.length + approvalsData.length);
//     const finalCourses = allResults.slice(uploadPromises.length + approvalsData.length);

//     // 4. Prepare Final University Data object
//     const universityData = {
//         name: body.name,
//         description: body.description,
//         universityImage: universityImageUrl,
//         youtubeLink: body.youtubeLink,
//         shareDescription: body.shareDescription,
//         cardDescription: body.cardDescription,
//         highlights: {
//             heading: body.heading,
//             points: JSON.parse(body.points || '[]'),
//         },
//         facts: {
//             factsHeading: body.factsHeading,
//             factsSubHeading: body.factsSubHeading,
//             factsPoints: JSON.parse(body.factsPoints || '[]'),
//         },
//         approvals: finalApprovals,
//         recognition: {
//             recognitionHeading: body.recognitionHeading,
//             recognitionDescription: body.recognitionDescription,
//             recognitionPoints: JSON.parse(body.recognitionPoints || '[]'),
//             certificateImage: certificateImageUrl,
//         },
//         admission: {
//             admissionHeading: body.admissionHeading,
//             admissionSubHeading: body.admissionSubHeading,
//             admissionDescription: body.admissionDescription,
//             admissionPoints: JSON.parse(body.admissionPoints || '[]'),
//         },
//         courses: finalCourses,
//     };

//     return universityData;
// }


// // --- Exported Functions (CRUD Operations) ---

// export const createUniversity = async (req, res, next) => {
//     try {
//         // FIX: Ensure files is a flattened array
//         const files = getFlattenedFiles(req.files);
//         const universityData = await handleUniversityData(req.body, files);
//         const university = await University.create(universityData);
//         res.status(201).json({ success: true, message: 'University entry created successfully!', data: university });
//     } catch (error) {
//         console.error("Error creating university:", error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// export const getUniversities = async (req, res, next) => {
//     try {
//         const universities = await University.find();
//         res.status(200).json({ success: true, count: universities.length, data: universities });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// export const getUniversityById = async (req, res, next) => {
//     try {
//         const university = await University.findById(req.params.id);
//         if (!university) {
//             return res.status(404).json({ success: false, message: 'University not found' });
//         }
//         res.status(200).json({ success: true, data: university });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// export const updateUniversity = async (req, res, next) => {
//     try {
//         const existingUniversity = await University.findById(req.params.id);
//         if (!existingUniversity) {
//             return res.status(404).json({ success: false, message: 'University not found' });
//         }
        
//         req.body.universityImage_old = existingUniversity.universityImage;
//         req.body.certificateImage_old = existingUniversity.recognition.certificateImage;

//         // FIX: Ensure files is a flattened array
//         const files = getFlattenedFiles(req.files);
//         const updatedData = await handleUniversityData(req.body, files);
        
//         const university = await University.findByIdAndUpdate(
//             req.params.id, 
//             updatedData, 
//             { new: true, runValidators: true }
//         );

//         res.status(200).json({ success: true, message: 'University updated successfully!', data: university });
//     } catch (error) {
//         console.error("Error updating university:", error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// export const deleteUniversity = async (req, res, next) => {
//     try {
//         const university = await University.findByIdAndDelete(req.params.id);
//         if (!university) {
//             return res.status(404).json({ success: false, message: 'University not found' });
//         }
        
//         // Add Cloudinary Deletion logic here if needed
        
//         res.status(200).json({ success: true, message: 'University deleted successfully!', data: {} });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// controllers/universityController.js
import University from '../models/Admin/University.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// CLOUDINARY CONFIG
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload File
const uploadToCloudinary = async (buffer, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder },
            (err, result) => {
                if (err) return reject(err);
                resolve(result.secure_url);
            }
        ).end(buffer);
    });
};

// Upload Service
const UploadService = {
    uploadFile: (file, folder) => uploadToCloudinary(file.buffer, `university_assets/${folder}`),
    deleteFile: async () => true
};

// FIX: CORRECT FILE FLATTEN FUNCTION
const getFlattenedFiles = (filesObject) => {
    if (!filesObject) return [];

    const result = [];

    Object.keys(filesObject).forEach((key) => {
        filesObject[key].forEach(file => {
            file.fieldname = key; // IMPORTANT FIX
            result.push(file);
        });
    });

    return result;
};

// MAIN HANDLER — UNIVERSAL FUNCTION
const handleUniversityData = async (body, files) => {
    let universityImageUrl = body.universityImage_old;
    let certificateImageUrl = body.certificateImage_old;

    const uploadTasks = [];

    // University main image
    const uniImage = files.find(f => f.fieldname === "universityImage");
    if (uniImage) uploadTasks.push(
        UploadService.uploadFile(uniImage, "images").then(url => universityImageUrl = url)
    );

    // Certificate Image
    const certImage = files.find(f => f.fieldname === "certificateImage");
    if (certImage) uploadTasks.push(
        UploadService.uploadFile(certImage, "certificates").then(url => certificateImageUrl = url)
    );

    // JSON parse safely
    const approvals = JSON.parse(String(body.approvals || "[]"));
    const courses = JSON.parse(String(body.courses || "[]"));

    // APPROVAL LOGOS
    const finalApprovals = await Promise.all(
        approvals.map((item, index) => {
            const file = files.find(f => f.fieldname === `approvals[${index}][logo]`);
            if (file) {
                return UploadService.uploadFile(file, "logos").then(url => ({
                    ...item,
                    logo: url
                }));
            }
            return item;
        })
    );

    // COURSES LOGOS
    const finalCourses = await Promise.all(
        courses.map((item, index) => {
            const file = files.find(f => f.fieldname === `courses[${index}][logo]`);
            if (file) {
                return UploadService.uploadFile(file, "logos").then(url => ({
                    ...item,
                    logo: url
                }));
            }
            return item;
        })
    );

    return {
        name: body.name,
        slug: body.name.toLowerCase().replace(/\s+/g, '-'), // 🔹 auto-generate slug
        description: body.description,
        universityImage: universityImageUrl,
        youtubeLink: body.youtubeLink,
        shareDescription: body.shareDescription,
        cardDescription: body.cardDescription,

        highlights: {
            heading: body.heading,
            points: JSON.parse(String(body.points || "[]"))
        },

        facts: {
            factsHeading: body.factsHeading,
            factsSubHeading: body.factsSubHeading,
            factsPoints: JSON.parse(String(body.factsPoints || "[]"))
        },

        approvals: finalApprovals,

        recognition: {
            recognitionHeading: body.recognitionHeading,
            recognitionDescription: body.recognitionDescription,
            recognitionPoints: JSON.parse(String(body.recognitionPoints || "[]")),
            certificateImage: certificateImageUrl
        },

        admission: {
            admissionHeading: body.admissionHeading,
            admissionSubHeading: body.admissionSubHeading,
            admissionDescription: body.admissionDescription,
            admissionPoints: JSON.parse(String(body.admissionPoints || "[]"))
        },

        courses: finalCourses
    };
};

// CREATE
export const createUniversity = async (req, res) => {
    try {
        const files = getFlattenedFiles(req.files);
        const data = await handleUniversityData(req.body, files);
        const uni = await University.create(data);

        res.status(201).json({ success: true, data: uni });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// GET ALL
export const getUniversities = async (req, res) => {
    const unis = await University.find();
    res.json({ success: true, data: unis });
};

// GET ONE BY ID
export const getUniversityById = async (req, res) => {
    const uni = await University.findById(req.params.id);
    if (!uni) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: uni });
};

// GET ONE BY SLUG
export const getUniversityBySlug = async (req, res) => {
    try {
        const uni = await University.findOne({ slug: req.params.slug });
        if (!uni) return res.status(404).json({ success: false, message: "Not found" });

        res.json({ success: true, data: uni });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// UPDATE
export const updateUniversity = async (req, res) => {
    try {
        const oldUni = await University.findById(req.params.id);

        req.body.universityImage_old = oldUni.universityImage;
        req.body.certificateImage_old = oldUni.recognition.certificateImage;

        const files = getFlattenedFiles(req.files);
        const updated = await handleUniversityData(req.body, files);

        const saved = await University.findByIdAndUpdate(req.params.id, updated, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: saved });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// DELETE
export const deleteUniversity = async (req, res) => {
    await University.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
};

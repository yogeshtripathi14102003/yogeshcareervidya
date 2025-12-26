

// import University from '../models/Admin/University.js';
// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';
// dotenv.config();

// // CLOUDINARY CONFIG
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // --- Helpers ---

// const uploadToCloudinary = async (buffer, folder) => {
//     return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//             { folder },
//             (err, result) => {
//                 if (err) return reject(err);
//                 resolve(result.secure_url);
//             }
//         );
//         stream.end(buffer);
//     });
// };

// const getFlattenedFiles = (filesObject) => {
//     if (!filesObject) return [];
//     const result = [];
//     Object.keys(filesObject).forEach((key) => {
//         filesObject[key].forEach(file => {
//             file.fieldname = key; 
//             result.push(file);
//         });
//     });
//     return result;
// };

// // --- Main Data Handler ---

// const handleUniversityData = async (body, files, existingData = null) => {
//     // Agar existingData hai (Update case), toh purani images use karo, warna null
//     let universityImageUrl = existingData ? existingData.universityImage : null;
//     let certificateImageUrl = (existingData && existingData.recognition) ? existingData.recognition.certificateImage : null;

//     // 1. Check & Upload University main image
//     const uniImage = files.find(f => f.fieldname === "universityImage");
//     if (uniImage) {
//         universityImageUrl = await uploadToCloudinary(uniImage.buffer, "university_assets/images");
//     }

//     // 2. Check & Upload Certificate Image
//     const certImage = files.find(f => f.fieldname === "certificateImage");
//     if (certImage) {
//         certificateImageUrl = await uploadToCloudinary(certImage.buffer, "university_assets/certificates");
//     }

//     // JSON Parse Safely (Frontend se arrays string ban kar aate hain)
//     const approvals = JSON.parse(String(body.approvals || "[]"));
//     const courses = JSON.parse(String(body.courses || "[]"));

//     // 3. Handle Approvals (Keep old logo if new one isn't uploaded)
//     const finalApprovals = await Promise.all(
//         approvals.map(async (item, index) => {
//             const file = files.find(f => f.fieldname === `approvals[${index}][logo]`);
//             if (file) {
//                 const url = await uploadToCloudinary(file.buffer, "university_assets/logos");
//                 return { ...item, logo: url };
//             }
//             // Agar file nahi hai, toh item ka purana logo hi rehne do
//             return item;
//         })
//     );

//     // 4. Handle Courses (Keep old logo if new one isn't uploaded)
//     const finalCourses = await Promise.all(
//         courses.map(async (item, index) => {
//             const file = files.find(f => f.fieldname === `courses[${index}][logo]`);
//             if (file) {
//                 const url = await uploadToCloudinary(file.buffer, "university_assets/logos");
//                 return { ...item, logo: url };
//             }
//             return item;
//         })
//     );

//     return {
//         name: body.name,
//         description: body.description,
//         universityImage: universityImageUrl,
//         youtubeLink: body.youtubeLink,
//         shareDescription: body.shareDescription,
//         cardDescription: body.cardDescription,
//         highlights: {
//             heading: body.heading,
//             points: JSON.parse(String(body.points || "[]"))
//         },
//         facts: {
//             factsHeading: body.factsHeading,
//             factsSubHeading: body.factsSubHeading,
//             factsPoints: JSON.parse(String(body.factsPoints || "[]"))
//         },
//         approvals: finalApprovals,
//         recognition: {
//             recognitionHeading: body.recognitionHeading,
//             recognitionDescription: body.recognitionDescription,
//             recognitionPoints: JSON.parse(String(body.recognitionPoints || "[]")),
//             certificateImage: certificateImageUrl
//         },
//         admission: {
//             admissionHeading: body.admissionHeading,
//             admissionSubHeading: body.admissionSubHeading,
//             admissionDescription: body.admissionDescription,
//             admissionPoints: JSON.parse(String(body.admissionPoints || "[]"))
//         },
//         courses: finalCourses
//     };
// };

// // --- Controller Methods ---

// // 1. CREATE
// export const createUniversity = async (req, res) => {
//     try {
//         const files = getFlattenedFiles(req.files);
//         const data = await handleUniversityData(req.body, files);
//         const uni = await University.create(data);
//         res.status(201).json({ success: true, data: uni });
//     } catch (err) {
//         console.error("Create Error:", err);
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// // 2. UPDATE (Sab kuchh safe rakhta hai)
// export const updateUniversity = async (req, res) => {
//     try {
//         const existingUni = await University.findById(req.params.id);
//         if (!existingUni) return res.status(404).json({ success: false, message: "Not found" });

//         const files = getFlattenedFiles(req.files);
//         // existingUni pass karne se purani images delete nahi hongi agar nayi nahi aayi toh
//         const updatedData = await handleUniversityData(req.body, files, existingUni);

//         const saved = await University.findByIdAndUpdate(req.params.id, updatedData, {
//             new: true,
//             runValidators: true
//         });

//         res.json({ success: true, data: saved });
//     } catch (err) {
//         console.error("Update Error:", err);
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// // 3. GET ALL
// export const getUniversities = async (req, res) => {
//     try {
//         const unis = await University.find().sort({ createdAt: -1 });
//         res.json({ success: true, data: unis });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// // 4. GET BY SLUG
// export const getUniversityBySlug = async (req, res) => {
//     try {
//         const uni = await University.findOne({ slug: req.params.slug });
//         if (!uni) return res.status(404).json({ success: false, message: "Not found" });
//         res.json({ success: true, data: uni });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// // 5. GET BY ID
// export const getUniversityById = async (req, res) => {
//     try {
//         const uni = await University.findById(req.params.id);
//         if (!uni) return res.status(404).json({ success: false, message: "Not found" });
//         res.json({ success: true, data: uni });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// // 6. DELETE
// export const deleteUniversity = async (req, res) => {
//     try {
//         await University.findByIdAndDelete(req.params.id);
//         res.json({ success: true, message: "Deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };


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

// --- Helpers ---

const uploadToCloudinary = async (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (err, result) => {
                if (err) return reject(err);
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};

const getFlattenedFiles = (filesObject) => {
    if (!filesObject) return [];
    const result = [];
    Object.keys(filesObject).forEach((key) => {
        filesObject[key].forEach(file => {
            file.fieldname = key;
            result.push(file);
        });
    });
    return result;
};

// --- Main Data Handler ---

const handleUniversityData = async (body, files, existingData = null) => {

    // Existing images safe rakho (UPDATE case)
    let universityImageUrl = existingData ? existingData.universityImage : null;
    let certificateImageUrl = existingData?.recognition?.certificateImage || null;
    let backgroundImageUrl = existingData?.background?.backgroundImage || null;

    // 1. University Image
    const uniImage = files.find(f => f.fieldname === "universityImage");
    if (uniImage) {
        universityImageUrl = await uploadToCloudinary(
            uniImage.buffer,
            "university_assets/images"
        );
    }

    // 2. Certificate Image
    const certImage = files.find(f => f.fieldname === "certificateImage");
    if (certImage) {
        certificateImageUrl = await uploadToCloudinary(
            certImage.buffer,
            "university_assets/certificates"
        );
    }

    // 3. Background Image
    const bgImage = files.find(f => f.fieldname === "backgroundImage");
    if (bgImage) {
        backgroundImageUrl = await uploadToCloudinary(
            bgImage.buffer,
            "university_assets/backgrounds"
        );
    }

    // JSON Parse
    const approvals = JSON.parse(String(body.approvals || "[]"));
    const courses = JSON.parse(String(body.courses || "[]"));

    // 4. Approvals
    const finalApprovals = await Promise.all(
        approvals.map(async (item, index) => {
            const file = files.find(
                f => f.fieldname === `approvals[${index}][logo]`
            );
            if (file) {
                const url = await uploadToCloudinary(
                    file.buffer,
                    "university_assets/logos"
                );
                return { ...item, logo: url };
            }
            return item;
        })
    );

    // 5. Courses - Yahan hum manually enter ki gayi fees aur details ko save kar rahe hain
    const finalCourses = await Promise.all(
        courses.map(async (item, index) => {
            // Check if there's a new logo file for this specific course
            const file = files.find(
                f => f.fieldname === `courses[${index}][logo]`
            );
            
            let logoUrl = item.logo || null;

            if (file) {
                logoUrl = await uploadToCloudinary(
                    file.buffer,
                    "university_assets/logos"
                );
            }

            // Database Schema ke according data return ho raha hai
            return { 
                name: item.name || "", 
                duration: item.duration || "N/A",
                logo: logoUrl, 
                fees: item.fees || "",       // User ne jo type kiya form mein
                details: item.details || ""  // User ne jo type kiya form mein
            };
        })
    );

    // FINAL DATA RETURN
    return {
        name: body.name,
        description: body.description,
        universityImage: universityImageUrl,
        youtubeLink: body.youtubeLink,
        shareDescription: body.shareDescription,
        cardDescription: body.cardDescription,

        background: {
            backgroundImage: backgroundImageUrl,
            backgroundDescription: body.backgroundDescription || ""
        },

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

// --- Controller Methods ---

export const createUniversity = async (req, res) => {
    try {
        const files = getFlattenedFiles(req.files);
        const data = await handleUniversityData(req.body, files);
        const uni = await University.create(data);
        res.status(201).json({ success: true, data: uni });
    } catch (err) {
        console.error("Create Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

export const updateUniversity = async (req, res) => {
    try {
        const existingUni = await University.findById(req.params.id);
        if (!existingUni)
            return res.status(404).json({ success: false, message: "Not found" });

        const files = getFlattenedFiles(req.files);
        const updatedData = await handleUniversityData(
            req.body,
            files,
            existingUni
        );

        const saved = await University.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        res.json({ success: true, data: saved });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getUniversities = async (req, res) => {
    try {
        const unis = await University.find().sort({ createdAt: -1 });
        res.json({ success: true, data: unis });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getUniversityBySlug = async (req, res) => {
    try {
        const uni = await University.findOne({ slug: req.params.slug });
        if (!uni)
            return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: uni });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getUniversityById = async (req, res) => {
    try {
        const uni = await University.findById(req.params.id);
        if (!uni)
            return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: uni });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const deleteUniversity = async (req, res) => {
    try {
        await University.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
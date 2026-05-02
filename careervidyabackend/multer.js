


import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./config/cloudinary.js";

const createUploader = ({
  folder = "applications",
  maxFileSizeMB = 20,
  maxFiles = 5,
} = {}) => {

  const allowedExtensions = {
    resume: ["pdf", "doc", "docx"],
    additionalDocument: ["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"],
    image: ["jpg", "jpeg", "png", "webp"],
    syllabusPdf: ["pdf"], // ✅ NEW (explicit)
  };

  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const ext = file.originalname.split(".").pop().toLowerCase();
      const baseName = file.originalname
        .replace(/\.[^/.]+$/, "")
        .replace(/\s+/g, "-");

      // ===============================
      // 📄 RAW FILES (PDF / DOC)
      // ===============================
      if (
        file.fieldname === "syllabusPdf" ||
        ext === "pdf" ||
        ext === "doc" ||
        ext === "docx"
      ) {
        return {
          folder: `${folder}/documents`,
          public_id: `${Date.now()}-${baseName}`,
          resource_type: "raw",        // 🔥 FIX
          access_mode: "public",       // 🔥 FIX
        };
      }

      // ===============================
      // 🖼️ IMAGES
      // ===============================
      return {
        folder,
        public_id: `${Date.now()}-${baseName}`,
        resource_type: "image",
      };
    },
  });

  return multer({
    storage,

    fileFilter: (req, file, cb) => {
      const ext = file.originalname.split(".").pop().toLowerCase();

      // Resume validation
      if (file.fieldname === "resume") {
        if (!allowedExtensions.resume.includes(ext)) {
          return cb(new Error("Resume must be PDF, DOC, or DOCX"));
        }
      }

      // Additional document validation
      if (file.fieldname === "additionalDocument") {
        if (!allowedExtensions.additionalDocument.includes(ext)) {
          return cb(new Error("Additional document file type not allowed"));
        }
      }

      // Syllabus PDF validation
      if (file.fieldname === "syllabusPdf") {
        if (!allowedExtensions.syllabusPdf.includes(ext)) {
          return cb(new Error("Syllabus must be a PDF file"));
        }
      }

      // Image validation
      if (
        file.fieldname.toLowerCase().includes("image") ||
        file.fieldname.toLowerCase().includes("logo")
      ) {
        if (!allowedExtensions.image.includes(ext)) {
          return cb(new Error("Images must be JPG, PNG, or WEBP"));
        }
      }

      cb(null, true);
    },

    limits: {
      fileSize: maxFileSizeMB * 1024 * 1024,
      files: maxFiles,
    },
  });
};

export default createUploader;

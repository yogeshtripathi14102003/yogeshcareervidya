// middleware/uploadPdf.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const allowedExtensions = {
  resume: ["pdf", "doc", "docx"],
  additionalDocument: ["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"],
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "applications",
    resource_type: "auto",
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
  }),
});

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.split(".").pop().toLowerCase();

  if (file.fieldname === "resume") {
    if (!allowedExtensions.resume.includes(ext)) {
      return cb(new Error("Resume must be PDF, DOC, or DOCX"));
    }
  }

  if (file.fieldname === "additionalDocument") {
    if (!allowedExtensions.additionalDocument.includes(ext)) {
      return cb(new Error("Invalid additional document type"));
    }
  }

  cb(null, true);
};

const uploadPdf = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

export default uploadPdf;

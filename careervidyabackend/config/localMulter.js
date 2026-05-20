import multer from "multer";
import fs from "fs";

const createLocalUploader = ({
  folder = "uploads/documents",
  maxFileSizeMB = 10,
  maxFiles = 20,
} = {}) => {
  // ✅ Folder auto-create
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    const allowed = ["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"];

    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error("❌ Only PDF, DOC, DOCX, JPG, PNG, WEBP allowed!"),
        false
      );
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxFileSizeMB * 1024 * 1024,
      files: maxFiles,
    },
  });
};

export default createLocalUploader;
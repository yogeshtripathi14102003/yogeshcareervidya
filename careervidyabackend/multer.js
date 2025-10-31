import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./config/cloudinary.js";

const createUploader = ({
  folder = "products",
  maxFileSizeMB = 5,
  maxFiles = 5,
  allowedTypes = ["jpeg", "jpg", "png", "webp"],
}) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: allowedTypes,
      transformation: [{ quality: "auto", fetch_format: "auto" }], // optimization
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: maxFileSizeMB * 1024 * 1024,
      files: maxFiles,
    },
  });
};

export default createUploader;

// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "./config/cloudinary.js";

// const createUploader = ({
//   folder = "products",
//   maxFileSizeMB = 5,
//   maxFiles = 5,
//   allowedTypes = ["jpeg", "jpg", "png", "webp"],
// }) => {
//   const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder,
//       allowed_formats: allowedTypes,
//       transformation: [{ quality: "auto", fetch_format: "auto" }], // optimization
//     },
//   });

//   return multer({
//     storage,
//     limits: {
//       fileSize: maxFileSizeMB * 10 * 1024 * 1024,
//       files: maxFiles,
//     },
//   });
// };

// export default createUploader;


import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./config/cloudinary.js";

const createUploader = ({
  folder = "courses",
  maxFileSizeMB = 10,
  maxFiles = 30,
  allowedTypes = ["jpeg", "jpg", "png", "webp"],
} = {}) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder,
      allowed_formats: allowedTypes,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    }),
  });

  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      const ok =
        file.fieldname.toLowerCase().includes("image") ||
        file.fieldname.toLowerCase().includes("logo");
      cb(null, ok);
    },
    limits: { fileSize: maxFileSizeMB * 1024 * 1024, files: maxFiles },
  });
};

export default createUploader;

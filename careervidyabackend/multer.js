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
  maxFileSizeMB = 5,
  maxFiles = 20,
  allowedTypes = ["jpeg", "jpg", "png", "webp"],
} = {}) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      return {
        folder,
        allowed_formats: allowedTypes,
        transformation: [{ quality: "auto", fetch_format: "auto" }],
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
      };
    },
  });

  // ✅ Dynamic filter: allow any field containing 'image' or 'logo'
  const fileFilter = (req, file, cb) => {
    if (
      file.fieldname.toLowerCase().includes("image") ||
      file.fieldname.toLowerCase().includes("logo")
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxFileSizeMB * 10 * 1024 * 1024, // per file
      files: maxFiles,
    },
  });
};

export default createUploader;

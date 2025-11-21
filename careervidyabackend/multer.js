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


// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "./config/cloudinary.js";

// const createUploader = ({
//   folder = "courses",
//   maxFileSizeMB = 10,
//   maxFiles = 30,
//   allowedTypes = ["jpeg", "jpg", "png", "webp", "pdf"],
// } = {}) => {
//   const storage = new CloudinaryStorage({
//     cloudinary,
//     params: async (req, file) => ({
//       folder,
//       allowed_formats: allowedTypes,
//       transformation: [{ quality: "auto", fetch_format: "auto" }],
//       public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
//     }),
//   });

//   return multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//       const ok =
//         file.fieldname.toLowerCase().includes("image") ||
//         file.fieldname.toLowerCase().includes("logo");
//       cb(null, ok);
//     },
//     limits: { fileSize: maxFileSizeMB * 1024 * 1024, files: maxFiles },
//   });
// };

// export default createUploader;



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
  };

  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder,
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
      resource_type: "auto",
    }),
  });

  return multer({
    storage,

    fileFilter: (req, file, cb) => {
      const ext = file.originalname.split(".").pop().toLowerCase();

      // Matching file fields
      if (file.fieldname === "resume") {
        if (!allowedExtensions.resume.includes(ext)) {
          return cb(new Error("Resume must be PDF, DOC, or DOCX"));
        }
      }

      if (file.fieldname === "additionalDocument") {
        if (!allowedExtensions.additionalDocument.includes(ext)) {
          return cb(new Error("Additional document file type not allowed"));
        }
      }

      if (
        file.fieldname.toLowerCase().includes("image") ||
        file.fieldname.toLowerCase().includes("logo")
      ) {
        if (!allowedExtensions.image.includes(ext)) {
          return cb(new Error("Images must be JPG, PNG, WEBP"));
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

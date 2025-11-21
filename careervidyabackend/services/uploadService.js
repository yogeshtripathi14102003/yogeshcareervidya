 import cloudinary from "../config/cloudinary.js";

export const formatCloudinaryFile = (file) => ({
  url: file.path, // provided by multer-storage-cloudinary
  public_id: file.filename || file?.public_id, // unique Cloudinary ID
});

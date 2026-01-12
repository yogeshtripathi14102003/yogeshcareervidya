import express from "express";
import createUploader from "../multer.js";
import {
  createBlog, bulkBlogUploadFromExcel, getAllBlogs,
  getBlogBySlug, getBlogById, updateBlog, deleteBlog
} from "../controller/blogController.js";

const router = express.Router();
const blogUpload = createUploader({ folder: "blogs", maxFileSizeMB: 15 });
const blogUploads = blogUpload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "authorImage", maxCount: 1 },
  { name: "contentImages", maxCount: 15 },
  { name: "videoFiles", maxCount: 5 }
]);
const excelUpload = createUploader({ folder: "blog-excel", maxFileSizeMB: 5 }).single("excelFile");

router.post("/blog", blogUploads, createBlog);
router.post("/blog/bulk-excel", excelUpload, bulkBlogUploadFromExcel);
router.get("/blog", getAllBlogs);
router.get("/blog/slug/:slug", getBlogBySlug);
router.route("/blog/:id").get(getBlogById).put(blogUploads, updateBlog).delete(deleteBlog);

export default router;
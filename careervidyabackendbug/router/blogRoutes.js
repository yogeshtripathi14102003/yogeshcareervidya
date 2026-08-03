import express from "express";
import createUploader from "../multer.js";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  createBlog, bulkBlogUploadFromExcel, getAllBlogs,
  getBlogBySlug, getBlogById, updateBlog, deleteBlog
} from "../controller/blogController.js";

const router = express.Router();
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

const blogUpload = createUploader({ folder: "blogs", maxFileSizeMB: 15 });
const blogUploads = blogUpload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "authorImage", maxCount: 1 },
  { name: "contentImages", maxCount: 15 },
  { name: "videoFiles", maxCount: 5 }
]);
const excelUpload = createUploader({ folder: "blog-excel", maxFileSizeMB: 5 }).single("excelFile");

// Public — blog is public content, key for SEO
router.get("/blog", getAllBlogs);
router.get("/blog/slug/:slug", getBlogBySlug);
router.get("/blog/:id", getBlogById);

// Admin only
router.post("/blog", adminOnly, blogUploads, createBlog);
router.post("/blog/bulk-excel", adminOnly, excelUpload, bulkBlogUploadFromExcel);
router.put("/blog/:id", adminOnly, blogUploads, updateBlog);
router.delete("/blog/:id", adminOnly, deleteBlog);

export default router;

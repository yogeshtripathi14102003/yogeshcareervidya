import BlogModel from "../models/Admin/blogModel.js";
import XLSX from "xlsx";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";

/* ================= SAFE JSON PARSER ================= */
const safeParse = (val, def) => {
  try {
    if (!val) return def;
    if (typeof val === "string") return JSON.parse(val);
    return val;
  } catch {
    return def;
  }
};

/* ================= CLOUDINARY HELPERS ================= */
const uploadToCloudinary = async (filePath, folder) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "auto",
    quality: "auto:good",     // ✅ compression
    fetch_format: "auto",     // ✅ webp / avif
  });

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

const deleteFromCloudinary = async (public_id) => {
  if (!public_id) return;
  try {
    await cloudinary.uploader.destroy(public_id, {
      resource_type: "image",
    });
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
};

/* ================= CREATE BLOG ================= */
export const createBlog = async (req, res) => {
  try {
    const body = req.body.jsonData
      ? JSON.parse(req.body.jsonData)
      : req.body;

    const blog = new BlogModel({
      custom_id: body.custom_id,
      title: body.title,
      slug: slugify(body.title, { lower: true, strict: true }),
      category: body.category,
      is_verified: body.is_verified ?? false,
      author: safeParse(body.author, {}),
      overview: safeParse(body.overview, {}),
      second_section: safeParse(body.second_section, {}),
      content: safeParse(body.content, []),
      faqs: safeParse(body.faqs, []),
      seo: safeParse(body.seo, {}),
    });

    /* ===== COVER IMAGE ===== */
    if (req.files?.coverImage?.[0]) {
      blog.image = await uploadToCloudinary(
        req.files.coverImage[0].path,
        "blogs/cover"
      );
    }

    /* ===== AUTHOR IMAGE ===== */
    if (req.files?.authorImage?.[0]) {
      blog.author.profile_img = await uploadToCloudinary(
        req.files.authorImage[0].path,
        "blogs/authors"
      );
    }

    /* ===== CONTENT MEDIA ===== */
    if (req.files?.contentImages?.length) {
      for (let i = 0; i < req.files.contentImages.length; i++) {
        if (blog.content[i]) {
          blog.content[i].media = {
            ...(blog.content[i].media || {}),
            ...(await uploadToCloudinary(
              req.files.contentImages[i].path,
              "blogs/content"
            )),
          };
        }
      }
    }

    await blog.save();
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= BULK EXCEL UPLOAD ================= */
export const bulkBlogUploadFromExcel = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Excel file missing" });

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const blogs = rows.map((row) => ({
      custom_id: row.custom_id,
      title: row.title,
      slug: slugify(row.title, { lower: true, strict: true }),
      category: row.category,
      is_verified: row.is_verified === true || row.is_verified === "true",
      author: {
        name: row.author_name,
        experience: row.author_experience,
        specialization: row.author_specialization,
        designation: row.author_designation,
        description: row.author_description,
      },
      overview: {
        heading: row.overview_heading || "Quick Overview",
        points: row.overview_points
          ? row.overview_points.split("|").map((p) => p.trim())
          : [],
      },
      second_section: {
        heading: row.sec_heading,
        description: row.sec_desc,
        sub_description: row.sec_sub_description,
        points: row.sec_points
          ? row.sec_points.split("|").map((p) => p.trim())
          : [],
        table: [],
      },
      seo: {
        meta_title: row.seo_meta_title,
        meta_desc: row.seo_meta_desc,
        keywords: row.seo_keywords
          ? row.seo_keywords.split(",").map((k) => k.trim())
          : [],
      },
      image: row.image_url ? { url: row.image_url } : undefined,
    }));

    await BlogModel.insertMany(blogs);

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      total: blogs.length,
      message: "Bulk Upload Success",
    });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path))
      fs.unlinkSync(req.file.path);

    res.status(500).json({
      success: false,
      message: "Excel Error: " + error.message,
    });
  }
};

/* ================= UPDATE BLOG ================= */
export const updateBlog = async (req, res) => {
  try {
    const body = req.body.jsonData
      ? JSON.parse(req.body.jsonData)
      : req.body;

    const existingBlog = await BlogModel.findById(req.params.id);
    if (!existingBlog)
      return res.status(404).json({ message: "Blog not found" });

    const updates = {
      ...body,
      author: safeParse(body.author, undefined),
      overview: safeParse(body.overview, undefined),
      second_section: safeParse(body.second_section, undefined),
      content: safeParse(body.content, undefined),
      faqs: safeParse(body.faqs, undefined),
      seo: safeParse(body.seo, undefined),
    };

    /* ===== COVER IMAGE REPLACE ===== */
    if (req.files?.coverImage?.[0]) {
      await deleteFromCloudinary(existingBlog.image?.public_id);
      updates.image = await uploadToCloudinary(
        req.files.coverImage[0].path,
        "blogs/cover"
      );
    }

    /* ===== AUTHOR IMAGE REPLACE ===== */
    if (req.files?.authorImage?.[0]) {
      await deleteFromCloudinary(
        existingBlog.author?.profile_img?.public_id
      );

      updates["author.profile_img"] = await uploadToCloudinary(
        req.files.authorImage[0].path,
        "blogs/authors"
      );
    }

    /* ===== CONTENT MEDIA REPLACE ===== */
    if (req.files?.contentImages?.length && updates.content) {
      for (let i = 0; i < req.files.contentImages.length; i++) {
        if (updates.content[i]?.media?.public_id) {
          await deleteFromCloudinary(
            updates.content[i].media.public_id
          );
        }

        updates.content[i].media = {
          ...(updates.content[i].media || {}),
          ...(await uploadToCloudinary(
            req.files.contentImages[i].path,
            "blogs/content"
          )),
        };
      }
    }

    const blog = await BlogModel.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json({ success: true, data: blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ALL BLOGS ================= */
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET BLOG BY ID ================= */
export const getBlogById = async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ success: false, message: "Not Found" });

    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET BLOG BY SLUG ================= */
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await BlogModel.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { reads: 1 } },
      { new: true }
    );

    if (!blog)
      return res.status(404).json({ success: false, message: "Not Found" });

    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE BLOG ================= */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ message: "Blog not found" });

    await deleteFromCloudinary(blog.image?.public_id);
    await deleteFromCloudinary(
      blog.author?.profile_img?.public_id
    );

    if (blog.content?.length) {
      for (const block of blog.content) {
        if (block.media?.public_id) {
          await deleteFromCloudinary(block.media.public_id);
        }
      }
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: "Blog & Cloudinary media deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// import BlogModel from "../models/Admin/blogModel.js";
// import XLSX from "xlsx";
// import fs from "fs";
// import cloudinary from "../config/cloudinary.js";
// import slugify from "slugify";

// /* ================= SAFE JSON PARSER ================= */

// const safeParse = (val, def) => {
//   if (!val) return def;

//   if (typeof val === "string") {
//     try {
//       return JSON.parse(val);
//     } catch {
//       return def;
//     }
//   }

//   return val;
// };

// /* ================= CLOUDINARY HELPERS ================= */

// const uploadToCloudinary = async (filePath, folder) => {

//   const result = await cloudinary.uploader.upload(filePath, {
//     folder,
//     resource_type: "auto",
//     quality: "auto:good",
//     fetch_format: "auto",
//   });

//   if (fs.existsSync(filePath)) {
//     fs.unlinkSync(filePath);
//   }

//   return {
//     url: result.secure_url,
//     public_id: result.public_id,
//   };
// };

// const deleteFromCloudinary = async (public_id) => {

//   if (!public_id) return;

//   try {
//     await cloudinary.uploader.destroy(public_id, {
//       resource_type: "auto",
//     });
//   } catch (err) {
//     console.error("Cloudinary delete error:", err.message);
//   }

// };

// /* ================= CREATE BLOG ================= */

// export const createBlog = async (req, res) => {
//   try {

//     const body = req.body.jsonData
//       ? JSON.parse(req.body.jsonData)
//       : req.body;

//     const blog = new BlogModel({
//       custom_id: body.custom_id,
//       title: body.title,
//       slug: slugify(body.title, { lower: true, strict: true }),
//       category: body.category,
//       is_verified: body.is_verified ?? false,
//       author: safeParse(body.author, {}),
//       overview: safeParse(body.overview, {}),
//       second_section: safeParse(body.second_section, {}),
//       content: safeParse(body.content, []),
//       faqs: safeParse(body.faqs, []),
//       seo: safeParse(body.seo, {}),
//     });

//     /* ================= COVER IMAGE ================= */
//     if (req.files?.coverImage?.[0]) {
//       blog.image = await uploadToCloudinary(
//         req.files.coverImage[0].path,
//         "blogs/cover"
//       );
//     }

//     /* ================= AUTHOR IMAGE ================= */
//     if (req.files?.authorImage?.[0]) {
//       blog.author.profile_img = await uploadToCloudinary(
//         req.files.authorImage[0].path,
//         "blogs/authors"
//       );
//     }

//     /* ================= CONTENT IMAGES (FIXED) ================= */
//     if (req.files?.contentImages?.length) {

//       let imageIndex = 0; // 🔥 important

//       for (let i = 0; i < blog.content.length; i++) {

//         // 👉 sirf image type block
//         if (blog.content[i].type === "image") {

//           const file = req.files.contentImages[imageIndex];

//           if (!file) continue;

//           const uploaded = await uploadToCloudinary(
//             file.path,
//             "blogs/content"
//           );

//           blog.content[i].media = {
//             ...(blog.content[i].media || {}),
//             ...uploaded,
//           };

//           imageIndex++; // 🔥 move to next image
//         }
//       }
//     }

//     await blog.save();

//     res.status(201).json({
//       success: true,
//       data: blog,
//     });

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

// /* ================= UPDATE BLOG ================= */

// export const updateBlog = async (req, res) => {

//   try {

//     const body = req.body.jsonData
//       ? JSON.parse(req.body.jsonData)
//       : req.body;

//     const existingBlog = await BlogModel.findById(req.params.id);

//     if (!existingBlog) {
//       return res.status(404).json({
//         success: false,
//         message: "Blog not found",
//       });
//     }

//     const updates = {
//       ...existingBlog.toObject(),
//       ...body,
//       author: safeParse(body.author, existingBlog.author),
//       overview: safeParse(body.overview, existingBlog.overview),
//       second_section: safeParse(body.second_section, existingBlog.second_section),
//       content: safeParse(body.content, existingBlog.content),
//       faqs: safeParse(body.faqs, existingBlog.faqs),
//       seo: safeParse(body.seo, existingBlog.seo),
//     };

//     /* UPDATE SLUG IF TITLE CHANGED */

//     if (body.title) {

//       updates.slug = slugify(body.title, {
//         lower: true,
//         strict: true,
//       });

//     }

//     /* COVER IMAGE REPLACE */

//     if (req.files?.coverImage?.[0]) {

//       if (existingBlog.image?.public_id) {
//         await deleteFromCloudinary(existingBlog.image.public_id);
//       }

//       updates.image = await uploadToCloudinary(
//         req.files.coverImage[0].path,
//         "blogs/cover"
//       );

//     }

//     /* AUTHOR IMAGE REPLACE */

//     if (req.files?.authorImage?.[0]) {

//       if (existingBlog.author?.profile_img?.public_id) {

//         await deleteFromCloudinary(
//           existingBlog.author.profile_img.public_id
//         );

//       }

//       updates.author = {
//         ...existingBlog.author,
//         profile_img: await uploadToCloudinary(
//           req.files.authorImage[0].path,
//           "blogs/authors"
//         ),
//       };

//     }

//     /* CONTENT IMAGE REPLACE */

//     if (req.files?.contentImages?.length && updates.content) {

//       for (let i = 0; i < req.files.contentImages.length; i++) {

//         if (!updates.content[i]) continue;

//         if (updates.content[i]?.media?.public_id) {
//           await deleteFromCloudinary(
//             updates.content[i].media.public_id
//           );
//         }

//         updates.content[i].media = {
//           ...(updates.content[i].media || {}),
//           ...(await uploadToCloudinary(
//             req.files.contentImages[i].path,
//             "blogs/content"
//           )),
//         };

//       }

//     }

//     const blog = await BlogModel.findByIdAndUpdate(
//       req.params.id,
//       { $set: updates },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       data: blog,
//     });

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }

// };

// /* ================= GET ALL BLOGS ================= */

// // List-view only needs these fields, not the full rich-text content array —
// // keeps the /blog payload light regardless of how long individual posts are.
// const LIST_FIELDS = "title slug image author category createdAt updatedAt reads is_verified";

// export const getAllBlogs = async (req, res) => {

//   try {

//     const { page, limit, search, category } = req.query;

//     const filter = {};
//     if (search?.trim()) filter.title = { $regex: search.trim(), $options: "i" };
//     if (category?.trim()) filter.category = category.trim();

//     // Backward compatible: if no page/limit is given, behave exactly as
//     // before (return everything) so nothing already calling this without
//     // pagination params breaks.
//     let query = BlogModel.find(filter).select(LIST_FIELDS).sort({ createdAt: -1 }).lean();

//     let totalPages;
//     let total;
//     if (page || limit) {
//       const pageNum = Math.max(1, parseInt(page) || 1);
//       const pageSize = Math.min(50, parseInt(limit) || 9);
//       total = await BlogModel.countDocuments(filter);
//       totalPages = Math.ceil(total / pageSize);
//       query = query.skip((pageNum - 1) * pageSize).limit(pageSize);
//     }

//     const blogs = await query;

//     res.json({
//       success: true,
//       data: blogs,
//       ...(total !== undefined && { total, totalPages }),
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }

// };

// /* ================= GET BLOG BY ID ================= */

// export const getBlogById = async (req, res) => {

//   try {

//     const blog = await BlogModel.findById(req.params.id);

//     if (!blog)
//       return res.status(404).json({
//         success: false,
//         message: "Blog not found",
//       });

//     res.json({
//       success: true,
//       data: blog,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }

// };

// /* ================= GET BLOG BY SLUG ================= */

// export const getBlogBySlug = async (req, res) => {

//   try {

//     const blog = await BlogModel.findOneAndUpdate(
//       { slug: req.params.slug },
//       { $inc: { reads: 1 } },
//       { new: true }
//     );

//     if (!blog)
//       return res.status(404).json({
//         success: false,
//         message: "Blog not found",
//       });

//     res.json({
//       success: true,
//       data: blog,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }

// };

// /* ================= DELETE BLOG ================= */

// export const deleteBlog = async (req, res) => {

//   try {

//     const blog = await BlogModel.findById(req.params.id);

//     if (!blog)
//       return res.status(404).json({
//         success: false,
//         message: "Blog not found",
//       });

//     await deleteFromCloudinary(blog.image?.public_id);

//     await deleteFromCloudinary(
//       blog.author?.profile_img?.public_id
//     );

//     if (blog.content?.length) {

//       for (const block of blog.content) {

//         if (block.media?.public_id) {
//           await deleteFromCloudinary(block.media.public_id);
//         }

//       }

//     }

//     await blog.deleteOne();

//     res.json({
//       success: true,
//       message: "Blog and images deleted successfully",
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }

// };

// /* ================= BULK EXCEL UPLOAD ================= */

// export const bulkBlogUploadFromExcel = async (req, res) => {

//   try {

//     if (!req.file)
//       return res.status(400).json({
//         success: false,
//         message: "Excel file missing",
//       });

//     const workbook = XLSX.readFile(req.file.path);

//     const sheetName = workbook.SheetNames[0];

//     const rows = XLSX.utils.sheet_to_json(
//       workbook.Sheets[sheetName]
//     );

//     const blogs = rows.map((row) => ({

//       custom_id: row.custom_id,

//       title: row.title,

//       slug: slugify(row.title, {
//         lower: true,
//         strict: true,
//       }),

//       category: row.category,

//       is_verified:
//         row.is_verified === true || row.is_verified === "true",

//       author: {
//         name: row.author_name,
//         experience: row.author_experience,
//         specialization: row.author_specialization,
//         designation: row.author_designation,
//         description: row.author_description,
//       },

//       seo: {
//         meta_title: row.seo_meta_title,
//         meta_desc: row.seo_meta_desc,
//         keywords: row.seo_keywords
//           ? row.seo_keywords.split(",").map((k) => k.trim())
//           : [],
//       },

//       image: row.image_url
//         ? { url: row.image_url }
//         : undefined,

//     }));

//     await BlogModel.insertMany(blogs);

//     if (fs.existsSync(req.file.path))
//       fs.unlinkSync(req.file.path);

//     res.status(201).json({
//       success: true,
//       total: blogs.length,
//       message: "Bulk upload successful",
//     });

//   } catch (error) {

//     if (req.file?.path && fs.existsSync(req.file.path))
//       fs.unlinkSync(req.file.path);

//     res.status(500).json({
//       success: false,
//       message: "Excel Error: " + error.message,
//     });

//   }

// };

import BlogModel from "../models/Admin/blogModel.js";
import XLSX from "xlsx";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";

/* ================= SAFE JSON PARSER ================= */

const safeParse = (val, def) => {
  if (!val) return def;

  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return def;
    }
  }

  return val;
};

/* ================= CLOUDINARY HELPERS ================= */

const uploadToCloudinary = async (filePath, folder) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "auto",
    quality: "auto:good",
    fetch_format: "auto",
  });

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

const deleteFromCloudinary = async (public_id) => {
  if (!public_id) return;

  try {
    await cloudinary.uploader.destroy(public_id, {
      resource_type: "auto",
    });
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
};

/* =========================================================
   INTERNAL LINK VALIDATION
========================================================= */

const validateAndNormalizeContent = async (content) => {
  if (!Array.isArray(content)) {
    return [];
  }

  const normalizedContent = [];

  for (const block of content) {
    const newBlock = {
      ...block,
    };

    if (!Array.isArray(block.links)) {
      newBlock.links = [];
    } else {
      newBlock.links = [];

      for (const link of block.links) {
        if (!link) continue;

        let normalizedLink = {
          text: link.text || "",
          href: link.href || "",
          blogId: link.blogId || null,
          slug: link.slug || null,
          start:
            typeof link.start === "number"
              ? link.start
              : Number(link.start) || 0,
          end:
            typeof link.end === "number"
              ? link.end
              : Number(link.end) || 0,
          type: link.type || "internal",
        };

        /* ================= INTERNAL LINK ================= */

        if (normalizedLink.type === "internal") {
          if (!normalizedLink.blogId && !normalizedLink.slug) {
            continue;
          }

          let linkedBlog = null;

          if (normalizedLink.blogId) {
            linkedBlog = await BlogModel.findById(
              normalizedLink.blogId
            ).select("_id slug");
          }

          if (!linkedBlog && normalizedLink.slug) {
            linkedBlog = await BlogModel.findOne({
              slug: normalizedLink.slug,
            }).select("_id slug");
          }

          /*
           * Agar linked blog exist nahi karta,
           * link ko save nahi karenge.
           */

          if (!linkedBlog) {
            continue;
          }

          normalizedLink.blogId = linkedBlog._id;
          normalizedLink.slug = linkedBlog.slug;
          normalizedLink.href = `/blog/${linkedBlog.slug}`;
        }

        /* ================= EXTERNAL LINK ================= */

        if (normalizedLink.type === "external") {
          if (!normalizedLink.href) {
            continue;
          }

          normalizedLink.blogId = null;
          normalizedLink.slug = null;
        }

        /*
         * Position validation
         */

        if (normalizedLink.start < 0) {
          normalizedLink.start = 0;
        }

        if (
          newBlock.text &&
          normalizedLink.end > newBlock.text.length
        ) {
          normalizedLink.end = newBlock.text.length;
        }

        if (normalizedLink.end <= normalizedLink.start) {
          continue;
        }

        newBlock.links.push(normalizedLink);
      }
    }

    normalizedContent.push(newBlock);
  }

  return normalizedContent;
};

/* =========================================================
   CREATE BLOG
========================================================= */

export const createBlog = async (req, res) => {
  try {
    const body = req.body.jsonData
      ? JSON.parse(req.body.jsonData)
      : req.body;

    /* ================= CONTENT ================= */

    const rawContent = safeParse(body.content, []);

    const content = await validateAndNormalizeContent(
      rawContent
    );

    /* ================= CREATE BLOG ================= */

    const blog = new BlogModel({
      custom_id: body.custom_id,
      title: body.title,

      slug: slugify(body.title, {
        lower: true,
        strict: true,
      }),

      category: body.category,

      is_verified: body.is_verified ?? false,

      author: safeParse(body.author, {}),

      overview: safeParse(body.overview, {}),

      second_section: safeParse(
        body.second_section,
        {}
      ),

      content,

      faqs: safeParse(body.faqs, []),

      seo: safeParse(body.seo, {}),
    });

    /* ================= COVER IMAGE ================= */

    if (req.files?.coverImage?.[0]) {
      blog.image = await uploadToCloudinary(
        req.files.coverImage[0].path,
        "blogs/cover"
      );
    }

    /* ================= AUTHOR IMAGE ================= */

    if (req.files?.authorImage?.[0]) {
      blog.author.profile_img =
        await uploadToCloudinary(
          req.files.authorImage[0].path,
          "blogs/authors"
        );
    }

    /* ================= CONTENT IMAGES ================= */

    if (req.files?.contentImages?.length) {
      let imageIndex = 0;

      for (
        let i = 0;
        i < blog.content.length;
        i++
      ) {
        if (blog.content[i].type !== "image") {
          continue;
        }

        const file =
          req.files.contentImages[imageIndex];

        if (!file) continue;

        const uploaded =
          await uploadToCloudinary(
            file.path,
            "blogs/content"
          );

        blog.content[i].media = {
          ...(blog.content[i].media || {}),
          ...uploaded,
        };

        imageIndex++;
      }
    }

    /* ================= SAVE ================= */

    await blog.save();

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   UPDATE BLOG
========================================================= */

export const updateBlog = async (req, res) => {
  try {
    const body = req.body.jsonData
      ? JSON.parse(req.body.jsonData)
      : req.body;

    const existingBlog =
      await BlogModel.findById(req.params.id);

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    /* ================= CONTENT ================= */

    const rawContent = safeParse(
      body.content,
      existingBlog.content
    );

    const content =
      await validateAndNormalizeContent(
        rawContent
      );

    /* ================= UPDATE OBJECT ================= */

    const updates = {
      ...existingBlog.toObject(),

      ...body,

      author: safeParse(
        body.author,
        existingBlog.author
      ),

      overview: safeParse(
        body.overview,
        existingBlog.overview
      ),

      second_section: safeParse(
        body.second_section,
        existingBlog.second_section
      ),

      content,

      faqs: safeParse(
        body.faqs,
        existingBlog.faqs
      ),

      seo: safeParse(
        body.seo,
        existingBlog.seo
      ),
    };

    /* ================= UPDATE SLUG ================= */

    if (body.title) {
      updates.slug = slugify(body.title, {
        lower: true,
        strict: true,
      });
    }

    /* ================= COVER IMAGE ================= */

    if (req.files?.coverImage?.[0]) {
      if (existingBlog.image?.public_id) {
        await deleteFromCloudinary(
          existingBlog.image.public_id
        );
      }

      updates.image =
        await uploadToCloudinary(
          req.files.coverImage[0].path,
          "blogs/cover"
        );
    }

    /* ================= AUTHOR IMAGE ================= */

    if (req.files?.authorImage?.[0]) {
      if (
        existingBlog.author?.profile_img?.public_id
      ) {
        await deleteFromCloudinary(
          existingBlog.author.profile_img.public_id
        );
      }

      updates.author = {
        ...existingBlog.author,

        profile_img:
          await uploadToCloudinary(
            req.files.authorImage[0].path,
            "blogs/authors"
          ),
      };
    }

    /* ================= CONTENT IMAGES ================= */

    if (
      req.files?.contentImages?.length &&
      updates.content
    ) {
      for (
        let i = 0;
        i < req.files.contentImages.length;
        i++
      ) {
        if (!updates.content[i]) continue;

        if (
          updates.content[i]?.media?.public_id
        ) {
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

    /* ================= UPDATE ================= */

    const blog =
      await BlogModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: updates,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET ALL BLOGS
========================================================= */

const LIST_FIELDS =
  "title slug image author category createdAt updatedAt reads is_verified";

export const getAllBlogs = async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      category,
    } = req.query;

    const filter = {};

    if (search?.trim()) {
      filter.title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (category?.trim()) {
      filter.category = category.trim();
    }

    let query = BlogModel.find(filter)
      .select(LIST_FIELDS)
      .sort({
        createdAt: -1,
      })
      .lean();

    let totalPages;
    let total;

    if (page || limit) {
      const pageNum = Math.max(
        1,
        parseInt(page) || 1
      );

      const pageSize = Math.min(
        50,
        parseInt(limit) || 9
      );

      total =
        await BlogModel.countDocuments(filter);

      totalPages = Math.ceil(
        total / pageSize
      );

      query = query
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize);
    }

    const blogs = await query;

    res.json({
      success: true,
      data: blogs,
      ...(total !== undefined && {
        total,
        totalPages,
      }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET BLOG BY ID
========================================================= */

export const getBlogById = async (req, res) => {
  try {
    const blog =
      await BlogModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET BLOG BY SLUG
========================================================= */

export const getBlogBySlug = async (req, res) => {
  try {
    const blog =
      await BlogModel.findOneAndUpdate(
        {
          slug: req.params.slug,
        },
        {
          $inc: {
            reads: 1,
          },
        },
        {
          new: true,
        }
      );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   DELETE BLOG
========================================================= */

export const deleteBlog = async (req, res) => {
  try {
    const blog =
      await BlogModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await deleteFromCloudinary(
      blog.image?.public_id
    );

    await deleteFromCloudinary(
      blog.author?.profile_img?.public_id
    );

    if (blog.content?.length) {
      for (const block of blog.content) {
        if (block.media?.public_id) {
          await deleteFromCloudinary(
            block.media.public_id
          );
        }
      }
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message:
        "Blog and images deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
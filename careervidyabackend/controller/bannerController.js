// // import bannerModel from "../models/admin/bannerModel.js";
// import bannerModel from "../models/Admin/bannerModel.js";
// import {
//   createBannerSchema,
//   updateBannerSchema,
// } from "../validators/bannerValidator.js";
// import cloudinary from "../config/cloudinary.js";
// import { formatCloudinaryFile } from "../services/uploadService.js";
// import mongoose from "mongoose";

// export const createBanner = async (req, res) => {
//   try {
//     const parsed = createBannerSchema.safeParse(req.body);
//     if (!parsed.success) {
//       return res
//         .status(400)
//         .json({ msg: "Validation failed", errors: parsed.error.issues });
//     }

//     if (!req.file) {
//       return res.status(400).json({ msg: "Banner image is required" });
//     }

//     const image = formatCloudinaryFile(req.file);

//     const banner = new bannerModel({
//       ...parsed.data,
//       image,
//       createdBy: req.user?._id,
//     });

//     await banner.save();

//     res.status(201).json({ msg: "Banner created", banner });
//   } catch (error) {
//     console.error("Error creating banner:", error);
//     res.status(500).json({ msg: "Server error while creating banner" });
//   }
// };

// export const getBanners = async (req, res) => {
//   try {
//     const banners = await bannerModel.find().sort({ createdAt: -1 });
//     res.status(200).json(banners);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Failed to fetch banners" });
//   }
// };

// export const getActiveBanners = async (req, res) => {
//   try {
//     const now = new Date();
//     const filter = {
//       isActive: true,
//       startDate: { $lte: now },
//       $or: [{ endDate: { $gte: now } }, { endDate: null }],
//     };

//     if (req.query.position) {
//       filter.position = req.query.position.toUpperCase();
//     }

//     const banners = await bannerModel
//       .find(filter)
//       .populate(
//         "promotionId",
//         "title description discountPercentage startDate endDate"
//       )
//       .sort({ createdAt: -1 });

//     res.status(200).json(banners);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Failed to fetch active banners" });
//   }
// };

// export const updateBanner = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const parsed = updateBannerSchema.safeParse(req.body);
//     if (!parsed.success) {
//       return res
//         .status(400)
//         .json({ msg: "Validation failed", errors: parsed.error.issues });
//     }

//     const banner = await bannerModel.findById(id);
//     if (!banner) return res.status(404).json({ msg: "Banner not found" });
//     const updateData = { ...parsed.data };
//     // if new file uploaded → delete old + set new
//     if (req.file) {
//       if (banner.image?.public_id) {
//         await cloudinary.uploader.destroy(banner.image.public_id);
//       }
//       updateData.image = formatCloudinaryFile(req.file);
//     }

//     const updated = await bannerModel.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });
//     res.status(200).json({ msg: "Banner updated", banner: updated });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Unable to update banner" });
//   }
// };

// export const deleteBanner = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const banner = await bannerModel.findByIdAndDelete(id);
//     if (!banner) return res.status(404).json({ msg: "Banner not found" });

//     if (banner.image?.public_id) {
//       await cloudinary.uploader.destroy(banner.image.public_id);
//     }

//     res.status(200).json({ msg: "Banner deleted" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Error deleting banner" });
//   }
// };

// export const getBannerPromotionProducts = async (req, res) => {
//   try {
//     const { bannerId } = req.params;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20; // default page size
//     const skip = (page - 1) * limit;

//     // Step 1: find the banner + its promotionId
//     const banner = await bannerModel.findById(bannerId).populate("promotionId");
//     if (!banner || !banner.promotionId) {
//       return res.status(404).json({ msg: "Banner or promotion not found" });
//     }

//     // Step 2: fetch promotion details
//     const promotion = await promotionModel
//       .findById(banner.promotionId._id)
//       .populate("categoryIds", "_id title");

//     if (!promotion) {
//       return res.status(404).json({ msg: "Promotion not found" });
//     }

//     // Step 3: build product filter (active + in stock)
//     const filter = {
//       status: "active",
//       $or: [{ quantity: { $gt: 0 } }, { "variants.quantity": { $gt: 0 } }],
//       $or: [
//         { _id: { $in: promotion.productIds } },
//         { category: { $in: promotion.categoryIds.map((c) => c._id) } },
//       ],
//     };

//     // Step 4: fetch products with pagination
//     const [products, total] = await Promise.all([
//       productModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
//       productModel.countDocuments(filter),
//     ]);

//     res.status(200).json({
//       banner: {
//         _id: banner._id,
//         title: banner.title,
//         image: banner.image,
//       },
//       promotion: {
//         _id: promotion._id,
//         title: promotion.title,
//         description: promotion.description,
//         discountPercentage: promotion.discountPercentage,
//       },
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//       },
//       products,
//     });
//   } catch (error) {
//     console.error("Error fetching banner promotion products:", error);
//     res
//       .status(500)
//       .json({ msg: "Failed to fetch products for banner promotion" });
//   }
// };


import bannerModel from "../models/Admin/bannerModel.js";
import cloudinary from "../config/cloudinary.js";
import { formatCloudinaryFile } from "../services/uploadService.js";
import promotionModel from "../models/Admin/promotionModel.js";


/* ======================================================
   CREATE BANNER (❌ No Auth Required)
====================================================== */
export const createBanner = async (req, res) => {
  try {
    // ✅ Check for image file
    if (!req.file) {
      return res.status(400).json({ msg: "Banner image is required" });
    }

    // ✅ Format uploaded image for DB storage
    const image = formatCloudinaryFile(req.file);

    // ✅ Create and save banner
    const banner = new bannerModel({
      ...req.body,
      image,
    });

    await banner.save();

    res.status(201).json({
      msg: "✅ Banner created successfully",
      banner,
    });
  } catch (error) {
    console.error("❌ Error creating banner:", error);
    res.status(500).json({ msg: "Server error while creating banner" });
  }
};

/* ======================================================
   GET ALL BANNERS
====================================================== */
export const getBanners = async (req, res) => {
  try {
    const banners = await bannerModel.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    res.status(500).json({ msg: "Failed to fetch banners" });
  }
};

/* ======================================================
   GET ACTIVE BANNERS (filter by position if provided)
====================================================== */
export const getActiveBanners = async (req, res) => {
  try {
    const now = new Date();

    const filter = {
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: { $gte: now } }, { endDate: null }],
    };

    if (req.query.position) {
      filter.position = req.query.position.toUpperCase();
    }

    const banners = await bannerModel
      .find(filter)
      .populate(
        "promotionId",
        "title description discountPercentage startDate endDate"
      )
      .sort({ createdAt: -1 });

    res.status(200).json(banners);
  } catch (error) {
    console.error("❌ Error fetching active banners:", error);
    res.status(500).json({ msg: "Failed to fetch active banners" });
  }
};

/* ======================================================
   UPDATE BANNER (❌ No Auth Required)
====================================================== */
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await bannerModel.findById(id);

    if (!banner) {
      return res.status(404).json({ msg: "Banner not found" });
    }

    const updateData = { ...req.body };

    // ✅ Handle new image upload
    if (req.file) {
      if (banner.image?.public_id) {
        await cloudinary.uploader.destroy(banner.image.public_id);
      }
      updateData.image = formatCloudinaryFile(req.file);
    }

    const updatedBanner = await bannerModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      msg: "✅ Banner updated successfully",
      banner: updatedBanner,
    });
  } catch (error) {
    console.error("❌ Error updating banner:", error);
    res.status(500).json({ msg: "Error updating banner" });
  }
};

/* ======================================================
   DELETE BANNER (❌ No Auth Required)
====================================================== */
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await bannerModel.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({ msg: "Banner not found" });
    }

    // ✅ Delete image from Cloudinary
    if (banner.image?.public_id) {
      await cloudinary.uploader.destroy(banner.image.public_id);
    }

    res.status(200).json({ msg: "🗑️ Banner deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting banner:", error);
    res.status(500).json({ msg: "Error deleting banner" });
  }
};

/* ======================================================
   GET BANNER PROMOTION PRODUCTS
====================================================== */
export const getBannerPromotionProducts = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const banner = await bannerModel.findById(bannerId).populate("promotionId");

    if (!banner || !banner.promotionId) {
      return res.status(404).json({ msg: "Banner or promotion not found" });
    }

    const promotion = await promotionModel
      .findById(banner.promotionId._id)
      .populate("categoryIds", "_id title");

    if (!promotion) {
      return res.status(404).json({ msg: "Promotion not found" });
    }

    const filter = {
      status: "active",
      $or: [
        { _id: { $in: promotion.productIds } },
        { category: { $in: promotion.categoryIds.map((c) => c._id) } },
      ],
    };

    const [products, total] = await Promise.all([
      productModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      productModel.countDocuments(filter),
    ]);

    res.status(200).json({
      banner: {
        _id: banner._id,
        title: banner.title,
        image: banner.image,
      },
      promotion: {
        _id: promotion._id,
        title: promotion.title,
        description: promotion.description,
        discountPercentage: promotion.discountPercentage,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      products,
    });
  } catch (error) {
    console.error("❌ Error fetching banner promotion products:", error);
    res.status(500).json({
      msg: "Failed to fetch products for banner promotion",
    });
  }
};

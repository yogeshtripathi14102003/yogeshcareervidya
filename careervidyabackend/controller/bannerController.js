

// import bannerModel from "../models/Admin/bannerModel.js";
// import cloudinary from "../config/cloudinary.js";
// import { formatCloudinaryFile } from "../services/uploadService.js";
// import promotionModel from "../models/Admin/promotionModel.js";

// /* ======================================================
//    CREATE BANNER (Desktop + Mobile)
// ====================================================== */
// export const createBanner = async (req, res) => {
//   try {
//     // check for files
//     if (!req.files.desktopImage || !req.files.mobileImage) {
//       return res.status(400).json({
//         msg: "Desktop and Mobile images are required",
//       });
//     }

//     const desktopImage = formatCloudinaryFile(req.files.desktopImage[0]);
//     const mobileImage = formatCloudinaryFile(req.files.mobileImage[0]);

//     const banner = new bannerModel({
//       ...req.body,
//       desktopImage,
//       mobileImage,
//     });

//     await banner.save();

//     res.status(201).json({
//       msg: "✅ Banner created successfully",
//       banner,
//     });
//   } catch (error) {
//     console.error("❌ Error creating banner:", error);
//     res.status(500).json({ msg: "Server error while creating banner" });
//   }
// };

// /* ======================================================
//    GET ALL BANNERS
// ====================================================== */
// export const getBanners = async (req, res) => {
//   try {
//     const banners = await bannerModel.find().sort({ createdAt: -1 });
//     res.status(200).json(banners);
//   } catch (error) {
//     console.error("❌ Error fetching banners:", error);
//     res.status(500).json({ msg: "Failed to fetch banners" });
//   }
// };

// /* ======================================================
//    GET ACTIVE BANNERS (with position filter)
// ====================================================== */
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
//     console.error("❌ Error fetching active banners:", error);
//     res.status(500).json({ msg: "Failed to fetch active banners" });
//   }
// };

// /* ======================================================
//    UPDATE BANNER (Desktop + Mobile)
// ====================================================== */
// export const updateBanner = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const banner = await bannerModel.findById(id);

//     if (!banner) {
//       return res.status(404).json({ msg: "Banner not found" });
//     }

//     const updateData = { ...req.body };

//     // If new desktop image uploaded
//     if (req.files?.desktopImage) {
//       if (banner.desktopImage?.public_id) {
//         await cloudinary.uploader.destroy(banner.desktopImage.public_id);
//       }
//       updateData.desktopImage = formatCloudinaryFile(
//         req.files.desktopImage[0]
//       );
//     }

//     // If new mobile image uploaded
//     if (req.files?.mobileImage) {
//       if (banner.mobileImage?.public_id) {
//         await cloudinary.uploader.destroy(banner.mobileImage.public_id);
//       }
//       updateData.mobileImage = formatCloudinaryFile(
//         req.files.mobileImage[0]
//       );
//     }

//     const updatedBanner = await bannerModel.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     );

//     res.status(200).json({
//       msg: "✅ Banner updated successfully",
//       banner: updatedBanner,
//     });
//   } catch (error) {
//     console.error("❌ Error updating banner:", error);
//     res.status(500).json({ msg: "Error updating banner" });
//   }
// };

// /* ======================================================
//    DELETE BANNER (Delete Desktop + Mobile images)
// ====================================================== */
// export const deleteBanner = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const banner = await bannerModel.findByIdAndDelete(id);

//     if (!banner) {
//       return res.status(404).json({ msg: "Banner not found" });
//     }

//     // delete desktop image
//     if (banner.desktopImage?.public_id) {
//       await cloudinary.uploader.destroy(banner.desktopImage.public_id);
//     }

//     // delete mobile image
//     if (banner.mobileImage?.public_id) {
//       await cloudinary.uploader.destroy(banner.mobileImage.public_id);
//     }

//     res.status(200).json({ msg: "🗑️ Banner deleted successfully" });
//   } catch (error) {
//     console.error("❌ Error deleting banner:", error);
//     res.status(500).json({ msg: "Error deleting banner" });
//   }
// };

// /* ======================================================
//    GET BANNER PROMOTION PRODUCTS
// ====================================================== */
// export const getBannerPromotionProducts = async (req, res) => {
//   try {
//     const { bannerId } = req.params;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const skip = (page - 1) * limit;

//     const banner = await bannerModel.findById(bannerId).populate("promotionId");

//     if (!banner || !banner.promotionId) {
//       return res.status(404).json({ msg: "Banner or promotion not found" });
//     }

//     const promotion = await promotionModel
//       .findById(banner.promotionId._id)
//       .populate("categoryIds", "_id title");

//     if (!promotion) {
//       return res.status(404).json({ msg: "Promotion not found" });
//     }

//     const filter = {
//       status: "active",
//       $or: [
//         { _id: { $in: promotion.productIds } },
//         { category: { $in: promotion.categoryIds.map((c) => c._id) } },
//       ],
//     };

//     const [products, total] = await Promise.all([
//       productModel
//         .find(filter)
//         .skip(skip)
//         .limit(limit)
//         .sort({ createdAt: -1 }),
//       productModel.countDocuments(filter),
//     ]);

//     res.status(200).json({
//       banner: {
//         _id: banner._id,
//         title: banner.title,
//         desktopImage: banner.desktopImage,
//         mobileImage: banner.mobileImage,
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
//     console.error("❌ Error fetching banner promotion products:", error);
//     res.status(500).json({
//       msg: "Failed to fetch products for banner promotion",
//     });
//   }
// };



import bannerModel from "../models/Admin/bannerModel.js";
import promotionModel from "../models/Admin/promotionModel.js";
import productModel from "../models/Admin/productModel.js"; // Added
import cloudinary from "../config/cloudinary.js";
import { formatCloudinaryFile } from "../services/uploadService.js";

/* ======================================================
   CREATE BANNER (Desktop + Mobile)
====================================================== */
export const createBanner = async (req, res) => {
  try {
    if (!req.files || !req.files.desktopImage || !req.files.mobileImage) {
      return res.status(400).json({ msg: "Desktop and Mobile images are required" });
    }

    let desktopImage, mobileImage;
    try {
      desktopImage = formatCloudinaryFile(req.files.desktopImage[0]);
      mobileImage = formatCloudinaryFile(req.files.mobileImage[0]);
    } catch (err) {
      return res.status(400).json({ msg: "Invalid image file" });
    }

    const banner = new bannerModel({
      ...req.body,
      desktopImage,
      mobileImage,
    });

    await banner.save();
    res.status(201).json({ msg: "✅ Banner created successfully", banner });
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
   GET ACTIVE BANNERS (with position filter)
====================================================== */
export const getActiveBanners = async (req, res) => {
  try {
    const now = new Date();
    const filter = {
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: { $gte: now } }, { endDate: null }],
    };

    if (req.query.position) filter.position = req.query.position.toUpperCase();

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
   UPDATE BANNER (Desktop + Mobile)
====================================================== */
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await bannerModel.findById(id);
    if (!banner) return res.status(404).json({ msg: "Banner not found" });

    const updateData = { ...req.body };

    if (req.files?.desktopImage) {
      try {
        if (banner.desktopImage?.public_id) {
          await cloudinary.uploader.destroy(banner.desktopImage.public_id);
        }
      } catch (err) {
        console.warn("Failed to delete old desktop image:", err);
      }
      updateData.desktopImage = formatCloudinaryFile(req.files.desktopImage[0]);
    }

    if (req.files?.mobileImage) {
      try {
        if (banner.mobileImage?.public_id) {
          await cloudinary.uploader.destroy(banner.mobileImage.public_id);
        }
      } catch (err) {
        console.warn("Failed to delete old mobile image:", err);
      }
      updateData.mobileImage = formatCloudinaryFile(req.files.mobileImage[0]);
    }

    const updatedBanner = await bannerModel.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ msg: "✅ Banner updated successfully", banner: updatedBanner });
  } catch (error) {
    console.error("❌ Error updating banner:", error);
    res.status(500).json({ msg: "Error updating banner" });
  }
};

/* ======================================================
   DELETE BANNER (Delete Desktop + Mobile images)
====================================================== */
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await bannerModel.findByIdAndDelete(id);
    if (!banner) return res.status(404).json({ msg: "Banner not found" });

    try { if (banner.desktopImage?.public_id) await cloudinary.uploader.destroy(banner.desktopImage.public_id); } catch {}
    try { if (banner.mobileImage?.public_id) await cloudinary.uploader.destroy(banner.mobileImage.public_id); } catch {}

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
    if (!banner || !banner.promotionId) return res.status(404).json({ msg: "Banner or promotion not found" });

    const promotion = await promotionModel.findById(banner.promotionId._id).populate("categoryIds", "_id title");
    if (!promotion) return res.status(404).json({ msg: "Promotion not found" });

    const filter = {
      status: "active",
      $or: [
        { _id: { $in: promotion.productIds } },
        { category: { $in: promotion.categoryIds.map(c => c._id) } },
      ],
    };

    const [products, total] = await Promise.all([
      productModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      productModel.countDocuments(filter),
    ]);

    res.status(200).json({
      banner: {
        _id: banner._id,
        title: banner.title,
        desktopImage: banner.desktopImage,
        mobileImage: banner.mobileImage,
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
    res.status(500).json({ msg: "Failed to fetch products for banner promotion" });
  }
};

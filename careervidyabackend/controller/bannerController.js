import bannerModel from "../models/Admin/bannerModel.js";
import cloudinary from "../config/cloudinary.js";
import { formatCloudinaryFile } from "../services/uploadService.js";
import promotionModel from "../models/Admin/promotionModel.js";

// ✅ In-memory cache — DB baar baar hit nahi hoga
let bannerCache = {
  data: null,
  timestamp: null,
  TTL: 5 * 60 * 1000, // 5 minutes
};

const isCacheValid = () =>
  bannerCache.data && Date.now() - bannerCache.timestamp < bannerCache.TTL;

// ✅ Sirf zaroori fields — heavy data nahi aayega
const BANNER_SELECT_FIELDS =
  "title altText position link isActive startDate endDate desktopImage.url mobileImage.url";

/* ======================================================
   CREATE BANNER
====================================================== */
export const createBanner = async (req, res) => {
  try {
    if (!req.files?.desktopImage || !req.files?.mobileImage) {
      return res.status(400).json({ msg: "Desktop and Mobile images are required" });
    }

    const desktopImage = formatCloudinaryFile(req.files.desktopImage[0]);
    const mobileImage = formatCloudinaryFile(req.files.mobileImage[0]);

    const banner = new bannerModel({ ...req.body, desktopImage, mobileImage });
    await banner.save();

    // ✅ Cache invalidate karo naya banner aane pe
    bannerCache.data = null;

    res.status(201).json({ msg: "✅ Banner created successfully", banner });
  } catch (error) {
    console.error("❌ Error creating banner:", error);
    res.status(500).json({ msg: "Server error while creating banner" });
  }
};

/* ======================================================
   GET ALL BANNERS (Admin)
====================================================== */
export const getBanners = async (req, res) => {
  try {
    // ✅ Lean — plain JS object, Mongoose overhead nahi
    const banners = await bannerModel
      .find()
      .select(BANNER_SELECT_FIELDS)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(banners);
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    res.status(500).json({ msg: "Failed to fetch banners" });
  }
};

/* ======================================================
   GET ACTIVE BANNERS — Frontend ke liye (FAST)
====================================================== */
export const getActiveBanners = async (req, res) => {
  try {
    // ✅ Cache check — agar fresh data hai toh DB hit nahi
    if (isCacheValid()) {
      return res.status(200).json(bannerCache.data);
    }

    const now = new Date();

    const filter = {
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: { $gte: now } }, { endDate: null }],
    };

    if (req.query.position) {
      filter.position = req.query.position.toUpperCase();
    }

    // ✅ Populate hataya — frontend ko promotion detail nahi chahiye slider mein
    // ✅ lean() — 2-3x faster query
    // ✅ select — sirf image URLs aur zaroori fields
    const banners = await bannerModel
      .find(filter)
      .select(BANNER_SELECT_FIELDS)
      .sort({ createdAt: -1 })
      .lean();

    // ✅ Cache store karo
    bannerCache.data = banners;
    bannerCache.timestamp = Date.now();

    // ✅ HTTP Cache headers — browser/CDN bhi cache karega
    res.set("Cache-Control", "public, max-age=300"); // 5 min browser cache
    res.status(200).json(banners);
  } catch (error) {
    console.error("❌ Error fetching active banners:", error);
    res.status(500).json({ msg: "Failed to fetch active banners" });
  }
};

/* ======================================================
   UPDATE BANNER
====================================================== */
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await bannerModel.findById(id).lean();

    if (!banner) return res.status(404).json({ msg: "Banner not found" });

    const updateData = { ...req.body };

    // ✅ Parallel mein dono images delete karo — await alag alag nahi
    const deleteOps = [];

    if (req.files?.desktopImage) {
      if (banner.desktopImage?.public_id) {
        deleteOps.push(cloudinary.uploader.destroy(banner.desktopImage.public_id));
      }
      updateData.desktopImage = formatCloudinaryFile(req.files.desktopImage[0]);
    }

    if (req.files?.mobileImage) {
      if (banner.mobileImage?.public_id) {
        deleteOps.push(cloudinary.uploader.destroy(banner.mobileImage.public_id));
      }
      updateData.mobileImage = formatCloudinaryFile(req.files.mobileImage[0]);
    }

    // ✅ Dono cloudinary delete parallel chalenge
    if (deleteOps.length) await Promise.all(deleteOps);

    const updatedBanner = await bannerModel.findByIdAndUpdate(id, updateData, { new: true });

    // ✅ Cache invalidate
    bannerCache.data = null;

    res.status(200).json({ msg: "✅ Banner updated successfully", banner: updatedBanner });
  } catch (error) {
    console.error("❌ Error updating banner:", error);
    res.status(500).json({ msg: "Error updating banner" });
  }
};

/* ======================================================
   DELETE BANNER
====================================================== */
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await bannerModel.findByIdAndDelete(id).lean();

    if (!banner) return res.status(404).json({ msg: "Banner not found" });

    // ✅ Dono images parallel delete
    await Promise.all([
      banner.desktopImage?.public_id &&
        cloudinary.uploader.destroy(banner.desktopImage.public_id),
      banner.mobileImage?.public_id &&
        cloudinary.uploader.destroy(banner.mobileImage.public_id),
    ].filter(Boolean));

    // ✅ Cache invalidate
    bannerCache.data = null;

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

    // ✅ Sirf promotionId chahiye — baaki fields skip
    const banner = await bannerModel
      .findById(bannerId)
      .select("title desktopImage.url mobileImage.url promotionId")
      .lean();

    if (!banner?.promotionId) {
      return res.status(404).json({ msg: "Banner or promotion not found" });
    }

    // ✅ Dono queries parallel
    const [promotion, productCount] = await Promise.all([
      promotionModel
        .findById(banner.promotionId)
        .select("title description discountPercentage productIds categoryIds")
        .populate("categoryIds", "_id")
        .lean(),
      null,
    ]);

    if (!promotion) return res.status(404).json({ msg: "Promotion not found" });

    const categoryIds = promotion.categoryIds?.map((c) => c._id) || [];

    const filter = {
      status: "active",
      $or: [
        { _id: { $in: promotion.productIds } },
        { category: { $in: categoryIds } },
      ],
    };

    // ✅ Products aur count parallel
    const [products, total] = await Promise.all([
      productModel.find(filter).select("title price images category").skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
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
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      products,
    });
  } catch (error) {
    console.error("❌ Error fetching banner promotion products:", error);
    res.status(500).json({ msg: "Failed to fetch products for banner promotion" });
  }
};
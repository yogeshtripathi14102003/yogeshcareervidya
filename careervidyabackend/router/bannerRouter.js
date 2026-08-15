import express from "express";
import createUploader from "../multer.js";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  createBanner,
  deleteBanner,
  getActiveBanners,
  getBannerPromotionProducts,
  getBanners,
  updateBanner,
} from "../controller/bannerController.js";

const bannerRouter = express.Router();
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

const bannerUploader = createUploader({
  folder: "banners",
  maxFileSizeMB: 5,
  maxFiles: 2,
  allowedTypes: ["jpeg", "jpg", "png", "webp"],
});

// -------- Public (site display) --------
bannerRouter.get("/", getBanners);
bannerRouter.get("/active", getActiveBanners);
bannerRouter.get("/:bannerId/promotion-products", getBannerPromotionProducts);

// -------- Admin only --------
bannerRouter.post(
  "/",
  adminOnly,
  bannerUploader.fields([
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ]),
  createBanner
);

bannerRouter.put(
  "/:id",
  adminOnly,
  bannerUploader.fields([
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ]),
  updateBanner
);

bannerRouter.delete("/:id", adminOnly, deleteBanner);

export default bannerRouter;

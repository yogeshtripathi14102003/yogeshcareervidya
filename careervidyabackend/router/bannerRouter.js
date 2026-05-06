

import express from "express";
import createUploader from "../multer.js";
import {
  createBanner,
  deleteBanner,
  getActiveBanners,
  getBannerPromotionProducts,
  getBanners,
  updateBanner,
} from "../controller/bannerController.js";

const bannerRouter = express.Router();

// ✅ Multer uploader config
const bannerUploader = createUploader({
  folder: "banners",
  maxFileSizeMB: 5,
  maxFiles: 2, // <-- 2 images allowed
  allowedTypes: ["jpeg", "jpg", "png", "webp"],
});

// --------------------------------------------------
// ✅ Create Banner (Upload Desktop + Mobile Images)
// --------------------------------------------------
bannerRouter.post(
  "/",
  bannerUploader.fields([
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ]),
  createBanner
);

// --------------------------------------------------
// ✅ Update Banner (Upload Desktop + Mobile Images)
// --------------------------------------------------
bannerRouter.put(
  "/:id",
  bannerUploader.fields([
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ]),
  updateBanner
);

// --------------------------------------------------
// Other routes
// --------------------------------------------------
bannerRouter.delete("/:id", deleteBanner);
bannerRouter.get("/", getBanners);
bannerRouter.get("/active", getActiveBanners);
bannerRouter.get("/:bannerId/promotion-products", getBannerPromotionProducts);

export default bannerRouter;

// import express from "express";

// import {
//   requirePermissions,
//   requireRole,
// } from "../middelware/roleMiddleware.js";

// import { PERMISSIONS } from "../constant/permission.js";

// import { createBanner, 
//   deleteBanner,
//   getActiveBanners,
//   getBannerPromotionProducts,
//   getBanners,
//   updateBanner, } from "../controller/bannerController.js";
// import createUploader from "../multer.js";
// import authMiddleware from "../middelware/authMiddleware.js";

// const bannerRouter = express.Router();
// const bannerUploader = createUploader({
//   folder: "banners",
//   maxFileSizeMB: 5,
//   maxFiles: 1,
//   allowedTypes: ["jpeg", "jpg", "png", "webp"],
// });

// bannerRouter.post(
//   "/",
//   authMiddleware,
//   requireRole(["admin", "subadmin"]),
//   requirePermissions(PERMISSIONS.MANAGE_PRODUCTS),
//   bannerUploader.single("image"),
//   createBanner
// );

// bannerRouter.put(
//   "/:id",
//   authMiddleware,
//   requireRole(["admin", "subadmin"]),
//   requirePermissions(PERMISSIONS.MANAGE_PRODUCTS),
//   bannerUploader.single("image"),
//   updateBanner
// );

// bannerRouter.delete(
//   "/:id",
//   authMiddleware,
//   requireRole(["admin", "subadmin"]),
//   requirePermissions(PERMISSIONS.MANAGE_PRODUCTS),
//   deleteBanner
// );

// bannerRouter.get("/", getBanners);
// bannerRouter.get("/active", getActiveBanners);
// bannerRouter.get("/:bannerId/promotion-products", getBannerPromotionProducts);

// export default bannerRouter;



// import express from "express";
// import createUploader from "../multer.js";
// import {
//   createBanner,
//   deleteBanner,
//   getActiveBanners,
//   getBannerPromotionProducts,
//   getBanners,
//   updateBanner,
// } from "../controller/bannerController.js";

// const bannerRouter = express.Router();

// // ✅ Image upload setup
// const bannerUploader = createUploader({
//   folder: "banners",
//   maxFileSizeMB: 5,
//   maxFiles: 1,
//   allowedTypes: ["jpeg", "jpg", "png", "webp"],
// });

// // ✅ Create Banner
// bannerRouter.post("/", bannerUploader.single("image"), createBanner);

// // ✅ Update Banner
// bannerRouter.put("/:id", bannerUploader.single("image"), updateBanner);

// // ✅ Delete Banner
// bannerRouter.delete("/:id", deleteBanner);

// // ✅ Get all banners
// bannerRouter.get("/", getBanners);

// // ✅ Get active banners
// bannerRouter.get("/active", getActiveBanners);

// // ✅ Get products related to a banner’s promotion
// bannerRouter.get("/:bannerId/promotion-products", getBannerPromotionProducts);

// export default bannerRouter;

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

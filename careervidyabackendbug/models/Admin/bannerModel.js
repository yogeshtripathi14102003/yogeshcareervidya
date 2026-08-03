// import mongoose from "mongoose";

// const bannerSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     image: {
//       url: { type: String, required: true }, // Cloudinary secure URL
//       public_id: { type: String, required: true }, // For deletion
//     },
//     linkUrl: { type: String }, // optional → product/category/promo page
//     promotionId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Promotion",
//     },
//     position: {
//       type: String,
//       enum: ["HERO", "STRIP"],
//       required: true,
//     },
//     startDate: { type: Date, default: Date.now },
//     endDate: { type: Date },
//     isActive: { type: Boolean, default: true },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
//   },
//   { timestamps: true }
// );

// bannerSchema.index({ startDate: 1, endDate: 1 });

// const bannerModel =
//   mongoose.models.Banner || mongoose.model("Banner", bannerSchema);

// export default bannerModel;


import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    // 🔵 Desktop Image
    desktopImage: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },

    // 🟢 Mobile Image
    mobileImage: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },

    linkUrl: { type: String }, // optional → product/category/promo page

    promotionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
    },

    position: {
      type: String,
      enum: ["HERO", "STRIP"],
      required: true,
    },

    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },

    isActive: { type: Boolean, default: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

// Index for optimization
bannerSchema.index({ startDate: 1, endDate: 1 });

const bannerModel =
  mongoose.models.Banner || mongoose.model("Banner", bannerSchema);

export default bannerModel;

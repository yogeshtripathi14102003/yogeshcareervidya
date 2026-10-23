// import mongoose from "mongoose";

// const couponSchema = new mongoose.Schema(
//   {
//     code: { type: String, required: true, unique: true, uppercase: true, trim: true },
//     course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
//     university: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },

//     discountType: { type: String, enum: ["percentage", "flat"], default: "percentage" },
//     discountValue: { type: Number, required: true },
//     maxDiscountAmount: { type: Number },

//     validFrom: { type: Date, default: Date.now },
//     validUntil: { type: Date },

//     usageLimit: { type: Number, default: null },
//     perUserLimit: { type: Number, default: 1 },
//     usedCount: { type: Number, default: 0 },
//     usedBy: [
//       {
//         user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         usedAt: { type: Date, default: Date.now },
//         orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
//       },
//     ],

//     isActive: { type: Boolean, default: true },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
//   },
//   { timestamps: true }
// );

// couponSchema.index({ course: 1, university: 1, isActive: 1 });

// // 7 din auto set
// couponSchema.pre("validate", function (next) {
//   if (!this.validUntil) {
//     this.validUntil = new Date(this.validFrom.getTime() + 7 * 24 * 60 * 60 * 1000);
//   }
//   next();
// });

// const Coupon = mongoose.model("Coupon", couponSchema);
// export default Coupon;


import mongoose from "mongoose";
import crypto from "crypto";

// 0, O, 1, I, L hata diye taaki code padhne me confuse na ho
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

// Jaise: CV7K2M9Q
export const generateCouponCode = () =>
  "CV" + Array.from(crypto.randomBytes(6), (b) => CODE_CHARS[b % CODE_CHARS.length]).join("");

const couponSchema = new mongoose.Schema(
  {
    // Ab code khud generate hota hai, body me bhejne ki zaroorat nahi
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, immutable: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },

    // "percentage" -> 20 = 20% off,  "flat" -> 4000 = seedhe Rs 4000 off
    discountType: { type: String, enum: ["percentage", "flat"], default: "percentage" },
    discountValue: { type: Number, required: true, min: [1, "Discount 0 se zyada hona chahiye"] },
    maxDiscountAmount: { type: Number }, // sirf percentage ke liye

    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date },

    usageLimit: { type: Number, default: null },
    perUserLimit: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    usedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        usedAt: { type: Date, default: Date.now },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
      },
    ],

    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

couponSchema.index({ course: 1, university: 1, isActive: 1 });

couponSchema.pre("validate", function (next) {
  // code auto generate
  if (!this.code) this.code = generateCouponCode();

  // 27 din auto set
  if (!this.validUntil) {
    this.validUntil = new Date(this.validFrom.getTime() + 27 * 24 * 60 * 60 * 1000);
  }

  // percentage 100 se zyada nahi, flat me max cap ka matlab nahi
  if (this.discountType === "percentage" && this.discountValue > 100) {
    this.invalidate("discountValue", "Percentage 100 se zyada nahi ho sakta");
  }
  if (this.discountType === "flat") this.maxDiscountAmount = undefined;

  next();
});

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
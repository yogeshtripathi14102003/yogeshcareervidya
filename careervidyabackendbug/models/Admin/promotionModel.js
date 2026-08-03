import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    bannerImage: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],

    discountPercentage: { type: Number },
    isActive: { type: Boolean, default: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

promotionSchema.index({ startDate: 1, endDate: 1 });

promotionSchema.post(["save", "findOneAndUpdate"], async function () {
  const { syncAllDiscounts } = await import(
    "../../services/discountService.js"
  );
  await syncAllDiscounts();
});

const promotionModel =
  mongoose.models.Promotion || mongoose.model("Promotion", promotionSchema);

export default promotionModel;

import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    custom_id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    image: {
      public_id: { type: String },
      url: { type: String, default: "https://res.cloudinary.com/demo/image/upload/v1699999999/placeholder_blog.png" },
    },
    reads: { type: Number, default: 0 },
    is_verified: { type: Boolean, default: false },
    author: {
      name: { type: String, required: true },
      experience: { type: String },
      specialization: { type: String },
      designation: { type: String },
      description: { type: String },
      profile_img: { public_id: { type: String }, url: { type: String } },
    },
    overview: {
      heading: { type: String, default: "Quick Overview" },
      points: { type: [String], default: [] },
    },
    second_section: {
      heading: { type: String },
      description: { type: String },
      points: { type: [String], default: [] },
      sub_description: { type: String },
      table: [{ column1: String, column2: String, column3: String }],
    },
    content: [
      {
        block_type: { type: String, enum: ["text", "image", "video", "table"], required: true },
        value: { type: mongoose.Schema.Types.Mixed },
        media: { public_id: { type: String }, url: { type: String }, caption: { type: String } },
      },
    ],
    faqs: [{ question: String, answer: String }],
    seo: {
      meta_title: String,
      meta_desc: String,
      keywords: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Blog", blogSchema);
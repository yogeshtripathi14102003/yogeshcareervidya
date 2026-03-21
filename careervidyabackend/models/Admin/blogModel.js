

import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
{
  /* ================= BASIC INFO ================= */

  custom_id: {
    type: String,
    required: true,
    unique: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },

  category: {
    type: String,
    required: true,
    trim: true,
  },

  reads: {
    type: Number,
    default: 0,
  },

  is_verified: {
    type: Boolean,
    default: false,
  },

  /* ================= FEATURE IMAGE ================= */

  image: {
    public_id: String,
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/v1699999999/placeholder_blog.png",
    },
  },

  /* ================= AUTHOR ================= */

  author: {
    name: {
      type: String,
      required: true,
    },

    experience: String,

    specialization: String,

    designation: String,

    description: String,

    profile_img: {
      public_id: String,
      url: String,
    },
  },

  /* ================= BLOG CONTENT ================= */

  content: [
    {
      type: {
        type: String,
        enum: [
          "heading",
          "paragraph",
          "list",
          "number_list",
          "image",
          "video",
          "table",
          "quote",
          "code",
        ],
        required: true,
      },

      /* heading / paragraph text */

      text: String,

      /* heading level (h1-h6) */

      level: {
        type: Number,
        min: 1,
        max: 6,
      },

      /* text color */

      color: {
        type: String,
        default: "#000000",
      },

      /* text alignment */

      align: {
        type: String,
        enum: ["left", "center", "right"],
        default: "left",
      },

      /* bullet / numbered list */

      list_items: [
        {
          type: String,
        },
      ],

      /* table */

      table: {
        headers: [String],

        rows: [[String]],
      },

      /* image / video */

      media: {
        public_id: String,

        url: String,

        caption: String,
      },
    },
  ],

  /* ================= FAQ ================= */

  faqs: [
    {
      question: String,

      answer: String,
    },
  ],

  /* ================= SEO ================= */

  seo: {
    meta_title: String,

    meta_desc: String,

    keywords: {
      type: [String],
      default: [],
    },
  },
},
{
  timestamps: true,
}
);

/* ================= AUTO SLUG ================= */

blogSchema.pre("save", function (next) {

if (this.isModified("title")) {
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
  });
}

next();

});

export default mongoose.model("Blog", blogSchema);
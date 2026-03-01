import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // Auto detect type
    videoType: {
      type: String,
      enum: ["youtube", "local"],
      default: "local",
    },

    youtubeUrl: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "General",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Validation
videoSchema.pre("save", function (next) {
  if (!this.youtubeUrl && !this.videoUrl) {
    return next(new Error("At least one video link is required"));
  }

  next();
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
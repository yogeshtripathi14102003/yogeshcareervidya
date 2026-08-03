import Video from "../models/Admin/Video.js";
// ↑ Name match karo

// ================= ADD VIDEO =================
export const addVideo = async (req, res) => {
  try {
    const {
      title,
      description,
      youtubeUrl,
      videoUrl,
      category,
      thumbnail,
      duration,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!youtubeUrl && !videoUrl) {
      return res.status(400).json({
        success: false,
        message: "YouTube URL or Local URL required",
      });
    }

    let videoType = "local";

    if (
      youtubeUrl &&
      (youtubeUrl.includes("youtube") || youtubeUrl.includes("youtu.be"))
    ) {
      videoType = "youtube";
    }

    const video = new Video({
      title,
      description,
      youtubeUrl,
      videoUrl,
      category,
      thumbnail,
      duration,
      videoType,
    });

    await video.save();

    res.status(201).json({
      success: true,
      message: "Video added successfully",
      video,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL VIDEOS =================
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE VIDEO =================
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndDelete(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
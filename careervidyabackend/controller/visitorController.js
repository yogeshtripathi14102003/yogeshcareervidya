import Visitor from "../models/Admin/Visitor.js";

/* ================= CREATE (TRACK VISITOR) ================= */
export const createVisitor = async (req, res) => {
  try {
    const { browser, device, os, referrer, page } = req.body;

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "Unknown";

    const userAgent = req.headers["user-agent"];

    // 🔒 One visitor per day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const exists = await Visitor.findOne({
      ip,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (exists) {
      return res.status(200).json({
        success: true,
        message: "Visitor already counted today",
      });
    }

    const visitor = await Visitor.create({
      ip,
      userAgent,
      browser,
      device,
      os,
      referrer,
      page,
    });

    res.status(201).json({ success: true, visitor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= READ (ALL VISITORS) ================= */
export const getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, visitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= READ (TOTAL UNIQUE VISITORS) ================= */
export const getTotalVisitors = async (req, res) => {
  try {
    const total = await Visitor.distinct("ip");
    res.status(200).json({
      success: true,
      totalVisitors: total.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= READ (DAILY UNIQUE VISITORS) ================= */
export const getDailyVisitors = async (req, res) => {
  try {
    const dailyVisitors = await Visitor.aggregate([
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            ip: "$ip",
          },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({ success: true, dailyVisitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE VISITOR ================= */
export const updateVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!visitor) {
      return res.status(404).json({ success: false, message: "Visitor not found" });
    }

    res.status(200).json({ success: true, visitor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE VISITOR ================= */
export const deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);

    if (!visitor) {
      return res.status(404).json({ success: false, message: "Visitor not found" });
    }

    res.status(200).json({ success: true, message: "Visitor deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

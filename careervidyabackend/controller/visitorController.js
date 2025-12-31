import Visitor from "../models/Admin/Visitor.js";

/* ---------- TRACK VISITOR ---------- */
export const trackVisitor = async (req, res) => {
  try {
    const { page, browser, device, os, referrer, isReturning } = req.body;

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "Unknown";

    const userAgent = req.headers["user-agent"];

    await Visitor.create({
      ip,
      userAgent,
      browser,
      device,
      os,
      referrer,
      page,
      isReturning,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Visitor Track Error:", error);
    res.status(500).json({ success: false });
  }
};

/* ---------- TOTAL VISITORS ---------- */
export const getTotalVisitors = async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    res.status(200).json({ success: true, totalVisitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------- UNIQUE VISITORS ---------- */
export const getUniqueVisitors = async (req, res) => {
  try {
    const uniqueVisitors = await Visitor.distinct("ip");
    res.status(200).json({ success: true, uniqueVisitors: uniqueVisitors.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------- DAILY VISITORS ---------- */
export const getDailyVisitors = async (req, res) => {
  try {
    const dailyVisitors = await Visitor.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
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

import Visitor from "../models/Admin/Visitor.js";

// Helper: Get client IP
const getClientIP = (req) => {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  return req.connection.remoteAddress || req.socket.remoteAddress || null;
};

// TRACK VISITOR
export const trackVisitor = async (req, res) => {
  try {
    const { page, browser, device, os, referrer } = req.body;
    const ip = getClientIP(req);
    const userAgent = req.headers["user-agent"];

    if (!ip) return res.status(400).json({ success: false, message: "IP not detected" });

    let visitor = await Visitor.findOne({ ip });

    if (visitor) {
      // Returning visitor
      visitor.visits += 1;
      visitor.isReturning = true;
      visitor.lastVisitedAt = new Date();

      // Update page info
      const pageIndex = visitor.pages.findIndex((p) => p.page === page);
      if (pageIndex > -1) {
        visitor.pages[pageIndex].count += 1;
      } else {
        visitor.pages.push({ page, count: 1 });
      }

      await visitor.save();
      return res.status(200).json({ success: true, message: "Returning visitor tracked" });
    }

    // New visitor
    await Visitor.create({
      ip,
      userAgent,
      browser,
      device,
      os,
      referrer,
      visits: 1,
      pages: [{ page, count: 1 }],
      isReturning: false,
      lastVisitedAt: new Date(),
    });

    res.status(201).json({ success: true, message: "New visitor tracked" });
  } catch (error) {
    console.error("Visitor Track Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------- Total Visits ---------- */
export const getTotalVisitors = async (req, res) => {
  try {
    const result = await Visitor.aggregate([{ $group: { _id: null, totalVisits: { $sum: "$visits" } } }]);
    res.status(200).json({ success: true, totalVisitors: result[0]?.totalVisits || 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------- Unique Visitors ---------- */
export const getUniqueVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({}).select("_id ip visits lastVisitedAt").sort({ lastVisitedAt: -1 });
    res.status(200).json({ success: true, visitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------- Daily Visitors ---------- */
export const getDailyVisitors = async (req, res) => {
  try {
    const dailyVisitors = await Visitor.aggregate([
      { $group: { _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } }, count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);
    res.status(200).json({ success: true, dailyVisitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------- Get Visitor By ID ---------- */
export const getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });
    res.status(200).json({ success: true, visitor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

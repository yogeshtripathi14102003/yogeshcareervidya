import Student from "../models/Admin/ourStudent.js";
import GetInTouch from "../models/Admin/getInTouch.js";

export const getDashboardGraphData = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    // MONTH NAMES
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // -------- STUDENTS MONTHWISE ----------
    const studentData = await Student.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const students = months.map((m, index) => ({
      month: m,
      count: studentData.find(d => d._id.month === index + 1)?.count || 0
    }));

    // -------- GET IN TOUCH MONTHWISE ----------
    const queriesData = await GetInTouch.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const queries = months.map((m, index) => ({
      month: m,
      count: queriesData.find(d => d._id.month === index + 1)?.count || 0
    }));

    return res.status(200).json({
      success: true,
      year,
      students,
      queries,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

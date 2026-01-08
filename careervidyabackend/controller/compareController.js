import University from "../models/Admin/University.js"

// export const compareUniversities = async (req, res) => {
//   try {
//     const { ids } = req.query;

//     if (!ids) {
//       return res.status(400).json({
//         success: false,
//         message: "University IDs required",
//       });
//     }

//     const idArray = ids.split(",");

//     if (idArray.length < 2) {
//       return res.status(400).json({
//         success: false,
//         message: "Minimum 2 universities required",
//       });
//     }

//     const universities = await University.find({
//       _id: { $in: idArray },
//     });

//     res.status(200).json({
//       success: true,
//       data: universities,
//     });
//   } catch (error) {
//     console.error("Compare Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };



export const compareUniversities = async (req, res) => {
  try {
    const { ids } = req.query;

    // ❌ ids missing
    if (!ids) {
      return res.status(400).json({
        success: false,
        message: "University IDs are required",
      });
    }

    // string → array
    const idArray = ids.split(",").filter(Boolean);

    // ❌ minimum 2 required
    if (idArray.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Select at least 2 universities to compare",
      });
    }

    // DB Query
    const universities = await University.find({
      _id: { $in: idArray },
    })
      .select(`
        name
        slug
        universityImage
        background
        approvals
        recognition
        admission
        courses
      `);

    return res.status(200).json({
      success: true,
      count: universities.length,
      data: universities,
    });
  } catch (error) {
    console.error("COMPARE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

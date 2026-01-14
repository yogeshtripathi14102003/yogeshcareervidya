import StateDistrict from "../models/Admin/StateDistrictmodel.js";

/* ================= BULK UPLOAD ================= */
export const bulkUploadStatesDistricts = async (req, res) => {
  try {
    const data = req.body; // array expected

    if (!Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        message: "Array of states required",
      });
    }

    let inserted = 0;
    let updated = 0;

    for (const item of data) {
      const { state, districts } = item;

      if (!state || !Array.isArray(districts)) continue;

      const existing = await StateDistrict.findOne({ state });

      if (existing) {
        // merge unique districts
        existing.districts = [
          ...new Set([...existing.districts, ...districts]),
        ];
        await existing.save();
        updated++;
      } else {
        await StateDistrict.create({ state, districts });
        inserted++;
      }
    }

    res.status(200).json({
      success: true,
      message: "Bulk upload completed",
      inserted,
      updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/* ================= GET ALL STATES ================= */
export const getAllStates = async (req, res) => {
  const states = await StateDistrict.find().select("state -_id");
  res.json({
    success: true,
    states: states.map((s) => s.state),
  });
};

/* ================= GET DISTRICTS BY STATE ================= */
export const getDistrictsByState = async (req, res) => {
  const { state } = req.params;

  const data = await StateDistrict.findOne({ state });

  if (!data) {
    return res.status(404).json({
      success: false,
      message: "State not found",
    });
  }

  res.json({
    success: true,
    districts: data.districts,
  });
};

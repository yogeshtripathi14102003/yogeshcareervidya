import AssignmentConfig from "../models/counselor/AssignmentConfig.js";
import { getAssignmentConfig, invalidateAssignmentConfigCache } from "../utilities/leadAssignmentEngine.js";

export const getConfig = async (req, res) => {
  try {
    const config = await getAssignmentConfig({ fresh: true });
    res.status(200).json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const ALLOWED_FIELDS = [
  "activeStrategy",
  "autoAssignOnCreate",
  "considerWorkload",
  "fallbackToRoundRobin",
  "stateMap",
  "cityMap",
  "courseMap",
  "universityMap",
  "priorityMap",
];

export const updateConfig = async (req, res) => {
  try {
    const updates = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in req.body) updates[key] = req.body[key];
    }

    let config = await AssignmentConfig.findOne();
    if (!config) {
      config = await AssignmentConfig.create(updates);
    } else {
      Object.assign(config, updates);
      await config.save();
    }

    invalidateAssignmentConfigCache();

    res.status(200).json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

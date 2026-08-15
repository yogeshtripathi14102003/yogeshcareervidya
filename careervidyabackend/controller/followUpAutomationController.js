import FollowUpAutomationConfig from "../models/counselor/FollowUpAutomationConfig.js";
import AutomationLog from "../models/counselor/AutomationLog.js";
import { runFollowUpSweep } from "../utilities/followUpAutomationEngine.js";

export const getFollowUpConfig = async (req, res) => {
  try {
    let config = await FollowUpAutomationConfig.findOne();
    if (!config) config = await FollowUpAutomationConfig.create({});
    res.status(200).json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateFollowUpConfig = async (req, res) => {
  try {
    const { enabled, steps } = req.body;

    let config = await FollowUpAutomationConfig.findOne();
    if (!config) config = new FollowUpAutomationConfig();

    if (typeof enabled === "boolean") config.enabled = enabled;
    if (Array.isArray(steps)) {
      // Validate each step before accepting the whole array.
      const valid = steps.every(
        (s) =>
          s.label &&
          Number.isFinite(Number(s.afterMinutes)) &&
          Number(s.afterMinutes) > 0 &&
          ["reminder", "manager_notification", "auto_reassign"].includes(s.action)
      );
      if (!valid) {
        return res.status(400).json({
          success: false,
          message: "Each step needs a label, a positive afterMinutes, and a valid action.",
        });
      }
      config.steps = steps.map((s) => ({
        _id: s._id, // preserve existing ids so firedAutomationSteps markers on leads stay meaningful
        label: s.label,
        afterMinutes: Number(s.afterMinutes),
        action: s.action,
      }));
    }

    await config.save();
    res.status(200).json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* Manual "run now" — useful for admin to test the config without waiting
 * for the next scheduled sweep. */
export const runFollowUpSweepNow = async (req, res) => {
  try {
    const result = await runFollowUpSweep();
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAutomationLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action } = req.query;
    const filter = {};
    if (action) filter.action = action;

    const logs = await AutomationLog.find(filter)
      .populate("lead", "name phone course")
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    const total = await AutomationLog.countDocuments(filter);

    res.status(200).json({ success: true, data: logs, total, currentPage: parseInt(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

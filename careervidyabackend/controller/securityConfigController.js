import SecurityConfig from "../models/SecurityConfig.js";
import { getSecurityConfig, invalidateSecurityConfigCache } from "../utilities/securityConfig.js";

export const getSecuritySettings = async (req, res) => {
  try {
    const config = await getSecurityConfig({ fresh: true });
    res.status(200).json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSecuritySettings = async (req, res) => {
  try {
    const { inactivityLimitMinutes } = req.body;
    const minutes = Number(inactivityLimitMinutes);

    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 1440) {
      return res.status(400).json({
        success: false,
        message: "inactivityLimitMinutes must be a number between 1 and 1440.",
      });
    }

    let config = await SecurityConfig.findOne();
    if (!config) config = new SecurityConfig();
    config.inactivityLimitMinutes = minutes;
    await config.save();

    invalidateSecurityConfigCache();

    res.status(200).json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

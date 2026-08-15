import jwt from "jsonwebtoken";
import userModel from "../models/user/AuthModel.js";
import counselorModel from "../models/counselor/Counselor.js";
import { getSecurityConfig } from "../utilities/securityConfig.js";

const THROTTLE_LIMIT   = 60 * 1000;        // Update lastActivity at most once per minute

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax",
  path: "/",
  ...(isProd && { domain: ".careervidya.in" }),
};

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Unauthorized: No token found" });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch {
      return res.status(403).json({ msg: "Token expired", code: "TOKEN_EXPIRED" });
    }

    // 3. Fetch user — lean() for speed, re-fetch only needed fields.
    //    Counselors live in a separate collection with their own token role.
    let user;
    if (decoded.role === "counselor") {
      user = await counselorModel.findById(decoded.id).select("-password -__v").lean();
      if (!user) {
        return res.status(401).json({ msg: "User no longer exists" });
      }
      if (user.status && user.status !== "active") {
        return res.status(403).json({ msg: "Counselor account is not active" });
      }
      user.role = "counselor";
    } else {
      user = await userModel.findById(decoded.id).select("-password -__v").lean();
      if (!user) {
        return res.status(401).json({ msg: "User no longer exists" });
      }
    }

    // 4. Staff inactivity check — admin/subadmin/counselor. Deliberately
    //    excludes regular students, matching the original design intent.
    if (user.role === "admin" || user.role === "subadmin" || user.role === "counselor") {
      const now = Date.now();
      const lastSeen = user.lastActivity ? new Date(user.lastActivity).getTime() : 0;
      const securityConfig = await getSecurityConfig();
      const inactivityLimitMs = securityConfig.inactivityLimitMinutes * 60 * 1000;

      const modelForRole = user.role === "counselor" ? counselorModel : userModel;

      if (lastSeen && now - lastSeen > inactivityLimitMs) {
        // Clear lastActivity in DB
        await modelForRole.updateOne({ _id: user._id }, { $set: { lastActivity: null } });

        res.clearCookie("refreshToken", cookieOptions);
        res.clearCookie("userRole", { ...cookieOptions, httpOnly: false });

        return res.status(401).json({
          msg: "Session expired due to inactivity",
          code: "INACTIVITY_LOGOUT",
        });
      }

      // Throttled lastActivity update — at most once per minute
      if (now - lastSeen > THROTTLE_LIMIT) {
        await modelForRole.updateOne({ _id: user._id }, { $set: { lastActivity: now } });
      }
    }

    // 5. Attach user and continue
    req.user = user;
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

export const optionalAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return next();

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch {
      return next(); // expired/invalid token — just proceed as anonymous
    }

    if (decoded.role === "counselor") {
      const user = await counselorModel.findById(decoded.id).select("-password -__v").lean();
      if (user) {
        user.role = "counselor";
        req.user = user;
      }
    } else {
      const user = await userModel.findById(decoded.id).select("-password -__v").lean();
      if (user) req.user = user;
    }
  } catch (error) {
    console.error("optionalAuth error:", error.message);
  }
  next();
};

export default authMiddleware;
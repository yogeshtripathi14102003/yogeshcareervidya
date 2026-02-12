

// import jwt from "jsonwebtoken";
// import userModel from "../models/user/AuthModel.js";

// const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes in milliseconds

// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     // 🔴 No token
//     if (!authHeader) {
//       return res.status(401).json({ msg: "Unauthorized: No token found" });
//     }

//     // 🔴 Format check
//     const parts = authHeader.split(" ");
//     if (parts.length !== 2 || parts[0] !== "Bearer") {
//       return res.status(401).json({ msg: "Malformed token" });
//     }

//     const token = parts[1];

//     // 🔐 Verify token
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
//     } catch (err) {
//       return res.status(403).json({ msg: "Invalid or expired token" });
//     }

//     // 🔍 Find logged-in user
//     const user = await userModel.findById(decoded.id).select("-otp -__v");

//     if (!user) {
//       return res.status(401).json({ msg: "User no longer exists" });
//     }

//     const now = Date.now();

//     // 🔔 Check inactivity
//     if (user.lastActivity && now - user.lastActivity.getTime() > INACTIVITY_LIMIT) {
//       return res.status(401).json({ msg: "Logged out due to inactivity" });
//     }

//     // ✅ Update lastActivity
//     user.lastActivity = now;
//     await user.save();

//     // ✅ Attach user to request
//     req.user = user;

//     next();
//   } catch (error) {
//     console.error("Auth Middleware Error:", error.message);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

// export default authMiddleware;


import jwt from "jsonwebtoken";
import userModel from "../models/user/AuthModel.js";

// Constants for readability
const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 Minutes
const THROTTLE_LIMIT = 60 * 1000;        // 1 Minute (to reduce DB writes)

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Unauthorized: No token found" });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify Token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      return res.status(403).json({ msg: "Invalid or expired token" });
    }

    // 3. Fetch User from DB
    const user = await userModel.findById(decoded.id).select("-otp -__v");
    if (!user) {
      return res.status(401).json({ msg: "User no longer exists" });
    }

    // 4. --- ADMIN INACTIVITY LOGIC ---
    if (user.role === "admin") {
      const now = Date.now();
      const lastSeen = user.lastActivity ? new Date(user.lastActivity).getTime() : 0;

      // Check if current time exceeds the 15-minute limit
      if (lastSeen && (now - lastSeen > INACTIVITY_LIMIT)) {
        // Clear activity in DB so the session is officially dead
        user.lastActivity = null;
        await user.save();
        return res.status(401).json({ msg: "Admin session expired due to inactivity" });
      }

      /**
       * PERFORMANCE RESOLUTION:
       * Only update user.lastActivity if more than 1 minute has passed 
       * since the last update. This prevents constant DB writing.
       */
      if (now - lastSeen > THROTTLE_LIMIT) {
        user.lastActivity = now;
        await user.save();
      }
    }
    // ---------------------------------

    // 5. Attach user to request and move to next controller
    req.user = user;
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

export default authMiddleware;
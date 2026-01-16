// import jwt from "jsonwebtoken";
// import userModel from "../models/user/AuthModel.js";


// const authMiddleware = async (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ msg: "Unauthorized : No token found" });
//   }

//   try {
//     const parts = token.split(" ");
//     if (parts.length !== 2 || parts[0] !== "Bearer") {
//       return res.status(401).json({ msg: "Malformed token" });
//     }

//     const decode = jwt.verify(parts[1], process.env.JWT_ACCESS_SECRET);
//     req.user = await userModel.findById(decode.id);
//     next();
//   } catch (error) {
//     console.error("Error in token verification:", error);
//     return res.status(403).json({ msg: "Invalid or expired token" });
//   }
// };

// export default authMiddleware;
  


// import jwt from "jsonwebtoken";
// import userModel from "../models/user/AuthModel.js";

// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     // 🔴 No token
//     if (!authHeader) {
//       return res.status(401).json({ msg: "Unauthorized : No token found" });
//     }

//     // 🔴 Format check
//     const parts = authHeader.split(" ");
//     if (parts.length !== 2 || parts[0] !== "Bearer") {
//       return res.status(401).json({ msg: "Malformed token" });
//     }

//     // 🔐 Verify token
//     const decoded = jwt.verify(parts[1], process.env.JWT_ACCESS_SECRET);

//     // 🔍 Find logged-in user
//     const user = await userModel.findById(decoded.id).select("-otp -__v");

//     if (!user) {
//       return res.status(401).json({ msg: "User no longer exists" });
//     }

//     // ✅ Attach user to request
//     req.user = user;

//     next();
//   } catch (error) {
//     console.error("Auth Middleware Error:", error.message);
//     return res.status(403).json({ msg: "Invalid or expired token" });
//   }
// };

// export default authMiddleware;

import jwt from "jsonwebtoken";
import userModel from "../models/user/AuthModel.js";

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes in milliseconds

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔴 No token
    if (!authHeader) {
      return res.status(401).json({ msg: "Unauthorized: No token found" });
    }

    // 🔴 Format check
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ msg: "Malformed token" });
    }

    const token = parts[1];

    // 🔐 Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      return res.status(403).json({ msg: "Invalid or expired token" });
    }

    // 🔍 Find logged-in user
    const user = await userModel.findById(decoded.id).select("-otp -__v");

    if (!user) {
      return res.status(401).json({ msg: "User no longer exists" });
    }

    const now = Date.now();

    // 🔔 Check inactivity
    if (user.lastActivity && now - user.lastActivity.getTime() > INACTIVITY_LIMIT) {
      return res.status(401).json({ msg: "Logged out due to inactivity" });
    }

    // ✅ Update lastActivity
    user.lastActivity = now;
    await user.save();

    // ✅ Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

export default authMiddleware;

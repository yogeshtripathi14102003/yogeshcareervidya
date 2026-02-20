

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

const INACTIVITY_LIMIT = 15 * 60 * 1000; 
const THROTTLE_LIMIT = 60 * 1000;         

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
      // Direct return for frontend interceptor to handle refresh
      return res.status(403).json({ msg: "Token expired", code: "TOKEN_EXPIRED" });
    }

    // 3. Fetch User
    const user = await userModel.findById(decoded.id).select("-password -__v");
    if (!user) {
      return res.status(401).json({ msg: "User no longer exists" });
    }

    // 4. --- ADMIN INACTIVITY LOGIC ---
    if (user.role === "admin" || user.role === "subadmin") {
      const now = Date.now();
      const lastSeen = user.lastActivity ? new Date(user.lastActivity).getTime() : 0;

      if (lastSeen && (now - lastSeen > INACTIVITY_LIMIT)) {
        // Clear database state
        user.lastActivity = null;
        await user.save();
        
        // IMPORTANT: Clear BOTH cookies if you are setting domain-level cookies
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          domain: process.env.NODE_ENV === "production" ? ".careervidya.in" : "localhost",
        };

        res.clearCookie("refreshToken", cookieOptions);
        res.clearCookie("userRole", { ...cookieOptions, httpOnly: false }); // userRole isn't httpOnly

        // Send a specific code so frontend knows it was INACTIVITY
        return res.status(401).json({ 
          msg: "Session expired due to inactivity", 
          code: "INACTIVITY_LOGOUT" 
        });
      }

      // Throttled Update: Use findOneAndUpdate to avoid full document save overhead
      if (now - lastSeen > THROTTLE_LIMIT) {
        await userModel.updateOne({ _id: user._id }, { $set: { lastActivity: now } });
      }
    }

    // 5. Success
    req.user = user;
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

export default authMiddleware;
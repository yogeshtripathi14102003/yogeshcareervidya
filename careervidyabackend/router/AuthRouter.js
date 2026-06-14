
// import authMiddleware from "../middelware/authMiddleware.js";
// import express from "express";
// import { sendOTP,assignAccess ,getAdminProfile,getAllSubAdmins,revokeAccess, verifyOTP, logout,getAllStudents,deleteStudent , getStudentById, refreshAccessToken , getLoggedInStudent } from "../controller/AuthController.js";
// import auth from "../middelware/authMiddleware.js";
// const router = express.Router();

// // Step 1: Send OTP for register or login
// router.post("/send-otp", sendOTP);

// // Step 2: Assign Access (for subadmin)
// router.post("/assign-access", authMiddleware, assignAccess);
// router.get("/me", authMiddleware, getAdminProfile);

// // Management routes (Only for Super Admin)

// router.get("/sub-admins", authMiddleware, getAllSubAdmins);
// router.post("/revoke-access", authMiddleware, revokeAccess);



// // Step 2: Verify OTP (register/login)
// router.post("/verify-otp", verifyOTP);
// router.post("/refresh", refreshAccessToken);

// // Step 3: Logout
// router.post("/logout", logout);
// router.get("/students", authMiddleware, getAllStudents);
// router.get("/students/me", authMiddleware, getLoggedInStudent); 
// router.delete("/students/:id", authMiddleware, deleteStudent);
// // Example route definition
// router.get("/students/:id", authMiddleware, getStudentById);


// export default router;

import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { otpRateLimiter, apiRateLimiter } from "../middelware/rateLimiter.js";
import {
  sendOTP,
  verifyOTP,
  refreshAccessToken,
  logout,
  getAllStudents,
  deleteStudent,
  getStudentById,
  getLoggedInStudent,
  assignAccess,
  getAdminProfile,
  getAllSubAdmins,
  revokeAccess,
} from "../controller/AuthController.js";

const router = express.Router();

// Apply general rate limiter to all auth routes
router.use(apiRateLimiter);

// OTP flow — strict rate limit on both endpoints
router.post("/send-otp",   otpRateLimiter, sendOTP);
router.post("/verify-otp", otpRateLimiter, verifyOTP);

// Token management
router.post("/refresh", refreshAccessToken);
router.post("/logout",  logout);

// Logged-in student (must come before /students/:id to avoid route conflict)
router.get("/students/me", authMiddleware, getLoggedInStudent);

// Student management
router.get("/students",     authMiddleware, getAllStudents);
router.get("/students/:id", authMiddleware, getStudentById);
router.delete("/students/:id", authMiddleware, deleteStudent);

// Admin profile
router.get("/me", authMiddleware, getAdminProfile);

// Sub-admin management (super admin only)
router.post("/assign-access", authMiddleware, assignAccess);
router.post("/revoke-access", authMiddleware, revokeAccess);
router.get("/sub-admins",     authMiddleware, getAllSubAdmins);

export default router;
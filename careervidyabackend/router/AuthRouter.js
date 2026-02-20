
import authMiddleware from "../middelware/authMiddleware.js";
import express from "express";
import { sendOTP,assignAccess ,getAdminProfile,getAllSubAdmins,revokeAccess, verifyOTP, logout,getAllStudents,deleteStudent , getStudentById, refreshAccessToken , getLoggedInStudent } from "../controller/AuthController.js";

const router = express.Router();

// Step 1: Send OTP for register or login
router.post("/send-otp", sendOTP);

// Step 2: Assign Access (for subadmin)
router.post("/assign-access", authMiddleware, assignAccess);
router.get("/me", authMiddleware, getAdminProfile);

// Management routes (Only for Super Admin)

router.get("/sub-admins", authMiddleware, getAllSubAdmins);
router.post("/revoke-access", authMiddleware, revokeAccess);



// Step 2: Verify OTP (register/login)
router.post("/verify-otp", verifyOTP);
router.post("/refresh", refreshAccessToken);

// Step 3: Logout
router.post("/logout", logout);
router.get("/students", getAllStudents);
router.get("/students/me", authMiddleware, getLoggedInStudent); 
router.delete("/students/:id", deleteStudent);
// Example route definition
router.get("/students/:id", getStudentById);


export default router;

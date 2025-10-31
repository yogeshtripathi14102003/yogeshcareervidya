
// import express from "express";
// import { registerStudent, loginStudent } from "../controller/AuthController.js";
// // import { registerStudentValidation, loginStudentValidation } from "../middelware/validation.js";

// const router = express.Router();

// router.post("/signup",  registerStudent);
// router.post("/signin",  loginStudent);

// export default router;


import express from "express";
import { sendOTP, verifyOTP, logout,getAllStudents,deleteStudent } from "../controller/AuthController.js";

const router = express.Router();

// Step 1: Send OTP for register or login
router.post("/send-otp", sendOTP);

// Step 2: Verify OTP (register/login)
router.post("/verify-otp", verifyOTP);

// Step 3: Logout
router.post("/logout", logout);
router.get("/students", getAllStudents); 
router.delete("/students/:id", deleteStudent);
export default router;

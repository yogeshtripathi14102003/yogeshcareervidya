

// // third code 
// import Student from "../models/user/AuthModel.js";
// import VerificationModel from "../models/user/verificationModel.js";

// import {
//   generateAccessToken,
//   generateRefreshToken,
//   verifyRefreshToken,
// } from "../utilities/jwt.js";

// import { generateOTP, hashOTP } from "../utilities/otpUtils.js";
// import { sendToEmail } from "../utilities/sendEmail.js";
// import { sendToSMS } from "../utilities/sendSMS.js";

// import { UAParser } from "ua-parser-js"; // ✅ FIXED IMPORT

// /* -------------------- SEND OTP -------------------- */
// export const sendOTP = async (req, res) => {
//   try {
//     const { emailOrPhone, purpose } = req.body;

//     if (!emailOrPhone || !purpose) {
//       return res
//         .status(400)
//         .json({ msg: "Email/Phone and purpose are required." });
//     }

//     if (!["register", "login"].includes(purpose)) {
//       return res.status(400).json({ msg: "Invalid purpose value." });
//     }

//     const existingUser = await Student.findOne({
//       $or: [{ email: emailOrPhone }, { mobileNumber: emailOrPhone }],
//     });

//     if (purpose === "register" && existingUser) {
//       return res
//         .status(400)
//         .json({ msg: "User already registered. Please log in." });
//     }

//     if (purpose === "login" && !existingUser) {
//       return res
//         .status(400)
//         .json({ msg: "No account found. Please register first." });
//     }

//     const otp = generateOTP();
//     const codeHash = hashOTP(otp);
//     const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

//     await VerificationModel.findOneAndUpdate(
//       { emailOrPhone, purpose },
//       {
//         emailOrPhone,
//         codeHash,
//         method: emailOrPhone.includes("@") ? "email" : "phone",
//         purpose,
//         expiresAt,
//         verified: false,
//         attempts: 0,
//       },
//       { upsert: true, new: true }
//     );

//   if (emailOrPhone.includes("@")) {
//   await sendToEmail({
//     to: emailOrPhone,
//     subject: `${otp} is your verification code`,
//     html: `
//       <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 450px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
//         <div style="background-color: #1a73e8; height: 6px;"></div>
        
//         <div style="padding: 30px 20px 10px 20px; text-align: center;">
//           <h2 style="color: #202124; margin: 0; font-size: 22px;">Verification Required</h2>
//           <p style="color: #5f6368; font-size: 15px; margin-top: 10px;">Enter the verification code below to securely access your account</p>
//         </div>

//         <div style="padding: 20px; text-align: center;">
//           <div style="background-color: #f1f3f4; border-radius: 8px; padding: 25px; display: inline-block; min-width: 200px;">
//             <span style="font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #1a73e8;">${otp}</span>
//           </div>
          
//           <div style="margin-top: 15px; padding: 8px; background-color: #fff4e5; border-radius: 4px; display: inline-block;">
//             <p style="color: #b95000; font-size: 13px; font-weight: bold; margin: 0;">
//               ⚠️ Note: This OTP expires in 5 minutes
//             </p>
//           </div>
//         </div>

//         <div style="padding: 0 30px; color: #3c4043; font-size: 14px;">
//           <p style="margin-bottom: 5px;">Thanks & Regards,</p>
//           <p style="margin: 0; font-weight: bold; color: #1a73e8;">Careervidya</p>
//           <p style="margin: 2px 0; font-style: italic; color: #5f6368; font-size: 12px;">#vidyahaitosuccesshai</p>
//         </div>

//         <div style="margin: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
//           <p style="margin: 0; font-size: 14px; color: #3c4043; font-weight: 500;">Need Help?</p>
//           <p style="margin: 5px 0 10px 0; font-size: 13px; color: #5f6368;">If you did not request this code, reach out to our support team</p>
//           <a href="mailto:support@careervidya.in" style="color: #1a73e8; text-decoration: none; font-weight: bold; font-size: 14px; border: 1px solid #1a73e8; padding: 5px 15px; border-radius: 4px; display: inline-block;">
//             📩 support@careervidya.in
//           </a>
//         </div>

//         <div style="padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
//           <a href="https://careervidya.in" style="text-decoration: none; color: #5f6368; font-size: 13px; font-weight: 600;">Visit our website Careervidya.in</a>
//           <div style="margin-top: 15px; color: #9aa0a6; font-size: 11px;">
//             &copy; ${new Date().getFullYear()} Careervidya.in. All rights reserved.
//           </div>
//         </div>
//       </div>
//     `,
//   });
// } else {
//       await sendToSMS(emailOrPhone, `Your OTP is ${otp}`);
//     }

//     return res.status(200).json({ msg: "OTP sent successfully" });
//   } catch (error) {
//     console.error("Send OTP Error:", error);
//     return res
//       .status(500)
//       .json({ msg: "Failed to send OTP", error: error.message });
//   }
// };

// /* -------------------- VERIFY OTP -------------------- */
// export const verifyOTP = async (req, res) => {
//   try {
//     const {
//       emailOrPhone,
//       otp,
//       purpose,
//       name,
//       city,
//       state,
//       course,
//       gender,
//       addresses,
//       mobileNumber,
//       branch,
//       description,
//       specialization,
//       dob,
//       subsidyCoupon,
//     } = req.body;

//     if (!emailOrPhone || !otp || !purpose) {
//       return res.status(400).json({
//         msg: "Email/Phone, OTP, and purpose are required.",
//       });
//     }

//     const record = await VerificationModel.findOne({ emailOrPhone, purpose });

//     if (!record)
//       return res.status(400).json({ msg: "No OTP record found. Please resend." });
//     if (record.verified)
//       return res.status(400).json({ msg: "OTP already used." });
//     if (record.expiresAt < new Date())
//       return res.status(400).json({ msg: "OTP expired." });

//     if (record.attempts >= 5)
//       return res
//         .status(400)
//         .json({ msg: "Too many invalid attempts. Request new OTP." });

//     const isValid = hashOTP(otp) === record.codeHash;

//     if (!isValid) {
//       record.attempts += 1;
//       await record.save();
//       return res.status(400).json({ msg: "Invalid OTP" });
//     }

//     record.verified = true;
//     await record.save();

//     let student = await Student.findOne({
//       $or: [{ email: emailOrPhone }, { mobileNumber: emailOrPhone }],
//     });

//     /* ----------- REGISTER ----------- */
//     if (purpose === "register") {
//       if (student)
//         return res
//           .status(400)
//           .json({ msg: "User already exists. Please login." });

//       student = await Student.create({
//         name,
//         email: emailOrPhone.includes("@") ? emailOrPhone : undefined,
//         mobileNumber:
//           mobileNumber || (!emailOrPhone.includes("@") ? emailOrPhone : undefined),
//         city,
//         state,
//         course,
//         gender,
//         addresses,
//         branch,
//         description,
//         specialization,
//         dob,
//         subsidyCoupon,
//       });

//       // ------------------- SEND THANK YOU EMAIL -------------------
// if (student.email) {
//   await sendToEmail({
//     to: student.email,
//     subject: "Welcome to Career Vidya!",
//     html: `
//       <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">

//         <div style="background-color: #1a73e8; height: 8px;"></div>

//         <div style="padding: 25px 20px; color: #202124; font-size: 14px; line-height: 1.6;">
//           <p>Hi ${student.name},</p>

//           <p>Warm greetings from the <strong>Career Vidya Edu-Tech Team</strong>, and we welcome you to a journey built on clarity, trust, and informed decision-making.</p>

//           <p>Thank you for registering with Career Vidya. By taking this step, you’ve chosen a platform that believes education decisions should be guided, verified, and stress-free. Whether you are a student, a working professional, or restarting your academic journey, we are here to ensure you receive complete support from start to success.</p>

//           <p>In today’s education landscape, choosing the right university can be overwhelming. With countless options available, questions around degree validity, university credibility, and career outcomes are natural. This is where Career Vidya steps in to simplify choices, remove confusion, and guide you toward programs that genuinely add value to your future. Online education, when chosen correctly, is globally recognized, flexible, and highly effective for modern careers.</p>

//           <p>At Career Vidya, we stand by you at every stage—from understanding your goals to helping you enroll in verified universities and supporting you until placement and beyond.</p>

//           <div style="background-color: #f8f9fa; border-left: 4px solid #1a73e8; padding: 15px; margin: 20px 0;">
//             <p style="color: #1a73e8; font-weight: bold; margin: 0 0 10px 0;">Why students trust Career Vidya:</p>
//             <ul style="margin: 0; padding-left: 18px; color: #3c4043;">
//               <li>100% Free Counselling from Experts</li>
//               <li>One-on-One Personalized Guidance Sessions</li>
//               <li>Association with Verified & Globally Recognized Universities</li>
//               <li>100% Job Assistance Support</li>
//               <li>No-Cost EMI Options</li>
//               <li>Education Loan & Scholarship Assistance</li>
//               <li>Access to a strong network of 10,000+ Alumni</li>
//             </ul>
//           </div>

//           <div style="border: 1px solid #ebe5e3; background-color: #fff5f2; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
//             <p style="margin: 0; font-size: 13px; color: #151718;">Important Note: Career Vidya is completely transparent and legitimate. We do not charge any counselling or guidance fees, and your privacy is our priority. Your data is safe and never misused or shared.</p>
//           </div>

//           <p>If you have any questions, doubts, or need clarity, simply reply to this email—we’re happy to help.</p>

//           <p>You may also connect directly with our expert advisor at <strong style="color: #1a73e8;">+91-9289712364</strong> or email us at <strong style="color: #1a73e8;">info@careervidya.in</strong> for immediate assistance.</p>

//           <p>Before we conclude, we would like to share that Career Vidya is led by <strong>Mr. Abhimanyu Singh Chauhan, Founder & CEO</strong>, who has been associated with the education sector for several years. His vision has always been to provide honest guidance, verified institutions, and complete clarity to every individual.</p>

//           <p>Your future deserves the right direction, and we are honored to walk this journey with you.</p>

//           <div style="margin-top: 25px; padding-top: 15px; border-top: 1px dashed #e0e0e0;">
//             <p style="margin: 0;">Warm regards,</p>
//             <p style="margin: 5px 0 0 0; font-weight: bold;">Abhimanyu Singh Chauhan</p>
//             <p style="margin: 2px 0; color: #1a73e8; font-weight: bold;">Founder & CEO – Career Vidya</p>
//             <p style="margin: 5px 0 0 0; font-size: 12px; color: #9aa0a6; font-style: italic;">Your Trusted Education Guidance Platform</p>
//           </div>
//         </div>

//         <div style="padding: 15px; text-align: center; background-color: #f1f3f4; font-size: 11px; color: #70757a;">
//           &copy; ${new Date().getFullYear()} Career Vidya. All rights reserved. <br>
//           <a href="https://careervidya.in" style="color: #70757a; text-decoration: underline;">www.careervidya.in</a>
//         </div>

//       </div>
//     `,
//   });
// }

//     }

//     if (purpose === "login" && !student)
//       return res
//         .status(400)
//         .json({ msg: "User not found. Please register first." });

//     /* ---------------- ADMIN LOGIN EMAIL NOTIFICATION ---------------- */
//     if (student.role === "admin") {
//       // Get IP
//       const ip =
//         req.headers["x-forwarded-for"] ||
//         req.connection.remoteAddress ||
//         req.socket.remoteAddress;

//       // Parse user agent
//       const parser = new UAParser(req.headers["user-agent"]);
//       const ua = parser.getResult();

//       const browser = `${ua.browser.name || "Unknown"} ${
//         ua.browser.version || ""
//       }`;
//       const os = `${ua.os.name || "Unknown"} ${ua.os.version || ""}`;
//       const device = ua.device.model || "Desktop / Laptop";

//       // Fetch location using ipapi.co
//       let locationData = {};
//       try {
//         const fetchRes = await fetch(`https://ipapi.co/${ip}/json/`);
//         locationData = await fetchRes.json();
//       } catch (err) {
//         locationData = { city: "Unknown", region: "Unknown", country: "Unknown" };
//       }

//       await sendToEmail({
//         to: process.env.ADMIN_NOTIFICATION_EMAIL,
//         subject: "Admin Logged In",
//         html: `
//           <h2>Admin Login Alert</h2>
//           <p><b>Admin Email:</b> ${student.email}</p>
//           <p><b>Login Time:</b> ${new Date().toLocaleString()}</p>
//           <h3>System Details</h3>
//           <p><b>IP Address:</b> ${ip}</p>
//           <p><b>Browser:</b> ${browser}</p>
//           <p><b>Operating System:</b> ${os}</p>
//           <p><b>Device:</b> ${device}</p>
//           <h3>Location</h3>
//           <p><b>City:</b> ${locationData.city}</p>
//           <p><b>Region:</b> ${locationData.region}</p>
//           <p><b>Country:</b> ${locationData.country_name}</p>
//         `,
//       });
//     }

//     /* ------------------- GENERATE TOKENS ------------------- */
//     const accessToken = generateAccessToken(student._id);
//     const refreshToken = generateRefreshToken(student._id);

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "Strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({
//       msg: purpose === "register" ? "Registration successful" : "Login successful",
//       accessToken,
//       student: {
//         id: student._id,
//         name: student.name,
//         email: student.email,
//         mobileNumber: student.mobileNumber,
//         city: student.city,
//         state: student.state,
//         course: student.course,
//         gender: student.gender,
//         addresses: student.addresses,
//         branch: student.branch,
//         description: student.description,
//         specialization: student.specialization,
//         dob: student.dob,
//         subsidyCoupon: student.subsidyCoupon,
//         role: student.role,
//       },
//     });
//   } catch (error) {
//     console.error("Verify OTP Error:", error);
//     return res.status(500).json({
//       msg: "OTP verification failed",
//       error: error.message,
//     });
//   }
// };

// /* -------------------- REFRESH ACCESS TOKEN -------------------- */
// export const refreshAccessToken = async (req, res) => {
//   try {
//     const token = req.cookies.refreshToken;

//     if (!token) {
//       return res.status(401).json({ msg: "Refresh token missing" });
//     }

//     const decoded = verifyRefreshToken(token);

//     if (!decoded?.id) {
//       return res.status(401).json({ msg: "Invalid refresh token" });
//     }

//     const newAccessToken = generateAccessToken(decoded.id);

//     return res.status(200).json({
//       accessToken: newAccessToken,
//     });
//   } catch (error) {
//     console.error("Refresh Token Error:", error);
//     return res.status(401).json({
//       msg: "Refresh token invalid or expired",
//       error: error.message,
//     });
//   }
// };

// /* -------------------- LOGOUT -------------------- */
// export const logout = async (req, res) => {
//   try {
//     res.clearCookie("refreshToken");
//     return res.status(200).json({ msg: "Logged out successfully" });
//   } catch (err) {
//     console.error("Logout Error:", err);
//     return res.status(500).json({ msg: "Logout failed", error: err.message });
//   }
// };

// /* -------------------- GET ALL STUDENTS -------------------- */
// export const getAllStudents = async (req, res) => {
//   try {
//     const students = await Student.find({ role: { $ne: "admin" } }).select(
//       "-password"
//     );

//     if (students.length === 0)
//       return res.status(404).json({ msg: "No students found" });

//     return res.status(200).json({ count: students.length, students });
//   } catch (error) {
//     console.error("Get All Students Error:", error);
//     return res
//       .status(500)
//       .json({ msg: "Failed to fetch students", error: error.message });
//   }
// };

// /* -------------------- DELETE STUDENT -------------------- */
// export const deleteStudent = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) return res.status(400).json({ msg: "Student ID is required" });

//     const deletedStudent = await Student.findByIdAndDelete(id);

//     if (!deletedStudent)
//       return res.status(404).json({ msg: "Student not found" });

//     return res.status(200).json({ msg: "Student deleted successfully" });
//   } catch (error) {
//     console.error("Delete Student Error:", error);
//     return res
//       .status(500)
//       .json({ msg: "Failed to delete student", error: error.message });
//   }
// };

// /* -------------------- GET STUDENT BY ID -------------------- */
// export const getStudentById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({ msg: "Student ID is required" });
//     }

//     const student = await Student.findById(id).select("-password");

//     if (!student) {
//       return res.status(404).json({ msg: "Student not found" });
//     }

//     return res.status(200).json({ student });
//   } catch (error) {
//     console.error("Get Student By ID Error:", error);
    
//     // Check if the error is due to an invalid MongoDB ObjectId format
//     if (error.kind === "ObjectId") {
//       return res.status(400).json({ msg: "Invalid Student ID format" });
//     }

//     return res
//       .status(500)
//       .json({ msg: "Failed to fetch student", error: error.message });
//   }
// };


// export const getLoggedInStudent = (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ msg: "Unauthorized" });
//     }

//     res.status(200).json({
//       success: true,
//       student: req.user,
//     });
//   } catch (error) {
//     console.error("getLoggedInStudent error:", error);
//     res.status(500).json({ msg: "Server error" });
//   }
// };




// // ---------------- ASSIGN ACCESS CONTROLLER ----------------
// export const assignAccess = async (req, res) => {
//   try {
//     const { email, permissions } = req.body;

//     // Only admin can give access
//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         msg: "Only admin can assign permissions",
//       });
//     }

//     if (!email || !permissions || permissions.length === 0) {
//       return res.status(400).json({
//         msg: "Email and permissions are required",
//       });
//     }

//     // Find user
//     const user = await Student.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         msg: "User not found",
//       });
//     }

//     // Make subadmin
//     user.role = "subadmin";

//     // Save permissions
//     user.permissions = permissions;

//     await user.save();

//     return res.status(200).json({
//       msg: "Access assigned successfully",
//       user: {
//         email: user.email,
//         role: user.role,
//         permissions: user.permissions,
//       },
//     });

//   } catch (error) {
//     console.error("Assign Access Error:", error);

//     return res.status(500).json({
//       msg: "Server error",
//       error: error.message,
//     });
//   }
// };






import mongoose from "mongoose";
import Student from "../models/user/AuthModel.js";
import VerificationModel from "../models/user/verificationModel.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utilities/jwt.js";

import { generateOTP, hashOTP } from "../utilities/otpUtils.js";
import { sendToEmail } from "../utilities/sendEmail.js";
import { sendToSMS } from "../utilities/sendSMS.js";

// ✅ Import templates
import { getOTPTemplate, getWelcomeTemplate } from "../utilities/emailTemplates.js";

/* -------------------- SEND OTP -------------------- */
export const sendOTP = async (req, res) => {
  try {
    const { emailOrPhone, purpose } = req.body;

    if (!emailOrPhone || !purpose || !["register", "login"].includes(purpose)) {
      return res.status(400).json({ msg: "Valid Email/Phone and purpose ('register' or 'login') are required." });
    }

    const isEmail = emailOrPhone.includes("@");
    const query = isEmail ? { email: emailOrPhone } : { mobileNumber: emailOrPhone };
    const existingUser = await Student.findOne(query).select("_id").lean();

    if (purpose === "register" && existingUser) {
      return res.status(400).json({ msg: "User already registered. Please log in." });
    }
    if (purpose === "login" && !existingUser) {
      return res.status(400).json({ msg: "No account found. Please register first." });
    }

    const otp = generateOTP();
    const codeHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // Upsert strategy to prevent spam and maintain clean records
    await VerificationModel.findOneAndUpdate(
      { emailOrPhone, purpose },
      { 
        codeHash, 
        expiresAt, 
        verified: false, 
        attempts: 0, 
        method: isEmail ? "email" : "phone" 
      },
      { upsert: true, new: true }
    );

    if (isEmail) {
      await sendToEmail({
        to: emailOrPhone,
        subject: `${otp} is your verification code`,
        html: getOTPTemplate(otp),
      });
    } else {
      await sendToSMS(emailOrPhone, `Your OTP is ${otp}. Valid for 5 mins.`);
    }

    return res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

/* -------------------- VERIFY OTP -------------------- */
export const verifyOTP = async (req, res) => {
  try {
    const { emailOrPhone, otp, purpose, ...userData } = req.body;

    if (!emailOrPhone || !otp || !purpose) {
      return res.status(400).json({ msg: "Missing required fields." });
    }

    const record = await VerificationModel.findOne({ emailOrPhone, purpose });

    if (!record) return res.status(400).json({ msg: "OTP not requested or expired." });
    if (record.verified) return res.status(400).json({ msg: "OTP already verified." });
    if (record.expiresAt < new Date()) return res.status(400).json({ msg: "OTP expired." });
    if (record.attempts >= 5) return res.status(429).json({ msg: "Too many attempts. Try again later." });

    // Validate OTP
    if (hashOTP(otp) !== record.codeHash) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // Success - Mark as verified or Delete
    await VerificationModel.deleteOne({ _id: record._id }); 

    let student = await Student.findOne({
      $or: [{ email: emailOrPhone }, { mobileNumber: emailOrPhone }],
    });

    if (purpose === "register") {
      if (student) return res.status(400).json({ msg: "User already exists." });

      student = await Student.create({
        ...userData,
        email: emailOrPhone.includes("@") ? emailOrPhone : userData.email,
        mobileNumber: !emailOrPhone.includes("@") ? emailOrPhone : userData.mobileNumber,
      });

      if (student.email) {
        sendToEmail({
          to: student.email,
          subject: "Welcome to Career Vidya!",
          html: getWelcomeTemplate(student.name),
        }).catch(err => console.error("Welcome Email Error:", err));
      }
    }

    if (!student) return res.status(404).json({ msg: "Account not found." });

    // JWT Generation
    const accessToken = generateAccessToken(student._id);
    const refreshToken = generateRefreshToken(student._id);
// Backend verifyOTP logic
const isProd = process.env.NODE_ENV === "production";

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: isProd, // Local (http) pe false rahega, Live (https) pe true
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  ...(isProd && { domain: ".careervidya.in" })
});

    // Sanitized student object
    const studentData = student.toObject();
    delete studentData.password;
    delete studentData.__v;

    return res.status(200).json({
      msg: purpose === "register" ? "Registration successful" : "Login successful",
      accessToken,
      student: studentData
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ msg: "Verification failed" });
  }
};

// ... Baki controllers (refreshAccessToken, logout, getAllStudents, etc.) as it is rahenge
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ msg: "Refresh token missing" });
    }

    const decoded = verifyRefreshToken(token);

    if (!decoded?.id) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    // Fetch user to check role and activity
    const user = await Student.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // --- INACTIVITY CHECK FOR ADMIN/SUBADMIN ---
    if (user.role === "admin" || user.role === "subadmin") {
      const now = Date.now();
      const lastSeen = user.lastActivity ? new Date(user.lastActivity).getTime() : 0;
      const INACTIVITY_LIMIT = 15 * 60 * 1000;

      if (lastSeen && (now - lastSeen > INACTIVITY_LIMIT)) {
        // Session expire ho chuka hai, cookie saaf karo
        res.clearCookie("refreshToken");
        user.lastActivity = null;
        await user.save();
        return res.status(401).json({ msg: "Session expired due to inactivity. Please login again." });
      }
      
      // Note: Hum yahan lastActivity update nahi kar rahe kyunki refresh token 
      // background call hai. Activity sirf main API calls (authMiddleware) se update honi chahiye.
    }

    // Generate new Access Token
    const newAccessToken = generateAccessToken(user._id);

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(401).json({
      msg: "Refresh token invalid or expired",
    });
  }
};

/* -------------------- LOGOUT -------------------- */
export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    return res.status(200).json({ msg: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ msg: "Logout failed", error: err.message });
  }
};

/* -------------------- GET ALL STUDENTS -------------------- */
export const getAllStudents = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20); // Max limit cap for security
    const skip = (page - 1) * limit;

    // Parallel execution for speed
    const [students, total] = await Promise.all([
      Student.find({ role: { $ne: "admin" } })
        .select("-password -__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments({ role: { $ne: "admin" } })
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        pageSize: students.length
      },
      students
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error" });
  }
};

/* -------------------- DELETE STUDENT -------------------- */
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ msg: "Student ID is required" });

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent)
      return res.status(404).json({ msg: "Student not found" });

    return res.status(200).json({ msg: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete Student Error:", error);
    return res
      .status(500)
      .json({ msg: "Failed to delete student", error: error.message });
  }
};

/* -------------------- GET STUDENT BY ID -------------------- */
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Student ID format" });
    }

    const student = await Student.findById(id).select("-password -__v").lean();

    if (!student) return res.status(404).json({ msg: "Student not found" });

    return res.status(200).json({ success: true, student });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getLoggedInStudent = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    res.status(200).json({
      success: true,
      student: req.user,
    });
  } catch (error) {
    console.error("getLoggedInStudent error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};






// 1. CREATE / UPDATE ACCESS (Assign Permissions)
export const assignAccess = async (req, res) => {
  try {
    const { email, permissions } = req.body;

    if (!email || !Array.isArray(permissions)) {
      return res.status(400).json({ msg: "Valid Email and Permissions array required" });
    }

    const user = await Student.findOneAndUpdate(
      { email },
      { 
        $set: { 
          role: "subadmin", 
          permissions: permissions 
        } 
      },
      { new: true, runValidators: true }
    ).select("email role permissions").lean();

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.status(200).json({ msg: "Access updated successfully", user });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to assign access" });
  }
};

// 2. READ (Get Profile & Permissions for Logged-in User)
export const getAdminProfile = async (req, res) => {
  try {
    // req.user.id auth middleware se aana chahiye
    const user = await Student.findById(req.user.id)
      .select("email role permissions")
      .lean();

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.status(200).json({
      success: true,
      role: user.role, 
      permissions: user.permissions || []
    });
  } catch (error) {
    return res.status(500).json({ msg: "Error fetching profile" });
  }
};

// 3. READ ALL (Get All Sub-Admins List for Super Admin)
export const getAllSubAdmins = async (req, res) => {
  try {
    const subAdmins = await Student.find({ role: "subadmin" })
      .select("email role permissions")
      .lean();
    
    return res.status(200).json(subAdmins);
  } catch (error) {
    return res.status(500).json({ msg: "Failed to fetch sub-admins" });
  }
};

// 4. DELETE / REVOKE (Remove All Access & Reset Role)
export const revokeAccess = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Student.findOneAndUpdate(
      { email },
      { 
        $set: { 
          role: "student", // Normal user role
          permissions: [] // Khali array
        } 
      },
      { new: true }
    ).select("email role");

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.status(200).json({ msg: "All permissions removed", user });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to revoke access" });
  }
};
 


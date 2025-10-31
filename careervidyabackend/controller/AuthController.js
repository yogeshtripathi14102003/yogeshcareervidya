import Student from "../models/user/AuthModel.js";
import VerificationModel from "../models/user/VerificationModel.js";
import { generateAccessToken, generateRefreshToken } from "../utilities/jwt.js";
import { generateOTP, hashOTP } from "../utilities/otpUtils.js";
import { sendToEmail } from "../utilities/sendEmail.js";
import { sendToSMS } from "../utilities/sendSMS.js";
import bcrypt from "bcryptjs";

/* -------------------- SEND OTP (Register or Login) -------------------- */
export const sendOTP = async (req, res) => {
  try {
    const { emailOrPhone, purpose } = req.body;

    if (!emailOrPhone || !purpose)
      return res
        .status(400)
        .json({ msg: "Email/Phone and purpose are required." });

    // Validate purpose
    if (!["register", "login"].includes(purpose))
      return res.status(400).json({ msg: "Invalid purpose value." });

    // Check user existence based on purpose
    const existingUser = await Student.findOne({
      $or: [{ email: emailOrPhone }, { mobileNumber: emailOrPhone }],
    });

    if (purpose === "register" && existingUser)
      return res
        .status(400)
        .json({ msg: "User already registered. Please log in." });

    if (purpose === "login" && !existingUser)
      return res
        .status(400)
        .json({ msg: "No account found. Please register first." });

    // Generate OTP
    const otp = generateOTP();
    const codeHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save or update OTP record
    await VerificationModel.findOneAndUpdate(
      { emailOrPhone, purpose },
      {
        emailOrPhone,
        codeHash,
        method: emailOrPhone.includes("@") ? "email" : "phone",
        purpose,
        expiresAt,
        verified: false,
        attempts: 0,
      },
      { upsert: true, new: true }
    );

    // Send OTP via Email or SMS
    if (emailOrPhone.includes("@")) {
      const emailTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your OTP Code</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
            <tr>
              <td style="padding: 20px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 30px 20px; text-align: center; background-color: #1a73e8; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                      <h1 style="margin: 0; font-size: 24px; color: #ffffff;">Your OTP Code</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 20px; text-align: center;">
                      <h2 style="font-size: 20px; color: #333333; margin: 0 0 20px;">Verify Your Account</h2>
                      <p style="font-size: 16px; color: #666666; line-height: 1.5; margin: 0 0 20px;">
                        Thank you for using our service! Please use the following One-Time Password (OTP) to complete your verification. This code will expire in <strong>5 minutes</strong>.
                      </p>
                      <div style="display: inline-block; padding: 15px 25px; background-color: #e8f0fe; border-radius: 4px; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; color: #1a73e8; letter-spacing: 2px;">${otp}</span>
                      </div>
                      <p style="font-size: 14px; color: #666666; line-height: 1.5; margin: 0 0 20px;">
                        If you did not request this code, please ignore this email or contact our support team.
                      </p>
                      <a href="mailto:support@example.com" style="font-size: 14px; color: #1a73e8; text-decoration: none;">Contact Support</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px; text-align: center; background-color: #f4f4f4; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                      <p style="font-size: 12px; color: #999999; margin: 0;">
                        &copy; 2025 Your Company Name. All rights reserved.<br>
                        <a href="https://www.careervidya.in" style="color: #1a73e8; text-decoration: none;">Visit our website</a> | 
                        <a href="https://www.example.com/privacy" style="color: #1a73e8; text-decoration: none;">Privacy Policy</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
      await sendToEmail({
        to: emailOrPhone,
        subject: "Your OTP Code",
        html: emailTemplate,
      });
    } else {
      await sendToSMS(
        emailOrPhone,
        `Your OTP is ${otp}. It expires in 5 minutes.`
      );
    }

    return res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res
      .status(500)
      .json({ msg: "Failed to send OTP", error: error.message });
  }
};

/* -------------------- VERIFY OTP -------------------- */
export const verifyOTP = async (req, res) => {
  try {
    const {
      emailOrPhone,
      otp,
      purpose,
      name,
      city,
      state,
      courese,
      gender,
      addresses,
    } = req.body;

    if (!emailOrPhone || !otp || !purpose)
      return res
        .status(400)
        .json({ msg: "Email/Phone, OTP, and purpose are required." });

    const record = await VerificationModel.findOne({ emailOrPhone, purpose });

    if (!record)
      return res
        .status(400)
        .json({ msg: "No OTP record found. Please resend." });
    if (record.verified)
      return res.status(400).json({ msg: "OTP already used." });
    if (record.expiresAt < new Date())
      return res
        .status(400)
        .json({ msg: "OTP expired. Please request a new one." });

    // Check attempt limit
    if (record.attempts >= 5)
      return res
        .status(400)
        .json({ msg: "Too many invalid attempts. Request new OTP." });

    // Validate OTP
    const isValid = hashOTP(otp) === record.codeHash;
    if (!isValid) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    record.verified = true;
    await record.save();

    let student = await Student.findOne({
      $or: [{ email: emailOrPhone }, { mobileNumber: emailOrPhone }],
    });

    // Handle registration
    if (purpose === "register") {
      if (student)
        return res
          .status(400)
          .json({ msg: "User already exists. Please login." });

      student = await Student.create({
        name,
        email: emailOrPhone.includes("@") ? emailOrPhone : undefined,
        mobileNumber: !emailOrPhone.includes("@") ? emailOrPhone : undefined,
        city,
        state,
        courese,
        gender,
        addresses,
      });
    }

    // Handle login
    if (purpose === "login" && !student)
      return res
        .status(400)
        .json({ msg: "User not found. Please register first." });

    // Generate tokens
    const accessToken = generateAccessToken(student._id);
    const refreshToken = generateRefreshToken(student._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      msg:
        purpose === "register" ? "Registration successful" : "Login successful",
      accessToken,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        mobileNumber: student.mobileNumber,
        city: student.city,
        state: student.state,
        courese: student.course,
        gender: student.gender,
        role: student.role,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res
      .status(500)
      .json({ msg: "OTP verification failed", error: error.message });
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
    const students = await Student.find().select("-password"); // exclude password if any
    if (students.length === 0)
      return res.status(404).json({ msg: "No students found" });

    return res.status(200).json({ count: students.length, students });
  } catch (error) {
    console.error("Get All Students Error:", error);
    return res.status(500).json({ msg: "Failed to fetch students", error: error.message });
  }
};

/* -------------------- DELETE STUDENT -------------------- */
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params; // or req.body if you prefer body-based delete

    if (!id) return res.status(400).json({ msg: "Student ID is required" });

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent)
      return res.status(404).json({ msg: "Student not found" });

    return res.status(200).json({ msg: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete Student Error:", error);
    return res.status(500).json({ msg: "Failed to delete student", error: error.message });
  }
};











import Counselor from "../models/counsler/Counselor.js";
import bcrypt from "bcryptjs";

/* ===============================
   CREATE - Register Counselor
================================ */
export const createCounselor = async (req, res) => {
  try {
    const {
      name,
      email,
      userid,
      password,
      phone,
      pan,
      aadhar,
      dob,
      doj,
      address,
      status, // ✅ NEW
    } = req.body;

    /* Validation */
    if (!name || !email || !userid || !password) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    /* Check Duplicate */
    const exists = await Counselor.findOne({
      $or: [{ email }, { userid }],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email or UserID already exists",
      });
    }

    /* Hash Password */
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const counselor = await Counselor.create({
      name,
      email,
      userid,
      password: hashPassword,
      phone,
      pan,
      aadhar,
      dob,
      doj,
      address,

      // ✅ Status (agar na bhejo to default active lagega)
      status: status || "active",
    });

    res.status(201).json({
      success: true,
      message: "Counselor Created Successfully",
      data: counselor,
    });
  } catch (error) {
    console.error("Create Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

/* ===============================
   READ ALL Counselors
================================ */
export const getAllCounselors = async (req, res) => {
  try {
    const counselors = await Counselor.find()
      .select("-password");

    res.status(200).json({
      success: true,
      total: counselors.length,
      data: counselors,
    });
  } catch (error) {
    console.error("Fetch All Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ===============================
   READ Single Counselor
================================ */
export const getCounselorById = async (req, res) => {
  try {
    const counselor = await Counselor.findById(req.params.id)
      .select("-password");

    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: counselor,
    });
  } catch (error) {
    console.error("Fetch One Error:", error);

    res.status(500).json({
      success: false,
      message: "Invalid ID / Server Error",
    });
  }
};

/* ===============================
   UPDATE Counselor
================================ */
export const updateCounselor = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = { ...req.body };

    /* ✅ Status Validation */
    if (req.body.status) {
      const allowed = ["active", "leave", "Inactive"];

      if (!allowed.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value",
        });
      }
    }

    /* If Password Updated → Hash */
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    const counselor = await Counselor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Counselor Updated",
      data: counselor,
    });
  } catch (error) {
    console.error("Update Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

/* ===============================
   DELETE Counselor
================================ */
export const deleteCounselor = async (req, res) => {
  try {
    const { id } = req.params;

    const counselor = await Counselor.findByIdAndDelete(id);

    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Counselor Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


/* ===============================
   LOGIN
================================ */
/* ===============================
   LOGIN Counselor (userid + password)
================================ */
export const loginCounselor = async (req, res) => {
  try {
    const { userid, password } = req.body;

    // Validation
    if (!userid || !password) {
      return res.status(400).json({
        success: false,
        message: "UserID and Password required",
      });
    }

    // Find user
    const counselor = await Counselor.findOne({ userid });

    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Invalid UserID",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, counselor.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Success
    res.status(200).json({
      success: true,
      message: "Login Success",
      data: {
        _id: counselor._id,
        name: counselor.name,
        userid: counselor.userid,
        email: counselor.email,
        status: counselor.status,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


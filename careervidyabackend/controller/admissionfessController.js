import AdmissionFees from "../models/counsler/Admissionfess.js";

/* ================= CREATE ================= */
export const createAdmissionFees = async (req, res) => {
  try {
    const {
      universityName,
      course,
      branch,
      totalFees,
      examFee,
      registrationFee,
      semesterFees,
    } = req.body;

    // Validation
    if (!universityName || !course || !branch) {
      return res.status(400).json({
        success: false,
        message: "University, Course and Branch are required",
      });
    }

    if (!Array.isArray(semesterFees) || semesterFees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Semester fees are required",
      });
    }

    // Validate each semester
    for (let sem of semesterFees) {
      if (!sem.semester || sem.fee === undefined || sem.fee < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid semester fee data",
        });
      }
    }

    const newData = await AdmissionFees.create({
      universityName,
      course,
      branch,
      totalFees,
      examFee,
      registrationFee,
      semesterFees,
    });

    res.status(201).json({
      success: true,
      message: "Admission Fees Added Successfully",
      data: newData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
export const getAllAdmissionFees = async (req, res) => {
  try {
    const data = await AdmissionFees.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET BY ID ================= */
export const getAdmissionFeesById = async (req, res) => {
  try {
    const data = await AdmissionFees.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
export const updateAdmissionFees = async (req, res) => {
  try {
    // Validate semesterFees if present
    if (req.body.semesterFees) {
      if (!Array.isArray(req.body.semesterFees)) {
        return res.status(400).json({
          success: false,
          message: "semesterFees must be an array",
        });
      }

      for (let sem of req.body.semesterFees) {
        if (!sem.semester || sem.fee === undefined || sem.fee < 0) {
          return res.status(400).json({
            success: false,
            message: "Invalid semester fee data",
          });
        }
      }
    }

    const updated = await AdmissionFees.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Data Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Updated Successfully",
      data: updated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteAdmissionFees = async (req, res) => {
  try {
    const deleted = await AdmissionFees.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Data Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= BULK CREATE ================= */
export const bulkAdmissionFeesUpload = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        message: "Send data in array format",
      });
    }

    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Empty data not allowed",
      });
    }

    // Validate rows
    const validData = data.filter((item) => {
      if (
        !item.universityName ||
        !item.course ||
        !item.branch ||
        !Array.isArray(item.semesterFees)
      ) {
        return false;
      }

      for (let sem of item.semesterFees) {
        if (!sem.semester || sem.fee === undefined || sem.fee < 0) {
          return false;
        }
      }

      return true;
    });

    if (validData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid data found",
      });
    }

    const result = await AdmissionFees.insertMany(validData, { ordered: false });

    res.status(201).json({
      success: true,
      message: "Bulk Upload Successful",
      totalInserted: result.length,
      data: result,
    });
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate records found",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

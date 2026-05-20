// import LeadAdmission from "../models/counselor/LeadAdmission.js";

// // ================= CREATE ADMISSION =================
// // Isme counselor apna naam khud fill karke bhejega (req.body.counselorName)
// export const createLeadAdmission = async (req, res) => {
//   try {
//     const { email, phone } = req.body;

//     // ✅ Pehle check karo
//     const existingStudent = await LeadAdmission.findOne({
//       $or: [{ email }, { phone }],
//     });

//     if (existingStudent) {
//       return res.status(400).json({
//         success: false,
//         message: "⚠️ This student is already registered. Please check the existing record!",
//       });
//     }

//     // ✅ Phir create karo
//     const admission = await LeadAdmission.create(req.body);

//     res.status(201).json({
//       success: true,
//       message: "✅ Admission created successfully!",
//       data: admission,
//     });

//   } catch (error) {

//     // Duplicate key error handle
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "⚠️ Duplicate entry! Student already exists.",
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "❌ Error creating admission: " + error.message,
//     });
//   }
// };

// // ================= GET ALL ADMISSIONS =================
// export const getAllLeadAdmissions = async (req, res) => {
//   try {
//     // counselor (ObjectId) ko populate kar rahe hain agar available ho, 
//     // varna counselorName (String) toh list mein aayega hi.
//     const admissions = await LeadAdmission.find()
//       .sort({ createdAt: -1 }) // Naye admissions pehle dikhenge
//       .populate("counselor", "name email phone");

//     res.status(200).json({
//       success: true,
//       count: admissions.length,
//       data: admissions,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "❌ Error fetching admissions: " + error.message,
//     });
//   }
// };

// // ================= GET SINGLE ADMISSION BY ID =================
// export const getLeadAdmissionById = async (req, res) => {
//   try {
//     const admission = await LeadAdmission.findById(req.params.id)
//       .populate("counselor");

//     if (!admission) {
//       return res.status(404).json({
//         success: false,
//         message: "❌ Admission record not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: admission,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "❌ Error: " + error.message,
//     });
//   }
// };

// // ================= UPDATE ADMISSION =================
// export const updateLeadAdmission = async (req, res) => {
//   try {
//     const admission = await LeadAdmission.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { 
//         new: true, // Updated data return karega
//         runValidators: true // Schema rules check karega
//       }
//     );

//     if (!admission) {
//       return res.status(404).json({
//         success: false,
//         message: "❌ Admission not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "✅ Admission updated successfully",
//       data: admission,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "❌ Update failed: " + error.message,
//     });
//   }
// };

// // ================= DELETE ADMISSION =================
// export const deleteLeadAdmission = async (req, res) => {
//   try {
//     const admission = await LeadAdmission.findByIdAndDelete(req.params.id);

//     if (!admission) {
//       return res.status(404).json({
//         success: false,
//         message: "❌ Admission not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "🗑️ Admission deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "❌ Delete failed: " + error.message,
//     });
//   }
// };


import fs from "fs";
import LeadAdmission from "../models/counselor/LeadAdmission.js";
import Notification from "../models/counselor/DocumenetNotification.js";

// ================= CREATE ADMISSION =================
export const createLeadAdmission = async (req, res) => {
  try {
    const { email, phone } = req.body;

    const existingStudent = await LeadAdmission.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "⚠️ This student is already registered!",
      });
    }

    const admission = await LeadAdmission.create(req.body);

    return res.status(201).json({
      success: true,
      message: "✅ Admission created successfully!",
      data: admission,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Duplicate entry! Student already exists.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "❌ Error creating admission: " + error.message,
    });
  }
};

// ================= GET ALL ADMISSIONS =================
export const getAllLeadAdmissions = async (req, res) => {
  try {
    const { limit, counselorId, counselorName } = req.query;

    const filter = {};

    if (req.user?.role === "counselor") {
      filter.counselor = req.user._id;        // JWT se — primary
    } else if (counselorId) {
      filter.counselor = counselorId;          // query param — fallback
    } else if (counselorName) {
      filter.counselorName = counselorName;    // naam se — last resort
    }

    const admissions = await LeadAdmission.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit) : 0)
      .populate("counselor", "name email phone");

    return res.status(200).json({
      success: true,
      count: admissions.length,
      data: admissions,
    });
  } catch (error) {
    // ✅ Actual error log karo terminal mein
    console.error("getAllLeadAdmissions error:", error.message);
    return res.status(500).json({
      success: false,
      message: "❌ Error fetching admissions: " + error.message,
    });
  }
};

// ================= GET SINGLE ADMISSION =================
export const getLeadAdmissionById = async (req, res) => {
  try {
    const admission = await LeadAdmission.findById(req.params.id).populate("counselor");

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "❌ Admission record not found",
      });
    }

    return res.status(200).json({ success: true, data: admission });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Error: " + error.message,
    });
  }
};

// ================= UPDATE ADMISSION =================
export const updateLeadAdmission = async (req, res) => {
  try {
    const admission = await LeadAdmission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "❌ Admission not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "✅ Admission updated successfully",
      data: admission,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Update failed: " + error.message,
    });
  }
};

// ================= DELETE ADMISSION =================
export const deleteLeadAdmission = async (req, res) => {
  try {
    const admission = await LeadAdmission.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "❌ Admission not found",
      });
    }

    // ✅ Bilkul synchronous loop filesystem aur DB cleanup ke liye
    if (admission.documents && Array.isArray(admission.documents)) {
      for (const doc of admission.documents) {
        if (doc.filePath && fs.existsSync(doc.filePath)) {
          fs.unlinkSync(doc.filePath);
        }
      }
    }

    // Ek ke baad ek execute hone wale strict steps
    await LeadAdmission.findByIdAndDelete(req.params.id);
    await Notification.deleteMany({ admissionId: req.params.id });

    return res.status(200).json({
      success: true,
      message: "🗑️ Admission and all documents deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Delete failed: " + error.message,
    });
  }
};

// ================= UPLOAD DOCUMENTS =================
export const uploadDocuments = async (req, res) => {
  try {
    const admission = await LeadAdmission.findById(req.params.id);

    if (!admission) {
      if (req.files) {
        for (const file of req.files) {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        }
      }
      return res.status(404).json({
        success: false,
        message: "❌ Admission not found",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "❌ No files uploaded",
      });
    }

    const newDocs = req.files.map((file) => ({
      fileName: file.originalname,
      fileType: file.mimetype,
      filePath: file.path,
      fileUrl: `${req.protocol}://${req.get("host")}/uploads/documents/${file.filename}`,
      status: "pending",
    }));

    admission.documents.push(...newDocs);
    // Pehle document update save hoga database mein
    await admission.save();

    // Fir accurate data nikaalkar strict dynamic synchronization ke sath notifications insert hongi
    const notifications = admission.documents.slice(-newDocs.length).map((doc) => ({
      admissionId: admission._id,
      documentId: doc._id?.toString(),
      studentName: admission.studentName,
      counselorName: admission.counselorName,
      fileName: doc.fileName,
      type: "doc_uploaded",
      message: `📄 New document uploaded by ${admission.counselorName} for student "${admission.studentName}". Please verify: ${doc.fileName}`,
    }));

    await Notification.insertMany(notifications);

    return res.status(200).json({
      success: true,
      message: `✅ ${newDocs.length} document(s) uploaded. Admin ko verification ke liye notify kar diya.`,
      uploadedDocuments: admission.documents.slice(-newDocs.length),
      allDocuments: admission.documents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Upload failed: " + error.message,
    });
  }
};

// ================= GET ALL DOCUMENTS =================
export const getDocuments = async (req, res) => {
  try {
    const admission = await LeadAdmission.findById(req.params.id).select(
      "studentName counselorName documents"
    );

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "❌ Admission not found",
      });
    }

    return res.status(200).json({
      success: true,
      studentName: admission.studentName,
      count: admission.documents.length,
      summary: {
        total: admission.documents.length,
        pending: admission.documents.filter((d) => d.status === "pending").length,
        done: admission.documents.filter((d) => d.status === "done").length,
        rejected: admission.documents.filter((d) => d.status === "rejected").length,
      },
      documents: admission.documents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Error: " + error.message,
    });
  }
};

// ================= DELETE SINGLE DOCUMENT =================
export const deleteDocument = async (req, res) => {
  try {
    const admission = await LeadAdmission.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "❌ Admission not found",
      });
    }

    const doc = admission.documents.id(req.params.docId);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "❌ Document not found",
      });
    }

    if (doc.filePath && fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    doc.deleteOne();
    await admission.save();

    return res.status(200).json({
      success: true,
      message: "🗑️ Document deleted successfully",
      remainingDocuments: admission.documents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Delete failed: " + error.message,
    });
  }
};

// ================= ADMIN: VERIFY DOCUMENT =================
export const verifyDocument = async (req, res) => {
  try {
    const { status, adminRemark } = req.body;

    if (!["done", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '❌ Invalid status. Use: "done", "rejected", or "pending"',
      });
    }

    if (status === "rejected" && !adminRemark?.trim()) {
      return res.status(400).json({
        success: false,
        message: "❌ adminRemark is required when rejecting a document",
      });
    }

    const admission = await LeadAdmission.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "❌ Admission not found",
      });
    }

    const doc = admission.documents.id(req.params.docId);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "❌ Document not found",
      });
    }

    doc.status = status;
    doc.adminRemark = adminRemark || "";
    doc.verifiedAt = new Date();

    await admission.save();

    let notifMessage = "";
    let notifType = "";

    if (status === "done") {
      notifType = "doc_approved";
      notifMessage = `✅ Document "${doc.fileName}" of student "${admission.studentName}" has been APPROVED by admin.`;
    } else if (status === "rejected") {
      notifType = "doc_rejected";
      notifMessage = `❌ Document "${doc.fileName}" of student "${admission.studentName}" has been REJECTED.\n📝 Reason: ${adminRemark}\n🔁 Please resubmit the correct document.`;
    }

    if (notifMessage) {
      await Notification.create({
        admissionId: admission._id,
        documentId: doc._id.toString(),
        studentName: admission.studentName,
        counselorName: admission.counselorName,
        fileName: doc.fileName,
        type: notifType,
        message: notifMessage,
        adminRemark: adminRemark || "",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        status === "done"
          ? "✅ Document approved and counselor notified!"
          : status === "rejected"
          ? "❌ Document rejected and counselor notified with reason!"
          : "🔄 Document status updated to pending",
      document: doc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Verification failed: " + error.message,
    });
  }
};

// ================= ADMIN: BULK VERIFY ALL DOCS =================
export const verifyAllDocuments = async (req, res) => {
  try {
    const { status, adminRemark } = req.body;

    if (!["done", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '❌ Invalid status. Use: "done" or "rejected"',
      });
    }

    if (status === "rejected" && !adminRemark?.trim()) {
      return res.status(400).json({
        success: false,
        message: "❌ adminRemark is required when rejecting",
      });
    }

    const admission = await LeadAdmission.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "❌ Admission not found",
      });
    }

    const pendingDocs = admission.documents.filter((d) => d.status === "pending");

    if (pendingDocs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "⚠️ No pending documents to verify",
      });
    }

    pendingDocs.forEach((doc) => {
      doc.status = status;
      doc.adminRemark = adminRemark || "";
      doc.verifiedAt = new Date();
    });

    await admission.save();

    const message =
      status === "done"
        ? `✅ All ${pendingDocs.length} document(s) of "${admission.studentName}" have been APPROVED.`
        : `❌ All ${pendingDocs.length} document(s) of "${admission.studentName}" have been REJECTED.\n📝 Reason: ${adminRemark}\n🔁 Please resubmit correct documents.`;

    await Notification.create({
      admissionId: admission._id,
      studentName: admission.studentName,
      counselorName: admission.counselorName,
      type: status === "done" ? "doc_approved" : "doc_rejected",
      message,
      adminRemark: adminRemark || "",
    });

    return res.status(200).json({
      success: true,
      message: `✅ ${pendingDocs.length} document(s) marked as "${status}" and counselor notified.`,
      updatedCount: pendingDocs.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Bulk verify failed: " + error.message,
    });
  }
};

// ================= GET NOTIFICATIONS =================
export const getNotifications = async (req, res) => {
  try {
    const { counselorName, isRead, type } = req.query;

    const filter = {};
    if (counselorName) filter.counselorName = counselorName;
    if (isRead !== undefined) filter.isRead = isRead === "true";
    if (type) filter.type = type;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .populate("admissionId", "studentName email phone");

    const unreadCount = await Notification.countDocuments({ ...filter, isRead: false });

    return res.status(200).json({
      success: true,
      unreadCount: unreadCount || 0,
      count: notifications.length,
      data: notifications || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Error fetching notifications: " + error.message,
    });
  }
};

// ================= MARK NOTIFICATION AS READ =================
export const markNotificationRead = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.notifId,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notif) {
      return res.status(404).json({
        success: false,
        message: "❌ Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "✅ Notification marked as read",
      data: notif,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Error: " + error.message,
    });
  }
};

// ================= MARK ALL NOTIFICATIONS READ =================
export const markAllNotificationsRead = async (req, res) => {
  try {
    const { counselorName } = req.body;
    const filter = { isRead: false };
    if (counselorName) filter.counselorName = counselorName;

    const result = await Notification.updateMany(filter, {
      isRead: true,
      readAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: `✅ ${result.modifiedCount} notification(s) marked as read`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Error: " + error.message,
    });
  }
};
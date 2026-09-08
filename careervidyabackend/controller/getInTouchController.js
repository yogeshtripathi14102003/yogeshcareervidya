



// import GetInTouch from "../models/Admin/getInTouch.js";
// import Lead from "../models/counselor/Lead.js";
// import { autoAssignLead, getAssignmentConfig } from "../utilities/leadAssignmentEngine.js";
// import { notifyCounselor } from "../utilities/notifyCounselor.js";
// import { ADMITTED_STATUS, LOST_STATUSES } from "../constant/leadStatus.js";

// // ✅ Create new GetInTouch entry
// export const createGetInTouch = async (req, res) => {
//   try {
//     const { name, city, course, branch, email, mobile, message } = req.body;

//     if (!name || !email || !mobile || !course || !branch) {
//       return res.status(400).json({ message: "Name, email, mobile, course and branch are required" });
//     }

//     const newQuery = await GetInTouch.create({
//       name,
//       city,
//       course,
//       branch,
//       email,
//       mobile,
//       message,
//     });

//     // Also create the actual CRM Lead this inquiry represents — this is
//     // the piece that was missing entirely: GetInTouch and Lead were two
//     // disconnected collections, so no real website inquiry ever reached a
//     // counselor. Best-effort: a failure here shouldn't fail the person's
//     // form submission, they've already gotten their success response.
//     createLeadFromInquiry({ name, city, course, branch, email, mobile, message }).catch((err) =>
//       console.error("createLeadFromInquiry failed:", err.message)
//     );

//     res.status(201).json({
//       success: true,
//       message: "Query submitted successfully!",
//       data: newQuery,
//     });
//   } catch (error) {
//     console.error("❌ Error creating GetInTouch:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// const createLeadFromInquiry = async ({ name, city, course, branch, email, mobile, message }) => {
//   // Dedup: if this person already has an open (non-terminal) lead, don't
//   // spin up a duplicate every time they resubmit the form — just let their
//   // existing lead's follow-up trail cover it.
//   const existing = await Lead.findOne({
//     phone: mobile,
//     status: { $nin: [ADMITTED_STATUS, ...LOST_STATUSES] },
//   });
//   if (existing) return;

//   let assignedTo = null;
//   let assignedToName = "";

//   const config = await getAssignmentConfig();
//   if (config.autoAssignOnCreate) {
//     const assignment = await autoAssignLead({ city, course, universityName: branch, leadScore: 0 });
//     if (assignment) {
//       assignedTo = assignment.counselorId;
//       assignedToName = assignment.counselorName;
//     }
//   }

//   const lead = await Lead.create({
//     name,
//     phone: mobile,
//     email,
//     course,
//     city,
//     universityName: branch,
//     remark: message,
//     source: "Website Inquiry",
//     status: "New",
//     assignedTo,
//     assignedToName,
//     assignedAt: assignedTo ? new Date() : null,
//   });

//   if (assignedTo) {
//     notifyCounselor(assignedTo, {
//       type: "lead_assigned",
//       title: "New Lead Assigned",
//       message: `${name}${course ? ` (${course})` : ""} submitted a website inquiry and has been assigned to you.`,
//       lead: lead._id,
//     });
//   }
// };

// // ✅ Get all queries
// export const getAllGetInTouch = async (req, res) => {
//   try {
//     const data = await GetInTouch.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data });
//   } catch (error) {
//     console.error("❌ Error fetching GetInTouch:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // ✅ Delete query by ID
// export const deleteGetInTouch = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await GetInTouch.findByIdAndDelete(id);
//     res.status(200).json({ success: true, message: "Deleted successfully" });
//   } catch (error) {
//     console.error("❌ Error deleting GetInTouch:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };



import GetInTouch from "../models/Admin/getInTouch.js";
import Lead from "../models/counselor/Lead.js";
import {
  autoAssignLead,
  getAssignmentConfig,
} from "../utilities/leadAssignmentEngine.js";
import { notifyCounselor } from "../utilities/notifyCounselor.js";
import {
  ADMITTED_STATUS,
  LOST_STATUSES,
} from "../constant/leadStatus.js";

// 📧 Email
import { notificationQueue } from "../utilities/emailQueue.js";
import { getQueryConfirmationTemplate } from "../utilities/emailTemplates.js";


// ============================================================
// ✅ Create new GetInTouch entry
// ============================================================
export const createGetInTouch = async (req, res) => {
  try {
    const {
      name,
      city,
      course,
      branch,
      email,
      mobile,
      message,
    } = req.body;

    // ----------------------------------------------------------
    // Validation
    // ----------------------------------------------------------
    if (!name || !email || !mobile || !course || !branch) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, mobile, course and branch are required",
      });
    }

    // ----------------------------------------------------------
    // 1️⃣ Save Query
    // ----------------------------------------------------------
    const newQuery = await GetInTouch.create({
      name,
      city,
      course,
      branch,
      email,
      mobile,
      message,
    });

    console.log("✅ GetInTouch query saved:", newQuery._id);


    // ----------------------------------------------------------
    // 2️⃣ Send Confirmation Email to User
    // ----------------------------------------------------------
    if (email) {
      notificationQueue
        .add("website-query-confirmation", {
          type: "email",

          // 📧 Mail USER ke submitted email par jayega
          to: email,

          subject: "Thanks for Query! - Career Vidya",

          html: getQueryConfirmationTemplate(name),
        })
        .then(() => {
          console.log(
            `✅ Query confirmation email queued for ${email}`
          );
        })
        .catch((err) => {
          // Email fail hone par query submission fail nahi hogi
          console.error(
            "❌ Query confirmation email failed:",
            err.message
          );
        });
    }


    // ----------------------------------------------------------
    // 3️⃣ Create CRM Lead
    // ----------------------------------------------------------
    createLeadFromInquiry({
      name,
      city,
      course,
      branch,
      email,
      mobile,
      message,
    }).catch((err) =>
      console.error(
        "❌ createLeadFromInquiry failed:",
        err.message
      )
    );


    // ----------------------------------------------------------
    // 4️⃣ Send Success Response
    // ----------------------------------------------------------
    return res.status(201).json({
      success: true,
      message: "Query submitted successfully!",
      data: newQuery,
    });

  } catch (error) {
    console.error(
      "❌ Error creating GetInTouch:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ============================================================
// ✅ Create CRM Lead from Website Inquiry
// ============================================================
const createLeadFromInquiry = async ({
  name,
  city,
  course,
  branch,
  email,
  mobile,
  message,
}) => {

  // ----------------------------------------------------------
  // Deduplication
  // ----------------------------------------------------------
  const existing = await Lead.findOne({
    phone: mobile,
    status: {
      $nin: [
        ADMITTED_STATUS,
        ...LOST_STATUSES,
      ],
    },
  });

  if (existing) {
    console.log(
      `ℹ️ Existing open lead found for ${mobile}. Skipping duplicate lead.`
    );

    return;
  }


  // ----------------------------------------------------------
  // Assignment
  // ----------------------------------------------------------
  let assignedTo = null;
  let assignedToName = "";

  const config = await getAssignmentConfig();

  if (config.autoAssignOnCreate) {

    const assignment = await autoAssignLead({
      city,
      course,
      universityName: branch,
      leadScore: 0,
    });

    if (assignment) {
      assignedTo = assignment.counselorId;
      assignedToName = assignment.counselorName;
    }
  }


  // ----------------------------------------------------------
  // Create Lead
  // ----------------------------------------------------------
  const lead = await Lead.create({
    name,
    phone: mobile,
    email,
    course,
    city,
    universityName: branch,
    remark: message,
    source: "Website Inquiry",
    status: "New",
    assignedTo,
    assignedToName,
    assignedAt: assignedTo
      ? new Date()
      : null,
  });

  console.log(
    `✅ CRM Lead created: ${lead._id}`
  );


  // ----------------------------------------------------------
  // Notify Counselor
  // ----------------------------------------------------------
  if (assignedTo) {
    notifyCounselor(assignedTo, {
      type: "lead_assigned",

      title: "New Lead Assigned",

      message: `${name}${
        course ? ` (${course})` : ""
      } submitted a website inquiry and has been assigned to you.`,

      lead: lead._id,
    });
  }
};


// ============================================================
// ✅ Get all queries
// ============================================================
export const getAllGetInTouch = async (req, res) => {
  try {

    const data = await GetInTouch
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {

    console.error(
      "❌ Error fetching GetInTouch:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ============================================================
// ✅ Delete query by ID
// ============================================================
export const deleteGetInTouch = async (req, res) => {
  try {

    const { id } = req.params;

    await GetInTouch.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {

    console.error(
      "❌ Error deleting GetInTouch:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
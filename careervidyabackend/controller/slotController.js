// controllers/slotController.js

import Slot from "../models/Admin/Slot.js";
import nodemailer from "nodemailer";

// ─── Email transporter setup ──────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
  
    user: process.env.EMAIL_USER,   // your Gmail
    pass: process.env.EMAIL_PASS,   // Gmail App Password
  },
});

// ─── Email sender helper ──────────────────────────────────────────────────────
const sendApprovalMail = async (slot) => {
  const mailOptions = {
    from: `"Career Vidya" <${process.env.EMAIL_USER}>`,
    to: slot.studentEmail,
    subject: "✅ Your Counseling Session is Confirmed — Career Vidya",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
        <div style="background:#05347f;padding:24px 28px">
          <h2 style="color:#fff;margin:0;font-size:20px;font-weight:500">Career Vidya</h2>
          <p style="color:rgba(255,255,255,.65);margin:4px 0 0;font-size:13px">Free Career Counseling</p>
        </div>
        <div style="padding:28px">
          <p style="font-size:15px;color:#0f172a;margin:0 0 8px">Hi <b>${slot.studentName}</b>,</p>
          <p style="font-size:14px;color:#475569;margin:0 0 20px;line-height:1.6">
            Great news! Your free career counseling session has been <b style="color:#16a34a">confirmed</b>.
            Here are your session details:
          </p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:20px">
            <table style="width:100%;font-size:14px;color:#475569;border-collapse:collapse">
              <tr><td style="padding:6px 0;color:#94a3b8;width:120px">Date</td><td style="color:#0f172a;font-weight:500">${slot.date}</td></tr>
              <tr><td style="padding:6px 0;color:#94a3b8">Time</td><td style="color:#0f172a;font-weight:500">${slot.time}</td></tr>
              <tr><td style="padding:6px 0;color:#94a3b8">Course</td><td style="color:#0f172a;font-weight:500">${slot.course}</td></tr>
              <tr><td style="padding:6px 0;color:#94a3b8">Specialization</td><td style="color:#0f172a;font-weight:500">${slot.branch}</td></tr>
              <tr><td style="padding:6px 0;color:#94a3b8">Mode</td><td style="color:#0f172a;font-weight:500">Online (link will be shared)</td></tr>
            </table>
          </div>
          <p style="font-size:13px;color:#64748b;line-height:1.6;margin:0 0 20px">
            Our expert counselor will call you on <b>${slot.studentMobile}</b> at the scheduled time.
            Please be available and keep your queries ready.
          </p>
          <p style="font-size:13px;color:#94a3b8;margin:0">
            Need to reschedule? Reply to this email or call <b>1800-XXX-XXXX</b>
          </p>
        </div>
        <div style="background:#f8fafc;padding:14px 28px;border-top:1px solid #e2e8f0">
          <p style="font-size:12px;color:#94a3b8;margin:0">© 2026 Career Vidya. All rights reserved.</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendRejectionMail = async (slot) => {
  const mailOptions = {
    from: `"Career Vidya" <${process.env.EMAIL_USER}>`,
    to: slot.studentEmail,
    subject: "Your Counseling Request — Career Vidya",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
        <div style="background:#05347f;padding:24px 28px">
          <h2 style="color:#fff;margin:0;font-size:20px;font-weight:500">Career Vidya</h2>
          <p style="color:rgba(255,255,255,.65);margin:4px 0 0;font-size:13px">Free Career Counseling</p>
        </div>
        <div style="padding:28px">
          <p style="font-size:15px;color:#0f172a;margin:0 0 8px">Hi <b>${slot.studentName}</b>,</p>
          <p style="font-size:14px;color:#475569;margin:0 0 16px;line-height:1.6">
            Unfortunately, we were unable to confirm your counseling slot for
            <b>${slot.date}</b> at <b>${slot.time}</b>.
          </p>
          ${slot.rejectionReason ? `
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:14px 18px;margin-bottom:16px">
            <p style="font-size:13px;color:#991b1b;margin:0"><b>Reason:</b> ${slot.rejectionReason}</p>
          </div>` : ""}
          <p style="font-size:13px;color:#64748b;line-height:1.6;margin:0 0 20px">
            Please visit our website to book another available slot. We're happy to help you!
          </p>
          <a href="${process.env.CLIENT_URL || "https://careervidya.in"}"
            style="display:inline-block;background:#c15304;color:#fff;padding:10px 22px;border-radius:8px;font-size:13px;font-weight:500;text-decoration:none">
            Book Another Slot →
          </a>
        </div>
        <div style="background:#f8fafc;padding:14px 28px;border-top:1px solid #e2e8f0">
          <p style="font-size:12px;color:#94a3b8;margin:0">© 2026 Career Vidya. All rights reserved.</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

// ─── Controllers ──────────────────────────────────────────────────────────────

// ➕ 1. Admin: Add slot with totalSeats
export const addSlot = async (req, res) => {
  try {
    const { date, time, totalSeats } = req.body;

    if (!date || !time) {
      return res.status(400).json({ success: false, message: "Date and Time are required" });
    }

    const existingSlot = await Slot.findOne({ date, time });
    if (existingSlot) {
      return res.status(400).json({ success: false, message: "This slot already exists" });
    }

    const newSlot = await Slot.create({
      date,
      time,
      totalSeats: totalSeats || 1,
    });

    res.status(201).json({ success: true, message: "Slot added successfully", data: newSlot });
  } catch (error) {
    console.error("Error adding slot:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 📋 2. Admin: Get all slots with booking + availability info
export const getAllSlotsForAdmin = async (req, res) => {
  try {
    const slots = await Slot.find().sort({ date: 1, time: 1 });

    // Group by date+time to show how many slots are free at each time
    const grouped = {};
    slots.forEach((slot) => {
      const key = `${slot.date}_${slot.time}`;
      if (!grouped[key]) {
        grouped[key] = {
          date: slot.date,
          time: slot.time,
          totalSeats: slot.totalSeats,
          bookedCount: 0,
          freeCount: 0,
          slots: [],
        };
      }
      if (slot.isBooked) grouped[key].bookedCount++;
      else grouped[key].freeCount++;
      grouped[key].slots.push(slot);
    });

    res.status(200).json({
      success: true,
      data: slots,
      grouped: Object.values(grouped),
    });
  } catch (error) {
    console.error("Error fetching admin slots:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 👀 3. User: Get only free (unbooked) slots
export const getAvailableSlotsForUsers = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const freeSlots = await Slot.find({
      isBooked: false,
      date: { $gte: today },       // only future/today slots
    })
      .select("date time totalSeats")
      .sort({ date: 1, time: 1 });

    // Group by date to show how many slots free per date per time
    const grouped = {};
    freeSlots.forEach((slot) => {
      if (!grouped[slot.date]) grouped[slot.date] = {};
      if (!grouped[slot.date][slot.time]) {
        grouped[slot.date][slot.time] = { slotId: slot._id, freeCount: 0 };
      }
      grouped[slot.date][slot.time].freeCount++;
    });

    res.status(200).json({
      success: true,
      data: freeSlots,
      grouped,
    });
  } catch (error) {
    console.error("Error fetching free slots:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🔒 4. User: Book a slot (status = pending by default)
export const bookSlotDirectly = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      studentName, studentEmail, studentMobile,
      course, branch, description, city,
    } = req.body;

    if (!studentName || !studentEmail || !studentMobile || !course || !branch) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required student details",
      });
    }

    const slot = await Slot.findById(id);
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });
    if (slot.isBooked) return res.status(400).json({ success: false, message: "This slot is already booked" });

    slot.isBooked      = true;
    slot.status        = "pending";   // awaiting admin approval
    slot.studentName   = studentName;
    slot.studentEmail  = studentEmail;
    slot.studentMobile = studentMobile;
    slot.course        = course;
    slot.branch        = branch;
    slot.description   = description || "";
    slot.city          = city || "";

    await slot.save();

    res.status(200).json({
      success: true,
      message: "Slot booked! Awaiting confirmation from our team.",
      data: slot,
    });
  } catch (error) {
    console.error("Error booking slot:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ 5. Admin: Approve a booked slot → send confirmation email
export const approveSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await Slot.findById(id);
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });
    if (!slot.isBooked) return res.status(400).json({ success: false, message: "Slot is not booked yet" });
    if (slot.status === "approved") return res.status(400).json({ success: false, message: "Already approved" });

    slot.status        = "approved";
    slot.actionTakenAt = new Date();
    await slot.save();

    // Send approval email
    try {
      await sendApprovalMail(slot);
    } catch (mailErr) {
      console.error("Approval email failed:", mailErr.message);
      // Don't block the response if email fails
    }

    res.status(200).json({
      success: true,
      message: "Slot approved and confirmation email sent to student",
      data: slot,
    });
  } catch (error) {
    console.error("Error approving slot:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ❌ 6. Admin: Reject a booked slot → send rejection email
export const rejectSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const slot = await Slot.findById(id);
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });
    if (!slot.isBooked) return res.status(400).json({ success: false, message: "Slot is not booked" });
    if (slot.status === "rejected") return res.status(400).json({ success: false, message: "Already rejected" });

    // Free up the slot again so others can book
    slot.status          = "rejected";
    slot.isBooked        = false;
    slot.actionTakenAt   = new Date();
    slot.rejectionReason = rejectionReason || "";

    // Clear student data
    slot.studentName   = "";
    slot.studentEmail  = "";
    slot.studentMobile = "";
    slot.course        = "";
    slot.branch        = "";
    slot.description   = "";
    slot.city          = "";

    await slot.save();

    // Send rejection email (we saved email before clearing, so pass it)
    try {
      await sendRejectionMail({
        ...slot.toObject(),
        studentEmail: slot.studentEmail || req.body.studentEmail,
        studentName:  slot.studentName  || req.body.studentName,
      });
    } catch (mailErr) {
      console.error("Rejection email failed:", mailErr.message);
    }

    res.status(200).json({
      success: true,
      message: "Slot rejected and student notified",
      data: slot,
    });
  } catch (error) {
    console.error("Error rejecting slot:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✏️ 7. Admin: Update any slot manually
export const updateSlotByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const slot = await Slot.findByIdAndUpdate(id, updatedData, { new: true });
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });

    res.status(200).json({ success: true, message: "Slot updated successfully", data: slot });
  } catch (error) {
    console.error("Error updating slot:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🗑️ 8. Admin: Delete a slot
export const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await Slot.findByIdAndDelete(id);
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });

    res.status(200).json({ success: true, message: "Slot deleted successfully" });
  } catch (error) {
    console.error("Error deleting slot:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
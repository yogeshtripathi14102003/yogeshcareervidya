

import Slot from "../models/Admin/Slot.js";
import nodemailer from "nodemailer";

// ─── Email transporter ────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Email Helpers ────────────────────────────────────────────────────────────
const sendApprovalMail = async (slot, booking) => {
  await transporter.sendMail({
    from: `"Career Vidya" <${process.env.EMAIL_USER}>`,
    to: booking.studentEmail,
    subject: "✅ Your Counseling Session is Confirmed — Career Vidya",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
        <div style="background:#05347f;padding:24px 28px">
          <h2 style="color:#fff;margin:0;font-size:20px">Career Vidya</h2>
          <p style="color:rgba(255,255,255,.65);margin:4px 0 0;font-size:13px">Free Career Counseling</p>
        </div>

        <div style="padding:28px">
          <p style="font-size:15px;color:#0f172a">Hi <b>${booking.studentName}</b>,</p>
           <p style="font-size:14px;color:#475569;margin:0 0 20px;line-height:1.6">
         Great news! Your free career counseling session has been <b style="color:#16a34a">confirmed</b>.
            Here are your session details:
          </p>
          
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin:16px 0">
            <table style="width:100%;font-size:14px;color:#475569;border-collapse:collapse">
              <tr><td style="padding:6px 0;color:#94a3b8;width:130px">Date</td><td style="color:#0f172a;font-weight:500">${slot.date}</td></tr>
              <tr><td style="padding:6px 0;color:#94a3b8">Time</td><td style="color:#0f172a;font-weight:500">${slot.time}</td></tr>
              <tr><td style="padding:6px 0;color:#94a3b8">Course</td><td style="color:#0f172a;font-weight:500">${booking.course}</td></tr>
              <tr><td style="padding:6px 0;color:#94a3b8">Specialization</td><td style="color:#0f172a;font-weight:500">${booking.branch}</td></tr>
              <tr><td style="padding:6px 0;color:#94a3b8">Mode</td><td style="color:#0f172a;font-weight:500">Online (link will be shared)</td></tr>
            </table>
          </div>
          <p style="font-size:13px;color:#64748b;line-height:1.6">
            Our Expert counselor will call you on <b>${booking.studentMobile}</b> at the scheduled time. please be available and keep your queries ready.
          </p>
          <p style="font-size:13px;color:#94a3b8">Need to reschedule?  reply to this email or   Call <b>9289712364</b></p>
        </div>
        <div style="background:#f8fafc;padding:14px 28px;border-top:1px solid #e2e8f0">
          <p style="font-size:12px;color:#94a3b8;margin:0">© 2026 Career Vidya. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

const sendRejectionMail = async (slot, booking) => {
  await transporter.sendMail({
    from: `"Career Vidya" <${process.env.EMAIL_USER}>`,
    to: booking.studentEmail,
    subject: "Your Counseling Request — Career Vidya",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
        <div style="background:#05347f;padding:24px 28px">
          <h2 style="color:#fff;margin:0;font-size:20px">Career Vidya</h2>
          <p style="color:rgba(255, 255, 255, 0.91);margin:4px 0 0;font-size:13px">Free Career Counseling</p>
        </div>
        <div style="padding:28px">
          <p style="font-size:15px;color:#0f172a">Hi <b>${booking.studentName}</b>,</p>
          <p style="font-size:14px;color:#475569;line-height:1.6">
            Unfortunately we could not confirm your slot for <b>${slot.date}</b> at <b>${slot.time}</b>.
          </p>
          ${booking.rejectionReason ? `
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:14px 18px;margin:12px 0">
            <p style="font-size:13px;color:#991b1b;margin:0"><b>Reason:</b> ${booking.rejectionReason}</p>
          </div>` : ""}
          <p style="font-size:13px;color:#64748b;line-height:1.6">
            Please visit our website to book another available slot.
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
  });
};

// ─── Controllers ──────────────────────────────────────────────────────────────

// ➕ 1. Admin: Add a new slot with totalSeats
export const addSlot = async (req, res) => {
  try {
    const { date, time, totalSeats } = req.body;

    if (!date || !time) {
      return res.status(400).json({ success: false, message: "Date and Time are required" });
    }

    const existingSlot = await Slot.findOne({ date, time });
    if (existingSlot) {
      return res.status(400).json({ success: false, message: "Slot for this date & time already exists" });
    }

    const newSlot = await Slot.create({
      date,
      time,
      totalSeats: totalSeats || 1,
      bookedSeats: 0,
      isBooked: false,
    });

    res.status(201).json({ success: true, message: "Slot added successfully", data: newSlot });
  } catch (error) {
    console.error("addSlot error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 📋 2. Admin: Get all slots with full booking info
export const getAllSlotsForAdmin = async (req, res) => {
  try {
    const slots = await Slot.find().sort({ date: 1, time: 1 });

    const enriched = slots.map((slot) => ({
      ...slot.toObject(),
      remainingSeats: slot.totalSeats - slot.bookedSeats,
      isFull: slot.bookedSeats >= slot.totalSeats,
    }));

    res.status(200).json({ success: true, data: enriched });
  } catch (error) {
    console.error("getAllSlotsForAdmin error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 👀 3. User: Get only available slots (remaining seats > 0, date >= today)
export const getAvailableSlotsForUsers = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // ✅ Fetch slots where bookedSeats < totalSeats (seats still remaining)
    const freeSlots = await Slot.find({
      date: { $gte: today },
      $expr: { $lt: ["$bookedSeats", "$totalSeats"] },
    })
      .select("date time totalSeats bookedSeats")
      .sort({ date: 1, time: 1 });

    // Add remainingSeats field for frontend display
    const data = freeSlots.map((slot) => ({
      _id: slot._id,
      date: slot.date,
      time: slot.time,
      totalSeats: slot.totalSeats,
      bookedSeats: slot.bookedSeats,
      remainingSeats: slot.totalSeats - slot.bookedSeats,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getAvailableSlotsForUsers error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🔒 4. User: Book a seat in a slot
export const bookSlotDirectly = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, studentEmail, studentMobile, course, branch, description, city } = req.body;

    // Validate required fields
    if (!studentName || !studentEmail || !studentMobile || !course || !branch) {
      return res.status(400).json({ success: false, message: "Please fill all required student details" });
    }

    const slot = await Slot.findById(id);
    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }

    // ✅ Check if seats are still available
    if (slot.bookedSeats >= slot.totalSeats) {
      return res.status(400).json({
        success: false,
        message: `This slot is fully booked. No seats remaining for ${slot.date} at ${slot.time}.`,
      });
    }

    // ✅ Add this student to bookings array
    const newBooking = {
      studentName,
      studentEmail,
      studentMobile,
      course,
      branch,
      description: description || "",
      city: city || "",
      status: "pending",
      bookedAt: new Date(),
    };

    slot.bookings.push(newBooking);

    // ✅ Increment bookedSeats
    slot.bookedSeats += 1;

    // ✅ Mark slot as fully booked only when all seats are taken
    slot.isBooked = slot.bookedSeats >= slot.totalSeats;

    // Keep top-level fields updated with latest booking (for quick admin view)
    slot.studentName   = studentName;
    slot.studentEmail  = studentEmail;
    slot.studentMobile = studentMobile;
    slot.course        = course;
    slot.branch        = branch;
    slot.description   = description || "";
    slot.city          = city || "";
    slot.status        = "pending";

    await slot.save();

    const remainingSeats = slot.totalSeats - slot.bookedSeats;

    res.status(200).json({
      success: true,
      message: "Slot booked successfully! Awaiting confirmation from our team.",
      data: {
        date: slot.date,
        time: slot.time,
        remainingSeats,
        bookingStatus: "pending",
      },
    });
  } catch (error) {
    console.error("bookSlotDirectly error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ 5. Admin: Approve a specific booking inside a slot
export const approveSlot = async (req, res) => {
  try {
    const { id } = req.params;
    // bookingId is optional — if not passed, approve the latest/top-level booking
    const { bookingId } = req.body;

    const slot = await Slot.findById(id);
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });

    let targetBooking;

    if (bookingId) {
      // Approve specific booking from bookings array
      targetBooking = slot.bookings.id(bookingId);
      if (!targetBooking) return res.status(404).json({ success: false, message: "Booking not found" });
      if (targetBooking.status === "approved") return res.status(400).json({ success: false, message: "Already approved" });
      targetBooking.status = "approved";
    } else {
      // Fallback: approve the slot-level status (single-booking flow)
      if (slot.status === "approved") return res.status(400).json({ success: false, message: "Already approved" });
      slot.status = "approved";
      targetBooking = {
        studentName:   slot.studentName,
        studentEmail:  slot.studentEmail,
        studentMobile: slot.studentMobile,
        course:        slot.course,
        branch:        slot.branch,
      };
    }

    slot.actionTakenAt = new Date();
    await slot.save();

    // Send approval email
    try {
      await sendApprovalMail(slot, targetBooking);
    } catch (mailErr) {
      console.error("Approval email failed:", mailErr.message);
    }

    res.status(200).json({ success: true, message: "Slot approved and confirmation email sent", data: slot });
  } catch (error) {
    console.error("approveSlot error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ❌ 6. Admin: Reject a specific booking → free that seat back
export const rejectSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingId, rejectionReason } = req.body;

    const slot = await Slot.findById(id);
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });

    let targetBooking;

    if (bookingId) {
      // Reject specific booking from bookings array
      targetBooking = slot.bookings.id(bookingId);
      if (!targetBooking) return res.status(404).json({ success: false, message: "Booking not found" });
      if (targetBooking.status === "rejected") return res.status(400).json({ success: false, message: "Already rejected" });

      // Save email before status change for mail sending
      const bookingForMail = { ...targetBooking.toObject(), rejectionReason };

      targetBooking.status = "rejected";

      // ✅ Free up one seat
      slot.bookedSeats = Math.max(0, slot.bookedSeats - 1);
      slot.isBooked    = slot.bookedSeats >= slot.totalSeats;
      slot.actionTakenAt = new Date();
      await slot.save();

      try {
        await sendRejectionMail(slot, bookingForMail);
      } catch (mailErr) {
        console.error("Rejection email failed:", mailErr.message);
      }
    } else {
      // Fallback: slot-level rejection (single-booking flow)
      if (slot.status === "rejected") return res.status(400).json({ success: false, message: "Already rejected" });

      const bookingForMail = {
        studentName:     slot.studentName,
        studentEmail:    slot.studentEmail,
        studentMobile:   slot.studentMobile,
        course:          slot.course,
        branch:          slot.branch,
        rejectionReason: rejectionReason || "",
      };

      slot.status          = "rejected";
      slot.rejectionReason = rejectionReason || "";
      slot.bookedSeats     = Math.max(0, slot.bookedSeats - 1);
      slot.isBooked        = slot.bookedSeats >= slot.totalSeats;
      slot.actionTakenAt   = new Date();

      // Clear top-level student fields
      slot.studentName = slot.studentEmail = slot.studentMobile = "";
      slot.course = slot.branch = slot.description = slot.city = "";

      await slot.save();

      try {
        await sendRejectionMail(slot, bookingForMail);
      } catch (mailErr) {
        console.error("Rejection email failed:", mailErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Booking rejected, seat freed, and student notified",
      data: slot,
    });
  } catch (error) {
    console.error("rejectSlot error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✏️ 7. Admin: Update slot manually (date, time, totalSeats etc.)
export const updateSlotByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent directly overriding bookedSeats / isBooked from outside
    delete updates.bookedSeats;
    delete updates.isBooked;

    const slot = await Slot.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });

    res.status(200).json({ success: true, message: "Slot updated successfully", data: slot });
  } catch (error) {
    console.error("updateSlotByAdmin error:", error);
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
    console.error("deleteSlot error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
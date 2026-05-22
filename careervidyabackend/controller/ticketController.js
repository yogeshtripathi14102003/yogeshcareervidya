// import Ticket from "../models/counselor/Ticket.js";

// // 1. CREATE
// export const createTicket = async (req, res) => {
//   try {
//     const newTicket = new Ticket(req.body);
//     const savedTicket = await newTicket.save();
//     res.status(201).json({ success: true, data: savedTicket });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // 2. READ (All)
// export const getAllTickets = async (req, res) => {
//   try {
//     const tickets = await Ticket.find()
//       .populate('userId counselorId', 'name email')
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, count: tickets.length, data: tickets });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // 3. READ (Single)
// export const getTicketById = async (req, res) => {
//   try {
//     const ticket = await Ticket.findById(req.params.id).populate('userId counselorId');
//     if (!ticket) return res.status(404).json({ message: "Ticket not found" });
//     res.status(200).json({ success: true, data: ticket });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // 4. UPDATE (General)
// export const updateTicket = async (req, res) => {
//   try {
//     const updatedTicket = await Ticket.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body }, 
//       { new: true, runValidators: true }
//     );
//     if (!updatedTicket) return res.status(404).json({ message: "Ticket not found" });
//     res.status(200).json({ success: true, data: updatedTicket });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // 5. DELETE
// export const deleteTicket = async (req, res) => {
//   try {
//     const ticket = await Ticket.findByIdAndDelete(req.params.id);
//     if (!ticket) return res.status(404).json({ message: "Ticket not found" });
//     res.status(200).json({ success: true, message: "Ticket deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // 6. ADMIN NOTIFY (Pushes message to Counselor)
// export const sendAdminMessage = async (req, res) => {
//   const { ticketId } = req.params;
//   const { message } = req.body;
//   try {
//     const ticket = await Ticket.findByIdAndUpdate(
//       ticketId,
//       { $push: { adminMessages: { message: message } } },
//       { new: true }
//     );
//     if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
//     res.status(200).json({ success: true, data: ticket.adminMessages });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // 7. ADMIN RESOLVE (Finalizes the ticket)
// export const resolveTicket = async (req, res) => {
//   const { ticketId } = req.params;
//   const { summary, finalNotes, adminId } = req.body;
//   try {
//     const resolvedTicket = await Ticket.findByIdAndUpdate(
//       ticketId,
//       {
//         status: 'Resolved',
//         resolution: {
//           resolvedBy: adminId,
//           resolvedAt: new Date(),
//           summary: summary,
//           finalNotes: finalNotes
//         }
//       },
//       { new: true }
//     );
//     if (!resolvedTicket) return res.status(404).json({ success: false, message: "Ticket not found" });
//     res.status(200).json({ success: true, data: resolvedTicket });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


import mongoose from "mongoose";
import Ticket from "../models/counselor/Ticket.js";

// ─────────────────────────────────────────────────────────────────
// 1. CREATE
// ─────────────────────────────────────────────────────────────────
export const createTicket = async (req, res) => {
  try {
    const newTicket = new Ticket(req.body);
    const savedTicket = await newTicket.save();
    res.status(201).json({ success: true, data: savedTicket });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// 2. READ ALL
// ?counselorId=xxx  → sirf us counselor ki tickets
// no query          → admin ke liye sab tickets
// ─────────────────────────────────────────────────────────────────
export const getAllTickets = async (req, res) => {
  try {
    const { counselorId } = req.query;

    // Counselor dashboard: filter by counselorId
    const filter = counselorId ? { counselorId: new mongoose.Types.ObjectId(counselorId) } : {};

    const tickets = await Ticket.find(filter)
      .populate('userId counselorId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// 3. READ SINGLE
// ─────────────────────────────────────────────────────────────────
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('userId counselorId');
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// 4. UPDATE (General)
// ─────────────────────────────────────────────────────────────────
export const updateTicket = async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedTicket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json({ success: true, data: updatedTicket });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// 5. DELETE
// ─────────────────────────────────────────────────────────────────
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// 6. ADMIN NOTIFY SINGLE — ticket-specific message
// PATCH /api/v1/tickat/:ticketId/notify
// Sirf us ticket ke counselor ko dikhega (adminMessages array)
// ─────────────────────────────────────────────────────────────────
export const sendAdminMessage = async (req, res) => {
  const { ticketId } = req.params;
  const { message } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $push: {
          adminMessages: {
            message: message.trim(),
            sentAt: new Date(),
            isReadByCounselor: false
          }
        }
      },
      { new: true }
    );

    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });

    res.status(200).json({ success: true, data: ticket.adminMessages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// 7. ADMIN BROADCAST — notify ALL counselors
// POST /api/v1/tickat/notify-all
// Message sabhi open tickets mein globalMessages array mein push hoti hai
// Counselor apni kisi bhi ticket fetch karne par banner mein yeh dekhega
// ─────────────────────────────────────────────────────────────────
export const broadcastToAll = async (req, res) => {
  const { message } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  try {
    const globalEntry = {
      message: message.trim(),
      sentAt: new Date(),
      isRead: false
    };

    // Sabhi tickets mein ek saath push karo (bulkWrite — efficient)
    const result = await Ticket.updateMany(
      {}, // sabhi tickets
      { $push: { globalMessages: globalEntry } }
    );

    res.status(200).json({
      success: true,
      message: `Broadcast sent to ${result.modifiedCount} tickets`,
      data: globalEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// 8. ADMIN RESOLVE
// PUT /api/v1/tickat/:ticketId/resolve
// ─────────────────────────────────────────────────────────────────
export const resolveTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { summary, finalNotes, adminId } = req.body;

  try {
    const resolvedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        status: 'Resolved',
        resolution: {
          resolvedBy: adminId,
          resolvedAt: new Date(),
          summary,
          finalNotes
        }
      },
      { new: true }
    );

    if (!resolvedTicket) return res.status(404).json({ success: false, message: "Ticket not found" });

    res.status(200).json({ success: true, data: resolvedTicket });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 1. सभी ब्रॉडकास्ट संदेशों को गेट करने के लिए
export const getBroadcasts = async (req, res) => {
  try {
    // अगर आपने ब्रॉडकास्ट के लिए अलग मॉडल बनाया है (जैसे Broadcast) तो:
    // const broadcasts = await Broadcast.find().sort({ createdAt: -1 });
    
    // या अगर आप किसी और तरीके से स्टोर कर रहे हैं, तो वो डेटा यहाँ से भेजें:
    res.status(200).json({ success: true, data: broadcasts || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. किसी ब्रॉडकास्ट को डिलीट करने के लिए
export const deleteBroadcast = async (req, res) => {
  try {
    const { id } = req.params;
    // await Broadcast.findByIdAndDelete(id);
    
    res.status(200).json({ success: true, message: "Broadcast deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
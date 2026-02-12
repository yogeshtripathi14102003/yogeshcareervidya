import Ticket from "../models/counselor/Ticket.js";

// 1. CREATE
export const createTicket = async (req, res) => {
  try {
    const newTicket = new Ticket(req.body);
    const savedTicket = await newTicket.save();
    res.status(201).json({ success: true, data: savedTicket });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 2. READ (All)
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('userId counselorId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. READ (Single)
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('userId counselorId');
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. UPDATE (General)
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

// 5. DELETE
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 6. ADMIN NOTIFY (Pushes message to Counselor)
export const sendAdminMessage = async (req, res) => {
  const { ticketId } = req.params;
  const { message } = req.body;
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { $push: { adminMessages: { message: message } } },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
    res.status(200).json({ success: true, data: ticket.adminMessages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 7. ADMIN RESOLVE (Finalizes the ticket)
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
          summary: summary,
          finalNotes: finalNotes
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
import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  subject: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: {
    issue: String,
    goals: String,
    urgency: { 
      type: String, 
      enum: ['Low', 'Medium', 'High', 'Urgent'], 
      default: 'Medium' 
    }
  },
  status: {
    type: String,
    enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Counselor' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Admin to Counselor Notifications
  adminMessages: [{
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    isReadByCounselor: { type: Boolean, default: false }
  }],

  // Admin Resolution Fields
  resolution: {
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    resolvedAt: Date,
    summary: String, 
    finalNotes: String
  }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
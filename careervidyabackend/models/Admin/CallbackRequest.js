import mongoose from 'mongoose';

const callbackRequestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  course: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  fullAddress: {
    type: String,
    required: true
  },
  inquiryType: {
    type: String,
    enum: ['Request Call Back', 'Book Counselling'],
    default: 'Request Call Back'
  },
  // Book Counselling ke liye extra fields
  preferredDate: {
    type: Date,
    default: null
  },
  preferredTime: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Contacted', 'Completed', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

const CallbackRequest = mongoose.model('CallbackRequest', callbackRequestSchema);

export default CallbackRequest;
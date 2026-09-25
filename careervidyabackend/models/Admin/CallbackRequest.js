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
    default: 'Other'
    // 👆 required hata diya, sirf default rakha
  },
  course: {
    type: String,
    default: 'Not Specified'
    // 👆 required hata diya
  },
  state: {
    type: String,
    default: 'Not Specified'
    // 👆 required hata diya
  },
  fullAddress: {
    type: String,
    default: 'Not Provided'
    // 👆 required hata diya
  },
  inquiryType: {
    type: String,
    enum: ['Request Call Back', 'Book Counselling'],
    default: 'Request Call Back'
  },
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
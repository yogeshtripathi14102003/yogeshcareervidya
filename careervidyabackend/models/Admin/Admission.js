import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    gender: { type: String },
    dob: { type: Date },
    city: { type: String },
    state: { type: String },
    course: { type: String },
    branch: { type: String },
    university: { type: String },
    aadhaarNumber: { type: String },
    panNumber: { type: String },
    photo: { type: String }, // store file path or URL
    signature: { type: String }, // store file path or URL
    verified: { type: Boolean, default: false },

  },
  { timestamps: true }
);

export default mongoose.models.Admission || mongoose.model("Admission", admissionSchema);

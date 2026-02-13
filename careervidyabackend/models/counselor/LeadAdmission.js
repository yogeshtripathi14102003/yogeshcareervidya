import mongoose from "mongoose";

const leadAdmissionSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    fatherName: { type: String }, 
   email: { type: String, required: true, unique: true }, // ✅ UNIQUE
    phone: { type: String, unique: true }, // ✅ UNIQUE

    city: { type: String },
    universityName: { type: String },
    course: { type: String },
    branch: { type: String },
    admissionDate: { type: Date, default: Date.now },
    
    semesterFees: { type: Number },
    semesterCount: { type: Number },
    registrationFee: { type: Number },
    admissionFees: { type: Number }, 
    examFees: { type: Number },
    totalFees: { type: Number },
    
    c_semesterFees: { type: Number }, 
    c_semesterCount: { type: Number }, 
    c_registrationFee: { type: Number }, 
    c_examFees: { type: Number }, 
    c_discount: { type: Number }, 
    c_totalFees: { type: Number }, 

    discount: { type: String }, 
    refrelname: { type: String }, 
    
    // Yaha Counselor apna naam string me bhrega
    counselorName: { type: String, required: true },
    
    // Linking field (Ab optional hai taaki manual name entry me error na aaye)
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Counselor",
      required: false, 
    },
  },
  { timestamps: true }
);

export default mongoose.model("LeadAdmission", leadAdmissionSchema);
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
  
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  },
  mobileNumber: {
    type: String,
   
    match: /^[0-9]{10,15}$/ // basic validation
  },
 
  state:{
    type:String,
  },
    courese:{
      type: String,
    },
     gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: "other",
  },
  
  city: {
    type: String,
    
  },
  
  
  addresses: 
    {
      type: String,
      
    },
  
  role: {
    type: String,
    enum: ["user", "admin", "subadmin"],
    default: "user",
  },
    oauthId: {
    type: String,
  }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

export default Student; // ✅ ES module export

import mongoose from "mongoose";

const counselorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    userid: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: String,
    pan: String,
    aadhar: String,

    dob: Date,
    doj: Date,

    address: String,

    // ✅ NEW STATUS FIELD
    status: {
      type: String,
      enum: ["active", "leave", "Inactive"], // allowed values
      default: "active", // by default active rahega
    },
  },
  { timestamps: true }
);

const Counselor = mongoose.model("Counselor", counselorSchema);

export default Counselor;

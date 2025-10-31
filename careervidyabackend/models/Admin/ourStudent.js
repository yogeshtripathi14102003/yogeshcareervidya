import mongoose from "mongoose";

const ourStudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true }, // student image
    company: { type: String, required: true },
    companyLogo: { type: String, required: true }, // company logo
  },
  { timestamps: true }
);

export default mongoose.model("OurStudent", ourStudentSchema);

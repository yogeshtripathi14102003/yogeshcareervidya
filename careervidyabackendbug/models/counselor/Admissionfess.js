import mongoose from "mongoose";

const admissionFeesSchema = new mongoose.Schema(
  {
    universityName: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ Total Fees (can be number or string)
    totalFees: {
      type: mongoose.Schema.Types.Mixed, // allows both Number and String
    },

    // ✅ Exam Fee (can be number or string)
    examFee: {
      type: mongoose.Schema.Types.Mixed,
    },

    // ✅ Registration Fee (can be number or string)
    registrationFee: {
      type: mongoose.Schema.Types.Mixed,
    },

    // ✅ Semester-wise Fees
    semesterFees: [
      {
        semester: {
          type: Number,
          required: true,
          min: 1,
        },
        fee: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AdmissionFees", admissionFeesSchema);

import mongoose from "mongoose";

const stateDistrictSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    districts: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const StateDistrict = mongoose.model(
  "StateDistrict",
  stateDistrictSchema
);

export default StateDistrict;

// import mongoose from "mongoose";

// const visitorSchema = new mongoose.Schema(
//   {
//     ip: String,
//     userAgent: String,
//     browser: String,
//     device: String,
//     os: String,
//     referrer: String,
//     page: String,
//     isReturning: Boolean,
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Visitor", visitorSchema);
import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    ip: String,
    userAgent: String,
    browser: String,
    device: String,
    os: String,
    referrer: String,
    page: String,

    visits: {
      type: Number,
      default: 1,
    },

    pages: [
      {
        page: String,
        count: { type: Number, default: 1 },
      },
    ],

    lastVisitedAt: { type: Date, default: Date.now },
    isReturning: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("Visitor", visitorSchema);

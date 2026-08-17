// import mongoose from "mongoose";
// import "dotenv/config";


// const DB = process.env.MONGODB;
// const connectDB = async () => {
//   try {
//     await mongoose.connect(DB);
//    console.log("✅ DB connected successfully");
//   } catch (error) {
//     console.error("Error connecting to DB:", error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;


import mongoose from "mongoose";
import dns from "dns";
import "dotenv/config";

// Fix for local dev DNS issues (IPv6 link-local resolver problems)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  console.warn("⚠️ Could not set custom DNS servers, using system default:", err.message);
}

const DB = process.env.MONGODB;

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("✅ DB connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to DB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
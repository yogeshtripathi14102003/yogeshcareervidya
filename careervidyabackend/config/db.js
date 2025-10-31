import mongoose from "mongoose";
import "dotenv/config";


const DB = process.env.MONGODB;
const connectDB = async () => {
  try {
    await mongoose.connect(DB);
   console.log("✅ DB connected successfully");
  } catch (error) {
    console.error("Error connecting to DB:", error.message);
    process.exit(1);
  }
};

export default connectDB;

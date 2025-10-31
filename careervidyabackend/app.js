import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRouter from "./router/AuthRouter.js";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import { seedDefaultAdmin } from "./seedAdmin.js";
import sessionMiddleware from "./config/session.js";
import bannerRouter from "./router/bannerRouter.js";
import teamRouter from "./router/teamRouter.js";
import ourstudentRouter from "./router/ourstudentRouter.js";
import NewslatterRouter from "./router/NewslatterRouter.js";
import courseRoutes from "./router/courseRoutes.js";
import universityRoutes from "./router/universityRoutes.js";
const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // optional if using form data
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.36:3000"],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));

// ✅ Session & Passport
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/v1", authRouter);
app.use("/api/v1",teamRouter);
app.use("/api/v1/banner",bannerRouter);
app.use("/api/v1/ourstudent",ourstudentRouter)
app.use("/api/v1/",NewslatterRouter);
app.use("/api/v1",courseRoutes);
app.use("/api/v1",universityRoutes);

// ✅ Error for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ msg: "Route not found" });
});

// ✅ Start Server
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ DB Connected");
    await seedDefaultAdmin();
    console.log("✅ Seeding completed");
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
};
startServer();

export default app;

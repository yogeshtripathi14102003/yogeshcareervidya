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
import getinTouchRouter from "./router/getInTouchRouter.js";
import applyRouter from "./router/applyRouter.js";
import addjobRouter from "./router/addjobRouter.js";
import reviewRouter from "./router/reviewRouter.js";
// import chatbotRoutes from "./router/chatbotRoutes.js";
import visitorRoutes from "./router/visitorRoutes.js";
import compareRoutes from "./router/compareRoutes.js";
import blogRoutes from "./router/blogRoutes.js";
import offerRoutes from "./router/offerRoutes.js";
const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://www.careervidya.in", "careervidya.in","https://careervidya.in","https://api.careervidya.in", "  http://192.168.1.29:3000",],
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
app.use("/api/v1", teamRouter);
app.use("/api/v1/banner", bannerRouter);
app.use("/api/v1/ourstudent", ourstudentRouter);
app.use("/api/v1/", NewslatterRouter);
app.use("/api/v1", courseRoutes);
app.use("/api/v1/university", universityRoutes);
app.use("/api/v1/getintouch",getinTouchRouter);
app.use("/api/v1/resume", applyRouter);
app.use("/api/v1/addjob", addjobRouter);
app.use("/api/v1", reviewRouter);
// app.use("/api/v1",chatbotRoutes);
app.use("/api/v1/", visitorRoutes);
app.use("/api/v1/",compareRoutes)
app.use("/api/v1/",blogRoutes);
app.use("/api/v1/offer",offerRoutes);

// ✅ Simple Ping Route
app.get("/ping", (req, res) => {
  res.send("pong 🏓");
});

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

export default app;

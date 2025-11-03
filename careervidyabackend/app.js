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

// ✅ Basic Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ FIXED CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://careervidya.in",
      "https://careervidya.in",
      "http://www.careervidya.in",
      "https://www.careervidya.in",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Allow preflight requests for all routes
app.options("*", cors());

// ✅ Security + Logging
app.use(helmet());
app.use(morgan("dev"));

// ✅ Session & Passport
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// ✅ API Routes
app.use("/api/v1", authRouter);
app.use("/api/v1", teamRouter);
app.use("/api/v1/banner", bannerRouter);
app.use("/api/v1/ourstudent", ourstudentRouter);
app.use("/api/v1/", NewslatterRouter);
app.use("/api/v1", courseRoutes);
app.use("/api/v1/university", universityRoutes);

// ✅ Health Check Route
app.get("/ping", (req, res) => {
  res.send("pong 🏓");
});

// ✅ Handle Unknown Routes
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// ✅ Connect DB + Seed Default Admin
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database Connected");
    await seedDefaultAdmin();
    console.log("✅ Default Admin Seeded");
  } catch (err) {
    console.error("❌ Startup Error:", err);
    process.exit(1);
  }
};

startServer();

export default app;

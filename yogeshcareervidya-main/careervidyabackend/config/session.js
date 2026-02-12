import session from "express-session";
import MongoStore from "connect-mongo";

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "fallbacksecret",
  resave: false,
  saveUninitialized: false,
  store:
    process.env.NODE_ENV === "production"
      ? MongoStore.create({
          mongoUrl: process.env.MONGODB, // use your Atlas URL
          ttl: 60 * 60 * 24, // 1 day
        })
      : undefined, // MemoryStore (default) in dev
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only HTTPS in prod
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
});

export default sessionMiddleware;
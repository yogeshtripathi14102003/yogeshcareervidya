import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import counselorModel from "./models/counselor/Counselor.js";
import userModel from "./models/user/AuthModel.js";

let io = null;

// Simple in-memory presence set — resets on server restart, which is fine
// for an "online right now" indicator (it isn't meant to survive restarts).
const onlineCounselorIds = new Set();

const CORS_ORIGINS = [
  "http://localhost:3000",
  "http://192.168.1.49:3000",
  "https://careervidya.in",
  "https://www.careervidya.in",
  "https://api.careervidya.in",
];

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: CORS_ORIGINS,
      credentials: true,
    },
  });

  // Auth handshake — same JWT used for the REST API, passed as
  // `socket.handshake.auth.token` from the client.
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token provided"));

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      if (decoded.role === "counselor") {
        const counselor = await counselorModel.findById(decoded.id).select("_id name role").lean();
        if (!counselor) return next(new Error("Counselor not found"));
        socket.user = { _id: counselor._id, name: counselor.name, role: "counselor" };
      } else {
        const user = await userModel.findById(decoded.id).select("_id name role").lean();
        if (!user) return next(new Error("User not found"));
        socket.user = { _id: user._id, name: user.name, role: user.role };
      }

      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const { _id, role } = socket.user;

    if (role === "counselor") {
      socket.join(`counselor:${_id}`);
      onlineCounselorIds.add(String(_id));
      io.to("admins").emit("counselor:online", { counselorId: _id });
    }

    if (role === "admin" || role === "subadmin") {
      socket.join("admins");
    }

    if (role === "user") {
      socket.join(`student:${_id}`); // Q&A answer/reply notifications
    }

    socket.on("disconnect", () => {
      if (role === "counselor") {
        onlineCounselorIds.delete(String(_id));
        io.to("admins").emit("counselor:offline", { counselorId: _id });
      }
    });
  });

  return io;
};

export const getIO = () => io;

export const getOnlineCounselorIds = () => Array.from(onlineCounselorIds);

/** Push a real-time event to one counselor's open dashboard tabs (they may
 * have more than one open — the room delivers to all of them). */
export const emitToCounselor = (counselorId, event, payload) => {
  if (!io) return;
  io.to(`counselor:${counselorId}`).emit(event, payload);
};

/** Push a real-time event to every connected admin/subadmin. */
export const emitToAdmins = (event, payload) => {
  if (!io) return;
  io.to("admins").emit(event, payload);
};

/** Push a real-time event to one student's open tabs (Q&A notifications). */
export const emitToStudent = (studentId, event, payload) => {
  if (!io) return;
  io.to(`student:${studentId}`).emit(event, payload);
};

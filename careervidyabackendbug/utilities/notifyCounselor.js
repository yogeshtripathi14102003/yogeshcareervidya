import RealtimeNotification from "../models/counselor/RealtimeNotification.js";
import { emitToCounselor, emitToStudent } from "../socket.js";

/**
 * notifyCounselor(counselorId, {
 *   type: "lead_assigned",
 *   title: "New Lead Assigned",
 *   message: "Rahul Sharma (MBA) has been assigned to you.",
 *   lead: leadId,
 *   meta: { ... },
 * })
 */
export const notifyCounselor = async (counselorId, { type, title, message, lead, meta }) => {
  if (!counselorId) return null;

  try {
    const notification = await RealtimeNotification.create({
      recipient: counselorId,
      recipientType: "Counselor",
      type,
      title,
      message,
      lead: lead || undefined,
      meta: meta || {},
    });

    emitToCounselor(counselorId, "notification:new", {
      _id: notification._id,
      type,
      title,
      message,
      lead,
      meta,
      createdAt: notification.createdAt,
    });

    return notification;
  } catch (err) {
    // Notifications are a nice-to-have on top of the core CRM action —
    // never let a notification failure break the request that triggered it.
    console.error("notifyCounselor failed:", err.message);
    return null;
  }
};

/**
 * notifyStudent(studentId, {
 *   type: "qa_new_answer",
 *   title: "Your question got an answer",
 *   message: "A counselor answered: \"How do I apply for...\"",
 *   question: questionId,
 *   meta: { ... },
 * })
 */
export const notifyStudent = async (studentId, { type, title, message, question, meta }) => {
  if (!studentId) return null;

  try {
    const notification = await RealtimeNotification.create({
      recipient: studentId,
      recipientType: "Student",
      type,
      title,
      message,
      question: question || undefined,
      meta: meta || {},
    });

    emitToStudent(studentId, "notification:new", {
      _id: notification._id,
      type,
      title,
      message,
      question,
      meta,
      createdAt: notification.createdAt,
    });

    return notification;
  } catch (err) {
    console.error("notifyStudent failed:", err.message);
    return null;
  }
};

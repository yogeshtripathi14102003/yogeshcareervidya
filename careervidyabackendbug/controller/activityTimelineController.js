import Lead from "../models/counselor/Lead.js";
import Visitor from "../models/Admin/Visitor.js";
import PageVisit from "../models/Analytics/PageVisit.js";
import CourseView from "../models/Analytics/CourseView.js";
import RealtimeNotification from "../models/counselor/RealtimeNotification.js";
import AutomationLog from "../models/counselor/AutomationLog.js";
import { findStudentByContact } from "../utilities/studentMatching.js";
import { getViewableCounselorIds } from "../utilities/teamScope.js";
import { ADMITTED_STATUS } from "../constant/leadStatus.js";

export const getLeadTimeline = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).lean();
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    // Same read-scoping used everywhere else: a counselor only sees their
    // own (or their team's) lead timelines, never someone else's.
    if (!["admin", "subadmin"].includes(req.user?.role)) {
      const viewableIds = await getViewableCounselorIds(req.user);
      if (!viewableIds.includes(String(lead.assignedTo))) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    const events = [];

    // ---- Lead lifecycle events ----
    events.push({
      time: lead.createdAt,
      type: "lead_created",
      label: `Lead created${lead.source ? ` (source: ${lead.source})` : ""}`,
    });

    if (lead.assignedAt) {
      events.push({
        time: lead.assignedAt,
        type: "assigned",
        label: `Assigned to ${lead.assignedToName || "a counselor"}`,
      });
    }

    (lead.followUpHistory || []).forEach((entry) => {
      events.push({
        time: entry.date,
        type: "follow_up",
        label: entry.remark
          ? `Counselor follow-up: ${entry.remark}${entry.status ? ` (${entry.status})` : ""}`
          : `Status updated${entry.status ? ` to ${entry.status}` : ""}`,
      });
    });

    if (lead.resolvedAt) {
      events.push({
        time: lead.resolvedAt,
        type: lead.status === ADMITTED_STATUS ? "admission" : "lost",
        label:
          lead.status === ADMITTED_STATUS
            ? "Admission completed 🎉"
            : `Marked lost${lead.lostReason ? `: ${lead.lostReason}` : ""}`,
      });
    }

    // ---- Real-time notification events (Module 6/7) ----
    const notifications = await RealtimeNotification.find({ lead: lead._id })
      .select("type title message createdAt")
      .lean();
    notifications.forEach((n) => {
      events.push({ time: n.createdAt, type: n.type, label: n.message || n.title });
    });

    // ---- Automation events (Module 8) ----
    const automationLogs = await AutomationLog.find({ lead: lead._id })
      .select("stepLabel action createdAt")
      .lean();
    automationLogs.forEach((l) => {
      events.push({
        time: l.createdAt,
        type: "automation",
        label: `Automated action: ${l.stepLabel}`,
      });
    });

    // ---- Website activity, if this lead matches a Student account ----
    const student = await findStudentByContact({ email: lead.email, phone: lead.phone });
    if (student) {
      const sessions = await Visitor.find({ userId: student._id }).select("sessionId").lean();
      const sessionIds = sessions.map((s) => s.sessionId).filter(Boolean);

      if (sessionIds.length) {
        const pageVisits = await PageVisit.find({ sessionId: { $in: sessionIds } })
          .select("page enterTime events")
          .limit(200)
          .lean();

        pageVisits.forEach((pv) => {
          events.push({ time: pv.enterTime, type: "page_visit", label: `Visited ${pv.page}` });
          (pv.events || []).forEach((e) => {
            events.push({ time: e.at, type: e.type, label: describeEvent(e.type) });
          });
        });
      }

      const courseViews = await CourseView.find({ userId: student._id })
        .select("course applyClicked registered brochureDownloaded createdAt updatedAt")
        .populate("course", "name")
        .limit(100)
        .lean();

      courseViews.forEach((cv) => {
        const courseName = cv.course?.name || "a course";
        events.push({ time: cv.createdAt, type: "course_view", label: `Viewed ${courseName}` });
        if (cv.applyClicked) events.push({ time: cv.updatedAt, type: "applied", label: `Started applying for ${courseName}` });
        if (cv.registered) events.push({ time: cv.updatedAt, type: "registered", label: `Registered for ${courseName}` });
        if (cv.brochureDownloaded) events.push({ time: cv.updatedAt, type: "brochure", label: `Downloaded brochure for ${courseName}` });
      });
    }

    events.sort((a, b) => new Date(a.time) - new Date(b.time));

    res.status(200).json({
      success: true,
      lead: { _id: lead._id, name: lead.name, course: lead.course, status: lead.status },
      matchedStudent: !!student,
      timeline: events,
    });
  } catch (err) {
    console.error("getLeadTimeline error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const describeEvent = (type) => {
  const map = {
    download: "Downloaded a file",
    apply_click: "Clicked Apply",
    register_click: "Clicked Register",
    login_click: "Logged in",
    brochure_download: "Downloaded brochure",
  };
  return map[type] || type;
};

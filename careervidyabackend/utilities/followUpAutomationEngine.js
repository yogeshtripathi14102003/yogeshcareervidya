import Lead from "../models/counselor/Lead.js";
import FollowUpAutomationConfig from "../models/counselor/FollowUpAutomationConfig.js";
import AutomationLog from "../models/counselor/AutomationLog.js";
import { ADMITTED_STATUS, LOST_STATUSES } from "../constant/leadStatus.js";
import { autoAssignLead } from "./leadAssignmentEngine.js";
import { notifyCounselor } from "./notifyCounselor.js";
import { emitToAdmins } from "../socket.js";

const MAX_LEADS_PER_STEP_PER_SWEEP = 500;

const getConfig = async () => {
  let config = await FollowUpAutomationConfig.findOne();
  if (!config) config = await FollowUpAutomationConfig.create({});
  return config;
};

const runStepForLeads = async (step, leads) => {
  for (const lead of leads) {
    try {
      if (step.action === "reminder") {
        if (lead.assignedTo) {
          await notifyCounselor(lead.assignedTo, {
            type: "lead_assigned", // reuses the existing bell icon set; not a new lead, just a nudge
            title: "Follow-up Reminder",
            message: `${lead.name} hasn't been followed up on — ${step.label}.`,
            lead: lead._id,
            meta: { automationStep: step.label },
          });
        }
      } else if (step.action === "manager_notification") {
        emitToAdmins("notification:new", {
          type: "manager_notification",
          title: "Lead Needs Attention",
          message: `${lead.name} (assigned to ${lead.assignedToName || "unassigned"}) has had no follow-up — ${step.label}.`,
          lead: lead._id,
          createdAt: new Date(),
        });
      } else if (step.action === "auto_reassign") {
        const assignment = await autoAssignLead(lead.toObject());
        if (assignment && String(assignment.counselorId) !== String(lead.assignedTo)) {
          const previousCounselor = lead.assignedTo;
          lead.assignedTo = assignment.counselorId;
          lead.assignedToName = assignment.counselorName;
          lead.assignedAt = new Date();

          if (previousCounselor) {
            notifyCounselor(previousCounselor, {
              type: "lead_assigned",
              title: "Lead Auto-Reassigned",
              message: `${lead.name} was auto-reassigned after ${step.label} with no follow-up.`,
              lead: lead._id,
            });
          }
          notifyCounselor(assignment.counselorId, {
            type: "lead_assigned",
            title: "New Lead Assigned",
            message: `${lead.name}${lead.course ? ` (${lead.course})` : ""} was auto-reassigned to you (previous counselor didn't follow up in time).`,
            lead: lead._id,
          });
        }
      }

      lead.firedAutomationSteps = [...(lead.firedAutomationSteps || []), String(step._id)];
      await lead.save();

      await AutomationLog.create({
        lead: lead._id,
        stepLabel: step.label,
        action: step.action,
        details: `Triggered for "${lead.name}"`,
      });
    } catch (err) {
      console.error(`Follow-up automation failed for lead ${lead._id}, step "${step.label}":`, err.message);
    }
  }
};

/** One sweep: check every configured step against every still-open lead
 * that hasn't already had that step fired since its last follow-up. */
export const runFollowUpSweep = async () => {
  const config = await getConfig();
  if (!config.enabled || !config.steps?.length) return { skipped: true };

  let totalFired = 0;

  for (const step of config.steps) {
    const cutoff = new Date(Date.now() - step.afterMinutes * 60 * 1000);
    const stepId = String(step._id);

    const dueLeads = await Lead.find({
      status: { $nin: [ADMITTED_STATUS, ...LOST_STATUSES] },
      firedAutomationSteps: { $ne: stepId },
      $expr: {
        $lte: [{ $ifNull: ["$lastFollowUpAt", "$createdAt"] }, cutoff],
      },
    }).limit(MAX_LEADS_PER_STEP_PER_SWEEP);

    if (dueLeads.length) {
      await runStepForLeads(step, dueLeads);
      totalFired += dueLeads.length;
    }
  }

  return { skipped: false, totalFired };
};

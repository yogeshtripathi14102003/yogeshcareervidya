import http from "http";
import cron from "node-cron";
import app from "./app.js";
import "dotenv/config";
import { initSocket } from "./socket.js";
import { runFollowUpSweep } from "./utilities/followUpAutomationEngine.js";
import { recalculateAllOpenLeadScores } from "./utilities/leadScoringEngine.js";

const PORT = process.env.PORT || 8080;

// Wrap the Express app in a raw HTTP server so Socket.IO (Module 6) can
// attach to the same port instead of needing a separate one.
const httpServer = http.createServer(app);
initSocket(httpServer);

// Module 8: Follow-up Automation — every 5 minutes is fine-grained enough
// to honor a configured "5 minute reminder" step reasonably promptly,
// without hammering the DB. Recalculates from lead timestamps each run,
// so there's no lost-job risk if the process restarts between sweeps.
cron.schedule("*/5 * * * *", () => {
  runFollowUpSweep().catch((err) => console.error("Follow-up sweep failed:", err.message));
});

// Module 11: AI Lead Scoring — recalculating is a bit heavier (a handful
// of queries per lead) and less time-critical than follow-up reminders,
// so it runs less often.
cron.schedule("*/15 * * * *", () => {
  recalculateAllOpenLeadScores().catch((err) => console.error("Lead scoring sweep failed:", err.message));
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO listening on the same port`);
  console.log(`Follow-up automation sweep scheduled every 5 minutes`);
  console.log(`Lead scoring sweep scheduled every 15 minutes`);
});

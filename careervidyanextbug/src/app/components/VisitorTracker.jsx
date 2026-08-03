"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { startSession, trackPageChange, trackFinalExit, sendHeartbeat } from "@/utlis/analytics.js";

// Orchestrates Module 1 (session) + Module 2 (page journey) tracking.
// Mounted once, globally, in the root layout.
export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    startSession();

    // Module 10: lightweight heartbeat so the admin dashboard's "online
    // now" cards reflect reality, not just "started a session at some point".
    const heartbeatTimer = setInterval(sendHeartbeat, 60 * 1000);

    const handleUnload = () => trackFinalExit();
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);
    return () => {
      clearInterval(heartbeatTimer);
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
    };
  }, []);

  useEffect(() => {
    if (pathname) trackPageChange(pathname);
  }, [pathname]);

  return null;
}

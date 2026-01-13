

import api from "@/utlis/api.js";

export const trackVisitor = async () => {
  try {
    if (typeof window === "undefined") return;

    // 🔒 Session level tracking (ONLY ONCE)
    if (sessionStorage.getItem("visitor_tracked")) return;
    sessionStorage.setItem("visitor_tracked", "true");

    const data = {
      page: window.location.pathname, // sirf reference ke liye
      browser:
        navigator.userAgentData?.brands?.[0]?.brand ||
        navigator.userAgent ||
        "Unknown",
      device: navigator.userAgentData?.mobile ? "Mobile" : "Desktop",
      os: navigator.platform || "Unknown",
      referrer: document.referrer || "Direct",
    };

    // ✅ Backend handles uniqueness
    await api.post("/api/v1/track", data);
  } catch (error) {
    console.error("Visitor tracking failed:", error);
  }
};

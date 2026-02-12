import api from "@/utlis/api.js";

export const trackVisitor = async (page) => {
  try {
    if (typeof window === "undefined") return;

    // Session check: ek page pe sirf ek baar track kare
    const key = `visited-${page}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "true");

    // Check returning user
    const isReturning = localStorage.getItem("visited") === "true";
    localStorage.setItem("visited", "true");

    const data = {
      page,
      browser: navigator.userAgentData?.brands?.[0]?.brand || "Unknown",
      device: navigator.userAgentData?.mobile ? "Mobile" : "Desktop",
      os: navigator.platform,
      referrer: document.referrer || "Direct",
      isReturning,
    };

    // ✅ Use axios instance from api.js (baseURL already set)
    await api.post("/api/v1/track", data);
  } catch (error) {
    console.error("Visitor tracking failed:", error);
  }
};

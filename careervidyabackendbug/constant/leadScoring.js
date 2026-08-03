// Point values from the spec's own example ladder.
export const SCORE_POINTS = {
  visitedMultipleTimes: 10,
  // viewedFees: 20,        — not scored yet: no "fees page" is tracked
  //                           anywhere (Module 6 flagged this same gap).
  // brochureDownload: 20,  — not scored yet: no brochure-download button
  //                           exists in the UI to fire this event from.
  registered: 25,
  loggedIn: 20,
  applied: 30,
  documentsUploaded: 40,
  noActivity: -20,
};

// Four tiers as specified: Cold / Warm / Hot / Priority.
export const TIER_THRESHOLDS = {
  cold: 0,
  warm: 30,
  hot: 60,
  priority: 90,
};

export const getTierFromScore = (score) => {
  if (score >= TIER_THRESHOLDS.priority) return "priority";
  if (score >= TIER_THRESHOLDS.hot) return "hot";
  if (score >= TIER_THRESHOLDS.warm) return "warm";
  return "cold";
};

export const TIER_LABELS = {
  cold: "Cold Lead",
  warm: "Warm Lead",
  hot: "Hot Lead",
  priority: "Priority Lead",
};

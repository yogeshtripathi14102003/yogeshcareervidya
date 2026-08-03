import { Loader2 } from "lucide-react";

export function Loader({ label = "Loading…", size = 20, className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-sm text-slate-400 py-8 ${className}`}>
      <Loader2 size={size} className="animate-spin" />
      {label}
    </div>
  );
}

export function SkeletonLine({ width = "100%", height = "1rem", className = "" }) {
  return (
    <div
      className={`bg-slate-100 rounded animate-pulse ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
      <SkeletonLine width="40%" height="0.75rem" />
      <SkeletonLine width="80%" height="1.25rem" />
      <SkeletonLine width="100%" height="0.875rem" />
      <SkeletonLine width="60%" height="0.875rem" />
    </div>
  );
}

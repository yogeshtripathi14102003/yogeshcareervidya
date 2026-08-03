"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext.jsx";

/**
 * Wrap any protected layout/page with this. Redirects to /login if the
 * session isn't valid, or to `fallback` if the role isn't allowed.
 *
 * <RoleGuard allow={["admin", "subadmin"]}>{children}</RoleGuard>
 */
export default function RoleGuard({
  allow = [],
  fallback = "/login",
  loadingFallback = null,
  children,
}) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`${fallback}?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (allow.length && !allow.includes(role)) {
      router.replace(fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, role]);

  if (isLoading || !isAuthenticated || (allow.length && !allow.includes(role))) {
    return (
      loadingFallback ?? (
        <div className="w-full h-screen flex items-center justify-center text-sm font-semibold text-slate-500">
          Verifying access…
        </div>
      )
    );
  }

  return children;
}

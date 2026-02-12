"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackVisitor } from "@/utlis/trackVisitor"; // ✅ SAFE

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackVisitor(pathname);
  }, [pathname]);

  return null;
}

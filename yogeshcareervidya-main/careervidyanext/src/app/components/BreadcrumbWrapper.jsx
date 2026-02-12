"use client";
import dynamic from "next/dynamic";

// Dynamically import BreadcrumbTrail with SSR disabled
const BreadcrumbTrail = dynamic(() => import("./BreadcrumbTrail"), {
  ssr: false,
});

export default function BreadcrumbWrapper() {
  return <BreadcrumbTrail />;
}

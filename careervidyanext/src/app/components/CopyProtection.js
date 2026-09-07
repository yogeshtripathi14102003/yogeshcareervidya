
// "use client";

// import { useEffect } from "react";
// import { usePathname } from "next/navigation";

// export default function CopyProtection() {
//   const pathname = usePathname();

//   useEffect(() => {
//     // ✅ Dashboard aur uske sab child routes allow
//     const isDashboard = pathname.startsWith("/counselordashbord");

//     if (isDashboard) return;

//     const handleCopy = (e) => e.preventDefault();
//     const handleCut = (e) => e.preventDefault();

//     const handleKeyDown = (e) => {
//       if (e.ctrlKey && ["c", "a", "x"].includes(e.key.toLowerCase())) {
//         e.preventDefault();
//       }
//     };

//     const handleSelect = (e) => e.preventDefault();
//     const handleDrag = (e) => e.preventDefault();

//     document.addEventListener("copy", handleCopy);
//     document.addEventListener("cut", handleCut);
//     document.addEventListener("keydown", handleKeyDown);
//     document.addEventListener("selectstart", handleSelect);
//     document.addEventListener("dragstart", handleDrag);

//     return () => {
//       document.removeEventListener("copy", handleCopy);
//       document.removeEventListener("cut", handleCut);
//       document.removeEventListener("keydown", handleKeyDown);
//       document.removeEventListener("selectstart", handleSelect);
//       document.removeEventListener("dragstart", handleDrag);
//     };
//   }, [pathname]);

//   return null;
// }


"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function CopyProtection() {
  const pathname = usePathname();

  useEffect(() => {
    // Admin aur Counselor Dashboard par
    // Copy / Paste / Select completely allowed
    const isAllowedRoute =
      pathname.startsWith("/admin") ||
      pathname.startsWith("/counselordashbord");

    if (isAllowedRoute) return;

    // Public website par copy protection
    const handleCopy = (e) => e.preventDefault();

    const handleCut = (e) => e.preventDefault();

    const handleKeyDown = (e) => {
      // Ctrl + C
      // Ctrl + A
      // Ctrl + X
      if (
        e.ctrlKey &&
        ["c", "a", "x"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }

      // Mac support: Cmd + C / A / X
      if (
        e.metaKey &&
        ["c", "a", "x"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
    };

    // Text selection disable
    const handleSelect = (e) => e.preventDefault();

    // Dragging content disable
    const handleDrag = (e) => e.preventDefault();

    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("selectstart", handleSelect);
    document.addEventListener("dragstart", handleDrag);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("selectstart", handleSelect);
      document.removeEventListener("dragstart", handleDrag);
    };
  }, [pathname]);

  return null;
}


"use client";

import { useEffect } from "react";

export default function CopyProtection() {
  useEffect(() => {
    // ❌ Copy block
    const handleCopy = (e) => {
      e.preventDefault();
    };

    // ❌ Cut block
    const handleCut = (e) => {
      e.preventDefault();
    };

    // ❌ Keyboard shortcuts block (Ctrl+C, Ctrl+A)
    const handleKeyDown = (e) => {
      if (
        e.ctrlKey &&
        ["c", "a", "x"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
    };

    // ❌ Text selection block
    const handleSelect = (e) => {
      e.preventDefault();
    };

    // ❌ Drag block (images/text)
    const handleDrag = (e) => {
      e.preventDefault();
    };

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
  }, []);

  return null;
}
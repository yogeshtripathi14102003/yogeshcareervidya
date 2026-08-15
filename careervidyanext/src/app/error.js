"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-sm w-full text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center mb-4">
          <AlertTriangle size={26} />
        </div>
        <h1 className="font-bold text-slate-800">Something went wrong</h1>
        <p className="text-sm text-slate-500 mt-2">
          This page hit an unexpected error. You can try again, or head back to the homepage.
        </p>
        <div className="flex gap-2 mt-6">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium"
          >
            <RotateCcw size={14} /> Try again
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center border border-slate-300 py-2 rounded-lg text-sm font-medium text-slate-700"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
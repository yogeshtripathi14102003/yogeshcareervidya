"use client";

import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, icon, className = "", containerClassName = "", ...props },
  ref
) {
  return (
    <div className={containerClassName}>
      {label && <label className="block mb-1 text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          ref={ref}
          className={`w-full border rounded-lg text-sm py-2 ${icon ? "pl-9 pr-3" : "px-3"} outline-none transition-colors
            ${error ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default Input;

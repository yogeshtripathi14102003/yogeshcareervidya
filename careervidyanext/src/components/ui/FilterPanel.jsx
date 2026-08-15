"use client";

import { X } from "lucide-react";
import Select from "./Select.jsx";

/**
 * filters: [{ key, label, options, value, onChange }]
 */
export default function FilterPanel({ filters, onClearAll }) {
  const hasActive = filters.some((f) => f.value);

  return (
    <div className="flex flex-wrap items-end gap-2">
      {filters.map((f) => (
        <Select
          key={f.key}
          label={f.label}
          value={f.value}
          onChange={(e) => f.onChange(e.target.value)}
          options={f.options}
          placeholder={`All ${f.label}`}
          containerClassName="min-w-[140px]"
        />
      ))}
      {hasActive && onClearAll && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 pb-2.5"
        >
          <X size={12} /> Clear filters
        </button>
      )}
    </div>
  );
}

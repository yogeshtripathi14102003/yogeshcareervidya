"use client";

export default function Select({ label, error, options = [], placeholder, className = "", containerClassName = "", ...props }) {
  return (
    <div className={containerClassName}>
      {label && <label className="block mb-1 text-sm font-medium text-slate-700">{label}</label>}
      <select
        className={`w-full border rounded-lg text-sm py-2 px-3 outline-none transition-colors bg-white
          ${error ? "border-red-400" : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}
          ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) =>
          typeof opt === "string" ? (
            <option key={opt} value={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )
        )}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

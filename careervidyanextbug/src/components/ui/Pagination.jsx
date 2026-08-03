import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 text-sm">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="p-1.5 border rounded-lg disabled:opacity-40 hover:bg-slate-50"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="px-2 text-slate-500">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="p-1.5 border rounded-lg disabled:opacity-40 hover:bg-slate-50"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

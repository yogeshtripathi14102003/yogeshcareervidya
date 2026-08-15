import { AlertCircle } from "lucide-react";
import Button from "./Button.jsx";

export default function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center mb-3">
        <AlertCircle size={26} />
      </div>
      <p className="font-semibold text-slate-700">{title}</p>
      {message && <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">{message}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

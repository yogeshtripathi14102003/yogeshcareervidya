export default function Card({ children, className = "", padding = "p-5" }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm ${padding} ${className}`}>
      {children}
    </div>
  );
}

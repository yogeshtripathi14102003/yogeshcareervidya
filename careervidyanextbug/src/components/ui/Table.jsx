import { Loader } from "./Loader.jsx";
import EmptyState from "./EmptyState.jsx";

/**
 * columns: [{ key, label, render?: (row) => ReactNode }]
 */
export default function Table({ columns, data = [], loading, emptyMessage = "No records found.", rowKey = "_id" }) {
  if (loading) return <Loader />;
  if (!data.length) return <EmptyState title="No data" message={emptyMessage} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 border-b bg-slate-50">
            {columns.map((col) => (
              <th key={col.key} className="py-2.5 px-4 font-medium">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row[rowKey]} className="border-b last:border-0 hover:bg-slate-50">
              {columns.map((col) => (
                <td key={col.key} className="py-2.5 px-4">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import api from "@/utlis/api.js";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import {
//   Search,
//   RefreshCw,
//   Trash2,
//   Download,
//   Users,
//   CalendarDays,
//   X,
// } from "lucide-react";

// export default function GetInTouchTable() {
//   const [queries, setQueries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deleting, setDeleting] = useState(false);
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   // ============================================================
//   // FETCH ALL QUERIES
//   // ============================================================

//   useEffect(() => {
//     const fetchQueries = async () => {
//       try {
//         const res = await api.get("/api/v1/getintouch");
//         setQueries(res.data.data || res.data);
//       } catch (err) {
//         console.error("Error fetching queries:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQueries();
//   }, []);

//   // ============================================================
//   // FILTER
//   // ============================================================

//   const filteredQueries = queries.filter((q) => {
//     const term = search.toLowerCase();
//     const created = new Date(q.createdAt);

//     const matchesSearch =
//       q.name.toLowerCase().includes(term) ||
//       q.email.toLowerCase().includes(term) ||
//       q.mobile.toLowerCase().includes(term) ||
//       (q.course && q.course.toLowerCase().includes(term)) ||
//       (q.branch && q.branch.toLowerCase().includes(term));

//     const matchesDate =
//       (!fromDate || created >= new Date(fromDate)) &&
//       (!toDate || created <= new Date(toDate));

//     return matchesSearch && matchesDate;
//   });

//   // ============================================================
//   // SELECT
//   // ============================================================

//   const toggleSelect = (id) => {
//     setSelected((prev) =>
//       prev.includes(id)
//         ? prev.filter((x) => x !== id)
//         : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (selected.length === filteredQueries.length) {
//       setSelected([]);
//     } else {
//       setSelected(filteredQueries.map((q) => q._id));
//     }
//   };

//   // ============================================================
//   // DELETE SINGLE
//   // ============================================================

//   const handleSingleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this query?")) return;

//     try {
//       setDeleting(true);

//       await api.delete(`/api/v1/getintouch/${id}`);

//       setQueries((prev) => prev.filter((q) => q._id !== id));

//       alert("Query deleted successfully!");
//     } catch (err) {
//       console.error("Error deleting:", err);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // ============================================================
//   // BULK DELETE
//   // ============================================================

//   const handleBulkDelete = async () => {
//     if (selected.length === 0) {
//       alert("Select at least one query!");
//       return;
//     }

//     if (
//       !confirm(
//         `Delete ${selected.length} selected quer${
//           selected.length > 1 ? "ies" : "y"
//         }?`
//       )
//     )
//       return;

//     try {
//       setDeleting(true);

//       await Promise.all(
//         selected.map((id) =>
//           api.delete(`/api/v1/getintouch/${id}`)
//         )
//       );

//       setQueries((prev) =>
//         prev.filter((q) => !selected.includes(q._id))
//       );

//       setSelected([]);

//       alert("Selected queries deleted!");
//     } catch (err) {
//       console.error("Error:", err);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // ============================================================
//   // EXCEL DOWNLOAD
//   // ============================================================

//   const downloadExcel = () => {
//     const exportData = filteredQueries.map((q, i) => ({
//       SNo: i + 1,
//       Name: q.name,
//       City: q.city,
//       Course: q.course,
//       Branch: q.branch,
//       Email: q.email,
//       Mobile: q.mobile,
//       Message: q.message,
//       Date: new Date(q.createdAt).toLocaleString(),
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);

//     const workbook = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(
//       workbook,
//       worksheet,
//       "Queries"
//     );

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const blob = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });

//     saveAs(
//       blob,
//       `GetInTouch_${Date.now()}.xlsx`
//     );
//   };

//   // ============================================================
//   // UI
//   // ============================================================

//   return (
//     <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

//       <div className="max-w-7xl mx-auto">

//         {/* ======================================================
//             HEADER
//         ====================================================== */}

//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
//               Get In Touch Queries
//             </h1>

//             <p className="text-sm text-slate-500 mt-1">
//               Manage and view all customer enquiries.
//             </p>
//           </div>

//           {/* Download */}

//           <button
//             onClick={downloadExcel}
//             className="
//               inline-flex
//               items-center
//               justify-center
//               gap-2
//               px-4
//               py-2.5
//               bg-white
//               border
//               border-slate-200
//               rounded-lg
//               text-sm
//               font-semibold
//               text-slate-700
//               hover:bg-slate-50
//               transition
//             "
//           >
//             <Download size={16} />
//             Download Excel
//           </button>

//         </div>

//         {/* ======================================================
//             STATS
//         ====================================================== */}

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

//           {/* Total */}

//           <div className="bg-white border border-slate-200 rounded-xl p-5">

//             <div className="flex items-center justify-between">

//               <div>
//                 <p className="text-sm text-slate-500">
//                   Total Queries
//                 </p>

//                 <p className="text-2xl font-bold text-slate-900 mt-1">
//                   {queries.length}
//                 </p>
//               </div>

//               <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
//                 <Users
//                   size={21}
//                   className="text-blue-600"
//                 />
//               </div>

//             </div>

//           </div>

//           {/* Filtered */}

//           <div className="bg-white border border-slate-200 rounded-xl p-5">

//             <div className="flex items-center justify-between">

//               <div>
//                 <p className="text-sm text-slate-500">
//                   Showing Results
//                 </p>

//                 <p className="text-2xl font-bold text-slate-900 mt-1">
//                   {filteredQueries.length}
//                 </p>
//               </div>

//               <div className="w-11 h-11 rounded-lg bg-orange-50 flex items-center justify-center">
//                 <Search
//                   size={21}
//                   className="text-orange-600"
//                 />
//               </div>

//             </div>

//           </div>

//         </div>

//         {/* ======================================================
//             TABLE CARD
//         ====================================================== */}

//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

//           {/* ====================================================
//               TOOLBAR
//           ==================================================== */}

//           <div className="p-4 sm:p-5 border-b border-slate-200">

//             <div className="flex flex-col xl:flex-row gap-3">

//               {/* Search */}

//               <div className="relative flex-1">

//                 <Search
//                   size={18}
//                   className="
//                     absolute
//                     left-3
//                     top-1/2
//                     -translate-y-1/2
//                     text-slate-400
//                   "
//                 />

//                 <input
//                   type="text"
//                   placeholder="Search name, email, mobile, course, branch..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="
//                     w-full
//                     h-11
//                     pl-10
//                     pr-4
//                     border
//                     border-slate-200
//                     rounded-lg
//                     text-sm
//                     text-slate-800
//                     placeholder:text-slate-400
//                     focus:outline-none
//                     focus:ring-2
//                     focus:ring-blue-100
//                     focus:border-blue-500
//                   "
//                 />

//               </div>

//               {/* Date Filters */}

//               <div className="flex flex-col sm:flex-row gap-3">

//                 <div className="flex items-center gap-2">

//                   <CalendarDays
//                     size={16}
//                     className="text-slate-400"
//                   />

//                   <input
//                     type="date"
//                     value={fromDate}
//                     onChange={(e) =>
//                       setFromDate(e.target.value)
//                     }
//                     className="
//                       h-11
//                       px-3
//                       border
//                       border-slate-200
//                       rounded-lg
//                       text-sm
//                       text-slate-700
//                       focus:outline-none
//                       focus:ring-2
//                       focus:ring-blue-100
//                     "
//                   />

//                 </div>

//                 <div className="flex items-center gap-2">

//                   <CalendarDays
//                     size={16}
//                     className="text-slate-400"
//                   />

//                   <input
//                     type="date"
//                     value={toDate}
//                     onChange={(e) =>
//                       setToDate(e.target.value)
//                     }
//                     className="
//                       h-11
//                       px-3
//                       border
//                       border-slate-200
//                       rounded-lg
//                       text-sm
//                       text-slate-700
//                       focus:outline-none
//                       focus:ring-2
//                       focus:ring-blue-100
//                     "
//                   />

//                 </div>

//               </div>

//               {/* Bulk Delete */}

//               <button
//                 onClick={handleBulkDelete}
//                 disabled={
//                   deleting ||
//                   selected.length === 0
//                 }
//                 className="
//                   h-11
//                   px-4
//                   rounded-lg
//                   text-sm
//                   font-semibold
//                   text-white
//                   inline-flex
//                   items-center
//                   justify-center
//                   gap-2
//                   transition
//                   disabled:bg-slate-300
//                   disabled:cursor-not-allowed
//                   bg-red-600
//                   hover:bg-red-700
//                 "
//               >

//                 <Trash2 size={16} />

//                 {deleting
//                   ? "Deleting..."
//                   : `Delete (${selected.length})`}

//               </button>

//             </div>

//             <div className="mt-3 text-xs text-slate-500">
//               Showing {filteredQueries.length} of{" "}
//               {queries.length} queries
//             </div>

//           </div>

//           {/* ====================================================
//               LOADING
//           ==================================================== */}

//           {loading ? (

//             <div className="p-10">

//               <div className="flex flex-col items-center justify-center">

//                 <RefreshCw
//                   size={28}
//                   className="text-blue-500 animate-spin"
//                 />

//                 <p className="text-sm text-slate-500 mt-3">
//                   Loading queries...
//                 </p>

//               </div>

//             </div>

//           ) : filteredQueries.length === 0 ? (

//             /* ==================================================
//                EMPTY
//             ================================================== */

//             <div className="py-16 px-5 text-center">

//               <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center">

//                 <Users
//                   size={25}
//                   className="text-slate-400"
//                 />

//               </div>

//               <h3 className="mt-4 text-base font-semibold text-slate-800">
//                 No queries found
//               </h3>

//               <p className="mt-1 text-sm text-slate-500">
//                 Try changing your search or date filters.
//               </p>

//             </div>

//           ) : (

//             /* ==================================================
//                TABLE
//             ================================================== */

//             <div className="overflow-x-auto">

//               <table className="w-full min-w-[1250px]">

//                 <thead>

//                   <tr className="bg-slate-50 border-b border-slate-200">

//                     <th className="px-5 py-3 text-center">
//                       <input
//                         type="checkbox"
//                         onChange={toggleSelectAll}
//                         checked={
//                           selected.length ===
//                             filteredQueries.length &&
//                           filteredQueries.length > 0
//                         }
//                         className="w-4 h-4 accent-blue-600"
//                       />
//                     </th>

//                     <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
//                       #
//                     </th>

//                     <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
//                       Name
//                     </th>

//                     <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
//                       City
//                     </th>

//                     <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
//                       Course
//                     </th>

//                     <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
//                       Branch
//                     </th>

//                     <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
//                       Email
//                     </th>

//                     <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
//                       Mobile
//                     </th>

//                     <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
//                       Message
//                     </th>

//                     <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
//                       Date
//                     </th>

//                     <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
//                       Action
//                     </th>

//                   </tr>

//                 </thead>

//                 <tbody className="divide-y divide-slate-100">

//                   {filteredQueries.map((q, index) => (

//                     <tr
//                       key={q._id}
//                       className={`
//                         transition
//                         hover:bg-slate-50/70
//                         ${
//                           selected.includes(q._id)
//                             ? "bg-blue-50"
//                             : ""
//                         }
//                       `}
//                     >

//                       {/* Checkbox */}

//                       <td className="px-5 py-4 text-center">

//                         <input
//                           type="checkbox"
//                           onChange={() =>
//                             toggleSelect(q._id)
//                           }
//                           checked={selected.includes(
//                             q._id
//                           )}
//                           className="w-4 h-4 accent-blue-600"
//                         />

//                       </td>

//                       {/* Number */}

//                       <td className="px-5 py-4 text-sm text-slate-500">
//                         {index + 1}
//                       </td>

//                       {/* Name */}

//                       <td className="px-5 py-4">

//                         <div className="font-semibold text-sm text-slate-800">
//                           {q.name}
//                         </div>

//                       </td>

//                       {/* City */}

//                       <td className="px-5 py-4 text-sm text-slate-600">
//                         {q.city || "-"}
//                       </td>

//                       {/* Course */}

//                       <td className="px-5 py-4">

//                         <span className="text-sm text-slate-700">
//                           {q.course || "-"}
//                         </span>

//                       </td>

//                       {/* Branch */}

//                       <td className="px-5 py-4 text-sm text-slate-600">
//                         {q.branch || "-"}
//                       </td>

//                       {/* Email */}

//                       <td className="px-5 py-4">

//                         <a
//                           href={`mailto:${q.email}`}
//                           className="text-sm text-blue-600 hover:text-blue-800"
//                         >
//                           {q.email}
//                         </a>

//                       </td>

//                       {/* Mobile */}

//                       <td className="px-5 py-4">

//                         <a
//                           href={`tel:${q.mobile}`}
//                           className="text-sm font-medium text-blue-600 hover:text-blue-800"
//                         >
//                           {q.mobile}
//                         </a>

//                       </td>

//                       {/* Message */}

//                       <td className="px-5 py-4 max-w-[250px]">

//                         <p
//                           className="text-sm text-slate-600 truncate"
//                           title={q.message}
//                         >
//                           {q.message || "-"}
//                         </p>

//                       </td>

//                       {/* Date */}

//                       <td className="px-5 py-4">

//                         <div className="flex items-center gap-1.5 text-xs text-slate-500">

//                           <CalendarDays size={14} />

//                           {new Date(
//                             q.createdAt
//                           ).toLocaleDateString()}

//                         </div>

//                       </td>

//                       {/* Action */}

//                       <td className="px-5 py-4 text-center">

//                         <button
//                           onClick={() =>
//                             handleSingleDelete(q._id)
//                           }
//                           disabled={deleting}
//                           title="Delete Query"
//                           className="
//                             inline-flex
//                             items-center
//                             justify-center
//                             w-9
//                             h-9
//                             rounded-lg
//                             text-red-500
//                             hover:bg-red-50
//                             hover:text-red-600
//                             transition
//                             disabled:opacity-50
//                           "
//                         >

//                           <Trash2 size={17} />

//                         </button>

//                       </td>

//                     </tr>

//                   ))}

//                 </tbody>

//               </table>

//             </div>

//           )}

//         </div>

//       </div>

//     </main>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/utlis/api.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Pagination from "@/app/admin/components/Pagination.jsx";
import {
  Search,
  RefreshCw,
  Trash2,
  Download,
  Users,
  CalendarDays,
  X,
} from "lucide-react";

const PAGE_SIZE = 10;

export default function GetInTouchTable() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);

  // ============================================================
  // FETCH ALL QUERIES (saare pages, backend default limit ke bawajood)
  // ============================================================

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const limit = 100;
        let pageNo = 1;
        let all = [];
        let total = null;
        let prevFirstId = null;

        while (pageNo <= 200) {
          const res = await api.get("/api/v1/getintouch", {
            params: { page: pageNo, limit },
          });

          const batch = Array.isArray(res.data)
            ? res.data
            : res.data.data || [];
          const meta = res.data.pagination || {};

          const apiTotal =
            res.data.total ??
            res.data.totalCount ??
            res.data.count ??
            meta.total ??
            meta.totalItems ??
            null;

          if (apiTotal !== null) total = Number(apiTotal);

          // Backend page param ignore kare to same data repeat hoga -> stop
          if (batch.length === 0 || batch[0]?._id === prevFirstId) break;
          prevFirstId = batch[0]?._id;

          all = [...all, ...batch];

          if (total !== null && all.length >= total) break;

          pageNo += 1;
        }

        setQueries(all);
      } catch (err) {
        console.error("Error fetching queries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredQueries = useMemo(() => {
    const term = search.trim().toLowerCase();
    const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
    const to = toDate ? new Date(`${toDate}T23:59:59.999`) : null;

    return queries.filter((q) => {
      const matchesSearch =
        !term ||
        [q.name, q.email, q.mobile, q.city, q.course, q.branch].some((v) =>
          String(v ?? "").toLowerCase().includes(term)
        );

      const created = new Date(q.createdAt);
      const validDate = !isNaN(created);

      const matchesDate =
        (!from || (validDate && created >= from)) &&
        (!to || (validDate && created <= to));

      return matchesSearch && matchesDate;
    });
  }, [queries, search, fromDate, toDate]);

  // Filter badalne par pehle page par wapas
  useEffect(() => {
    setPage(1);
  }, [search, fromDate, toDate]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQueries.length / PAGE_SIZE)
  );
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;

  const paginatedQueries = filteredQueries.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // ============================================================
  // SELECT (select all = current page ki rows)
  // ============================================================

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allOnPageSelected =
    paginatedQueries.length > 0 &&
    paginatedQueries.every((q) => selected.includes(q._id));

  const toggleSelectAll = () => {
    const pageIds = paginatedQueries.map((q) => q._id);

    if (allOnPageSelected) {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  // ============================================================
  // DELETE SINGLE
  // ============================================================

  const handleSingleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this query?")) return;

    try {
      setDeleting(true);

      await api.delete(`/api/v1/getintouch/${id}`);

      setQueries((prev) => prev.filter((q) => q._id !== id));
      setSelected((prev) => prev.filter((x) => x !== id));

      alert("Query deleted successfully!");
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // BULK DELETE
  // ============================================================

  const handleBulkDelete = async () => {
    if (selected.length === 0) {
      alert("Select at least one query!");
      return;
    }

    if (
      !confirm(
        `Delete ${selected.length} selected quer${
          selected.length > 1 ? "ies" : "y"
        }?`
      )
    )
      return;

    try {
      setDeleting(true);

      await Promise.all(
        selected.map((id) => api.delete(`/api/v1/getintouch/${id}`))
      );

      setQueries((prev) => prev.filter((q) => !selected.includes(q._id)));

      setSelected([]);

      alert("Selected queries deleted!");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // EXCEL DOWNLOAD (sab filtered records, sirf current page nahi)
  // ============================================================

  const downloadExcel = () => {
    const exportData = filteredQueries.map((q, i) => ({
      SNo: i + 1,
      Name: q.name,
      City: q.city,
      Course: q.course,
      Branch: q.branch,
      Email: q.email,
      Mobile: q.mobile,
      Message: q.message,
      Date: new Date(q.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Queries");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `GetInTouch_${Date.now()}.xlsx`);
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Get In Touch Queries
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage and view all customer enquiries.
            </p>
          </div>

          {/* Download */}

          <button
            onClick={downloadExcel}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Download size={16} />
            Download Excel
          </button>
        </div>

        {/* ======================================================
            STATS
        ====================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Total */}

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Queries</p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {queries.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users size={21} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Filtered */}

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Showing Results</p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {filteredQueries.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-orange-50 flex items-center justify-center">
                <Search size={21} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            TABLE CARD
        ====================================================== */}

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* ====================================================
              TOOLBAR
          ==================================================== */}

          <div className="p-4 sm:p-5 border-b border-slate-200">
            <div className="flex flex-col xl:flex-row gap-3">
              {/* Search */}

              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search name, email, mobile, city, course, branch..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>

              {/* Date Filters */}

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-slate-400" />

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="h-11 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-slate-400" />

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="h-11 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Bulk Delete */}

              <button
                onClick={handleBulkDelete}
                disabled={deleting || selected.length === 0}
                className="h-11 px-4 rounded-lg text-sm font-semibold text-white inline-flex items-center justify-center gap-2 transition disabled:bg-slate-300 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700"
              >
                <Trash2 size={16} />

                {deleting ? "Deleting..." : `Delete (${selected.length})`}
              </button>
            </div>

            <div className="mt-3 text-xs text-slate-500">
              Showing {paginatedQueries.length} of {filteredQueries.length}{" "}
              queries
              {filteredQueries.length !== queries.length &&
                ` (filtered from ${queries.length})`}
            </div>
          </div>

          {/* ====================================================
              LOADING
          ==================================================== */}

          {loading ? (
            <div className="p-10">
              <div className="flex flex-col items-center justify-center">
                <RefreshCw
                  size={28}
                  className="text-blue-500 animate-spin"
                />

                <p className="text-sm text-slate-500 mt-3">
                  Loading queries...
                </p>
              </div>
            </div>
          ) : filteredQueries.length === 0 ? (
            /* ==================================================
               EMPTY
            ================================================== */

            <div className="py-16 px-5 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                <Users size={25} className="text-slate-400" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-800">
                No queries found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or date filters.
              </p>
            </div>
          ) : (
            /* ==================================================
               TABLE
            ================================================== */

            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1250px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-5 py-3 text-center">
                        <input
                          type="checkbox"
                          onChange={toggleSelectAll}
                          checked={allOnPageSelected}
                          className="w-4 h-4 accent-blue-600"
                          title="Select all on this page"
                        />
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                        #
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                        Name
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                        City
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                        Course
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                        Branch
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                        Email
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                        Mobile
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                        Message
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                        Date
                      </th>

                      <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {paginatedQueries.map((q, index) => (
                      <tr
                        key={q._id}
                        className={`transition hover:bg-slate-50/70 ${
                          selected.includes(q._id) ? "bg-blue-50" : ""
                        }`}
                      >
                        {/* Checkbox */}

                        <td className="px-5 py-4 text-center">
                          <input
                            type="checkbox"
                            onChange={() => toggleSelect(q._id)}
                            checked={selected.includes(q._id)}
                            className="w-4 h-4 accent-blue-600"
                          />
                        </td>

                        {/* Number (pagination ke saath continue) */}

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {startIndex + index + 1}
                        </td>

                        {/* Name */}

                        <td className="px-5 py-4">
                          <div className="font-semibold text-sm text-slate-800">
                            {q.name}
                          </div>
                        </td>

                        {/* City */}

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {q.city || "-"}
                        </td>

                        {/* Course */}

                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-700">
                            {q.course || "-"}
                          </span>
                        </td>

                        {/* Branch */}

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {q.branch || "-"}
                        </td>

                        {/* Email */}

                        <td className="px-5 py-4">
                          <a
                            href={`mailto:${q.email}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {q.email}
                          </a>
                        </td>

                        {/* Mobile */}

                        <td className="px-5 py-4">
                          <a
                            href={`tel:${q.mobile}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            {q.mobile}
                          </a>
                        </td>

                        {/* Message */}

                        <td className="px-5 py-4 max-w-[250px]">
                          <p
                            className="text-sm text-slate-600 truncate"
                            title={q.message}
                          >
                            {q.message || "-"}
                          </p>
                        </td>

                        {/* Date */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <CalendarDays size={14} />

                            {new Date(q.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Action */}

                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => handleSingleDelete(q._id)}
                            disabled={deleting}
                            title="Delete Query"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}

              <div className="border-t border-slate-200">
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
// "use client";

// import { useEffect, useState } from "react";
// import api from "@/utlis/api.js"; 
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// export default function GetInTouchTable() {
//   const [queries, setQueries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deleting, setDeleting] = useState(false);
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   // ✅ Fetch all queries
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

//   // ✅ Filter by search and date range
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

//   // ✅ Select toggle
//   const toggleSelect = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   // ✅ Select All
//   const toggleSelectAll = () => {
//     if (selected.length === filteredQueries.length) {
//       setSelected([]);
//     } else {
//       setSelected(filteredQueries.map((q) => q._id));
//     }
//   };

//   // ✅ Delete single item
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

//   // ✅ Bulk delete
//   const handleBulkDelete = async () => {
//     if (selected.length === 0) {
//       alert("Select at least one query!");
//       return;
//     }

//     if (!confirm(`Delete ${selected.length} selected quer${
//         selected.length > 1 ? "ies" : "y"
//       }?`)
//     )
//       return;

//     try {
//       setDeleting(true);
//       await Promise.all(
//         selected.map((id) => api.delete(`/api/v1/getintouch/${id}`))
//       );
//       setQueries((prev) => prev.filter((q) => !selected.includes(q._id)));
//       setSelected([]);
//       alert("Selected queries deleted!");
//     } catch (err) {
//       console.error("Error:", err);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // ✅ Excel Download Function
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

//     XLSX.utils.book_append_sheet(workbook, worksheet, "Queries");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const blob = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });

//     saveAs(blob, `GetInTouch_${Date.now()}.xlsx`);
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 py-10 px-6">
//       <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
//         Get In Touch Queries
//       </h1>

//       {/* Search + Filters + Buttons */}
//       <div className="flex flex-col lg:flex-row flex-wrap items-center justify-between mb-6 gap-3">
//         {/* Search */}
//         <input
//           type="text"
//           placeholder="🔍 Search name, email, mobile, course, branch..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border border-gray-300 rounded-md px-4 py-2 w-full lg:w-[30%]"
//         />

//         {/* Date Filters */}
//         <div className="flex items-center gap-2">
//           <div>
//             <label className="text-sm mr-2">From:</label>
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="border px-2 py-1 rounded"
//             />
//           </div>

//           <div>
//             <label className="text-sm mr-2">To:</label>
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               className="border px-2 py-1 rounded"
//             />
//           </div>
//         </div>

//         {/* Download Excel */}
//         <button
//           onClick={downloadExcel}
//           className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
//         >
//           📥 Download Excel
//         </button>

//         {/* Bulk Delete */}
//         <button
//           onClick={handleBulkDelete}
//           disabled={deleting || selected.length === 0}
//           className={`px-4 py-2 rounded-md text-white ${
//             selected.length === 0
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-red-600 hover:bg-red-700"
//           }`}
//         >
//           {deleting ? "Deleting..." : `Delete (${selected.length})`}
//         </button>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <p className="text-center text-gray-600">Loading...</p>
//       ) : filteredQueries.length === 0 ? (
//         <p className="text-center text-gray-500">No queries found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
//             <thead className="bg-blue-600 text-white">
//               <tr>
//                 <th className="px-4 py-3 text-center">
//                   <input
//                     type="checkbox"
//                     onChange={toggleSelectAll}
//                     checked={
//                       selected.length === filteredQueries.length &&
//                       filteredQueries.length > 0
//                     }
//                   />
//                 </th>
//                 <th className="px-4 py-3">#</th>
//                 <th className="px-4 py-3">Name</th>
//                 <th className="px-4 py-3">City</th>
//                 <th className="px-4 py-3">Course</th>
//                 <th className="px-4 py-3">Branch</th>
//                 <th className="px-4 py-3">Email</th>
//                 <th className="px-4 py-3">Mobile</th>
//                 <th className="px-4 py-3">Message</th>
//                 <th className="px-4 py-3">Date</th>
//                 <th className="px-4 py-3 text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredQueries.map((q, index) => (
//                 <tr
//                   key={q._id}
//                   className={`border-b hover:bg-gray-50 ${
//                     selected.includes(q._id) ? "bg-blue-50" : ""
//                   }`}
//                 >
//                   <td className="px-4 py-3 text-center">
//                     <input
//                       type="checkbox"
//                       onChange={() => toggleSelect(q._id)}
//                       checked={selected.includes(q._id)}
//                     />
//                   </td>

//                   <td className="px-4 py-3">{index + 1}</td>
//                   <td className="px-4 py-3">{q.name}</td>
//                   <td className="px-4 py-3">{q.city}</td>
//                   <td className="px-4 py-3">{q.course || "-"}</td>
//                   <td className="px-4 py-3">{q.branch || "-"}</td>
//                   <td className="px-4 py-3">{q.email}</td>
//                   <td className="px-4 py-3">{q.mobile}</td>
//                   <td className="px-4 py-3">{q.message}</td>

//                   <td className="px-4 py-3 text-sm text-gray-500">
//                     {new Date(q.createdAt).toLocaleDateString()}
//                   </td>

//                   <td className="px-4 py-3 text-center">
//                     <button
//                       onClick={() => handleSingleDelete(q._id)}
//                       className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </main>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Search,
  RefreshCw,
  Trash2,
  Download,
  Users,
  CalendarDays,
  X,
} from "lucide-react";

export default function GetInTouchTable() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ============================================================
  // FETCH ALL QUERIES
  // ============================================================

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await api.get("/api/v1/getintouch");
        setQueries(res.data.data || res.data);
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

  const filteredQueries = queries.filter((q) => {
    const term = search.toLowerCase();
    const created = new Date(q.createdAt);

    const matchesSearch =
      q.name.toLowerCase().includes(term) ||
      q.email.toLowerCase().includes(term) ||
      q.mobile.toLowerCase().includes(term) ||
      (q.course && q.course.toLowerCase().includes(term)) ||
      (q.branch && q.branch.toLowerCase().includes(term));

    const matchesDate =
      (!fromDate || created >= new Date(fromDate)) &&
      (!toDate || created <= new Date(toDate));

    return matchesSearch && matchesDate;
  });

  // ============================================================
  // SELECT
  // ============================================================

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filteredQueries.length) {
      setSelected([]);
    } else {
      setSelected(filteredQueries.map((q) => q._id));
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
        selected.map((id) =>
          api.delete(`/api/v1/getintouch/${id}`)
        )
      );

      setQueries((prev) =>
        prev.filter((q) => !selected.includes(q._id))
      );

      setSelected([]);

      alert("Selected queries deleted!");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // EXCEL DOWNLOAD
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

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Queries"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      blob,
      `GetInTouch_${Date.now()}.xlsx`
    );
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
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              bg-white
              border
              border-slate-200
              rounded-lg
              text-sm
              font-semibold
              text-slate-700
              hover:bg-slate-50
              transition
            "
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
                <p className="text-sm text-slate-500">
                  Total Queries
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {queries.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users
                  size={21}
                  className="text-blue-600"
                />
              </div>

            </div>

          </div>

          {/* Filtered */}

          <div className="bg-white border border-slate-200 rounded-xl p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Showing Results
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {filteredQueries.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-orange-50 flex items-center justify-center">
                <Search
                  size={21}
                  className="text-orange-600"
                />
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
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="text"
                  placeholder="Search name, email, mobile, course, branch..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    w-full
                    h-11
                    pl-10
                    pr-4
                    border
                    border-slate-200
                    rounded-lg
                    text-sm
                    text-slate-800
                    placeholder:text-slate-400
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-100
                    focus:border-blue-500
                  "
                />

              </div>

              {/* Date Filters */}

              <div className="flex flex-col sm:flex-row gap-3">

                <div className="flex items-center gap-2">

                  <CalendarDays
                    size={16}
                    className="text-slate-400"
                  />

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) =>
                      setFromDate(e.target.value)
                    }
                    className="
                      h-11
                      px-3
                      border
                      border-slate-200
                      rounded-lg
                      text-sm
                      text-slate-700
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />

                </div>

                <div className="flex items-center gap-2">

                  <CalendarDays
                    size={16}
                    className="text-slate-400"
                  />

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) =>
                      setToDate(e.target.value)
                    }
                    className="
                      h-11
                      px-3
                      border
                      border-slate-200
                      rounded-lg
                      text-sm
                      text-slate-700
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />

                </div>

              </div>

              {/* Bulk Delete */}

              <button
                onClick={handleBulkDelete}
                disabled={
                  deleting ||
                  selected.length === 0
                }
                className="
                  h-11
                  px-4
                  rounded-lg
                  text-sm
                  font-semibold
                  text-white
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  transition
                  disabled:bg-slate-300
                  disabled:cursor-not-allowed
                  bg-red-600
                  hover:bg-red-700
                "
              >

                <Trash2 size={16} />

                {deleting
                  ? "Deleting..."
                  : `Delete (${selected.length})`}

              </button>

            </div>

            <div className="mt-3 text-xs text-slate-500">
              Showing {filteredQueries.length} of{" "}
              {queries.length} queries
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

                <Users
                  size={25}
                  className="text-slate-400"
                />

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

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1250px]">

                <thead>

                  <tr className="bg-slate-50 border-b border-slate-200">

                    <th className="px-5 py-3 text-center">
                      <input
                        type="checkbox"
                        onChange={toggleSelectAll}
                        checked={
                          selected.length ===
                            filteredQueries.length &&
                          filteredQueries.length > 0
                        }
                        className="w-4 h-4 accent-blue-600"
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

                  {filteredQueries.map((q, index) => (

                    <tr
                      key={q._id}
                      className={`
                        transition
                        hover:bg-slate-50/70
                        ${
                          selected.includes(q._id)
                            ? "bg-blue-50"
                            : ""
                        }
                      `}
                    >

                      {/* Checkbox */}

                      <td className="px-5 py-4 text-center">

                        <input
                          type="checkbox"
                          onChange={() =>
                            toggleSelect(q._id)
                          }
                          checked={selected.includes(
                            q._id
                          )}
                          className="w-4 h-4 accent-blue-600"
                        />

                      </td>

                      {/* Number */}

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {index + 1}
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

                          {new Date(
                            q.createdAt
                          ).toLocaleDateString()}

                        </div>

                      </td>

                      {/* Action */}

                      <td className="px-5 py-4 text-center">

                        <button
                          onClick={() =>
                            handleSingleDelete(q._id)
                          }
                          disabled={deleting}
                          title="Delete Query"
                          className="
                            inline-flex
                            items-center
                            justify-center
                            w-9
                            h-9
                            rounded-lg
                            text-red-500
                            hover:bg-red-50
                            hover:text-red-600
                            transition
                            disabled:opacity-50
                          "
                        >

                          <Trash2 size={17} />

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}


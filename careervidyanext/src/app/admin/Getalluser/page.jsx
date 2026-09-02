// "use client";

// import { useEffect, useState } from "react";
// import api from "@/utlis/api.js";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// import Getuseroffer from "@/app/admin/components/GetuserOffer.jsx";
// import NotificationManager from "@/app/admin/components/NotificationManager.jsx";
// import Getuseruniversity from "@/app/admin/components/Getuseruniversity.jsx";

// export default function StudentsPage() {
//   const [students, setStudents] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [search, setSearch] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const [showOfferComponent, setShowOfferComponent] = useState(false);
//   const [showStudentsTable, setShowStudentsTable] = useState(false);
//   const [showNotificationManager, setShowNotificationManager] = useState(false);
//   const [showUniversityComponent, setShowUniversityComponent] = useState(false);

//   /* ================= FETCH STUDENTS ================= */
//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/api/v1/students");
//       const data = res.data.students || [];
//       setStudents(data);
//       setFilteredStudents(data);
//     } catch (err) {
//       console.error("Error fetching students:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   /* ================= FILTER LOGIC ================= */
//   useEffect(() => {
//     let data = [...students];

//     // 🔍 Search filter (name / email / mobile)
//     if (search.trim()) {
//       const q = search.toLowerCase();
//       data = data.filter(
//         (s) =>
//           s.name?.toLowerCase().includes(q) ||
//           s.email?.toLowerCase().includes(q) ||
//           s.mobileNumber?.includes(q)
//       );
//     }

//     // 📅 Date range filter (createdAt)
//     if (fromDate) {
//       data = data.filter(
//         (s) => new Date(s.createdAt) >= new Date(fromDate)
//       );
//     }

//     if (toDate) {
//       data = data.filter(
//         (s) => new Date(s.createdAt) <= new Date(toDate)
//       );
//     }

//     setFilteredStudents(data);
//   }, [search, fromDate, toDate, students]);

//   /* ================= DELETE ================= */
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this student?")) return;

//     try {
//       await api.delete(`/api/v1/students/${id}`);
//       alert("Student deleted successfully!");
//       fetchStudents();
//     } catch (err) {
//       console.error("Error deleting student:", err);
//       alert("Failed to delete student.");
//     }
//   };

//   /* ================= EXCEL DOWNLOAD ================= */
//   const downloadExcel = () => {
//     if (filteredStudents.length === 0) {
//       alert("No students available");
//       return;
//     }

//     const excelData = filteredStudents.map((s) => ({
//       Name: s.name || "—",
//       Email: s.email || "—",
//       Phone: s.mobileNumber || "—",
//       Address: s.addresses || "—",
//       Course: s.course || "—",
//       City: s.city || "—",
//       State: s.state || "—",
//       Gender: s.gender || "—",
//       Date: s.createdAt
//         ? new Date(s.createdAt).toLocaleDateString()
//         : "—",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

//     const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     saveAs(
//       new Blob([buffer], {
//         type:
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       }),
//       "students.xlsx"
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* HEADER */}
//       <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
//         <h1 className="text-2xl font-semibold text-gray-800">
//           🎓 Student Management
//         </h1>

//         <div className="flex flex-wrap gap-3">
//           <button
//             onClick={() => setShowOfferComponent(true)}
//             className="bg-blue-600 text-white px-5 py-2 rounded-lg"
//           >
//             🎁 Offer Applied Students
//           </button>

//           <button
//             onClick={() => setShowStudentsTable((p) => !p)}
//             className="bg-purple-600 text-white px-5 py-2 rounded-lg"
//           >
//             👀 {showStudentsTable ? "Hide Users" : "View All Users"}
//           </button>

//           <button
//             onClick={downloadExcel}
//             className="bg-green-600 text-white px-5 py-2 rounded-lg"
//           >
//             ⬇ Download Excel
//           </button>

//           <button
//             onClick={() => setShowNotificationManager((p) => !p)}
//             className="bg-orange-600 text-white px-5 py-2 rounded-lg"
//           >
//             🔔 Notification Manager
//           </button>

//           <button
//             onClick={() => setShowUniversityComponent((p) => !p)}
//             className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
//           >
//             🏫 University Component
//           </button>
//         </div>
//       </div>

//       {/* 🔍 FILTER BAR */}
//       {showStudentsTable && (
//         <div className="bg-white p-4 rounded-xl shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
//           <input
//             type="text"
//             placeholder="Search name / email / mobile"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border rounded-lg px-3 py-2"
//           />

//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             className="border rounded-lg px-3 py-2"
//           />

//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             className="border rounded-lg px-3 py-2"
//           />

//           <button
//             onClick={() => {
//               setSearch("");
//               setFromDate("");
//               setToDate("");
//             }}
//             className="bg-gray-200 rounded-lg px-4 py-2"
//           >
//             ❌ Clear
//           </button>
//         </div>
//       )}

//       {/* STUDENTS TABLE */}
//       {showStudentsTable && (
//         <div className="bg-white shadow rounded-xl overflow-x-auto">
//           <table className="min-w-full border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Email</th>
//                 <th className="p-3">Phone</th>
//                 <th className="p-3">Course</th>
//                 <th className="p-3">Date</th>
//                 <th className="p-3 text-center">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="6" className="p-4 text-center">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : filteredStudents.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="p-4 text-center">
//                     No students found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredStudents.map((s) => (
//                   <tr key={s._id} className="border-t">
//                     <td className="p-3">{s.name}</td>
//                     <td className="p-3">{s.email}</td>
//                     <td className="p-3">{s.mobileNumber}</td>
//                     <td className="p-3">{s.course}</td>
//                     <td className="p-3">
//                       {new Date(s.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="p-3 text-center">
//                       <button
//                         onClick={() => handleDelete(s._id)}
//                         className="bg-red-600 text-white px-3 py-1 rounded"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* ================= MODALS ================= */}
//       {showOfferComponent && (
//         <Getuseroffer onClose={() => setShowOfferComponent(false)} />
//       )}

//       {showNotificationManager && (
//         <NotificationManager onClose={() => setShowNotificationManager(false)} />
//       )}

//       {showUniversityComponent && (
//         <Getuseruniversity onClose={() => setShowUniversityComponent(false)} />
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Getuseroffer from "@/app/admin/components/GetuserOffer.jsx";
import NotificationManager from "@/app/admin/components/NotificationManager.jsx";
import Getuseruniversity from "@/app/admin/components/Getuseruniversity.jsx";

import {
  Search,
  CalendarDays,
  X,
  Download,
  Gift,
  Users,
  Bell,
  Building2,
  Trash2,
  Eye,
  EyeOff,
  GraduationCap,
  RefreshCw,
  UserRound,
  Mail,
  Phone,
  BookOpen,
} from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showOfferComponent, setShowOfferComponent] = useState(false);
  const [showStudentsTable, setShowStudentsTable] = useState(false);
  const [showNotificationManager, setShowNotificationManager] =
    useState(false);
  const [showUniversityComponent, setShowUniversityComponent] =
    useState(false);

  /* ================= FETCH STUDENTS ================= */

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/v1/students");

      const data = res.data.students || [];

      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ================= FILTER LOGIC ================= */

  useEffect(() => {
    let data = [...students];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();

      data = data.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.mobileNumber?.includes(q)
      );
    }

    // Date range filter
    if (fromDate) {
      data = data.filter(
        (s) => new Date(s.createdAt) >= new Date(fromDate)
      );
    }

    if (toDate) {
      data = data.filter(
        (s) => new Date(s.createdAt) <= new Date(toDate)
      );
    }

    setFilteredStudents(data);
  }, [search, fromDate, toDate, students]);

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?"))
      return;

    try {
      await api.delete(`/api/v1/students/${id}`);

      alert("Student deleted successfully!");

      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student.");
    }
  };

  /* ================= EXCEL DOWNLOAD ================= */

  const downloadExcel = () => {
    if (filteredStudents.length === 0) {
      alert("No students available");
      return;
    }

    const excelData = filteredStudents.map((s) => ({
      Name: s.name || "—",
      Email: s.email || "—",
      Phone: s.mobileNumber || "—",
      Address: s.addresses || "—",
      Course: s.course || "—",
      City: s.city || "—",
      State: s.state || "—",
      Gender: s.gender || "—",
      Date: s.createdAt
        ? new Date(s.createdAt).toLocaleDateString()
        : "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Students"
    );

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "students.xlsx"
    );
  };

  /* ================= CLEAR FILTER ================= */

  const clearFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-7">

          <div>
            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                <GraduationCap
                  size={23}
                  className="text-white"
                />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Student Management
                </h1>

                <p className="text-sm text-slate-500 mt-0.5">
                  Manage registered students and student activities.
                </p>
              </div>

            </div>
          </div>

          {/* Header Buttons */}

          <div className="flex flex-wrap gap-2.5">

            <button
              onClick={() => setShowOfferComponent(true)}
              className="
                inline-flex
                items-center
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
                hover:bg-blue-50
                hover:text-blue-600
                hover:border-blue-200
                transition
              "
            >
              <Gift size={17} />
              Offer Students
            </button>

            <button
              onClick={() =>
                setShowStudentsTable((p) => !p)
              }
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2.5
                bg-blue-600
                hover:bg-blue-700
                text-white
                rounded-lg
                text-sm
                font-semibold
                transition
              "
            >
              {showStudentsTable ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}

              {showStudentsTable
                ? "Hide Users"
                : "View All Users"}
            </button>

            <button
              onClick={downloadExcel}
              className="
                inline-flex
                items-center
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
                hover:bg-green-50
                hover:text-green-600
                hover:border-green-200
                transition
              "
            >
              <Download size={17} />
              Export Excel
            </button>

            <button
              onClick={() =>
                setShowNotificationManager((p) => !p)
              }
              className="
                inline-flex
                items-center
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
                hover:bg-orange-50
                hover:text-orange-600
                hover:border-orange-200
                transition
              "
            >
              <Bell size={17} />
              Notifications
            </button>

            <button
              onClick={() =>
                setShowUniversityComponent((p) => !p)
              }
              className="
                inline-flex
                items-center
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
                hover:bg-indigo-50
                hover:text-indigo-600
                hover:border-indigo-200
                transition
              "
            >
              <Building2 size={17} />
              University
            </button>

          </div>
        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

          {/* Total Students */}

          <div className="bg-white border border-slate-200 rounded-xl p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Students
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {students.length}
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

          {/* Showing */}

          <div className="bg-white border border-slate-200 rounded-xl p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Showing Results
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {filteredStudents.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center">
                <Search
                  size={21}
                  className="text-purple-600"
                />
              </div>

            </div>

          </div>

          {/* Courses */}

          <div className="bg-white border border-slate-200 rounded-xl p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Student Records
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {students.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center">
                <BookOpen
                  size={21}
                  className="text-green-600"
                />
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            FILTER BAR
        ===================================================== */}

        {showStudentsTable && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-5">

            <div className="flex flex-col lg:flex-row gap-3">

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
                  placeholder="Search name, email or mobile..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
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
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

              </div>

              {/* From */}

              <div className="relative">

                <CalendarDays
                  size={17}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) =>
                    setFromDate(e.target.value)
                  }
                  className="
                    h-11
                    pl-10
                    pr-3
                    border
                    border-slate-200
                    rounded-lg
                    text-sm
                    text-slate-700
                    focus:outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

              </div>

              {/* To */}

              <div className="relative">

                <CalendarDays
                  size={17}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) =>
                    setToDate(e.target.value)
                  }
                  className="
                    h-11
                    pl-10
                    pr-3
                    border
                    border-slate-200
                    rounded-lg
                    text-sm
                    text-slate-700
                    focus:outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

              </div>

              {/* Clear */}

              <button
                onClick={clearFilters}
                className="
                  h-11
                  px-4
                  rounded-lg
                  bg-slate-100
                  hover:bg-slate-200
                  text-slate-600
                  text-sm
                  font-semibold
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  transition
                "
              >
                <X size={16} />
                Clear
              </button>

            </div>

          </div>
        )}

        {/* =====================================================
            STUDENTS TABLE
        ===================================================== */}

        {showStudentsTable && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

            {/* Table Header */}

            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <UserRound
                    size={18}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-800">
                    All Students
                  </h2>

                  <p className="text-xs text-slate-500">
                    {filteredStudents.length} records found
                  </p>
                </div>

              </div>

              <button
                onClick={fetchStudents}
                className="
                  w-9
                  h-9
                  rounded-lg
                  border
                  border-slate-200
                  flex
                  items-center
                  justify-center
                  text-slate-500
                  hover:bg-slate-50
                  hover:text-blue-600
                  transition
                "
                title="Refresh"
              >
                <RefreshCw
                  size={16}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>

                  <tr className="bg-slate-50 border-b border-slate-200">

                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      #
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Student
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Contact
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Course
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

                  {loading ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="py-14"
                      >

                        <div className="flex flex-col items-center justify-center">

                          <RefreshCw
                            size={27}
                            className="text-blue-500 animate-spin"
                          />

                          <p className="text-sm text-slate-500 mt-3">
                            Loading students...
                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : filteredStudents.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="py-14"
                      >

                        <div className="flex flex-col items-center justify-center">

                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">

                            <Users
                              size={22}
                              className="text-slate-400"
                            />

                          </div>

                          <p className="text-sm font-semibold text-slate-700 mt-3">
                            No students found
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            Try changing your search or date filters.
                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    filteredStudents.map((s, index) => (

                      <tr
                        key={s._id}
                        className="hover:bg-slate-50/70 transition"
                      >

                        {/* # */}

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {index + 1}
                        </td>

                        {/* Student */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">

                              <UserRound
                                size={17}
                                className="text-blue-600"
                              />

                            </div>

                            <div>

                              <p className="text-sm font-semibold text-slate-800">
                                {s.name || "—"}
                              </p>

                              <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">

                                <Mail size={12} />

                                {s.email || "—"}

                              </div>

                            </div>

                          </div>

                        </td>

                        {/* Contact */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1.5 text-sm text-slate-600">

                            <Phone
                              size={14}
                              className="text-slate-400"
                            />

                            {s.mobileNumber || "—"}

                          </div>

                        </td>

                        {/* Course */}

                        <td className="px-5 py-4">

                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">

                            <BookOpen size={13} />

                            {s.course || "—"}

                          </div>

                        </td>

                        {/* Date */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1.5 text-xs text-slate-500">

                            <CalendarDays size={14} />

                            {s.createdAt
                              ? new Date(
                                  s.createdAt
                                ).toLocaleDateString()
                              : "—"}

                          </div>

                        </td>

                        {/* Delete */}

                        <td className="px-5 py-4 text-center">

                          <button
                            onClick={() =>
                              handleDelete(s._id)
                            }
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
                            "
                            title="Delete Student"
                          >

                            <Trash2 size={17} />

                          </button>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* =====================================================
            MODALS / COMPONENTS
        ===================================================== */}

        {showOfferComponent && (
          <Getuseroffer
            onClose={() =>
              setShowOfferComponent(false)
            }
          />
        )}

        {showNotificationManager && (
          <NotificationManager
            onClose={() =>
              setShowNotificationManager(false)
            }
          />
        )}

        {showUniversityComponent && (
          <Getuseruniversity
            onClose={() =>
              setShowUniversityComponent(false)
            }
          />
        )}

      </div>
    </div>
  );
}


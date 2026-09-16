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
  MapPin,
  ShieldCheck,
  Ticket,
  Clock,
} from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [activeView, setActiveView] = useState(null); // "offer" | "students" | "notifications" | "university" | null

  const [selectedStudent, setSelectedStudent] = useState(null);

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

    // Search filter — now covers all key fields
    if (search.trim()) {
      const q = search.toLowerCase();

      data = data.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.mobileNumber?.includes(q) ||
          s.course?.toLowerCase().includes(q) ||
          s.branch?.toLowerCase().includes(q) ||
          s.specialization?.toLowerCase().includes(q) ||
          s.city?.toLowerCase().includes(q) ||
          s.state?.toLowerCase().includes(q) ||
          s.subsidyCoupon?.toLowerCase().includes(q) ||
          s.role?.toLowerCase().includes(q)
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
      Gender: s.gender || "—",
      DOB: s.dob ? new Date(s.dob).toLocaleDateString() : "—",
      Course: s.course || "—",
      Branch: s.branch || "—",
      Specialization: s.specialization || "—",
      Address: s.addresses || "—",
      City: s.city || "—",
      State: s.state || "—",
      "Subsidy Coupon": s.subsidyCoupon || "—",
      Role: s.role || "—",
      Description: s.description || "—",
      "Last Activity": s.lastActivity
        ? new Date(s.lastActivity).toLocaleString()
        : "—",
      "Registered On": s.createdAt
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

  /* ================= VIEW TOGGLE ================= */

  const toggleView = (view) => {
    setActiveView((prev) => (prev === view ? null : view));
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
                <GraduationCap size={23} className="text-white" />
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
              onClick={() => toggleView("offer")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-semibold transition ${
                activeView === "offer"
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              }`}
            >
              <Gift size={17} />
              Offer Students
            </button>

            <button
              onClick={() => toggleView("students")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-semibold transition ${
                activeView === "students"
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              }`}
            >
              {activeView === "students" ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
              {activeView === "students" ? "Hide Users" : "View All Users"}
            </button>

            <button
              onClick={downloadExcel}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition"
            >
              <Download size={17} />
              Export Excel
            </button>

            <button
              onClick={() => toggleView("notifications")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-semibold transition ${
                activeView === "notifications"
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
              }`}
            >
              <Bell size={17} />
              Notifications
            </button>

            <button
              onClick={() => toggleView("university")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-semibold transition ${
                activeView === "university"
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
              }`}
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
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Students</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {students.length}
                </p>
              </div>
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users size={21} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Showing Results</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {filteredStudents.length}
                </p>
              </div>
              <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center">
                <Search size={21} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Student Records</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {students.length}
                </p>
              </div>
              <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center">
                <BookOpen size={21} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            FILTER BAR
        ===================================================== */}

        {activeView === "students" && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-5">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search name, email, phone, course, city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-10 pl-10 pr-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-10 pl-10 pr-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                onClick={clearFilters}
                className="h-10 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold inline-flex items-center justify-center gap-2 transition"
              >
                <X size={16} />
                Clear
              </button>
            </div>
          </div>
        )}

        {/* =====================================================
            STUDENTS TABLE (COMPACT / ALL FIELDS)
        ===================================================== */}

        {activeView === "students" && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Table Header */}

            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <UserRound size={16} className="text-blue-600" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    All Students
                  </h2>
                  <p className="text-xs text-slate-500">
                    {filteredStudents.length} records found
                  </p>
                </div>
              </div>

              <button
                onClick={fetchStudents}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition"
                title="Refresh"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>

            {/* Compact Table */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1400px] text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      #
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      Phone
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      Gender
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      DOB
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      Course
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      Branch
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      Specialization
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      Location
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      Address
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      Coupon
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      Role
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      Last Activity
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500 uppercase whitespace-nowrap">
                      Registered
                    </th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-500 uppercase whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="16" className="py-12">
                        <div className="flex flex-col items-center justify-center">
                          <RefreshCw
                            size={24}
                            className="text-blue-500 animate-spin"
                          />
                          <p className="text-xs text-slate-500 mt-2">
                            Loading students...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="16" className="py-12">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <Users size={18} className="text-slate-400" />
                          </div>
                          <p className="text-xs font-semibold text-slate-700 mt-2">
                            No students found
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
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
                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap">
                          {index + 1}
                        </td>

                        {/* Name */}
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                              <UserRound size={12} className="text-blue-600" />
                            </div>
                            <span className="font-semibold text-slate-800">
                              {s.name || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                          <div className="flex items-center gap-1">
                            <Mail size={11} className="text-slate-400" />
                            {s.email || "—"}
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                          <div className="flex items-center gap-1">
                            <Phone size={11} className="text-slate-400" />
                            {s.mobileNumber || "—"}
                          </div>
                        </td>

                        {/* Gender */}
                        <td className="px-3 py-2 whitespace-nowrap text-slate-600 capitalize">
                          {s.gender || "—"}
                        </td>

                        {/* DOB */}
                        <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                          {s.dob ? new Date(s.dob).toLocaleDateString() : "—"}
                        </td>

                        {/* Course */}
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                            <BookOpen size={11} />
                            {s.course || "—"}
                          </span>
                        </td>

                        {/* Branch */}
                        <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                          {s.branch || "—"}
                        </td>

                        {/* Specialization */}
                        <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                          {s.specialization || "—"}
                        </td>

                        {/* Location (city, state) */}
                        <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin size={11} className="text-slate-400" />
                            {[s.city, s.state].filter(Boolean).join(", ") ||
                              "—"}
                          </div>
                        </td>

                        {/* Address */}
                        <td
                          className="px-3 py-2 text-slate-600 max-w-[160px] truncate"
                          title={s.addresses || ""}
                        >
                          {s.addresses || "—"}
                        </td>

                        {/* Coupon */}
                        <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                          <div className="flex items-center gap-1">
                            <Ticket size={11} className="text-slate-400" />
                            {s.subsidyCoupon || "—"}
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium capitalize ${
                              s.role === "admin"
                                ? "bg-red-50 text-red-600"
                                : s.role === "subadmin"
                                ? "bg-orange-50 text-orange-600"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <ShieldCheck size={11} />
                            {s.role || "user"}
                          </span>
                        </td>

                        {/* Last Activity */}
                        <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                          <div className="flex items-center gap-1">
                            <Clock size={11} className="text-slate-400" />
                            {s.lastActivity
                              ? new Date(s.lastActivity).toLocaleString()
                              : "—"}
                          </div>
                        </td>

                        {/* Registered On */}
                        <td className="px-3 py-2 whitespace-nowrap text-slate-500">
                          <div className="flex items-center gap-1">
                            <CalendarDays size={11} />
                            {s.createdAt
                              ? new Date(s.createdAt).toLocaleDateString()
                              : "—"}
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-3 py-2 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => setSelectedStudent(s)}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition"
                              title="View Full Details"
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              onClick={() => handleDelete(s._id)}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition"
                              title="Delete Student"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
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
            STUDENT DETAIL MODAL
        ===================================================== */}

        {selectedStudent && (
          <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedStudent(null)}
          >
            <div
              className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 sticky top-0 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <UserRound size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {selectedStudent.name || "—"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Full student details
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                {[
                  ["Name", selectedStudent.name],
                  ["Email", selectedStudent.email],
                  ["Phone", selectedStudent.mobileNumber],
                  ["Gender", selectedStudent.gender],
                  [
                    "DOB",
                    selectedStudent.dob
                      ? new Date(selectedStudent.dob).toLocaleDateString()
                      : null,
                  ],
                  ["Course", selectedStudent.course],
                  ["Branch", selectedStudent.branch],
                  ["Specialization", selectedStudent.specialization],
                  ["City", selectedStudent.city],
                  ["State", selectedStudent.state],
                  ["Address", selectedStudent.addresses],
                  ["Subsidy Coupon", selectedStudent.subsidyCoupon],
                  ["Role", selectedStudent.role],
                  [
                    "Permissions",
                    selectedStudent.permissions?.length
                      ? selectedStudent.permissions.join(", ")
                      : null,
                  ],
                  [
                    "System Admin",
                    selectedStudent.isSystemAdmin ? "Yes" : "No",
                  ],
                  ["OAuth ID", selectedStudent.oauthId],
                  [
                    "Last Activity",
                    selectedStudent.lastActivity
                      ? new Date(selectedStudent.lastActivity).toLocaleString()
                      : null,
                  ],
                  [
                    "Registered On",
                    selectedStudent.createdAt
                      ? new Date(
                          selectedStudent.createdAt
                        ).toLocaleDateString()
                      : null,
                  ],
                  ["Description", selectedStudent.description],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-0.5">
                      {label}
                    </p>
                    <p className="text-slate-700 break-words">
                      {value || "—"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            MODALS / COMPONENTS
        ===================================================== */}

        {activeView === "offer" && (
          <Getuseroffer onClose={() => setActiveView(null)} />
        )}

        {activeView === "notifications" && (
          <NotificationManager onClose={() => setActiveView(null)} />
        )}

        {activeView === "university" && (
          <Getuseruniversity onClose={() => setActiveView(null)} />
        )}
      </div>
    </div>
  );
}
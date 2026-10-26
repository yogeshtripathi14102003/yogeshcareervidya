// "use client";

// import React, { useState, useEffect, useTransition } from "react";
// import api from "@/utlis/api.js";
// import { Trash2, ShieldCheck, User, CheckCircle, AlertCircle } from "lucide-react";

// // ✅ Layout.js ke menu ke saath synced.
// // Layout me match ye hota hai: (item.id || item.label).toLowerCase().trim() === permission.toLowerCase().trim()
// // Isliye yaha ka `id` Layout ke item ka `id` (agar hai) warna uska `label` hona chahiye.
// const PERMISSION_GROUPS = [
//   {
//     title: "General",
//     items: [
//       { id: "Dashboard", label: "Dashboard" },
//       { id: "Visitors", label: "Visitors" },
//       { id: "Job Posts", label: "Job Posts" },
//       { id: "Applications", label: "Applications (Resume)" },
//       { id: "Videos", label: "Videos" },
//       { id: "slotmanagement", label: "Slot Management" },
//     ],
//   },
//   {
//     title: "Query & Admission",
//     items: [
//       { id: "All Students", label: "All Students" },
//       { id: "Get Queries", label: "Get Queries" },
//       { id: "Apply Admission", label: "Apply Admission" },
//       { id: "Add Subsidy", label: "Add Subsidy" },
//       { id: "Callback", label: "Callback" },
//     ],
//   },
//   {
//     title: "Course & University",
//     items: [
//       { id: "Add Online Courses", label: "Add Online Courses" },
//       { id: "Edit Online Course", label: "Edit Online Course" },
//       { id: "Add Universities", label: "Add Universities" },
//       { id: "Edit Universities Data", label: "Edit Universities Data" },
//       { id: "Add Blog", label: "Add Blog" },
//       { id: "Get Blog List", label: "Get Blog List" },
//       { id: "Placed Students", label: "Placed Students" },
//       { id: "Add Team", label: "Add Team" },
//       { id: "Our Team", label: "Our Team" },
//       { id: "Banners", label: "Banners" },
//       { id: "State", label: "State" },
//       { id: "Newsletter", label: "Newsletter" },
//     ],
//   },
//   {
//     title: "CRM",
//     items: [
//       { id: "Addcounselor", label: "Add Counselor" },
//       { id: "Counselor Report", label: "Counselor Report" },
//       { id: "Detail Report", label: "Detail Report" },
//       { id: "leadanalytics", label: "Lead Analytics" },
//       { id: "counselorleaderboard", label: "Counselor Leaderboard" },
//       { id: "assignmentconfig", label: "Smart Assignment" },
//       { id: "followupautomation", label: "Follow-up Automation" },
//       { id: "leadscoring", label: "AI Lead Scoring" },
//       { id: "reports", label: "Reports" },
//       { id: "qapanel", label: "Student Q&A" },
//     ],
//   },
//   {
//     title: "Document Management",
//     items: [
//       { id: "AdminDocumentcheck", label: "Admin Document Check" },
//       { id: "DocumentDelete", label: "Document Delete" },
//       { id: "DocReport", label: "Doc Report" },
//     ],
//   },
//   {
//     title: "Employee Management",
//     items: [
//       { id: "employeeupload", label: "Employee Upload" },
//       { id: "dashbord", label: "Employee Dashboard" },
//       { id: "employeealerts", label: "Employee Alerts" },
//       { id: "employeelist", label: "Employee List" },
//     ],
//   },
//   {
//     title: "Security",
//     items: [
//       { id: "securitysettings", label: "Security Settings" },
//       { id: "Security", label: "Security" },
//     ],
//   },
// ];

// export default function GiveAccessPage() {
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [subAdmins, setSubAdmins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isPending, startTransition] = useTransition();

//   // 1. Data Fetching (Get all Sub-admins)
//   const fetchSubAdmins = async () => {
//     try {
//       const { data } = await api.get("/api/v1/sub-admins");
//       setSubAdmins(data);
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSubAdmins();
//   }, []);

//   // 2. Assign Access Handler
//   async function handleAccessSubmit(formData) {
//     setMessage({ type: "", text: "" });

//     startTransition(async () => {
//       const payload = {
//         email: formData.get("email"),
//         permissions: formData.getAll("permissions"), // Multi-select array
//       };

//       if (!payload.email || payload.permissions.length === 0) {
//         return setMessage({ type: "error", text: "Email and at least one permission required" });
//       }

//       try {
//         const { data } = await api.post("/api/v1/assign-access", payload);
//         setMessage({ type: "success", text: data.msg });
//         fetchSubAdmins(); // Refresh List
//       } catch (error) {
//         setMessage({ type: "error", text: error.response?.data?.msg || "Update failed" });
//       }
//     });
//   }

//   // 3. Revoke Access Handler
//   const handleRevoke = async (email) => {
//     if (!window.confirm(`Kya aap ${email} ka access puri tarah khatam karna chahte hain?`)) return;

//     try {
//       await api.post("/api/v1/revoke-access", { email });
//       setMessage({ type: "success", text: "Access revoked!" });
//       fetchSubAdmins();
//     } catch (error) {
//       alert("Error revoking access");
//     }
//   };

//   // Ek group ke saare checkboxes select / clear karne ke liye
//   const toggleGroup = (e, groupTitle, checked) => {
//     e.currentTarget
//       .closest("form")
//       .querySelectorAll(`input[data-group="${groupTitle}"]`)
//       .forEach((el) => {
//         el.checked = checked;
//       });
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-10">
//       {/* SECTION: ASSIGN FORM */}
//       <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
//         <div className="bg-indigo-600 p-6 text-white text-center">
//           <h1 className="text-2xl font-bold">Sub-Admin Access Control</h1>
//           <p className="opacity-80 text-sm">Select modules to grant permission</p>
//         </div>

//         <form action={handleAccessSubmit} className="p-8 space-y-8">
//           <div className="flex flex-col md:flex-row gap-6 items-end bg-gray-50 p-6 rounded-2xl border border-gray-200">
//             <div className="flex-1 space-y-2 w-full">
//               <label className="text-sm font-bold text-gray-600 ml-1">SUB-ADMIN EMAIL</label>
//               <input
//                 name="email"
//                 type="email"
//                 required
//                 placeholder="Enter email address"
//                 className="w-full p-4 rounded-xl border-2 focus:border-indigo-500 outline-none transition-all"
//               />
//             </div>
//             <button
//               disabled={isPending}
//               className="md:w-64 w-full bg-indigo-600 text-white h-[60px] rounded-xl font-bold hover:bg-indigo-700 shadow-lg disabled:bg-gray-400"
//             >
//               {isPending ? "Syncing..." : "Confirm Permissions"}
//             </button>
//           </div>

//           <div className="space-y-6">
//             <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
//               <CheckCircle className="text-indigo-500" size={20} /> Select Module Access
//             </h3>

//             {PERMISSION_GROUPS.map((group) => (
//               <div key={group.title}>
//                 <div className="flex items-center justify-between mb-2">
//                   <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{group.title}</h4>
//                   <div className="flex gap-3 text-xs font-semibold">
//                     <button
//                       type="button"
//                       onClick={(e) => toggleGroup(e, group.title, true)}
//                       className="text-indigo-600 hover:underline"
//                     >
//                       Select all
//                     </button>
//                     <button
//                       type="button"
//                       onClick={(e) => toggleGroup(e, group.title, false)}
//                       className="text-gray-400 hover:underline"
//                     >
//                       Clear
//                     </button>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
//                   {group.items.map((item) => (
//                     <label
//                       key={item.id}
//                       className="flex items-center p-3 border rounded-xl hover:bg-indigo-50 cursor-pointer transition-all group"
//                     >
//                       <input
//                         type="checkbox"
//                         name="permissions"
//                         value={item.id}
//                         data-group={group.title}
//                         className="w-4 h-4 text-indigo-600 rounded border-gray-300"
//                       />
//                       <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-indigo-900">
//                         {item.label}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {message.text && (
//             <div
//               className={`p-4 rounded-xl flex items-center gap-2 font-semibold justify-center ${
//                 message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//               }`}
//             >
//               {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
//               {message.text}
//             </div>
//           )}
//         </form>
//       </div>

//       {/* SECTION: LIST OF ADMINS */}
//       <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
//         <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//           <ShieldCheck className="text-green-600" /> Active Sub-Admins List
//         </h2>

//         {loading ? (
//           <div className="text-center py-20 text-gray-400">Fetching sub-admins...</div>
//         ) : (
//           <div className="overflow-x-auto rounded-xl">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-50 border-b border-gray-100">
//                 <tr>
//                   <th className="p-4 text-xs font-bold text-gray-500 uppercase">User Info</th>
//                   <th className="p-4 text-xs font-bold text-gray-500 uppercase">Permissions Granted</th>
//                   <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Revoke</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {subAdmins.length === 0 ? (
//                   <tr>
//                     <td colSpan="3" className="p-10 text-center text-gray-400 italic">
//                       No sub-admins found.
//                     </td>
//                   </tr>
//                 ) : (
//                   subAdmins.map((user) => (
//                     <tr key={user._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
//                       <td className="p-4">
//                         <div className="flex items-center gap-3">
//                           <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
//                             <User size={20} />
//                           </div>
//                           <div>
//                             <p className="font-bold text-gray-800">{user.email}</p>
//                             <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">
//                               {user.role}
//                             </p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex flex-wrap gap-1 max-w-md">
//                           {user.permissions?.map((p) => (
//                             <span
//                               key={p}
//                               className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-100"
//                             >
//                               {p}
//                             </span>
//                           ))}
//                         </div>
//                       </td>
//                       <td className="p-4 text-right">
//                         <button
//                           onClick={() => handleRevoke(user.email)}
//                           className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                         >
//                           <Trash2 size={20} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useState, useEffect, useTransition } from "react";
import api from "@/utlis/api.js";
import {
  Trash2,
  ShieldCheck,
  User,
  CheckCircle,
  AlertCircle,
  Users,
  LockKeyhole,
  Shield,
  Plus,
  Search,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

// Keep permission IDs synced with Layout.js
const PERMISSION_GROUPS = [
  {
    title: "General",
    items: [
      { id: "Dashboard", label: "Dashboard" },
      { id: "Visitors", label: "Visitors" },
      { id: "Job Posts", label: "Job Posts" },
      { id: "Applications", label: "Applications (Resume)" },
      { id: "Videos", label: "Videos" },
      { id: "slotmanagement", label: "Slot Management" },
    ],
  },
  {
    title: "Query & Admission",
    items: [
      { id: "All Students", label: "All Students" },
      { id: "Get Queries", label: "Get Queries" },
      { id: "Apply Admission", label: "Apply Admission" },
      { id: "Add Subsidy", label: "Add Subsidy" },
      { id: "Callback", label: "Callback" },
    ],
  },
  {
    title: "Course & University",
    items: [
      { id: "Add Online Courses", label: "Add Online Courses" },
      { id: "Edit Online Course", label: "Edit Online Course" },
      { id: "Add Universities", label: "Add Universities" },
      { id: "Edit Universities Data", label: "Edit Universities Data" },
      { id: "Add Blog", label: "Add Blog" },
      { id: "Get Blog List", label: "Get Blog List" },
      { id: "Placed Students", label: "Placed Students" },
      { id: "Add Team", label: "Add Team" },
      { id: "Our Team", label: "Our Team" },
      { id: "Banners", label: "Banners" },
      { id: "State", label: "State" },
      { id: "Newsletter", label: "Newsletter" },
    ],
  },
  {
    title: "CRM",
    items: [
      { id: "Addcounselor", label: "Add Counselor" },
      { id: "Counselor Report", label: "Counselor Report" },
      { id: "Detail Report", label: "Detail Report" },
      { id: "leadanalytics", label: "Lead Analytics" },
      { id: "counselorleaderboard", label: "Counselor Leaderboard" },
      { id: "assignmentconfig", label: "Smart Assignment" },
      { id: "followupautomation", label: "Follow-up Automation" },
      { id: "leadscoring", label: "AI Lead Scoring" },
      { id: "reports", label: "Reports" },
      { id: "qapanel", label: "Student Q&A" },
    ],
  },
  {
    title: "Document Management",
    items: [
      { id: "AdminDocumentcheck", label: "Admin Document Check" },
      { id: "DocumentDelete", label: "Document Delete" },
      { id: "DocReport", label: "Doc Report" },
    ],
  },
  {
    title: "Employee Management",
    items: [
      { id: "employeeupload", label: "Employee Upload" },
      { id: "dashbord", label: "Employee Dashboard" },
      { id: "employeealerts", label: "Employee Alerts" },
      { id: "employeelist", label: "Employee List" },
    ],
  },
  {
    title: "Security",
    items: [
      { id: "securitysettings", label: "Security Settings" },
      { id: "Security", label: "Security" },
    ],
  },
];

const GROUP_ICONS = {
  General: ShieldCheck,
  "Query & Admission": Users,
  "Course & University": Shield,
  CRM: Users,
  "Document Management": LockKeyhole,
  "Employee Management": Users,
  Security: LockKeyhole,
};

export default function GiveAccessPage() {
  const [message, setMessage] = useState({ type: "", text: "" });
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");

  const totalPermissions = PERMISSION_GROUPS.reduce(
    (total, group) => total + group.items.length,
    0
  );

  const filteredSubAdmins = subAdmins.filter((user) =>
    (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch existing sub-admins
  const fetchSubAdmins = async () => {
    try {
      const { data } = await api.get("/api/v1/sub-admins");
      setSubAdmins(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  // Assign permissions — existing API and payload preserved
  async function handleAccessSubmit(formData) {
    setMessage({ type: "", text: "" });

    startTransition(async () => {
      const payload = {
        email: formData.get("email"),
        permissions: formData.getAll("permissions"),
      };

      if (!payload.email || payload.permissions.length === 0) {
        setMessage({
          type: "error",
          text: "Email and at least one permission required",
        });
        return;
      }

      try {
        const { data } = await api.post("/api/v1/assign-access", payload);

        setMessage({
          type: "success",
          text: data.msg,
        });

        await fetchSubAdmins();
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.msg || "Update failed",
        });
      }
    });
  }

  // Revoke access — existing behavior preserved
  const handleRevoke = async (email) => {
    if (
      !window.confirm(
        `Kya aap ${email} ka access puri tarah khatam karna chahte hain?`
      )
    ) {
      return;
    }

    try {
      await api.post("/api/v1/revoke-access", { email });

      setMessage({
        type: "success",
        text: "Access revoked!",
      });

      await fetchSubAdmins();
    } catch (error) {
      alert("Error revoking access");
    }
  };

  // Select or clear permissions within a group
  const toggleGroup = (e, groupTitle, checked) => {
    e.currentTarget
      .closest("form")
      .querySelectorAll(`input[data-group="${groupTitle}"]`)
      .forEach((el) => {
        el.checked = checked;
      });
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f2f8] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <ShieldCheck size={23} />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Sub-Admin Access Control
              </h1>
            </div>

            <p className="ml-1 text-sm text-slate-500">
              Manage users and control access to admin modules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800">
              <ShieldCheck size={17} />
              Permission Manager
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Active Sub-Admins
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {subAdmins.length}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Users size={24} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Available Modules
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalPermissions}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <LockKeyhole size={23} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Permission Groups
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {PERMISSION_GROUPS.length}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>

        {/* ASSIGN PERMISSIONS */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Assign Permissions
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Select an account and configure its module access.
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              {totalPermissions} available permissions
            </span>
          </div>

          <form action={handleAccessSubmit} className="p-4 sm:p-6">
            {/* EMAIL INPUT */}
            <div className="mb-7 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <label
                htmlFor="sub-admin-email"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Sub-Admin Email Address
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <User
                    size={19}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="sub-admin-email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter sub-admin email address"
                    className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[220px]"
                >
                  {isPending ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Plus size={19} />
                  )}

                  {isPending ? "Updating..." : "Confirm Permissions"}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Enter the email associated with the sub-admin account.
              </p>
            </div>

            {/* MODULE PERMISSIONS */}
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Module Permissions
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Choose which sections this sub-admin can access.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle size={15} className="text-blue-600" />
                Select permissions by group
              </div>
            </div>

            <div className="space-y-4">
              {PERMISSION_GROUPS.map((group, index) => {
                const GroupIcon = GROUP_ICONS[group.title] || Shield;

                return (
                  <div
                    key={group.title}
                    className="overflow-hidden rounded-xl border border-slate-200"
                  >
                    {/* GROUP HEADER */}
                    <div className="flex flex-col gap-3 border-b border-slate-200 bg-[#f0f2f8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-800">
                          <GroupIcon size={18} />
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {group.title}
                          </h4>

                          <p className="text-xs text-slate-500">
                            {group.items.length} modules
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pl-1 sm:pl-0">
                        <button
                          type="button"
                          onClick={(e) =>
                            toggleGroup(e, group.title, true)
                          }
                          className="text-xs font-bold text-blue-700 transition hover:text-blue-900 hover:underline"
                        >
                          Select all
                        </button>

                        <span className="h-4 w-px bg-slate-300" />

                        <button
                          type="button"
                          onClick={(e) =>
                            toggleGroup(e, group.title, false)
                          }
                          className="text-xs font-semibold text-slate-500 transition hover:text-red-600 hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* PERMISSION ITEMS */}
                    <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {group.items.map((item, itemIndex) => (
                        <label
                          key={item.id}
                          className={`group flex min-h-[54px] cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-blue-50/70 ${
                            itemIndex < group.items.length - 1
                              ? "border-b border-slate-100"
                              : ""
                          } ${
                            itemIndex % 2 === 0
                              ? "sm:border-r sm:border-slate-100"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="permissions"
                            value={item.id}
                            data-group={group.title}
                            className="h-[17px] w-[17px] shrink-0 cursor-pointer rounded border-slate-300 accent-blue-700 focus:ring-2 focus:ring-blue-200"
                          />

                          <span className="text-sm font-medium text-slate-700 transition group-hover:text-blue-800">
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* STATUS MESSAGE */}
            {message.text && (
              <div
                role="status"
                aria-live="polite"
                className={`mt-6 flex items-start gap-3 rounded-lg border p-4 text-sm font-medium ${
                  message.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle size={19} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={19} className="mt-0.5 shrink-0" />
                )}

                <span>{message.text}</span>
              </div>
            )}
          </form>
        </section>

        {/* ACTIVE SUB-ADMINS */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* TABLE HEADER */}
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
                <Users size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Active Sub-Admins
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View assigned permissions and manage access.
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                {subAdmins.length}
              </span>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by email..."
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
              <RefreshCw size={25} className="animate-spin text-blue-700" />
              <p className="text-sm font-medium">Fetching sub-admins...</p>
            </div>
          ) : filteredSubAdmins.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Users size={26} />
              </div>

              <h3 className="font-semibold text-slate-800">
                {searchTerm
                  ? "No matching sub-admins"
                  : "No sub-admins found"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {searchTerm
                  ? "Try searching with another email address."
                  : "Assigned sub-admin accounts will appear here."}
              </p>
            </div>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
                {filteredSubAdmins.map((user) => (
                  <div
                    key={user._id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-800">
                          <User size={20} />
                        </div>

                        <div className="min-w-0">
                          <p className="break-all text-sm font-bold text-slate-900">
                            {user.email}
                          </p>

                          <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                            {user.role}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRevoke(user.email)}
                        aria-label={`Revoke access for ${user.email}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Permissions Granted
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {user.permissions?.length ? (
                          user.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-800"
                            >
                              {permission}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">
                            No permissions assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-[#f0f2f8]">
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        User Info
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Role
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Permissions Granted
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                        Revoke Access
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSubAdmins.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-slate-200 transition last:border-0 hover:bg-blue-50/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-800">
                              <User size={20} />
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[260px] break-all text-sm font-semibold text-slate-900">
                                {user.email}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                Sub-admin account
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800">
                            {user.role}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex max-w-xl flex-wrap gap-1.5">
                            {user.permissions?.length ? (
                              user.permissions.map((permission) => (
                                <span
                                  key={permission}
                                  className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600"
                                >
                                  {permission}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">
                                No permissions assigned
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleRevoke(user.email)}
                            aria-label={`Revoke access for ${user.email}`}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABLE FOOTER */}
          {!loading && filteredSubAdmins.length > 0 && (
            <div className="flex flex-col gap-1 border-t border-slate-200 bg-slate-50 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Showing {filteredSubAdmins.length} of {subAdmins.length} sub-admins
              </p>

              <p className="text-xs text-slate-400">
                Access management
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

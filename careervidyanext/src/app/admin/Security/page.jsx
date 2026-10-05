"use client";

import React, { useState, useEffect, useTransition } from "react";
import api from "@/utlis/api.js";
import { Trash2, ShieldCheck, User, CheckCircle, AlertCircle } from "lucide-react";

// ✅ Layout.js ke menu ke saath synced.
// Layout me match ye hota hai: (item.id || item.label).toLowerCase().trim() === permission.toLowerCase().trim()
// Isliye yaha ka `id` Layout ke item ka `id` (agar hai) warna uska `label` hona chahiye.
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

export default function GiveAccessPage() {
  const [message, setMessage] = useState({ type: "", text: "" });
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // 1. Data Fetching (Get all Sub-admins)
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

  // 2. Assign Access Handler
  async function handleAccessSubmit(formData) {
    setMessage({ type: "", text: "" });

    startTransition(async () => {
      const payload = {
        email: formData.get("email"),
        permissions: formData.getAll("permissions"), // Multi-select array
      };

      if (!payload.email || payload.permissions.length === 0) {
        return setMessage({ type: "error", text: "Email and at least one permission required" });
      }

      try {
        const { data } = await api.post("/api/v1/assign-access", payload);
        setMessage({ type: "success", text: data.msg });
        fetchSubAdmins(); // Refresh List
      } catch (error) {
        setMessage({ type: "error", text: error.response?.data?.msg || "Update failed" });
      }
    });
  }

  // 3. Revoke Access Handler
  const handleRevoke = async (email) => {
    if (!window.confirm(`Kya aap ${email} ka access puri tarah khatam karna chahte hain?`)) return;

    try {
      await api.post("/api/v1/revoke-access", { email });
      setMessage({ type: "success", text: "Access revoked!" });
      fetchSubAdmins();
    } catch (error) {
      alert("Error revoking access");
    }
  };

  // Ek group ke saare checkboxes select / clear karne ke liye
  const toggleGroup = (e, groupTitle, checked) => {
    e.currentTarget
      .closest("form")
      .querySelectorAll(`input[data-group="${groupTitle}"]`)
      .forEach((el) => {
        el.checked = checked;
      });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* SECTION: ASSIGN FORM */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Sub-Admin Access Control</h1>
          <p className="opacity-80 text-sm">Select modules to grant permission</p>
        </div>

        <form action={handleAccessSubmit} className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-end bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-bold text-gray-600 ml-1">SUB-ADMIN EMAIL</label>
              <input
                name="email"
                type="email"
                required
                placeholder="Enter email address"
                className="w-full p-4 rounded-xl border-2 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <button
              disabled={isPending}
              className="md:w-64 w-full bg-indigo-600 text-white h-[60px] rounded-xl font-bold hover:bg-indigo-700 shadow-lg disabled:bg-gray-400"
            >
              {isPending ? "Syncing..." : "Confirm Permissions"}
            </button>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
              <CheckCircle className="text-indigo-500" size={20} /> Select Module Access
            </h3>

            {PERMISSION_GROUPS.map((group) => (
              <div key={group.title}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{group.title}</h4>
                  <div className="flex gap-3 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={(e) => toggleGroup(e, group.title, true)}
                      className="text-indigo-600 hover:underline"
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      onClick={(e) => toggleGroup(e, group.title, false)}
                      className="text-gray-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {group.items.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center p-3 border rounded-xl hover:bg-indigo-50 cursor-pointer transition-all group"
                    >
                      <input
                        type="checkbox"
                        name="permissions"
                        value={item.id}
                        data-group={group.title}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-indigo-900">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {message.text && (
            <div
              className={`p-4 rounded-xl flex items-center gap-2 font-semibold justify-center ${
                message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}
        </form>
      </div>

      {/* SECTION: LIST OF ADMINS */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ShieldCheck className="text-green-600" /> Active Sub-Admins List
        </h2>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Fetching sub-admins...</div>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">User Info</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Permissions Granted</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Revoke</th>
                </tr>
              </thead>
              <tbody>
                {subAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-10 text-center text-gray-400 italic">
                      No sub-admins found.
                    </td>
                  </tr>
                ) : (
                  subAdmins.map((user) => (
                    <tr key={user._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{user.email}</p>
                            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">
                              {user.role}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {user.permissions?.map((p) => (
                            <span
                              key={p}
                              className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-100"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleRevoke(user.email)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
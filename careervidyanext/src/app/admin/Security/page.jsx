"use client";

import React, { useState, useEffect, useTransition } from "react";
import api from "@/utlis/api.js"; 
import { Trash2, ShieldCheck, User, CheckCircle, AlertCircle } from "lucide-react";

// ✅ COMPLETE LIST: Ye labels exact 'Layout.js' se match hone chahiye
const PERMISSIONS_LIST = [
  { id: "Dashboard", label: "Dashboard" },
  { id: "applyadmission", label: "Apply Admission" },
  { id: "Visitors", label: "Visitors" },
  { id: "Placed Students", label: "Placed Students" },
  { id: "Add Team", label: "Add Team" },
  { id: "All Students", label: "All Students" },
  { id: "Banners", label: "Banners List" },
  { id: "Universities", label: "Universities" },
  { id: "Universities Data", label: "Universities Data" },
  { id: "Get Queries", label: "Get Queries" },
  { id: "Online Courses", label: "Online Courses" },
  { id: "Job Posts", label: "Job Posts" },
  { id: "Applications", label: "Applications (Resume)" },
  { id: "OnlyL Online", label: "OnlyL Online" },
  { id: "Q & A", label: "Q & A" },
  { id: "add-subsid", label: "Add Subsid" },
  { id: "addblog", label: "Add Blog" },
  { id: "getbloglist", label: "Blog List" },
  { id: "state", label: "State Management" },
  { id: "Newsletter", label: "Newsletter" },
  { id: "Addcounselor", label: "Add Counselor" },
  { id: "Security", label: "Security Settings" },
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
                name="email" type="email" required 
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

          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <CheckCircle className="text-indigo-500" size={20} /> Select Module Access
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {PERMISSIONS_LIST.map((item) => (
                <label key={item.id} className="flex items-center p-3 border rounded-xl hover:bg-indigo-50 cursor-pointer transition-all group">
                  <input type="checkbox" name="permissions" value={item.id} className="w-4 h-4 text-indigo-600 rounded border-gray-300" />
                  <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-indigo-900">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl flex items-center gap-2 font-semibold justify-center ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
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
                  <tr><td colSpan="3" className="p-10 text-center text-gray-400 italic">No sub-admins found.</td></tr>
                ) : (
                  subAdmins.map((user) => (
                    <tr key={user._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"><User size={20} /></div>
                          <div>
                            <p className="font-bold text-gray-800">{user.email}</p>
                            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">{user.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {user.permissions?.map((p) => (
                            <span key={p} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-100">{p}</span>
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
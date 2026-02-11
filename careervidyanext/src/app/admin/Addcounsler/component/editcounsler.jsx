"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";

import {
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Briefcase,
  Save,
  X,
  Lock,
  IdCard,
} from "lucide-react";

const EditCounselor = ({ counselorId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadhar: "",
    dob: "",
    pan: "",
    address: "",
    doj: "",
    userid: "",
    password: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!counselorId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/api/v1/counselor/${counselorId}`);
        if (res?.data?.success) {
          const c = res.data.data;
          setFormData({
            name: c.name || "",
            email: c.email || "",
            phone: c.phone || "",
            aadhar: c.aadhar || "",
            dob: c.dob?.slice(0, 10) || "",
            pan: c.pan || "",
            address: c.address || "",
            doj: c.doj?.slice(0, 10) || "",
            userid: c.userid || "",
            password: "",
            status: c.status || "active",
          });
        }
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [counselorId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      const res = await api.put(`/api/v1/counselor/${counselorId}`, payload);
      if (res?.data?.success) {
        setMessage("✅ Updated Successfully");
        if (onSuccess) setTimeout(() => onSuccess(), 1000);
      } else {
        setError("Update failed.");
      }
    } catch (err) {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-orange-600 font-bold">Loading...</div>;

  return (
    /* The outer div ensures it sits tightly without extra space */
    <div className="w-full h-full flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-md overflow-hidden border border-gray-200">
        
        {/* HEADER */}
        <div className="bg-[#FF4500] p-4 text-white flex justify-between items-center">
          <h2 className="font-bold text-lg sm:text-xl">Edit Counselor</h2>
          {onClose && (
            <button onClick={onClose} className="hover:bg-orange-700 p-1 rounded-md">
              <X size={24} />
            </button>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {message && <p className="text-green-600 text-center text-sm font-bold bg-green-50 p-2 rounded border border-green-200">{message}</p>}
          {error && <p className="text-red-600 text-center text-sm font-bold bg-red-50 p-2 rounded border border-red-200">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input icon={User} label="Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input icon={Mail} label="Email" name="email" value={formData.email} onChange={handleChange} required />
            <Input icon={IdCard} label="User ID" name="userid" value={formData.userid} onChange={handleChange} required />
            <Input icon={Lock} label="New Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current" />
            <Input icon={Phone} label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
            <Input icon={CreditCard} label="PAN" name="pan" value={formData.pan} onChange={handleChange} />
            <Input icon={Briefcase} label="Aadhaar" name="aadhar" value={formData.aadhar} onChange={handleChange} />
            <Input icon={Calendar} label="DOB" name="dob" type="date" value={formData.dob} onChange={handleChange} />
            <Input icon={Calendar} label="Date of Joining" name="doj" type="date" value={formData.doj} onChange={handleChange} />

            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-600 uppercase mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-orange-500 outline-none"
              >
                <option value="active">Active</option>
                <option value="leave">Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-600 uppercase mb-1">Address</label>
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 rounded-md text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#FF4500] text-white rounded-md text-sm font-bold hover:bg-orange-700 flex items-center gap-2"
            >
              <Save size={16} />
              {loading ? "Saving..." : "Update Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* Reusable Input to keep code clean */
const Input = ({ icon: Icon, label, name, value, onChange, type = "text", placeholder, required = false }) => (
  <div className="flex flex-col">
    <label className="text-xs font-bold text-gray-600 uppercase mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-2.5 w-4 h-4 text-orange-500" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="pl-10 w-full border border-gray-300 rounded-md p-2 text-sm focus:border-orange-500 outline-none transition-all placeholder:text-gray-300"
      />
    </div>
  </div>
);

export default EditCounselor;
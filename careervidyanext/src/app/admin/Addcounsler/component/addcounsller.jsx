"use client";

import React, { useState } from "react";
import api from "@/utlis/api.js";

import {
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  MapPin,
  Briefcase,
  Save,
  Lock,
  IdCard,
} from "lucide-react";

const AddCounselor = () => {
  /* ================= STATE ================= */
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
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
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
    });
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/api/v1/counselor", formData);
      if (res?.data?.success) {
        setMessage("✅ Counselor Registered Successfully!");
        resetForm();
      } else {
        setError(res?.data?.message || "❌ Registration Failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "❌ Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 flex justify-center items-start">
      {/* Main Card - Reduced border-radius to rounded-md */}
      <div className="w-full max-w-2xl bg-white rounded-md shadow-xl border border-gray-200 flex flex-col overflow-hidden">
        
        {/* COMPACT HEADER */}
        <div className="bg-orange-600 px-6 py-4 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Counselor Registration
            </h2>
            <p className="text-orange-100 text-xs opacity-90 font-medium">Fill in the counselor details</p>
          </div>
          <div className="bg-white/20 p-2 rounded-md">
            <User size={20} />
          </div>
        </div>

        {/* FORM AREA */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Status Messages - Reduced radius */}
            {message && <div className="p-3 bg-green-50 text-green-700 rounded-md text-center text-sm font-bold border border-green-200">{message}</div>}
            {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-center text-sm font-bold border border-red-200">{error}</div>}

            {/* INPUT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <Input icon={User} label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Rahul Sharma" required />
              <Input icon={Mail} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="rahul@gmail.com" required />
              <Input icon={IdCard} label="User ID" name="userid" value={formData.userid} onChange={handleChange} placeholder="rahul101" required />
              <Input icon={Lock} label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="********" required />
              <Input icon={Phone} label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" required />
              <Input icon={CreditCard} label="PAN" name="pan" value={formData.pan} onChange={handleChange} placeholder="ABCDE1234F" />
              <Input icon={Briefcase} label="Aadhaar" name="aadhar" value={formData.aadhar} onChange={handleChange} placeholder="123456789012" />
              <Input icon={Calendar} label="DOB" name="dob" type="date" value={formData.dob} onChange={handleChange} />
              <Input icon={Calendar} label="DOJ" name="doj" type="date" value={formData.doj} onChange={handleChange} />

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 block ml-1">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-orange-600" />
                  <textarea
                    name="address"
                    rows="2"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border-2 border-slate-100 p-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-50 outline-none text-sm text-slate-900 font-medium placeholder:text-slate-400 transition-all"
                    placeholder="House, City, State"
                  />
                </div>
              </div>
            </div>

            {/* BUTTONS - Reduced radius */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={resetForm}
                className=" cursor-pointer flex-1 py-2.5 border-2 border-slate-200 rounded-md text-slate-700 font-bold hover:bg-slate-50 transition-colors text-sm"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className=" cursor-pointer flex-[2] py-2.5 bg-orange-600 text-white rounded-md font-bold hover:bg-orange-700 shadow-md shadow-orange-100 disabled:opacity-60 transition-all text-sm flex justify-center items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Register Counselor"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

/* ================= COMPACT INPUT COMPONENT ================= */
const Input = ({ icon: Icon, label, name, value, onChange, type = "text", placeholder, required = false }) => {
  return (
    <div>
      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 block ml-1">
        {label} {required && <span className="text-orange-600">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-600" />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="pl-10 w-full rounded-md border-2 border-slate-100 p-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-50 outline-none text-sm text-slate-900 font-medium placeholder:text-slate-400 transition-all"
        />
      </div>
    </div>
  );
};

export default AddCounselor;
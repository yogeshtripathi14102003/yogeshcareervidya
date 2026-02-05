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
  X,
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


  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  /* ================= RESET ================= */
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


  /* ================= SUBMIT ================= */
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

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "❌ Server Error"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-6 py-6 flex justify-center">

      {/* Main Card */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border flex flex-col max-h-[95vh] overflow-hidden">


        {/* HEADER */}
        <div className="bg-indigo-600 p-5 sm:p-8 text-white">

          <h2 className="text-xl sm:text-3xl font-bold">
            Counselor Registration
          </h2>

          <p className="mt-1 sm:mt-2 text-indigo-100 text-sm">
            Naye counselor ki details yahan enter karein
          </p>

        </div>


        {/* FORM SCROLL AREA */}
        <div className="flex-1 overflow-y-auto">

          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-8 space-y-5"
          >

            {/* Success */}
            {message && (
              <p className="text-green-600 text-center font-semibold text-sm">
                {message}
              </p>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-600 text-center font-semibold text-sm">
                {error}
              </p>
            )}


            {/* INPUT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

              <Input icon={User} label="Name" name="name"
                value={formData.name} onChange={handleChange}
                placeholder="Rahul Sharma" required />

              <Input icon={Mail} label="Email" name="email" type="email"
                value={formData.email} onChange={handleChange}
                placeholder="rahul@gmail.com" required />

              <Input icon={IdCard} label="User ID" name="userid"
                value={formData.userid} onChange={handleChange}
                placeholder="rahul101" required />

              <Input icon={Lock} label="Password" name="password" type="password"
                value={formData.password} onChange={handleChange}
                placeholder="********" required />

              <Input icon={Phone} label="Phone" name="phone"
                value={formData.phone} onChange={handleChange}
                placeholder="9876543210" required />

              <Input icon={CreditCard} label="PAN" name="pan"
                value={formData.pan} onChange={handleChange}
                placeholder="ABCDE1234F" />

              <Input icon={Briefcase} label="Aadhaar" name="aadhar"
                value={formData.aadhar} onChange={handleChange}
                placeholder="123456789012" />

              <Input icon={Calendar} label="DOB" name="dob" type="date"
                value={formData.dob} onChange={handleChange} />

              <Input icon={Calendar} label="DOJ" name="doj" type="date"
                value={formData.doj} onChange={handleChange} />


              {/* Address */}
              <div className="sm:col-span-2">

                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Address
                </label>

                <div className="relative">

                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

                  <textarea
                    name="address"
                    rows="2"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-lg border-2 border-gray-200 p-2.5 focus:border-indigo-500 focus:ring-2 outline-none text-sm"
                    placeholder="House, City, State"
                  />

                </div>
              </div>

            </div>


            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t">

              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm"
              >
                <X className="w-4 h-4 inline mr-1" />
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 text-sm"
              >
                <Save className="w-4 h-4 inline mr-1" />
                {loading ? "Saving..." : "Save"}
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
};


/* ================= INPUT ================= */

const Input = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}) => {
  return (
    <div>

      <label className="text-sm font-semibold text-gray-600 mb-1 block">
        {label}
      </label>

      <div className="relative">

        <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="pl-10 w-full rounded-lg border-2 border-gray-200 p-2.5 focus:border-indigo-500 focus:ring-2 outline-none text-sm"
        />

      </div>
    </div>
  );
};

export default AddCounselor;

"use client";

import React, { useEffect, useState } from "react";
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

/**
 * Props:
 *  - counselorId (required)
 *  - onClose (optional)
 *  - onSuccess (optional)
 */

const EditCounselor = ({ counselorId, onClose, onSuccess }) => {

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
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  /* ================= FETCH DATA ================= */

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

        setError("Failed to load counselor");

      } finally {

        setFetching(false);

      }
    };

    fetchData();

  }, [counselorId]);


  /* ================= CHANGE ================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {

      const payload = { ...formData };

      // Empty password skip
      if (!payload.password) {
        delete payload.password;
      }

      const res = await api.put(
        `/api/v1/counselor/${counselorId}`,
        payload
      );

      if (res?.data?.success) {

        setMessage("✅ Updated Successfully");

        if (onSuccess) onSuccess();
        if (onClose) onClose();

      } else {

        setError("Update failed");

      }

    } catch (err) {

      setError("Server error");

    } finally {

      setLoading(false);

    }
  };


  /* ================= LOADING ================= */

  if (fetching) {
    return (
      <div className="p-6 text-center">
        Loading...
      </div>
    );
  }


  return (
    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto">

      {/* HEADER */}
      <div className="bg-indigo-600 p-5 text-white flex justify-between items-center rounded-t-xl">

        <h2 className="font-bold text-lg">
          Edit Counselor
        </h2>

        {onClose && (
          <button onClick={onClose}>
            <X />
          </button>
        )}

      </div>


      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="p-5 space-y-5"
      >

        {/* Message */}
        {message && (
          <p className="text-green-600 text-center text-sm">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-600 text-center text-sm">
            {error}
          </p>
        )}


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


          <Input icon={User} label="Name" name="name"
            value={formData.name} onChange={handleChange} required />

          <Input icon={Mail} label="Email" name="email"
            value={formData.email} onChange={handleChange} required />

          <Input icon={IdCard} label="User ID" name="userid"
            value={formData.userid} onChange={handleChange} required />

          <Input icon={Lock} label="New Password" name="password" type="password"
            value={formData.password} onChange={handleChange}
            placeholder="Leave blank" />

          <Input icon={Phone} label="Phone" name="phone"
            value={formData.phone} onChange={handleChange} />

          <Input icon={CreditCard} label="PAN" name="pan"
            value={formData.pan} onChange={handleChange} />

          <Input icon={Briefcase} label="Aadhaar" name="aadhar"
            value={formData.aadhar} onChange={handleChange} />

          <Input icon={Calendar} label="DOB" name="dob" type="date"
            value={formData.dob} onChange={handleChange} />

          <Input icon={Calendar} label="DOJ" name="doj" type="date"
            value={formData.doj} onChange={handleChange} />


          {/* STATUS */}
          <div>

            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border-2 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none"
            >
              <option value="active">Active</option>
              <option value="leave">Leave</option>
              <option value="Inactive">Inactive</option>
            </select>

          </div>


          {/* ADDRESS */}
          <div className="sm:col-span-2">

            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Address
            </label>

            <textarea
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-lg border-2 border-gray-200 p-2.5 focus:border-indigo-500 outline-none text-sm"
            />

          </div>

        </div>


        {/* BUTTONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save size={16} className="inline mr-1" />
            {loading ? "Saving..." : "Update"}
          </button>

        </div>

      </form>

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
          className="pl-10 w-full rounded-lg border-2 border-gray-200 p-2.5 focus:border-indigo-500 outline-none text-sm"
        />

      </div>

    </div>
  );
};

export default EditCounselor;

"use client";

import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js";

import {
  User, Mail, Phone, MapPin, BookOpen, School,
  Layers, CreditCard, Calendar, Save,
  Headphones, Percent, Users
} from "lucide-react";

/* ================= INITIAL STATE ================= */

const initialState = {
  studentName: "",
  fatherName: "", // Added Father Name
  email: "",
  city: "",
  phone: "",
  course: "",
  universityName: "",
  branch: "",
  semesterFees: "",
  semesterCount: "",
  registrationFee: "",
  examFees: "",
  totalFees: "", // Discount removed from here
  admissionDate: new Date().toISOString().split("T")[0],
  counselorName: "",
  // --- Counselor Entry Fields ---
  c_semesterFees: "",
  c_semesterCount: "",
  c_registrationFee: "",
  c_examFees: "",
  c_discount: "",
  c_totalFees: "",
};

const StudentAdmission = ({ lead, onClose }) => {

  /* ================= STATE ================= */
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [feesData, setFeesData] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);

  /* ================= AUTO FILL INITIAL DATA ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const counselor = storedUser
      ? JSON.parse(storedUser)?.name || ""
      : "";

    if (lead) {
      setFormData(prev => ({
        ...prev,
        studentName: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        city: lead.city || "",
        course: lead.course || "",
        counselorName: counselor,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        counselorName: counselor,
      }));
    }
  }, [lead]);

  /* ================= FETCH FEES ================= */
  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await api.get("/api/v1/admissionfess/all");
        if (res?.data?.success) {
          const data = res.data.data;
          setFeesData(data);
          setUniversities([...new Set(data.map(i => i.universityName))]);
        }
      } catch (err) {
        console.log("Fees API Error:", err);
      }
    };
    fetchFees();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newData = { ...formData, [name]: value || "" };

    /* ---------- University ---------- */
    if (name === "universityName") {
      const filtered = feesData.filter(i => i.universityName === value);
      setCourses([...new Set(filtered.map(i => i.course))]);
      setBranches([]);
      newData.course = "";
      newData.branch = "";
      newData.semesterFees = "";
      newData.semesterCount = "";
      newData.registrationFee = "";
      newData.examFees = "";
      newData.totalFees = "";
    }

    /* ---------- Course ---------- */
    if (name === "course") {
      const filtered = feesData.filter(
        i => i.universityName === formData.universityName && i.course === value
      );
      setBranches([...new Set(filtered.map(i => i.branch))]);
      newData.branch = "";
      newData.semesterFees = "";
      newData.semesterCount = "";
      newData.registrationFee = "";
      newData.examFees = "";
      newData.totalFees = "";
    }

    /* ---------- Branch ---------- */
    if (name === "branch") {
      const selected = feesData.find(
        i =>
          i.universityName === formData.universityName &&
          i.course === formData.course &&
          i.branch === value
      );

      if (selected) {
        newData.registrationFee = selected.semesterFees[0]?.registrationFee || selected.registrationFee || 0;
        newData.examFees = selected.semesterFees[0]?.examFee || selected.examFee || 0;
        newData.semesterFees = selected.semesterFees[0]?.fee || 0;
        
        newData.c_registrationFee = newData.registrationFee;
        newData.c_examFees = newData.examFees;
        newData.c_semesterFees = newData.semesterFees;
      }
    }

    /* ---------- AUTO TOTAL CALCULATION (ORIGINAL - NO DISCOUNT) ---------- */
    const semFee = Number(newData.semesterFees || 0);
    const semCount = Number(newData.semesterCount || 0);
    const registration = Number(newData.registrationFee || 0);
    const exam = Number(newData.examFees || 0);
    // Formula: (Sem Fee * Count) + Registration + (Exam Fee * Count)
    let total = (semFee * semCount) + registration + (exam * semCount);
    newData.totalFees = total < 0 ? "0" : total.toString();

    /* ---------- AUTO TOTAL CALCULATION (COUNSELOR) ---------- */
    const c_semFee = Number(newData.c_semesterFees || 0);
    const c_semCount = Number(newData.c_semesterCount || 0);
    const c_registration = Number(newData.c_registrationFee || 0);
    const c_exam = Number(newData.c_examFees || 0);
    const c_discount = Number(newData.c_discount || 0);
    let c_total = (c_semFee * c_semCount) + c_registration + (c_exam * c_semCount) - c_discount;
    newData.c_totalFees = c_total < 0 ? "0" : c_total.toString();

    setFormData(newData);
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setFormData({
      ...initialState,
      studentName: lead?.name || "",
      email: lead?.email || "",
      phone: lead?.phone || "",
      city: lead?.city || "",
      counselorName: storedUser?.name || "",
    });
    setCourses([]);
    setBranches([]);
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
      const res = await api.post("/api/v1/ad", formData);
      if (res?.data?.success) {
        setMessage("✅ Admission Submitted Successfully!");
        setTimeout(() => { if (onClose) onClose(); }, 2000);
      } else {
        setError(res?.data?.message || "❌ Failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "❌ Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white font-sans">
      <form onSubmit={handleSubmit} className="space-y-10">

        {/* Messages */}
        {message && <div className="p-4 bg-green-100 border-2 border-green-500 text-green-800 rounded text-sm font-bold">{message}</div>}
        {error && <div className="p-4 bg-red-100 border-2 border-red-500 text-red-800 rounded text-sm font-bold">{error}</div>}

        {/* Personal & Academic Details */}
        <div>
          <h3 className="text-[14px] font-black mb-8 uppercase border-l-4 border-orange-500 pl-3">Personal & Academic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input icon={User} label="Student Name" name="studentName" value={formData.studentName} onChange={handleChange} required />
            <Input icon={Users} label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
            <Input icon={Mail} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Input icon={Phone} label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
            <Input icon={MapPin} label="City" name="city" value={formData.city} onChange={handleChange} />
            <SelectInput icon={School} label="University" name="universityName" value={formData.universityName} onChange={handleChange} options={universities} required />
            <SelectInput icon={BookOpen} label="Course" name="course" value={formData.course} onChange={handleChange} options={courses} disabled={!courses.length} required />
            <SelectInput icon={Layers} label="Branch" name="branch" value={formData.branch} onChange={handleChange} options={branches} disabled={!branches.length} required />
            <Input icon={Headphones} label="Counselor" name="counselorName" value={formData.counselorName} readOnly />
            <Input icon={Calendar} label="Admission Date" name="admissionDate" type="date" value={formData.admissionDate} onChange={handleChange} required />
          </div>
        </div>

        {/* Fees Structure (DISCOUNT REMOVED) */}
        <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-100">
          <h3 className="text-[14px] font-black mb-6 uppercase flex items-center gap-2"><CreditCard size={18} /> Fees Structure (Standard)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Input icon={CreditCard} label="Semester Fees" name="semesterFees" type="number" value={formData.semesterFees} onChange={handleChange} />
            <Input icon={Layers} label="Semester Count" name="semesterCount" type="number" value={formData.semesterCount} onChange={handleChange} />
            <Input icon={CreditCard} label="Registration Fee" name="registrationFee" type="number" value={formData.registrationFee} readOnly />
            <Input icon={CreditCard} label="Exam Fees" name="examFees" type="number" value={formData.examFees} readOnly />
            <Input icon={CreditCard} label="Total Fees" name="totalFees" type="number" value={formData.totalFees} readOnly />
          </div>
        </div>

        {/* Counselor Closing Fees */}
        <div className="bg-orange-100 p-6 rounded-lg border-2 border-orange-500">
          <h3 className="text-[14px] font-black mb-6 uppercase flex items-center gap-2"><CreditCard size={18} /> Counselor Closing Fees</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <Input icon={CreditCard} label="Closing Sem Fee" name="c_semesterFees" type="number" value={formData.c_semesterFees} onChange={handleChange} />
            <Input icon={Layers} label="Closing Sem Count" name="c_semesterCount" type="number" value={formData.c_semesterCount} onChange={handleChange} />
            <Input icon={CreditCard} label="Closing Reg Fee" name="c_registrationFee" type="number" value={formData.c_registrationFee} onChange={handleChange} />
            <Input icon={CreditCard} label="Closing Exam Fee" name="c_examFees" type="number" value={formData.c_examFees} onChange={handleChange} />
            <Input icon={Percent} label="Closing Discount" name="c_discount" type="number" value={formData.c_discount} onChange={handleChange} />
            <Input icon={CreditCard} label="Closing Total" name="c_totalFees" type="number" value={formData.c_totalFees} readOnly />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t-2 border-orange-500">
          <button type="button" onClick={resetForm} className="px-8 py-2 border-2 border-black font-black text-[11px] uppercase">Reset</button>
          <button type="submit" disabled={loading} className="px-10 py-2.5 bg-orange-500 text-white font-black text-[11px] uppercase flex items-center gap-2 border-2 border-black">
            <Save size={16} /> {loading ? "Saving..." : "Confirm Admission"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default StudentAdmission;

/* ================= INPUT & SELECT COMPONENTS (UNCHANGED) ================= */
const Input = ({ icon: Icon, label, name, value = "", onChange, type = "text", required = false, readOnly = false }) => (
  <div>
    <label className="text-[11px] font-black uppercase mb-2 block">{label} {required && <span className="text-orange-500">*</span>}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 border-r-2 pr-3">
        <Icon className="w-4 h-4 text-orange-600" />
      </div>
      <input type={type} name={name} value={value} onChange={onChange} readOnly={readOnly} required={required}
        className="pl-14 w-full border-2 border-orange-200 p-2.5 font-bold text-[13px] focus:border-black outline-none" />
    </div>
  </div>
);

const SelectInput = ({ icon: Icon, label, name, value = "", onChange, options = [], required = false, disabled = false }) => (
  <div>
    <label className="text-[11px] font-black uppercase mb-2 block">{label} {required && <span className="text-orange-500">*</span>}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 border-r-2 pr-3">
        <Icon className="w-4 h-4 text-orange-600" />
      </div>
      <select name={name} value={value} onChange={onChange} disabled={disabled} required={required}
        className="pl-14 w-full border-2 border-orange-200 p-2.5 font-bold text-[13px] focus:border-black outline-none">
        <option value="">Select {label}</option>
        {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
      </select>
    </div>
  </div>
);
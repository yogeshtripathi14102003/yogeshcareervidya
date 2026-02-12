"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/utlis/api.js";
import { Search, Pencil, Target, X, User, GraduationCap, Landmark, Receipt } from "lucide-react";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editData, setEditData] = useState({});

  // Dropdown States
  const [feesData, setFeesData] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetchData();
    fetchFeesConfig();
  }, []);

  // AUTOMATIC CALCULATION LOGIC
  useEffect(() => {
    if (selectedStudent) {
      const semFee = parseFloat(editData.semesterFees) || 0;
      const semCount = parseFloat(editData.semesterCount) || 0;
      const regFee = parseFloat(editData.registrationFee) || 0;

      const cSemFee = parseFloat(editData.c_semesterFees) || 0;
      const cRegFee = parseFloat(editData.c_registrationFee) || 0;
      const cDiscount = parseFloat(editData.c_discount) || 0;

      // Calculate Official Total
      const calculatedTotal = (semFee * semCount) + regFee;
      
      // Calculate Closing Total (Counselor's Deal)
      const calculatedClosingTotal = (cSemFee * semCount) + cRegFee - cDiscount;

      // Only update if values actually changed to avoid infinite loops
      if (editData.totalFees !== calculatedTotal || editData.c_totalFees !== calculatedClosingTotal) {
        setEditData(prev => ({
          ...prev,
          totalFees: calculatedTotal,
          c_totalFees: calculatedClosingTotal
        }));
      }
    }
  }, [
    editData.semesterFees, 
    editData.semesterCount, 
    editData.registrationFee, 
    editData.c_semesterFees, 
    editData.c_registrationFee, 
    editData.c_discount
  ]);

  const fetchData = async () => {
    try {
      const res = await api.get("/api/v1/ad");
      if (res.data.success) setLeads(res.data.data);
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  const fetchFeesConfig = async () => {
    try {
      const res = await api.get("/api/v1/admissionfess/all");
      if (res?.data?.success) {
        const data = res.data.data;
        setFeesData(data);
        setUniversities([...new Set(data.map(i => i.universityName))]);
      }
    } catch (err) {
      console.error("Fees Config fetch error:", err);
    }
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setEditData({ ...student });
    
    if (feesData.length > 0) {
      const filteredCourses = feesData
        .filter(i => i.universityName === student.universityName)
        .map(i => i.course);
      setCourses([...new Set(filteredCourses)]);

      const filteredBranches = feesData
        .filter(i => i.universityName === student.universityName && i.course === student.course)
        .map(i => i.branch);
      setBranches([...new Set(filteredBranches)]);
    }
  };

  const handleDropdownChange = (name, value) => {
    let newData = { ...editData, [name]: value };

    if (name === "universityName") {
      const filtered = feesData.filter(i => i.universityName === value);
      setCourses([...new Set(filtered.map(i => i.course))]);
      setBranches([]);
      newData.course = "";
      newData.branch = "";
    }

    if (name === "course") {
      const filtered = feesData.filter(
        i => i.universityName === editData.universityName && i.course === value
      );
      setBranches([...new Set(filtered.map(i => i.branch))]);
      newData.branch = "";
      
      // Auto-fill fees from config if found
      const config = feesData.find(i => i.universityName === editData.universityName && i.course === value);
      if(config) {
          newData.semesterFees = config.semesterFees;
          newData.semesterCount = config.semesterCount;
          newData.registrationFee = config.registrationFee;
      }
    }

    setEditData(newData);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/api/v1/ad/${selectedStudent._id}`, editData);
      if (res.data.success) {
        alert("Record Updated Successfully!");
        setSelectedStudent(null);
        fetchData();
      }
    } catch (err) {
      alert("Failed to update.");
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const term = searchTerm.toLowerCase();
      return !searchTerm || 
        l.studentName?.toLowerCase().includes(term) || 
        l.phone?.includes(searchTerm) ||
        l.counselorName?.toLowerCase().includes(term);
    });
  }, [leads, searchTerm]);

  return (
    <div className="p-4 bg-slate-50 min-h-screen font-sans text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-lg font-bold flex gap-2 items-center text-slate-800">
          <Target className="text-orange-500" size={20} />
          Admission Records
        </h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-4 py-3">Student & Contact</th>
                <th className="px-4 py-3">University & Course</th>
                <th className="px-4 py-3">Fees Status</th>
                <th className="px-4 py-3">Counselor</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((student) => (
                <tr key={student._id} className="hover:bg-orange-50/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="font-bold text-slate-800">{student.studentName}</div>
                    <div className="text-[10px] text-slate-500">{student.phone}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-slate-700">{student.course}</div>
                    <div className="text-[9px] font-bold text-orange-600 uppercase">{student.universityName}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-bold text-slate-800">₹{student.totalFees}</div>
                    <div className="text-green-600 font-bold text-[10px]">Closing: ₹{student.c_totalFees || 0}</div>
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-slate-600 italic">{student.counselorName}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => handleEditClick(student)}
                      className="bg-orange-500 text-white px-3 py-1.5 rounded-md text-[11px] font-bold hover:bg-orange-600 transition-all shadow-sm"
                    >
                      <Pencil size={12} className="inline mr-1" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-6 py-3 border-b border-slate-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Edit Student Profile</h2>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-orange-500 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 overflow-y-auto max-h-[85vh]">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3">
                
                <SectionTitle icon={<User size={14}/>} title="Personal Information" />
                <InputField label="Student Name" value={editData.studentName} onChange={(val) => setEditData({...editData, studentName: val})} />
                <InputField label="Father's Name" value={editData.fatherName} onChange={(val) => setEditData({...editData, fatherName: val})} />
                <InputField label="Email Address" value={editData.email} onChange={(val) => setEditData({...editData, email: val})} />
                <InputField label="Phone Number" value={editData.phone} onChange={(val) => setEditData({...editData, phone: val})} />

                <SectionTitle icon={<GraduationCap size={14}/>} title="Academic Details" />
                <SelectField label="University Name" value={editData.universityName} options={universities} onChange={(val) => handleDropdownChange("universityName", val)} />
                <SelectField label="Course" value={editData.course} options={courses} disabled={!courses.length} onChange={(val) => handleDropdownChange("course", val)} />
                <SelectField label="Branch" value={editData.branch} options={branches} disabled={!branches.length} onChange={(val) => setEditData({...editData, branch: val})} />
                <InputField label="Counselor" value={editData.counselorName} onChange={(val) => setEditData({...editData, counselorName: val})} />
                <InputField label="Admission Date" type="date" value={editData.admissionDate?.split('T')[0]} onChange={(val) => setEditData({...editData, admissionDate: val})} />

                <SectionTitle icon={<Landmark size={14}/>} title="Official Fee Structure" />
                <InputField label="Sem Fees" type="number" value={editData.semesterFees} onChange={(val) => setEditData({...editData, semesterFees: val})} />
                <InputField label="Sem Count" type="number" value={editData.semesterCount} onChange={(val) => setEditData({...editData, semesterCount: val})} />
                <InputField label="Reg Fee" type="number" value={editData.registrationFee} onChange={(val) => setEditData({...editData, registrationFee: val})} />
                <InputField label="Total Fee (Calculated)" type="number" value={editData.totalFees} readOnly className="bg-slate-100" />

                <SectionTitle icon={<Receipt size={14}/>} title="Closing (Counselor Deal)" />
                <InputField label="Closing Sem Fee" type="number" value={editData.c_semesterFees} onChange={(val) => setEditData({...editData, c_semesterFees: val})} />
                <InputField label="Closing Reg Fee" type="number" value={editData.c_registrationFee} onChange={(val) => setEditData({...editData, c_registrationFee: val})} />
                <InputField label="Closing Discount" type="number" value={editData.c_discount} onChange={(val) => setEditData({...editData, c_discount: val})} />
                <InputField label="Closing Total (Final)" type="number" value={editData.c_totalFees} highlight readOnly />
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedStudent(null)} className="px-5 py-2 text-[11px] font-bold text-slate-400">Discard</button>
                <button type="submit" className="bg-orange-500 text-white px-8 py-2 rounded-lg text-[11px] font-bold hover:bg-orange-600 shadow-md">
                  Update Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// HELPER COMPONENTS
const SectionTitle = ({ icon, title }) => (
  <div className="md:col-span-4 flex items-center gap-2 mt-2 border-b border-slate-100 pb-1">
    <span className="text-orange-500">{icon}</span>
    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</h3>
  </div>
);

const InputField = ({ label, value, onChange, type = "text", highlight = false, readOnly = false, className = "" }) => (
  <div className="flex flex-col gap-0.5">
    <label className={`text-[9px] font-bold ${highlight ? 'text-green-600' : 'text-slate-500'} ml-1 uppercase`}>{label}</label>
    <input
      type={type}
      value={value || ""}
      readOnly={readOnly}
      onChange={(e) => onChange && onChange(e.target.value)}
      className={`border ${highlight ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-white'} ${readOnly ? 'bg-slate-50 cursor-not-allowed' : ''} rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-orange-100 outline-none transition-all ${className}`}
    />
  </div>
);

const SelectField = ({ label, value, options, onChange, disabled = false }) => (
  <div className="flex flex-col gap-0.5">
    <label className="text-[9px] font-bold text-slate-500 ml-1 uppercase">{label}</label>
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:ring-2 focus:ring-orange-100 outline-none transition-all disabled:bg-slate-50"
    >
      <option value="">Select {label}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default LeadsPage;
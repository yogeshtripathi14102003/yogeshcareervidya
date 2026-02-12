"use client";

import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js";
import { Users, GraduationCap, Calendar, Search, Loader2, Download, Phone } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CounselorAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [counselorName, setCounselorName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.name) {
      setCounselorName(user.name);
      fetchAdmissions(user.name);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAdmissions = async (name) => {
    try {
      const res = await api.get("/api/v1/ad");
      if (res?.data?.success) {
        setAdmissions(res.data.data.filter(ad => ad.counselorName === name));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("ADMISSION CONFIRMATION", 14, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Counselor: ${data.counselorName}`, 14, 33);

    autoTable(doc, {
      startY: 40,
      head: [["Field", "Details"]],
      body: [
        ["Student Name", data.studentName],
        ["Father's Name", data.fatherName || "N/A"],
        ["Email", data.email],
        ["Phone", data.phone],
        ["City", data.city || "N/A"],
        ["Admission Date", data.admissionDate],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Course", "University", "Branch"]],
      body: [[data.course, data.universityName, data.branch]],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Fee Type", "Actual", "Final"]],
      body: [
        ["Semester Fees", data.semesterFees, data.c_semesterFees],
        ["Registration", data.registrationFee, data.c_registrationFee],
        ["Exam", data.examFees, data.c_examFees],
        ["Discount", "-", data.c_discount],
        ["Total", data.totalFees, data.c_totalFees],
      ],
    });

    doc.save(`Admission_${data.studentName.replace(/\s+/g, "_")}.pdf`);
  };

  const filtered = admissions.filter(ad =>
    ad.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-orange-500" size={40} />
      <p className="font-black text-xs uppercase">Loading Records...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="bg-white border-b-2 border-black sticky top-0 z-10 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-orange-500" />
          <div>
            <h1 className="text-xl font-black uppercase text-orange-600">Admissions</h1>
            <p className="text-[10px] text-gray-400">Counselor: <span className="text-black italic">{counselorName}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-8 pr-2 py-1 text-xs border-2 border-black outline-none"
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-[10px] font-black">{admissions.length} Admission</div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <table className="w-full text-left border-collapse border-2 border-black">
          <thead className="bg-orange-500 text-white text-[10px] font-black uppercase">
            <tr>
              <th className="p-2 border-r border-orange-600">Date</th>
              <th className="p-2 border-r border-orange-600">Student</th>
              <th className="p-2 border-r border-orange-600">Course & Uni</th>
              <th className="p-2 border-r border-orange-600 text-center">Final Amount</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {filtered.length ? filtered.map((ad, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2">{new Date(ad.admissionDate).toLocaleDateString()}</td>
                <td className="p-2 font-black">{ad.studentName}<br/><span className="text-[10px] text-gray-400 flex items-center gap-1"><Phone size={10} />{ad.phone}</span></td>
                <td className="p-2 font-black">{ad.course}<br/><span className="text-[9px] text-gray-400 italic">{ad.universityName}</span></td>
                <td className="p-2 text-center font-black">₹{ad.c_totalFees}</td>
                <td className="p-2 text-center">
                  <button onClick={() => downloadPDF(ad)} className="border-2 border-black px-2 py-1 text-[10px] font-black hover:bg-black hover:text-white flex items-center gap-1">
                    <Download size={12} /> Slip
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-xs font-black opacity-20 uppercase">No Records Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CounselorAdmissions;


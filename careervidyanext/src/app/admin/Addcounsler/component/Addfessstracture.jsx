"use client";

import { useState } from "react";
import api from "@/utlis/api.js";
import { Plus, Trash2, Upload, GraduationCap, BookOpen, Save } from "lucide-react";
import * as XLSX from "xlsx";

export default function AdmissionFeesForm() {
  const [data, setData] = useState([
    { name: "", courses: [{ name: "", branches: [{ branch: "", fee: "", examFee: "", registrationFee: "", totalFees: "" }] }] },
  ]);
  const [loading, setLoading] = useState(false);

  /* ===== EXCEL UPLOAD LOGIC ===== */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const binaryData = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(binaryData, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "", range: 1 });

        const uniGroups = {};
        let lastUni = "";
        let lastCourse = "";

        json.forEach((row) => {
          const keys = {};
          Object.keys(row).forEach(k => keys[k.toString().trim().toLowerCase()] = row[k]);

          let currentUni = (keys["university"] || keys["universityname"] || "").toString().trim();
          let currentCourse = (keys["course"] || "").toString().trim();

          if (currentUni) lastUni = currentUni;
          if (currentCourse) lastCourse = currentCourse;

          const branchName = (keys["branch"] || "").toString().trim();
          if (!branchName || !lastUni || !lastCourse) return;

          if (!uniGroups[lastUni]) uniGroups[lastUni] = { name: lastUni, courses: {} };
          if (!uniGroups[lastUni].courses[lastCourse]) uniGroups[lastUni].courses[lastCourse] = { name: lastCourse, branches: [] };

          const reg = Number(keys["registration fee"] || keys["registrationfee"]) || 0;
          const tuition = Number(keys["fee"]) || 0;
          const exam = Number(keys["exam fee"] || keys["examfee"]) || 0;

          uniGroups[lastUni].courses[lastCourse].branches.push({
            branch: branchName,
            fee: tuition,
            examFee: exam,
            registrationFee: reg,
            totalFees: reg + tuition + exam,
          });
        });

        const finalArray = Object.values(uniGroups).map(u => ({
          ...u,
          courses: Object.values(u.courses)
        }));

        if (finalArray.length > 0) setData(finalArray);
        e.target.value = null;
      } catch (err) {
        alert("Excel Read Error!");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  /* ===== SUBMIT LOGIC (MATCHED WITH YOUR SCHEMA) ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = [];

    data.forEach((uni) => {
      uni.courses.forEach((course) => {
        course.branches.forEach((b) => {
          if (!uni.name || !course.name || !b.branch) return;

          // ✅ AAPKE SCHEMA KE HISAAB SE DATA STRUCTURE:
          payload.push({
            universityName: uni.name.trim(),
            course: course.name.trim(),
            branch: b.branch.trim(),
            registrationFee: Number(b.registrationFee) || 0, // Root Level
            examFee: Number(b.examFee) || 0,                 // Root Level
            totalFees: (Number(b.registrationFee) || 0) + (Number(b.fee) || 0) + (Number(b.examFee) || 0), // Root Level
            semesterFees: [{
              semester: 1,
              fee: Number(b.fee) || 0, // Tuition Fee inside semesterFees
            }],
          });
        });
      });
    });

    try {
      setLoading(true);
      const res = await api.post("/api/v1/admissionfess/bulk-upload", payload);
      alert("Data Saved Successfully! ✅");
      setData([{ name: "", courses: [{ name: "", branches: [{ branch: "", fee: "", examFee: "", registrationFee: "", totalFees: "" }] }] }]);
    } catch (err) {
      console.error("Save Error:", err.response?.data);
      alert(err.response?.data?.message || "Save failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white p-3 rounded-md shadow-sm border border-slate-200">
        <h1 className="text-lg font-black text-slate-800 uppercase">Fee Panel</h1>
        <div className="flex items-center gap-2 bg-orange-50 p-2 rounded-md border border-orange-100">
          <Upload size={16} className="text-orange-600" />
          <input type="file" accept=".xlsx" onChange={handleFile} className="text-xs font-bold cursor-pointer" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {data.map((uni, uIndex) => (
          <div key={uIndex} className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
            {/* Uni Bar */}
            <div className="bg-slate-800 p-2 px-4 flex justify-between items-center">
              <div className="flex items-center gap-2 flex-1">
                <GraduationCap size={18} className="text-orange-400" />
                <input 
                  className="bg-transparent text-white font-bold outline-none w-full text-sm"
                  value={uni.name}
                  onChange={(e) => { const updated = [...data]; updated[uIndex].name = e.target.value; setData(updated); }}
                  placeholder="University..."
                />
              </div>
              <button type="button" onClick={() => setData(data.filter((_, i) => i !== uIndex))} className="text-slate-400"><Trash2 size={16}/></button>
            </div>

            <div className="p-4 space-y-4">
              {uni.courses.map((course, cIndex) => (
                <div key={cIndex} className="border border-slate-100 rounded-md overflow-hidden bg-slate-50/30">
                  <div className="p-2 px-4 border-b flex items-center gap-2 bg-slate-50">
                    <BookOpen size={14} className="text-orange-600" />
                    <input 
                      className="bg-transparent font-bold text-slate-700 outline-none text-xs w-full"
                      value={course.name}
                      onChange={(e) => { const updated = [...data]; updated[uIndex].courses[cIndex].name = e.target.value; setData(updated); }}
                      placeholder="Course..."
                    />
                  </div>

                  <div className="p-2 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase border-b">
                          <th className="p-2">Branch</th>
                          <th className="p-2">Reg. Fee</th>
                          <th className="p-2">Tuition</th>
                          <th className="p-2">Exam Fee</th>
                          <th className="p-2">Total</th>
                          <th className="p-2 w-6"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {course.branches.map((b, bIndex) => (
                          <tr key={bIndex} className="border-b last:border-0">
                            <td className="p-2"><input className="w-full outline-none text-xs" value={b.branch} onChange={(e) => { const updated = [...data]; updated[uIndex].courses[cIndex].branches[bIndex].branch = e.target.value; setData(updated); }} /></td>
                            <td className="p-2"><input type="number" className="w-full outline-none text-xs text-orange-600 font-bold" value={b.registrationFee} onChange={(e) => { const updated = [...data]; updated[uIndex].courses[cIndex].branches[bIndex].registrationFee = e.target.value; setData(updated); }} /></td>
                            <td className="p-2"><input type="number" className="w-full outline-none text-xs" value={b.fee} onChange={(e) => { const updated = [...data]; updated[uIndex].courses[cIndex].branches[bIndex].fee = e.target.value; setData(updated); }} /></td>
                            <td className="p-2"><input type="number" className="w-full outline-none text-xs" value={b.examFee} onChange={(e) => { const updated = [...data]; updated[uIndex].courses[cIndex].branches[bIndex].examFee = e.target.value; setData(updated); }} /></td>
                            <td className="p-2 text-xs font-black">{(Number(b.registrationFee)||0) + (Number(b.fee)||0) + (Number(b.examFee)||0)}</td>
                            <td className="p-2"><button type="button" onClick={() => { const updated = [...data]; updated[uIndex].courses[cIndex].branches.splice(bIndex, 1); setData(updated); }} className="text-slate-300"><Trash2 size={14}/></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-3 sticky bottom-4">
          <button type="button" onClick={() => setData([...data, { name: "", courses: [{ name: "", branches: [{ branch: "", fee: "", examFee: "", registrationFee: "", totalFees: "" }] }] }])} className="flex-1 bg-white border border-slate-300 py-2 rounded-md font-bold text-xs">
            Add Uni
          </button>
          <button type="submit" disabled={loading} className="flex-[2] bg-orange-500 text-white py-2 rounded-md font-black text-xs shadow-md">
            {loading ? "SAVING..." : "SAVE ALL TO DATABASE"}
          </button>
        </div>
      </form>
    </div>
  );
}
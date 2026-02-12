"use client";

import React, { useState } from "react";
import api from "@/utlis/api";
import * as XLSX from "xlsx"; // Library for Excel support
import { 
  PlusCircle, Trash2, FileText, User, Search, Layers, 
  Image as ImageIcon, UploadCloud, HelpCircle, Layout, Table, FileSpreadsheet, X
} from "lucide-react";

export default function BlogForm() {
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [excelData, setExcelData] = useState([]); // Excel data preview state

  const [formData, setFormData] = useState({
    custom_id: "",
    title: "",
    category: "",
    author: { name: "", experience: "", specialization: "", designation: "", description: "" },
    overview: { heading: "Quick Overview", points: [""] },
    second_section: { 
      heading: "", 
      description: "", 
      sub_description: "", 
      points: [""], 
      table: [{ column1: "", column2: "", column3: "" }] 
    },
    content: [{ block_type: "text", value: "", media: { caption: "" } }],
    faqs: [{ question: "", answer: "" }],
    seo: { meta_title: "", meta_desc: "", keywords: "" },
  });

  const [files, setFiles] = useState({
    coverImage: null,
    authorImage: null,
    contentMedia: {},
  });

  /* ---------------- EXCEL LOGIC ---------------- */
  const handleExcelFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setExcelData(data); // Preview data
    };
    reader.readAsBinaryString(file);
  };

  const handleBulkSubmit = async () => {
    if (excelData.length === 0) return;
    setBulkLoading(true);
    try {
      await api.post("/api/v1/blog/bulk-excel", { blogs: excelData });
      alert("✅ Bulk Blogs Uploaded Successfully!");
      setExcelData([]);
    } catch (err) {
      alert("❌ Bulk Upload Failed!");
    } finally {
      setBulkLoading(false);
    }
  };

  /* ---------------- EXISTING HANDLERS ---------------- */
  const handleChange = (e, path) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      let ref = updated;
      path.forEach((key, i) => {
        if (i === path.length - 1) ref[key] = value;
        else ref = ref[key];
      });
      return updated;
    });
  };

  const addItem = (path, item) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      let ref = updated;
      path.forEach((k) => (ref = ref[k]));
      ref.push(item);
      return updated;
    });
  };

  const removeItem = (path, index) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      let ref = updated;
      path.forEach((k) => (ref = ref[k]));
      ref.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const data = new FormData();

  const submissionData = {
    ...formData,
    seo: {
      ...formData.seo,
      keywords: formData.seo.keywords
        .split(",")
        .map((k) => k.trim()),
    },
  };

  data.append("jsonData", JSON.stringify(submissionData));

  // ✅ FIELD NAMES MUST MATCH MULTER
  if (files.coverImage) data.append("coverImage", files.coverImage);
  if (files.authorImage) data.append("authorImage", files.authorImage);

  // ✅ CONTENT MEDIA (IMAGE / VIDEO)
  Object.keys(files.contentMedia).forEach((index) => {
    data.append("contentImages", files.contentMedia[index]); // multer array
    data.append("contentIndex", index); // to map later
  });

  try {
    await api.post("/api/v1/blog", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("✅ Blog Published Successfully!");
  } catch (err) {
    console.error(err);
    alert("❌ Upload Failed");
  } finally {
    setLoading(false);
  }
};


  const cardStyle = "bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4";
  const inputStyle = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm";
  const labelStyle = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER & BULK EXCEL UPLOAD */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl border shadow-sm gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Blog Editor</h1>
              <p className="text-slate-500">Create rich content according to your schema</p>
            </div>
            <label className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl cursor-pointer hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 font-semibold">
              <FileSpreadsheet className="w-5 h-5" />
              Upload Excel / CSV
              <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleExcelFile} />
            </label>
          </div>

          {/* EXCEL PREVIEW BOX (Only shows when file selected) */}
          {excelData.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-emerald-800 font-bold flex items-center gap-2">
                  <Table className="w-4 h-4" /> Preview: {excelData.length} Blogs found
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => setExcelData([])} className="p-1 text-red-500 hover:bg-red-50 rounded"><X className="w-5 h-5"/></button>
                  <button 
                    onClick={handleBulkSubmit}
                    disabled={bulkLoading}
                    className="bg-emerald-600 text-white px-4 py-1 rounded-lg text-xs font-bold shadow-sm"
                  >
                    {bulkLoading ? "Uploading..." : "Confirm & Upload All"}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-40 border rounded-lg bg-white">
                <table className="w-full text-[10px] text-left">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      {Object.keys(excelData[0]).map(k => <th key={k} className="px-3 py-2 border-b">{k}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-b">
                        {Object.values(row).map((v, j) => <td key={j} className="px-3 py-2 truncate max-w-[100px]">{String(v)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
          {/* BASIC & COVER */}
          <section className={cardStyle}>
            <div className="flex items-center gap-2 border-b pb-3"><FileText className="text-blue-500" /> <h3 className="font-bold">General Info</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className={labelStyle}>Custom ID *</label><input required className={inputStyle} onChange={(e) => handleChange(e, ["custom_id"])} /></div>
              <div className="md:col-span-2"><label className={labelStyle}>Blog Title *</label><input required className={inputStyle} onChange={(e) => handleChange(e, ["title"])} /></div>
              <div><label className={labelStyle}>Category *</label><input required className={inputStyle} onChange={(e) => handleChange(e, ["category"])} /></div>
              <div className="md:col-span-2"><label className={labelStyle}>Cover Image</label><input type="file" className="text-sm mt-1" onChange={(e) => setFiles({...files, coverImage: e.target.files[0]})} /></div>
            </div>
          </section>

          {/* AUTHOR */}
          <section className={cardStyle}>
            <div className="flex items-center gap-2 border-b pb-3"><User className="text-blue-500" /> <h3 className="font-bold">Author Profile</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['name', 'experience', 'specialization', 'designation'].map(field => (
                <div key={field}><label className={labelStyle}>{field}</label><input className={inputStyle} onChange={(e) => handleChange(e, ["author", field])} /></div>
              ))}
              <div className="md:col-span-2"><label className={labelStyle}>Author Bio</label><textarea className={inputStyle} onChange={(e) => handleChange(e, ["author", "description"])} /></div>
              <div><label className={labelStyle}>Profile Photo</label><input type="file" className="text-sm mt-1" onChange={(e) => setFiles({...files, authorImage: e.target.files[0]})} /></div>
            </div>
          </section>

          {/* OVERVIEW */}
          <section className={cardStyle}>
            <div className="flex justify-between items-center"><div className="flex items-center gap-2"><Layers className="text-blue-500" /><h3 className="font-bold">Overview Points</h3></div>
            <button type="button" onClick={() => addItem(["overview", "points"], "")} className="text-blue-600 text-xs font-bold border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50">+ Add Point</button></div>
            <div className="grid grid-cols-1 gap-3">
              {formData.overview.points.map((_, i) => (
                <div key={i} className="flex gap-2 align-center">
                  <input className={inputStyle} placeholder="Key highlight..." onChange={(e) => handleChange(e, ["overview", "points", i])} />
                  <button type="button" onClick={() => removeItem(["overview", "points"], i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-5 h-5"/></button>
                </div>
              ))}
            </div>
          </section>

          {/* SECOND SECTION with TABLE */}
          <section className={cardStyle}>
            <div className="flex items-center gap-2 border-b pb-3"><Layout className="text-blue-500" /><h3 className="font-bold">Detailed Section & Table</h3></div>
            <div className="space-y-4">
              <input className={inputStyle} placeholder="Section Heading" onChange={(e) => handleChange(e, ["second_section", "heading"])} />
              <textarea className={inputStyle} placeholder="Main Description" onChange={(e) => handleChange(e, ["second_section", "description"])} />
              
              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <p className="text-xs font-bold flex items-center gap-2 text-slate-500"><Table className="w-4 h-4" /> SECTION TABLE (OPTIONAL)</p>
                {formData.second_section.table.map((row, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2">
                    <input className={inputStyle} placeholder="Col 1" onChange={(e) => handleChange(e, ["second_section", "table", i, "column1"])} />
                    <input className={inputStyle} placeholder="Col 2" onChange={(e) => handleChange(e, ["second_section", "table", i, "column2"])} />
                    <input className={inputStyle} placeholder="Col 3" onChange={(e) => handleChange(e, ["second_section", "table", i, "column3"])} />
                  </div>
                ))}
                <button type="button" onClick={() => addItem(["second_section", "table"], {column1:"", column2:"", column3:""})} className="text-xs text-blue-600 font-bold">+ Add Row</button>
              </div>
            </div>
          </section>

          {/* CONTENT BLOCKS */}
          <section className={cardStyle}>
            <div className="flex justify-between items-center"><div className="flex items-center gap-2"><ImageIcon className="text-blue-500" /><h3 className="font-bold">Main Content Blocks</h3></div>
            <button type="button" onClick={() => addItem(["content"], { block_type: "text", value: "", media: { caption: "" } })} className="bg-slate-900 text-white text-xs px-4 py-2 rounded-lg hover:bg-slate-800 transition-all">+ Add Content Block</button></div>
            
            <div className="space-y-6">
              {formData.content.map((block, i) => (
                <div key={i} className="p-5 border-2 border-slate-100 rounded-2xl relative bg-white shadow-sm hover:border-blue-100 transition-all">
                  <button type="button" onClick={() => removeItem(["content"], i)} className="absolute top-4 right-4 text-red-400"><Trash2 className="w-5 h-5"/></button>
                  <div className="flex gap-4 mb-4">
                    <select className="bg-slate-100 border-none rounded-lg px-3 py-2 text-sm font-bold" value={block.block_type} onChange={(e) => handleChange(e, ["content", i, "block_type"])}>
                      <option value="text">TEXT</option>
                      <option value="image">IMAGE</option>
                      <option value="video">VIDEO</option>
                      <option value="table">TABLE</option>
                    </select>
                  </div>
                  
                  <textarea className={`${inputStyle} h-32 mb-3`} placeholder="Enter text content or table JSON..." onChange={(e) => handleChange(e, ["content", i, "value"])} />
                  
                  {(block.block_type === 'image' || block.block_type === 'video') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-xl">
                      <div><label className={labelStyle}>Media File</label><input type="file" className="text-xs" onChange={(e) => setFiles({...files, contentMedia: {...files.contentMedia, [i]: e.target.files[0]}})} /></div>
                      <div><label className={labelStyle}>Caption</label><input className={inputStyle} placeholder="Image caption..." onChange={(e) => handleChange(e, ["content", i, "media", "caption"])} /></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* FAQs & SEO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className={cardStyle}>
              <div className="flex justify-between items-center"><div className="flex items-center gap-2"><HelpCircle className="text-blue-500"/><h3 className="font-bold">FAQs</h3></div>
              <button type="button" onClick={() => addItem(["faqs"], {question:"", answer:""})} className="text-blue-600 text-xs font-bold">+ Add FAQ</button></div>
              {formData.faqs.map((_, i) => (
                <div key={i} className="space-y-2 p-3 bg-slate-50 rounded-lg">
                  <input className={inputStyle} placeholder="Question" onChange={(e) => handleChange(e, ["faqs", i, "question"])} />
                  <textarea className={inputStyle} placeholder="Answer" onChange={(e) => handleChange(e, ["faqs", i, "answer"])} />
                </div>
              ))}
            </section>

            <section className={cardStyle}>
              <div className="flex items-center gap-2 border-b pb-3"><Search className="text-blue-500"/><h3 className="font-bold">SEO & Keywords</h3></div>
              <div className="space-y-3 pt-2">
                <input className={inputStyle} placeholder="Meta Title" onChange={(e) => handleChange(e, ["seo", "meta_title"])} />
                <textarea className={inputStyle} placeholder="Meta Description" onChange={(e) => handleChange(e, ["seo", "meta_desc"])} />
                <input className={inputStyle} placeholder="Keywords (separated by comma)" onChange={(e) => handleChange(e, ["seo", "keywords"])} />
              </div>
            </section>
          </div>

          {/* SUBMIT */}
          <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-2xl disabled:bg-slate-400 flex justify-center items-center gap-3">
            {loading ? "SAVING TO DATABASE..." : "PUBLISH BLOG POST"}
          </button>
        </form>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import api from "@/utlis/api";
import * as XLSX from "xlsx";
import { 
  PlusCircle, Trash2, FileText, User, Search, Layers, 
  Image as ImageIcon, UploadCloud, HelpCircle, Layout, Table, FileSpreadsheet, X
} from "lucide-react";

export default function BlogForm({ existingData = null, onSubmit = null, onCancel = null }) {
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [excelData, setExcelData] = useState([]);

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

  // Load existing blog data for edit
  useEffect(() => {
    if (existingData) {
      const tempData = { ...existingData };
      setFormData(tempData);
      setFiles({
        coverImage: null,
        authorImage: null,
        contentMedia: {},
      });
    }
  }, [existingData]);

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
      setExcelData(data);
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

  /* ---------------- FORM HANDLERS ---------------- */
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

    // Images
    if (files.coverImage) data.append("coverImage", files.coverImage);
    if (files.authorImage) data.append("authorImage", files.authorImage);

    Object.keys(files.contentMedia).forEach((index) => {
      data.append("contentImages", files.contentMedia[index]);
      data.append("contentIndex", index);
    });

    try {
      if (existingData?._id && onSubmit) {
        // Edit existing
        await onSubmit({ ...submissionData, files, _id: existingData._id });
      } else {
        // Create new
        await api.post("/api/v1/blog", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Blog Published Successfully!");
      }
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
    <div className="space-y-6">
      {/* EXCEL PREVIEW */}
      {excelData.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-emerald-800 font-bold flex items-center gap-2">
              <Table className="w-4 h-4" /> Preview: {excelData.length} Blogs
            </h3>
            <div className="flex gap-2">
              <button onClick={() => setExcelData([])} className="p-1 text-red-500 hover:bg-red-50 rounded"><X className="w-5 h-5"/></button>
              <button onClick={handleBulkSubmit} disabled={bulkLoading} className="bg-emerald-600 text-white px-4 py-1 rounded-lg text-xs font-bold">
                {bulkLoading ? "Uploading..." : "Confirm & Upload All"}
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        {/* GENERAL INFO */}
        <section className={cardStyle}>
          <div className="flex items-center gap-2 border-b pb-3"><FileText className="text-blue-500" /> <h3 className="font-bold">General Info</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className={labelStyle}>Custom ID *</label><input required value={formData.custom_id} className={inputStyle} onChange={(e) => handleChange(e, ["custom_id"])} /></div>
            <div className="md:col-span-2"><label className={labelStyle}>Blog Title *</label><input required value={formData.title} className={inputStyle} onChange={(e) => handleChange(e, ["title"])} /></div>
            <div><label className={labelStyle}>Category *</label><input required value={formData.category} className={inputStyle} onChange={(e) => handleChange(e, ["category"])} /></div>
            <div className="md:col-span-2"><label className={labelStyle}>Cover Image</label><input type="file" className="text-sm mt-1" onChange={(e) => setFiles({...files, coverImage: e.target.files[0]})} /></div>
          </div>
        </section>

        {/* AUTHOR */}
        <section className={cardStyle}>
          <div className="flex items-center gap-2 border-b pb-3"><User className="text-blue-500" /> <h3 className="font-bold">Author Profile</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['name', 'experience', 'specialization', 'designation'].map(field => (
              <div key={field}><label className={labelStyle}>{field}</label><input value={formData.author[field]} className={inputStyle} onChange={(e) => handleChange(e, ["author", field])} /></div>
            ))}
            <div className="md:col-span-2"><label className={labelStyle}>Author Bio</label><textarea value={formData.author.description} className={inputStyle} onChange={(e) => handleChange(e, ["author", "description"])} /></div>
            <div><label className={labelStyle}>Profile Photo</label><input type="file" className="text-sm mt-1" onChange={(e) => setFiles({...files, authorImage: e.target.files[0]})} /></div>
          </div>
        </section>

        {/* OVERVIEW POINTS */}
        <section className={cardStyle}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2"><Layers className="text-blue-500" /><h3 className="font-bold">Overview Points</h3></div>
            <button type="button" onClick={() => addItem(["overview", "points"], "")} className="text-blue-600 text-xs font-bold border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50">+ Add Point</button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {formData.overview.points.map((_, i) => (
              <div key={i} className="flex gap-2 align-center">
                <input value={formData.overview.points[i]} className={inputStyle} placeholder="Key highlight..." onChange={(e) => handleChange(e, ["overview", "points", i])} />
                <button type="button" onClick={() => removeItem(["overview", "points"], i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-5 h-5"/></button>
              </div>
            ))}
          </div>
        </section>

        {/* SECOND SECTION, CONTENT, FAQs, SEO ... */}
        {/* You can copy your existing content / second_section / content / FAQs / SEO sections as in your original BlogForm */}
        {/* Make sure to bind values: value={formData.second_section.heading} etc. */}

        <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-2xl flex justify-center items-center gap-3">
          {loading ? "SAVING..." : existingData ? "SAVE CHANGES" : "PUBLISH BLOG POST"}
        </button>

        {onCancel && (
          <button type="button" onClick={onCancel} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all">
            CANCEL
          </button>
        )}
      </form>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api";
import { Pencil, Trash2, Search, X, Plus, Minus, Upload, Loader2, Save } from "lucide-react";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get("/api/v1/blog");
      setBlogs(data?.data || []);
      setFilteredBlogs(data?.data || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/api/v1/blog/${id}`);
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (selectedFile) formData.append("image", selectedFile);
      
      // Send the entire object as a string - Backend should JSON.parse(req.body.data)
      formData.append("data", JSON.stringify(editingBlog));

      await api.put(`/api/v1/blog/${editingBlog._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      fetchBlogs();
      setIsEditModalOpen(false);
      alert("Updated Successfully!");
    } catch (error) { alert("Update failed"); } finally { setIsSubmitting(false); }
  };

  // Helper to update deeply nested fields
  const updateNested = (path, value) => {
    const keys = path.split('.');
    const newState = { ...editingBlog };
    let temp = newState;
    for (let i = 0; i < keys.length - 1; i++) {
      temp[keys[i]] = { ...temp[keys[i]] };
      temp = temp[keys[i]];
    }
    temp[keys[keys.length - 1]] = value;
    setEditingBlog(newState);
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Master Blog Editor</h1>

      {/* Table (Simplified for brevity) */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map(blog => (
              <tr key={blog._id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-medium">{blog.title}</td>
                <td className="p-3 text-center">{blog.category}</td>
                <td className="p-3 flex justify-center gap-2">
                  <button onClick={() => { setEditingBlog(JSON.parse(JSON.stringify(blog))); setIsEditModalOpen(true); }} className="text-blue-600 p-2 border rounded hover:bg-blue-50"><Pencil size={16}/></button>
                  <button onClick={() => handleDelete(blog._id)} className="text-red-600 p-2 border rounded hover:bg-red-50"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- GIANT EDIT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl h-[95vh] rounded-xl flex flex-col shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Editing: {editingBlog.title}</h2>
                <p className="text-xs text-slate-400">ID: {editingBlog.custom_id}</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="hover:bg-slate-700 p-1 rounded"><X/></button>
            </div>

            {/* Tabs Bar */}
            <div className="flex bg-slate-200 gap-1 p-1">
              {['basic', 'author', 'sections', 'faqs', 'seo'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-2 text-xs font-bold uppercase rounded ${activeTab === t ? 'bg-white shadow' : 'hover:bg-slate-300'}`}>{t}</button>
              ))}
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
              
              {/* 1. BASIC & IMAGE */}
              {activeTab === 'basic' && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 p-4 bg-slate-50 border rounded-lg flex gap-4 items-center">
                    <img src={selectedFile ? URL.createObjectURL(selectedFile) : editingBlog.image?.url} className="w-24 h-24 object-cover rounded border-2 border-white shadow" />
                    <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="text-sm border p-2 rounded bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase">Blog Title</label>
                    <input className="w-full border p-2 rounded" value={editingBlog.title} onChange={e => setEditingBlog({...editingBlog, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase">Category</label>
                    <input className="w-full border p-2 rounded" value={editingBlog.category} onChange={e => setEditingBlog({...editingBlog, category: e.target.value})} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={editingBlog.is_verified} onChange={e => setEditingBlog({...editingBlog, is_verified: e.target.checked})} />
                    <span className="text-sm font-bold">Published Status</span>
                  </div>
                </div>
              )}

              {/* 2. AUTHOR DETAILS */}
              {activeTab === 'author' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase">Author Name</label>
                    <input className="w-full border p-2 rounded" value={editingBlog.author?.name} onChange={e => updateNested('author.name', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase">Designation</label>
                    <input className="w-full border p-2 rounded" value={editingBlog.author?.designation} onChange={e => updateNested('author.designation', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold mb-1 uppercase">Author Bio</label>
                    <textarea rows="3" className="w-full border p-2 rounded text-sm" value={editingBlog.author?.description} onChange={e => updateNested('author.description', e.target.value)} />
                  </div>
                </div>
              )}

              {/* 3. SECTIONS (OVERVIEW & SECOND) */}
              {activeTab === 'sections' && (
                <div className="space-y-6">
                  {/* Overview Points */}
                  <div className="border p-4 rounded-lg bg-slate-50">
                    <h3 className="font-bold text-sm mb-3">Quick Overview Points</h3>
                    {editingBlog.overview?.points.map((p, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input className="flex-1 border p-2 rounded text-sm" value={p} onChange={e => {
                          const pts = [...editingBlog.overview.points]; pts[i] = e.target.value;
                          updateNested('overview.points', pts);
                        }} />
                        <button type="button" onClick={() => {
                           const pts = editingBlog.overview.points.filter((_, idx) => idx !== i);
                           updateNested('overview.points', pts);
                        }} className="text-red-500"><Minus/></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => updateNested('overview.points', [...editingBlog.overview.points, ""])} className="text-xs font-bold text-blue-600">+ Add Point</button>
                  </div>

                  {/* Second Section Table */}
                  <div className="border p-4 rounded-lg bg-blue-50">
                    <h3 className="font-bold text-sm mb-3">Second Section Table</h3>
                    {editingBlog.second_section?.table?.map((row, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input className="flex-1 border p-2 rounded text-xs" placeholder="Col 1" value={row.column1} onChange={e => {
                          const tbl = [...editingBlog.second_section.table]; tbl[i].column1 = e.target.value;
                          updateNested('second_section.table', tbl);
                        }} />
                        <input className="flex-1 border p-2 rounded text-xs" placeholder="Col 2" value={row.column2} onChange={e => {
                          const tbl = [...editingBlog.second_section.table]; tbl[i].column2 = e.target.value;
                          updateNested('second_section.table', tbl);
                        }} />
                        <button type="button" onClick={() => {
                          const tbl = editingBlog.second_section.table.filter((_, idx) => idx !== i);
                          updateNested('second_section.table', tbl);
                        }} className="text-red-500"><X/></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => updateNested('second_section.table', [...editingBlog.second_section.table, {column1:"", column2:"", column3:""}])} className="text-xs font-bold text-blue-600">+ Add Table Row</button>
                  </div>
                </div>
              )}

              {/* 4. FAQs */}
              {activeTab === 'faqs' && (
                <div className="space-y-4">
                  {editingBlog.faqs?.map((f, i) => (
                    <div key={i} className="border p-4 rounded-lg bg-slate-50 relative group">
                      <button type="button" onClick={() => {
                        const fqs = editingBlog.faqs.filter((_, idx) => idx !== i);
                        setEditingBlog({...editingBlog, faqs: fqs});
                      }} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                      <input className="w-full border p-2 rounded mb-2 font-bold text-sm" placeholder="Question" value={f.question} onChange={e => {
                        const fqs = [...editingBlog.faqs]; fqs[i].question = e.target.value;
                        setEditingBlog({...editingBlog, faqs: fqs});
                      }} />
                      <textarea className="w-full border p-2 rounded text-sm" placeholder="Answer" value={f.answer} onChange={e => {
                        const fqs = [...editingBlog.faqs]; fqs[i].answer = e.target.value;
                        setEditingBlog({...editingBlog, faqs: fqs});
                      }} />
                    </div>
                  ))}
                  <button type="button" onClick={() => setEditingBlog({...editingBlog, faqs: [...editingBlog.faqs, {question:"", answer:""}]})} className="bg-slate-200 w-full py-2 rounded font-bold text-sm hover:bg-slate-300">Add New FAQ</button>
                </div>
              )}

              {/* 5. SEO */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Meta Title</label>
                    <input className="w-full border p-2 rounded" value={editingBlog.seo?.meta_title} onChange={e => updateNested('seo.meta_title', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Meta Description</label>
                    <textarea className="w-full border p-2 rounded text-sm" value={editingBlog.seo?.meta_desc} onChange={e => updateNested('seo.meta_desc', e.target.value)} />
                  </div>
                </div>
              )}

            </form>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-100 border-t flex gap-4">
              <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 border rounded font-bold bg-white">Cancel</button>
              <button 
                onClick={handleUpdate} 
                disabled={isSubmitting} 
                className="flex-1 bg-green-600 text-white font-bold rounded flex justify-center items-center gap-2 hover:bg-green-700"
              >
                {isSubmitting ? <Loader2 className="animate-spin"/> : <><Save size={18}/> Update Full Blog</>}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
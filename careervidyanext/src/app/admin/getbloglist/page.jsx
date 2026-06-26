// "use client";

// import React, { useEffect, useState } from "react";
// import api from "@/utlis/api";
// import { Pencil, Trash2, X, Loader2, Save, Plus, Minus } from "lucide-react";

// export default function BlogList() {

// const [blogs,setBlogs] = useState([]);
// const [loading,setLoading] = useState(true);

// const [editingBlog,setEditingBlog] = useState(null);
// const [isEditModalOpen,setIsEditModalOpen] = useState(false);

// const [coverFile,setCoverFile] = useState(null);
// const [authorFile,setAuthorFile] = useState(null);
// const [contentFiles,setContentFiles] = useState({});

// const [isSubmitting,setIsSubmitting] = useState(false);

// /* ================= FETCH BLOGS ================= */

// const fetchBlogs = async ()=>{

// try{

// const res = await api.get("/api/v1/blog");

// setBlogs(res.data?.data || []);

// }catch(err){

// console.log(err);

// }

// setLoading(false);

// };

// useEffect(()=>{
// fetchBlogs();
// },[]);

// /* ================= DELETE ================= */

// const handleDelete = async(id)=>{

// if(!confirm("Delete Blog?")) return;

// try{

// await api.delete(`/api/v1/blog/${id}`);

// setBlogs(prev=>prev.filter(b=>b._id !== id));

// }catch(err){

// alert("Delete Failed");

// }

// };

// /* ================= UPDATE ================= */

// const handleUpdate = async(e)=>{

// e.preventDefault();

// setIsSubmitting(true);

// try{

// const formData = new FormData();

// formData.append("jsonData",JSON.stringify(editingBlog));

// if(coverFile){
// formData.append("coverImage",coverFile);
// }

// if(authorFile){
// formData.append("authorImage",authorFile);
// }

// Object.keys(contentFiles).forEach(i=>{
// formData.append("contentImages",contentFiles[i])
// })

// await api.put(`/api/v1/blog/${editingBlog._id}`,formData,{
// headers:{'Content-Type':'multipart/form-data'}
// });

// alert("Blog Updated");

// fetchBlogs();

// setIsEditModalOpen(false);

// }catch(err){

// console.log(err);
// alert("Update Failed");

// }

// setIsSubmitting(false);

// };

// /* ================= CONTENT UPDATE ================= */

// const updateContent = (index,key,value)=>{

// const updated = [...editingBlog.content];

// updated[index][key] = value;

// setEditingBlog({...editingBlog,content:updated});

// };

// /* ================= ADD CONTENT ================= */

// const addContent = ()=>{

// setEditingBlog({

// ...editingBlog,

// content:[

// ...editingBlog.content,

// {
// type:"paragraph",
// text:"",
// level:2,
// color:"#000000",
// align:"left",
// list_items:[],
// table:{headers:[],rows:[]},
// media:{caption:""}
// }

// ]

// });

// };

// /* ================= REMOVE CONTENT ================= */

// const removeContent = (index)=>{

// const updated = editingBlog.content.filter((_,i)=>i!==index);

// setEditingBlog({...editingBlog,content:updated});

// };

// /* ================= LOADING ================= */

// if(loading){
// return <div className="p-10 text-center">Loading...</div>;
// }

// /* ================= PAGE ================= */

// return(

// <div className="p-6 bg-slate-100 min-h-screen">

// <h1 className="text-2xl font-bold mb-6">Blog Manager</h1>

// <div className="bg-white rounded shadow overflow-hidden">

// <table className="w-full">

// <thead className="bg-slate-900 text-white">

// <tr>

// <th className="p-3 text-left">Title</th>
// <th className="p-3 text-center">Category</th>
// <th className="p-3 text-center">Reads</th>
// <th className="p-3 text-center">Actions</th>

// </tr>

// </thead>

// <tbody>

// {blogs.map(blog=>(

// <tr key={blog._id} className="border-b">

// <td className="p-3 font-medium">
// {blog.title}
// </td>

// <td className="p-3 text-center">
// {blog.category}
// </td>

// <td className="p-3 text-center">
// {blog.reads}
// </td>

// <td className="p-3 flex justify-center gap-2">

// <button
// onClick={()=>{

// setEditingBlog(JSON.parse(JSON.stringify(blog)));
// setIsEditModalOpen(true);

// }}
// className="p-2 border rounded text-blue-600"
// >

// <Pencil size={16}/>

// </button>

// <button
// onClick={()=>handleDelete(blog._id)}
// className="p-2 border rounded text-red-600"
// >

// <Trash2 size={16}/>

// </button>

// </td>

// </tr>

// ))}

// </tbody>

// </table>

// </div>

// {/* ================= EDIT MODAL ================= */}

// {isEditModalOpen && editingBlog &&(

// <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">

// <div className="bg-white w-full max-w-6xl h-[90vh] rounded-lg flex flex-col overflow-hidden">

// {/* HEADER */}

// <div className="flex justify-between items-center p-4 bg-slate-900 text-white">

// <h2 className="font-bold">
// Edit Blog
// </h2>

// <button onClick={()=>setIsEditModalOpen(false)}>
// <X/>
// </button>

// </div>

// <form
// onSubmit={handleUpdate}
// className="flex-1 overflow-y-auto p-6 space-y-8"
// >

// {/* BASIC */}

// <div className="grid grid-cols-2 gap-6">

// <input
// className="border p-2 rounded"
// value={editingBlog.custom_id}
// onChange={(e)=>setEditingBlog({...editingBlog,custom_id:e.target.value})}
// />

// <input
// className="border p-2 rounded"
// value={editingBlog.category}
// onChange={(e)=>setEditingBlog({...editingBlog,category:e.target.value})}
// />

// <input
// className="border p-2 rounded col-span-2"
// value={editingBlog.title}
// onChange={(e)=>setEditingBlog({...editingBlog,title:e.target.value})}
// />

// <div>

// <img
// src={editingBlog.image?.url}
// className="w-24 h-24 rounded object-cover"
// />

// <input
// type="file"
// onChange={(e)=>setCoverFile(e.target.files[0])}
// />

// </div>

// </div>

// {/* AUTHOR */}

// <div>

// <h3 className="font-bold mb-3">Author</h3>

// <div className="grid grid-cols-2 gap-4">

// <input
// className="border p-2"
// value={editingBlog.author?.name || ""}
// onChange={(e)=>setEditingBlog({
// ...editingBlog,
// author:{...editingBlog.author,name:e.target.value}
// })}
// />

// <input
// className="border p-2"
// value={editingBlog.author?.designation || ""}
// onChange={(e)=>setEditingBlog({
// ...editingBlog,
// author:{...editingBlog.author,designation:e.target.value}
// })}
// />

// <input
// className="border p-2"
// value={editingBlog.author?.specialization || ""}
// onChange={(e)=>setEditingBlog({
// ...editingBlog,
// author:{...editingBlog.author,specialization:e.target.value}
// })}
// />

// <input
// className="border p-2"
// value={editingBlog.author?.experience || ""}
// onChange={(e)=>setEditingBlog({
// ...editingBlog,
// author:{...editingBlog.author,experience:e.target.value}
// })}
// />

// <textarea
// className="border p-2 col-span-2"
// value={editingBlog.author?.description || ""}
// onChange={(e)=>setEditingBlog({
// ...editingBlog,
// author:{...editingBlog.author,description:e.target.value}
// })}
// />

// <input
// type="file"
// onChange={(e)=>setAuthorFile(e.target.files[0])}
// />

// </div>

// </div>

// {/* CONTENT */}

// <div>

// <h3 className="font-bold mb-4">Content Blocks</h3>

// {editingBlog.content?.map((block,i)=>(

// <div key={i} className="border p-4 rounded mb-4">

// <select
// value={block.type}
// onChange={(e)=>updateContent(i,"type",e.target.value)}
// className="border p-2 mb-2"
// >

// <option value="heading">Heading</option>
// <option value="paragraph">Paragraph</option>
// <option value="image">Image</option>
// <option value="quote">Quote</option>
// <option value="code">Code</option>

// </select>

// {/* TEXT BLOCK */}

// {["heading","paragraph","quote","code"].includes(block.type) &&(

// <textarea
// className="border p-2 w-full"
// value={block.text || ""}
// onChange={(e)=>updateContent(i,"text",e.target.value)}
// />

// )}

// {/* IMAGE BLOCK */}

// {block.type==="image" &&(

// <div className="space-y-2">

// <input
// type="file"
// onChange={(e)=>setContentFiles({
// ...contentFiles,
// [i]:e.target.files[0]
// })}
// />

// <input
// className="border p-2 w-full"
// placeholder="Caption"
// value={block.media?.caption || ""}
// onChange={(e)=>{

// const updated=[...editingBlog.content]

// updated[i].media={
// ...updated[i].media,
// caption:e.target.value
// }

// setEditingBlog({
// ...editingBlog,
// content:updated
// })

// }}
// />

// </div>

// )}

// <button
// type="button"
// onClick={()=>removeContent(i)}
// className="text-red-500 mt-2"
// >
// <Minus/>
// </button>

// </div>

// ))}

// <button
// type="button"
// onClick={addContent}
// className="flex gap-2 text-blue-600"
// >

// <Plus/> Add Block

// </button>

// </div>

// {/* FAQ */}

// <div>

// <h3 className="font-bold mb-4">FAQs</h3>

// {editingBlog.faqs?.map((f,i)=>(

// <div key={i} className="border p-4 mb-3">

// <input
// className="w-full border p-2 mb-2"
// value={f.question}
// onChange={(e)=>{

// const faqs=[...editingBlog.faqs];
// faqs[i].question=e.target.value;

// setEditingBlog({...editingBlog,faqs});

// }}
// />

// <textarea
// className="w-full border p-2"
// value={f.answer}
// onChange={(e)=>{

// const faqs=[...editingBlog.faqs];
// faqs[i].answer=e.target.value;

// setEditingBlog({...editingBlog,faqs});

// }}
// />

// </div>

// ))}

// </div>

// {/* SEO */}

// <div>

// <h3 className="font-bold mb-3">SEO</h3>

// <input
// className="border p-2 w-full mb-2"
// value={editingBlog.seo?.meta_title || ""}
// onChange={(e)=>setEditingBlog({
// ...editingBlog,
// seo:{...editingBlog.seo,meta_title:e.target.value}
// })}
// />

// <textarea
// className="border p-2 w-full"
// value={editingBlog.seo?.meta_desc || ""}
// onChange={(e)=>setEditingBlog({
// ...editingBlog,
// seo:{...editingBlog.seo,meta_desc:e.target.value}
// })}
// />

// </div>

// </form>

// <div className="p-4 border-t flex gap-4">

// <button
// onClick={()=>setIsEditModalOpen(false)}
// className="border px-6 py-2 rounded"
// >
// Cancel
// </button>

// <button
// onClick={handleUpdate}
// disabled={isSubmitting}
// className="flex-1 bg-green-600 text-white rounded flex justify-center items-center gap-2"
// >

// {isSubmitting ? (
// <Loader2 className="animate-spin"/>
// ) : (
// <>
// <Save size={18}/>
// Update Blog
// </>
// )}

// </button>

// </div>

// </div>

// </div>

// )}

// </div>

// );

// }

"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api";
import { Pencil, Trash2, X, Loader2, Save, Plus, Minus } from "lucide-react";

/* ─── default empty content block ─── */
const emptyBlock = () => ({
  type: "paragraph",
  text: "",
  level: 2,
  color: "#000000",
  align: "left",
  list_items: [],
  list_style: "bullet",
  table: { headers: [], rows: [] },
  media: { caption: "", alt: "", align: "center" },
});

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingBlog, setEditingBlog] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [coverFile, setCoverFile] = useState(null);
  const [authorFile, setAuthorFile] = useState(null);
  const [contentFiles, setContentFiles] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ─── FETCH ─── */
  const fetchBlogs = async () => {
    try {
      const res = await api.get("/api/v1/blog");
      setBlogs(res.data?.data || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* ─── DELETE ─── */
  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await api.delete(`/api/v1/blog/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  /* ─── UPDATE ─── */
  const handleUpdate = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("jsonData", JSON.stringify(editingBlog));
      if (coverFile) formData.append("coverImage", coverFile);
      if (authorFile) formData.append("authorImage", authorFile);
      Object.keys(contentFiles).forEach((i) =>
        formData.append("contentImages", contentFiles[i])
      );
      await api.put(`/api/v1/blog/${editingBlog._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Blog updated");
      fetchBlogs();
      setIsEditModalOpen(false);
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
    setIsSubmitting(false);
  };

  /* ─── OPEN EDIT MODAL ─── */
  const openEdit = (blog) => {
    const clone = JSON.parse(JSON.stringify(blog));
    // ensure arrays exist
    clone.content = clone.content || [];
    clone.faqs = clone.faqs || [];
    clone.seo = clone.seo || {};
    clone.author = clone.author || {};
    clone.image = clone.image || {};
    setCoverFile(null);
    setAuthorFile(null);
    setContentFiles({});
    setEditingBlog(clone);
    setIsEditModalOpen(true);
  };

  /* ─── helpers to patch nested state ─── */
  const patch = (obj) => setEditingBlog((prev) => ({ ...prev, ...obj }));
  const patchAuthor = (obj) =>
    setEditingBlog((prev) => ({ ...prev, author: { ...prev.author, ...obj } }));
  const patchSeo = (obj) =>
    setEditingBlog((prev) => ({ ...prev, seo: { ...prev.seo, ...obj } }));

  /* ─── CONTENT helpers ─── */
  const updateBlock = (i, key, value) => {
    const content = [...editingBlog.content];
    content[i] = { ...content[i], [key]: value };
    patch({ content });
  };

  const updateBlockMedia = (i, key, value) => {
    const content = [...editingBlog.content];
    content[i] = { ...content[i], media: { ...content[i].media, [key]: value } };
    patch({ content });
  };

  const addBlock = () => patch({ content: [...editingBlog.content, emptyBlock()] });

  const removeBlock = (i) =>
    patch({ content: editingBlog.content.filter((_, idx) => idx !== i) });

  /* ─── LIST ITEM helpers ─── */
  const addListItem = (i) => {
    const content = [...editingBlog.content];
    content[i].list_items = [...(content[i].list_items || []), ""];
    patch({ content });
  };

  const updateListItem = (blockIdx, itemIdx, value) => {
    const content = [...editingBlog.content];
    const items = [...(content[blockIdx].list_items || [])];
    items[itemIdx] = value;
    content[blockIdx] = { ...content[blockIdx], list_items: items };
    patch({ content });
  };

  const removeListItem = (blockIdx, itemIdx) => {
    const content = [...editingBlog.content];
    content[blockIdx].list_items = content[blockIdx].list_items.filter(
      (_, idx) => idx !== itemIdx
    );
    patch({ content });
  };

  /* ─── TABLE helpers ─── */
  const updateTableHeaders = (i, value) => {
    const content = [...editingBlog.content];
    content[i].table = {
      ...content[i].table,
      headers: value.split(",").map((h) => h.trim()),
    };
    patch({ content });
  };

  const updateTableRows = (i, value) => {
    const content = [...editingBlog.content];
    const rows = value.split("\n").map((row) =>
      row.split(",").map((cell) => cell.trim())
    );
    content[i].table = { ...content[i].table, rows };
    patch({ content });
  };

  /* ─── FAQ helpers ─── */
  const addFaq = () =>
    patch({ faqs: [...editingBlog.faqs, { question: "", answer: "" }] });

  const updateFaq = (i, key, value) => {
    const faqs = [...editingBlog.faqs];
    faqs[i] = { ...faqs[i], [key]: value };
    patch({ faqs });
  };

  const removeFaq = (i) =>
    patch({ faqs: editingBlog.faqs.filter((_, idx) => idx !== i) });

  /* ─── LOADING ─── */
  if (loading) return <div className="p-10 text-center">Loading...</div>;

  /* ══════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════ */
  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Blog Manager</h1>

      {/* ── TABLE ── */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-center">Category</th>
              <th className="p-3 text-center">Reads</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-medium">{blog.title}</td>
                <td className="p-3 text-center">{blog.category}</td>
                <td className="p-3 text-center">{blog.reads}</td>
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => openEdit(blog)}
                    className="p-2 border rounded text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="p-2 border rounded text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ══════════════════════════════════════════════
          EDIT MODAL
      ══════════════════════════════════════════════ */}
      {isEditModalOpen && editingBlog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl h-[92vh] rounded-lg flex flex-col overflow-hidden shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex justify-between items-center px-5 py-4 bg-slate-900 text-white">
              <h2 className="font-semibold text-lg">Edit Blog</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="hover:bg-white/10 p-1 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="flex-1 overflow-y-auto p-6 space-y-10">

              {/* ── 1. BASIC INFO ── */}
              <section>
                <SectionTitle>Basic Info</SectionTitle>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Custom ID / Slug">
                    <input
                      className={input}
                      value={editingBlog.custom_id || ""}
                      onChange={(e) => patch({ custom_id: e.target.value })}
                      placeholder="url-friendly-slug"
                    />
                  </Field>

                  <Field label="Category">
                    <input
                      className={input}
                      value={editingBlog.category || ""}
                      onChange={(e) => patch({ category: e.target.value })}
                      placeholder="e.g. Cardiology"
                    />
                  </Field>

                  <Field label="Title" className="col-span-2">
                    <input
                      className={input}
                      value={editingBlog.title || ""}
                      onChange={(e) => patch({ title: e.target.value })}
                      placeholder="Blog title"
                    />
                  </Field>

                  <Field label="Cover Image">
                    {editingBlog.image?.url && (
                      <img
                        src={editingBlog.image.url}
                        className="w-20 h-20 rounded object-cover border mb-2"
                        alt="cover"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files[0])}
                    />
                    <p className="text-xs text-slate-400 mt-1">Upload new to replace existing</p>
                  </Field>
                </div>
              </section>

              {/* ── 2. AUTHOR ── */}
              <section>
                <SectionTitle>Author</SectionTitle>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Name">
                    <input
                      className={input}
                      value={editingBlog.author?.name || ""}
                      onChange={(e) => patchAuthor({ name: e.target.value })}
                      placeholder="Author name"
                    />
                  </Field>

                  <Field label="Designation">
                    <input
                      className={input}
                      value={editingBlog.author?.designation || ""}
                      onChange={(e) => patchAuthor({ designation: e.target.value })}
                      placeholder="e.g. Senior Cardiologist"
                    />
                  </Field>

                  <Field label="Specialization">
                    <input
                      className={input}
                      value={editingBlog.author?.specialization || ""}
                      onChange={(e) => patchAuthor({ specialization: e.target.value })}
                      placeholder="Area of expertise"
                    />
                  </Field>

                  <Field label="Experience">
                    <input
                      className={input}
                      value={editingBlog.author?.experience || ""}
                      onChange={(e) => patchAuthor({ experience: e.target.value })}
                      placeholder="e.g. 10 years"
                    />
                  </Field>

                  <Field label="Bio / Description" className="col-span-2">
                    <textarea
                      className={`${input} resize-y min-h-[80px]`}
                      value={editingBlog.author?.description || ""}
                      onChange={(e) => patchAuthor({ description: e.target.value })}
                      placeholder="Short author bio"
                    />
                  </Field>

                  <Field label="Author Photo">
                    {editingBlog.author?.image?.url && (
                      <img
                        src={editingBlog.author.image.url}
                        className="w-16 h-16 rounded-full object-cover border mb-2"
                        alt="author"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAuthorFile(e.target.files[0])}
                    />
                  </Field>
                </div>
              </section>

              {/* ── 3. CONTENT BLOCKS ── */}
              <section>
                <SectionTitle>Content Blocks</SectionTitle>
                <div className="space-y-4">
                  {editingBlog.content?.map((block, i) => (
                    <div
                      key={i}
                      className="border border-slate-200 rounded-lg p-4 bg-slate-50"
                    >
                      {/* Block header row */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          Block {i + 1}
                        </span>

                        <div>
                          <label className={label}>Type</label>
                          <select
                            className={`${input} w-auto`}
                            value={block.type}
                            onChange={(e) => updateBlock(i, "type", e.target.value)}
                          >
                            <option value="heading">Heading</option>
                            <option value="paragraph">Paragraph</option>
                            <option value="image">Image</option>
                            <option value="quote">Quote</option>
                            <option value="code">Code</option>
                            <option value="list">List / Bullet Points</option>
                            <option value="table">Table</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeBlock(i)}
                          className="ml-auto flex items-center gap-1 text-sm text-red-600 border border-red-200 rounded px-2 py-1 hover:bg-red-50"
                        >
                          <Minus size={14} /> Remove
                        </button>
                      </div>

                      {/* ── HEADING ── */}
                      {block.type === "heading" && (
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Heading Text" className="col-span-2">
                            <input
                              className={input}
                              value={block.text || ""}
                              onChange={(e) => updateBlock(i, "text", e.target.value)}
                              placeholder="Heading text"
                            />
                          </Field>
                          <Field label="Heading Level (H1–H6)">
                            <select
                              className={input}
                              value={block.level || 2}
                              onChange={(e) =>
                                updateBlock(i, "level", Number(e.target.value))
                              }
                            >
                              {[1, 2, 3, 4, 5, 6].map((l) => (
                                <option key={l} value={l}>
                                  H{l}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Alignment">
                            <select
                              className={input}
                              value={block.align || "left"}
                              onChange={(e) => updateBlock(i, "align", e.target.value)}
                            >
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                            </select>
                          </Field>
                          <Field label="Text Color">
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={block.color || "#000000"}
                                onChange={(e) => updateBlock(i, "color", e.target.value)}
                                className="w-10 h-9 rounded border cursor-pointer p-0.5"
                              />
                              <input
                                className={`${input} w-28`}
                                value={block.color || "#000000"}
                                onChange={(e) => updateBlock(i, "color", e.target.value)}
                                placeholder="#000000"
                              />
                            </div>
                          </Field>
                        </div>
                      )}

                      {/* ── PARAGRAPH ── */}
                      {block.type === "paragraph" && (
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Text" className="col-span-2">
                            <textarea
                              className={`${input} resize-y min-h-[100px]`}
                              value={block.text || ""}
                              onChange={(e) => updateBlock(i, "text", e.target.value)}
                              placeholder="Paragraph content"
                            />
                          </Field>
                          <Field label="Alignment">
                            <select
                              className={input}
                              value={block.align || "left"}
                              onChange={(e) => updateBlock(i, "align", e.target.value)}
                            >
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                              <option value="justify">Justify</option>
                            </select>
                          </Field>
                          <Field label="Text Color">
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={block.color || "#000000"}
                                onChange={(e) => updateBlock(i, "color", e.target.value)}
                                className="w-10 h-9 rounded border cursor-pointer p-0.5"
                              />
                              <input
                                className={`${input} w-28`}
                                value={block.color || "#000000"}
                                onChange={(e) => updateBlock(i, "color", e.target.value)}
                              />
                            </div>
                          </Field>
                        </div>
                      )}

                      {/* ── QUOTE ── */}
                      {block.type === "quote" && (
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Quote Text" className="col-span-2">
                            <textarea
                              className={`${input} resize-y min-h-[80px]`}
                              value={block.text || ""}
                              onChange={(e) => updateBlock(i, "text", e.target.value)}
                              placeholder="Quote content"
                            />
                          </Field>
                          <Field label="Text Color">
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={block.color || "#000000"}
                                onChange={(e) => updateBlock(i, "color", e.target.value)}
                                className="w-10 h-9 rounded border cursor-pointer p-0.5"
                              />
                              <input
                                className={`${input} w-28`}
                                value={block.color || "#000000"}
                                onChange={(e) => updateBlock(i, "color", e.target.value)}
                              />
                            </div>
                          </Field>
                        </div>
                      )}

                      {/* ── CODE ── */}
                      {block.type === "code" && (
                        <Field label="Code">
                          <textarea
                            className={`${input} resize-y min-h-[120px] font-mono text-sm`}
                            value={block.text || ""}
                            onChange={(e) => updateBlock(i, "text", e.target.value)}
                            placeholder="// code here"
                          />
                        </Field>
                      )}

                      {/* ── LIST / BULLET POINTS ── */}
                      {block.type === "list" && (
                        <div className="space-y-3">
                          <Field label="List Style">
                            <select
                              className={`${input} w-auto`}
                              value={block.list_style || "bullet"}
                              onChange={(e) =>
                                updateBlock(i, "list_style", e.target.value)
                              }
                            >
                              <option value="bullet">Bullet (unordered)</option>
                              <option value="numbered">Numbered (ordered)</option>
                            </select>
                          </Field>

                          <Field label="List Items">
                            <div className="space-y-2">
                              {(block.list_items || []).map((item, j) => (
                                <div key={j} className="flex gap-2 items-center">
                                  <span className="text-slate-400 text-sm w-5 text-right shrink-0">
                                    {block.list_style === "numbered" ? `${j + 1}.` : "•"}
                                  </span>
                                  <input
                                    className={`${input} flex-1`}
                                    value={item}
                                    onChange={(e) =>
                                      updateListItem(i, j, e.target.value)
                                    }
                                    placeholder={`Item ${j + 1}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeListItem(i, j)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    <Minus size={14} />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addListItem(i)}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-1"
                              >
                                <Plus size={14} /> Add item
                              </button>
                            </div>
                          </Field>
                        </div>
                      )}

                      {/* ── IMAGE ── */}
                      {block.type === "image" && (
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Image">
                            {block.media?.url && (
                              <img
                                src={block.media.url}
                                className="w-24 h-24 object-cover rounded border mb-2"
                                alt="block"
                              />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setContentFiles({
                                  ...contentFiles,
                                  [i]: e.target.files[0],
                                })
                              }
                            />
                          </Field>

                          <Field label="Caption">
                            <textarea
                              className={`${input} resize-y min-h-[72px]`}
                              value={block.media?.caption || ""}
                              onChange={(e) =>
                                updateBlockMedia(i, "caption", e.target.value)
                              }
                              placeholder="Image caption"
                            />
                          </Field>

                          <Field label="Alt Text">
                            <input
                              className={input}
                              value={block.media?.alt || ""}
                              onChange={(e) =>
                                updateBlockMedia(i, "alt", e.target.value)
                              }
                              placeholder="Describe the image"
                            />
                          </Field>

                          <Field label="Alignment">
                            <select
                              className={input}
                              value={block.media?.align || "center"}
                              onChange={(e) =>
                                updateBlockMedia(i, "align", e.target.value)
                              }
                            >
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                            </select>
                          </Field>
                        </div>
                      )}

                      {/* ── TABLE ── */}
                      {block.type === "table" && (
                        <div className="space-y-3">
                          <Field label="Headers (comma-separated, e.g. Name, Age, City)">
                            <input
                              className={input}
                              value={(block.table?.headers || []).join(", ")}
                              onChange={(e) => updateTableHeaders(i, e.target.value)}
                              placeholder="Column 1, Column 2, Column 3"
                            />
                          </Field>
                          <Field label="Rows — one row per line, values separated by commas">
                            <textarea
                              className={`${input} font-mono text-sm resize-y min-h-[100px]`}
                              value={(block.table?.rows || [])
                                .map((row) => row.join(", "))
                                .join("\n")}
                              onChange={(e) => updateTableRows(i, e.target.value)}
                              placeholder={"Row 1 col 1, Row 1 col 2\nRow 2 col 1, Row 2 col 2"}
                            />
                          </Field>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add Block */}
                  <button
                    type="button"
                    onClick={addBlock}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg py-3 text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition"
                  >
                    <Plus size={16} /> Add content block
                  </button>
                </div>
              </section>

              {/* ── 4. FAQs ── */}
              <section>
                <SectionTitle>FAQs</SectionTitle>
                <div className="space-y-4">
                  {editingBlog.faqs?.map((faq, i) => (
                    <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                          FAQ {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFaq(i)}
                          className="flex items-center gap-1 text-sm text-red-600 border border-red-200 rounded px-2 py-1 hover:bg-red-50"
                        >
                          <Minus size={14} /> Remove
                        </button>
                      </div>

                      <Field label="Question" className="mb-3">
                        <input
                          className={input}
                          value={faq.question || ""}
                          onChange={(e) => updateFaq(i, "question", e.target.value)}
                          placeholder="Enter question"
                        />
                      </Field>

                      <Field label="Answer">
                        <textarea
                          className={`${input} resize-y min-h-[80px]`}
                          value={faq.answer || ""}
                          onChange={(e) => updateFaq(i, "answer", e.target.value)}
                          placeholder="Enter answer"
                        />
                      </Field>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addFaq}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg py-3 text-sm text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition"
                  >
                    <Plus size={16} /> Add FAQ
                  </button>
                </div>
              </section>

              {/* ── 5. SEO ── */}
              <section>
                <SectionTitle>SEO</SectionTitle>
                <div className="space-y-4">
                  <Field label="Meta Title">
                    <input
                      className={input}
                      value={editingBlog.seo?.meta_title || ""}
                      onChange={(e) => patchSeo({ meta_title: e.target.value })}
                      placeholder="SEO page title (50–60 chars recommended)"
                    />
                  </Field>

                  <Field label="Meta Description">
                    <textarea
                      className={`${input} resize-y min-h-[80px]`}
                      value={editingBlog.seo?.meta_desc || ""}
                      onChange={(e) => patchSeo({ meta_desc: e.target.value })}
                      placeholder="SEO description (150–160 chars recommended)"
                    />
                  </Field>

                  <Field label="Meta Keywords (comma-separated)">
                    <input
                      className={input}
                      value={editingBlog.seo?.meta_keywords || ""}
                      onChange={(e) => patchSeo({ meta_keywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </Field>

                  <Field label="Canonical URL">
                    <input
                      className={input}
                      value={editingBlog.seo?.canonical || ""}
                      onChange={(e) => patchSeo({ canonical: e.target.value })}
                      placeholder="https://yourdomain.com/blog/slug"
                    />
                  </Field>
                </div>
              </section>
            </div>

            {/* MODAL FOOTER */}
            <div className="px-5 py-4 border-t flex gap-3 bg-white">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="border border-slate-300 px-6 py-2 rounded hover:bg-slate-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded py-2 flex justify-center items-center gap-2 text-sm font-medium"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    Update Blog
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SMALL HELPER COMPONENTS
══════════════════════════════════════════════ */

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">
      {children}
    </h3>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-medium text-slate-500">{label}</label>
      {children}
    </div>
  );
}

/* shared Tailwind class strings */
const input =
  "border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white w-full";
const label = "block text-xs font-medium text-slate-500 mb-1";


// "use client";

// import React, { useState } from "react";
// import api from "@/utlis/api";
// import { PlusCircle, Trash2 } from "lucide-react";

// export default function BlogForm() {

//   const [loading, setLoading] = useState(false);
//   const [files, setFiles] = useState({
//     coverImage: null,
//     authorImage: null,
//     contentMedia: {}
//   });

//   const [formData, setFormData] = useState({
//     custom_id: "",
//     title: "",
//     category: "",
//     author: {
//       name: "",
//       experience: "",
//       specialization: "",
//       designation: "",
//       description: ""
//     },
//     content: [
//       {
//         type: "paragraph",
//         text: "",
//         level: 2,
//         color: "#000000",
//         align: "left",
//         list_items: [],
//         table: { headers: [], rows: [] },
//         media: { caption: "" }
//       }
//     ],
//     faqs: [{ question: "", answer: "" }],
//     seo: {
//       meta_title: "",
//       meta_desc: "",
//       keywords: ""
//     }
//   });

//   /* ================= HANDLE CHANGE ================= */
//   const handleChange = (e, path) => {
//     const value = e.target.value;
//     setFormData(prev => {
//       const updated = structuredClone(prev);
//       let ref = updated;
//       path.forEach((key, i) => {
//         if (i === path.length - 1) {
//           ref[key] = value;
//         } else {
//           ref = ref[key];
//         }
//       });
//       return updated;
//     });
//   };

//   /* ================= ADD ITEM ================= */
//   const addItem = (path, item) => {
//     setFormData(prev => {
//       const updated = structuredClone(prev);
//       let ref = updated;
//       path.forEach(k => (ref = ref[k]));
//       ref.push(item);
//       return updated;
//     });
//   };

//   /* ================= REMOVE ITEM ================= */
//   const removeItem = (path, index) => {
//     setFormData(prev => {
//       const updated = structuredClone(prev);
//       let ref = updated;
//       path.forEach(k => (ref = ref[k]));
//       ref.splice(index, 1);
//       return updated;
//     });
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true);

//     const data = new FormData();

//     const payload = {
//       ...formData,
//       seo: {
//         ...formData.seo,
//         keywords: formData.seo.keywords.split(",").map(k => k.trim())
//       }
//     };

//     data.append("jsonData", JSON.stringify(payload));

//     if (files.coverImage) data.append("coverImage", files.coverImage);
//     if (files.authorImage) data.append("authorImage", files.authorImage);

//     /* 🔥 ONLY FIX (IMPORTANT) */
//     formData.content.forEach((block, index) => {
//       if (block.type === "image" && files.contentMedia[index]) {
//         data.append("contentImages", files.contentMedia[index]);
//       }
//     });

//     try {
//       await api.post("/api/v1/blog", data, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       alert("Blog Created Successfully");
//     } catch (err) {
//       console.log(err);
//       alert("Upload Failed");
//     }

//     setLoading(false);
//   };

//   const input = "border p-2 rounded w-full";

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Blog Editor</h1>
//       <form onSubmit={handleSubmit} className="space-y-8">

//         {/* BASIC */}
//         <div className="space-y-3">
//           <input className={input} placeholder="Custom ID" onChange={e => handleChange(e, ["custom_id"])} />
//           <input className={input} placeholder="Title" onChange={e => handleChange(e, ["title"])} />
//           <input className={input} placeholder="Category" onChange={e => handleChange(e, ["category"])} />
//           <input type="file" onChange={e => setFiles({ ...files, coverImage: e.target.files[0] })} />
//         </div>

//         {/* AUTHOR */}
//         <div className="space-y-3">
//           <h2 className="font-bold">Author</h2>
//           <input className={input} placeholder="Name" onChange={e => handleChange(e, ["author", "name"])} />
//           <input className={input} placeholder="Experience" onChange={e => handleChange(e, ["author", "experience"])} />
//           <input className={input} placeholder="Specialization" onChange={e => handleChange(e, ["author", "specialization"])} />
//           <input className={input} placeholder="Designation" onChange={e => handleChange(e, ["author", "designation"])} />
//           <textarea className={input} placeholder="Description" onChange={e => handleChange(e, ["author", "description"])} />
//           <input type="file" onChange={e => setFiles({ ...files, authorImage: e.target.files[0] })} />
//         </div>

//         {/* CONTENT */}
//         <div className="space-y-6">
//           <h2 className="font-bold text-lg">Content Blocks</h2>

//           {formData.content.map((block, i) => (
//             <div key={i} className="border p-4 rounded space-y-3 relative">

//               <button type="button" onClick={() => removeItem(["content"], i)} className="absolute right-2 top-2 text-red-500">
//                 <Trash2 size={18} />
//               </button>

//               <select value={block.type} onChange={e => handleChange(e, ["content", i, "type"])} className={input}>
//                 <option value="heading">Heading</option>
//                 <option value="paragraph">Paragraph</option>
//                 <option value="list">Bullet List</option>
//                 <option value="number_list">Numbered List</option>
//                 <option value="image">Image</option>
//                 <option value="video">Video</option>
//                 <option value="table">Table</option>
//                 <option value="quote">Quote</option>
//                 <option value="code">Code</option>
//               </select>

//               {/* TEXT BLOCK */}
//               {["heading", "paragraph", "quote", "code"].includes(block.type) && (
//                 <>
//                   <textarea className={input} placeholder="Text" onChange={e => handleChange(e, ["content", i, "text"])} />
//                   <div className="flex items-center gap-2">
//                     <label className="text-sm font-medium">Color:</label>
//                     <input type="color" value={block.color} onChange={e => handleChange(e, ["content", i, "color"])} />
//                   </div>
//                 </>
//               )}

//               {/* LIST BLOCK */}
//               {["list", "number_list"].includes(block.type) && (
//                 <div className="space-y-2">
//                   {block.list_items.map((item, idx) => (
//                     <div key={idx} className="flex gap-2 items-center">
//                       <input className={input} placeholder="Item" value={item} onChange={e => handleChange(e, ["content", i, "list_items", idx])} />
//                       <button type="button" onClick={() => removeItem(["content", i, "list_items"], idx)} className="text-red-500">Delete</button>
//                     </div>
//                   ))}
//                   <button type="button" onClick={() => addItem(["content", i, "list_items"], "")} className="text-blue-500 flex gap-2 items-center">
//                     <PlusCircle size={16} /> Add Item
//                   </button>
//                 </div>
//               )}

//               {/* IMAGE BLOCK */}
//               {block.type === "image" && (
//                 <div className="space-y-2">
//                   <input type="file" onChange={e => setFiles({
//                     ...files,
//                     contentMedia: { ...files.contentMedia, [i]: e.target.files[0] }
//                   })} />
//                   <input className={input} placeholder="Caption" onChange={e => handleChange(e, ["content", i, "media", "caption"])} />
//                 </div>
//               )}

//               {/* TABLE BLOCK */}
//               {block.type === "table" && (
//                 <div className="space-y-2 border p-2 rounded">
//                   <div className="flex gap-2">
//                     {block.table.headers.map((h, hi) => (
//                       <input key={hi} className="border p-1 rounded flex-1" placeholder={`Header ${hi+1}`} value={h} onChange={e => handleChange(e, ["content", i, "table", "headers", hi])} />
//                     ))}
//                     <button type="button" onClick={() => addItem(["content", i, "table", "headers"], "")} className="text-blue-500">+ Header</button>
//                   </div>

//                   {block.table.rows.map((row, ri) => (
//                     <div key={ri} className="flex gap-2 items-center">
//                       {row.map((col, ci) => (
//                         <input key={ci} className="border p-1 rounded flex-1" placeholder={`Col ${ci+1}`} value={col} onChange={e => handleChange(e, ["content", i, "table", "rows", ri, ci])} />
//                       ))}
//                       <button type="button" onClick={() => removeItem(["content", i, "table", "rows"], ri)} className="text-red-500">Delete Row</button>
//                     </div>
//                   ))}
//                   <button type="button" onClick={() => addItem(["content", i, "table", "rows"], block.table.headers.map(() => ""))} className="text-blue-500">+ Row</button>
//                 </div>
//               )}

//             </div>
//           ))}

//           <button type="button" onClick={() => addItem(["content"], {
//             type: "paragraph",
//             text: "",
//             level: 2,
//             color: "#000000",
//             align: "left",
//             list_items: [],
//             table: { headers: [], rows: [] },
//             media: { caption: "" }
//           })} className="flex gap-2 text-blue-600">
//             <PlusCircle size={18} /> Add Block
//           </button>
//         </div>

//         {/* FAQ */}
//         <div className="space-y-3">
//           <h2 className="font-bold">FAQs</h2>
//           {formData.faqs.map((faq, i) => (
//             <div key={i} className="space-y-2">
//               <input className={input} placeholder="Question" onChange={e => handleChange(e, ["faqs", i, "question"])} />
//               <textarea className={input} placeholder="Answer" onChange={e => handleChange(e, ["faqs", i, "answer"])} />
//             </div>
//           ))}
//           <button type="button" onClick={() => addItem(["faqs"], { question: "", answer: "" })} className="text-blue-500">Add FAQ</button>
//         </div>

//         {/* SEO */}
//         <div className="space-y-3">
//           <h2 className="font-bold">SEO</h2>
//           <input className={input} placeholder="Meta Title" onChange={e => handleChange(e, ["seo", "meta_title"])} />
//           <textarea className={input} placeholder="Meta Description" onChange={e => handleChange(e, ["seo", "meta_desc"])} />
//           <input className={input} placeholder="Keywords comma separated" onChange={e => handleChange(e, ["seo", "keywords"])} />
//         </div>

//         <button disabled={loading} className="bg-black text-white px-6 py-3 rounded w-full">
//           {loading ? "Publishing..." : "Publish Blog"}
//         </button>

//       </form>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import api from "@/utlis/api";
import { PlusCircle, Trash2, Upload } from "lucide-react";

const emptyBlock = () => ({
  type: "paragraph",
  text: "",
  level: 2,
  color: "#000000",
  align: "left",
  list_items: [],
  table: { headers: [], rows: [] },
  media: { caption: "" },
});

export default function BlogForm() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState({
    coverImage: null,
    authorImage: null,
    contentMedia: {},
  });

  const [formData, setFormData] = useState({
    custom_id: "",
    title: "",
    category: "",
    author: {
      name: "",
      experience: "",
      specialization: "",
      designation: "",
      description: "",
    },
    content: [emptyBlock()],
    faqs: [{ question: "", answer: "" }],
    seo: {
      meta_title: "",
      meta_desc: "",
      keywords: "",
    },
  });

  /* ─── deep path setter ─── */
  const handleChange = (e, path) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = structuredClone(prev);
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
      const updated = structuredClone(prev);
      let ref = updated;
      path.forEach((k) => (ref = ref[k]));
      ref.push(item);
      return updated;
    });
  };

  const removeItem = (path, index) => {
    setFormData((prev) => {
      const updated = structuredClone(prev);
      let ref = updated;
      path.forEach((k) => (ref = ref[k]));
      ref.splice(index, 1);
      return updated;
    });
  };

  /* ─── BULK IMAGE UPLOAD ─── */
  /* 
    Jab user multiple images select karta hai, automatically
    woh saari images un content blocks se map ho jaati hain
    jo type="image" hain — pehle image block ko pehli file,
    doosre ko doosri file, etc.
  */
  const handleBulkImageUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    // image type ke blocks ke indexes dhundho
    const imageBlockIndexes = formData.content
      .map((block, i) => (block.type === "image" ? i : null))
      .filter((i) => i !== null);

    // agar image blocks kam hain toh naye add karo
    const blocksNeeded = selectedFiles.length - imageBlockIndexes.length;
    let updatedContent = structuredClone(formData.content);

    if (blocksNeeded > 0) {
      for (let n = 0; n < blocksNeeded; n++) {
        updatedContent.push({ ...emptyBlock(), type: "image" });
        imageBlockIndexes.push(updatedContent.length - 1);
      }
      setFormData((prev) => ({ ...prev, content: updatedContent }));
    }

    // files ko matching blocks se map karo
    const newContentMedia = { ...files.contentMedia };
    selectedFiles.forEach((file, idx) => {
      const blockIndex = imageBlockIndexes[idx];
      if (blockIndex !== undefined) newContentMedia[blockIndex] = file;
    });

    setFiles((prev) => ({ ...prev, contentMedia: newContentMedia }));
  };

  /* ─── SUBMIT ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    const payload = {
      ...formData,
      seo: {
        ...formData.seo,
        keywords: formData.seo.keywords.split(",").map((k) => k.trim()),
      },
    };
    data.append("jsonData", JSON.stringify(payload));

    if (files.coverImage) data.append("coverImage", files.coverImage);
    if (files.authorImage) data.append("authorImage", files.authorImage);

    formData.content.forEach((block, index) => {
      if (block.type === "image" && files.contentMedia[index]) {
        data.append("contentImages", files.contentMedia[index]);
      }
    });

    try {
      await api.post("/api/v1/blog", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Blog Created Successfully");
    } catch (err) {
      console.log(err);
      alert("Upload Failed");
    }

    setLoading(false);
  };

  const inp =
    "border border-slate-300 p-2 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Blog Editor</h1>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* ── BASIC INFO ── */}
        <Section title="Basic Info">
          <Field label="Custom ID / Slug">
            <input className={inp} placeholder="url-friendly-id" onChange={(e) => handleChange(e, ["custom_id"])} />
          </Field>
          <Field label="Title">
            <input className={inp} placeholder="Blog title" onChange={(e) => handleChange(e, ["title"])} />
          </Field>
          <Field label="Category">
            <input className={inp} placeholder="e.g. Orthopaedics" onChange={(e) => handleChange(e, ["category"])} />
          </Field>
          <Field label="Cover Image">
            <input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, coverImage: e.target.files[0] })} />
          </Field>
        </Section>

        {/* ── AUTHOR ── */}
        <Section title="Author">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name">
              <input className={inp} placeholder="Author name" onChange={(e) => handleChange(e, ["author", "name"])} />
            </Field>
            <Field label="Designation">
              <input className={inp} placeholder="e.g. Senior Cardiologist" onChange={(e) => handleChange(e, ["author", "designation"])} />
            </Field>
            <Field label="Specialization">
              <input className={inp} placeholder="Area of expertise" onChange={(e) => handleChange(e, ["author", "specialization"])} />
            </Field>
            <Field label="Experience">
              <input className={inp} placeholder="e.g. 10 years" onChange={(e) => handleChange(e, ["author", "experience"])} />
            </Field>
            <Field label="Bio / Description" className="col-span-2">
              <textarea className={`${inp} min-h-[80px] resize-y`} placeholder="Short author bio" onChange={(e) => handleChange(e, ["author", "description"])} />
            </Field>
            <Field label="Author Photo">
              <input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, authorImage: e.target.files[0] })} />
            </Field>
          </div>
        </Section>

        {/* ── CONTENT BLOCKS ── */}
        <Section title="Content Blocks">

          {/* BULK IMAGE UPLOAD */}
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
              <Upload size={18} />
              Bulk Image Upload
            </div>
            <p className="text-xs text-slate-500">
              Ek saath multiple images select karo. Jo content blocks pehle se
              <span className="font-semibold text-blue-600"> Image </span>
              type ke hain unhe fill karega — baaki ke liye naye image blocks
              automatically add ho jayenge.
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleBulkImageUpload}
              className="text-sm"
            />
            {/* Preview mapped files */}
            {Object.keys(files.contentMedia).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(files.contentMedia).map(([blockIdx, file]) => (
                  <div key={blockIdx} className="text-xs bg-white border rounded px-2 py-1 flex items-center gap-1">
                    <span className="text-slate-400">Block {Number(blockIdx) + 1}:</span>
                    <span className="font-medium text-slate-700 max-w-[120px] truncate">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INDIVIDUAL BLOCKS */}
          <div className="space-y-4 mt-4">
            {formData.content.map((block, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative space-y-3">

                {/* Block label + remove */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    Block {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(["content"], i)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Type selector */}
                <Field label="Block Type">
                  <select
                    value={block.type}
                    onChange={(e) => handleChange(e, ["content", i, "type"])}
                    className={`${inp} w-auto`}
                  >
                    <option value="heading">Heading</option>
                    <option value="subheading">Subheading</option>
                    <option value="paragraph">Paragraph</option>
                    <option value="list">Bullet List</option>
                    <option value="number_list">Numbered List</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="table">Table</option>
                    <option value="quote">Quote</option>
                    <option value="code">Code</option>
                  </select>
                </Field>

                {/* ── HEADING ── */}
                {block.type === "heading" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Heading Text" className="col-span-2">
                      <input className={inp} placeholder="Main heading" onChange={(e) => handleChange(e, ["content", i, "text"])} />
                    </Field>
                    <Field label="Level (H1–H6)">
                      <select className={inp} value={block.level} onChange={(e) => handleChange(e, ["content", i, "level"])}>
                        {[1, 2, 3, 4, 5, 6].map((l) => <option key={l} value={l}>H{l}</option>)}
                      </select>
                    </Field>
                    <Field label="Alignment">
                      <select className={inp} value={block.align} onChange={(e) => handleChange(e, ["content", i, "align"])}>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </Field>
                    <Field label="Text Color">
                      <div className="flex gap-2 items-center">
                        <input type="color" value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} className="w-10 h-9 rounded border cursor-pointer p-0.5" />
                        <input className={`${inp} w-28`} value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} />
                      </div>
                    </Field>
                  </div>
                )}

                {/* ── SUBHEADING ── */}
                {block.type === "subheading" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Subheading Text" className="col-span-2">
                      <input className={inp} placeholder="Subheading text" onChange={(e) => handleChange(e, ["content", i, "text"])} />
                    </Field>
                    <Field label="Level (H3–H6)">
                      <select className={inp} value={block.level || 3} onChange={(e) => handleChange(e, ["content", i, "level"])}>
                        {[3, 4, 5, 6].map((l) => <option key={l} value={l}>H{l}</option>)}
                      </select>
                    </Field>
                    <Field label="Alignment">
                      <select className={inp} value={block.align} onChange={(e) => handleChange(e, ["content", i, "align"])}>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </Field>
                    <Field label="Text Color">
                      <div className="flex gap-2 items-center">
                        <input type="color" value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} className="w-10 h-9 rounded border cursor-pointer p-0.5" />
                        <input className={`${inp} w-28`} value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} />
                      </div>
                    </Field>
                  </div>
                )}

                {/* ── PARAGRAPH ── */}
                {block.type === "paragraph" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Text" className="col-span-2">
                      <textarea className={`${inp} min-h-[100px] resize-y`} placeholder="Paragraph content" onChange={(e) => handleChange(e, ["content", i, "text"])} />
                    </Field>
                    <Field label="Alignment">
                      <select className={inp} value={block.align} onChange={(e) => handleChange(e, ["content", i, "align"])}>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                        <option value="justify">Justify</option>
                      </select>
                    </Field>
                    <Field label="Text Color">
                      <div className="flex gap-2 items-center">
                        <input type="color" value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} className="w-10 h-9 rounded border cursor-pointer p-0.5" />
                        <input className={`${inp} w-28`} value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} />
                      </div>
                    </Field>
                  </div>
                )}

                {/* ── QUOTE / CODE ── */}
                {["quote", "code"].includes(block.type) && (
                  <div className="space-y-3">
                    <Field label={block.type === "code" ? "Code" : "Quote Text"}>
                      <textarea
                        className={`${inp} min-h-[100px] resize-y ${block.type === "code" ? "font-mono text-sm" : ""}`}
                        placeholder={block.type === "code" ? "// code here" : "Quote text"}
                        onChange={(e) => handleChange(e, ["content", i, "text"])}
                      />
                    </Field>
                    {block.type === "quote" && (
                      <Field label="Text Color">
                        <div className="flex gap-2 items-center">
                          <input type="color" value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} className="w-10 h-9 rounded border cursor-pointer p-0.5" />
                          <input className={`${inp} w-28`} value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} />
                        </div>
                      </Field>
                    )}
                  </div>
                )}

                {/* ── LIST / NUMBERED LIST ── */}
                {["list", "number_list"].includes(block.type) && (
                  <Field label="List Items">
                    <div className="space-y-2">
                      {block.list_items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <span className="text-slate-400 text-sm w-5 text-right shrink-0">
                            {block.type === "number_list" ? `${idx + 1}.` : "•"}
                          </span>
                          <input
                            className={`${inp} flex-1`}
                            placeholder={`Item ${idx + 1}`}
                            value={item}
                            onChange={(e) => handleChange(e, ["content", i, "list_items", idx])}
                          />
                          <button type="button" onClick={() => removeItem(["content", i, "list_items"], idx)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addItem(["content", i, "list_items"], "")}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <PlusCircle size={14} /> Add Item
                      </button>
                    </div>
                  </Field>
                )}

                {/* ── IMAGE ── */}
                {block.type === "image" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Image File">
                      {/* show mapped file name from bulk upload if exists */}
                      {files.contentMedia[i] ? (
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                          <span>✓ {files.contentMedia[i].name}</span>
                          <button
                            type="button"
                            className="text-red-400 ml-auto"
                            onClick={() => {
                              const cm = { ...files.contentMedia };
                              delete cm[i];
                              setFiles((prev) => ({ ...prev, contentMedia: cm }));
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setFiles({
                              ...files,
                              contentMedia: { ...files.contentMedia, [i]: e.target.files[0] },
                            })
                          }
                        />
                      )}
                    </Field>
                    <Field label="Caption">
                      <textarea className={`${inp} min-h-[72px] resize-y`} placeholder="Image caption" onChange={(e) => handleChange(e, ["content", i, "media", "caption"])} />
                    </Field>
                    <Field label="Alt Text">
                      <input className={inp} placeholder="Describe the image" onChange={(e) => handleChange(e, ["content", i, "media", "alt"])} />
                    </Field>
                    <Field label="Alignment">
                      <select className={inp} value={block.align} onChange={(e) => handleChange(e, ["content", i, "align"])}>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </Field>
                  </div>
                )}

                {/* ── VIDEO ── */}
                {block.type === "video" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Video URL" className="col-span-2">
                      <input className={inp} placeholder="https://youtube.com/..." onChange={(e) => handleChange(e, ["content", i, "media", "url"])} />
                    </Field>
                    <Field label="Caption">
                      <input className={inp} placeholder="Video caption" onChange={(e) => handleChange(e, ["content", i, "media", "caption"])} />
                    </Field>
                  </div>
                )}

                {/* ── TABLE ── */}
                {block.type === "table" && (
                  <div className="space-y-3">
                    <Field label="Headers">
                      <div className="flex gap-2 flex-wrap">
                        {block.table.headers.map((h, hi) => (
                          <input
                            key={hi}
                            className="border border-slate-300 p-1.5 rounded text-sm w-32"
                            placeholder={`Header ${hi + 1}`}
                            value={h}
                            onChange={(e) => handleChange(e, ["content", i, "table", "headers", hi])}
                          />
                        ))}
                        <button
                          type="button"
                          onClick={() => addItem(["content", i, "table", "headers"], "")}
                          className="text-blue-600 text-sm border border-dashed border-blue-300 rounded px-2 py-1 hover:bg-blue-50"
                        >
                          + Header
                        </button>
                      </div>
                    </Field>

                    <Field label="Rows">
                      {block.table.rows.map((row, ri) => (
                        <div key={ri} className="flex gap-2 items-center mb-2">
                          {row.map((col, ci) => (
                            <input
                              key={ci}
                              className="border border-slate-300 p-1.5 rounded text-sm flex-1"
                              placeholder={`Col ${ci + 1}`}
                              value={col}
                              onChange={(e) => handleChange(e, ["content", i, "table", "rows", ri, ci])}
                            />
                          ))}
                          <button
                            type="button"
                            onClick={() => removeItem(["content", i, "table", "rows"], ri)}
                            className="text-red-500 hover:text-red-700 shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          addItem(
                            ["content", i, "table", "rows"],
                            block.table.headers.map(() => "")
                          )
                        }
                        className="text-blue-600 text-sm border border-dashed border-blue-300 rounded px-2 py-1 hover:bg-blue-50"
                      >
                        + Add Row
                      </button>
                    </Field>
                  </div>
                )}
              </div>
            ))}

            {/* ADD BLOCK */}
            <button
              type="button"
              onClick={() => addItem(["content"], emptyBlock())}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg py-3 text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <PlusCircle size={16} /> Add Content Block
            </button>
          </div>
        </Section>

        {/* ── FAQs ── */}
        <Section title="FAQs">
          <div className="space-y-4">
            {formData.faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">FAQ {i + 1}</span>
                  <button type="button" onClick={() => removeItem(["faqs"], i)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
                <Field label="Question">
                  <input className={inp} placeholder="Enter question" onChange={(e) => handleChange(e, ["faqs", i, "question"])} />
                </Field>
                <Field label="Answer">
                  <textarea className={`${inp} min-h-[80px] resize-y`} placeholder="Enter answer" onChange={(e) => handleChange(e, ["faqs", i, "answer"])} />
                </Field>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem(["faqs"], { question: "", answer: "" })}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-purple-200 rounded-lg py-3 text-sm text-purple-600 hover:bg-purple-50 transition"
            >
              <PlusCircle size={16} /> Add FAQ
            </button>
          </div>
        </Section>

        {/* ── SEO ── */}
        <Section title="SEO">
          <Field label="Meta Title">
            <input className={inp} placeholder="50–60 chars recommended" onChange={(e) => handleChange(e, ["seo", "meta_title"])} />
          </Field>
          <Field label="Meta Description">
            <textarea className={`${inp} min-h-[80px] resize-y`} placeholder="150–160 chars recommended" onChange={(e) => handleChange(e, ["seo", "meta_desc"])} />
          </Field>
          <Field label="Keywords (comma-separated)">
            <input className={inp} placeholder="keyword1, keyword2, keyword3" onChange={(e) => handleChange(e, ["seo", "keywords"])} />
          </Field>
        </Section>

        <button
          type="submit"
          disabled={loading}
          className="bg-slate-900 hover:bg-slate-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg w-full font-medium text-sm"
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
}

/* ── helpers ── */
function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-200">
        {title}
      </h2>
      {children}
    </div>
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
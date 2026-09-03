// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import api from "@/utlis/api";
// import { PlusCircle, Trash2, Upload } from "lucide-react";

// const STORAGE_KEY = "blogFormDraft"; // localStorage key jaha draft save hoga
// const FIELD_HISTORY_KEY = "blogFormFieldHistory"; // localStorage key jaha per-field suggestions save hoti hain
// const MAX_SUGGESTIONS_PER_FIELD = 8;

// const emptyBlock = () => ({
//   type: "paragraph",
//   text: "",
//   level: 2,
//   color: "#000000",
//   align: "left",
//   list_items: [],
//   table: { headers: [], rows: [] },
//   media: { caption: "" },
// });

// const emptyForm = () => ({
//   custom_id: "",
//   title: "",
//   category: "",
//   author: {
//     name: "",
//     experience: "",
//     specialization: "",
//     designation: "",
//     description: "",
//   },
//   content: [emptyBlock()],
//   faqs: [{ question: "", answer: "" }],
//   seo: {
//     meta_title: "",
//     meta_desc: "",
//     keywords: "",
//   },
// });

// export default function BlogForm() {
//   const [loading, setLoading] = useState(false);
//   const [restoredNotice, setRestoredNotice] = useState(false);
//   const [files, setFiles] = useState({
//     coverImage: null,
//     authorImage: null,
//     contentMedia: {},
//   });

//   // ─── per-field suggestion history (jaise browser ka native "saved values" dropdown) ───
//   const [fieldHistory, setFieldHistory] = useState(() => {
//     if (typeof window === "undefined") return {};
//     try {
//       const saved = window.localStorage.getItem(FIELD_HISTORY_KEY);
//       return saved ? JSON.parse(saved) : {};
//     } catch (err) {
//       return {};
//     }
//   });

//   // Jab user field se bahar click kare (blur), uski value ko us field ki history me add karo
//   const rememberValue = (fieldKey, value) => {
//     if (!value || !String(value).trim()) return;
//     setFieldHistory((prev) => {
//       const existing = prev[fieldKey] || [];
//       const updated = [value, ...existing.filter((v) => v !== value)].slice(0, MAX_SUGGESTIONS_PER_FIELD);
//       const next = { ...prev, [fieldKey]: updated };
//       try {
//         window.localStorage.setItem(FIELD_HISTORY_KEY, JSON.stringify(next));
//       } catch (err) {
//         console.warn("Suggestion history save failed:", err);
//       }
//       return next;
//     });
//   };

//   // Har field ke liye <datalist> options nikalne ka helper
//   const suggestionsFor = (fieldKey) => fieldHistory[fieldKey] || [];

//   // Lazy init: pehle localStorage se draft padhne ki koshish karo,
//   // agar mile toh wahi use karo, warna empty form.
//   const [formData, setFormData] = useState(() => {
//     if (typeof window === "undefined") return emptyForm();
//     try {
//       const saved = window.localStorage.getItem(STORAGE_KEY);
//       if (saved) return JSON.parse(saved);
//     } catch (err) {
//       console.warn("Draft restore failed:", err);
//     }
//     return emptyForm();
//   });

//   // Mount ke baad check karo ki kya draft restore hua tha (banner dikhane ke liye)
//   useEffect(() => {
//     try {
//       const saved = window.localStorage.getItem(STORAGE_KEY);
//       if (saved) setRestoredNotice(true);
//     } catch (err) {
//       // ignore
//     }
//   }, []);

//   // Jab bhi formData change ho, debounce karke localStorage me save karo.
//   // (Files ko save nahi karte kyunki File objects serialize nahi ho sakte —
//   // sirf text fields ka draft bachta hai, images wapas select karni hongi.)
//   const saveTimeout = useRef(null);
//   useEffect(() => {
//     if (saveTimeout.current) clearTimeout(saveTimeout.current);
//     saveTimeout.current = setTimeout(() => {
//       try {
//         window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
//       } catch (err) {
//         console.warn("Draft save failed:", err);
//       }
//     }, 400); // 400ms debounce taki har keystroke pe na likhe
//     return () => clearTimeout(saveTimeout.current);
//   }, [formData]);

//   const clearDraft = () => {
//     try {
//       window.localStorage.removeItem(STORAGE_KEY);
//     } catch (err) {
//       // ignore
//     }
//   };

//   /* ─── deep path setter ─── */
//   const handleChange = (e, path) => {
//     const value = e.target.value;
//     setFormData((prev) => {
//       const updated = structuredClone(prev);
//       let ref = updated;
//       path.forEach((key, i) => {
//         if (i === path.length - 1) ref[key] = value;
//         else ref = ref[key];
//       });
//       return updated;
//     });
//   };

//   const addItem = (path, item) => {
//     setFormData((prev) => {
//       const updated = structuredClone(prev);
//       let ref = updated;
//       path.forEach((k) => (ref = ref[k]));
//       ref.push(item);
//       return updated;
//     });
//   };

//   const removeItem = (path, index) => {
//     setFormData((prev) => {
//       const updated = structuredClone(prev);
//       let ref = updated;
//       path.forEach((k) => (ref = ref[k]));
//       ref.splice(index, 1);
//       return updated;
//     });
//   };

//   /* ─── BULK IMAGE UPLOAD ─── */
//   /* 
//     Jab user multiple images select karta hai, automatically
//     woh saari images un content blocks se map ho jaati hain
//     jo type="image" hain — pehle image block ko pehli file,
//     doosre ko doosri file, etc.
//   */
//   const handleBulkImageUpload = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     if (!selectedFiles.length) return;

//     // image type ke blocks ke indexes dhundho
//     const imageBlockIndexes = formData.content
//       .map((block, i) => (block.type === "image" ? i : null))
//       .filter((i) => i !== null);

//     // agar image blocks kam hain toh naye add karo
//     const blocksNeeded = selectedFiles.length - imageBlockIndexes.length;
//     let updatedContent = structuredClone(formData.content);

//     if (blocksNeeded > 0) {
//       for (let n = 0; n < blocksNeeded; n++) {
//         updatedContent.push({ ...emptyBlock(), type: "image" });
//         imageBlockIndexes.push(updatedContent.length - 1);
//       }
//       setFormData((prev) => ({ ...prev, content: updatedContent }));
//     }

//     // files ko matching blocks se map karo
//     const newContentMedia = { ...files.contentMedia };
//     selectedFiles.forEach((file, idx) => {
//       const blockIndex = imageBlockIndexes[idx];
//       if (blockIndex !== undefined) newContentMedia[blockIndex] = file;
//     });

//     setFiles((prev) => ({ ...prev, contentMedia: newContentMedia }));
//   };

//   /* ─── SUBMIT ─── */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const data = new FormData();
//     const payload = {
//       ...formData,
//       seo: {
//         ...formData.seo,
//         keywords: formData.seo.keywords.split(",").map((k) => k.trim()),
//       },
//     };
//     data.append("jsonData", JSON.stringify(payload));

//     if (files.coverImage) data.append("coverImage", files.coverImage);
//     if (files.authorImage) data.append("authorImage", files.authorImage);

//     formData.content.forEach((block, index) => {
//       if (block.type === "image" && files.contentMedia[index]) {
//         data.append("contentImages", files.contentMedia[index]);
//       }
//     });

//     try {
//       await api.post("/api/v1/blog", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Blog Created Successfully");
//       // Publish ho gaya toh draft ki ab zarurat nahi — clear kar do
//       clearDraft();
//       setFormData(emptyForm());
//       setFiles({ coverImage: null, authorImage: null, contentMedia: {} });
//       setRestoredNotice(false);
//     } catch (err) {
//       console.log(err);
//       alert("Upload Failed");
//     }

//     setLoading(false);
//   };

//   const handleClearDraft = () => {
//     if (!confirm("Saara draft data clear kar dein?")) return;
//     clearDraft();
//     setFormData(emptyForm());
//     setFiles({ coverImage: null, authorImage: null, contentMedia: {} });
//     setRestoredNotice(false);
//   };

//   const inp =
//     "border border-slate-300 p-2 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400";

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Blog Editor</h1>
//         <button
//           type="button"
//           onClick={handleClearDraft}
//           className="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded px-3 py-1.5"
//         >
//           Clear Draft
//         </button>
//       </div>

//       {restoredNotice && (
//         <div className="text-sm bg-amber-50 border border-amber-200 text-amber-700 rounded px-3 py-2 flex items-center justify-between">
//           <span>Aapka pehle wala draft restore ho gaya hai.</span>
//           <button
//             type="button"
//             onClick={() => setRestoredNotice(false)}
//             className="text-amber-500 hover:text-amber-700 font-medium"
//           >
//             ✕
//           </button>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-10">

//         {/* ── BASIC INFO ── */}
//         <Section title="Basic Info">
//           <Field label="Custom ID / Slug">
//             <input
//               className={inp}
//               placeholder="url-friendly-id"
//               value={formData.custom_id}
//               list="dl-custom_id"
//               onChange={(e) => handleChange(e, ["custom_id"])}
//               onBlur={(e) => rememberValue("custom_id", e.target.value)}
//             />
//             <datalist id="dl-custom_id">
//               {suggestionsFor("custom_id").map((v) => <option key={v} value={v} />)}
//             </datalist>
//           </Field>
//           <Field label="Title">
//             <input
//               className={inp}
//               placeholder="Blog title"
//               value={formData.title}
//               list="dl-title"
//               onChange={(e) => handleChange(e, ["title"])}
//               onBlur={(e) => rememberValue("title", e.target.value)}
//             />
//             <datalist id="dl-title">
//               {suggestionsFor("title").map((v) => <option key={v} value={v} />)}
//             </datalist>
//           </Field>
//           <Field label="Category">
//             <input
//               className={inp}
//               placeholder="e.g. Orthopaedics"
//               value={formData.category}
//               list="dl-category"
//               onChange={(e) => handleChange(e, ["category"])}
//               onBlur={(e) => rememberValue("category", e.target.value)}
//             />
//             <datalist id="dl-category">
//               {suggestionsFor("category").map((v) => <option key={v} value={v} />)}
//             </datalist>
//           </Field>
//           <Field label="Cover Image">
//             <input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, coverImage: e.target.files[0] })} />
//             <span className="text-[11px] text-slate-400">Note: images draft me save nahi hoti, refresh ke baad dobara select karni hongi.</span>
//           </Field>
//         </Section>

//         {/* ── AUTHOR ── */}
//         <Section title="Author">
//           <div className="grid grid-cols-2 gap-4">
//             <Field label="Name">
//               <input
//                 className={inp}
//                 placeholder="Author name"
//                 value={formData.author.name}
//                 list="dl-author_name"
//                 onChange={(e) => handleChange(e, ["author", "name"])}
//                 onBlur={(e) => rememberValue("author_name", e.target.value)}
//               />
//               <datalist id="dl-author_name">
//                 {suggestionsFor("author_name").map((v) => <option key={v} value={v} />)}
//               </datalist>
//             </Field>
//             <Field label="Designation">
//               <input
//                 className={inp}
//                 placeholder="e.g. Senior Cardiologist"
//                 value={formData.author.designation}
//                 list="dl-author_designation"
//                 onChange={(e) => handleChange(e, ["author", "designation"])}
//                 onBlur={(e) => rememberValue("author_designation", e.target.value)}
//               />
//               <datalist id="dl-author_designation">
//                 {suggestionsFor("author_designation").map((v) => <option key={v} value={v} />)}
//               </datalist>
//             </Field>
//             <Field label="Specialization">
//               <input
//                 className={inp}
//                 placeholder="Area of expertise"
//                 value={formData.author.specialization}
//                 list="dl-author_specialization"
//                 onChange={(e) => handleChange(e, ["author", "specialization"])}
//                 onBlur={(e) => rememberValue("author_specialization", e.target.value)}
//               />
//               <datalist id="dl-author_specialization">
//                 {suggestionsFor("author_specialization").map((v) => <option key={v} value={v} />)}
//               </datalist>
//             </Field>
//             <Field label="Experience">
//               <input
//                 className={inp}
//                 placeholder="e.g. 10 years"
//                 value={formData.author.experience}
//                 list="dl-author_experience"
//                 onChange={(e) => handleChange(e, ["author", "experience"])}
//                 onBlur={(e) => rememberValue("author_experience", e.target.value)}
//               />
//               <datalist id="dl-author_experience">
//                 {suggestionsFor("author_experience").map((v) => <option key={v} value={v} />)}
//               </datalist>
//             </Field>
//             <Field label="Bio / Description" className="col-span-2">
//               <textarea className={`${inp} min-h-[80px] resize-y`} placeholder="Short author bio" value={formData.author.description} onChange={(e) => handleChange(e, ["author", "description"])} />
//             </Field>
//             <Field label="Author Photo">
//               <input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, authorImage: e.target.files[0] })} />
//             </Field>
//           </div>
//         </Section>

//         {/* ── CONTENT BLOCKS ── */}
//         <Section title="Content Blocks">

//           {/* BULK IMAGE UPLOAD */}
//           <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50 flex flex-col gap-2">
//             <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
//               <Upload size={18} />
//               Bulk Image Upload
//             </div>
//             <p className="text-xs text-slate-500">
//               Ek saath multiple images select karo. Jo content blocks pehle se
//               <span className="font-semibold text-blue-600"> Image </span>
//               type ke hain unhe fill karega — baaki ke liye naye image blocks
//               automatically add ho jayenge.
//             </p>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleBulkImageUpload}
//               className="text-sm"
//             />
//             {/* Preview mapped files */}
//             {Object.keys(files.contentMedia).length > 0 && (
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {Object.entries(files.contentMedia).map(([blockIdx, file]) => (
//                   <div key={blockIdx} className="text-xs bg-white border rounded px-2 py-1 flex items-center gap-1">
//                     <span className="text-slate-400">Block {Number(blockIdx) + 1}:</span>
//                     <span className="font-medium text-slate-700 max-w-[120px] truncate">{file.name}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* INDIVIDUAL BLOCKS */}
//           <div className="space-y-4 mt-4">
//             {formData.content.map((block, i) => (
//               <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative space-y-3">

//                 {/* Block label + remove */}
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
//                     Block {i + 1}
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => removeItem(["content"], i)}
//                     className="ml-auto text-red-500 hover:text-red-700"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>

//                 {/* Type selector */}
//                 <Field label="Block Type">
//                   <select
//                     value={block.type}
//                     onChange={(e) => handleChange(e, ["content", i, "type"])}
//                     className={`${inp} w-auto`}
//                   >
//                     <option value="heading">Heading</option>
//                     <option value="subheading">Subheading</option>
//                     <option value="paragraph">Paragraph</option>
//                     <option value="list">Bullet List</option>
//                     <option value="number_list">Numbered List</option>
//                     <option value="image">Image</option>
//                     <option value="video">Video</option>
//                     <option value="table">Table</option>
//                     <option value="quote">Quote</option>
//                     <option value="code">Code</option>
//                   </select>
//                 </Field>

//                 {/* ── HEADING ── */}
//                 {block.type === "heading" && (
//                   <div className="grid grid-cols-2 gap-3">
//                     <Field label="Heading Text" className="col-span-2">
//                       <input className={inp} placeholder="Main heading" value={block.text} onChange={(e) => handleChange(e, ["content", i, "text"])} />
//                     </Field>
//                     <Field label="Level (H1–H6)">
//                       <select className={inp} value={block.level} onChange={(e) => handleChange(e, ["content", i, "level"])}>
//                         {[1, 2, 3, 4, 5, 6].map((l) => <option key={l} value={l}>H{l}</option>)}
//                       </select>
//                     </Field>
//                     <Field label="Alignment">
//                       <select className={inp} value={block.align} onChange={(e) => handleChange(e, ["content", i, "align"])}>
//                         <option value="left">Left</option>
//                         <option value="center">Center</option>
//                         <option value="right">Right</option>
//                       </select>
//                     </Field>
//                     <Field label="Text Color">
//                       <div className="flex gap-2 items-center">
//                         <input type="color" value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} className="w-10 h-9 rounded border cursor-pointer p-0.5" />
//                         <input className={`${inp} w-28`} value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} />
//                       </div>
//                     </Field>
//                   </div>
//                 )}

//                 {/* ── SUBHEADING ── */}
//                 {block.type === "subheading" && (
//                   <div className="grid grid-cols-2 gap-3">
//                     <Field label="Subheading Text" className="col-span-2">
//                       <input className={inp} placeholder="Subheading text" value={block.text} onChange={(e) => handleChange(e, ["content", i, "text"])} />
//                     </Field>
//                     <Field label="Level (H3–H6)">
//                       <select className={inp} value={block.level || 3} onChange={(e) => handleChange(e, ["content", i, "level"])}>
//                         {[3, 4, 5, 6].map((l) => <option key={l} value={l}>H{l}</option>)}
//                       </select>
//                     </Field>
//                     <Field label="Alignment">
//                       <select className={inp} value={block.align} onChange={(e) => handleChange(e, ["content", i, "align"])}>
//                         <option value="left">Left</option>
//                         <option value="center">Center</option>
//                         <option value="right">Right</option>
//                       </select>
//                     </Field>
//                     <Field label="Text Color">
//                       <div className="flex gap-2 items-center">
//                         <input type="color" value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} className="w-10 h-9 rounded border cursor-pointer p-0.5" />
//                         <input className={`${inp} w-28`} value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} />
//                       </div>
//                     </Field>
//                   </div>
//                 )}

//                 {/* ── PARAGRAPH ── */}
//                 {block.type === "paragraph" && (
//                   <div className="grid grid-cols-2 gap-3">
//                     <Field label="Text" className="col-span-2">
//                       <textarea className={`${inp} min-h-[100px] resize-y`} placeholder="Paragraph content" value={block.text} onChange={(e) => handleChange(e, ["content", i, "text"])} />
//                     </Field>
//                     <Field label="Alignment">
//                       <select className={inp} value={block.align} onChange={(e) => handleChange(e, ["content", i, "align"])}>
//                         <option value="left">Left</option>
//                         <option value="center">Center</option>
//                         <option value="right">Right</option>
//                         <option value="justify">Justify</option>
//                       </select>
//                     </Field>
//                     <Field label="Text Color">
//                       <div className="flex gap-2 items-center">
//                         <input type="color" value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} className="w-10 h-9 rounded border cursor-pointer p-0.5" />
//                         <input className={`${inp} w-28`} value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} />
//                       </div>
//                     </Field>
//                   </div>
//                 )}

//                 {/* ── QUOTE / CODE ── */}
//                 {["quote", "code"].includes(block.type) && (
//                   <div className="space-y-3">
//                     <Field label={block.type === "code" ? "Code" : "Quote Text"}>
//                       <textarea
//                         className={`${inp} min-h-[100px] resize-y ${block.type === "code" ? "font-mono text-sm" : ""}`}
//                         placeholder={block.type === "code" ? "// code here" : "Quote text"}
//                         value={block.text}
//                         onChange={(e) => handleChange(e, ["content", i, "text"])}
//                       />
//                     </Field>
//                     {block.type === "quote" && (
//                       <Field label="Text Color">
//                         <div className="flex gap-2 items-center">
//                           <input type="color" value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} className="w-10 h-9 rounded border cursor-pointer p-0.5" />
//                           <input className={`${inp} w-28`} value={block.color} onChange={(e) => handleChange(e, ["content", i, "color"])} />
//                         </div>
//                       </Field>
//                     )}
//                   </div>
//                 )}

//                 {/* ── LIST / NUMBERED LIST ── */}
//                 {["list", "number_list"].includes(block.type) && (
//                   <Field label="List Items">
//                     <div className="space-y-2">
//                       {block.list_items.map((item, idx) => (
//                         <div key={idx} className="flex gap-2 items-center">
//                           <span className="text-slate-400 text-sm w-5 text-right shrink-0">
//                             {block.type === "number_list" ? `${idx + 1}.` : "•"}
//                           </span>
//                           <input
//                             className={`${inp} flex-1`}
//                             placeholder={`Item ${idx + 1}`}
//                             value={item}
//                             onChange={(e) => handleChange(e, ["content", i, "list_items", idx])}
//                           />
//                           <button type="button" onClick={() => removeItem(["content", i, "list_items"], idx)} className="text-red-500 hover:text-red-700">
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                       ))}
//                       <button
//                         type="button"
//                         onClick={() => addItem(["content", i, "list_items"], "")}
//                         className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
//                       >
//                         <PlusCircle size={14} /> Add Item
//                       </button>
//                     </div>
//                   </Field>
//                 )}

//                 {/* ── IMAGE ── */}
//                 {block.type === "image" && (
//                   <div className="grid grid-cols-2 gap-3">
//                     <Field label="Image File">
//                       {/* show mapped file name from bulk upload if exists */}
//                       {files.contentMedia[i] ? (
//                         <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
//                           <span>✓ {files.contentMedia[i].name}</span>
//                           <button
//                             type="button"
//                             className="text-red-400 ml-auto"
//                             onClick={() => {
//                               const cm = { ...files.contentMedia };
//                               delete cm[i];
//                               setFiles((prev) => ({ ...prev, contentMedia: cm }));
//                             }}
//                           >
//                             ✕
//                           </button>
//                         </div>
//                       ) : (
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) =>
//                             setFiles({
//                               ...files,
//                               contentMedia: { ...files.contentMedia, [i]: e.target.files[0] },
//                             })
//                           }
//                         />
//                       )}
//                     </Field>
//                     <Field label="Caption">
//                       <textarea className={`${inp} min-h-[72px] resize-y`} placeholder="Image caption" value={block.media?.caption || ""} onChange={(e) => handleChange(e, ["content", i, "media", "caption"])} />
//                     </Field>
//                     <Field label="Alt Text">
//                       <input className={inp} placeholder="Describe the image" value={block.media?.alt || ""} onChange={(e) => handleChange(e, ["content", i, "media", "alt"])} />
//                     </Field>
//                     <Field label="Alignment">
//                       <select className={inp} value={block.align} onChange={(e) => handleChange(e, ["content", i, "align"])}>
//                         <option value="left">Left</option>
//                         <option value="center">Center</option>
//                         <option value="right">Right</option>
//                       </select>
//                     </Field>
//                   </div>
//                 )}

//                 {/* ── VIDEO ── */}
//                 {block.type === "video" && (
//                   <div className="grid grid-cols-2 gap-3">
//                     <Field label="Video URL" className="col-span-2">
//                       <input className={inp} placeholder="https://youtube.com/..." value={block.media?.url || ""} onChange={(e) => handleChange(e, ["content", i, "media", "url"])} />
//                     </Field>
//                     <Field label="Caption">
//                       <input className={inp} placeholder="Video caption" value={block.media?.caption || ""} onChange={(e) => handleChange(e, ["content", i, "media", "caption"])} />
//                     </Field>
//                   </div>
//                 )}

//                 {/* ── TABLE ── */}
//                 {block.type === "table" && (
//                   <div className="space-y-3">
//                     <Field label="Headers">
//                       <div className="flex gap-2 flex-wrap">
//                         {block.table.headers.map((h, hi) => (
//                           <input
//                             key={hi}
//                             className="border border-slate-300 p-1.5 rounded text-sm w-32"
//                             placeholder={`Header ${hi + 1}`}
//                             value={h}
//                             onChange={(e) => handleChange(e, ["content", i, "table", "headers", hi])}
//                           />
//                         ))}
//                         <button
//                           type="button"
//                           onClick={() => addItem(["content", i, "table", "headers"], "")}
//                           className="text-blue-600 text-sm border border-dashed border-blue-300 rounded px-2 py-1 hover:bg-blue-50"
//                         >
//                           + Header
//                         </button>
//                       </div>
//                     </Field>

//                     <Field label="Rows">
//                       {block.table.rows.map((row, ri) => (
//                         <div key={ri} className="flex gap-2 items-center mb-2">
//                           {row.map((col, ci) => (
//                             <input
//                               key={ci}
//                               className="border border-slate-300 p-1.5 rounded text-sm flex-1"
//                               placeholder={`Col ${ci + 1}`}
//                               value={col}
//                               onChange={(e) => handleChange(e, ["content", i, "table", "rows", ri, ci])}
//                             />
//                           ))}
//                           <button
//                             type="button"
//                             onClick={() => removeItem(["content", i, "table", "rows"], ri)}
//                             className="text-red-500 hover:text-red-700 shrink-0"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                       ))}
//                       <button
//                         type="button"
//                         onClick={() =>
//                           addItem(
//                             ["content", i, "table", "rows"],
//                             block.table.headers.map(() => "")
//                           )
//                         }
//                         className="text-blue-600 text-sm border border-dashed border-blue-300 rounded px-2 py-1 hover:bg-blue-50"
//                       >
//                         + Add Row
//                       </button>
//                     </Field>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {/* ADD BLOCK */}
//             <button
//               type="button"
//               onClick={() => addItem(["content"], emptyBlock())}
//               className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg py-3 text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition"
//             >
//               <PlusCircle size={16} /> Add Content Block
//             </button>
//           </div>
//         </Section>

//         {/* ── FAQs ── */}
//         <Section title="FAQs">
//           <div className="space-y-4">
//             {formData.faqs.map((faq, i) => (
//               <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">FAQ {i + 1}</span>
//                   <button type="button" onClick={() => removeItem(["faqs"], i)} className="text-red-500 hover:text-red-700">
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//                 <Field label="Question">
//                   <input className={inp} placeholder="Enter question" value={faq.question} onChange={(e) => handleChange(e, ["faqs", i, "question"])} />
//                 </Field>
//                 <Field label="Answer">
//                   <textarea className={`${inp} min-h-[80px] resize-y`} placeholder="Enter answer" value={faq.answer} onChange={(e) => handleChange(e, ["faqs", i, "answer"])} />
//                 </Field>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => addItem(["faqs"], { question: "", answer: "" })}
//               className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-purple-200 rounded-lg py-3 text-sm text-purple-600 hover:bg-purple-50 transition"
//             >
//               <PlusCircle size={16} /> Add FAQ
//             </button>
//           </div>
//         </Section>

//         {/* ── SEO ── */}
//         <Section title="SEO">
//           <Field label="Meta Title">
//             <input
//               className={inp}
//               placeholder="50–60 chars recommended"
//               value={formData.seo.meta_title}
//               list="dl-meta_title"
//               onChange={(e) => handleChange(e, ["seo", "meta_title"])}
//               onBlur={(e) => rememberValue("meta_title", e.target.value)}
//             />
//             <datalist id="dl-meta_title">
//               {suggestionsFor("meta_title").map((v) => <option key={v} value={v} />)}
//             </datalist>
//           </Field>
//           <Field label="Meta Description">
//             <textarea className={`${inp} min-h-[80px] resize-y`} placeholder="150–160 chars recommended" value={formData.seo.meta_desc} onChange={(e) => handleChange(e, ["seo", "meta_desc"])} />
//           </Field>
//           <Field label="Keywords (comma-separated)">
//             <input
//               className={inp}
//               placeholder="keyword1, keyword2, keyword3"
//               value={formData.seo.keywords}
//               list="dl-keywords"
//               onChange={(e) => handleChange(e, ["seo", "keywords"])}
//               onBlur={(e) => rememberValue("keywords", e.target.value)}
//             />
//             <datalist id="dl-keywords">
//               {suggestionsFor("keywords").map((v) => <option key={v} value={v} />)}
//             </datalist>
//           </Field>
//         </Section>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-slate-900 hover:bg-slate-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg w-full font-medium text-sm"
//         >
//           {loading ? "Publishing..." : "Publish Blog"}
//         </button>
//       </form>
//     </div>
//   );
// }

// /* ── helpers ── */
// function Section({ title, children }) {
//   return (
//     <div className="space-y-4">
//       <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-200">
//         {title}
//       </h2>
//       {children}
//     </div>
//   );
// }

// function Field({ label, children, className = "" }) {
//   return (
//     <div className={`flex flex-col gap-1 ${className}`}>
//       <label className="text-xs font-medium text-slate-500">{label}</label>
//       {children}
//     </div>
//   );
// }


"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Plus,
  Trash2,
  Link as LinkIcon,
  X,
  Save,
  Upload,
  Image as ImageIcon,
  GripVertical,
  ExternalLink,
} from "lucide-react";

import api from "@/utlis/api";

/* =========================================================
   HELPERS
========================================================= */

const createBlock = (type = "paragraph") => ({
  type,

  text: "",

  level:
    type === "heading"
      ? 2
      : 3,

  color: "#000000",

  align: "left",

  list_items: [],

  table: {
    headers: [],
    rows: [],
  },

  media: {
    public_id: "",
    url: "",
    caption: "",
    alt: "",
  },

  links: [],
});


const createFaq = () => ({
  question: "",
  answer: "",
});


const initialForm = {
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

  content: [
    createBlock("paragraph"),
  ],

  faqs: [
    createFaq(),
  ],

  seo: {
    meta_title: "",
    meta_desc: "",
    keywords: "",
  },
};


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AddBlogPage() {

  const [formData, setFormData] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [blogs, setBlogs] =
    useState([]);

  const [blogsLoading, setBlogsLoading] =
    useState(false);

  const [coverImage, setCoverImage] =
    useState(null);

  const [authorImage, setAuthorImage] =
    useState(null);

  const [contentImages, setContentImages] =
    useState({});

  const [previewCover, setPreviewCover] =
    useState("");

  const [previewAuthor, setPreviewAuthor] =
    useState("");

  const textareaRefs =
    useRef({});

  const selections =
    useRef({});

  const [selectionPreview, setSelectionPreview] =
    useState({});


  /* =======================================================
     INTERNAL LINK MODAL
  ======================================================= */

  const [linkModal, setLinkModal] =
    useState({
      open: false,

      blockIndex: null,

      linkIndex: null,

      text: "",

      start: 0,

      end: 0,

      linkType: "blog",

      blogId: "",

      href: "",
    });


  /* =======================================================
     LOAD BLOGS
  ======================================================= */

  useEffect(() => {
    loadBlogs();
  }, []);


  const loadBlogs = async () => {

    try {

      setBlogsLoading(true);

      const response =
        await api.get(
          "/api/v1/blog"
        );

      const data =
        response?.data?.data ||
        response?.data?.blogs ||
        [];

      setBlogs(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Blog loading error:",
        error
      );

    } finally {

      setBlogsLoading(false);

    }
  };


  /* =======================================================
     FORM UPDATE
  ======================================================= */

  const updateForm = (
    path,
    value
  ) => {

    setFormData((prev) => {

      const next =
        structuredClone(prev);

      let current = next;

      for (
        let i = 0;
        i < path.length - 1;
        i++
      ) {

        current =
          current[path[i]];
      }

      current[
        path[path.length - 1]
      ] = value;

      return next;
    });
  };


  /* =======================================================
     BLOCK UPDATE
  ======================================================= */

  const updateBlock = (
    index,
    key,
    value
  ) => {

    setFormData((prev) => {

      const next =
        structuredClone(prev);

      next.content[index][key] =
        value;

      return next;
    });
  };


  /* =======================================================
     TEXT UPDATE
  ======================================================= */

  const updateBlockText = (
    blockIndex,
    newText
  ) => {

    setFormData((prev) => {

      const next =
        structuredClone(prev);

      const block =
        next.content[blockIndex];

      const oldText =
        block.text || "";

      let prefixLen = 0;

      const maxPrefix =
        Math.min(
          oldText.length,
          newText.length
        );

      while (
        prefixLen < maxPrefix &&
        oldText[prefixLen] ===
          newText[prefixLen]
      ) {

        prefixLen++;
      }


      let suffixLen = 0;

      const maxSuffix =
        Math.min(
          oldText.length,
          newText.length
        ) - prefixLen;


      while (
        suffixLen < maxSuffix &&
        oldText[
          oldText.length -
            1 -
            suffixLen
        ] ===
          newText[
            newText.length -
              1 -
              suffixLen
          ]
      ) {

        suffixLen++;
      }


      const oldEditEnd =
        oldText.length -
        suffixLen;


      const delta =
        newText.length -
        oldText.length;


      const existingLinks =
        Array.isArray(block.links)
          ? block.links
          : [];


      const updatedLinks =
        existingLinks
          .map((link) => {

            /*
             * Edit happened after link
             */

            if (
              oldEditEnd <=
              link.start
            ) {

              return {
                ...link,

                start:
                  link.start +
                  delta,

                end:
                  link.end +
                  delta,
              };
            }


            /*
             * Edit happened before link
             */

            if (
              prefixLen >=
              link.end
            ) {

              return link;
            }


            /*
             * Edit overlaps link
             */

            return null;

          })
          .filter(Boolean);


      block.text =
        newText;

      block.links =
        updatedLinks;


      return next;
    });
  };


  /* =======================================================
     ADD BLOCK
  ======================================================= */

  const addBlock = (
    type = "paragraph"
  ) => {

    setFormData((prev) => ({

      ...prev,

      content: [
        ...prev.content,

        createBlock(type),
      ],

    }));
  };


  /* =======================================================
     DELETE BLOCK
  ======================================================= */

  const deleteBlock = (
    index
  ) => {

    if (
      formData.content.length ===
      1
    ) {

      alert(
        "At least one content block is required."
      );

      return;
    }


    setFormData((prev) => ({

      ...prev,

      content:
        prev.content.filter(
          (_, i) =>
            i !== index
        ),

    }));


    setContentImages((prev) => {

      const next = {};

      Object.entries(prev).forEach(
        ([key, value]) => {

          const oldIndex =
            Number(key);

          if (
            oldIndex < index
          ) {

            next[oldIndex] =
              value;
          }


          if (
            oldIndex > index
          ) {

            next[
              oldIndex - 1
            ] = value;
          }

        }
      );

      return next;
    });


    delete textareaRefs.current[
      index
    ];

    delete selections.current[
      index
    ];

  };


  /* =======================================================
     LIST
  ======================================================= */

  const addListItem = (
    blockIndex
  ) => {

    setFormData((prev) => {

      const next =
        structuredClone(prev);

      next.content[
        blockIndex
      ].list_items.push("");

      return next;
    });
  };


  const updateListItem = (
    blockIndex,
    itemIndex,
    value
  ) => {

    setFormData((prev) => {

      const next =
        structuredClone(prev);

      next.content[
        blockIndex
      ].list_items[itemIndex] =
        value;

      return next;
    });
  };


  const deleteListItem = (
    blockIndex,
    itemIndex
  ) => {

    setFormData((prev) => {

      const next =
        structuredClone(prev);

      next.content[
        blockIndex
      ].list_items.splice(
        itemIndex,
        1
      );

      return next;
    });
  };


  /* =======================================================
     FAQ
  ======================================================= */

  const addFaq = () => {

    setFormData((prev) => ({

      ...prev,

      faqs: [
        ...prev.faqs,
        createFaq(),
      ],

    }));
  };


  const updateFaq = (
    index,
    key,
    value
  ) => {

    setFormData((prev) => {

      const next =
        structuredClone(prev);

      next.faqs[index][key] =
        value;

      return next;
    });
  };


  const deleteFaq = (
    index
  ) => {

    setFormData((prev) => ({

      ...prev,

      faqs:
        prev.faqs.filter(
          (_, i) =>
            i !== index
        ),

    }));
  };


  /* =======================================================
     TABLE
  ======================================================= */

  const addTableColumn = (
    blockIndex
  ) => {

    setFormData((prev) => {

      const next =
        structuredClone(prev);

      const table =
        next.content[
          blockIndex
        ].table;

      table.headers.push("");

      table.rows =
        table.rows.map(
          (row) => [
            ...row,
            "",
          ]
        );

      return next;
    });
  };


  const addTableRow = (
    blockIndex
  ) => {

    setFormData((prev) => {

      const next =
        structuredClone(prev);

      const table =
        next.content[
          blockIndex
        ].table;

      table.rows.push(
        table.headers.map(
          () => ""
        )
      );

      return next;
    });
  };


  const deleteTableRow = (
    blockIndex,
    rowIndex
  ) => {

    setFormData((prev) => {

      const next =
        structuredClone(prev);

      next.content[
        blockIndex
      ].table.rows.splice(
        rowIndex,
        1
      );

      return next;
    });
  };


  /* =======================================================
     IMAGES
  ======================================================= */

  const handleCoverImage = (
    file
  ) => {

    setCoverImage(file);

    if (file) {

      setPreviewCover(
        URL.createObjectURL(
          file
        )
      );

    }
  };


  const handleAuthorImage = (
    file
  ) => {

    setAuthorImage(file);

    if (file) {

      setPreviewAuthor(
        URL.createObjectURL(
          file
        )
      );

    }
  };


  const handleContentImage = (
    blockIndex,
    file
  ) => {

    setContentImages(
      (prev) => ({
        ...prev,
        [blockIndex]:
          file,
      })
    );
  };


  /* =======================================================
     TEXT SELECTION
  ======================================================= */

  const captureSelection = (
    blockIndex
  ) => {

    const textarea =
      textareaRefs.current[
        blockIndex
      ];

    if (!textarea) {
      return;
    }


    const start =
      textarea.selectionStart;

    const end =
      textarea.selectionEnd;


    if (
      start === end
    ) {

      return;
    }


    const text =
      textarea.value.slice(
        start,
        end
      );


    if (!text.trim()) {
      return;
    }


    selections.current[
      blockIndex
    ] = {
      start,
      end,
      text,
    };


    setSelectionPreview(
      (prev) => ({
        ...prev,
        [blockIndex]:
          text,
      })
    );

  };


  /* =======================================================
     OPEN LINK MODAL
  ======================================================= */

  const openLinkModal = (
    blockIndex
  ) => {

    const selection =
      selections.current[
        blockIndex
      ];


    if (!selection) {

      alert(
        "Please select text first."
      );

      return;
    }


    const links =
      formData.content[
        blockIndex
      ].links || [];


    const overlap =
      links.find(
        (link) =>
          selection.start <
            link.end &&
          selection.end >
            link.start
      );


    if (overlap) {

      alert(
        "Selected text is already linked."
      );

      return;
    }


    setLinkModal({

      open: true,

      blockIndex,

      linkIndex: null,

      text:
        selection.text,

      start:
        selection.start,

      end:
        selection.end,

      linkType: "blog",

      blogId: "",

      href: "",

    });

  };


  /* =======================================================
     EDIT LINK
  ======================================================= */

  const editLink = (
    blockIndex,
    linkIndex
  ) => {

    const link =
      formData.content[
        blockIndex
      ].links?.[
        linkIndex
      ];


    if (!link) {
      return;
    }


    setLinkModal({

      open: true,

      blockIndex,

      linkIndex,

      text:
        link.text,

      start:
        link.start,

      end:
        link.end,

      linkType:
        link.targetType ===
        "page"
          ? "page"
          : "blog",

      blogId:
        link.blogId ||
        "",

      href:
        link.href ||
        "",

    });

  };


  /* =======================================================
     SAVE INTERNAL LINK
  ======================================================= */

  const saveLink = () => {

    const {
      blockIndex,
      linkIndex,
      text,
      start,
      end,
      linkType,
      blogId,
      href,
    } = linkModal;


    let newLink = null;


    /* =====================================================
       BLOG LINK
    ===================================================== */

    if (
      linkType ===
      "blog"
    ) {

      if (!blogId) {

        alert(
          "Please select a blog."
        );

        return;
      }


      const selectedBlog =
        blogs.find(
          (blog) =>
            String(
              blog._id
            ) ===
            String(
              blogId
            )
        );


      if (!selectedBlog) {

        alert(
          "Selected blog not found."
        );

        return;
      }


      if (
        !selectedBlog.slug
      ) {

        alert(
          "Selected blog does not have a slug."
        );

        return;
      }


      newLink = {

        text,

        type:
          "internal",

        targetType:
          "blog",

        blogId:
          selectedBlog._id,

        slug:
          selectedBlog.slug,

        href:
          `/blog/${selectedBlog.slug}`,

        start:
          Number(start),

        end:
          Number(end),

      };

    }


    /* =====================================================
       WEBSITE PAGE LINK
    ===================================================== */

    if (
      linkType ===
      "page"
    ) {

      const cleanHref =
        href.trim();


      if (!cleanHref) {

        alert(
          "Please enter an internal URL."
        );

        return;
      }


      if (
        !cleanHref.startsWith("/")
      ) {

        alert(
          "Internal URL must start with /"
        );

        return;
      }


      newLink = {

        text,

        type:
          "internal",

        targetType:
          "page",

        href:
          cleanHref,

        start:
          Number(start),

        end:
          Number(end),

      };

    }


    if (!newLink) {
      return;
    }


    setFormData((prev) => {

      const next =
        structuredClone(prev);

      const block =
        next.content[
          blockIndex
        ];


      if (
        !Array.isArray(
          block.links
        )
      ) {

        block.links = [];
      }


      if (
        linkIndex ===
        null
      ) {

        block.links.push(
          newLink
        );

      } else {

        block.links[
          linkIndex
        ] = newLink;

      }


      block.links.sort(
        (a, b) =>
          a.start -
          b.start
      );


      return next;

    });


    closeLinkModal();

  };


  /* =======================================================
     DELETE LINK
  ======================================================= */

  const deleteLink = (
    blockIndex,
    linkIndex
  ) => {

    setFormData((prev) => {

      const next =
        structuredClone(prev);

      next.content[
        blockIndex
      ].links.splice(
        linkIndex,
        1
      );

      return next;

    });

  };


  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeLinkModal =
    () => {

      setLinkModal({

        open: false,

        blockIndex: null,

        linkIndex: null,

        text: "",

        start: 0,

        end: 0,

        linkType:
          "blog",

        blogId: "",

        href: "",

      });

    };


  /* =======================================================
     SEO
  ======================================================= */

  const keywordsArray =
    formData.seo.keywords
      .split(",")
      .map(
        (item) =>
          item.trim()
      )
      .filter(Boolean);


  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      if (
        !formData.title.trim()
      ) {

        alert(
          "Blog title is required."
        );

        return;
      }


      if (
        !formData.category.trim()
      ) {

        alert(
          "Category is required."
        );

        return;
      }


      if (
        !formData.author.name.trim()
      ) {

        alert(
          "Author name is required."
        );

        return;
      }


      try {

        setLoading(true);


        const form =
          new FormData();


        const payload = {

          ...formData,

          seo: {

            ...formData.seo,

            keywords:
              keywordsArray,

          },

        };


        form.append(
          "jsonData",
          JSON.stringify(
            payload
          )
        );


        /* COVER */

        if (
          coverImage
        ) {

          form.append(
            "coverImage",
            coverImage
          );

        }


        /* AUTHOR */

        if (
          authorImage
        ) {

          form.append(
            "authorImage",
            authorImage
          );

        }


        /* CONTENT IMAGES */

        Object.entries(
          contentImages
        ).forEach(
          ([
            index,
            file,
          ]) => {

            if (file) {

              /*
               * Index bhi bhej rahe hain.
               * Backend ko pata chalega image
               * kis content block ki hai.
               */

              form.append(
                "contentImages",
                file
              );

              form.append(
                "contentImageIndexes",
                index
              );

            }

          }
        );


        const response =
          await api.post(
            "/api/v1/blog",
            form,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );


        console.log(
          "BLOG RESPONSE:",
          response.data
        );


        alert(
          "Blog created successfully."
        );


        /* RESET */

        setFormData(
          structuredClone(
            initialForm
          )
        );

        setCoverImage(
          null
        );

        setAuthorImage(
          null
        );

        setContentImages(
          {}
        );

        setPreviewCover(
          ""
        );

        setPreviewAuthor(
          ""
        );

        setSelectionPreview(
          {}
        );

        selections.current =
          {};


        loadBlogs();


      } catch (error) {

        console.error(
          "Create blog error:",
          error
        );


        alert(
          error?.response
            ?.data
            ?.message ||
            "Blog creation failed."
        );


      } finally {

        setLoading(false);

      }

    };


  /* =======================================================
     INPUT STYLE
  ======================================================= */

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";


  /* =======================================================
     UI
  ======================================================= */

  return (

    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <div className="sticky top-0 z-40 border-b bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div>

            <h1 className="text-xl font-bold text-gray-900">
              Add New Blog
            </h1>

            <p className="text-xs text-gray-500">
              Create and publish SEO-friendly blog content
            </p>

          </div>


          <button
            type="submit"
            form="blog-form"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <Save size={17} />

            {loading
              ? "Publishing..."
              : "Publish Blog"}

          </button>

        </div>

      </div>


      {/* MAIN */}

      <div className="mx-auto max-w-7xl px-6 py-8">

        <form
          id="blog-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <Card>

            <CardTitle>
              Basic Information
            </CardTitle>


            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Custom ID"
                value={
                  formData.custom_id
                }
                onChange={(e) =>
                  updateForm(
                    ["custom_id"],
                    e.target.value
                  )
                }
                placeholder="online-mba-guide"
              />


              <Input
                label="Category"
                value={
                  formData.category
                }
                onChange={(e) =>
                  updateForm(
                    ["category"],
                    e.target.value
                  )
                }
                placeholder="Education"
              />


              <div className="md:col-span-2">

                <Input
                  label="Blog Title"
                  value={
                    formData.title
                  }
                  onChange={(e) =>
                    updateForm(
                      ["title"],
                      e.target.value
                    )
                  }
                  placeholder="Enter blog title"
                />

              </div>

            </div>

          </Card>


          {/* =================================================
              COVER IMAGE
          ================================================= */}

          <Card>

            <CardTitle>
              Cover Image
            </CardTitle>


            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Upload Cover
                </label>


                <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50">

                  <Upload
                    className="mb-2 text-gray-400"
                    size={28}
                  />


                  <span className="text-sm text-gray-600">
                    Click to upload
                  </span>


                  <span className="mt-1 text-xs text-gray-400">
                    JPG, PNG, WEBP
                  </span>


                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleCoverImage(
                        e.target.files?.[0]
                      )
                    }
                  />

                </label>

              </div>


              <div>

                {previewCover ? (

                  <div className="overflow-hidden rounded-xl border bg-white">

                    <img
                      src={previewCover}
                      alt="Cover preview"
                      className="h-48 w-full object-cover"
                    />

                  </div>

                ) : (

                  <div className="flex h-48 items-center justify-center rounded-xl border bg-gray-50 text-gray-400">

                    <div className="text-center">

                      <ImageIcon
                        size={35}
                        className="mx-auto mb-2"
                      />

                      <p className="text-sm">
                        Cover preview
                      </p>

                    </div>

                  </div>

                )}

              </div>

            </div>

          </Card>


          {/* =================================================
              AUTHOR
          ================================================= */}

          <Card>

            <CardTitle>
              Author Information
            </CardTitle>


            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Author Name"
                value={
                  formData.author.name
                }
                onChange={(e) =>
                  updateForm(
                    [
                      "author",
                      "name",
                    ],
                    e.target.value
                  )
                }
                placeholder="Yogesh Kumar"
              />


              <Input
                label="Designation"
                value={
                  formData.author.designation
                }
                onChange={(e) =>
                  updateForm(
                    [
                      "author",
                      "designation",
                    ],
                    e.target.value
                  )
                }
                placeholder="Senior Education Consultant"
              />


              <Input
                label="Experience"
                value={
                  formData.author.experience
                }
                onChange={(e) =>
                  updateForm(
                    [
                      "author",
                      "experience",
                    ],
                    e.target.value
                  )
                }
                placeholder="8+ Years"
              />


              <Input
                label="Specialization"
                value={
                  formData.author.specialization
                }
                onChange={(e) =>
                  updateForm(
                    [
                      "author",
                      "specialization",
                    ],
                    e.target.value
                  )
                }
                placeholder="Online Education"
              />


              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium">
                  Author Description
                </label>


                <textarea
                  className={`${inputClass} min-h-[100px]`}
                  value={
                    formData.author.description
                  }
                  onChange={(e) =>
                    updateForm(
                      [
                        "author",
                        "description",
                      ],
                      e.target.value
                    )
                  }
                  placeholder="Short author description"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-medium">
                  Author Image
                </label>


                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleAuthorImage(
                      e.target.files?.[0]
                    )
                  }
                  className="block w-full rounded-lg border p-2 text-sm"
                />

              </div>


              {previewAuthor && (

                <div>

                  <img
                    src={previewAuthor}
                    alt="Author"
                    className="h-24 w-24 rounded-full object-cover"
                  />

                </div>

              )}

            </div>

          </Card>


          {/* =================================================
              BLOG CONTENT
          ================================================= */}

          <Card>

            <div className="flex items-center justify-between">

              <CardTitle>
                Blog Content
              </CardTitle>


              <div className="flex flex-wrap gap-2">

                <AddBlockButton
                  type="paragraph"
                  onClick={() =>
                    addBlock(
                      "paragraph"
                    )
                  }
                />


                <AddBlockButton
                  type="heading"
                  onClick={() =>
                    addBlock(
                      "heading"
                    )
                  }
                />


                <AddBlockButton
                  type="list"
                  onClick={() =>
                    addBlock(
                      "list"
                    )
                  }
                />


                <AddBlockButton
                  type="image"
                  onClick={() =>
                    addBlock(
                      "image"
                    )
                  }
                />

              </div>

            </div>


            <div className="mt-6 space-y-5">

              {formData.content.map(
                (
                  block,
                  blockIndex
                ) => (

                  <ContentBlock
                    key={blockIndex}
                    block={block}
                    index={blockIndex}
                    inputClass={
                      inputClass
                    }
                    updateBlock={
                      updateBlock
                    }
                    updateBlockText={
                      updateBlockText
                    }
                    deleteBlock={
                      deleteBlock
                    }
                    textareaRefs={
                      textareaRefs
                    }
                    captureSelection={
                      captureSelection
                    }
                    selectedPreviewText={
                      selectionPreview[
                        blockIndex
                      ]
                    }
                    openLinkModal={
                      openLinkModal
                    }
                    editLink={
                      editLink
                    }
                    deleteLink={
                      deleteLink
                    }
                    addListItem={
                      addListItem
                    }
                    updateListItem={
                      updateListItem
                    }
                    deleteListItem={
                      deleteListItem
                    }
                    handleContentImage={
                      handleContentImage
                    }
                    contentImage={
                      contentImages[
                        blockIndex
                      ]
                    }
                    addTableColumn={
                      addTableColumn
                    }
                    addTableRow={
                      addTableRow
                    }
                    deleteTableRow={
                      deleteTableRow
                    }
                  />

                )
              )}

            </div>


            <button
              type="button"
              onClick={() =>
                addBlock(
                  "paragraph"
                )
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-blue-600 hover:border-blue-400 hover:bg-blue-50"
            >

              <Plus size={17} />

              Add Content Block

            </button>

          </Card>


          {/* =================================================
              FAQ
          ================================================= */}

          <Card>

            <div className="flex items-center justify-between">

              <CardTitle>
                Frequently Asked Questions
              </CardTitle>


              <button
                type="button"
                onClick={addFaq}
                className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600"
              >

                <Plus size={15} />

                Add FAQ

              </button>

            </div>


            <div className="mt-5 space-y-4">

              {formData.faqs.map(
                (
                  faq,
                  index
                ) => (

                  <div
                    key={index}
                    className="rounded-xl border bg-gray-50 p-4"
                  >

                    <div className="mb-3 flex items-center justify-between">

                      <span className="text-sm font-semibold">
                        FAQ #{index + 1}
                      </span>


                      <button
                        type="button"
                        onClick={() =>
                          deleteFaq(
                            index
                          )
                        }
                        className="text-red-500"
                      >

                        <Trash2 size={16} />

                      </button>

                    </div>


                    <div className="space-y-3">

                      <Input
                        label="Question"
                        value={
                          faq.question
                        }
                        onChange={(e) =>
                          updateFaq(
                            index,
                            "question",
                            e.target.value
                          )
                        }
                        placeholder="Enter question"
                      />


                      <textarea
                        className={`${inputClass} min-h-[100px]`}
                        value={
                          faq.answer
                        }
                        onChange={(e) =>
                          updateFaq(
                            index,
                            "answer",
                            e.target.value
                          )
                        }
                        placeholder="Enter answer"
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          </Card>


          {/* =================================================
              SEO
          ================================================= */}

          <Card>

            <CardTitle>
              SEO Settings
            </CardTitle>


            <div className="space-y-5">

              <Input
                label="Meta Title"
                value={
                  formData.seo.meta_title
                }
                onChange={(e) =>
                  updateForm(
                    [
                      "seo",
                      "meta_title",
                    ],
                    e.target.value
                  )
                }
                placeholder="SEO meta title"
              />


              <div>

                <label className="mb-2 block text-sm font-medium">
                  Meta Description
                </label>


                <textarea
                  className={`${inputClass} min-h-[100px]`}
                  value={
                    formData.seo.meta_desc
                  }
                  onChange={(e) =>
                    updateForm(
                      [
                        "seo",
                        "meta_desc",
                      ],
                      e.target.value
                    )
                  }
                  placeholder="SEO meta description"
                />

              </div>


              <Input
                label="Keywords"
                value={
                  formData.seo.keywords
                }
                onChange={(e) =>
                  updateForm(
                    [
                      "seo",
                      "keywords",
                    ],
                    e.target.value
                  )
                }
                placeholder="online mba, mba courses, distance mba"
              />


              <div className="flex flex-wrap gap-2">

                {keywordsArray.map(
                  (keyword) => (

                    <span
                      key={keyword}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
                    >
                      {keyword}
                    </span>

                  )
                )}

              </div>

            </div>

          </Card>


          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="flex justify-end">

            <button
              type="submit"
              disabled={loading}
              className="flex min-w-[180px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >

              <Save size={17} />

              {loading
                ? "Publishing..."
                : "Publish Blog"}

            </button>

          </div>

        </form>

      </div>


      {/* =====================================================
          INTERNAL LINK MODAL
      ===================================================== */}

      {linkModal.open && (

        <InternalLinkModal
          linkModal={
            linkModal
          }
          setLinkModal={
            setLinkModal
          }
          blogs={
            blogs
          }
          blogsLoading={
            blogsLoading
          }
          closeLinkModal={
            closeLinkModal
          }
          saveLink={
            saveLink
          }
        />

      )}

    </div>
  );
}


/* =========================================================
   CONTENT BLOCK
========================================================= */

function ContentBlock({
  block,
  index,
  inputClass,
  updateBlock,
  updateBlockText,
  deleteBlock,
  textareaRefs,
  captureSelection,
  selectedPreviewText,
  openLinkModal,
  editLink,
  deleteLink,
  addListItem,
  updateListItem,
  deleteListItem,
  handleContentImage,
  contentImage,
  addTableColumn,
  addTableRow,
  deleteTableRow,
}) {

  return (

    <div className="relative rounded-xl border bg-white p-5 shadow-sm">

      {/* HEADER */}

      <div className="mb-5 flex items-center gap-3">

        <GripVertical
          size={18}
          className="text-gray-300"
        />


        <select
          value={
            block.type
          }
          onChange={(e) =>
            updateBlock(
              index,
              "type",
              e.target.value
            )
          }
          className="rounded-lg border px-3 py-2 text-sm font-medium"
        >

          <option value="paragraph">
            Paragraph
          </option>

          <option value="heading">
            Heading
          </option>

          <option value="subheading">
            Subheading
          </option>

          <option value="list">
            Bullet List
          </option>

          <option value="number_list">
            Number List
          </option>

          <option value="image">
            Image
          </option>

          <option value="video">
            Video
          </option>

          <option value="table">
            Table
          </option>

          <option value="quote">
            Quote
          </option>

          <option value="code">
            Code
          </option>

        </select>


        <span className="text-xs text-gray-400">
          Block #{index + 1}
        </span>


        <button
          type="button"
          onClick={() =>
            deleteBlock(index)
          }
          className="ml-auto rounded-lg p-2 text-red-500 hover:bg-red-50"
        >

          <Trash2 size={17} />

        </button>

      </div>


      {/* =====================================================
          HEADING
      ===================================================== */}

      {[
        "heading",
        "subheading",
      ].includes(
        block.type
      ) && (

        <div className="space-y-4">

          <div className="grid gap-4 md:grid-cols-3">

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Text
              </label>


              <input
                className={
                  inputClass
                }
                value={
                  block.text
                }
                onChange={(e) =>
                  updateBlockText(
                    index,
                    e.target.value
                  )
                }
                placeholder={
                  block.type ===
                  "heading"
                    ? "Main heading"
                    : "Sub heading"
                }
              />

            </div>


            <div>

              <label className="mb-2 block text-sm font-medium">
                Level
              </label>


              <select
                className={
                  inputClass
                }
                value={
                  block.level
                }
                onChange={(e) =>
                  updateBlock(
                    index,
                    "level",
                    Number(
                      e.target.value
                    )
                  )
                }
              >

                {[
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                ].map(
                  (level) => (

                    <option
                      key={level}
                      value={level}
                    >
                      H{level}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>


          <TextOptions
            block={block}
            index={index}
            updateBlock={
              updateBlock
            }
          />

        </div>

      )}


      {/* =====================================================
          PARAGRAPH
      ===================================================== */}

      {block.type ===
        "paragraph" && (

        <div className="space-y-4">

          <div>

            <div className="mb-2 flex items-center justify-between">

              <label className="text-sm font-medium">
                Paragraph
              </label>

              <span className="text-xs text-gray-400">
                Select text → Add Internal Link
              </span>

            </div>


            <textarea
              ref={(element) => {
                textareaRefs.current[
                  index
                ] = element;
              }}
              className={`${inputClass} min-h-[180px] resize-y`}
              value={
                block.text
              }
              onChange={(e) =>
                updateBlockText(
                  index,
                  e.target.value
                )
              }
              onSelect={() =>
                captureSelection(
                  index
                )
              }
              onMouseUp={() =>
                captureSelection(
                  index
                )
              }
              onKeyUp={() =>
                captureSelection(
                  index
                )
              }
              placeholder="Write your paragraph here..."
            />

          </div>


          {/* LINK TOOL */}

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

              <div>

                <div className="flex items-center gap-2 font-semibold text-blue-800">

                  <LinkIcon size={17} />

                  Internal Links

                </div>


                <p className="mt-1 text-xs text-blue-600">
                  Select text → Add Internal Link → Blog or Website Page
                </p>


                {selectedPreviewText && (

                  <p className="mt-2 text-xs text-gray-700">

                    Currently selected:{" "}

                    <span className="rounded bg-yellow-100 px-1.5 py-0.5 font-medium text-gray-900">

                      "{selectedPreviewText}"

                    </span>

                  </p>

                )}

              </div>


              <button
                type="button"
                onClick={() =>
                  openLinkModal(
                    index
                  )
                }
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >

                <LinkIcon size={15} />

                Add Internal Link

              </button>

            </div>


            {/* EXISTING LINKS */}

            {block.links?.length >
              0 && (

              <div className="mt-4 space-y-2">

                {block.links.map(
                  (
                    link,
                    linkIndex
                  ) => (

                    <div
                      key={
                        linkIndex
                      }
                      className="flex items-start gap-3 rounded-lg border bg-white p-3"
                    >

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                            Internal
                          </span>


                          <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                            {link.targetType ===
                            "blog"
                              ? "Blog"
                              : "Page"}
                          </span>


                          <span className="text-sm font-semibold text-gray-800">
                            {link.text}
                          </span>

                        </div>


                        <div className="mt-1 flex items-center gap-1 text-xs text-blue-600">

                          <ExternalLink
                            size={12}
                          />

                          {link.href}

                        </div>

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          editLink(
                            index,
                            linkIndex
                          )
                        }
                        className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          deleteLink(
                            index,
                            linkIndex
                          )
                        }
                        className="rounded px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          <TextOptions
            block={block}
            index={index}
            updateBlock={
              updateBlock
            }
          />

        </div>

      )}


      {/* =====================================================
          LIST
      ===================================================== */}

      {[
        "list",
        "number_list",
      ].includes(
        block.type
      ) && (

        <div>

          <label className="mb-3 block text-sm font-medium">
            List Items
          </label>


          <div className="space-y-2">

            {block.list_items.map(
              (
                item,
                itemIndex
              ) => (

                <div
                  key={
                    itemIndex
                  }
                  className="flex items-center gap-2"
                >

                  <span className="w-6 text-center text-sm text-gray-400">

                    {block.type ===
                    "number_list"
                      ? `${itemIndex + 1}.`
                      : "•"}

                  </span>


                  <input
                    className={
                      inputClass
                    }
                    value={
                      item
                    }
                    onChange={(e) =>
                      updateListItem(
                        index,
                        itemIndex,
                        e.target.value
                      )
                    }
                    placeholder="List item"
                  />


                  <button
                    type="button"
                    onClick={() =>
                      deleteListItem(
                        index,
                        itemIndex
                      )
                    }
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  >

                    <Trash2 size={15} />

                  </button>

                </div>

              )
            )}

          </div>


          <button
            type="button"
            onClick={() =>
              addListItem(
                index
              )
            }
            className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600"
          >

            <Plus size={15} />

            Add Item

          </button>

        </div>

      )}


      {/* =====================================================
          IMAGE
      ===================================================== */}

      {block.type ===
        "image" && (

        <div className="space-y-4">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Content Image
            </label>


            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleContentImage(
                  index,
                  e.target.files?.[0]
                )
              }
              className="block w-full rounded-lg border p-2 text-sm"
            />

          </div>


          {contentImage && (

            <img
              src={URL.createObjectURL(
                contentImage
              )}
              alt="Content preview"
              className="max-h-72 rounded-xl border object-contain"
            />

          )}


          <div className="grid gap-4 md:grid-cols-2">

            <Input
              label="Caption"
              value={
                block.media?.caption ||
                ""
              }
              onChange={(e) =>
                updateBlock(
                  index,
                  "media",
                  {
                    ...block.media,
                    caption:
                      e.target.value,
                  }
                )
              }
            />


            <Input
              label="Alt Text"
              value={
                block.media?.alt ||
                ""
              }
              onChange={(e) =>
                updateBlock(
                  index,
                  "media",
                  {
                    ...block.media,
                    alt:
                      e.target.value,
                  }
                )
              }
            />

          </div>

        </div>

      )}


      {/* =====================================================
          VIDEO
      ===================================================== */}

      {block.type ===
        "video" && (

        <div className="space-y-4">

          <Input
            label="Video URL"
            value={
              block.media?.url ||
              ""
            }
            onChange={(e) =>
              updateBlock(
                index,
                "media",
                {
                  ...block.media,
                  url:
                    e.target.value,
                }
              )
            }
            placeholder="https://www.youtube.com/watch?v=..."
          />


          <Input
            label="Caption"
            value={
              block.media?.caption ||
              ""
            }
            onChange={(e) =>
              updateBlock(
                index,
                "media",
                {
                  ...block.media,
                  caption:
                    e.target.value,
                }
              )
            }
          />

        </div>

      )}


      {/* =====================================================
          TABLE
      ===================================================== */}

      {block.type ===
        "table" && (

        <div className="space-y-4">

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                addTableColumn(
                  index
                )
              }
              className="rounded-lg border px-3 py-2 text-sm text-blue-600"
            >
              + Column
            </button>


            <button
              type="button"
              onClick={() =>
                addTableRow(
                  index
                )
              }
              className="rounded-lg border px-3 py-2 text-sm text-blue-600"
            >
              + Row
            </button>

          </div>


          {block.table.headers.length >
            0 && (

            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>

                  <tr>

                    {block.table.headers.map(
                      (
                        header,
                        colIndex
                      ) => (

                        <th
                          key={
                            colIndex
                          }
                          className="border p-2"
                        >

                          <input
                            className={
                              inputClass
                            }
                            value={
                              header
                            }
                            onChange={(e) => {

                              const headers =
                                [
                                  ...block.table.headers,
                                ];

                              headers[
                                colIndex
                              ] =
                                e.target.value;

                              updateBlock(
                                index,
                                "table",
                                {
                                  ...block.table,
                                  headers,
                                }
                              );

                            }}
                            placeholder="Header"
                          />

                        </th>

                      )
                    )}

                  </tr>

                </thead>


                <tbody>

                  {block.table.rows.map(
                    (
                      row,
                      rowIndex
                    ) => (

                      <tr
                        key={
                          rowIndex
                        }
                      >

                        {row.map(
                          (
                            cell,
                            colIndex
                          ) => (

                            <td
                              key={
                                colIndex
                              }
                              className="border p-2"
                            >

                              <input
                                className={
                                  inputClass
                                }
                                value={
                                  cell
                                }
                                onChange={(e) => {

                                  const rows =
                                    structuredClone(
                                      block.table.rows
                                    );

                                  rows[
                                    rowIndex
                                  ][
                                    colIndex
                                  ] =
                                    e.target.value;

                                  updateBlock(
                                    index,
                                    "table",
                                    {
                                      ...block.table,
                                      rows,
                                    }
                                  );

                                }}
                              />

                            </td>

                          )
                        )}


                        <td className="border p-2">

                          <button
                            type="button"
                            onClick={() =>
                              deleteTableRow(
                                index,
                                rowIndex
                              )
                            }
                            className="text-red-500"
                          >

                            <Trash2
                              size={15}
                            />

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}


      {/* =====================================================
          QUOTE
      ===================================================== */}

      {block.type ===
        "quote" && (

        <div className="space-y-4">

          <textarea
            className={`${inputClass} min-h-[120px]`}
            value={
              block.text
            }
            onChange={(e) =>
              updateBlockText(
                index,
                e.target.value
              )
            }
            placeholder="Write quote..."
          />


          <TextOptions
            block={block}
            index={index}
            updateBlock={
              updateBlock
            }
          />

        </div>

      )}


      {/* =====================================================
          CODE
      ===================================================== */}

      {block.type ===
        "code" && (

        <textarea
          className={`${inputClass} min-h-[220px] font-mono text-sm`}
          value={
            block.text
          }
          onChange={(e) =>
            updateBlock(
              index,
              "text",
              e.target.value
            )
          }
          placeholder="// Write code..."
        />

      )}

    </div>

  );
}


/* =========================================================
   INTERNAL LINK MODAL
========================================================= */

function InternalLinkModal({
  linkModal,
  setLinkModal,
  blogs,
  blogsLoading,
  closeLinkModal,
  saveLink,
}) {

  const selectedBlog =
    blogs.find(
      (blog) =>
        String(
          blog._id
        ) ===
        String(
          linkModal.blogId
        )
    );


  return (

    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b px-5 py-4">

          <div>

            <h2 className="flex items-center gap-2 font-semibold text-gray-900">

              <LinkIcon
                size={18}
                className="text-blue-600"
              />

              {linkModal.linkIndex ===
              null
                ? "Add Internal Link"
                : "Edit Internal Link"}

            </h2>


            <p className="mt-1 text-xs text-gray-500">
              Connect selected text with a blog or CareerVidya page.
            </p>

          </div>


          <button
            type="button"
            onClick={
              closeLinkModal
            }
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >

            <X size={19} />

          </button>

        </div>


        {/* BODY */}

        <div className="space-y-5 p-5">

          {/* SELECTED TEXT */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase text-gray-500">
              Selected Text
            </label>


            <div className="rounded-lg border bg-gray-50 p-3 text-sm font-medium text-gray-800">

              "{linkModal.text}"

            </div>

          </div>


          {/* LINK TYPE */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Link Type
            </label>


            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() =>
                  setLinkModal(
                    (prev) => ({
                      ...prev,
                      linkType:
                        "blog",
                      blogId: "",
                      href: "",
                    })
                  )
                }
                className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
                  linkModal.linkType ===
                  "blog"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-600"
                }`}
              >

                Blog

              </button>


              <button
                type="button"
                onClick={() =>
                  setLinkModal(
                    (prev) => ({
                      ...prev,
                      linkType:
                        "page",
                      blogId: "",
                      href: "",
                    })
                  )
                }
                className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
                  linkModal.linkType ===
                  "page"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-600"
                }`}
              >

                Website Page

              </button>

            </div>

          </div>


          {/* =================================================
              BLOG SELECT
          ================================================= */}

          {linkModal.linkType ===
            "blog" && (

            <div>

              <label className="mb-2 block text-sm font-medium">
                Select Blog
              </label>


              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                value={
                  linkModal.blogId
                }
                onChange={(e) =>
                  setLinkModal(
                    (prev) => ({
                      ...prev,
                      blogId:
                        e.target
                          .value,
                    })
                  )
                }
              >

                <option value="">

                  {blogsLoading
                    ? "Loading blogs..."
                    : "Select internal blog"}

                </option>


                {blogs.map(
                  (blog) => (

                    <option
                      key={
                        blog._id
                      }
                      value={
                        blog._id
                      }
                    >

                      {blog.title}

                    </option>

                  )
                )}

              </select>


              {!blogsLoading &&
                blogs.length ===
                  0 && (

                  <p className="mt-2 text-xs text-red-500">
                    No blogs found.
                  </p>

                )}


              {selectedBlog && (

                <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">

                  <div className="mb-1 text-xs font-semibold text-blue-600">
                    Internal Blog URL
                  </div>


                  <div className="flex items-center gap-2 break-all text-sm text-blue-800">

                    <ExternalLink
                      size={14}
                    />

                    /blog/
                    {
                      selectedBlog.slug
                    }

                  </div>

                </div>

              )}

            </div>

          )}


          {/* =================================================
              WEBSITE PAGE
          ================================================= */}

          {linkModal.linkType ===
            "page" && (

            <div>

              <label className="mb-2 block text-sm font-medium">
                Internal Page URL
              </label>


              <input
                value={
                  linkModal.href
                }
                onChange={(e) =>
                  setLinkModal(
                    (prev) => ({
                      ...prev,
                      href:
                        e.target
                          .value,
                    })
                  )
                }
                placeholder="/course/online-mba"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />


              <p className="mt-2 text-xs text-gray-500">
                Use a relative internal URL, for example:
                <br />
                /course/online-mba
                <br />
                /university
                <br />
                /career-assessment
              </p>


              {linkModal.href && (

                <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">

                  <div className="flex items-center gap-2 text-sm font-medium text-green-700">

                    <ExternalLink
                      size={14}
                    />

                    {linkModal.href}

                  </div>

                </div>

              )}

            </div>

          )}


          {/* POSITION */}

          <div className="grid grid-cols-2 gap-3">

            <div>

              <label className="mb-2 block text-xs font-medium text-gray-500">
                Start Position
              </label>


              <input
                readOnly
                className="w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm"
                value={
                  linkModal.start
                }
              />

            </div>


            <div>

              <label className="mb-2 block text-xs font-medium text-gray-500">
                End Position
              </label>


              <input
                readOnly
                className="w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm"
                value={
                  linkModal.end
                }
              />

            </div>

          </div>

        </div>


        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t px-5 py-4">

          <button
            type="button"
            onClick={
              closeLinkModal
            }
            className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>


          <button
            type="button"
            onClick={
              saveLink
            }
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save Link
          </button>

        </div>

      </div>

    </div>

  );
}


/* =========================================================
   TEXT OPTIONS
========================================================= */

function TextOptions({
  block,
  index,
  updateBlock,
}) {

  return (

    <div className="grid gap-4 md:grid-cols-2">

      <div>

        <label className="mb-2 block text-sm font-medium">
          Alignment
        </label>


        <select
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          value={
            block.align ||
            "left"
          }
          onChange={(e) =>
            updateBlock(
              index,
              "align",
              e.target.value
            )
          }
        >

          <option value="left">
            Left
          </option>

          <option value="center">
            Center
          </option>

          <option value="right">
            Right
          </option>

        </select>

      </div>


      <div>

        <label className="mb-2 block text-sm font-medium">
          Text Color
        </label>


        <div className="flex gap-2">

          <input
            type="color"
            value={
              block.color ||
              "#000000"
            }
            onChange={(e) =>
              updateBlock(
                index,
                "color",
                e.target.value
              )
            }
            className="h-10 w-12 cursor-pointer rounded border"
          />


          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={
              block.color ||
              "#000000"
            }
            onChange={(e) =>
              updateBlock(
                index,
                "color",
                e.target.value
              )
            }
          />

        </div>

      </div>

    </div>

  );
}


/* =========================================================
   SMALL COMPONENTS
========================================================= */

function Card({
  children,
}) {

  return (

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      {children}

    </div>

  );
}


function CardTitle({
  children,
}) {

  return (

    <h2 className="mb-5 text-lg font-bold text-gray-900">

      {children}

    </h2>

  );

}


function Input({
  label,
  value,
  onChange,
  placeholder = "",
}) {

  return (

    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">

        {label}

      </label>


      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </div>

  );

}


function AddBlockButton({
  type,
  onClick,
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600"
    >

      + {type}

    </button>

  );

}


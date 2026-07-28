


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

import React, { useState, useEffect, useRef } from "react";
import api from "@/utlis/api";
import { PlusCircle, Trash2, Upload, Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, Quote, Code2, Link2, Undo2, Redo2, Eraser, Wand2, ChevronDown, ChevronRight, Pencil } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

const STORAGE_KEY = "blogFormDraft"; // localStorage key jaha draft save hoga
const FIELD_HISTORY_KEY = "blogFormFieldHistory"; // localStorage key jaha per-field suggestions save hoti hain
const MAX_SUGGESTIONS_PER_FIELD = 8;

const emptyBlock = () => ({
  type: "paragraph",
  text: "",
  level: 2,
  color: "#000000",
  align: "left",
  list_items: [],
  table: { headers: [], rows: [] },
  media: { caption: "" },
  expanded: true, // UI-only flag: manually-added blocks khulte hain edit ke liye by default
});

const emptyForm = () => ({
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

/* ────────────────────────────────────────────────────────────────────────
   Rich text -> content-block converter.
   Editor me jo bhi likha jaata hai (headings, paragraphs, lists, quotes,
   code, images) usko seedha formData.content ke block-schema me todta hai,
   taaki user ek hi jagah likh sake aur block-by-block form fill na karna pade.
   ──────────────────────────────────────────────────────────────────────── */
function htmlToBlocks(html) {
  if (typeof window === "undefined") return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks = [];

  const pushText = (type, el, extra = {}) => {
    const text = el.textContent.trim();
    if (!text) return;
    blocks.push({ ...emptyBlock(), type, text, expanded: false, ...extra });
  };

  const walk = (parent) => {
    Array.from(parent.children).forEach((el) => {
      const tag = el.tagName.toLowerCase();

      if (/^h[1-6]$/.test(tag)) {
        const level = Number(tag[1]);
        pushText(level <= 2 ? "heading" : "subheading", el, { level });
        return;
      }

      switch (tag) {
        case "p":
          pushText("paragraph", el, { align: el.style.textAlign || "left" });
          return;
        case "ul": {
          const items = Array.from(el.querySelectorAll(":scope > li"))
            .map((li) => li.textContent.trim())
            .filter(Boolean);
          if (items.length) blocks.push({ ...emptyBlock(), type: "list", list_items: items, expanded: false });
          return;
        }
        case "ol": {
          const items = Array.from(el.querySelectorAll(":scope > li"))
            .map((li) => li.textContent.trim())
            .filter(Boolean);
          if (items.length) blocks.push({ ...emptyBlock(), type: "number_list", list_items: items, expanded: false });
          return;
        }
        case "blockquote":
          pushText("quote", el);
          return;
        case "pre":
          if (el.textContent.trim()) blocks.push({ ...emptyBlock(), type: "code", text: el.textContent.trim(), expanded: false });
          return;
        case "img":
          blocks.push({
            ...emptyBlock(),
            type: "image",
            media: { caption: "", alt: el.getAttribute("alt") || "" },
            expanded: true, // image block ko file attach karni hoti hai, isliye khula rahe
          });
          return;
        default:
          // wrapper div/span jaisa kuch mile toh andar dekh lo
          if (el.children.length) walk(el);
          else pushText("paragraph", el);
      }
    });
  };

  walk(doc.body);
  return blocks;
}

/* ────────────────────────────────────────────────────────────────────────
   QuickWriteEditor: ek chhota WYSIWYG editor (Tiptap based) jisme user
   pura ya kuch bhi content ek saath type/paste kar sakta hai — headings,
   bold/italic, lists, quotes, code, links — phir "Convert to Blocks"
   dabane se woh sab automatically content blocks ban jaate hain.
   ──────────────────────────────────────────────────────────────────────── */
function QuickWriteEditor({ onConvert }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "tiptap-content",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  const btn = (active) =>
    `p-1.5 rounded hover:bg-slate-100 ${active ? "bg-slate-200 text-slate-900" : "text-slate-500"}`;

  const setLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border border-slate-200 rounded-lg bg-white relative z-0">
      {/*
        Yeh CSS Tailwind Typography plugin pe depend nahi karti — isliye
        headings/lists/quotes/code hamesha sahi se dikhenge, plugin
        installed ho ya na ho.
      */}
      <style>{`
        .tiptap-content { min-height: 220px; padding: 10px 12px; cursor: text; outline: none; font-size: 0.9rem; color: #1e293b; }
        .tiptap-content h1 { font-size: 1.6rem; font-weight: 700; margin: 0.6em 0 0.3em; line-height: 1.25; }
        .tiptap-content h2 { font-size: 1.3rem; font-weight: 700; margin: 0.5em 0 0.3em; line-height: 1.3; }
        .tiptap-content h3 { font-size: 1.1rem; font-weight: 600; margin: 0.4em 0 0.25em; line-height: 1.35; }
        .tiptap-content p { margin: 0.45em 0; }
        .tiptap-content ul, .tiptap-content ol { margin: 0.45em 0; padding-left: 1.4em; }
        .tiptap-content ul { list-style: disc; }
        .tiptap-content ol { list-style: decimal; }
        .tiptap-content li { margin: 0.15em 0; }
        .tiptap-content blockquote { border-left: 3px solid #cbd5e1; padding-left: 0.8em; color: #475569; font-style: italic; margin: 0.5em 0; }
        .tiptap-content pre { background: #0f172a; color: #e2e8f0; padding: 0.6em 0.8em; border-radius: 6px; font-family: ui-monospace, monospace; font-size: 0.8rem; overflow-x: auto; margin: 0.5em 0; }
        .tiptap-content code { font-family: ui-monospace, monospace; }
        .tiptap-content a { color: #2563eb; text-decoration: underline; }
        .tiptap-content p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #94a3b8; float: left; height: 0; pointer-events: none; }
      `}</style>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5 relative z-10">
        <button type="button" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))}><Bold size={15} /></button>
        <button type="button" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))}><Italic size={15} /></button>
        <button type="button" title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive("underline"))}><UnderlineIcon size={15} /></button>
        <button type="button" title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive("strike"))}><Strikethrough size={15} /></button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        {[1, 2, 3].map((l) => (
          <button
            key={l}
            type="button"
            title={`Heading ${l}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: l }).run()}
            className={`${btn(editor.isActive("heading", { level: l }))} text-xs font-bold w-7`}
          >
            H{l}
          </button>
        ))}
        <button
          type="button"
          title="Normal text"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`${btn(editor.isActive("paragraph"))} text-xs font-medium px-1.5`}
        >
          P
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button type="button" title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))}><List size={15} /></button>
        <button type="button" title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))}><ListOrdered size={15} /></button>
        <button type="button" title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))}><Quote size={15} /></button>
        <button type="button" title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btn(editor.isActive("codeBlock"))}><Code2 size={15} /></button>
        <button type="button" title="Link" onClick={setLink} className={btn(editor.isActive("link"))}><Link2 size={15} /></button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button type="button" title="Undo" onClick={() => editor.chain().focus().undo().run()} className={btn(false)}><Undo2 size={15} /></button>
        <button type="button" title="Redo" onClick={() => editor.chain().focus().redo().run()} className={btn(false)}><Redo2 size={15} /></button>
        <button type="button" title="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} className={btn(false)}><Eraser size={15} /></button>

        <button
          type="button"
          onClick={() => onConvert(editor)}
          className="ml-auto flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded"
        >
          <Wand2 size={14} /> Convert to Blocks
        </button>
      </div>

      {/* Editor click-area par khud click karke bhi focus le lo, taaki halka sa margin miss hone se click "kaam na kare" jaisa na lage */}
      <div onClick={() => editor.chain().focus().run()} className="relative z-0">
        <EditorContent editor={editor} />
      </div>

      <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-400">
        Headings, paragraphs, lists, quotes, code aur links seedhe blocks me convert ho jayenge. Images sirf placeholder block ban jaayenge — file upload wahi block me jaake manually karna hoga.
      </div>
    </div>
  );
}

export default function BlogForm() {
  const [loading, setLoading] = useState(false);
  const [restoredNotice, setRestoredNotice] = useState(false);
  const [files, setFiles] = useState({
    coverImage: null,
    authorImage: null,
    contentMedia: {},
  });

  // ─── per-field suggestion history (jaise browser ka native "saved values" dropdown) ───
  const [fieldHistory, setFieldHistory] = useState(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = window.localStorage.getItem(FIELD_HISTORY_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (err) {
      return {};
    }
  });

  // Jab user field se bahar click kare (blur), uski value ko us field ki history me add karo
  const rememberValue = (fieldKey, value) => {
    if (!value || !String(value).trim()) return;
    setFieldHistory((prev) => {
      const existing = prev[fieldKey] || [];
      const updated = [value, ...existing.filter((v) => v !== value)].slice(0, MAX_SUGGESTIONS_PER_FIELD);
      const next = { ...prev, [fieldKey]: updated };
      try {
        window.localStorage.setItem(FIELD_HISTORY_KEY, JSON.stringify(next));
      } catch (err) {
        console.warn("Suggestion history save failed:", err);
      }
      return next;
    });
  };

  // Har field ke liye <datalist> options nikalne ka helper
  const suggestionsFor = (fieldKey) => fieldHistory[fieldKey] || [];

  // Lazy init: pehle localStorage se draft padhne ki koshish karo,
  // agar mile toh wahi use karo, warna empty form.
  const [formData, setFormData] = useState(() => {
    if (typeof window === "undefined") return emptyForm();
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.warn("Draft restore failed:", err);
    }
    return emptyForm();
  });

  // Mount ke baad check karo ki kya draft restore hua tha (banner dikhane ke liye)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setRestoredNotice(true);
    } catch (err) {
      // ignore
    }
  }, []);

  // Jab bhi formData change ho, debounce karke localStorage me save karo.
  // (Files ko save nahi karte kyunki File objects serialize nahi ho sakte —
  // sirf text fields ka draft bachta hai, images wapas select karni hongi.)
  const saveTimeout = useRef(null);
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (err) {
        console.warn("Draft save failed:", err);
      }
    }, 400); // 400ms debounce taki har keystroke pe na likhe
    return () => clearTimeout(saveTimeout.current);
  }, [formData]);

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      // ignore
    }
  };

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

  const toggleBlockExpanded = (index) => {
    setFormData((prev) => {
      const updated = structuredClone(prev);
      updated.content[index].expanded = !updated.content[index].expanded;
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

  /* ─── QUICK WRITE -> BLOCKS ─── */
  /*
    Editor se "Convert to Blocks" dabane par uska HTML parse hoke
    formData.content me blocks ki tarah add ho jaata hai. Agar abhi
    sirf ek default khaali paragraph block hai, use replace kar diya
    jaata hai; warna naye blocks end me add ho jaate hain.
  */
  const handleConvertToBlocks = (editor) => {
    const html = editor.getHTML();
    const newBlocks = htmlToBlocks(html);
    if (!newBlocks.length) {
      alert("Editor khaali hai, pehle kuch likhein.");
      return;
    }
    setFormData((prev) => {
      const isDefaultEmpty =
        prev.content.length === 1 && prev.content[0].type === "paragraph" && !prev.content[0].text.trim();
      const content = isDefaultEmpty ? newBlocks : [...prev.content, ...newBlocks];
      return { ...prev, content };
    });
    editor.commands.clearContent();
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
      content: formData.content.map(({ expanded, ...block }) => block), // UI-only flag backend ko nahi jaana chahiye
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
      // Publish ho gaya toh draft ki ab zarurat nahi — clear kar do
      clearDraft();
      setFormData(emptyForm());
      setFiles({ coverImage: null, authorImage: null, contentMedia: {} });
      setRestoredNotice(false);
    } catch (err) {
      console.log(err);
      alert("Upload Failed");
    }

    setLoading(false);
  };

  const handleClearDraft = () => {
    if (!confirm("Saara draft data clear kar dein?")) return;
    clearDraft();
    setFormData(emptyForm());
    setFiles({ coverImage: null, authorImage: null, contentMedia: {} });
    setRestoredNotice(false);
  };

  const inp =
    "border border-slate-300 p-2 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Editor</h1>
        <button
          type="button"
          onClick={handleClearDraft}
          className="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded px-3 py-1.5"
        >
          Clear Draft
        </button>
      </div>

      {restoredNotice && (
        <div className="text-sm bg-amber-50 border border-amber-200 text-amber-700 rounded px-3 py-2 flex items-center justify-between">
          <span>Aapka pehle wala draft restore ho gaya hai.</span>
          <button
            type="button"
            onClick={() => setRestoredNotice(false)}
            className="text-amber-500 hover:text-amber-700 font-medium"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* ── BASIC INFO ── */}
        <Section title="Basic Info">
          <Field label="Custom ID / Slug">
            <input
              className={inp}
              placeholder="url-friendly-id"
              value={formData.custom_id}
              list="dl-custom_id"
              onChange={(e) => handleChange(e, ["custom_id"])}
              onBlur={(e) => rememberValue("custom_id", e.target.value)}
            />
            <datalist id="dl-custom_id">
              {suggestionsFor("custom_id").map((v) => <option key={v} value={v} />)}
            </datalist>
          </Field>
          <Field label="Title">
            <input
              className={inp}
              placeholder="Blog title"
              value={formData.title}
              list="dl-title"
              onChange={(e) => handleChange(e, ["title"])}
              onBlur={(e) => rememberValue("title", e.target.value)}
            />
            <datalist id="dl-title">
              {suggestionsFor("title").map((v) => <option key={v} value={v} />)}
            </datalist>
          </Field>
          <Field label="Category">
            <input
              className={inp}
              placeholder="e.g. Orthopaedics"
              value={formData.category}
              list="dl-category"
              onChange={(e) => handleChange(e, ["category"])}
              onBlur={(e) => rememberValue("category", e.target.value)}
            />
            <datalist id="dl-category">
              {suggestionsFor("category").map((v) => <option key={v} value={v} />)}
            </datalist>
          </Field>
          <Field label="Cover Image">
            <input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, coverImage: e.target.files[0] })} />
            <span className="text-[11px] text-slate-400">Note: images draft me save nahi hoti, refresh ke baad dobara select karni hongi.</span>
          </Field>
        </Section>

        {/* ── AUTHOR ── */}
        <Section title="Author">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name">
              <input
                className={inp}
                placeholder="Author name"
                value={formData.author.name}
                list="dl-author_name"
                onChange={(e) => handleChange(e, ["author", "name"])}
                onBlur={(e) => rememberValue("author_name", e.target.value)}
              />
              <datalist id="dl-author_name">
                {suggestionsFor("author_name").map((v) => <option key={v} value={v} />)}
              </datalist>
            </Field>
            <Field label="Designation">
              <input
                className={inp}
                placeholder="e.g. Senior Cardiologist"
                value={formData.author.designation}
                list="dl-author_designation"
                onChange={(e) => handleChange(e, ["author", "designation"])}
                onBlur={(e) => rememberValue("author_designation", e.target.value)}
              />
              <datalist id="dl-author_designation">
                {suggestionsFor("author_designation").map((v) => <option key={v} value={v} />)}
              </datalist>
            </Field>
            <Field label="Specialization">
              <input
                className={inp}
                placeholder="Area of expertise"
                value={formData.author.specialization}
                list="dl-author_specialization"
                onChange={(e) => handleChange(e, ["author", "specialization"])}
                onBlur={(e) => rememberValue("author_specialization", e.target.value)}
              />
              <datalist id="dl-author_specialization">
                {suggestionsFor("author_specialization").map((v) => <option key={v} value={v} />)}
              </datalist>
            </Field>
            <Field label="Experience">
              <input
                className={inp}
                placeholder="e.g. 10 years"
                value={formData.author.experience}
                list="dl-author_experience"
                onChange={(e) => handleChange(e, ["author", "experience"])}
                onBlur={(e) => rememberValue("author_experience", e.target.value)}
              />
              <datalist id="dl-author_experience">
                {suggestionsFor("author_experience").map((v) => <option key={v} value={v} />)}
              </datalist>
            </Field>
            <Field label="Bio / Description" className="col-span-2">
              <textarea className={`${inp} min-h-[80px] resize-y`} placeholder="Short author bio" value={formData.author.description} onChange={(e) => handleChange(e, ["author", "description"])} />
            </Field>
            <Field label="Author Photo">
              <input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, authorImage: e.target.files[0] })} />
            </Field>
          </div>
        </Section>

        {/* ── CONTENT BLOCKS ── */}
        <Section title="Content Blocks">

          {/* QUICK WRITE (rich text editor -> auto blocks) */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Quick Write (likho, phir blocks me convert karo)</label>
            <QuickWriteEditor onConvert={handleConvertToBlocks} />
          </div>

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

                {/* Block label + collapse toggle + remove */}
                <div className="flex items-center gap-2 mb-1">
                  <button
                    type="button"
                    onClick={() => toggleBlockExpanded(i)}
                    className="text-slate-400 hover:text-slate-600"
                    title={block.expanded ? "Collapse" : "Edit fields"}
                  >
                    {block.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    Block {i + 1} · {BLOCK_TYPE_LABELS[block.type] || block.type}
                  </span>
                  {!block.expanded && (
                    <button
                      type="button"
                      onClick={() => toggleBlockExpanded(i)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeItem(["content"], i)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Collapsed preview — jab tak Edit na dabao, poora field-form nahi dikhta */}
                {!block.expanded && (
                  <button
                    type="button"
                    onClick={() => toggleBlockExpanded(i)}
                    className="w-full text-left"
                  >
                    <BlockPreview block={block} fileName={files.contentMedia[i]?.name} />
                  </button>
                )}

                {block.expanded && (
                  <>
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
                      <input className={inp} placeholder="Main heading" value={block.text} onChange={(e) => handleChange(e, ["content", i, "text"])} />
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
                      <input className={inp} placeholder="Subheading text" value={block.text} onChange={(e) => handleChange(e, ["content", i, "text"])} />
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
                      <textarea className={`${inp} min-h-[100px] resize-y`} placeholder="Paragraph content" value={block.text} onChange={(e) => handleChange(e, ["content", i, "text"])} />
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
                        value={block.text}
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
                      <textarea className={`${inp} min-h-[72px] resize-y`} placeholder="Image caption" value={block.media?.caption || ""} onChange={(e) => handleChange(e, ["content", i, "media", "caption"])} />
                    </Field>
                    <Field label="Alt Text">
                      <input className={inp} placeholder="Describe the image" value={block.media?.alt || ""} onChange={(e) => handleChange(e, ["content", i, "media", "alt"])} />
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
                      <input className={inp} placeholder="https://youtube.com/..." value={block.media?.url || ""} onChange={(e) => handleChange(e, ["content", i, "media", "url"])} />
                    </Field>
                    <Field label="Caption">
                      <input className={inp} placeholder="Video caption" value={block.media?.caption || ""} onChange={(e) => handleChange(e, ["content", i, "media", "caption"])} />
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
                  </>
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
                  <input className={inp} placeholder="Enter question" value={faq.question} onChange={(e) => handleChange(e, ["faqs", i, "question"])} />
                </Field>
                <Field label="Answer">
                  <textarea className={`${inp} min-h-[80px] resize-y`} placeholder="Enter answer" value={faq.answer} onChange={(e) => handleChange(e, ["faqs", i, "answer"])} />
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
            <input
              className={inp}
              placeholder="50–60 chars recommended"
              value={formData.seo.meta_title}
              list="dl-meta_title"
              onChange={(e) => handleChange(e, ["seo", "meta_title"])}
              onBlur={(e) => rememberValue("meta_title", e.target.value)}
            />
            <datalist id="dl-meta_title">
              {suggestionsFor("meta_title").map((v) => <option key={v} value={v} />)}
            </datalist>
          </Field>
          <Field label="Meta Description">
            <textarea className={`${inp} min-h-[80px] resize-y`} placeholder="150–160 chars recommended" value={formData.seo.meta_desc} onChange={(e) => handleChange(e, ["seo", "meta_desc"])} />
          </Field>
          <Field label="Keywords (comma-separated)">
            <input
              className={inp}
              placeholder="keyword1, keyword2, keyword3"
              value={formData.seo.keywords}
              list="dl-keywords"
              onChange={(e) => handleChange(e, ["seo", "keywords"])}
              onBlur={(e) => rememberValue("keywords", e.target.value)}
            />
            <datalist id="dl-keywords">
              {suggestionsFor("keywords").map((v) => <option key={v} value={v} />)}
            </datalist>
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
const BLOCK_TYPE_LABELS = {
  heading: "Heading",
  subheading: "Subheading",
  paragraph: "Paragraph",
  list: "Bullet List",
  number_list: "Numbered List",
  image: "Image",
  video: "Video",
  table: "Table",
  quote: "Quote",
  code: "Code",
};

// Block ka chhota sa "isko dekhoge toh blog me kaisa lagega" preview,
// taaki collapsed state me poora field-form dobara na dikhana pade.
function BlockPreview({ block, fileName }) {
  const empty = <span className="text-slate-400 italic">Khaali — edit karke bharo</span>;

  switch (block.type) {
    case "heading":
    case "subheading":
      return (
        <div
          className={`font-semibold text-slate-800 ${block.align === "center" ? "text-center" : block.align === "right" ? "text-right" : ""}`}
          style={{ color: block.color, fontSize: `${Math.max(22 - (block.level || 2) * 2, 13)}px` }}
        >
          {block.text || empty}
        </div>
      );
    case "paragraph":
      return (
        <p className={`text-sm text-slate-600 line-clamp-2 ${block.align === "center" ? "text-center" : block.align === "right" ? "text-right" : block.align === "justify" ? "text-justify" : ""}`}>
          {block.text || empty}
        </p>
      );
    case "quote":
      return <blockquote className="text-sm italic text-slate-600 border-l-2 border-slate-300 pl-3" style={{ color: block.color }}>{block.text ? `"${block.text}"` : empty}</blockquote>;
    case "code":
      return <pre className="text-xs font-mono bg-slate-900 text-slate-100 rounded p-2 overflow-x-auto line-clamp-3">{block.text || "// empty"}</pre>;
    case "list":
    case "number_list":
      return block.list_items?.length ? (
        <ul className="text-sm text-slate-600 list-disc pl-5 space-y-0.5">
          {block.list_items.slice(0, 3).map((it, idx) => <li key={idx}>{it || "…"}</li>)}
          {block.list_items.length > 3 && <li className="text-slate-400">+{block.list_items.length - 3} more</li>}
        </ul>
      ) : empty;
    case "image":
      return (
        <div className="text-sm text-slate-600">
          {fileName ? <span className="text-green-700">✓ {fileName}</span> : <span className="text-amber-600">Koi file attach nahi</span>}
          {block.media?.caption && <span className="text-slate-400"> — {block.media.caption}</span>}
        </div>
      );
    case "video":
      return <div className="text-sm text-slate-600 truncate">{block.media?.url || empty}</div>;
    case "table":
      return (
        <div className="text-sm text-slate-600">
          {block.table?.headers?.length ? `${block.table.headers.length} columns · ${block.table.rows.length} rows` : empty}
        </div>
      );
    default:
      return empty;
  }
}

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
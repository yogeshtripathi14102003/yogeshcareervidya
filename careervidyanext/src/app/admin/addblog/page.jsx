

"use client";

import React, { useState } from "react";
import api from "@/utlis/api";
import { PlusCircle, Trash2 } from "lucide-react";

export default function BlogForm() {

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState({
    coverImage: null,
    authorImage: null,
    contentMedia: {}
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
      description: ""
    },
    content: [
      {
        type: "paragraph",
        text: "",
        level: 2,
        color: "#000000",
        align: "left",
        list_items: [],
        table: { headers: [], rows: [] },
        media: { caption: "" }
      }
    ],
    faqs: [{ question: "", answer: "" }],
    seo: {
      meta_title: "",
      meta_desc: "",
      keywords: ""
    }
  });

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e, path) => {
    const value = e.target.value;
    setFormData(prev => {
      const updated = structuredClone(prev);
      let ref = updated;
      path.forEach((key, i) => {
        if (i === path.length - 1) {
          ref[key] = value;
        } else {
          ref = ref[key];
        }
      });
      return updated;
    });
  };

  /* ================= ADD ITEM ================= */
  const addItem = (path, item) => {
    setFormData(prev => {
      const updated = structuredClone(prev);
      let ref = updated;
      path.forEach(k => (ref = ref[k]));
      ref.push(item);
      return updated;
    });
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = (path, index) => {
    setFormData(prev => {
      const updated = structuredClone(prev);
      let ref = updated;
      path.forEach(k => (ref = ref[k]));
      ref.splice(index, 1);
      return updated;
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    const payload = {
      ...formData,
      seo: {
        ...formData.seo,
        keywords: formData.seo.keywords.split(",").map(k => k.trim())
      }
    };

    data.append("jsonData", JSON.stringify(payload));

    if (files.coverImage) data.append("coverImage", files.coverImage);
    if (files.authorImage) data.append("authorImage", files.authorImage);

    /* 🔥 ONLY FIX (IMPORTANT) */
    formData.content.forEach((block, index) => {
      if (block.type === "image" && files.contentMedia[index]) {
        data.append("contentImages", files.contentMedia[index]);
      }
    });

    try {
      await api.post("/api/v1/blog", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Blog Created Successfully");
    } catch (err) {
      console.log(err);
      alert("Upload Failed");
    }

    setLoading(false);
  };

  const input = "border p-2 rounded w-full";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Blog Editor</h1>
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* BASIC */}
        <div className="space-y-3">
          <input className={input} placeholder="Custom ID" onChange={e => handleChange(e, ["custom_id"])} />
          <input className={input} placeholder="Title" onChange={e => handleChange(e, ["title"])} />
          <input className={input} placeholder="Category" onChange={e => handleChange(e, ["category"])} />
          <input type="file" onChange={e => setFiles({ ...files, coverImage: e.target.files[0] })} />
        </div>

        {/* AUTHOR */}
        <div className="space-y-3">
          <h2 className="font-bold">Author</h2>
          <input className={input} placeholder="Name" onChange={e => handleChange(e, ["author", "name"])} />
          <input className={input} placeholder="Experience" onChange={e => handleChange(e, ["author", "experience"])} />
          <input className={input} placeholder="Specialization" onChange={e => handleChange(e, ["author", "specialization"])} />
          <input className={input} placeholder="Designation" onChange={e => handleChange(e, ["author", "designation"])} />
          <textarea className={input} placeholder="Description" onChange={e => handleChange(e, ["author", "description"])} />
          <input type="file" onChange={e => setFiles({ ...files, authorImage: e.target.files[0] })} />
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
          <h2 className="font-bold text-lg">Content Blocks</h2>

          {formData.content.map((block, i) => (
            <div key={i} className="border p-4 rounded space-y-3 relative">

              <button type="button" onClick={() => removeItem(["content"], i)} className="absolute right-2 top-2 text-red-500">
                <Trash2 size={18} />
              </button>

              <select value={block.type} onChange={e => handleChange(e, ["content", i, "type"])} className={input}>
                <option value="heading">Heading</option>
                <option value="paragraph">Paragraph</option>
                <option value="list">Bullet List</option>
                <option value="number_list">Numbered List</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="table">Table</option>
                <option value="quote">Quote</option>
                <option value="code">Code</option>
              </select>

              {/* TEXT BLOCK */}
              {["heading", "paragraph", "quote", "code"].includes(block.type) && (
                <>
                  <textarea className={input} placeholder="Text" onChange={e => handleChange(e, ["content", i, "text"])} />
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Color:</label>
                    <input type="color" value={block.color} onChange={e => handleChange(e, ["content", i, "color"])} />
                  </div>
                </>
              )}

              {/* LIST BLOCK */}
              {["list", "number_list"].includes(block.type) && (
                <div className="space-y-2">
                  {block.list_items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input className={input} placeholder="Item" value={item} onChange={e => handleChange(e, ["content", i, "list_items", idx])} />
                      <button type="button" onClick={() => removeItem(["content", i, "list_items"], idx)} className="text-red-500">Delete</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addItem(["content", i, "list_items"], "")} className="text-blue-500 flex gap-2 items-center">
                    <PlusCircle size={16} /> Add Item
                  </button>
                </div>
              )}

              {/* IMAGE BLOCK */}
              {block.type === "image" && (
                <div className="space-y-2">
                  <input type="file" onChange={e => setFiles({
                    ...files,
                    contentMedia: { ...files.contentMedia, [i]: e.target.files[0] }
                  })} />
                  <input className={input} placeholder="Caption" onChange={e => handleChange(e, ["content", i, "media", "caption"])} />
                </div>
              )}

              {/* TABLE BLOCK */}
              {block.type === "table" && (
                <div className="space-y-2 border p-2 rounded">
                  <div className="flex gap-2">
                    {block.table.headers.map((h, hi) => (
                      <input key={hi} className="border p-1 rounded flex-1" placeholder={`Header ${hi+1}`} value={h} onChange={e => handleChange(e, ["content", i, "table", "headers", hi])} />
                    ))}
                    <button type="button" onClick={() => addItem(["content", i, "table", "headers"], "")} className="text-blue-500">+ Header</button>
                  </div>

                  {block.table.rows.map((row, ri) => (
                    <div key={ri} className="flex gap-2 items-center">
                      {row.map((col, ci) => (
                        <input key={ci} className="border p-1 rounded flex-1" placeholder={`Col ${ci+1}`} value={col} onChange={e => handleChange(e, ["content", i, "table", "rows", ri, ci])} />
                      ))}
                      <button type="button" onClick={() => removeItem(["content", i, "table", "rows"], ri)} className="text-red-500">Delete Row</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addItem(["content", i, "table", "rows"], block.table.headers.map(() => ""))} className="text-blue-500">+ Row</button>
                </div>
              )}

            </div>
          ))}

          <button type="button" onClick={() => addItem(["content"], {
            type: "paragraph",
            text: "",
            level: 2,
            color: "#000000",
            align: "left",
            list_items: [],
            table: { headers: [], rows: [] },
            media: { caption: "" }
          })} className="flex gap-2 text-blue-600">
            <PlusCircle size={18} /> Add Block
          </button>
        </div>

        {/* FAQ */}
        <div className="space-y-3">
          <h2 className="font-bold">FAQs</h2>
          {formData.faqs.map((faq, i) => (
            <div key={i} className="space-y-2">
              <input className={input} placeholder="Question" onChange={e => handleChange(e, ["faqs", i, "question"])} />
              <textarea className={input} placeholder="Answer" onChange={e => handleChange(e, ["faqs", i, "answer"])} />
            </div>
          ))}
          <button type="button" onClick={() => addItem(["faqs"], { question: "", answer: "" })} className="text-blue-500">Add FAQ</button>
        </div>

        {/* SEO */}
        <div className="space-y-3">
          <h2 className="font-bold">SEO</h2>
          <input className={input} placeholder="Meta Title" onChange={e => handleChange(e, ["seo", "meta_title"])} />
          <textarea className={input} placeholder="Meta Description" onChange={e => handleChange(e, ["seo", "meta_desc"])} />
          <input className={input} placeholder="Keywords comma separated" onChange={e => handleChange(e, ["seo", "keywords"])} />
        </div>

        <button disabled={loading} className="bg-black text-white px-6 py-3 rounded w-full">
          {loading ? "Publishing..." : "Publish Blog"}
        </button>

      </form>
    </div>
  );
}

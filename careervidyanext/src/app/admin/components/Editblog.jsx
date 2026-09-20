"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utlis/api";
import { PlusCircle, Trash2, Upload, X, Save } from "lucide-react";
import RichTextField from "@/app/admin/components/RichTextField.jsx";

/* ─────────── EMPTY BLOCK ─────────── */
const emptyBlock = () => ({
  type: "paragraph",
  text: "",
  level: 2,
  color: "#000000",
  align: "left",
  list_items: [],
  table: { headers: [], rows: [] },
  media: { caption: "", url: "", alt: "", public_id: "" },
});

/* ─────────── NORMALIZERS (safe autofill) ─────────── */
const normalizeBlock = (b = {}) => ({
  type: b.type || "paragraph",
  text: b.text || "",
  level: b.level ?? 2,
  color: b.color || "#000000",
  align: b.align || "left",
  list_items: Array.isArray(b.list_items) ? b.list_items : [],
  table:
    b.table && typeof b.table === "object"
      ? {
          headers: Array.isArray(b.table.headers) ? b.table.headers : [],
          rows: Array.isArray(b.table.rows) ? b.table.rows : [],
        }
      : { headers: [], rows: [] },
  media:
    b.media && typeof b.media === "object"
      ? {
          url: b.media.url || "",
          caption: b.media.caption || "",
          alt: b.media.alt || "",
          public_id: b.media.public_id || "",
        }
      : { url: "", caption: "", alt: "", public_id: "" },
});

const normalizeBlog = (blog = {}) => ({
  custom_id: blog.custom_id || "",
  title: blog.title || "",
  category: blog.category || "",
  reads: blog.reads ?? 0,
  is_verified: !!blog.is_verified,

  image: {
    url: blog.image?.url || "",
    public_id: blog.image?.public_id || "",
  },

  author: {
    name: blog.author?.name || "",
    experience: blog.author?.experience || "",
    specialization: blog.author?.specialization || "",
    designation: blog.author?.designation || "",
    description: blog.author?.description || "",
    profile_img: {
      url: blog.author?.profile_img?.url || "",
      public_id: blog.author?.profile_img?.public_id || "",
    },
  },

  content:
    Array.isArray(blog.content) && blog.content.length
      ? blog.content.map(normalizeBlock)
      : [emptyBlock()],

  faqs:
    Array.isArray(blog.faqs) && blog.faqs.length
      ? blog.faqs.map((f) => ({
          question: f.question || "",
          answer: f.answer || "",
        }))
      : [{ question: "", answer: "" }],

  seo: {
    meta_title: blog.seo?.meta_title || "",
    meta_desc: blog.seo?.meta_desc || "",
    keywords: Array.isArray(blog.seo?.keywords)
      ? blog.seo.keywords.join(", ")
      : blog.seo?.keywords || "",
  },
});

/* ─────────── MAIN COMPONENT ─────────── */
export default function EditBlog() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [files, setFiles] = useState({
    coverImage: null,
    authorImage: null,
    contentMedia: {},
  });

  const [formData, setFormData] = useState(null);

  /* ─────────── FETCH BLOG ─────────── */
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/blog/${id}`);
        const blog = res.data?.data || res.data;
        console.log("BLOG API RESPONSE:", blog);
        setFormData(normalizeBlog(blog));
      } catch (err) {
        console.error(err);
        setError("Blog load nahi ho paya. Dobara try karein.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  /* ─────────── DEEP PATH SETTERS ─────────── */
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

  const setValueAtPath = (path, value) => {
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

  /* ─────────── BULK IMAGE UPLOAD ─────────── */
  const handleBulkImageUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const imageBlockIndexes = formData.content
      .map((block, i) => (block.type === "image" ? i : null))
      .filter((i) => i !== null);

    const blocksNeeded = selectedFiles.length - imageBlockIndexes.length;
    let updatedContent = structuredClone(formData.content);
    const localIndexes = [...imageBlockIndexes];

    if (blocksNeeded > 0) {
      for (let n = 0; n < blocksNeeded; n++) {
        updatedContent.push({ ...emptyBlock(), type: "image" });
        localIndexes.push(updatedContent.length - 1);
      }
      setFormData((prev) => ({ ...prev, content: updatedContent }));
    }

    const newContentMedia = { ...files.contentMedia };
    selectedFiles.forEach((file, idx) => {
      const blockIndex = localIndexes[idx];
      if (blockIndex !== undefined) newContentMedia[blockIndex] = file;
    });

    setFiles((prev) => ({ ...prev, contentMedia: newContentMedia }));
  };

  /* ─────────── SUBMIT (UPDATE) ─────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();

    // strip runtime-only fields — keep reads + is_verified
    const { _id, __v, createdAt, updatedAt, slug, ...clean } = formData;

    const payload = {
      ...clean,
      seo: {
        ...clean.seo,
        keywords:
          typeof clean.seo.keywords === "string"
            ? clean.seo.keywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
            : clean.seo.keywords,
      },
    };

    data.append("jsonData", JSON.stringify(payload));

    if (files.coverImage) data.append("coverImage", files.coverImage);
    if (files.authorImage) data.append("authorImage", files.authorImage);

    formData.content.forEach((block, index) => {
      if (block.type === "image" && files.contentMedia[index]) {
        data.append("contentImages", files.contentMedia[index]);
        data.append("contentIndex", index);
      }
    });

    try {
      await api.put(`/api/v1/blog/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Blog Updated Successfully");
      router.push("/admin/blogs");
    } catch (err) {
      console.error(err);
      alert("Update Failed");
    } finally {
      setSaving(false);
    }
  };

  /* ─────────── LOADING / ERROR ─────────── */
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 flex items-center justify-center h-96 text-slate-500 text-sm">
        Loading blog…
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4 text-sm">
          {error || "Kuch galat ho gaya."}
        </div>
      </div>
    );
  }

  const inp =
    "border border-slate-300 p-2 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400";

  /* ─────────── UI ─────────── */
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Blog</h1>
        <button
          type="button"
          onClick={() => router.push("/admin/blogs")}
          className="text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded px-3 py-1.5"
        >
          ← Back to Blogs
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* ── BASIC INFO ── */}
        <Section title="Basic Info">
          <Field label="Custom ID / Slug">
            <input
              className={inp}
              placeholder="url-friendly-id"
              value={formData.custom_id}
              onChange={(e) => handleChange(e, ["custom_id"])}
            />
          </Field>

          <Field label="Title">
            <input
              className={inp}
              placeholder="Blog title"
              value={formData.title}
              onChange={(e) => handleChange(e, ["title"])}
            />
          </Field>

          <Field label="Category">
            <input
              className={inp}
              placeholder="e.g. Orthopaedics"
              value={formData.category}
              onChange={(e) => handleChange(e, ["category"])}
            />
          </Field>

          {/* ✅ Reads + Is Verified */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Reads">
              <input
                type="number"
                className={inp}
                value={formData.reads}
                onChange={(e) =>
                  setValueAtPath(["reads"], Number(e.target.value) || 0)
                }
              />
            </Field>

            <Field label="Verified">
              <label className="flex items-center gap-2 mt-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.is_verified}
                  onChange={(e) =>
                    setValueAtPath(["is_verified"], e.target.checked)
                  }
                />
                Mark as verified
              </label>
            </Field>
          </div>

          {/* COVER IMAGE */}
          <Field label="Cover Image">
            {formData.image?.url && (
              <div className="mb-2 relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    files.coverImage
                      ? URL.createObjectURL(files.coverImage)
                      : formData.image.url
                  }
                  alt="cover"
                  className="w-40 h-28 object-cover rounded border"
                />
                {files.coverImage && (
                  <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                    NEW
                  </span>
                )}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFiles((f) => ({ ...f, coverImage: e.target.files[0] }))
              }
            />
            <span className="text-[11px] text-slate-400">
              Naya file select na karo to purani image hi rahegi.
            </span>
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
                onChange={(e) => handleChange(e, ["author", "name"])}
              />
            </Field>
            <Field label="Designation">
              <input
                className={inp}
                placeholder="e.g. Senior Cardiologist"
                value={formData.author.designation}
                onChange={(e) => handleChange(e, ["author", "designation"])}
              />
            </Field>
            <Field label="Specialization">
              <input
                className={inp}
                placeholder="Area of expertise"
                value={formData.author.specialization}
                onChange={(e) => handleChange(e, ["author", "specialization"])}
              />
            </Field>
            <Field label="Experience">
              <input
                className={inp}
                placeholder="e.g. 10 years"
                value={formData.author.experience}
                onChange={(e) => handleChange(e, ["author", "experience"])}
              />
            </Field>
            <Field label="Bio / Description" className="col-span-2">
              <RichTextField
                value={formData.author.description}
                onChange={(val) =>
                  setValueAtPath(["author", "description"], val)
                }
                placeholder="Short author bio…"
                minHeight="80px"
              />
            </Field>

            {/* AUTHOR IMAGE */}
            <Field label="Author Photo">
              {formData.author?.profile_img?.url && (
                <div className="mb-2 relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      files.authorImage
                        ? URL.createObjectURL(files.authorImage)
                        : formData.author.profile_img.url
                    }
                    alt="author"
                    className="w-20 h-20 object-cover rounded-full border"
                  />
                  {files.authorImage && (
                    <span className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFiles((f) => ({ ...f, authorImage: e.target.files[0] }))
                }
              />
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
              Ek saath multiple images select karo. Existing image blocks
              replace ho jayenge, extra images ke liye naye blocks add honge.
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleBulkImageUpload}
              className="text-sm"
            />
            {Object.keys(files.contentMedia).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(files.contentMedia).map(([blockIdx, file]) => (
                  <div
                    key={blockIdx}
                    className="text-xs bg-white border rounded px-2 py-1 flex items-center gap-1"
                  >
                    <span className="text-slate-400">
                      Block {Number(blockIdx) + 1}:
                    </span>
                    <span className="font-medium text-slate-700 max-w-[120px] truncate">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      className="text-red-400 hover:text-red-600 ml-1"
                      onClick={() => {
                        const cm = { ...files.contentMedia };
                        delete cm[blockIdx];
                        setFiles((prev) => ({ ...prev, contentMedia: cm }));
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INDIVIDUAL BLOCKS */}
          <div className="space-y-4 mt-4">
            {formData.content.map((block, i) => (
              <div
                key={i}
                className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative space-y-3"
              >
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

                <Field label="Block Type">
                  <select
                    value={block.type}
                    onChange={(e) =>
                      handleChange(e, ["content", i, "type"])
                    }
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
                      <input
                        className={inp}
                        placeholder="Main heading"
                        value={block.text}
                        onChange={(e) =>
                          handleChange(e, ["content", i, "text"])
                        }
                      />
                    </Field>
                    <Field label="Level (H1–H6)">
                      <select
                        className={inp}
                        value={block.level}
                        onChange={(e) =>
                          handleChange(e, ["content", i, "level"])
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
                        className={inp}
                        value={block.align}
                        onChange={(e) =>
                          handleChange(e, ["content", i, "align"])
                        }
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
                          value={block.color}
                          onChange={(e) =>
                            handleChange(e, ["content", i, "color"])
                          }
                          className="w-10 h-9 rounded border cursor-pointer p-0.5"
                        />
                        <input
                          className={`${inp} w-28`}
                          value={block.color}
                          onChange={(e) =>
                            handleChange(e, ["content", i, "color"])
                          }
                        />
                      </div>
                    </Field>
                  </div>
                )}

                {/* ── SUBHEADING ── */}
                {block.type === "subheading" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Subheading Text" className="col-span-2">
                      <input
                        className={inp}
                        placeholder="Subheading text"
                        value={block.text}
                        onChange={(e) =>
                          handleChange(e, ["content", i, "text"])
                        }
                      />
                    </Field>
                    <Field label="Level (H3–H6)">
                      <select
                        className={inp}
                        value={block.level || 3}
                        onChange={(e) =>
                          handleChange(e, ["content", i, "level"])
                        }
                      >
                        {[3, 4, 5, 6].map((l) => (
                          <option key={l} value={l}>
                            H{l}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Alignment">
                      <select
                        className={inp}
                        value={block.align}
                        onChange={(e) =>
                          handleChange(e, ["content", i, "align"])
                        }
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
                          value={block.color}
                          onChange={(e) =>
                            handleChange(e, ["content", i, "color"])
                          }
                          className="w-10 h-9 rounded border cursor-pointer p-0.5"
                        />
                        <input
                          className={`${inp} w-28`}
                          value={block.color}
                          onChange={(e) =>
                            handleChange(e, ["content", i, "color"])
                          }
                        />
                      </div>
                    </Field>
                  </div>
                )}

                {/* ── PARAGRAPH ── */}
                {block.type === "paragraph" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Text" className="col-span-2">
                      <RichTextField
                        value={block.text}
                        onChange={(val) =>
                          setValueAtPath(["content", i, "text"], val)
                        }
                        placeholder="Paragraph content…"
                      />
                    </Field>
                    <Field label="Alignment">
                      <select
                        className={inp}
                        value={block.align}
                        onChange={(e) =>
                          handleChange(e, ["content", i, "align"])
                        }
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
                          value={block.color}
                          onChange={(e) =>
                            handleChange(e, ["content", i, "color"])
                          }
                          className="w-10 h-9 rounded border cursor-pointer p-0.5"
                        />
                        <input
                          className={`${inp} w-28`}
                          value={block.color}
                          onChange={(e) =>
                            handleChange(e, ["content", i, "color"])
                          }
                        />
                      </div>
                    </Field>
                  </div>
                )}

                {/* ── QUOTE / CODE ── */}
                {["quote", "code"].includes(block.type) && (
                  <div className="space-y-3">
                    <Field
                      label={block.type === "code" ? "Code" : "Quote Text"}
                    >
                      {block.type === "quote" ? (
                        <RichTextField
                          value={block.text}
                          onChange={(val) =>
                            setValueAtPath(["content", i, "text"], val)
                          }
                          placeholder="Quote text…"
                          minHeight="90px"
                        />
                      ) : (
                        <textarea
                          className={`${inp} min-h-[100px] resize-y font-mono text-sm`}
                          placeholder="// code here"
                          value={block.text}
                          onChange={(e) =>
                            handleChange(e, ["content", i, "text"])
                          }
                        />
                      )}
                    </Field>
                    {block.type === "quote" && (
                      <Field label="Text Color">
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={block.color}
                            onChange={(e) =>
                              handleChange(e, ["content", i, "color"])
                            }
                            className="w-10 h-9 rounded border cursor-pointer p-0.5"
                          />
                          <input
                            className={`${inp} w-28`}
                            value={block.color}
                            onChange={(e) =>
                              handleChange(e, ["content", i, "color"])
                            }
                          />
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
                        <div key={idx} className="flex gap-2 items-start">
                          <span className="text-slate-400 text-sm w-5 text-right shrink-0 pt-2">
                            {block.type === "number_list"
                              ? `${idx + 1}.`
                              : "•"}
                          </span>
                          <div className="flex-1">
                            <RichTextField
                              value={item}
                              onChange={(val) =>
                                setValueAtPath(
                                  ["content", i, "list_items", idx],
                                  val
                                )
                              }
                              placeholder={`Item ${idx + 1}…`}
                              minHeight="60px"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(
                                ["content", i, "list_items"],
                                idx
                              )
                            }
                            className="text-red-500 hover:text-red-700 shrink-0 pt-2"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          addItem(["content", i, "list_items"], "")
                        }
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
                    <Field label="Image File" className="col-span-2">
                      {(files.contentMedia[i] || block.media?.url) && (
                        <div className="mb-2 relative inline-block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              files.contentMedia[i]
                                ? URL.createObjectURL(files.contentMedia[i])
                                : block.media.url
                            }
                            alt="block"
                            className="w-32 h-24 object-cover rounded border"
                          />
                          {files.contentMedia[i] && (
                            <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                              NEW
                            </span>
                          )}
                        </div>
                      )}

                      {files.contentMedia[i] ? (
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                          <span>✓ {files.contentMedia[i].name}</span>
                          <button
                            type="button"
                            className="text-red-400 ml-auto"
                            onClick={() => {
                              const cm = { ...files.contentMedia };
                              delete cm[i];
                              setFiles((prev) => ({
                                ...prev,
                                contentMedia: cm,
                              }));
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
                              contentMedia: {
                                ...files.contentMedia,
                                [i]: e.target.files[0],
                              },
                            })
                          }
                        />
                      )}
                    </Field>
                    <Field label="Caption">
                      <textarea
                        className={`${inp} min-h-[72px] resize-y`}
                        placeholder="Image caption"
                        value={block.media?.caption || ""}
                        onChange={(e) =>
                          handleChange(e, ["content", i, "media", "caption"])
                        }
                      />
                    </Field>
                    <Field label="Alt Text">
                      <input
                        className={inp}
                        placeholder="Describe the image"
                        value={block.media?.alt || ""}
                        onChange={(e) =>
                          handleChange(e, ["content", i, "media", "alt"])
                        }
                      />
                    </Field>
                    <Field label="Alignment">
                      <select
                        className={inp}
                        value={block.align}
                        onChange={(e) =>
                          handleChange(e, ["content", i, "align"])
                        }
                      >
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
                      <input
                        className={inp}
                        placeholder="https://youtube.com/..."
                        value={block.media?.url || ""}
                        onChange={(e) =>
                          handleChange(e, ["content", i, "media", "url"])
                        }
                      />
                    </Field>
                    <Field label="Caption">
                      <input
                        className={inp}
                        placeholder="Video caption"
                        value={block.media?.caption || ""}
                        onChange={(e) =>
                          handleChange(e, ["content", i, "media", "caption"])
                        }
                      />
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
                            onChange={(e) =>
                              handleChange(e, [
                                "content",
                                i,
                                "table",
                                "headers",
                                hi,
                              ])
                            }
                          />
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            addItem(
                              ["content", i, "table", "headers"],
                              ""
                            )
                          }
                          className="text-blue-600 text-sm border border-dashed border-blue-300 rounded px-2 py-1 hover:bg-blue-50"
                        >
                          + Header
                        </button>
                      </div>
                    </Field>

                    <Field label="Rows">
                      {block.table.rows.map((row, ri) => (
                        <div
                          key={ri}
                          className="flex gap-2 items-center mb-2"
                        >
                          {row.map((col, ci) => (
                            <input
                              key={ci}
                              className="border border-slate-300 p-1.5 rounded text-sm flex-1"
                              placeholder={`Col ${ci + 1}`}
                              value={col}
                              onChange={(e) =>
                                handleChange(e, [
                                  "content",
                                  i,
                                  "table",
                                  "rows",
                                  ri,
                                  ci,
                                ])
                              }
                            />
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(
                                ["content", i, "table", "rows"],
                                ri
                              )
                            }
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
              <div
                key={i}
                className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                    FAQ {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(["faqs"], i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <Field label="Question">
                  <input
                    className={inp}
                    placeholder="Enter question"
                    value={faq.question}
                    onChange={(e) =>
                      handleChange(e, ["faqs", i, "question"])
                    }
                  />
                </Field>
                <Field label="Answer">
                  <RichTextField
                    value={faq.answer}
                    onChange={(val) =>
                      setValueAtPath(["faqs", i, "answer"], val)
                    }
                    placeholder="Enter answer…"
                  />
                </Field>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addItem(["faqs"], { question: "", answer: "" })
              }
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
              onChange={(e) => handleChange(e, ["seo", "meta_title"])}
            />
          </Field>
          <Field label="Meta Description">
            <textarea
              className={`${inp} min-h-[80px] resize-y`}
              placeholder="150–160 chars recommended"
              value={formData.seo.meta_desc}
              onChange={(e) => handleChange(e, ["seo", "meta_desc"])}
            />
          </Field>
          <Field label="Keywords (comma-separated)">
            <input
              className={inp}
              placeholder="keyword1, keyword2, keyword3"
              value={formData.seo.keywords}
              onChange={(e) => handleChange(e, ["seo", "keywords"])}
            />
          </Field>
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="bg-slate-900 hover:bg-slate-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg w-full font-medium text-sm flex items-center justify-center gap-2"
        >
          <Save size={16} />
          {saving ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}

/* ── HELPERS ── */
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
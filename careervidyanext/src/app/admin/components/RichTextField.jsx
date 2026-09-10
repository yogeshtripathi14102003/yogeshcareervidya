"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Link as LinkIcon, X, ExternalLink, FileText, Trash2 } from "lucide-react";
import api from "@/utlis/api";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

/* =========================================================
   NOTE ON INTERNAL VS EXTERNAL LINKS
   ---------------------------------------------------
   We deliberately do NOT extend Quill's built-in "link"
   format (no custom blot, no separate `import Quill from
   "quill"`). Doing that risks creating a second Quill
   module instance that doesn't share react-quill-new's
   internal format registry — which is what caused the
   "Cannot register bullet" crash.

   Instead we keep the stock link format (a plain href
   string) and decide internal vs external purely from the
   href's shape:
     - starts with "/blog/"  -> internal, same tab
     - anything else         -> external, opens in a new tab
   This needs zero registry changes and is applied both here
   (admin preview) and on the public blog page renderer.
========================================================= */

/* =========================================================
   HELPERS
========================================================= */

// Cursor could be resting inside an existing link with no
// active selection — walk left/right to find the link's
// full text range so edit/remove act on the whole link,
// not just the character under the cursor.
function expandToLinkBounds(editor, index) {
  const fullText = editor.getText();

  let start = index;
  let end = index;

  while (start > 0 && editor.getFormat(start - 1, 1).link) {
    start--;
  }

  while (end < fullText.length && editor.getFormat(end, 1).link) {
    end++;
  }

  return { index: start, length: end - start };
}

const quillFormats = ["header", "bold", "italic", "underline", "list", "link"];

const initialLinkModal = {
  open: false,
  mode: "internal", // "internal" | "external"
  range: null,
  selectedText: "",
  blogId: "",
  customUrl: "",
  isEditingExisting: false,
};

/* =========================================================
   COMPONENT
========================================================= */

export default function RichTextField({ label, value, onChange, placeholder, minHeight = "120px" }) {
  const [showPreview, setShowPreview] = useState(false);

  const quillRef = useRef(null);

  /* -------------------------------------------------------
     BLOG LIST (for the "Internal Blog" link option)
  ------------------------------------------------------- */

  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);

  // Kept in a ref too so the memoized toolbar handler always
  // reads the latest list without needing to re-create the
  // Quill modules object (which would re-init the editor).
  const blogsRef = useRef([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setBlogsLoading(true);

        const res = await api.get("/api/v1/blog");
        const data = res?.data?.data || res?.data?.blogs || [];
        const list = Array.isArray(data) ? data : [];

        if (!cancelled) {
          setBlogs(list);
          blogsRef.current = list;
        }
      } catch (err) {
        console.error("Blog list load failed:", err);
      } finally {
        if (!cancelled) setBlogsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* -------------------------------------------------------
     LINK MODAL STATE
  ------------------------------------------------------- */

  const [linkModal, setLinkModal] = useState(initialLinkModal);

  const closeLinkModal = useCallback(() => {
    setLinkModal(initialLinkModal);
  }, []);

  /* -------------------------------------------------------
     OPEN MODAL — triggered by clicking Quill's link button
     (both for adding a new link and editing an existing one)
  ------------------------------------------------------- */

  const openLinkModal = useCallback(() => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    const selection = editor.getSelection();

    if (!selection) {
      alert("Pehle editor ke andar click ya text select karein.");
      return;
    }

    const formatsAtSelection = editor.getFormat(selection);
    const existingHref = formatsAtSelection.link || "";

    let effectiveRange = selection;

    if (selection.length === 0) {
      if (!existingHref) {
        alert("Link add karne ke liye pehle kuch text select karein.");
        return;
      }
      // Cursor is resting inside an existing link — expand
      // to the link's full range so we edit the whole thing.
      effectiveRange = expandToLinkBounds(editor, selection.index);
    }

    const selectedText = editor.getText(effectiveRange.index, effectiveRange.length);

    const matchedBlog = existingHref
      ? blogsRef.current.find((b) => `/blog/${b.slug}` === existingHref)
      : null;

    setLinkModal({
      open: true,
      mode: matchedBlog ? "internal" : "external",
      range: effectiveRange,
      selectedText,
      blogId: matchedBlog?._id || "",
      customUrl: matchedBlog ? "" : existingHref,
      isEditingExisting: Boolean(existingHref),
    });
  }, []);

  /* -------------------------------------------------------
     APPLY LINK
  ------------------------------------------------------- */

  const applyLink = () => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor || !linkModal.range) return;

    let href = "";

    if (linkModal.mode === "internal") {
      if (!linkModal.blogId) {
        alert("Pehle ek blog select karein.");
        return;
      }

      const blog = blogs.find((b) => String(b._id) === String(linkModal.blogId));

      if (!blog || !blog.slug) {
        alert("Selected blog ka slug nahi mila.");
        return;
      }

      href = `/blog/${blog.slug}`;
    } else {
      const url = linkModal.customUrl.trim();

      if (!url) {
        alert("Please URL enter karein.");
        return;
      }

      const isValid = /^(https?:\/\/|mailto:|tel:|\/)/i.test(url);

      if (!isValid) {
        alert("Valid URL enter karein — https:// se shuru, ya / se shuru relative path.");
        return;
      }

      href = url;
    }

    // Stock Quill link format — plain href string only.
    // Internal-vs-external + new-tab behaviour is derived
    // from the href pattern at render time, not stored here.
    editor.formatText(linkModal.range.index, linkModal.range.length, "link", href, "user");

    closeLinkModal();
  };

  const removeLink = () => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor || !linkModal.range) return;

    editor.formatText(linkModal.range.index, linkModal.range.length, "link", false, "user");

    closeLinkModal();
  };

  /* -------------------------------------------------------
     QUILL MODULES — memoized once so the editor doesn't
     re-init; the toolbar handler stays stable because it
     only touches refs/stable setters (see useCallback above).
  ------------------------------------------------------- */

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
        ],
        handlers: {
          link: openLinkModal,
        },
      },
    }),
    [openLinkModal]
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center bg-gray-50 px-3 py-2 border-b border-gray-200">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <button
          type="button"
          onClick={() => setShowPreview((p) => !p)}
          className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 ml-auto"
        >
          {showPreview ? "✏️ Edit" : "👁️ Preview"}
        </button>
      </div>

      {showPreview ? (
        <div
          className="p-4 prose prose-sm max-w-none bg-white overflow-auto"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: value || "<p class='text-gray-400'>Nothing to preview yet…</p>" }}
        />
      ) : (
        <div className="quill-wrapper">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            modules={modules}
            formats={quillFormats}
          />
        </div>
      )}

      <style jsx global>{`
        .quill-wrapper .ql-toolbar.ql-snow {
          flex-wrap: wrap;
          display: flex;
          border: none;
          border-bottom: 1px solid #e5e7eb;
        }
        .quill-wrapper .ql-container.ql-snow {
          border: none;
        }
        .quill-wrapper .ql-editor {
          min-height: 100px;
        }
        .quill-wrapper .ql-picker {
          overflow: visible;
        }
      `}</style>

      {/* =====================================================
          LINK MODAL
          - "Internal Blog": pick from existing blogs
          - "External URL": type any URL (with/without new tab)
      ===================================================== */}

      {linkModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                  <LinkIcon size={18} className="text-blue-600" />
                  {linkModal.isEditingExisting ? "Edit Link" : "Add Link"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">Selected text ko link karein.</p>
              </div>

              <button
                type="button"
                onClick={closeLinkModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
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
                  "{linkModal.selectedText}"
                </div>
              </div>

              {/* MODE TOGGLE */}
              <div className="flex rounded-lg border border-gray-200 p-1">
                <button
                  type="button"
                  onClick={() => setLinkModal((prev) => ({ ...prev, mode: "internal" }))}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
                    linkModal.mode === "internal"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FileText size={15} />
                  Internal Blog
                </button>
                <button
                  type="button"
                  onClick={() => setLinkModal((prev) => ({ ...prev, mode: "external" }))}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
                    linkModal.mode === "external"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <ExternalLink size={15} />
                  Custom URL
                </button>
              </div>

              {/* INTERNAL: BLOG DROPDOWN */}
              {linkModal.mode === "internal" && (
                <div>
                  <label className="mb-2 block text-sm font-medium">Select Blog</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={linkModal.blogId}
                    onChange={(e) => setLinkModal((prev) => ({ ...prev, blogId: e.target.value }))}
                  >
                    <option value="">
                      {blogsLoading ? "Loading blogs..." : "Select internal blog"}
                    </option>
                    {blogs.map((blog) => (
                      <option key={blog._id} value={blog._id}>
                        {blog.title}
                      </option>
                    ))}
                  </select>

                  {!blogsLoading && blogs.length === 0 && (
                    <p className="mt-2 text-xs text-red-500">No blogs found.</p>
                  )}

                  {linkModal.blogId &&
                    (() => {
                      const blog = blogs.find((b) => String(b._id) === String(linkModal.blogId));
                      if (!blog) return null;

                      return (
                        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                          <div className="mb-1 text-xs font-semibold text-blue-600">Internal URL</div>
                          <div className="flex items-center gap-2 text-sm text-blue-800">
                            <ExternalLink size={14} />
                            <span className="break-all">/blog/{blog.slug}</span>
                          </div>
                        </div>
                      );
                    })()}
                </div>
              )}

              {/* EXTERNAL: CUSTOM URL */}
              {linkModal.mode === "external" && (
                <div>
                  <label className="mb-2 block text-sm font-medium">URL</label>
                  <input
                    type="text"
                    autoFocus
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="https://example.com/page"
                    value={linkModal.customUrl}
                    onChange={(e) => setLinkModal((prev) => ({ ...prev, customUrl: e.target.value }))}
                  />
                  <p className="mt-1.5 text-xs text-gray-400">
                    Koi bhi external URL, ya / se shuru relative path (e.g. /courses/mba). Ye
                    published page par naye tab mein khulega.
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between gap-3 border-t px-5 py-4">
              {linkModal.isEditingExisting ? (
                <button
                  type="button"
                  onClick={removeLink}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={15} />
                  Remove Link
                </button>
              ) : (
                <span />
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeLinkModal}
                  className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyLink}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
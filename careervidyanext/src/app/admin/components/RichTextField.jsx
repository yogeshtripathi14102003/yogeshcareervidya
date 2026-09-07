"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// ✅ Custom toolbar — sirf zaroori options, aur wrap ho jayega chhoti screens pe
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const quillFormats = ["header", "bold", "italic", "underline", "list", "bullet", "link"];

export default function RichTextField({ label, value, onChange, placeholder, minHeight = "120px" }) {
  const [showPreview, setShowPreview] = useState(false);

  // modules object same rakhna zaroori hai warna Quill re-init hota rahega
  const modules = useMemo(() => quillModules, []);

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
    </div>
  );
}
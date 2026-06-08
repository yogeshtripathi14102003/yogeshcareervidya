// 'use client';

// import { useState, useRef } from 'react';

// const COLUMNS = [
//   { col: 'EmpId', req: true },
//   { col: 'Name', req: true },
//   { col: 'Email', req: true },
//   { col: 'Department', req: true },
//   { col: 'Designation', req: true },
//   { col: 'DOB', req: true },
//   { col: 'JoiningDate', req: true },
//   { col: 'Phone', req: false },
// ];

// export default function UploadPage() {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState('');
//   const [dragOver, setDragOver] = useState(false);

//   const inputRef = useRef(null);

//   const API_BASE =
//     process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

//   function pickFile(f) {
//     setFile(f);
//     setResult(null);
//     setError('');
//   }

//   function handleDrop(e) {
//     e.preventDefault();
//     setDragOver(false);

//     const f = e.dataTransfer.files?.[0];
//     if (f) pickFile(f);
//   }

//   async function handleUpload() {
//     if (!file) {
//       setError('Please select a file');
//       return;
//     }

//     setUploading(true);
//     setError('');
//     setResult(null);

//     try {
//       const fd = new FormData();
//       fd.append('file', file);

//       const res = await fetch(
//         `${API_BASE}/api/v1/employees/upload`,
//         {
//           method: 'POST',
//           body: fd,
//         }
//       );

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         throw new Error(
//           data.error ||
//           data.message ||
//           'Upload failed'
//         );
//       }

//       setResult(data);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || 'Upload failed');
//     } finally {
//       setUploading(false);
//     }
//   }

//   function downloadTemplate() {
//     window.open(
//       `${API_BASE}/api/v1/employees/upload/template`,
//       '_blank'
//     );
//   }

//  return (
//   <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
//     <div className="mx-auto max-w-7xl">

//       {/* Header */}
//       <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">
//             Employee Bulk Upload
//           </h1>
//           <p className="mt-1 text-sm text-slate-500">
//             Import employee records into your HRMS system using Excel or CSV files
//           </p>
//         </div>

//         <button
//           onClick={downloadTemplate}
//           className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
//         >
//           ⬇ Download Template
//         </button>
//       </div>

//       {/* Stats */}
//       {result && (
//         <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <p className="text-sm text-slate-500">Total Records</p>
//             <h3 className="mt-2 text-3xl font-bold text-slate-900">
//               {result.total || 0}
//             </h3>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <p className="text-sm text-slate-500">Imported Successfully</p>
//             <h3 className="mt-2 text-3xl font-bold text-green-600">
//               {result.created || 0}
//             </h3>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <p className="text-sm text-slate-500">Failed / Skipped</p>
//             <h3 className="mt-2 text-3xl font-bold text-red-500">
//               {result.skipped || 0}
//             </h3>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

//         {/* Left Section */}
//         <div className="xl:col-span-2">

//           {/* Upload Card */}
//           <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

//             <div className="mb-6">
//               <h2 className="text-xl font-semibold text-slate-900">
//                 Upload Employee File
//               </h2>
//               <p className="mt-1 text-sm text-slate-500">
//                 Supported formats: XLSX, XLS, CSV (Maximum 10MB)
//               </p>
//             </div>

//             {/* Dropzone */}
//             <div
//               onDrop={handleDrop}
//               onDragOver={(e) => {
//                 e.preventDefault();
//                 setDragOver(true);
//               }}
//               onDragLeave={() => setDragOver(false)}
//               onClick={() => inputRef.current?.click()}
//               className={`cursor-pointer rounded-3xl border-2 border-dashed p-16 text-center transition-all duration-300 ${
//                 dragOver
//                   ? "border-yellow-500 bg-yellow-50"
//                   : file
//                   ? "border-green-300 bg-green-50"
//                   : "border-slate-300 hover:border-slate-400"
//               }`}
//             >
//               <input
//                 ref={inputRef}
//                 type="file"
//                 accept=".xlsx,.xls,.csv"
//                 className="hidden"
//                 onChange={(e) => {
//                   if (e.target.files?.[0]) {
//                     pickFile(e.target.files[0]);
//                   }
//                 }}
//               />

//               {!file ? (
//                 <>
//                   <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
//                     📂
//                   </div>

//                   <h3 className="text-lg font-semibold text-slate-900">
//                     Drag & Drop Your File Here
//                   </h3>

//                   <p className="mt-2 text-sm text-slate-500">
//                     or click anywhere to browse files
//                   </p>
//                 </>
//               ) : (
//                 <>
//                   <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
//                     📊
//                   </div>

//                   <h3 className="text-lg font-semibold text-slate-900">
//                     {file.name}
//                   </h3>

//                   <p className="mt-2 text-sm text-slate-500">
//                     {(file.size / 1024).toFixed(2)} KB
//                   </p>
//                 </>
//               )}
//             </div>

//             {/* Actions */}
//             {file && (
//               <div className="mt-6 flex flex-col gap-3 sm:flex-row">
//                 <button
//                   onClick={() => {
//                     setFile(null);
//                     setResult(null);
//                     setError("");
//                   }}
//                   className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
//                 >
//                   Clear Selection
//                 </button>

//                 <button
//                   disabled={uploading}
//                   onClick={handleUpload}
//                   className="flex-1 rounded-xl bg-[#111827] px-5 py-3 font-semibold text-[#f0d060] transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {uploading
//                     ? "Processing Upload..."
//                     : "Upload & Import Employees"}
//                 </button>
//               </div>
//             )}

//             {/* Error */}
//             {error && (
//               <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
//                 {error}
//               </div>
//             )}
//           </div>

//           {/* Result Section */}
//           {result && (
//             <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">

//               <div className="border-b border-slate-100 p-6">
//                 <h2 className="text-xl font-semibold text-slate-900">
//                   Import Results
//                 </h2>
//               </div>

//               <div className="p-6">

//                 {/* Progress */}
//                 <div className="mb-6">
//                   <div className="mb-2 flex justify-between text-sm">
//                     <span className="font-medium text-slate-700">
//                       Success Rate
//                     </span>

//                     <span className="text-slate-500">
//                       {result.total > 0
//                         ? Math.round(
//                             ((result.created || 0) / result.total) * 100
//                           )
//                         : 0}
//                       %
//                     </span>
//                   </div>

//                   <div className="h-3 overflow-hidden rounded-full bg-slate-100">
//                     <div
//                       className="h-full rounded-full bg-green-500 transition-all duration-700"
//                       style={{
//                         width: `${
//                           result.total > 0
//                             ? ((result.created || 0) / result.total) * 100
//                             : 0
//                         }%`,
//                       }}
//                     />
//                   </div>
//                 </div>

//                 {/* Errors */}
//                 {result.errors?.length > 0 && (
//                   <div>
//                     <h3 className="mb-4 font-semibold text-slate-900">
//                       Validation Errors ({result.errors.length})
//                     </h3>

//                     <div className="max-h-80 overflow-auto rounded-xl border border-slate-200">
//                       {result.errors.map((err, index) => (
//                         <div
//                           key={index}
//                           className="border-b border-slate-100 px-4 py-3 text-sm text-red-600 last:border-b-0 hover:bg-red-50"
//                         >
//                           {err}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Panel */}
//         <div className="space-y-6">

//           {/* Columns */}
//           <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//             <h3 className="mb-5 text-lg font-semibold text-slate-900">
//               Required Columns
//             </h3>

//             <div className="space-y-3">
//               {COLUMNS.map((item) => (
//                 <div
//                   key={item.col}
//                   className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
//                 >
//                   <span className="font-mono text-sm font-medium">
//                     {item.col}
//                   </span>

//                   {item.req ? (
//                     <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
//                       Required
//                     </span>
//                   ) : (
//                     <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-600">
//                       Optional
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Tips */}
//           <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//             <h3 className="mb-4 text-lg font-semibold text-slate-900">
//               Upload Guidelines
//             </h3>

//             <ul className="space-y-3 text-sm text-slate-600">
//               <li>✓ First row must contain column headers</li>
//               <li>✓ Duplicate Employee IDs are skipped</li>
//               <li>✓ Maximum upload size is 10MB</li>
//               <li>✓ Invalid rows are skipped automatically</li>
//               <li>✓ Valid rows are imported successfully</li>
//               <li>✓ Dates accepted: YYYY-MM-DD / DD-MM-YYYY</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );
// }

"use client";

import { useState, useRef } from "react";
import api from "@/utlis/api.js";                   // ✅ axios — file upload
import { serverFetch } from "@/utlis/serverFetch.js"; // ✅ serverFetch — template download

const COLUMNS = [
  { col: "EmpId",       req: true  },
  { col: "Name",        req: true  },
  { col: "Email",       req: true  },
  { col: "Department",  req: true  },
  { col: "Designation", req: true  },
  { col: "DOB",         req: true  },
  { col: "JoiningDate", req: true  },
  { col: "Phone",       req: false },
];

export default function UploadPage() {
  const [file,      setFile]      = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState("");
  const [dragOver,  setDragOver]  = useState(false);
  const inputRef = useRef(null);

  function pickFile(f) { setFile(f); setResult(null); setError(""); }

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) pickFile(f);
  }

  // ── Upload via axios (supports interceptor / auth token) ──
  async function handleUpload() {
    if (!file) { setError("Please select a file first"); return; }
    setUploading(true); setError(""); setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await api.post("/api/proxy/api/v1/employees/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res.data?.success) throw new Error(res.data?.message || "Upload failed");
      setResult(res.data);
    } catch (e) {
      setError(e?.response?.data?.error || e?.response?.data?.message || e.message);
    } finally {
      setUploading(false);
    }
  }

  // ── Template download via serverFetch ──
  async function downloadTemplate() {
    try {
      const res = await serverFetch("/api/v1/employees/upload/template");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = "employees_template.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Template download failed: " + e.message);
    }
  }

  const successPct =
    result?.total > 0 ? Math.round((result.created / result.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Employee Bulk Upload</h1>
            <p className="mt-1 text-sm text-slate-500">
              Import employee records using Excel or CSV files
            </p>
          </div>
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            ⬇ Download Template
          </button>
        </div>

        {/* Result Stats */}
        {result && (
          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total Records</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">{result.total || 0}</h3>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Imported Successfully</p>
              <h3 className="mt-2 text-3xl font-bold text-green-600">{result.created || 0}</h3>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Failed / Skipped</p>
              <h3 className="mt-2 text-3xl font-bold text-red-500">{result.skipped || 0}</h3>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

          {/* Left: Upload + Results */}
          <div className="xl:col-span-2 space-y-6">

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Upload Employee File</h2>
                <p className="mt-1 text-sm text-slate-500">Supported: XLSX, XLS, CSV · Max 10 MB</p>
              </div>

              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => inputRef.current?.click()}
                className={`cursor-pointer rounded-3xl border-2 border-dashed p-16 text-center transition-all duration-300 ${
                  dragOver ? "border-yellow-400 bg-yellow-50" :
                  file     ? "border-green-300 bg-green-50"  :
                             "border-slate-300 hover:border-slate-400"
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) pickFile(e.target.files[0]); }}
                />
                {file ? (
                  <>
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">📊</div>
                    <h3 className="text-lg font-semibold text-slate-900">{file.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
                  </>
                ) : (
                  <>
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">📂</div>
                    <h3 className="text-lg font-semibold text-slate-900">Drag & Drop Your File Here</h3>
                    <p className="mt-2 text-sm text-slate-500">or click to browse files</p>
                  </>
                )}
              </div>

              {/* Actions */}
              {file && (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => { setFile(null); setResult(null); setError(""); }}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-yellow-400 hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "⏳ Processing…" : "⬆ Upload & Import Employees"}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  ⚠ {error}
                </div>
              )}
            </div>

            {/* Results */}
            {result && (
              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-5">
                  <h2 className="text-xl font-semibold text-slate-900">Import Results</h2>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">Success Rate</span>
                      <span className="text-slate-500">{successPct}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all duration-700"
                        style={{ width: `${successPct}%` }}
                      />
                    </div>
                  </div>
                  {result.errors?.length > 0 && (
                    <div>
                      <h3 className="mb-3 font-semibold text-slate-900">
                        Validation Errors ({result.errors.length})
                      </h3>
                      <div className="max-h-72 overflow-auto rounded-xl border border-slate-200">
                        {result.errors.map((e, i) => (
                          <div key={i} className="border-b border-slate-100 px-4 py-2.5 text-sm text-red-600 last:border-0 hover:bg-red-50">
                            {e}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Columns + Tips */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Required Columns</h3>
              <div className="space-y-2.5">
                {COLUMNS.map((c) => (
                  <div key={c.col}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <span className="font-mono text-sm font-medium">{c.col}</span>
                    {c.req
                      ? <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-600">Required</span>
                      : <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-500">Optional</span>
                    }
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Upload Guidelines</h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li>✓ First row must be column headers</li>
                <li>✓ Column names are <strong>case-insensitive</strong></li>
                <li>✓ Duplicate Employee IDs are skipped</li>
                <li>✓ Max file size: 10 MB</li>
                <li>✓ Invalid rows are skipped automatically</li>
                <li>✓ Dates: YYYY-MM-DD or DD/MM/YYYY</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



"use client";

import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js";
import * as XLSX from "xlsx";
import { Download, Loader2, AlertCircle } from "lucide-react";

const Allcounslerreport = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  // Report Categories (Excel Columns)
  const REPORT_STATUSES = [
    "Details Shared",
    "Follow-up",
    "Hot Lead",
    "University Issue",
    "Fee Issue",
    "Distance Issue",
    "Language Issue",
    "Not Picked",
    "Admission Done",
  ];

  const fetchCounselors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/counselor");
      if (res.data.success) {
        setCounselors(res.data.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounselors();
  }, []);

  /* ================= DOWNLOAD LOGIC (FORMATTED FOR STATUS) ================= */
  const downloadExcel = async (counselor) => {
    try {
      setDownloadingId(counselor._id);

      // 1. API Call to get leads
      const res = await api.get(`/api/v1/leads/`, {
        params: {
          counselorId: counselor._id,
          month: selectedMonth
        }
      });

      if (res.data.success && res.data.data.length > 0) {
        const allLeads = res.data.data;

        // 2. Data Processing: Count status wise
        // Hum ek object banayenge jisme har status ka count hoga
        const statusCounts = {};
        REPORT_STATUSES.forEach(status => {
          statusCounts[status] = allLeads.filter(lead => lead.status === status).length;
        });

        // 3. Prepare Excel Data (Formatted Row)
        const finalExcelData = [
          {
            "Counselor Name": counselor.name,
            "Month": selectedMonth,
            "Total Leads": allLeads.length,
            ...statusCounts // Yeh saare statuses ko columns bana dega
          }
        ];

        // 4. Create Workbook
        const worksheet = XLSX.utils.json_to_sheet(finalExcelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Performance");

        // 5. Download
        XLSX.writeFile(workbook, `${counselor.name}_Report_${selectedMonth}.xlsx`);
      } else {
        alert("Is mahine is counselor ke paas koi data nahi hai.");
      }
    } catch (err) {
      console.error("Download Error:", err);
      alert("Report download karne mein error aayi.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100 gap-4">
        <div>
          <h3 className="font-bold text-indigo-900">Performance Analytics</h3>
          <p className="text-xs text-indigo-700">Excel report status-wise breakdown ke saath download karein</p>
        </div>
        <input 
          type="month" 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-indigo-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
        />
      </div>

      <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
            <p className="text-gray-500 text-sm">Counselors ki list load ho rahi hai...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-sm font-semibold text-gray-600">Counselor</th>
                <th className="p-4 text-right text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {counselors.map((c) => (
                <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">{c.name}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">{c._id}</div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => downloadExcel(c)}
                      disabled={downloadingId === c._id}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all
                        ${downloadingId === c._id 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95"
                        }`}
                    >
                      {downloadingId === c._id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                      {downloadingId === c._id ? "Calculating..." : "Download Excel"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Allcounslerreport;

// "use client";

// import React, { useState, useEffect } from "react";
// import api from "@/utlis/api.js";
// import * as XLSX from "xlsx";
// import { Download, Loader2, AlertCircle } from "lucide-react";

// const Allcounslerreport = () => {
//   const [counselors, setCounselors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [downloadingId, setDownloadingId] = useState(null);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

//   const fetchCounselors = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/api/v1/counselor");
//       if (res.data.success) {
//         setCounselors(res.data.data);
//       }
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCounselors();
//   }, []);

//   /* ================= DOWNLOAD LOGIC (DETAILED WITH REMARKS) ================= */
//   const downloadExcel = async (counselor) => {
//     try {
//       setDownloadingId(counselor._id);

//       const res = await api.get(`/api/v1/leads/`, {
//         params: {
//           counselorId: counselor._id,
//           month: selectedMonth
//         }
//       });

//       if (res.data.success && res.data.data.length > 0) {
//         const allLeads = res.data.data;

//         // Data ko Excel format ke liye map karna
//         const formattedData = allLeads.map((lead, index) => {
//           // Sabse naya follow-up remark nikalne ke liye logic
//           const lastFollowUp = lead.followUpHistory && lead.followUpHistory.length > 0 
//             ? lead.followUpHistory[lead.followUpHistory.length - 1] 
//             : null;

//           return {
//             "S.No": index + 1,
//             "Date": lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "-",
//             "Student Name": lead.name || "N/A",
//             "Contact": lead.phone || "-",
//             "Email": lead.email || "-",
//             "Current Status": lead.status || "Pending",
//             "Latest Remark": lastFollowUp ? lastFollowUp.remark : "No Remark",
//             "Remark Date": lastFollowUp ? new Date(lastFollowUp.date).toLocaleDateString() : "-",
//             "Counselor": counselor.name
//           };
//         });

//         // Workbook Create karna
//         const worksheet = XLSX.utils.json_to_sheet(formattedData);
        
//         // Column width set karna taaki Remark saaf dikhe
//         const wscols = [
//           {wch: 5},  {wch: 12}, {wch: 20}, {wch: 15}, 
//           {wch: 25}, {wch: 18}, {wch: 40}, {wch: 12}, {wch: 15}
//         ];
//         worksheet['!cols'] = wscols;

//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Leads Detailed Report");

//         // Download Action
//         XLSX.writeFile(workbook, `${counselor.name}_Report_${selectedMonth}.xlsx`);
//       } else {
//         alert("Is mahine is counselor ke paas koi data nahi hai.");
//       }
//     } catch (err) {
//       console.error("Download Error:", err);
//       alert("Report download karne mein error aayi.");
//     } finally {
//       setDownloadingId(null);
//     }
//   };

//   return (
//     <div className="w-full">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100 gap-4">
//         <div>
//           <h3 className="font-bold text-indigo-900 text-lg">Detailed Performance Report</h3>
//           <p className="text-xs text-indigo-700">Leads detail aur latest remarks ke saath Excel download karein</p>
//         </div>
//         <div className="flex flex-col">
//           <label className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Select Report Month</label>
//           <input 
//             type="month" 
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value)}
//             className="border border-indigo-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
//           />
//         </div>
//       </div>

//       <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
//         {loading ? (
//           <div className="p-12 flex flex-col items-center gap-3">
//             <Loader2 className="animate-spin text-indigo-600" size={32} />
//             <p className="text-gray-500 text-sm">Counselors ki list aa rahi hai...</p>
//           </div>
//         ) : (
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-100">
//                 <th className="p-4 text-sm font-semibold text-gray-600">Counselor Name</th>
//                 <th className="p-4 text-right text-sm font-semibold text-gray-600">Download Detail</th>
//               </tr>
//             </thead>
//             <tbody>
//               {counselors.map((c) => (
//                 <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
//                   <td className="p-4">
//                     <div className="font-semibold text-gray-800">{c.name}</div>
//                     <div className="text-xs text-gray-400 font-mono">{c.email}</div>
//                   </td>
//                   <td className="p-4 text-right">
//                     <button
//                       onClick={() => downloadExcel(c)}
//                       disabled={downloadingId === c._id}
//                       className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all
//                         ${downloadingId === c._id 
//                           ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
//                           : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95"
//                         }`}
//                     >
//                       {downloadingId === c._id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
//                       {downloadingId === c._id ? "Fetching Leads..." : "Download Detailed Excel"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Allcounslerreport;
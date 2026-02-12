// "use client";

// import React, { useState, useEffect } from "react";
// import api from "@/utlis/api.js";
// import { 
//   Users, GraduationCap, Calendar, Search, 
//   Loader2, Download, Phone, MapPin 
// } from "lucide-react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const CounselorAdmissions = () => {
//   const [admissions, setAdmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [counselorName, setCounselorName] = useState("");

//   /* ================= FETCH DATA ================= */
//   useEffect(() => {
//     const init = async () => {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         const user = JSON.parse(storedUser);
//         setCounselorName(user.name);
//         await fetchAdmissions(user.name);
//       }
//     };
//     init();
//   }, []);

//   const fetchAdmissions = async (name) => {
//     try {
//       setLoading(true);
//       const res = await api.get("/api/v1/ad");
//       if (res?.data?.success) {
//         const myData = res.data.data.filter(item => item.counselorName === name);
//         setAdmissions(myData);
//       }
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= PDF GENERATION (WITH ACTUAL & CLOSING FEES) ================= */
//   const downloadPDF = (data) => {
//     const doc = new jsPDF();

//     // 1. Header & Title
//     doc.setFontSize(20);
//     doc.setTextColor(255, 102, 0); // Orange
//     doc.text("ADMISSION CONFIRMATION", 14, 20);
    
//     doc.setFontSize(10);
//     doc.setTextColor(100);
//     doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, 28);
//     doc.text(`Counselor Name: ${data.counselorName}`, 14, 33);

//     // 2. Personal Information Table
//     autoTable(doc, {
//       startY: 40,
//       head: [['Field', 'Student Details']],
//       body: [
//         ['Student Name', data.studentName.toUpperCase()],
//         ["Father's Name", data.fatherName || "N/A"],
//         ['Email', data.email],
//         ['Phone', data.phone],
//         ['City', data.city || "N/A"],
//         ['Admission Date', data.admissionDate],
//       ],
//       headStyles: { fillColor: [0, 0, 0] },
//       styles: { cellPadding: 3 }
//     });

//     // 3. Academic Details Table
//     autoTable(doc, {
//       startY: doc.lastAutoTable.finalY + 10,
//       head: [['Academic Field', 'Information']],
//       body: [
//         ['University', data.universityName],
//         ['Course', data.course],
//         ['Branch', data.branch],
//       ],
//       headStyles: { fillColor: [255, 102, 0] }, // Orange Header
//       theme: 'grid'
//     });

//     // 4. Detailed Fees Comparison Table (Actual vs Closing)
//     autoTable(doc, {
//       startY: doc.lastAutoTable.finalY + 10,
//       head: [['Fee Component', 'Actual Fees', 'Closing Fees (Final)']],
//       body: [
//         [
//           'Semester Fees', 
//           `INR ${data.semesterFees} (x ${data.semesterCount})`, 
//           `INR ${data.c_semesterFees} (x ${data.c_semesterCount})`
//         ],
//         [
//           'Registration Fee', 
//           `INR ${data.registrationFee}`, 
//           `INR ${data.c_registrationFee}`
//         ],
//         [
//           'Exam Fee', 
//           `INR ${data.examFees}`, 
//           `INR ${data.c_examFees}`
//         ],
//         [
//           'Discount Applied', 
//           '--', 
//           `(-) INR ${data.c_discount}`
//         ],
//         [
//           'Total Payable Amount', 
//           `INR ${data.totalFees}`, 
//           `INR ${data.c_totalFees}`
//         ],
//       ],
//       headStyles: { fillColor: [40, 40, 40] },
//       columnStyles: { 
//         2: { fontStyle: 'bold', textColor: [180, 0, 0] } // Red for final closing fees
//       }
//     });

//     // 5. Footer
//     const finalY = doc.lastAutoTable.finalY + 25;
//     doc.setFontSize(10);
//     doc.setTextColor(0);
//     doc.text("Authorized Signature:", 14, finalY);
//     doc.text("_______________________", 14, finalY + 5);
//     doc.text("Note: This is a computer-generated document.", 14, finalY + 15);

//     // Save File
//     doc.save(`Admission_${data.studentName.replace(/\s+/g, '_')}.pdf`);
//   };

//   /* ================= SEARCH FILTER ================= */
//   const filteredData = admissions.filter((ad) =>
//     ad.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     ad.course.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white">
//         <Loader2 className="animate-spin text-orange-500" size={40} />
//         <p className="font-black uppercase text-xs tracking-widest animate-pulse text-black">Loading Records...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white pb-10 font-sans">
      
//       {/* HEADER - Flat Design, No Shadow */}
//       <div className="bg-white border-b-2 border-black sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
//             <div className="flex items-center gap-3">
//               <div className="bg-orange-500 p-2 border-2 border-black">
//                 <Users size={20} className="text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-black uppercase tracking-tight text-orange-600 leading-none">
//                   Admissions
//                 </h1>
//                 <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
//                   Counselor: <span className="text-black italic">{counselorName}</span>
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="relative w-full md:w-64">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
//                 <input
//                   type="text"
//                   placeholder="Search students..."
//                   className="w-full pl-9 pr-4 py-2 text-xs border-2 border-black font-bold outline-none focus:bg-orange-50 transition-all"
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <div className="hidden sm:flex  text-black px-3 py-2 border-2 border-black text-[10px] font-black uppercase">
//                 {admissions.length} Admission
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-4 mt-4">
//         {/* TABLE CONTAINER - Flat Borders, No Shadow */}
//         <div className="bg-white border-2 border-black overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest border-b-2 border-black">
//                   <th className="p-4 border-r border-orange-600">Date</th>
//                   <th className="p-4 border-r border-orange-600">Student Details</th>
//                   <th className="p-4 border-r border-orange-600">Course & Uni</th>
//                   <th className="p-4 border-r border-orange-600 text-center">Final Amount</th>
//                   <th className="p-4 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="text-xs">
//                 {filteredData.length > 0 ? (
//                   filteredData.map((ad, index) => (
//                     <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                       <td className="p-4 font-bold text-gray-500">
//                         <div className="flex items-center gap-2">
//                           <Calendar size={14} className="text-orange-500" />
//                           {new Date(ad.admissionDate).toLocaleDateString()}
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <p className="font-black text-black uppercase">{ad.studentName}</p>
//                         <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-0.5">
//                           <Phone size={10} /> {ad.phone}
//                         </p>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex items-center gap-1.5 font-black text-black uppercase">
//                           <GraduationCap size={14} className="text-orange-600 shrink-0" />
//                           <span className="truncate max-w-[120px]">{ad.course}</span>
//                         </div>
//                         <p className="text-[9px] font-bold text-gray-400 mt-0.5 truncate max-w-[150px] italic">{ad.universityName}</p>
//                       </td>
//                       <td className="p-4 text-center">
//                         <p className="text-sm font-black text-black">₹{ad.c_totalFees}</p>
//                         <span className="text-[8px] font-black text-green-600 border border-green-600 px-1.5 py-0.5 uppercase">Confirm</span>
//                       </td>
//                       <td className="p-4 text-center">
//                         <button
//                           onClick={() => downloadPDF(ad)}
//                           className="inline-flex items-center gap-2 bg-white border-2 border-black px-3 py-1.5 hover:bg-black hover:text-white transition-all active:translate-y-[1px]"
//                         >
//                           <Download size={12} />
//                           <span className="text-[10px] font-black uppercase">Slip</span>
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="p-20 text-center">
//                       <p className="font-black uppercase opacity-20 text-xs">No Records Found</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CounselorAdmissions;


"use client";

import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js";
import {
  Users,
  GraduationCap,
  Calendar,
  Search,
  Loader2,
  Download,
  Phone,
} from "lucide-react";

const CounselorAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [counselorName, setCounselorName] = useState("");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCounselorName(user.name);
        await fetchAdmissions(user.name);
      }
    };

    init();
  }, []);

  const fetchAdmissions = async (name) => {
    try {
      setLoading(true);

      const res = await api.get("/api/v1/ad");

      if (res?.data?.success) {
        const myData = res.data.data.filter(
          (item) => item.counselorName === name
        );

        setAdmissions(myData);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PDF GENERATION (DYNAMIC IMPORT) ================= */
  const downloadPDF = async (data) => {
    try {
      // Dynamic Import (Fixes Next.js Build Error)
      const jsPDFModule = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");

      const jsPDF = jsPDFModule.default;
      const autoTable = autoTableModule.default;

      const doc = new jsPDF();

      // ===== Header =====
      doc.setFontSize(20);
      doc.setTextColor(255, 102, 0);
      doc.text("ADMISSION CONFIRMATION", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 28);
      doc.text(`Counselor: ${data.counselorName}`, 14, 33);

      // ===== Student Info =====
      autoTable(doc, {
        startY: 40,
        head: [["Field", "Details"]],
        body: [
          ["Student Name", data.studentName?.toUpperCase()],
          ["Father Name", data.fatherName || "N/A"],
          ["Email", data.email],
          ["Phone", data.phone],
          ["City", data.city || "N/A"],
          ["Admission Date", data.admissionDate],
        ],
        headStyles: { fillColor: [0, 0, 0] },
      });

      // ===== Academic Info =====
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Field", "Info"]],
        body: [
          ["University", data.universityName],
          ["Course", data.course],
          ["Branch", data.branch],
        ],
        headStyles: { fillColor: [255, 102, 0] },
        theme: "grid",
      });

      // ===== Fees Info =====
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Component", "Actual", "Final"]],
        body: [
          [
            "Semester Fees",
            `₹${data.semesterFees}`,
            `₹${data.c_semesterFees}`,
          ],
          [
            "Registration",
            `₹${data.registrationFee}`,
            `₹${data.c_registrationFee}`,
          ],
          ["Exam Fee", `₹${data.examFees}`, `₹${data.c_examFees}`],
          ["Discount", "--", `₹${data.c_discount}`],
          ["Total", `₹${data.totalFees}`, `₹${data.c_totalFees}`],
        ],
        headStyles: { fillColor: [40, 40, 40] },
      });

      // ===== Footer =====
      const finalY = doc.lastAutoTable.finalY + 20;

      doc.setFontSize(10);
      doc.text("Authorized Signature:", 14, finalY);
      doc.text("_____________________", 14, finalY + 6);

      doc.text(
        "Note: Computer Generated Document",
        14,
        finalY + 15
      );

      // ===== Save =====
      doc.save(
        `Admission_${data.studentName.replace(/\s+/g, "_")}.pdf`
      );
    } catch (err) {
      console.error("PDF Error:", err);
      alert("Failed to generate PDF");
    }
  };

  /* ================= SEARCH ================= */
  const filteredData = admissions.filter(
    (ad) =>
      ad.studentName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ad.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="animate-spin text-orange-500" size={40} />
        <p className="font-black text-xs">Loading...</p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-white pb-10">

      {/* HEADER */}
      <div className="border-b-2 border-black sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 border-2 border-black">
              <Users size={20} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-black text-orange-600">
                Admissions
              </h1>
              <p className="text-[10px] text-gray-500">
                Counselor: {counselorName}
              </p>
            </div>
          </div>

          <div className="relative w-64">
            <Search
              size={14}
              className="absolute left-2 top-2.5 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-7 pr-2 py-2 border-2 border-black text-xs"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto p-4">

        <div className="border-2 border-black overflow-x-auto">

          <table className="w-full text-xs">

            <thead className="bg-orange-500 text-white">

              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Student</th>
                <th className="p-3">Course</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredData.length > 0 ? (
                filteredData.map((ad, i) => (
                  <tr key={i} className="border-b">

                    <td className="p-3">
                      {new Date(ad.admissionDate).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <p className="font-bold">{ad.studentName}</p>
                      <p className="text-gray-400">{ad.phone}</p>
                    </td>

                    <td className="p-3">
                      <p className="font-bold">{ad.course}</p>
                      <p className="text-gray-400">
                        {ad.universityName}
                      </p>
                    </td>

                    <td className="p-3 font-bold">
                      ₹{ad.c_totalFees}
                    </td>

                    <td className="p-3 text-center">

                      <button
                        onClick={() => downloadPDF(ad)}
                        className="border-2 border-black px-3 py-1 flex items-center gap-2 mx-auto hover:bg-black hover:text-white"
                      >
                        <Download size={12} />
                        Slip
                      </button>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center">
                    No Records Found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default CounselorAdmissions;

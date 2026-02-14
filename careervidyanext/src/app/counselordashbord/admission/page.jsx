


// "use client";

// import React, { useState, useEffect } from "react";
// import api from "@/utlis/api.js";
// import { Users, Search, Loader2, Download, Phone } from "lucide-react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const CounselorAdmissions = () => {
//   const [admissions, setAdmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [counselorName, setCounselorName] = useState("");

//   // ================= FETCH USER =================
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");

//     if (user?.name) {
//       setCounselorName(user.name);
//       fetchAdmissions(user.name);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   // ================= FETCH ADMISSIONS =================
//   const fetchAdmissions = async (name) => {
//     try {
//       const res = await api.get("/api/v1/ad");

//       if (res?.data?.success) {
//         setAdmissions(
//           res.data.data.filter((ad) => ad.counselorName === name)
//         );
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= AMOUNT CLEANER =================
//   const cleanAmount = (val) => {
//     return String(Math.floor(Number(val || 0)));
//   };

//   // ================= DOWNLOAD PDF =================
//   const downloadPDF = (data) => {
//     const doc = new jsPDF({
//       orientation: "p",
//       unit: "mm",
//       format: "a4",
//       putOnlyUsedFonts: true,
//       compress: true,
//     });

//     // FIX FONT
//     doc.setFont("courier", "normal");

//     // ================= CALCULATIONS =================
//     const semCount = Number(data.semesterCount || 1);

//     const semesterFee = Number(data.c_semesterFees || 0);
//     const examFee = Number(data.c_examFees || 0);
//     const regFee = Number(data.c_registrationFee || 0);
//     const discount = Number(data.c_discount || 0);
//     const closingFees = Number(data.c_totalFees || 0);

//     const totalSemFees = semesterFee * semCount;
//     const totalExamFees = examFee * semCount;

//     // ✅ Subtotal (Before Discount)
//     const subTotal = totalSemFees + totalExamFees + regFee;

//     // Per semester
//     const perSemesterFee = Math.round(closingFees / semCount);

//     // ================= HEADER =================
//     doc.setFontSize(18);
//     doc.setTextColor(249, 115, 22);
//     doc.text("ADMISSION CONFIRMATION SLIP", 14, 20);

//     doc.setFontSize(10);
//     doc.setTextColor(0, 0, 0);

//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 28);
//     doc.text(`Counselor: ${data.counselorName}`, 14, 33);

//     // ================= STUDENT DETAILS =================
//     autoTable(doc, {
//       startY: 40,
//       head: [["Student Details", "Academic Info"]],
//       body: [
//         [
//           `Name: ${data.studentName}
// Father: ${data.fatherName || "N/A"}
// Phone: ${data.phone}
// Email: ${data.email}`,

//           `University: ${data.universityName}
// Course: ${data.course}
// Branch: ${data.branch || "N/A"}
// Total Semesters: ${semCount}`,
//         ],
//       ],
//       theme: "grid",
//       headStyles: { fillColor: [51, 65, 85] },
//     });

//     // ================= FEES TABLE =================
//     autoTable(doc, {
//       startY: doc.lastAutoTable.finalY + 10,
//       head: [["Fee Type", "Calculation", "Final Amount"]],

//       body: [
//         [
//           "Semester Fees",
//           `${semesterFee} x ${semCount}`,
//           `Rs. ${cleanAmount(totalSemFees)}`,
//         ],

//         [
//           "Registration Fee",
//           "One Time",
//           `Rs. ${cleanAmount(regFee)}`,
//         ],

//         [
//           "Exam Fees",
//           `${examFee} x ${semCount}`,
//           `Rs. ${cleanAmount(totalExamFees)}`,
//         ],

//         // ✅ Subtotal
//         [
//           "Subtotal (Before Discount)",
//           "Semester + Exam + Reg.",
//           `Rs. ${cleanAmount(subTotal)}`,
//         ],

//         [
//           "Discount",
//           "Applied",
//           `-Rs. ${cleanAmount(discount)}`,
//         ],

//         // ✅ Final Total
//         [
//           { content: "Final Closing Amount", styles: { fontStyle: "bold" } },
//           "-",
//           {
//             content: `Rs. ${cleanAmount(closingFees)}`,
//             styles: { fontStyle: "bold" },
//           },
//         ],

//         // ✅ Per Semester
//         [
//           {
//             content: "Per Semester Payable",
//             styles: {
//               fontStyle: "bold",
//               textColor: [249, 115, 22],
//             },
//           },

//           "Total / Semesters",

//           {
//             content: `Rs. ${cleanAmount(perSemesterFee)}`,
//             styles: {
//               fontStyle: "bold",
//               textColor: [249, 115, 22],
//             },
//           },
//         ],
//       ],

//       theme: "striped",
//       headStyles: { fillColor: [249, 115, 22] },
//     });

//     // ================= FOOTER =================
//     const summaryY = doc.lastAutoTable.finalY + 15;

//     doc.setFontSize(10);
//     doc.setFont("courier", "bold");

//     doc.text("Note:", 14, summaryY);

//     doc.setFont("courier", "normal");

//     const footerMsg = `1. Subtotal (before discount): Rs. ${cleanAmount(subTotal)}.
// 2. Final payable amount: Rs. ${cleanAmount(closingFees)}.
// 3. Average per semester cost: Rs. ${cleanAmount(perSemesterFee)}.
// 4. Keep this slip for future reference.`;

//     doc.text(footerMsg, 14, summaryY + 5);

//     // ================= SAVE =================
//     doc.save(
//       `Admission_Slip_${data.studentName.replace(/\s+/g, "_")}.pdf`
//     );
//   };

//   // ================= SEARCH =================
//   const filtered = admissions.filter(
//     (ad) =>
//       ad.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ad.course?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // ================= LOADER =================
//   if (loading) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center gap-4">
//         <Loader2 className="animate-spin text-orange-500" size={40} />
//         <p className="font-black text-xs uppercase text-slate-500">
//           Loading Records...
//         </p>
//       </div>
//     );
//   }

//   // ================= UI =================
//   return (
//     <div className="min-h-screen bg-slate-50 pb-10">
//       {/* HEADER */}
//       <header className="bg-white border-b sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
//         <div className="flex items-center gap-3">
//           <div className="bg-orange-100 p-2 rounded-lg">
//             <Users size={20} className="text-orange-600" />
//           </div>

//           <div>
//             <h1 className="text-lg font-bold">My Admissions</h1>

//             <p className="text-[10px] text-slate-400 uppercase font-bold">
//               Counselor:{" "}
//               <span className="text-orange-600">{counselorName}</span>
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Search
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//               size={14}
//             />

//             <input
//               type="text"
//               placeholder="Search students..."
//               className="pl-9 pr-4 py-2 text-xs border rounded-full outline-none focus:ring-2 focus:ring-orange-500/20 w-64"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold">
//             {filtered.length} Records
//           </div>
//         </div>
//       </header>

//       {/* TABLE */}
//       <div className="max-w-7xl mx-auto p-6">
//         <div className="bg-white rounded-xl shadow border overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-slate-50 text-[10px] font-bold uppercase">
//               <tr>
//                 <th className="p-4">Date</th>
//                 <th className="p-4">Student Name</th>
//                 <th className="p-4">Course & University</th>
//                 <th className="p-4 text-center">Final Deal</th>
//                 <th className="p-4 text-right">Download</th>
//               </tr>
//             </thead>

//             <tbody className="text-xs divide-y">
//               {filtered.length ? (
//                 filtered.map((ad, i) => (
//                   <tr key={i} className="hover:bg-slate-50">
//                     <td className="p-4">
//                       {new Date(ad.admissionDate).toLocaleDateString("en-GB")}
//                     </td>

//                     <td className="p-4">
//                       <div className="font-bold">{ad.studentName}</div>

//                       <div className="text-[10px] text-slate-400 flex items-center gap-1">
//                         <Phone size={10} /> {ad.phone}
//                       </div>
//                     </td>

//                     <td className="p-4">
//                       <div className="font-semibold">{ad.course}</div>

//                       <div className="text-[10px] text-orange-600 font-bold uppercase">
//                         {ad.universityName}
//                       </div>
//                     </td>

//                     <td className="p-4 text-center font-bold">
//                       Rs. {cleanAmount(ad.c_totalFees)}
//                     </td>

//                     <td className="p-4 text-right">
//                       <button
//                         onClick={() => downloadPDF(ad)}
//                         className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded text-[10px] font-bold hover:bg-orange-600"
//                       >
//                         <Download size={12} />
//                         Get Slip
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="p-20 text-center text-slate-300 font-bold uppercase"
//                   >
//                     No Admissions Found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CounselorAdmissions;

"use client";

import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js";
import { Users, Search, Loader2, Download, Phone } from "lucide-react";

const CounselorAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [counselorName, setCounselorName] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user?.name) {
      setCounselorName(user.name);
      fetchAdmissions(user.name);
    } else {
      setLoading(false);
    }
  }, []);

  /* ================= FETCH ADMISSIONS ================= */
  const fetchAdmissions = async (name) => {
    try {
      const res = await api.get("/api/v1/ad");

      if (res?.data?.success) {
        setAdmissions(
          res.data.data.filter((ad) => ad.counselorName === name)
        );
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= AMOUNT CLEANER ================= */
  const cleanAmount = (val) => String(Math.floor(Number(val || 0)));

  /* ================= DOWNLOAD PDF (FIXED) ================= */
  const downloadPDF = async (data) => {
    try {
      setPdfLoading(true);

      // ✅ Dynamic Import (Turbopack Fix)
      const { default: jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      doc.setFont("courier", "normal");

      /* ================= CALCULATIONS ================= */
      const semCount = Number(data.semesterCount || 1);

      const semesterFee = Number(data.c_semesterFees || 0);
      const examFee = Number(data.c_examFees || 0);
      const regFee = Number(data.c_registrationFee || 0);
      const discount = Number(data.c_discount || 0);
      const closingFees = Number(data.c_totalFees || 0);

      const totalSemFees = semesterFee * semCount;
      const totalExamFees = examFee * semCount;

      const subTotal = totalSemFees + totalExamFees + regFee;

      const perSemesterFee = Math.round(closingFees / semCount);

      /* ================= HEADER ================= */
      doc.setFontSize(18);
      doc.setTextColor(249, 115, 22);
      doc.text("ADMISSION CONFIRMATION SLIP", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(0);

      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 28);
      doc.text(`Counselor: ${data.counselorName}`, 14, 33);

      /* ================= STUDENT DETAILS ================= */
      autoTable(doc, {
        startY: 40,
        head: [["Student Details", "Academic Info"]],
        body: [
          [
            `Name: ${data.studentName}
Father: ${data.fatherName || "N/A"}
Phone: ${data.phone}
Email: ${data.email}`,

            `University: ${data.universityName}
Course: ${data.course}
Branch: ${data.branch || "N/A"}
Total Semesters: ${semCount}`,
          ],
        ],
        theme: "grid",
        headStyles: { fillColor: [51, 65, 85] },
      });

      /* ================= FEES TABLE ================= */
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Fee Type", "Calculation", "Amount"]],

        body: [
          ["Semester Fees", `${semesterFee} x ${semCount}`, `Rs. ${cleanAmount(totalSemFees)}`],
          ["Registration Fee", "One Time", `Rs. ${cleanAmount(regFee)}`],
          ["Exam Fees", `${examFee} x ${semCount}`, `Rs. ${cleanAmount(totalExamFees)}`],

          ["Subtotal", "-", `Rs. ${cleanAmount(subTotal)}`],

          ["Discount", "-", `-Rs. ${cleanAmount(discount)}`],

          [
            { content: "Final Closing Amount", styles: { fontStyle: "bold" } },
            "-",
            { content: `Rs. ${cleanAmount(closingFees)}`, styles: { fontStyle: "bold" } },
          ],

          [
            {
              content: "Per Semester Payable",
              styles: { fontStyle: "bold", textColor: [249, 115, 22] },
            },
            "Total / Sem",
            {
              content: `Rs. ${cleanAmount(perSemesterFee)}`,
              styles: { fontStyle: "bold", textColor: [249, 115, 22] },
            },
          ],
        ],

        theme: "striped",
        headStyles: { fillColor: [249, 115, 22] },
      });

      /* ================= FOOTER ================= */
      const y = doc.lastAutoTable.finalY + 15;

      doc.setFontSize(10);
      doc.setFont("courier", "bold");
      doc.text("Note:", 14, y);

      doc.setFont("courier", "normal");

      doc.text(
        `1. Subtotal: Rs. ${cleanAmount(subTotal)}
2. Final Amount: Rs. ${cleanAmount(closingFees)}
3. Per Semester: Rs. ${cleanAmount(perSemesterFee)}
4. Keep this slip safe.`,
        14,
        y + 5
      );

      /* ================= SAVE ================= */
      doc.save(`Admission_${data.studentName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF Error:", err);
      alert("PDF Generate Failed!");
    } finally {
      setPdfLoading(false);
    }
  };

  /* ================= SEARCH ================= */
  const filtered = admissions.filter(
    (ad) =>
      ad.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-orange-500" size={40} />
        <p className="font-black text-xs uppercase text-slate-500">
          Loading Records...
        </p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-50 pb-10">

      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">

        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Users size={20} className="text-orange-600" />
          </div>

          <div>
            <h1 className="text-lg font-bold">My Admissions</h1>

            <p className="text-[10px] text-slate-400 uppercase font-bold">
              Counselor:{" "}
              <span className="text-orange-600">{counselorName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />

            <input
              type="text"
              placeholder="Search students..."
              className="pl-9 pr-4 py-2 text-xs border rounded-full outline-none focus:ring-2 focus:ring-orange-500/20 w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold">
            {filtered.length} Records
          </div>

        </div>
      </header>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto p-6">

        <div className="bg-white rounded-xl shadow border overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-slate-50 text-[10px] font-bold uppercase">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Student</th>
                <th className="p-4">Course</th>
                <th className="p-4 text-center">Final</th>
                <th className="p-4 text-right">PDF</th>
              </tr>
            </thead>

            <tbody className="text-xs divide-y">

              {filtered.length ? (
                filtered.map((ad, i) => (

                  <tr key={i} className="hover:bg-slate-50">

                    <td className="p-4">
                      {new Date(ad.admissionDate).toLocaleDateString("en-GB")}
                    </td>

                    <td className="p-4">
                      <div className="font-bold">{ad.studentName}</div>
                      <div className="text-[10px] text-slate-400 flex gap-1">
                        <Phone size={10} /> {ad.phone}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold">{ad.course}</div>
                      <div className="text-[10px] text-orange-600 font-bold uppercase">
                        {ad.universityName}
                      </div>
                    </td>

                    <td className="p-4 text-center font-bold">
                      Rs. {cleanAmount(ad.c_totalFees)}
                    </td>

                    <td className="p-4 text-right">

                      <button
                        disabled={pdfLoading}
                        onClick={() => downloadPDF(ad)}
                        className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded text-[10px] font-bold hover:bg-orange-600 disabled:opacity-50"
                      >
                        <Download size={12} />
                        {pdfLoading ? "Loading..." : "Get Slip"}
                      </button>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-20 text-center text-slate-300 font-bold uppercase"
                  >
                    No Admissions Found
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
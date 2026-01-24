"use client";

import { useState } from "react";
import Image from "next/image";
import Applynow from "../WP/Applynow.jsx"; // Path check karo

const universityData = [
  {
    id: 1,
    name: "OP Jindal Global Online",
    logoSrc: "/images/w6.webp",
    emi: "6875",
    courses: [
      { name: "Online MBA", fees: "1,80,000 – ₹2,00,000", duration: "2 Year" },
      { name: "Online BBA", fees: "2,00,000", duration: "3 Year" },
      { name: "Online BCA", fees: "1,20,000 – ₹2,50,000", duration: "3 Year" },
      { name: "Online MCA", fees: "1,80,000", duration: "2 Year" },
    ],
  },
  {
    id: 2,
    name: "GLA University Online",
    logoSrc: "/images/w5.webp",
    emi: "6000",
    courses: [
      { name: "Online BBA", fees: "52,000 – ₹81,000", duration: "3 Year" },
      { name: "Online BCA", fees: "81,000", duration: "3 Year" },
      { name: "Online MBA", fees: "68,000", duration: "2 Year" },
      { name: "Online MCA", fees: "58,000", duration: "2 Year" },
    ],
  },
  {
    id: 3,
    name: "Chandigarh University Online",
    logoSrc: "/images/W4.webp",
    emi: "6500",
    courses: [
      { name: "Online BBA", fees: "1,31,000 – ₹1,68,000", duration: "3 Year" },
      { name: "Online BCA", fees: "1,28,000 – ₹1,70,000", duration: "3 Year" },
      { name: "Online MBA", fees: "1,50,000 – ₹2,10,000", duration: "2 Year" },
      { name: "Online MCA", fees: "90,000 – ₹1,40,000", duration: "2 Year" },
    ],
  },
  {
    id: 4,
    name: "Amity University Online",
    logoSrc: "/images/amity.webp",
    emi: "No-Cost EMI",
    courses: [
      { name: "Online BBA", fees: "1,65,000", duration: "3 Year" },
      { name: "Online BCA", fees: "1,50,000", duration: "3 Year" },
      { name: "Online MBA", fees: "1,99,000", duration: "2 Year" },
      { name: "Online MCA", fees: "1,70,000", duration: "2 Year" },
    ],
  },
  {
    id: 5,
    name: "Kurukshetra University (KUK) Online",
    logoSrc: "/images/W1.webp",
    emi: "Semester-wise",
    courses: [
      { name: "Online BBA", fees: "72,661", duration: "3 Year" },
      { name: "Online BCA", fees: "72,661", duration: "3 Year" },
      { name: "Online MBA", fees: "98,500 – ₹1,19,800", duration: "2 Year" },
      { name: "Online MCA", fees: "70,000", duration: "2 Year" },
    ],
  },
  {
    id: 6,
    name: "DY Patil University Online",
    logoSrc: "/images/w3.webp",
    emi: "7000",
    courses: [
      { name: "Online BBA", fees: "1,11,000 – ₹1,45,400", duration: "3 Year" },
      { name: "Online BCA", fees: "1,32,000", duration: "3 Year" },
      { name: "Online MBA", fees: "1,70,000 – ₹1,89,400", duration: "2 Year" },
      { name: "Online MCA", fees: "1,40,000", duration: "2 Year" },
    ],
  },
];


const UniversityCard = ({ data, onApplyClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col transition hover:shadow-xl h-fit self-start">
      {/* LOGO */}
      <div className="relative mb-4 rounded-xl border p-4 flex justify-center items-center">
        <Image src={data.logoSrc} alt={data.name} width={190} height={60} className="object-contain" />
      </div>

      {/* NAME */}
      <h3 className="font-bold text-lg text-gray-800 mb-2">{data.name}</h3>

      {/* COURSES */}
      <div className="text-[11px] font-semibold text-gray-700 mb-4 leading-snug">
        {Array.isArray(data.courses) 
          ? data.courses.map((course, i) => (
            <span key={i}>
              {typeof course === "string" ? course : course.name}
              {i !== data.courses.length - 1 && <span className="mx-1 text-gray-400">|</span>}
            </span>
          ))
          : null
        }
      </div>

      {/* EXPAND BUTTON */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer text-xs font-bold text-blue-600 border border-blue-600 rounded-lg py-2 mb-4 hover:bg-blue-600 hover:text-white transition active:scale-95"
      >
        {isExpanded ? "Hide Fees ↑" : "View Online Fees ↓"}
      </button>

      {/* FEES TABLE */}
      {isExpanded && Array.isArray(data.courses) && (
        <div className="border rounded-xl overflow-hidden mb-4">
          <table className="w-full text-[10px]">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-2 py-2 text-left">Course</th>
                <th className="px-2 py-2 text-center">Duration</th>
                <th className="px-2 py-2 text-right">Fees</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.courses.map((c, i) => {
                const isObject = typeof c === "object";
                const name = isObject ? c.name : c;
                const duration = isObject ? c.duration : ["MBA","MCA"].some(d=>c.includes(d)) ? "2 Year" : "3 Year";
                const fees = isObject ? c.fees : parseInt(data.emi) * 12 * (duration === "2 Year" ? 2 : 3);
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-2 py-2 font-semibold text-gray-700">{name}</td>
                    <td className="px-2 py-2 text-center text-gray-500">{duration}</td>
                    <td className="px-2 py-2 text-right font-bold text-blue-600">₹{fees.toLocaleString("en-IN")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* EMI & APPLY */}
      <div className="mt-auto flex justify-between items-center border-t pt-4">
    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
  <span className="text-green-600 text-sm">💳</span>
  <span className="text-[11px] font-bold text-green-700">
    No Cost EMI
  </span>
</div>



        <button 
          onClick={() => onApplyClick(data.name)}
          className="cursor-pointer bg-[#FFC107] text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-600 transition active:scale-95 shadow-md"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default function UniversitySelector() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUni, setSelectedUni] = useState("");

  const handleOpenModal = (name) => {
    setSelectedUni(name);
    setIsModalOpen(true);
  };

  return (
    <section className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        {isModalOpen && (
          <Applynow
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            uniName={selectedUni} 
          />
        )}

        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-gray-900">Online Universities</h2>
          <p className="text-gray-500 italic">Compare & apply for the best online degrees</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {universityData.map((uni) => (
            <UniversityCard key={uni.id} data={uni} onApplyClick={handleOpenModal} />
          ))}
        </div>
      </div>
    </section>
  );
}

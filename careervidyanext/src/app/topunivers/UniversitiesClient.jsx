"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";
import Comparenow from "@/app/topunivers/Comparenow.jsx";

const BASE_URL = process.env.INTERNAL_API_URL || "";

const getFullImageUrl = (path) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
};

export default function UniversitiesClient({ initialData = [] }) {
  const router = useRouter();

  const [universities, setUniversities] = useState(initialData);
  const [showCompareOverlay, setShowCompareOverlay] = useState(false); 
  const [showCompareNowModal, setShowCompareNowModal] = useState(false); 
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(24);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    setIsLoggedIn(!!token);
  }, []);

  /* ================= SORTING LOGIC ================= */
  const sortedUniversities = useMemo(() => {
    const getApprovalsArray = (uni) => {
      const raw = uni.approvals || uni.recognition?.recognitionPoints || [];
      if (!Array.isArray(raw)) return [];
      return raw.map((item) =>
        typeof item === "object" ? (item.name || item.label || "").toUpperCase() : item.toUpperCase()
      );
    };

    const getNaacRank = (approvals) => {
      if (approvals.includes("NAAC A++")) return 1;
      if (approvals.includes("NAAC A+")) return 2;
      if (approvals.includes("NAAC A")) return 3;
      return 4;
    };

    return [...universities].sort((a, b) => {
      const aApprovals = getApprovalsArray(a);
      const bApprovals = getApprovalsArray(b);
      const aNaacRank = getNaacRank(aApprovals);
      const bNaacRank = getNaacRank(bApprovals);

      if (aNaacRank !== bNaacRank) return aNaacRank - bNaacRank;
      if (bApprovals.length !== aApprovals.length) return bApprovals.length - aApprovals.length;
      return (b.courses?.length || 0) - (a.courses?.length || 0);
    });
  }, [universities]);

  const visibleUnis = useMemo(() => sortedUniversities.slice(0, displayLimit), [sortedUniversities, displayLimit]);

  /* ================= HANDLERS ================= */
  const handleDetailsClick = (uni) => {
    if ((uni.courses?.length || 0) < 3) {
      alert("This university details are not available yet.");
      return;
    }
    router.push(`/university/${uni.slug || uni._id}`);
  };

  const handleCompareClick = (uni) => {
    const alreadySelected = selectedForCompare.find((u) => u._id === uni._id);
    if (alreadySelected) {
      setSelectedForCompare(selectedForCompare.filter((u) => u._id !== uni._id));
    } else {
      if (selectedForCompare.length < 3) {
        setSelectedForCompare([...selectedForCompare, uni]);
        setShowCompareOverlay(true);
      } else {
        alert("Maximum 3 Universities allowed.");
      }
    }
  };

  const handleApplyClick = (uni) => {
    if (!selectedForCompare.find((u) => u._id === uni._id)) {
      if (selectedForCompare.length < 3) {
        setSelectedForCompare([...selectedForCompare, uni]);
      }
    }
    setShowCompareNowModal(true);
  };

  return (
    <>
      <Header />

      <div className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]">
        <div className="max-w-[1200px] mx-auto px-4 py-24 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Explore Top Universities in India</h1>
          <p className="max-w-3xl mx-auto text-sm md:text-lg text-white/90 leading-relaxed">
            Compare Approved Universities, Check Courses, And Choose The Best Option For Your Future.
          </p>
        </div>
      </div>

      <section className="py-10 bg-[#F8FAFC] min-h-screen relative">
        <div className="max-w-[1200px] mx-auto px-4 pb-40">
          <div className="text-[#000] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleUnis.map((uni) => {
              const bgUrl = getFullImageUrl(uni.background?.backgroundImage);
              const bannerUrl = getFullImageUrl(uni.universityImage);
              const isSelected = selectedForCompare.find((s) => s._id === uni._id);
              const courseCount = uni.courses?.length || 0;

              return (
                <div key={uni._id} className="bg-white rounded-[1.2rem] border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition">
                  <div onClick={() => handleDetailsClick(uni)} className="w-full h-[190px] relative border-b cursor-pointer">
                    <Image src={bgUrl || "/fallback-bg.png"} alt={uni.name} fill className="object-fill" />
                  </div>

                  <div className="p-3 flex flex-col h-full">
                    <h3 className="text-base font-black mb-2 min-h-[40px] line-clamp-2 text-[#0A1D37]">
                      {uni.name}
                    </h3>

                    <div className="flex justify-between bg-gray-50 p-2 rounded-lg mb-3 gap-2">
                      <div className="flex gap-1 flex-1">
                        <span>🏆</span>
                        <p className="text-[14px] font-bold uppercase line-clamp-3">
                          {Array.isArray(uni.approvals) && uni.approvals.length > 0
                            ? uni.approvals.map(a => typeof a === 'object' ? a.name : a).join(", ")
                            : "Approvals Verified"}
                        </p>
                      </div>
                      {bannerUrl && (
                        <div className="w-16 h-10 bg-white border rounded p-1">
                          <img src={bannerUrl} alt="logo" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1 mb-3 text-[#0056B3] font-bold text-[13px]">
                      📚 {courseCount} Courses
                    </div>

                    <div className="grid grid-cols-3 gap-1 mt-auto">
                      <button onClick={() => handleDetailsClick(uni)} className="bg-[#c15304] cursor-pointer text-white py-2 rounded-lg text-[8px] font-bold uppercase">Details</button>
                      <button onClick={() => handleApplyClick(uni)} className="border border-[#c15304] cursor-pointer text-[#c15304] py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-orange-50">Apply Now</button>
                      <button onClick={() => handleCompareClick(uni)} className={`py-2 rounded-lg text-[8px] cursor-pointer font-bold uppercase transition ${isSelected ? "bg-green-600 text-white" : "bg-[#c15304] text-white"}`}>
                        {isSelected ? "Selected" : "Compare"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {universities.length > displayLimit && (
            <div className="mt-12 flex justify-center">
              <button 
                onClick={() => setDisplayLimit(prev => prev + 12)}
                className="bg-white border-2 border-[#c15304] cursor-pointer text-[#c15304] px-10 py-3 rounded-full font-bold hover:bg-[#c15304] hover:text-white transition shadow-md"
              >
                View More Universities ↓
              </button>
            </div>
          )}
        </div>
      </section>

      {/* TRAY UI */}
      {selectedForCompare.length > 0 && showCompareOverlay && !showCompareNowModal && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] p-6 z-[100] border-t animate-in slide-in-from-bottom duration-300">
          <div className="max-w-[1200px] mx-auto relative text-black">
            <button onClick={() => setShowCompareOverlay(false)} className="absolute -top-2 right-0 p-2 text-gray-400 hover:text-black">
              <X size={24} />
            </button>
            <h2 className="text-center text-xl font-bold mb-6">Add upto 3 Universities</h2>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {selectedForCompare.map((uni) => (
                <div key={uni._id} className="relative w-[260px] bg-white border border-gray-200 rounded-xl p-3 shadow-sm text-center">
                  <button onClick={() => handleCompareClick(uni)} className="absolute top-2 right-2 text-orange-500"><X size={18} /></button>
                  <div className="w-full h-[100px] rounded-lg overflow-hidden mb-2 relative">
                    <img src={getFullImageUrl(uni.background?.backgroundImage) || "/fallback-bg.png"} className="w-full h-full object-cover opacity-40" alt="bg" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img src={getFullImageUrl(uni.universityImage)} className="h-12 w-auto object-contain bg-white p-1 rounded border" alt="logo" />
                    </div>
                  </div>
                  <p className="text-xs font-bold line-clamp-1">{uni.name}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <button onClick={() => setShowCompareNowModal(true)} className="bg-[#E47A0E] text-white px-10 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition">
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR COMPARENOW COMPONENT */}
      {showCompareNowModal && (
        <div className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto relative p-6">
            <button onClick={() => setShowCompareNowModal(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition z-10">
              <X size={24} />
            </button>
            {/* ✅ PASSING SELECTED UNIS TO COMPARENOW */}
            <Comparenow 
               selectedUnis={selectedForCompare} 
               onClose={() => setShowCompareNowModal(false)} 
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
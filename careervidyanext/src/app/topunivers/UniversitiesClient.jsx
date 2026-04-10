"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";
import Comparenow from "@/app/topunivers/Comparenow.jsx";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const getFullImageUrl = (path) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
};

export default function UniversitiesClient({ initialData = [] }) {
  const router = useRouter();

  // ✅ SEO Fix: Initial state mein server data pass kiya
  const [universities, setUniversities] = useState(initialData);
  const [loading, setLoading] = useState(false); // Ab loading default false rahegi
  const [showCompareForm, setShowCompareForm] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(24);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    setIsLoggedIn(!!token);
  }, []);

  /* ================= SORTING LOGIC ================= */
  // Sorting ko useMemo mein rakha hai taaki render fast ho
  const sortedUniversities = useMemo(() => {
    const getApprovalsArray = (uni) => {
      const raw = uni.approvals || uni.recognition?.recognitionPoints || [];
      if (!Array.isArray(raw)) return [];
      return raw.map((item) => typeof item === "object" ? (item.name || item.label || "").toUpperCase() : item.toUpperCase());
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
    if (!selectedForCompare.find((u) => u._id === uni._id)) {
      if (selectedForCompare.length < 3) setSelectedForCompare([...selectedForCompare, uni]);
      else alert("Maximum 3 Universities allowed.");
    }
  };

  const handleApplyClick = (uni) => {
    if (isLoggedIn) router.push(`/comparedetail?ids=${uni._id}`);
    else {
      if (!selectedForCompare.find((u) => u._id === uni._id)) setSelectedForCompare([uni]);
      setShowCompareForm(true);
    }
  };

  return (
    <>
      <Header />
      {/* Banner Section */}
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
          
          {/* ✅ SEO Fix: No more "Loading..." check here. Data will be visible immediately */}
          <div className="text-[#000] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleUnis.map((uni) => {
              const bgUrl = getFullImageUrl(uni.background?.backgroundImage);
              const bannerUrl = getFullImageUrl(uni.universityImage);
              const courseCount = uni.courses?.length || 0;
              const canOpen = courseCount >= 3;

              return (
                <div key={uni._id} className="bg-white rounded-[1.2rem] border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition">
                  <div onClick={() => handleDetailsClick(uni)} className={`w-full h-[190px] relative border-b cursor-pointer ${!canOpen && "opacity-60"}`}>
                    <Image src={bgUrl || "/fallback-bg.png"} alt={uni.name} fill className="object-fill hover:scale-105 transition" priority={false} />
                  </div>

                  <div className="p-3 flex flex-col h-full">
                    <h3 onClick={() => handleDetailsClick(uni)} className={`text-base font-black mb-2 min-h-[40px] line-clamp-2 cursor-pointer ${canOpen ? "text-[#0A1D37] hover:text-blue-700" : "text-gray-400"}`}>
                      {uni.name}
                    </h3>
                    
                    {/* Approvals & Logo */}
                    <div className="flex justify-between bg-gray-50 p-2 rounded-lg mb-3 gap-2">
                      <div className="flex gap-1 flex-1">
                        <span>🏆</span>
                        <p className="text-[14px] font-bold uppercase line-clamp-3">
                          {Array.isArray(uni.approvals) ? uni.approvals.join(", ") : "Approvals Verified"}
                        </p>
                      </div>
                      {bannerUrl && (
                        <div className="w-20 h-13 bg-white border rounded-md p-1">
                          <img src={bannerUrl} alt={`${uni.name} logo`} className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1 mb-3 text-[#0056B3] font-bold text-[13px]">📚 {courseCount} Courses</div>

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-1 mt-auto">
                      <button disabled={!canOpen} onClick={() => handleDetailsClick(uni)} className={`py-2 rounded-lg text-[8px] font-bold uppercase cursor-pointer ${canOpen ? "bg-[#c15304] text-white hover:bg-orange-600" : "bg-gray-200 text-gray-400"}`}>Details</button>
                      <button onClick={() => handleApplyClick(uni)} className="cursor-pointer text-[#000] border py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-gray-100">Apply</button>
                      <button onClick={() => handleCompareClick(uni)} className={`py-2 rounded-lg text-[8px] font-bold uppercase cursor-pointer ${selectedForCompare.find((s) => s._id === uni._id) ? "bg-green-600 text-white" : "bg-[#c15304] text-white"}`}>
                        {selectedForCompare.find((s) => s._id === uni._id) ? "Selected" : "Compare"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View More Logic */}
          {universities.length > 24 && (
            <div className="mt-10 flex justify-center">
              <button onClick={() => setDisplayLimit(prev => prev === 24 ? universities.length : 24)} className="px-8 py-3 rounded-full bg-[#c15304] text-white font-bold hover:bg-orange-600">
                {displayLimit < universities.length ? "View More ↓" : "View Less ↑"}
              </button>
            </div>
          )}
        </div>

        {/* Compare Bar Remains Same */}
      </section>
      <Footer />
    </>
  );
}
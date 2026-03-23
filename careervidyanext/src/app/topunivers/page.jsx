"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/utlis/api.js";
import { X } from "lucide-react";
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";
import Comparenow from "@/app/topunivers/Comparenow.jsx";

/* ================= GLOBAL CACHE ================= */
let globalUniversitiesCache = null;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const getFullImageUrl = (path) => {
  if (!path) return null;

  return path.startsWith("http")
    ? path
    : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
};

export default function UniversitiesPage() {
  const router = useRouter();

  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCompareForm, setShowCompareForm] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  const initialLimit = 24;
  const [displayLimit, setDisplayLimit] = useState(initialLimit);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    setIsLoggedIn(!!token);
  }, []);

  /* ================= FETCH + CACHE ================= */
  const fetchUniversities = async () => {
    // ✅ Cache check
    if (globalUniversitiesCache) {
      setUniversities(globalUniversitiesCache);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/api/v1/university");
      const allUnis = res.data?.data || [];

      const getApprovalsArray = (uni) => {
        const raw =
          uni.approvals ||
          uni.recognition?.recognitionPoints ||
          [];

        if (!Array.isArray(raw)) return [];

        return raw.map((item) =>
          typeof item === "object"
            ? (item.name || item.label || "").toUpperCase()
            : item.toUpperCase()
        );
      };

      const getNaacRank = (approvals) => {
        if (approvals.includes("NAAC A++")) return 1;
        if (approvals.includes("NAAC A+")) return 2;
        if (approvals.includes("NAAC A")) return 3;
        return 4;
      };

      const sorted = allUnis.sort((a, b) => {
        const aApprovals = getApprovalsArray(a);
        const bApprovals = getApprovalsArray(b);

        const aNaacRank = getNaacRank(aApprovals);
        const bNaacRank = getNaacRank(bApprovals);

        if (aNaacRank !== bNaacRank) {
          return aNaacRank - bNaacRank;
        }

        if (bApprovals.length !== aApprovals.length) {
          return bApprovals.length - aApprovals.length;
        }

        const aCourses = a.courses?.length || 0;
        const bCourses = b.courses?.length || 0;

        if (aCourses >= 3 && bCourses < 3) return -1;
        if (aCourses < 3 && bCourses >= 3) return 1;

        return 0;
      });

      // ✅ Save cache
      globalUniversitiesCache = sorted;

      setUniversities(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  /* ================= HANDLERS ================= */

  const handleDetailsClick = (uni) => {
    const count = uni.courses?.length || 0;

    if (count < 3) {
      alert("This university details are not available yet.");
      return;
    }

    const path = uni.slug || uni._id;
    router.push(`/university/${path}`);
  };

  const handleCompareClick = (uni) => {
    if (!selectedForCompare.find((u) => u._id === uni._id)) {
      if (selectedForCompare.length < 3) {
        setSelectedForCompare([...selectedForCompare, uni]);
      } else {
        alert("Maximum 3 Universities allowed.");
      }
    }
  };

  const removeFromCompare = (id) => {
    setSelectedForCompare(
      selectedForCompare.filter((u) => u._id !== id)
    );
  };

  const handleApplyClick = (uni) => {
    if (isLoggedIn) {
      router.push(`/comparedetail?ids=${uni._id}`);
    } else {
      if (!selectedForCompare.find((u) => u._id === uni._id)) {
        setSelectedForCompare([uni]);
      }
      setShowCompareForm(true);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400 font-medium">
        Loading...
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <>
      <Header />

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]">
        <div className="max-w-[1200px] mx-auto px-4 py-24 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Explore Top Universities in India
          </h1>

          <p className="max-w-3xl mx-auto text-sm md:text-lg text-white/90 leading-relaxed">
           Compare Approved Universities, Check Courses, And Choose The Best Option For Your Future. Find UGC, AICTE, and NAAC Recognized Institutions In One Place.
          </p>

        </div>
      </div>

      <section className="py-10 bg-[#F8FAFC] min-h-screen relative">
        <div className="max-w-[1200px] mx-auto px-4 pb-40">

          {/* GRID */}
          <div className="text-[#000] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

            {universities.slice(0, displayLimit).map((uni) => {

              const bgUrl = getFullImageUrl(
                uni.background?.backgroundImage
              );

              const bannerUrl = getFullImageUrl(
                uni.universityImage
              );

              const courseCount = uni.courses?.length || 0;

              const rawPoints =
                uni.approvals ||
                uni.recognition?.recognitionPoints ||
                [];

              const approvalsText = Array.isArray(rawPoints)
                ? rawPoints
                    .map((item) =>
                      typeof item === "object"
                        ? item.name || item.label
                        : item
                    )
                    .join(", ")
                : rawPoints;

              const canOpen = courseCount >= 3;

              return (
                <div
                  key={uni._id}
                  className="bg-white rounded-[1.2rem] border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition"
                >

                  <div
                    onClick={() => handleDetailsClick(uni)}
                    className={`w-full h-[190px] relative border-b cursor-pointer ${
                      !canOpen && "opacity-60"
                    }`}
                  >
                    <Image
                      src={bgUrl || "/fallback-bg.png"}
                      alt={uni.name}
                      fill
                      className="object-fill hover:scale-105 transition"
                    />
                  </div>

                  <div className="p-3 flex flex-col h-full">

                    <h3
                      onClick={() => handleDetailsClick(uni)}
                      className={`text-base font-black mb-2 min-h-[40px] line-clamp-2 cursor-pointer ${
                        canOpen
                          ? "text-[#0A1D37] hover:text-blue-700"
                          : "text-gray-400"
                      }`}
                    >
                      {uni.name}
                    </h3>

                    <div className="flex justify-between bg-gray-50 p-2 rounded-lg mb-3 gap-2">

                      <div className="flex gap-1 flex-1">
                        <span>🏆</span>

                        <p className="text-[14px] font-bold uppercase line-clamp-3">
                          {approvalsText || "Approvals Verified"}
                        </p>
                      </div>

                      {bannerUrl && (
                        <div className="w-20 h-13 bg-white border rounded-md p-1">
                          <img
                            src={bannerUrl}
                            alt="logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                    </div>

                    <div className="flex gap-1 mb-3 text-[#0056B3] font-bold text-[13px]">
                      📚 {courseCount} Courses
                    </div>

                    <div className="grid grid-cols-3 gap-1 mt-auto">

                      <button
                        disabled={!canOpen}
                        onClick={() => handleDetailsClick(uni)}
                        className={`py-2 rounded-lg text-[8px] font-bold uppercase cursor-pointer ${
                          canOpen
                            ? "bg-[#c15304] text-white hover:bg-orange-600"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleApplyClick(uni)}
                        className=" cursor-pointer text-[#000] border py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-gray-100"
                      >
                        Apply
                      </button>

                      <button
                        onClick={() => handleCompareClick(uni)}
                        className={`py-2 rounded-lg text-[8px] font-bold uppercase  cursor-pointer ${
                          selectedForCompare.find(
                            (s) => s._id === uni._id
                          )
                            ? "bg-green-600 text-white"
                            : "bg-[#c15304] text-white"
                        }`}
                      >
                        {selectedForCompare.find(
                          (s) => s._id === uni._id
                        )
                          ? "Selected"
                          : "Compare"}
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* VIEW MORE */}
          {universities.length > initialLimit && (
            <div className="mt-10 flex justify-center">
              {displayLimit < universities.length ? (
                <button
                  onClick={() =>
                    setDisplayLimit((prev) => prev + 24)
                  }
                  className="px-8 py-3 rounded-full bg-[#c15304] text-white font-bold hover:bg-orange-600"
                >
                  View More ↓
                </button>
              ) : (
                <button
                  onClick={() => setDisplayLimit(initialLimit)}
                  className="px-8 py-3 rounded-full bg-[#c15304] text-white font-bold hover:bg-orange-600"
                >
                  View Less ↑
                </button>
              )}
            </div>
          )}

        </div>

        {/* COMPARE BAR */}
        {selectedForCompare.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-[1000]">

            <div className="text-[#000] max-w-[1000px] mx-auto text-center">

              <h4 className=" cursor-pointer text-sm font-bold mb-3 uppercase">
                Add upto 3 Universities
              </h4>

              <div className="flex justify-center gap-4 mb-4">

                {selectedForCompare.map((uni) => (
                  <div key={uni._id} className="relative w-32 border rounded-lg">

                    <button
                      onClick={() => removeFromCompare(uni._id)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>

                    <div className="h-20 p-2">
                      <img
                        src={getFullImageUrl(uni.universityImage)}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <p className="text-[9px] font-bold truncate py-1 bg-gray-50">
                      {uni.name}
                    </p>

                  </div>
                ))}

              </div>

              <button
                disabled={selectedForCompare.length < 2}
                onClick={() => setShowCompareForm(true)}
                className={`px-12 py-3 rounded-lg font-bold text-xs cursor-pointer ${
                  selectedForCompare.length < 2
                    ? "bg-gray-200 text-gray-400"
                    : "bg-orange-400 text-white"
                }`}
              >
                Compare Now
              </button>

              {showCompareForm && (
                <Comparenow
                  selectedUniversities={selectedForCompare}
                  onClose={() => setShowCompareForm(false)}
                />
              )}

            </div>
          </div>
        )}

      </section>

      <Footer />
    </>
  );
}
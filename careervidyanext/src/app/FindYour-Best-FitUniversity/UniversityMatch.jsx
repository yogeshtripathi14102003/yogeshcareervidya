


"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Search, MessageCircle, Download } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";
import Comparenow from "@/app/Top-Universities/Comparenow.jsx";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const getFullImageUrl = (path) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
};

const getCourseName = (course) => {
  if (!course) return "";
  return typeof course === "object" ? course.name || course.title || "" : course;
};

export default function UniversitiesClient({ initialData = [] }) {
  const router = useRouter();

  const [universities, setUniversities] = useState(initialData);
  const [showCompareOverlay, setShowCompareOverlay] = useState(false);
  const [showCompareNowModal, setShowCompareNowModal] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(24);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingUni, setPendingUni] = useState(null);

  const [courseSearch, setCourseSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const allCourses = useMemo(() => {
    const seen = new Map();
    universities.forEach((uni) => {
      (uni.courses || []).forEach((c) => {
        const name = getCourseName(c).trim();
        if (!name) return;
        const key = name.toLowerCase();
        if (seen.has(key)) {
          seen.get(key).count += 1;
        } else {
          seen.set(key, { name, count: 1 });
        }
      });
    });
    return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [universities]);

  const filteredCourseList = useMemo(() => {
    if (!courseSearch.trim()) return allCourses;
    const q = courseSearch.trim().toLowerCase();
    return allCourses.filter((c) => c.name.toLowerCase().includes(q));
  }, [allCourses, courseSearch]);

  const sidebarCourses = useMemo(() => {
    if (courseSearch.trim()) return filteredCourseList;
    return filteredCourseList.slice(0, 5);
  }, [filteredCourseList, courseSearch]);

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

  const courseFilteredUniversities = useMemo(() => {
    if (!selectedCourse) return sortedUniversities;
    const key = selectedCourse.toLowerCase();
    return sortedUniversities.filter((uni) =>
      (uni.courses || []).some((c) => getCourseName(c).trim().toLowerCase() === key)
    );
  }, [sortedUniversities, selectedCourse]);

  const visibleUnis = useMemo(
    () => courseFilteredUniversities.slice(0, displayLimit),
    [courseFilteredUniversities, displayLimit]
  );

  const handleDetailsClick = (uni) => {
    if ((uni.courses?.length || 0) < 3) {
      alert("This university details are not available yet.");
      return;
    }
    router.push(`/university/${uni.slug || uni._id}`);
  };

  // ✅ Compare click — login nahi hai to login prompt
  const handleCompareClick = (uni) => {
    if (!isLoggedIn) {
      setPendingUni(uni);
      setShowLoginPrompt(true);
      return;
    }

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

  // ✅ Compare Now — login hai to Comparenow modal kholo
  const handleCompareNowClick = () => {
    if (!isLoggedIn) {
      setPendingUni(null);
      setShowLoginPrompt(true);
      return;
    }
    setShowCompareNowModal(true);
  };

  const handleCourseSelect = (courseName) => {
    setSelectedCourse((prev) => (prev === courseName ? null : courseName));
    setDisplayLimit(24);
  };

  const clearCourseFilter = () => {
    setSelectedCourse(null);
    setCourseSearch("");
    setDisplayLimit(24);
  };

  const handleWhatsApp = (uni) => {
    const phone = uni?.whatsappNumber || uni?.phone || "";
    const msg = encodeURIComponent(`Hi, I want to know more about ${uni?.name || "this university"}.`);
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  const handleTalkToExpert = (uni) => {
    const phone = uni?.phone || uni?.whatsappNumber || "";
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      alert("Contact number not available.");
    }
  };

  const handleDownloadBrochure = (uni) => {
    const url = uni?.brochureUrl || uni?.brochure || uni?.prospectusUrl;
    if (url) {
      window.open(getFullImageUrl(url), "_blank");
    } else {
      alert("Brochure not available for this university.");
    }
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
        <div className="max-w-[1400px] mx-auto px-4 pb-40 flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="bg-white rounded-2xl p-4 lg:sticky lg:top-24 shadow-[0_4px_20px_rgba(193,83,4,0.15)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#0A1D37] text-base">Filter by Course</h3>
                {selectedCourse && (
                  <button
                    onClick={clearCourseFilter}
                    className="text-xs text-[#c15304] font-bold cursor-pointer hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Search course..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#c15304] text-black"
                />
              </div>

              <div className="max-h-[420px] overflow-y-auto flex flex-col gap-1 pr-1">
                {sidebarCourses.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">No courses found.</p>
                )}
                {sidebarCourses.map((course) => {
                  const isActive = selectedCourse?.toLowerCase() === course.name.toLowerCase();
                  return (
                    <button
                      key={course.name}
                      onClick={() => handleCourseSelect(course.name)}
                      className={`flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition ${
                        isActive
                          ? "bg-[#c15304] text-white font-bold"
                          : "hover:bg-gray-50 text-[#0A1D37]"
                      }`}
                    >
                      <span className="line-clamp-1">{course.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* UNIVERSITY LIST */}
          <div className="flex-1">
            {selectedCourse && (
              <div className="flex items-center justify-between mb-4 bg-white border border-gray-200 rounded-lg px-4 py-3">
                <p className="text-sm text-[#0A1D37]">
                  Showing universities offering{" "}
                  <span className="font-bold text-[#c15304]">{selectedCourse}</span> —{" "}
                  <span className="font-bold">{courseFilteredUniversities.length}</span> found
                </p>
                <button onClick={clearCourseFilter} className="text-gray-400 hover:text-black cursor-pointer">
                  <X size={18} />
                </button>
              </div>
            )}

            {courseFilteredUniversities.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-500">
                No universities found for this course.
              </div>
            ) : (
              <div className="text-[#000] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {visibleUnis.map((uni) => {
                  const bgUrl = getFullImageUrl(uni.background?.backgroundImage);
                  const bannerUrl = getFullImageUrl(uni.universityImage);
                  const isSelected = selectedForCompare.find((s) => s._id === uni._id);
                  const courseCount = uni.courses?.length || 0;

                  return (
                    <div
                      key={uni._id}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition h-full"
                    >
                      <div
                        onClick={() => handleDetailsClick(uni)}
                        className="w-full h-[220px] relative border-b cursor-pointer overflow-hidden bg-gray-100"
                      >
                        {bgUrl && (
                          <Image
                            src={bgUrl}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover blur-md scale-110 opacity-60"
                            aria-hidden="true"
                          />
                        )}

                        <div className="absolute inset-0 flex items-center justify-center p-2">
                          <div className="relative w-full h-full">
                            <Image
                              src={bgUrl || "/fallback-bg.png"}
                              alt={uni.name || "University"}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-contain drop-shadow-sm"
                            />
                          </div>
                        </div>

                        {bannerUrl && (
                          <div className="absolute bottom-3 left-3 w-16 h-16 bg-white border rounded-lg p-1 shadow-sm z-10">
                            <div className="relative w-full h-full">
                              <Image
                                src={bannerUrl}
                                alt={`${uni.name} logo`}
                                fill
                                sizes="64px"
                                className="object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-lg font-black mb-1 line-clamp-2 text-[#0A1D37]">
                          {uni.name}
                        </h3>

                        <div className="flex items-start gap-1 bg-gray-50 p-2 rounded-lg mb-2">
                          <span>🏆</span>
                          <p className="text-[13px] font-bold uppercase line-clamp-2">
                            {Array.isArray(uni.approvals) && uni.approvals.length > 0
                              ? uni.approvals.map((a) => (typeof a === "object" ? a.name : a)).join(", ")
                              : "Approvals Verified"}
                          </p>
                        </div>

                        <div className="flex gap-1 mb-2 text-[#0056B3] font-bold text-sm">
                          📚 {courseCount} Courses
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <button
                            onClick={() => handleWhatsApp(uni)}
                            className="flex items-center gap-1.5 bg-[#EEF3FB] hover:bg-[#E0E9F8] text-[#1a1a1a] font-semibold text-[11px] px-3 py-1.5 rounded-full transition cursor-pointer"
                          >
                            <span>WhatsApp</span>
                            <FaWhatsapp className="text-[#25D366] text-[15px]" />
                          </button>

                          <button
                            onClick={() => handleTalkToExpert(uni)}
                            className="flex items-center gap-1.5 bg-[#F2F2F2] hover:bg-[#E8E8E8] text-[#1a1a1a] font-semibold text-[11px] px-3 py-1.5 rounded-full transition cursor-pointer"
                          >
                            <span>Talk to Expert</span>
                            <MessageCircle size={14} className="text-[#374151]" />
                          </button>

                          <button
                            onClick={() => handleDownloadBrochure(uni)}
                            className="flex items-center gap-1.5 bg-[#F2F2F2] hover:bg-[#E8E8E8] text-[#1a1a1a] font-semibold text-[11px] px-3 py-1.5 rounded-full transition cursor-pointer"
                          >
                            <span>Download Brochure</span>
                            <Download size={14} className="text-[#374151]" />
                          </button>
                        </div>

                        <div className="mt-auto">
                          <button
                            onClick={() => handleCompareClick(uni)}
                            className={`w-full py-2.5 rounded-lg text-sm cursor-pointer font-bold uppercase transition ${
                              isSelected ? "bg-green-600 text-white" : "bg-[#c15304] text-white hover:bg-[#a3450a]"
                            }`}
                          >
                            {isSelected ? "Selected" : "Add Compare"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {courseFilteredUniversities.length > displayLimit && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setDisplayLimit((prev) => prev + 12)}
                  className="bg-white border-2 border-[#c15304] cursor-pointer text-[#c15304] px-10 py-3 rounded-full font-bold hover:bg-[#c15304] hover:text-white transition shadow-md"
                >
                  View More Universities ↓
                </button>
              </div>
            )}
          </div>
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
                    <Image src={getFullImageUrl(uni.background?.backgroundImage) || "/fallback-bg.png"} fill className="object-cover opacity-40" alt="" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative h-12 w-32">
                        <Image src={getFullImageUrl(uni.universityImage)} fill sizes="128px" className="object-contain bg-white p-1 rounded border" alt={`${uni.name} logo`} />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-bold line-clamp-1">{uni.name}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <button onClick={handleCompareNowClick} className="bg-[#E47A0E] text-white px-10 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition">
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL FOR COMPARENOW COMPONENT — ab logged-in user ke liye bhi khulega */}
      {showCompareNowModal && (
        <div className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto relative p-6">
            <button onClick={() => setShowCompareNowModal(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition z-10">
              <X size={24} />
            </button>
            <Comparenow
               selectedUnis={selectedForCompare}
               onClose={() => setShowCompareNowModal(false)}
               isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      )}

      {/* ✅ LOGIN PROMPT MODAL — user login nahi hai to Add Compare pe ye khulega */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/70 z-[1100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md relative p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                setShowLoginPrompt(false);
                setPendingUni(null);
              }}
              className="absolute top-3 right-3 p-2 bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#FFF3E8] flex items-center justify-center">
                <span className="text-3xl">🔒</span>
              </div>

              <h3 className="text-xl font-bold text-[#0A1D37] mb-1">
                Login Required
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                Universities ko compare karne ke liye pehle login karein. Login ke baad aap seedha compare kar payenge.
              </p>

              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  router.push("/login?redirect=/universities");
                }}
                className="w-full bg-[#c15304] hover:bg-[#a3450a] text-white font-bold py-3 rounded-lg transition cursor-pointer mb-2"
              >
                Login Now
              </button>

              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  router.push("/register?redirect=/universities");
                }}
                className="w-full bg-white border-2 border-[#c15304] text-[#c15304] hover:bg-[#FFF3E8] font-bold py-3 rounded-lg transition cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
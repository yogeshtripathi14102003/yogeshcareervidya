"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utlis/api.js";
import Header from "@/app/layout/Header.jsx";
import { Search, MessageSquare, Eye, Clock, Mic, Zap, Users, Timer, ListFilter, PenLine, Lock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa"; 

export default function QAListPage() {
  const router = useRouter();
  
  // States
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // 👇 Yahan hum check kar rahe hain ki browser me token hai ya nahi
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  // Jab page pehli baar load ho, tab check karo
  useEffect(() => {
    // Apne project ke hisaab se token ka naam badal lein (jaise 'token', 'authToken', 'userToken' etc.)
    const token = localStorage.getItem("token"); 
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch Questions API
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/qa/questions", {
        params: { page, search: search || undefined, category: category || undefined },
      });
      setQuestions(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      if (res.data?.categories) setCategories(res.data.categories);
    } catch (err) {
      console.error("Fetch Questions Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Agar login hai tabhi fetch karo
    if (isLoggedIn) {
      fetchQuestions();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category, isLoggedIn]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  const handleAskQuestion = () => {
    router.push('/login?redirect=/user/qa/ask'); 
  };

  const whatsappNumber = "9289712364"; 
  const whatsappMessage = "Hi, I need help with CareerVidya Q&A.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

  return (
    <div className="min-h-screen bg-[var(--cv-neutral-light)] flex flex-col font-sans">
      <Header />
      {/* ================= HERO SECTION ================= */}
      <div 
        className="relative w-full pt-16 pb-12 px-4 flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ background: 'var(--cv-grad-hero)' }}
      >
        {/* Decorative Glows */}
        <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-[var(--cv-accent-light)] blur-[100px] rounded-full opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-72 h-72 bg-[var(--cv-primary-light)] blur-[100px] rounded-full opacity-60 pointer-events-none"></div>

        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[var(--cv-neutral-border)] text-[var(--cv-primary)] text-xs font-semibold mb-5 shadow-sm">
          <Zap size={14} className="text-[var(--cv-accent)] fill-[var(--cv-accent)]" />
          Powered by 5K+ Community Members
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--cv-neutral-dark)] tracking-tight leading-tight mb-3">
          Your Career Questions, Answered by<br />
          <span className="cv-text-gradient inline-block mt-1">
            Real Industry Experts
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-[var(--cv-neutral-mid)] text-sm md:text-base max-w-xl mb-6 leading-relaxed">
          Get clear, expert-backed answers on <span className="font-semibold text-[var(--cv-primary)]">admissions, careers, and courses</span> — from people who've been there.
        </p>

        {/* Big Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-xl relative mb-6 z-10">
          <div className="flex items-center w-full bg-white border border-[var(--cv-neutral-border)] rounded-full px-4 py-2.5 shadow-sm hover:shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--cv-accent)] focus-within:border-transparent">
            <Search className="text-[var(--cv-neutral-mid)] mr-2" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for questions..."
              className="flex-1 outline-none text-sm text-[var(--cv-neutral-dark)] bg-transparent font-medium placeholder:text-gray-400"
            />
            <button type="button" className="p-1.5 bg-[var(--cv-primary-light)] rounded-full text-[var(--cv-primary)] hover:text-[var(--cv-accent)] transition-colors">
              <Mic size={16} />
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 z-10">
          <button 
            onClick={handleAskQuestion}
            className="cv-btn-cta flex items-center justify-center gap-2 px-6 py-2.5 text-sm w-full sm:w-auto"
          >
            <PenLine size={16} />
            Ask a Question
          </button>
          
          <button 
            onClick={() => document.getElementById('questions-list').scrollIntoView({ behavior: 'smooth' })}
            className="cursor-pointer flex items-center justify-center gap-2 bg-white border-2 border-[var(--cv-primary)] text-[var(--cv-primary)] hover:bg-[var(--cv-primary-light)] px-6 py-2.5 rounded-lg font-bold text-sm transition-colors w-full sm:w-auto"
          >
            <ListFilter size={16} />
            Browse Questions
          </button>

          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-[#25D366] hover:bg-[#20b858] text-white p-2.5 rounded-lg transition-colors w-full sm:w-auto shadow-sm"
            title="Chat on WhatsApp"
          >
            <FaWhatsapp size={20} />
          </a>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-wrap justify-center gap-3 z-10 w-full max-w-2xl">
          {[
            { icon: <Zap size={18} />, value: "10000+", label: "Questions Asked" },
            { icon: <Users size={18} />, value: "5K+", label: "Active Members" },
            { icon: <Timer size={18} />, value: "24 Hrs", label: "Avg. Response" }
          ].map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-[var(--cv-neutral-border)] shadow-sm hover:shadow-md transition-all duration-300">
              <div className="cv-icon-gradient w-9 h-9">
                {stat.icon}
              </div>
              <div className="text-left">
                <p className="font-extrabold text-[var(--cv-neutral-dark)] text-sm leading-none">{stat.value}</p>
                <p className="text-[11px] text-[var(--cv-neutral-mid)] mt-1 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= QUESTIONS LIST SECTION ================= */}
      <div id="questions-list" className="max-w-3xl mx-auto w-full px-4 pb-16 pt-8">
        
        {/* Gradient Divider */}
        <div className="cv-divider-gradient w-full mb-6 opacity-40"></div>

        {/* Filters Bar (Sirf login hone par dikhega) */}
        {isLoggedIn && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            <h2 className="text-xl font-bold text-[var(--cv-neutral-dark)] flex items-center gap-2">
              <MessageSquare className="text-[var(--cv-accent)]" size={20} /> Recent Discussions
            </h2>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select 
                value={category} 
                onChange={(e) => { setCategory(e.target.value); setPage(1); }} 
                className="border border-[var(--cv-neutral-border)] rounded-lg px-3 py-1.5 text-xs font-medium outline-none bg-white cursor-pointer hover:border-[var(--cv-primary)] text-[var(--cv-neutral-dark)] w-full sm:w-auto transition-colors"
              >
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="button" onClick={handleSearch} className="bg-[var(--cv-primary)] hover:bg-[var(--cv-primary-dark)] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                Filter
              </button>
            </div>
          </div>
        )}

        {/* Question Cards / Login Prompt */}
        <div className="space-y-3">
          {!isLoggedIn ? (
            /* 👇 AGAR LOGIN NAHI HAI TOH YEH DIKHEGA 👇 */
            <div className="text-center py-16 bg-white rounded-xl border border-[var(--cv-neutral-border)] shadow-sm flex flex-col items-center">
              <div className="bg-[var(--cv-primary-light)] p-4 rounded-full mb-4">
                <Lock size={32} className="text-[var(--cv-primary)]" />
              </div>
              <p className="text-[var(--cv-neutral-dark)] font-bold text-lg">Please login to access Q&A Panel</p>
              <p className="text-[var(--cv-neutral-mid)] text-sm mt-1 mb-6">Login to ask questions and resolve your doubts.</p>
              
              <button 
                onClick={() => router.push('/login')}
                className="cv-btn-cta flex items-center justify-center gap-2 px-8 py-2.5 text-sm"
              >
                Login Now
              </button>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--cv-primary)]"></div>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-[var(--cv-neutral-border)] shadow-sm">
              <MessageSquare size={40} className="mx-auto text-gray-200 mb-3" />
              <p className="text-[var(--cv-neutral-dark)] font-bold text-base">No questions found.</p>
              <p className="text-[var(--cv-neutral-mid)] text-sm mt-1">Try searching with different keywords or categories.</p>
            </div>
          ) : (
            /* 👇 AGAR LOGIN HAI TOH SIRF YEH DIKHEGA 👇 */
            questions.map((q) => (
              <button
                key={q._id}
                type="button"
                onClick={() => router.push(`/user/qa/${q._id}`)}
                className="w-full text-left bg-white border border-[var(--cv-neutral-border)] rounded-lg p-4 hover:border-[var(--cv-primary)] hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--cv-accent)] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] bg-[var(--cv-primary-light)] text-[var(--cv-primary)] px-2 py-0.5 rounded font-bold tracking-wide uppercase">{q.category}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${q.status === "open" ? "bg-[var(--cv-accent-light)] text-[var(--cv-accent-dark)]" : "bg-gray-100 text-gray-500"}`}>
                    {q.status}
                  </span>
                </div>
                
                <h3 className="font-bold text-base text-[var(--cv-neutral-dark)] group-hover:text-[var(--cv-primary)] transition-colors line-clamp-2 leading-snug">
                  {q.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--cv-neutral-mid)] mt-3 pt-3 border-t border-gray-50">
                  <span className="font-bold text-[var(--cv-neutral-dark)] bg-gray-50 px-1.5 py-0.5 rounded">{q.student?.name || "Anonymous"}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {fmt(q.createdAt)}</span>
                  <span className="flex items-center gap-1"><Eye size={12} /> {q.views || 0} views</span>
                  <span className="flex items-center gap-1 text-[var(--cv-accent-dark)] font-bold"><MessageSquare size={12} /> {q.answerCount || 0} Answers</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Pagination Controls (Sirf login hone par dikhega) */}
        {isLoggedIn && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 text-sm pt-8">
            <button 
              type="button"
              disabled={page <= 1} 
              onClick={() => setPage((p) => p - 1)} 
              className="px-4 py-1.5 border border-[var(--cv-neutral-border)] rounded-md hover:bg-[var(--cv-primary-light)] hover:border-[var(--cv-primary)] hover:text-[var(--cv-primary)] disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-[var(--cv-neutral-border)] disabled:hover:text-inherit transition-all cursor-pointer disabled:cursor-not-allowed font-bold text-xs text-[var(--cv-neutral-dark)]"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 font-bold text-[var(--cv-primary)] bg-[var(--cv-primary-light)] rounded-md border border-[var(--cv-primary-light)] text-xs">Page {page} of {totalPages}</span>
            <button 
              type="button"
              disabled={page >= totalPages} 
              onClick={() => setPage((p) => p + 1)} 
              className="px-4 py-1.5 border border-[var(--cv-neutral-border)] rounded-md hover:bg-[var(--cv-primary-light)] hover:border-[var(--cv-primary)] hover:text-[var(--cv-primary)] disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-[var(--cv-neutral-border)] disabled:hover:text-inherit transition-all cursor-pointer disabled:cursor-not-allowed font-bold text-xs text-[var(--cv-neutral-dark)]"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
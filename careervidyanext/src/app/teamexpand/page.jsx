"use client";
import Footer from "@/app/layout/Footer.jsx";
import { useEffect, useMemo, useState } from "react";
import api from "@/utlis/api.js"; 
import { ChevronDown, Search, User, Star, Phone, MessageSquare, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import Bookcounsler from "../components/Bookcounsler.jsx"; 
import Header from "@/app/layout/Header.jsx";
import { useRouter } from "next/navigation"; 

const FALLBACK_AVATAR = "/images/default-avatar.png"; 
const PAGE_SIZE = 6;

// Global Cache taaki loading baar-baar na dikhe
let cachedMentors = null;

function MentorCard({ mentor, onBook, onDetail }) {
    const image = mentor.image && typeof mentor.image === "string" && (mentor.image.startsWith("http") || mentor.image.startsWith("/")) 
        ? mentor.image 
        : FALLBACK_AVATAR;
    const name = mentor.name || mentor.fullName || "Unknown Counsellor";
    const designation = mentor.designation || mentor.title || "Career Counsellor";
    const rating = mentor.rating ?? mentor.avgRating ?? 4.8;
    const ratingCount = mentor.ratingCount ?? mentor.reviews ?? 50;
    const fee = mentor.fee ?? mentor.price ?? 0;
    const isFree = (fee === 0 || fee === '0' || fee === 'Free');
    const experience = mentor.experience ?? mentor.years ?? 5;
    const responseRate = mentor.responseRate ?? mentor.response ?? "95%";
    const skills = mentor.skills || mentor.expertises || mentor.expertise || [];
    const mobileNumber = mentor.mobileNumber || "919876543210"; 
    const whatsappNumber = mentor.whatsappNumber || mobileNumber; 

    return (
        <div className="relative bg-white rounded-2xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-stretch shadow-sm hover:shadow-lg transition duration-300 group">
            <div className="flex-1 flex gap-4 items-start cursor-pointer" onClick={onDetail}>
                <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={image} alt={name} className="w-full h-full object-contain" loading="lazy" />
                    {(mentor.isOnline || mentor.online === true) && (
                        <div className="absolute top-2 left-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition truncate">{name}</h3>
                            <p className="text-sm font-medium text-gray-600 truncate">{designation}</p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="inline-flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-bold text-yellow-800">{Number(rating).toFixed(1)}</span>
                                <span className="text-xs text-gray-500">({ratingCount})</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-full md:max-w-[60%] line-clamp-2">
                        {mentor.description || `Expert guidance with ${experience} years of experience.`}
                    </p>

                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">🎯 Resp. {responseRate}</div>
                        <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">⭐ {experience} yrs Exp.</div>
                        {Array.isArray(skills) && skills.slice(0, 3).map((s) => (
                            <div key={s} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-medium">{s}</div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="w-full md:w-44 flex-shrink-0 flex flex-col items-center md:items-end justify-start md:justify-end gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4">
                <div className="text-center md:text-right w-full mb-2">
                    <div className="text-xs text-gray-500">Session Fee</div>
                    <div className="text-xl font-extrabold text-blue-800">{isFree ? "FREE" : `₹${fee}`}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onBook(); }} className="w-full py-2 rounded-lg text-sm font-semibold transition bg-blue-600 text-white hover:bg-blue-700">
                    {isFree ? "Book Free" : "Book Now"}
                </button>
                <div className="flex w-full gap-2">
                    <a href={`tel:${mobileNumber}`} className="flex-1 flex items-center justify-center p-2 rounded-lg bg-gray-100" onClick={(e) => e.stopPropagation()}><Phone className="w-4 h-4"/></a>
                    <a href={`https://wa.me/${whatsappNumber}`} target="_blank" className="flex-1 flex items-center justify-center p-2 rounded-lg bg-[#25D366] text-white" onClick={(e) => e.stopPropagation()}><MessageSquare className="w-4 h-4"/></a>
                </div>
            </div>
        </div>
    );
}

export default function TeamListingPage() {
    const [mentors, setMentors] = useState(cachedMentors || []);
    const [loading, setLoading] = useState(!cachedMentors);
    const [query, setQuery] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("");
    const [onlineOnly, setOnlineOnly] = useState(false);
    const [sortBy, setSortBy] = useState("experience-desc");
    const [page, setPage] = useState(1);
    const [openBookModal, setOpenBookModal] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const router = useRouter(); 

    const resetFilters = () => {
        setQuery(""); setSelectedState(""); setSelectedLanguage(""); setSelectedSkill(""); 
        setOnlineOnly(false); setSortBy("experience-desc"); setPage(1);
    };

    useEffect(() => {
        let mounted = true;
        const fetchMentors = async () => {
            if (!cachedMentors) setLoading(true);
            try {
                const res = await api.get("/api/v1/team"); 
                const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
                if (mounted) {
                    setMentors(data);
                    cachedMentors = data;
                }
            } catch (err) { console.error(err); } 
            finally { if (mounted) setLoading(false); }
        };
        fetchMentors();
        return () => { mounted = false; };
    }, []);

    // FIXED: Ab options repeat nahi honge (Using Set)
    const filterOptions = useMemo(() => {
        const states = new Set();
        const languages = new Set();
        const skillsSet = new Set();

        mentors.forEach(m => {
            // Location/State
            const loc = m.state || m.location;
            if (loc) states.add(loc.trim());

            // Languages (Handling string or array)
            const lang = m.languages || m.language;
            if (Array.isArray(lang)) {
                lang.forEach(l => languages.add(l.trim()));
            } else if (typeof lang === 'string') {
                lang.split(',').forEach(l => languages.add(l.trim()));
            }

            // Expertise/Skills (Handling string or array)
            const s = m.skills || m.expertises || m.expertise;
            if (Array.isArray(s)) {
                s.forEach(item => skillsSet.add(item.trim()));
            } else if (typeof s === 'string') {
                s.split(',').forEach(item => skillsSet.add(item.trim()));
            }
        });

        return { 
            states: Array.from(states).filter(Boolean).sort(), 
            languages: Array.from(languages).filter(Boolean).sort(), 
            skills: Array.from(skillsSet).filter(Boolean).sort() 
        };
    }, [mentors]);

    const filtered = useMemo(() => {
        let list = [...mentors];
        if (onlineOnly) list = list.filter(m => m.isOnline || m.online);
        if (selectedState) list = list.filter(m => (m.state || m.location || "").toLowerCase().includes(selectedState.toLowerCase()));
        if (selectedLanguage) list = list.filter(m => (m.languages || m.language || "").toString().toLowerCase().includes(selectedLanguage.toLowerCase()));
        if (selectedSkill) {
            list = list.filter(m => {
                const s = m.skills || m.expertises || m.expertise || [];
                const skillList = Array.isArray(s) ? s : (typeof s === 'string' ? s.split(',').map(i => i.trim()) : []);
                return skillList.some(item => item.toLowerCase() === selectedSkill.toLowerCase());
            });
        }
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(m => (m.name || "").toLowerCase().includes(q) || (m.designation || "").toLowerCase().includes(q));
        }

        // Default Sort: Experience High to Low
        list.sort((a, b) => (b.experience || 0) - (a.experience || 0));

        if (sortBy === "fee-low") list.sort((a, b) => (a.fee || 0) - (b.fee || 0));
        else if (sortBy === "fee-high") list.sort((a, b) => (b.fee || 0) - (a.fee || 0));
        
        return list;
    }, [mentors, onlineOnly, selectedState, selectedLanguage, selectedSkill, query, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className=" cursor-pointer    relative bg-blue-700 h-80 flex items-center justify-center text-center overflow-hidden" style={{ backgroundImage: `url('/images/counselor-banner-placeholder.jpg')`, backgroundSize: 'cover' }}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                <div className="relative z-10 p-4 max-w-4xl text-white">
                    <h1 className="text-4xl md:text-5xl font-extrabold uppercase">Meet Our Expert Career Counselors</h1>
                    <p className="mt-3 text-lg opacity-90">Find the right mentor to guide your future and book a personalized session today</p>
                </div>
            </div>

            <div className="bg-gray-50 flex-grow py-10 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                        <div className="w-full md:max-w-md relative">
                            <input className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-11 focus:ring-2 focus:ring-blue-500 shadow-sm" placeholder="Search..." value={query} onChange={(e)=>setQuery(e.target.value)} />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
                        </div>
                        <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="rounded-lg border-gray-200 px-3 py-2 bg-white text-sm shadow-sm   cursor-pointer  ">
                            <option value="experience-desc">Highest Experience</option>
                            <option value="fee-low">Fee - Low to High</option>
                            <option value="fee-high">Fee - High to Low</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 cursor-pointer ">
                       <aside className="  cursor-pointer  hidden md:block md:col-span-3 sticky top-24 h-fit bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                            <div className="flex items-center justify-between border-b pb-3">
                                <h3 className="text-lg font-bold">Filters</h3>
                                <button onClick={resetFilters} className="text-xs text-red-500 font-bold flex items-center gap-1"><RotateCcw className="w-3 h-3" /> RESET</button>
                            </div>
                            <div className="space-y-5">
                                {/* <div className="flex items-center gap-2">
                                    <input type="checkbox" id="online" checked={onlineOnly} onChange={(e)=>setOnlineOnly(e.target.checked)} />
                                    <label htmlFor="online" className="text-sm font-medium">Online Only</label>
                                </div> */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Location</label>
                                    <select value={selectedState} onChange={(e)=>setSelectedState(e.target.value)} className="w-full p-2 border rounded-md text-sm">
                                        <option value="">All Locations</option>
                                        {filterOptions.states.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Language</label>
                                    <select value={selectedLanguage} onChange={(e)=>setSelectedLanguage(e.target.value)} className="w-full p-2 border rounded-md text-sm">
                                        <option value="">All Languages</option>
                                        {filterOptions.languages.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Expertise</label>
                                    <select value={selectedSkill} onChange={(e)=>setSelectedSkill(e.target.value)} className="w-full p-2 border rounded-md text-sm">
                                        <option value="">All Skills</option>
                                        {filterOptions.skills.map(sk => <option key={sk} value={sk}>{sk}</option>)}
                                    </select>
                                </div>
                            </div>
                        </aside>

                        <main className="md:col-span-9 space-y-6">
                            {loading && !mentors.length ? ( 
                                <div className="text-center py-20 font-medium">Loading...</div> 
                            ) : paged.length > 0 ? (
                                <>
                                    {paged.map((m) => (
                                        <MentorCard key={m._id || m.id} mentor={m} onBook={() => {setSelectedMentor(m); setOpenBookModal(true);}} onDetail={() => router.push(`/teamexpand/${m._id || m.id}`)} />
                                    ))}
                                    <div className="mt-12 flex items-center justify-center gap-2">
                                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border bg-white rounded-lg disabled:opacity-50"><ChevronLeft className="w-5 h-5"/></button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-lg text-sm font-bold ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>{i + 1}</button>
                                        ))}
                                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border bg-white rounded-lg disabled:opacity-50"><ChevronRight className="w-5 h-5"/></button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl border text-gray-500">No results found.</div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
            {openBookModal && selectedMentor && <Bookcounsler mentor={selectedMentor} onClose={()=>setOpenBookModal(false)} />}
            <Footer />
        </div>
    );
}
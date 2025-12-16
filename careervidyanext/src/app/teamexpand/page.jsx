"use client";
import Footer from "@/app/layout/Footer.jsx";
import { useEffect, useMemo, useState } from "react";
import api from "@/utlis/api.js"; 
import { ChevronDown, Search, User, Star, Phone, MessageSquare } from "lucide-react";
import Bookcounsler from "../components/Bookcounsler.jsx"; 
import Header from "@/app/layout/Header.jsx";
import { useRouter } from "next/navigation"; // <-- Added for page navigation

const FALLBACK_AVATAR = "/images/default-avatar.png"; 
const PAGE_SIZE = 6;

// ------------------- Mentor Card Component -------------------
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
    const skills = mentor.skills || [];
    const mobileNumber = mentor.mobileNumber || "919876543210"; 
    const whatsappNumber = mentor.whatsappNumber || mobileNumber; 

    return (
        <div className="relative bg-white rounded-2xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-stretch shadow-sm hover:shadow-lg transition duration-300 group">
            <div 
                className="flex-1 flex gap-4 items-start cursor-pointer" 
                onClick={onDetail} // <-- Navigate to detail page
            >
                <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200">
                    <img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" />
                    {(mentor.isOnline || mentor.online === true) && (
                        <div className="absolute top-2 left-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white" title="Online now"></div>
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
                                <span className="text-sm font-bold text-yellow-800">{rating.toFixed(1)}</span>
                                <span className="text-xs text-gray-500">({ratingCount})</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-full md:max-w-[60%] whitespace-normal break-all overflow-hidden line-clamp-2">
                        {mentor.description || `I'm ${name}. With over ${experience} years of experience in career counselling.`}
                    </p>

                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">🎯 Resp. {responseRate}</div>
                        <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">⭐ {experience} yrs Exp.</div>
                        {skills.slice(0, 3).map((s) => (
                            <div key={s} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-medium whitespace-nowrap">{s}</div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="w-full md:w-44 flex-shrink-0 flex flex-col items-center md:items-end justify-start md:justify-end gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4">
                <div className="text-center md:text-right w-full mb-2">
                    <div className="text-xs text-gray-500">Session Fee (30 min)</div>
                    <div className="text-xl font-extrabold text-blue-800">{isFree ? "FREE" : `₹${fee}`}</div>
                </div>

                <button 
                    onClick={(e) => { e.stopPropagation(); onBook(); }} 
                    className="w-full py-2 rounded-lg text-sm font-semibold transition bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                >
                    {isFree ? "Book a Free Session" : "Book Now"}
                </button>
                
                <div className="flex w-full gap-2">
                    <a 
                        href={`tel:${mobileNumber}`} 
                        className="flex-1 flex items-center justify-center p-2 rounded-lg text-sm font-medium transition duration-200 bg-gray-100 text-gray-800 hover:bg-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Phone className="w-4 h-4"/>
                    </a>
                    <a 
                        href={`https://wa.me/${whatsappNumber}?text=Hello%2C%20I%20saw%20your%20profile%20on%20the%20website%20and%20would%20like%20to%20book%20a%20session%20with%20${name}.`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center p-2 rounded-lg text-sm font-medium transition duration-200 bg-[#25D366] text-white hover:bg-[#1DA851] shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MessageSquare className="w-4 h-4"/> 
                    </a>
                </div>

                <div className="text-xs text-gray-400 mt-1">Verified & Secure</div>
            </div>
        </div>
    );
}

// ------------------- Main Component -------------------
export default function TeamListingPage() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("");
    const [onlineOnly, setOnlineOnly] = useState(false);
    const [sortBy, setSortBy] = useState("recommendation");
    const [page, setPage] = useState(1);

    const [openBookModal, setOpenBookModal] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);

    const ALL_STATES = ["Uttar Pradesh", "Uttarakhand", "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi"];
    const ALL_LANGUAGES = ["English", "Hindi", "Gujarati", "Bengali", "Marathi", "Tamil"];
    const ALL_SKILLS = ["Career Counseling", "Finance", "Sales", "Tech", "Product", "Academics", "College Applications"];

    const router = useRouter(); // <-- Added

    // Fetch mentors
    useEffect(() => {
        let mounted = true;
        const fetchMentors = async () => {
            setLoading(true);
            try {
                const res = await api.get("/api/v1/team"); 
                const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
                if (mounted) setMentors(data);
            } catch (err) {
                console.error(err);
                if (mounted) setMentors([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchMentors();
        return () => { mounted = false; };
    }, []);

    // Filter, sort, paginate
    const filtered = useMemo(() => {
        let list = mentors.slice();
        if (onlineOnly) list = list.filter(m => m.isOnline || m.online);
        if (selectedState) list = list.filter(m => (m.state || m.location || "").toLowerCase().includes(selectedState.toLowerCase()));
        if (selectedLanguage) list = list.filter(m => (m.languages || m.language || "").toString().toLowerCase().includes(selectedLanguage.toLowerCase()));
        if (selectedSkill) list = list.filter(m => (m.skills || []).map(s => s.toLowerCase()).includes(selectedSkill.toLowerCase()));
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(m => (m.name || "").toLowerCase().includes(q) || (m.designation || "").toLowerCase().includes(q) || (m.description || "").toLowerCase().includes(q));
        }

        if (sortBy === "fee-low") list.sort((a,b)=> (a.fee||0)-(b.fee||0));
        else if (sortBy === "fee-high") list.sort((a,b)=> (b.fee||0)-(a.fee||0));
        else if (sortBy === "experience") list.sort((a,b)=> (b.experience||0)-(a.experience||0));
        else { // recommendation
            list.sort((a,b)=>{
                const ra = a.rating ?? 0, rb = b.rating ?? 0;
                if(rb!==ra) return rb-ra;
                const rra = parseInt((a.responseRate||'0').replace('%','')) ?? 0;
                const rrb = parseInt((b.responseRate||'0').replace('%','')) ?? 0;
                if(rrb!==rra) return rrb-rra;
                return (b.experience||0)-(a.experience||0);
            });
        }
        return list;
    }, [mentors, onlineOnly, selectedState, selectedLanguage, selectedSkill, query, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
    useEffect(()=>{ setPage(1); }, [query, selectedState, selectedLanguage, selectedSkill, onlineOnly, sortBy]);

    const openBookModalHandler = (mentor) => { setSelectedMentor(mentor); setOpenBookModal(true); };

    // <-- New: Navigate to detail page
    const openDetailPage = (mentor) => {
        router.push(`/teamexpand/${mentor._id}`);
    };

    return (
        <>
            <Header />

            <div className="relative bg-blue-700 h-80 flex items-center justify-center text-center overflow-hidden" style={{ backgroundImage: `url('/images/counselor-banner-placeholder.jpg')` }}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                <div className="relative z-10 p-4 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">MEET OUR EXPERT CAREER COUNSELLORS</h1>
                    <p className="mt-3 text-lg text-gray-200 font-medium">Find the right mentor to guide your future and book a personalized session today.</p>
                    <a href="#mentor-list" className="mt-5 bg-yellow-400 text-blue-900 font-bold px-8 py-3 rounded-full text-base shadow-lg hover:bg-yellow-300 transition duration-300 inline-block">View All Counsellors Below</a>
                </div>
            </div>

            <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8" id="mentor-list">
                <div className="max-w-7xl mx-auto">
                    {/* Search & controls */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                        <div className="flex-1 w-full md:w-auto">
                            <label htmlFor="search" className="sr-only">Search mentors</label>
                            <div className="relative">
                                <input id="search" className="w-full rounded-lg border border-gray-200 px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search counsellors by name, designation, or skill..." value={query} onChange={(e)=>setQuery(e.target.value)} />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search className="w-5 h-5"/></div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="hidden sm:inline whitespace-nowrap">Sort by</span>
                                <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 bg-white text-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option value="recommendation">Recommendation</option>
                                    <option value="fee-low">Fee - Low to High</option>
                                    <option value="fee-high">Fee - High to Low</option>
                                    <option value="experience">Experience</option>
                                </select>
                            </div>
                            <button onClick={()=>{setQuery(""); setSelectedState(""); setSelectedLanguage(""); setSelectedSkill(""); setOnlineOnly(false); setSortBy("recommendation");}} className="bg-[#043c78] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#043c78] transition whitespace-nowrap">Reset</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <aside className="md:col-span-3 bg-white rounded-xl p-5 shadow-lg sticky top-5 md:top-24 h-max order-2 md:order-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Quick Filters</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <input id="onlineOnly" type="checkbox" checked={onlineOnly} onChange={(e)=>setOnlineOnly(e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                                <label htmlFor="onlineOnly" className="text-sm font-medium text-gray-700">Online Mentors Only</label>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="stateFilter" className="block text-sm font-semibold text-gray-700 mb-2">Location (State)</label>
                                <select id="stateFilter" value={selectedState} onChange={(e)=>setSelectedState(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">All Locations</option>
                                    {ALL_STATES.map(state=><option key={state} value={state}>{state}</option>)}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="langFilter" className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                                <select id="langFilter" value={selectedLanguage} onChange={(e)=>setSelectedLanguage(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">All Languages</option>
                                    {ALL_LANGUAGES.map(lang=><option key={lang} value={lang}>{lang}</option>)}
                                </select>
                            </div>
                            <div className="mb-0">
                                <label htmlFor="skillFilter" className="block text-sm font-semibold text-gray-700 mb-2">Expertise</label>
                                <select id="skillFilter" value={selectedSkill} onChange={(e)=>setSelectedSkill(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">All Expertise</option>
                                    {ALL_SKILLS.map(skill=><option key={skill} value={skill}>{skill}</option>)}
                                </select>
                            </div>
                        </aside>

                        <main className="md:col-span-9 space-y-6 order-1 md:order-2">
                            <p className="text-md font-semibold text-gray-700 mb-4">Showing <span className="text-blue-600">{paged.length}</span> of <span className="text-blue-600">{filtered.length}</span> counsellors</p>
                            <div className="space-y-6">
                                {loading ? <div className="py-12 text-center text-lg font-medium text-gray-500">Loading counsellor profiles...</div> :
                                 paged.length===0 ? <div className="py-12 text-center text-lg font-medium text-gray-500 border border-dashed border-gray-300 p-8 rounded-xl bg-white">❌ No counsellors match your current filters. Try simplifying your search.</div> :
                                 paged.map((m)=><MentorCard key={m._id??m.id??m.name} mentor={m} onBook={()=>openBookModalHandler(m)} onDetail={()=>openDetailPage(m)} />)}
                            </div>

                            {totalPages>1 && (
                                <div className="flex justify-center items-center gap-4 mt-8">
                                    <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg disabled:opacity-50 hover:bg-blue-50 transition">&larr; Previous</button>
                                    <span className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">{page} / {totalPages}</span>
                                    <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg disabled:opacity-50 hover:bg-blue-50 transition">Next &rarr;</button>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>

            {openBookModal && selectedMentor && <Bookcounsler mentor={selectedMentor} onClose={()=>setOpenBookModal(false)} />}
            <Footer />
        </>
    );
}

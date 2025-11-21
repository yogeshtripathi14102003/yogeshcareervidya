"use client";

import { useEffect, useMemo, useState } from "react";
import api  from "@/utlis/api.js"; // your existing axios wrapper
import { ChevronDown, Search, User, Star } from "lucide-react";



const FALLBACK_AVATAR = "/mnt/data/2fd589e4-4623-4f8b-aea3-94c2d61d9a3c.png";
const PAGE_SIZE = 6;

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

  // simple lists for filters — adapt to your real data or fetch them separately
  const ALL_STATES = ["Uttar Pradesh", "Uttarakhand", "Maharashtra", "Karnataka"];
  const ALL_LANGUAGES = ["English", "Hindi", "Gujarati", "Bengali"];
  const ALL_SKILLS = ["Career Counseling", "Finance", "Sales", "Tech", "Product"];

  useEffect(() => {
    let mounted = true;
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/v1/team");
        // API shape may differ; normalize to array
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        if (!mounted) return;
        setMentors(data);
      } catch (err) {
        console.error("Error fetching mentors:", err);
        if (mounted) setMentors([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMentors();
    return () => {
      mounted = false;
    };
  }, []);

  // Filtering + searching + sorting (client-side)
  const filtered = useMemo(() => {
    let list = mentors.slice();

    if (onlineOnly) {
      list = list.filter((m) => m.isOnline || m.online === true);
    }
    if (selectedState) {
      list = list.filter((m) =>
        (m.state || m.location || "").toLowerCase().includes(selectedState.toLowerCase())
      );
    }
    if (selectedLanguage) {
      list = list.filter((m) =>
        (m.languages || m.language || "").toString().toLowerCase().includes(selectedLanguage.toLowerCase())
      );
    }
    if (selectedSkill) {
      list = list.filter((m) =>
        (m.skills || []).join(" ").toLowerCase().includes(selectedSkill.toLowerCase())
      );
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) =>
          (m.name || "").toLowerCase().includes(q) ||
          (m.designation || "").toLowerCase().includes(q) ||
          (m.description || "").toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "fee-low") {
      list.sort((a, b) => (a.fee || 0) - (b.fee || 0));
    } else if (sortBy === "fee-high") {
      list.sort((a, b) => (b.fee || 0) - (a.fee || 0));
    } else if (sortBy === "experience") {
      list.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    } else {
      // recommendation or default: sort by rating -> responseRate -> experience
      list.sort((a, b) => {
        const ra = a.rating ?? 0;
        const rb = b.rating ?? 0;
        if (rb !== ra) return rb - ra;
        const rra = a.responseRate ?? 0;
        const rrb = b.responseRate ?? 0;
        if (rrb !== rra) return rrb - rra;
        return (b.experience || 0) - (a.experience || 0);
      });
    }

    return list;
  }, [mentors, onlineOnly, selectedState, selectedLanguage, selectedSkill, query, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    // if filters change, reset to first page
    setPage(1);
  }, [query, selectedState, selectedLanguage, selectedSkill, onlineOnly, sortBy]);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search & top controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search mentors</label>
            <div className="relative">
              <input
                id="search"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search counsellors"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <span className="whitespace-nowrap">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 bg-white"
              >
                <option value="recommendation">Recommendation</option>
                <option value="fee-low">Fee - Low to High</option>
                <option value="fee-high">Fee - High to Low</option>
                <option value="experience">Experience</option>
              </select>
            </div>

            <button
              onClick={() => {
                // quick reset of filters
                setQuery("");
                setSelectedState("");
                setSelectedLanguage("");
                setSelectedSkill("");
                setOnlineOnly(false);
                setSortBy("recommendation");
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Find Mentors
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Filters */}
          <aside className="md:col-span-3 bg-white rounded-lg p-4 shadow-sm sticky top-20 h-max">
            <div className="flex items-center gap-2 mb-4">
              <input
                id="onlineOnly"
                type="checkbox"
                checked={onlineOnly}
                onChange={(e) => setOnlineOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="onlineOnly" className="text-sm text-gray-700">Online Mentors</label>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Show Only</h4>
              <div className="flex gap-2 items-center text-sm text-gray-700">
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" defaultChecked />
                  <span>All</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" />
                  <span>Male</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" />
                  <span>Female</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-semibold block mb-2">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2"
              >
                <option value="">Select a state</option>
                {ALL_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="text-sm font-semibold block mb-2">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2"
              >
                <option value="">All</option>
                {ALL_LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="text-sm font-semibold block mb-2">Skills</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2"
              >
                <option value="">All</option>
                {ALL_SKILLS.map((sk) => (
                  <option key={sk} value={sk}>{sk}</option>
                ))}
              </select>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Companies</h4>
              <div className="text-sm text-gray-600 space-y-2 max-h-40 overflow-auto pr-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>TCS</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Deloitte</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Amazon</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Microsoft</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Mentor list */}
          <main className="md:col-span-9 space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">{filtered.length} Mentors Found</div>
                <div className="flex items-center gap-3 md:hidden">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 bg-white"
                  >
                    <option value="recommendation">Recommendation</option>
                    <option value="fee-low">Fee - Low to High</option>
                    <option value="fee-high">Fee - High to Low</option>
                    <option value="experience">Experience</option>
                  </select>
                </div>
              </div>

              {/* Mentor cards */}
              <div className="space-y-6">
                {loading ? (
                  <div className="py-12 text-center text-gray-500">Loading...</div>
                ) : paged.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">No mentors available.</div>
                ) : (
                  paged.map((m) => <MentorCard key={m._id ?? m.id ?? m.name} mentor={m} />)
                )}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded-md border border-gray-200 disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <div className="px-3 py-1 border border-gray-200 rounded-md">
                    Page {page} / {totalPages}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded-md border border-gray-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* Mentor Card sub-component */
function MentorCard({ mentor }) {
  // Normalize fields
  const image =
    mentor.image && typeof mentor.image === "string"
      ? mentor.image.startsWith("http")
        ? mentor.image
        : `${mentor.image.startsWith("/") ? "" : ""}${mentor.image}` // assume absolute or relative handled by hosting
      : FALLBACK_AVATAR;

  const name = mentor.name || mentor.fullName || "Unknown";
  const designation = mentor.designation || mentor.title || "Education Counsellor";
  const rating = mentor.rating ?? mentor.avgRating ?? 4.8;
  const ratingCount = mentor.ratingCount ?? mentor.reviews ?? 50;
  const fee = mentor.fee ?? mentor.price ?? 1;
  const experience = mentor.experience ?? mentor.years ?? 5;
  const responseRate = mentor.responseRate ?? mentor.response ?? "95%";
  const location = mentor.state || mentor.location || "Uttar Pradesh";

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center shadow-sm">
      <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200">
        <img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" />
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-gray-400" />
                <span>{designation}</span>
              </div>
              <div>•</div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2l3 7h7l-5.5 4L19 22l-7-5-7 5 1.5-9L3 9h7z" />
                </svg>
                <span>{location}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">({ratingCount})</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {mentor.description ||
            `I'm ${name}. With over ${experience} years of professional experience in counseling, I've successfully guided 100+ students.`}
        </p>

        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">Response {responseRate}</div>
          <div className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{experience} yrs</div>
          {(mentor.skills || []).slice(0, 3).map((s) => (
            <div key={s} className="text-xs bg-gray-100 px-2 py-1 rounded-full">{s}</div>
          ))}
        </div>
      </div>

      <div className="w-44 flex-shrink-0 flex flex-col items-end gap-3">
        <div className="text-right">
          <div className="text-xs text-gray-500">Avg. time</div>
          <div className="text-sm font-semibold text-gray-900">9 minutes</div>
        </div>

        <button
          onClick={() => alert(`Book for ${name}`)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Book a Session for ₹{fee}
        </button>

        <div className="text-xs text-gray-400">Verified</div>
      </div>
    </div>
  );
}

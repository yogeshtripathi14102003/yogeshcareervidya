"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utlis/api.js";
import { Search, MessageSquare, Eye, Clock } from "lucide-react";

export default function StaffQAList({ basePath }) {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/qa/questions", {
        params: { page, search: search || undefined, category: category || undefined, status: status || undefined },
      });
      setQuestions(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      if (res.data?.categories) setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl">
      <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <MessageSquare className="text-indigo-600" /> Student Q&A
      </h1>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="border rounded-lg pl-8 pr-3 py-1.5 text-sm w-full"
          />
        </div>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="border rounded-lg px-2 py-1.5 text-sm">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="border rounded-lg px-2 py-1.5 text-sm">
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <button type="submit" className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">Search</button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border divide-y">
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
        ) : questions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No questions found.</p>
        ) : (
          questions.map((q) => (
            <button
              key={q._id}
              onClick={() => router.push(`${basePath}/${q._id}`)}
              className="w-full text-left p-4 hover:bg-slate-50"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{q.category}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${q.status === "open" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {q.status}
                </span>
                {q.answerCount === 0 && (
                  <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">Needs answer</span>
                )}
              </div>
              <p className="font-semibold text-sm text-slate-800">{q.title}</p>
              <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2">
                <span>{q.student?.name}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {fmt(q.createdAt)}</span>
                <span className="flex items-center gap-1"><Eye size={11} /> {q.views}</span>
                <span className="flex items-center gap-1"><MessageSquare size={11} /> {q.answerCount}</span>
              </div>
            </button>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 text-sm">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
          <span className="px-2 py-1">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}

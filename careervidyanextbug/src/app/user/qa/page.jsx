// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import api from "@/utlis/api.js";
// import RichTextEditor from "@/app/components/RichTextEditor.jsx";
// import { Search, Plus, MessageSquare, Eye, Clock, X } from "lucide-react";

// export default function QAListPage() {
//   const router = useRouter();
//   const [tab, setTab] = useState("browse"); // browse | mine
//   const [questions, setQuestions] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [showAsk, setShowAsk] = useState(false);

//   const fetchQuestions = async () => {
//     setLoading(true);
//     try {
//       const endpoint = tab === "mine" ? "/api/v1/qa/questions/mine" : "/api/v1/qa/questions";
//       const res = await api.get(endpoint, {
//         params: { page, search: search || undefined, category: category || undefined },
//       });
//       setQuestions(res.data?.data || []);
//       setTotalPages(res.data?.totalPages || 1);
//       if (res.data?.categories) setCategories(res.data.categories);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [tab, page, category]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setPage(1);
//     fetchQuestions();
//   };

//   const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

//   return (
//     <div className="max-w-3xl mx-auto p-4 space-y-5">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
//           <MessageSquare className="text-indigo-600" /> Q&A Panel
//         </h1>
//         <button
//           onClick={() => setShowAsk(true)}
//           className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
//         >
//           <Plus size={15} /> Ask a Question
//         </button>
//       </div>

//       <div className="flex gap-2 border-b">
//         {[["browse", "Browse All"], ["mine", "My Questions"]].map(([key, label]) => (
//           <button
//             key={key}
//             onClick={() => { setTab(key); setPage(1); }}
//             className={`px-3 py-2 text-sm font-medium border-b-2 ${tab === key ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500"}`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       {tab === "browse" && (
//         <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
//           <div className="relative flex-1 min-w-[180px]">
//             <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search questions…"
//               className="border rounded-lg pl-8 pr-3 py-1.5 text-sm w-full"
//             />
//           </div>
//           <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="border rounded-lg px-2 py-1.5 text-sm">
//             <option value="">All categories</option>
//             {categories.map((c) => <option key={c} value={c}>{c}</option>)}
//           </select>
//           <button type="submit" className="bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium">Search</button>
//         </form>
//       )}

//       <div className="space-y-2">
//         {loading ? (
//           <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
//         ) : questions.length === 0 ? (
//           <p className="text-sm text-gray-400 text-center py-8">
//             {tab === "mine" ? "You haven't asked anything yet." : "No questions found."}
//           </p>
//         ) : (
//           questions.map((q) => (
//             <button
//               key={q._id}
//               onClick={() => router.push(`/user/qa/${q._id}`)}
//               className="w-full text-left bg-white border rounded-xl p-4 hover:border-indigo-300 transition-colors"
//             >
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{q.category}</span>
//                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${q.status === "open" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
//                   {q.status}
//                 </span>
//               </div>
//               <p className="font-semibold text-sm text-slate-800">{q.title}</p>
//               <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2">
//                 <span>{q.student?.name}</span>
//                 <span className="flex items-center gap-1"><Clock size={11} /> {fmt(q.createdAt)}</span>
//                 <span className="flex items-center gap-1"><Eye size={11} /> {q.views}</span>
//                 <span className="flex items-center gap-1"><MessageSquare size={11} /> {q.answerCount}</span>
//               </div>
//             </button>
//           ))
//         )}
//       </div>

//       {totalPages > 1 && (
//         <div className="flex justify-center gap-2 text-sm">
//           <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
//           <span className="px-2 py-1">{page} / {totalPages}</span>
//           <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
//         </div>
//       )}

//       {showAsk && (
//         <AskQuestionModal
//           categories={categories}
//           onClose={() => setShowAsk(false)}
//           onCreated={(id) => router.push(`/user/qa/${id}`)}
//         />
//       )}
//     </div>
//   );
// }

// function AskQuestionModal({ categories, onClose, onCreated }) {
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");
//   const [category, setCategory] = useState(categories[0] || "General");
//   const [tagsInput, setTagsInput] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async () => {
//     if (!title.trim() || !body.trim()) {
//       setError("Please fill in both a title and your question.");
//       return;
//     }
//     setSubmitting(true);
//     setError("");
//     try {
//       const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5);
//       const res = await api.post("/api/v1/qa/questions", { title, body, category, tags });
//       onCreated(res.data.data._id);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to post your question");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
//         <div className="p-4 border-b flex justify-between items-center">
//           <h2 className="font-semibold">Ask a Question</h2>
//           <button onClick={onClose}><X size={18} /></button>
//         </div>
//         <div className="p-4 space-y-3">
//           {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}
//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="What's your question, in one line?"
//             className="w-full border rounded-lg p-2.5 text-sm"
//             maxLength={200}
//           />
//           <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-lg p-2 text-sm">
//             {categories.map((c) => <option key={c} value={c}>{c}</option>)}
//           </select>
//           <input
//             value={tagsInput}
//             onChange={(e) => setTagsInput(e.target.value)}
//             placeholder="Tags, comma-separated (optional)"
//             className="w-full border rounded-lg p-2.5 text-sm"
//           />
//           <RichTextEditor value={body} onChange={setBody} placeholder="Add any details that would help someone answer…" />
//           <button
//             onClick={handleSubmit}
//             disabled={submitting}
//             className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm disabled:opacity-60"
//           >
//             {submitting ? "Posting…" : "Post Question"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utlis/api.js";
import RichTextEditor from "@/app/components/RichTextEditor.jsx";
import { Search, Plus, MessageSquare, Eye, Clock, X } from "lucide-react";

export default function QAListPage() {
  const router = useRouter();
  const [tab, setTab] = useState("browse"); // browse | mine
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAsk, setShowAsk] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const endpoint = tab === "mine" ? "/api/v1/qa/questions/mine" : "/api/v1/qa/questions";
      const res = await api.get(endpoint, {
        params: { page, search: search || undefined, category: category || undefined },
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
  }, [tab, page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare className="text-indigo-600" /> Q&A Panel
        </h1>
        <button
          onClick={() => setShowAsk(true)}
          className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={15} /> Ask a Question
        </button>
      </div>

      <div className="flex gap-2 border-b">
        {[["browse", "Browse All"], ["mine", "My Questions"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setTab(key); setPage(1); }}
            className={`px-3 py-2 text-sm font-medium border-b-2 ${tab === key ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "browse" && (
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
          <button type="submit" className="bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium">Search</button>
        </form>
      )}

      <div className="space-y-2">
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
        ) : questions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            {tab === "mine" ? "You haven't asked anything yet." : "No questions found."}
          </p>
        ) : (
          questions.map((q) => (
            <button
              key={q._id}
              onClick={() => router.push(`/user/qa/${q._id}`)}
              className="w-full text-left bg-white border rounded-xl p-4 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{q.category}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${q.status === "open" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {q.status}
                </span>
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

      {showAsk && (
        <AskQuestionModal
          categories={categories}
          onClose={() => setShowAsk(false)}
          onCreated={(id) => router.push(`/user/qa/${id}`)}
        />
      )}
    </div>
  );
}

function AskQuestionModal({ categories, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(categories[0] || "General");
  const [tagsInput, setTagsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      setError("Please fill in both a title and your question.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5);
      const res = await api.post("/api/v1/qa/questions", { title, body, category, tags });
      onCreated(res.data.data._id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post your question");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // z-[9999] (was z-50): forces this backdrop + modal above ANY other
    // fixed/absolute element in the app (banners, decorative images, other
    // layout overlays). If something with a higher stacking context was
    // sitting on top of the modal before, it was silently swallowing clicks
    // meant for the RichTextEditor inside — the modal looked fine visually,
    // but focus never actually reached the contentEditable div.
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // don't let clicks inside the card bubble up and close the modal
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">Ask a Question</h2>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="p-4 space-y-3">
          {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your question, in one line?"
            className="w-full border rounded-lg p-2.5 text-sm"
            maxLength={200}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-lg p-2 text-sm">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Tags, comma-separated (optional)"
            className="w-full border rounded-lg p-2.5 text-sm"
          />
          <RichTextEditor value={body} onChange={setBody} placeholder="Add any details that would help someone answer…" />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm disabled:opacity-60"
          >
            {submitting ? "Posting…" : "Post Question"}
          </button>
        </div>
      </div>
    </div>
  );
}
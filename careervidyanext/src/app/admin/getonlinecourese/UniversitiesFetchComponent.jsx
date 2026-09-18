

// "use client";

// import { useEffect, useState } from "react";
// import api from "@/utlis/api.js";

// export default function UniversitiesFetchComponent({ courseId }) {
//   const [universities, setUniversities] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ================= FETCH UNIVERSITIES =================
//   useEffect(() => {
//     const fetchUniversities = async () => {
//       try {
//         const res = await api.get("/api/v1/university");
//         setUniversities(res.data.data || []);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchUniversities();
//   }, []);

//   // ================= TOGGLE SELECT =================
//   const toggleSelect = (uni) => {
//     const exists = selected.some((u) => u._id === uni._id);
//     setSelected(
//       exists
//         ? selected.filter((u) => u._id !== uni._id)
//         : [...selected, uni]
//     );
//   };

//   // ================= FIND COURSE INSIDE UNIVERSITY =================
//   const findCourse = (uni) => {
//     if (!Array.isArray(uni.courses)) return null;
//     return uni.courses.find(
//       (c) => c.courseId === courseId || c.courseId?._id === courseId
//     );
//   };

//   // ================= SAVE TO COURSE =================
//   const saveToCourse = async () => {
//     try {
//       setLoading(true);

//       const payload = {
//         universities: selected.map((uni) => {
//           const course = findCourse(uni);

//           return {
//             universityId: uni._id,
//             name: uni.name,
//             universitySlug: uni.slug,
//             approvals: uni.approvals || [],
//             fees: course?.fees || "",
//             details: course?.details || "",
//           };
//         }),
//       };

//       await api.put(`/api/v1/course/${courseId}/universities`, payload);

//       alert("Universities saved successfully ✅");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= FILTER =================
//   const filtered = universities.filter((u) =>
//     u.name?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-6 bg-white rounded-2xl shadow-lg space-y-6">
//       <h2 className="text-2xl font-bold">Select Universities</h2>

//       <input
//         placeholder="🔍 Search university..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full p-3 border rounded-xl"
//       />

//       {/* ================= UNIVERSITY LIST ================= */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filtered.map((uni) => {
//           const checked = selected.some((u) => u._id === uni._id);
//           return (
//             <label
//               key={uni._id}
//               className={`border-2 rounded-xl p-4 cursor-pointer ${
//                 checked ? "border-purple-600 bg-purple-50" : ""
//               }`}
//             >
//               <input
//                 type="checkbox"
//                 checked={checked}
//                 onChange={() => toggleSelect(uni)}
//                 className="mr-2"
//               />
//               <span className="font-semibold">{uni.name}</span>
//             </label>
//           );
//         })}
//       </div>

//       {/* ================= TABLE ================= */}
//       {selected.length > 0 && (
//         <>
//           <div className="border rounded-xl overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-3">University</th>
//                   <th className="p-3">Approvals</th>
//                   <th className="p-3">Fees</th>
//                   <th className="p-3">Detail Fees</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {selected.map((uni) => {
//                   const course = findCourse(uni);
//                   return (
//                     <tr key={uni._id} className="border-t">
//                       <td className="p-3 font-medium">{uni.name}</td>

//                       <td className="p-3">
//                         <div className="flex gap-1 flex-wrap">
//                           {uni.approvals?.map((a, i) => (
//                             <span
//                               key={i}
//                               className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold"
//                             >
//                               {a.name}
//                             </span>
//                           ))}
//                         </div>
//                       </td>

//                       <td className="p-3 font-semibold text-purple-700">
//                         {course?.fees || "N/A"}
//                       </td>

//                       <td className="p-3 text-xs text-gray-600">
//                         {course?.details || "N/A"}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <button
//             onClick={saveToCourse}
//             disabled={loading}
//             className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
//           >
//             {loading ? "Saving..." : "Save Selected Universities"}
//           </button>
//         </>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";

// ======================================================
// 🎯 UNIVERSITY SELECTOR
// Fetches all universities from DB + lets admin select
// + fill course-specific data for each
// ======================================================

export default function UniversitySelector({ value = [], onChange }) {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ---------- FETCH UNIVERSITIES ----------
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/v1/university");
        const list =
          res.data?.data ||
          res.data?.universities ||
          res.data?.university ||
          [];
        setUniversities(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Fetch universities error:", err);
        setError("Failed to load universities");
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  // ---------- HELPERS ----------
  const isSelected = (id) =>
    value.some((v) => String(v.universityId) === String(id));

  const toggleUniversity = (uni) => {
    if (isSelected(uni._id)) {
      onChange(
        value.filter((v) => String(v.universityId) !== String(uni._id))
      );
    } else {
      onChange([
        ...value,
        {
          universityId: uni._id,
          name: uni.name,
          slug: uni.slug,
          universityImage: uni.universityImage,
          rating: uni.rating,
          approvals: uni.approvals,
          displayOrder: value.length + 1,
          courseFees: {
            total: "",
            perSemester: "",
            registration: "",
            emiStartsFrom: "",
          },
          duration: "",
          specializations: [],
          mode: "Online",
          eligibility: "",
          applyLink: "",
          brochureLink: "",
          isTopRated: false,
          badgeText: "",
        },
      ]);
    }
  };

  const updateField = (uniId, key, val) => {
    onChange(
      value.map((v) =>
        String(v.universityId) === String(uniId) ? { ...v, [key]: val } : v
      )
    );
  };

  const updateFee = (uniId, feeKey, val) => {
    onChange(
      value.map((v) =>
        String(v.universityId) === String(uniId)
          ? { ...v, courseFees: { ...(v.courseFees || {}), [feeKey]: val } }
          : v
      )
    );
  };

  const removeUniversity = (uniId) => {
    onChange(value.filter((v) => String(v.universityId) !== String(uniId)));
  };

  const filtered = universities.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500">Loading universities...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
        {error}
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-md">
        No universities found in database.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============ SEARCH ============ */}
      <input
        type="text"
        placeholder="🔍 Search universities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-2 rounded-md"
      />

      {/* ============ UNIVERSITY LIST ============ */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
        {filtered.map((uni) => {
          const selected = isSelected(uni._id);
          return (
            <button
              type="button"
              key={uni._id}
              onClick={() => toggleUniversity(uni)}
              className={`text-left p-3 border rounded-lg transition-all flex items-start gap-3 ${
                selected
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                  : "border-gray-200 hover:border-blue-300 bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={selected}
                readOnly
                className="mt-1 w-4 h-4"
              />

              {uni.universityImage && (
                <img
                  src={uni.universityImage}
                  alt={uni.name}
                  className="w-10 h-10 object-contain rounded border bg-white"
                />
              )}

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#002147] truncate">
                  {uni.name}
                </p>
                {uni.rating > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    ⭐ {uni.rating} ({uni.reviewsCount || 0})
                  </p>
                )}
                {uni.approvals?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {uni.approvals.slice(0, 2).map((a, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded"
                      >
                        {a.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No universities match "{search}"
        </p>
      )}

      {/* ============ SELECTED — COURSE-SPECIFIC FORM ============ */}
      {value.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-bold text-lg text-[#002147] border-b pb-2">
            ✅ Selected Universities ({value.length})
          </h3>

          {value.map((sel, idx) => {
            const uni = universities.find(
              (u) => String(u._id) === String(sel.universityId)
            );

            return (
              <div
                key={sel.universityId || idx}
                className="bg-white border rounded-xl p-4"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3 pb-2 border-b">
                  <div className="flex items-center gap-2">
                    {uni?.universityImage && (
                      <img
                        src={uni.universityImage}
                        alt={uni.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-[#002147]">
                        {sel.name || uni?.name}
                      </h4>
                      {uni?.rating > 0 && (
                        <p className="text-xs text-gray-500">
                          ⭐ {uni.rating}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeUniversity(sel.universityId)}
                    className="text-red-500 text-xs hover:text-red-700"
                  >
                    ✕ Remove
                  </button>
                </div>

                {/* Course Fees */}
                <p className="text-xs font-bold text-gray-600 uppercase mb-2">
                  💰 Course Fees
                </p>
                <div className="grid md:grid-cols-4 gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Total (₹1,50,000)"
                    value={sel.courseFees?.total || ""}
                    onChange={(e) =>
                      updateFee(sel.universityId, "total", e.target.value)
                    }
                    className="border p-2 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Per Semester (₹25,000)"
                    value={sel.courseFees?.perSemester || ""}
                    onChange={(e) =>
                      updateFee(sel.universityId, "perSemester", e.target.value)
                    }
                    className="border p-2 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Registration (₹1,000)"
                    value={sel.courseFees?.registration || ""}
                    onChange={(e) =>
                      updateFee(sel.universityId, "registration", e.target.value)
                    }
                    className="border p-2 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="EMI from (₹6,250/mo)"
                    value={sel.courseFees?.emiStartsFrom || ""}
                    onChange={(e) =>
                      updateFee(
                        sel.universityId,
                        "emiStartsFrom",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded-md text-sm"
                  />
                </div>

                {/* Basic Info */}
                <p className="text-xs font-bold text-gray-600 uppercase mb-2">
                  📋 Basic Info
                </p>
                <div className="grid md:grid-cols-3 gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Duration (3 Years)"
                    value={sel.duration || ""}
                    onChange={(e) =>
                      updateField(sel.universityId, "duration", e.target.value)
                    }
                    className="border p-2 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Apply Link (/apply/amity)"
                    value={sel.applyLink || ""}
                    onChange={(e) =>
                      updateField(sel.universityId, "applyLink", e.target.value)
                    }
                    className="border p-2 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Brochure Link"
                    value={sel.brochureLink || ""}
                    onChange={(e) =>
                      updateField(sel.universityId, "brochureLink", e.target.value)
                    }
                    className="border p-2 rounded-md text-sm"
                  />
                </div>

                {/* Display Controls */}
                <p className="text-xs font-bold text-gray-600 uppercase mb-2">
                  🎨 Display
                </p>
                <div className="grid md:grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Display Order"
                    value={sel.displayOrder || 0}
                    onChange={(e) =>
                      updateField(
                        sel.universityId,
                        "displayOrder",
                        Number(e.target.value)
                      )
                    }
                    className="border p-2 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Badge (Top Rated)"
                    value={sel.badgeText || ""}
                    onChange={(e) =>
                      updateField(sel.universityId, "badgeText", e.target.value)
                    }
                    className="border p-2 rounded-md text-sm"
                  />
                  <label className="flex items-center gap-2 px-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sel.isTopRated || false}
                      onChange={(e) =>
                        updateField(
                          sel.universityId,
                          "isTopRated",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Top Rated</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
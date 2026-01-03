// "use client";

// import { useEffect, useState } from "react";
// import api from "@/utlis/api.js";

// export default function UniversitiesFetchComponent({ courseId }) {
//   const [universities, setUniversities] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [search, setSearch] = useState("");

//   // ================= FETCH =================
//   useEffect(() => {
//     const fetchUniversities = async () => {
//       const res = await api.get("/api/v1/university");
//       setUniversities(res.data.data || []);
//     };
//     fetchUniversities();
//   }, []);

//   // ================= SELECT =================
//   const toggleSelect = (uni) => {
//     const exists = selected.some((u) => u._id === uni._id);
//     setSelected(
//       exists
//         ? selected.filter((u) => u._id !== uni._id)
//         : [...selected, uni]
//     );
//   };

//   // ================= COURSE FIND (REAL FIX) =================
//   const findCourse = (uni) => {
//     if (!Array.isArray(uni.courses)) return null;

//     return uni.courses.find(
//       (c) =>
//         c.courseId === courseId || // ⭐ BEST MATCH
//         c.courseId?._id === courseId
//     );
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

//       {/* UNIVERSITY LIST */}
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
//         <div className="border rounded-xl overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3">University</th>
//                 <th className="p-3">Approvals</th>
//                 <th className="p-3">Fees</th>
//                 <th className="p-3">Detail Fees</th>
//               </tr>
//             </thead>

//             <tbody>
//               {selected.map((uni) => {
//                 const course = findCourse(uni);

//                 return (
//                   <tr key={uni._id} className="border-t">
//                     <td className="p-3 font-medium">{uni.name}</td>

//                     <td className="p-3">
//                       <div className="flex gap-1 flex-wrap">
//                         {uni.approvals?.map((a, i) => (
//                           <span
//                             key={i}
//                             className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold"
//                           >
//                             {a.name}
//                           </span>
//                         )) || "N/A"}
//                       </div>
//                     </td>

//                     <td className="p-3 font-semibold text-purple-700">
//                       {course?.fees || "N/A"}
//                     </td>

//                     <td className="p-3 text-xs text-gray-600">
//                       {course?.details || "N/A"}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";

export default function UniversitiesFetchComponent({ courseId }) {
  const [universities, setUniversities] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH UNIVERSITIES =================
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get("/api/v1/university");
        setUniversities(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUniversities();
  }, []);

  // ================= TOGGLE SELECT =================
  const toggleSelect = (uni) => {
    const exists = selected.some((u) => u._id === uni._id);
    setSelected(
      exists
        ? selected.filter((u) => u._id !== uni._id)
        : [...selected, uni]
    );
  };

  // ================= FIND COURSE INSIDE UNIVERSITY =================
  const findCourse = (uni) => {
    if (!Array.isArray(uni.courses)) return null;
    return uni.courses.find(
      (c) => c.courseId === courseId || c.courseId?._id === courseId
    );
  };

  // ================= SAVE TO COURSE =================
  const saveToCourse = async () => {
    try {
      setLoading(true);

      const payload = {
        universities: selected.map((uni) => {
          const course = findCourse(uni);

          return {
            universityId: uni._id,
            name: uni.name,
            universitySlug: uni.slug,
            approvals: uni.approvals || [],
            fees: course?.fees || "",
            details: course?.details || "",
          };
        }),
      };

      await api.put(`/api/v1/course/${courseId}/universities`, payload);

      alert("Universities saved successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to save ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER =================
  const filtered = universities.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold">Select Universities</h2>

      <input
        placeholder="🔍 Search university..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-xl"
      />

      {/* ================= UNIVERSITY LIST ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((uni) => {
          const checked = selected.some((u) => u._id === uni._id);
          return (
            <label
              key={uni._id}
              className={`border-2 rounded-xl p-4 cursor-pointer ${
                checked ? "border-purple-600 bg-purple-50" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleSelect(uni)}
                className="mr-2"
              />
              <span className="font-semibold">{uni.name}</span>
            </label>
          );
        })}
      </div>

      {/* ================= TABLE ================= */}
      {selected.length > 0 && (
        <>
          <div className="border rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">University</th>
                  <th className="p-3">Approvals</th>
                  <th className="p-3">Fees</th>
                  <th className="p-3">Detail Fees</th>
                </tr>
              </thead>

              <tbody>
                {selected.map((uni) => {
                  const course = findCourse(uni);
                  return (
                    <tr key={uni._id} className="border-t">
                      <td className="p-3 font-medium">{uni.name}</td>

                      <td className="p-3">
                        <div className="flex gap-1 flex-wrap">
                          {uni.approvals?.map((a, i) => (
                            <span
                              key={i}
                              className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold"
                            >
                              {a.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-3 font-semibold text-purple-700">
                        {course?.fees || "N/A"}
                      </td>

                      <td className="p-3 text-xs text-gray-600">
                        {course?.details || "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            onClick={saveToCourse}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Selected Universities"}
          </button>
        </>
      )}
    </div>
  );
}

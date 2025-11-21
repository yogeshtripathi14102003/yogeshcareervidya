// "use client";

// import React, { useEffect, useState } from "react";
// import api from "@/utlis/api.js";
// import { Pencil, Trash2, ChevronDown, ChevronUp, BookOpen } from "lucide-react";

// export default function GetUniversityData() {
//   const [universities, setUniversities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deleting, setDeleting] = useState(null);
//   const [expandedId, setExpandedId] = useState(null);
//   const [courseData, setCourseData] = useState({});

//   /* -------------------- FETCH UNIVERSITIES -------------------- */
//   const fetchUniversities = async () => {
//     try {
//       const res = await api.get("/api/v1/university");
//       setUniversities(res.data?.data || []);
//     } catch (err) {
//       console.error("Fetch Universities Error:", err);
//       alert("Failed to load universities. Please check the API.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -------------------- FETCH COURSES (SINGLE UNIVERSITY) -------------------- */
//   const fetchCourses = async (id) => {
//     try {
//       const res = await api.get(`/api/v1/university/${id}`);
//       setCourseData((prev) => ({
//         ...prev,
//         [id]: res.data?.data?.courses || [],
//       }));
//     } catch (err) {
//       console.error("Fetch Courses Error:", err);
//       setCourseData((prev) => ({ ...prev, [id]: [] }));
//     }
//   };

//   useEffect(() => {
//     fetchUniversities();
//   }, []);

//   /* -------------------- DELETE UNIVERSITY -------------------- */
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this university?")) return;

//     try {
//       setDeleting(id);
//       const res = await api.delete(`/api/v1/university/${id}`);

//       if (res.data?.success) {
//         alert("University deleted successfully!");
//         await fetchUniversities();
//       } else {
//         throw new Error("Delete failed");
//       }
//     } catch (err) {
//       console.error("Delete Error:", err);
//       alert("Failed to delete university. Check the backend route.");
//     } finally {
//       setDeleting(null);
//     }
//   };

//   /* -------------------- TOGGLE EXPAND COURSES -------------------- */
//   const toggleExpand = async (id) => {
//     if (expandedId === id) {
//       setExpandedId(null);
//     } else {
//       setExpandedId(id);
//       if (!courseData[id]) await fetchCourses(id);
//     }
//   };

//   /* -------------------- LOADING STATE -------------------- */
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[60vh] text-gray-500">
//         Loading universities...
//       </div>
//     );
//   }

//   /* -------------------- MAIN UI -------------------- */
//   return (
//     <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
//       <h2 className="text-2xl font-semibold mb-6 text-center text-[#0056B3]">
//         🎓 University List
//       </h2>

//       {universities.length === 0 ? (
//         <p className="text-center text-gray-500">No universities found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-200 rounded-lg">
//             <thead className="bg-[#0056B3] text-white">
//               <tr>
//                 <th className="py-3 px-4 text-left">#</th>
//                 <th className="py-3 px-4 text-left">University Name</th>
//                 <th className="py-3 px-4 text-center">Total Courses</th>
//                 <th className="py-3 px-4 text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {universities.map((uni, index) => (
//                 <React.Fragment key={uni._id}>
//                   <tr className="border-t hover:bg-gray-50 transition-all">
//                     <td className="py-3 px-4">{index + 1}</td>
//                     <td className="py-3 px-4 font-medium">{uni.name}</td>

//                     <td className="py-3 px-4 text-center font-semibold">
//                       {uni.courses?.length || 0}
//                     </td>

//                     <td className="py-3 px-4 text-center">
//                       <div className="flex justify-center gap-3">
//                         {/* Expand / Collapse */}
//                         <button
//                           onClick={() => toggleExpand(uni._id)}
//                           className="p-2 rounded-full hover:bg-green-100 text-green-600"
//                         >
//                           {expandedId === uni._id ? (
//                             <ChevronUp size={18} />
//                           ) : (
//                             <ChevronDown size={18} />
//                           )}
//                         </button>

//                         {/* Edit (Redirect or Modal - coming soon) */}
//                         <button
//                           onClick={() => alert(`Edit ${uni.name} feature coming soon!`)}
//                           className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
//                         >
//                           <Pencil size={18} />
//                         </button>

//                         {/* Delete */}
//                         <button
//                           onClick={() => handleDelete(uni._id)}
//                           disabled={deleting === uni._id}
//                           className={`p-2 rounded-full hover:bg-red-100 text-red-600 ${
//                             deleting === uni._id ? "opacity-50 cursor-not-allowed" : ""
//                           }`}
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>

//                   {/* Expandable Course List */}
//                   {expandedId === uni._id && (
//                     <tr>
//                       <td colSpan="4" className="bg-gray-50">
//                         {courseData[uni._id] ? (
//                           courseData[uni._id].length > 0 ? (
//                             <div className="p-4">
//                               <h3 className="text-lg font-semibold text-[#0056B3] flex items-center gap-2 mb-2">
//                                 <BookOpen size={18} /> Courses Offered
//                               </h3>
//                               <ul className="list-disc pl-6 space-y-1">
//                                 {courseData[uni._id].map((c, i) => (
//                                   <li key={i}>
//                                     <span className="font-medium">{c.name}</span>{" "}
//                                     {c.duration && (
//                                       <span className="text-gray-600">
//                                         ({c.duration})
//                                       </span>
//                                     )}
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           ) : (
//                             <p className="p-4 text-gray-500">
//                               No courses found for this university.
//                             </p>
//                           )
//                         ) : (
//                           <p className="p-4 text-gray-400">Loading courses...</p>
//                         )}
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Pencil, Trash2 } from "lucide-react";

export default function GetUniversityData() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUniversities = async () => {
    try {
      const res = await api.get("/api/v1/university");
      setUniversities(res.data?.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading universities...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#0056B3]">
        🎓 University List
      </h2>

      {universities.length === 0 ? (
        <p className="text-center text-gray-500">No universities found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-[#0056B3] text-white">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">University Name</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-center">Total Courses</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {universities.map((uni, index) => (
                <tr
                  key={uni._id}
                  className="border-t hover:bg-gray-50 transition-all"
                >
                  {/* index */}
                  <td className="py-3 px-4">{index + 1}</td>

                  {/* image */}
                  <td className="py-3 px-4">
                    <img
                      src={
                        uni.universityImage?.startsWith("http")
                          ? uni.universityImage
                          : `${process.env.NEXT_PUBLIC_API_URL}/${uni.universityImage?.replace(
                              /^\/+/,
                              ""
                            )}`
                      }
                      alt={uni.name}
                      className="h-14 w-14 rounded-full object-cover border"
                      onError={(e) => (e.target.src = "/no-image.png")}
                    />
                  </td>

                  {/* name */}
                  <td className="py-3 px-4 font-medium">{uni.name}</td>

                  {/* description */}
                  <td className="py-3 px-4 text-gray-700">
                    {uni.description || "No description available"}
                  </td>

                  {/* total courses */}
                  <td className="py-3 px-4 text-center font-semibold">
                    {uni.courses?.length || 0}
                  </td>

                  {/* actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button className="p-2 rounded-full hover:bg-blue-100 text-blue-600">
                        <Pencil size={18} />
                      </button>

                      <button className="p-2 rounded-full hover:bg-red-100 text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}

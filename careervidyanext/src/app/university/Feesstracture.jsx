"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";
import Applicationpopup from "@/app/university/Applictionpopup.jsx";

export default function FeesStructureStyledTable({ slug, courseTitle }) {
  const [courses, setCourses] = useState([]);
  const [universityName, setUniversityName] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const res = await api.get(`/api/v1/university/slug/${slug}`);
        setCourses(res.data?.data?.courses || []);
        setUniversityName(res.data?.data?.name || "");
      } catch (error) {
        console.error("Fees table error:", error);
      }
    };

    fetchData();
  }, [slug]);

  if (!courses.length) return null;

  const handleOpenPopup = (course) => {
    setSelectedCourse(course);
    setOpenPopup(true);
  };

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-14">
        {/* Heading */}
        <div className="bg-[#0b3a6f] text-white text-center py-4 rounded-t-lg">
          <h2 className="text-xl md:text-2xl font-semibold">
            {universityName} Fees Structure{" "}
            {courseTitle && (
              <span className="font-normal">for {courseTitle}</span>
            )}
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-t-0 rounded-b-lg">
          <table className="w-full border-collapse">
            <thead className="bg-[#eaf4ff]">
              <tr>
                <th className="text-center p-4 border text-lg font-semibold">
                  Course Name
                </th>
                <th className="text-center p-4 border text-lg font-semibold">
                  Duration
                </th>
                <th className="text-center p-4 border text-lg font-semibold">
                  Course Fees
                </th>
                <th className="text-center p-4 border text-lg font-semibold">
                  Detailed Fee Structure
                </th>
              </tr>
            </thead>

            <tbody>
              {courses.map((course, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {/* Course Name → Popup */}
                  <td className="p-4 border">
                    <button
                      onClick={() => handleOpenPopup(course)}
                      className="text-blue-600 font-medium underline text-left block"
                    >
                      {course.name}
                    </button>
                  </td>

                  <td className="p-4 border font-medium">
                    {course.duration || "N/A"}
                  </td>

                  <td className="p-4 border font-medium">
                    {course.fees || "—"}
                  </td>

                  <td className="p-4 border text-gray-700">
                    {course.details || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Application Popup */}
      {openPopup && (
        <Applicationpopup
          open={openPopup}
          setOpen={setOpenPopup}
          course={selectedCourse}
          universityName={universityName}
        />
      )}
    </>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import api from "@/utlis/api";
// import Applicationpopup from "@/app/university/Applictionpopup.jsx";

// export default function FeesStructureStyledTable({ slug, courseTitle }) {
//   const [courses, setCourses] = useState([]);
//   const [universityName, setUniversityName] = useState("");
//   const [openPopup, setOpenPopup] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);

//   useEffect(() => {
//     if (!slug) return;

//     const fetchData = async () => {
//       try {
//         const res = await api.get(`/api/v1/university/slug/${slug}`);
//         setCourses(res.data?.data?.courses || []);
//         setUniversityName(res.data?.data?.name || "");
//       } catch (error) {
//         console.error("Fees table error:", error);
//       }
//     };

//     fetchData();
//   }, [slug]);

//   if (!courses.length) return null;

//   const handleOpenPopup = (course) => {
//     setSelectedCourse(course);
//     setOpenPopup(true);
//   };

//   // ✅ CLOSE HANDLER
//   const handleClosePopup = () => {
//     setOpenPopup(false);
//     setSelectedCourse(null);
//   };

//   return (
//     <>
//       <section className="max-w-7xl mx-auto px-4 md:px-6 mt-14">
//         <div className="bg-[#0b3a6f] text-white text-center py-4 rounded-t-lg">
//           <h2 className="text-xl md:text-2xl font-semibold">
//             {universityName} Fees Structure{" "}
//             {courseTitle && <span className="font-normal">for {courseTitle}</span>}
//           </h2>
//         </div>

//         <div className="overflow-x-auto border border-t-0 rounded-b-lg shadow-sm">
//           <table className="w-full border-collapse">
//             <thead className="bg-[#eaf4ff]">
//               <tr>
//                 <th className="p-4 border text-left">Course Name</th>
//                 <th className="p-4 border text-center">Duration</th>
//                 <th className="p-4 border text-center">Course Fees</th>
//                 <th className="p-4 border text-center">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {courses.map((course, index) => (
//                 <tr key={index} className="hover:bg-blue-50/50">
//                   <td className="p-4 border">
//                     <button
//                       onClick={() => handleOpenPopup(course)}
//                       className="text-blue-600 hover:underline"
//                     >
//                       {course.name}
//                     </button>
//                   </td>
//                   <td className="p-4 border text-center">{course.duration || "N/A"}</td>
//                   <td className="p-4 border text-center">{course.fees || "—"}</td>
//                   <td className="p-4 border text-center">
//                     <button
//                       onClick={() => handleOpenPopup(course)}
//                       className="bg-blue-600 text-white px-4 py-1.5 rounded"
//                     >
//                       Apply Now
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       {/* ✅ POPUP */}
//       {openPopup && (
//         <Applicationpopup
//           open={openPopup}
//           onClose={handleClosePopup}   // 👈 IMPORTANT
//           course={selectedCourse}
//           universityName={universityName}
//         />
//       )}
//     </>
//   );
// }



// "use client";

// import { useState } from "react";
// import Applicationpopup from "@/app/university/Applictionpopup.jsx";

// // ✅ FIX: was self-fetching /api/v1/university/slug/{slug} again — same
// // data the parent (UniversityDetail) already fetched server-side. Removed
// // useEffect/api call/state for courses+universityName; both now come
// // straight from the `data` prop, so this table renders in the initial
// // SSR HTML instead of appearing only after a client-side fetch resolves.
// export default function FeesStructureSection({ data, courseTitle }) {
//     const courses = data?.courses || [];
//     const universityName = data?.name || "";

//     const [openPopup, setOpenPopup] = useState(false);
//     const [selectedCourse, setSelectedCourse] = useState(null);

//     if (!courses.length) return null;

//     const handleOpenPopup = (course) => {
//         setSelectedCourse(course);
//         setOpenPopup(true);
//     };

//     return (
//         <>
//             <section className="max-w-7xl mx-auto px-4 md:px-6 mt-14">
//                 {/* Heading */}
//                 <div className="bg-[#0b3a6f] text-white text-center py-4 rounded-t-lg">
//                     <h2 className="text-xl md:text-2xl font-semibold">
//                         {universityName} Fees Structure{" "}
//                         {courseTitle && (
//                             <span className="font-normal">for {courseTitle}</span>
//                         )}
//                     </h2>
//                 </div>

//                 {/* Table */}
//                 <div className="overflow-x-auto border border-t-0 rounded-b-lg">
//                     <table className="w-full border-collapse">
//                         <thead className="bg-[#eaf4ff]">
//                             <tr>
//                                 <th className="text-center p-4 border text-lg font-semibold">
//                                     Course Name
//                                 </th>
//                                 <th className="text-center p-4 border text-lg font-semibold">
//                                     Duration
//                                 </th>
//                                 <th className="text-center p-4 border text-lg font-semibold">
//                                     Course Fees
//                                 </th>
//                                 <th className="text-center p-4 border text-lg font-semibold">
//                                     Detailed Fee Structure
//                                 </th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {courses.map((course, index) => (
//                                 <tr key={index} className="hover:bg-gray-50">
//                                     {/* Course Name → Popup */}
//                                     <td className="p-4 border">
//                                         <button
//                                             onClick={() => handleOpenPopup(course)}
//                                             className="text-blue-600 font-medium underline text-left block cursor-pointer"
//                                         >
//                                             {course.name}
//                                         </button>
//                                     </td>

//                                     <td className="p-4 border font-medium">
//                                         {course.duration || "N/A"}
//                                     </td>

//                                     <td className="p-4 border font-medium">
//                                         {course.fees || "—"}
//                                     </td>

//                                     <td className="p-4 border text-gray-700">
//                                         {course.details || "—"}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </section>

//             {/* Application Popup */}
//             {openPopup && (
//                 <Applicationpopup
//                     open={openPopup}
//                     setOpen={setOpenPopup}
//                     course={selectedCourse}
//                     universityName={universityName}
//                 />
//             )}
//         </>
//     );
// }

"use client";

import { useState } from "react";
import Applicationpopup from "@/app/university/Applictionpopup.jsx";
import { cleanHtml } from "@/utlis/cleanHtml.js";

export default function FeesStructureSection({ data, courseTitle }) {
    const courses = data?.courses || [];
    const universityName = data?.name || "";

    const [openPopup, setOpenPopup] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    if (!courses.length) return null;

    const handleOpenPopup = (course) => {
        setSelectedCourse(course);
        setOpenPopup(true);
    };

    return (
        <>
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-[#0b3a6f] text-white text-center py-4">
                    <h2 className="text-xl md:text-2xl font-semibold">
                        {universityName} Fees Structure{" "}
                        {courseTitle && (
                            <span className="font-normal">for {courseTitle}</span>
                        )}
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-[#eaf4ff]">
                            <tr>
                                <th className="text-left p-4 border-b border-gray-200 text-sm font-semibold">
                                    Course Name
                                </th>
                                <th className="text-left p-4 border-b border-gray-200 text-sm font-semibold">
                                    Duration
                                </th>
                                <th className="text-left p-4 border-b border-gray-200 text-sm font-semibold">
                                    Course Fees
                                </th>
                                <th className="text-left p-4 border-b border-gray-200 text-sm font-semibold">
                                    Detailed Fee Structure
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {courses.map((course, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                >
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleOpenPopup(course)}
                                            className="text-blue-600 font-medium underline text-left cursor-pointer"
                                        >
                                            {course.name}
                                        </button>
                                    </td>
                                    <td className="p-4 font-medium text-sm">
                                        {course.duration || "N/A"}
                                    </td>
                                    <td className="p-4 font-medium text-sm">
                                        {course.fees || "—"}
                                    </td>
                                    <td
                                        className="p-4 text-sm text-gray-700"
                                        dangerouslySetInnerHTML={{
                                            __html: cleanHtml(course.details || "—"),
                                        }}
                                    />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

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
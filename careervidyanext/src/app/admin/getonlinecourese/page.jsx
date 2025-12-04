



// "use client";

// import { useState, useEffect } from "react";
//  import api from "@/utlis/api.js"; // ✅ your axios instance

// export default function CoursesPage() {
//   const [formData, setFormData] = useState({
//     category: "",
//     name: "",
//     duration: "",
//     tag: "",
//   });
//   const [specializations, setSpecializations] = useState([""]);
//   const [courseLogo, setCourseLogo] = useState(null);

//   const [overview, setOverview] = useState([
//     { heading: "", description: "", image: null, videoLink: "" },
//   ]);
//   const [whyChooseUs, setWhyChooseUs] = useState([
//     { image: null, description: "" },
//   ]);
//   const [goodThings, setGoodThings] = useState([""]);
//   const [topUniversities, setTopUniversities] = useState([
//     { name: "", description: "" },
//   ]);
//   const [keyHighlights, setKeyHighlights] = useState([
//     { heading: "", subHeading: "", description: "" },
//   ]);
//   const [syllabus, setSyllabus] = useState([{ semester: "", subjects: [""] }]);

//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ Fetch existing courses
//   const fetchCourses = async () => {
//     try {
//       const res = await api.get("/api/v1/course");
//       setCourses(res.data.courses || []);
//     } catch (err) {
//       console.error("Error fetching courses:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // ✅ Input Handlers
//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleFileChange = (e) => setCourseLogo(e.target.files[0]);

//   const handleDynamicChange = (setter, index, key, value) => {
//     setter((prev) => {
//       const updated = [...prev];
//       updated[index][key] = value;
//       return updated;
//     });
//   };

//   const addField = (setter, newObj) => setter((prev) => [...prev, newObj]);
//   const removeField = (setter, index) =>
//     setter((prev) => prev.filter((_, i) => i !== index));

//   const handleSpecializationChange = (i, val) => {
//     const updated = [...specializations];
//     updated[i] = val;
//     setSpecializations(updated);
//   };

//   const addSpecialization = () => setSpecializations([...specializations, ""]);
//   const removeSpecialization = (i) =>
//     setSpecializations(specializations.filter((_, idx) => idx !== i));

//   // ✅ Handle Syllabus subjects
//   const handleSubjectChange = (semIndex, subIndex, value) => {
//     const updated = [...syllabus];
//     updated[semIndex].subjects[subIndex] = value;
//     setSyllabus(updated);
//   };

//   const addSubject = (semIndex) => {
//     const updated = [...syllabus];
//     updated[semIndex].subjects.push("");
//     setSyllabus(updated);
//   };

//   // ✅ Submit Form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const payload = new FormData();

//       // Helper function for slug
//       const slugify = (text) =>
//         text
//           .toString()
//           .toLowerCase()
//           .trim()
//           .replace(/\s+/g, "-")
//           .replace(/[^\w\-]+/g, "")
//           .replace(/\-\-+/g, "-");

//       // Basic fields
//       Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
//       payload.append("slug", slugify(formData.name));

//       if (courseLogo) payload.append("courseLogo", courseLogo);

//       // Specializations
//       specializations
//         .filter((s) => s.trim() !== "")
//         .forEach((spec) => payload.append("specialization", spec));

//       // Overview
//     // Overview
// overview.forEach((item, i) => {
//   payload.append(`overview[${i}][heading]`, item.heading);
//   payload.append(`overview[${i}][description]`, item.description);
//   payload.append(`overview[${i}][videoLink]`, item.videoLink);

//   if (item.image) {
//     payload.append("overviewImages", item.image);
//   }
// });

// // Why Choose Us
// whyChooseUs.forEach((item, i) => {
//   payload.append(`whyChooseUs[${i}][description]`, item.description);

//   if (item.image) {
//     payload.append("whyChooseUsImages", item.image);
//   }
// });


//       // Good Things
//       goodThings
//         .filter((g) => g.trim() !== "")
//         .forEach((g) => payload.append("goodThings", g));

//       // Top Universities
//       topUniversities
//         .filter((item) => item.name)
//         .forEach((item, i) => {
//           payload.append(`topUniversities[${i}][name]`, item.name);
//           payload.append(
//             `topUniversities[${i}][description]`,
//             item.description
//           );
//         });

//       // Key Highlights
//       keyHighlights
//         .filter((item) => item.heading)
//         .forEach((item, i) => {
//           payload.append(`keyHighlights[${i}][heading]`, item.heading);
//           payload.append(`keyHighlights[${i}][subHeading]`, item.subHeading);
//           payload.append(`keyHighlights[${i}][description]`, item.description);
//         });

//       // Syllabus
//       syllabus
//         .filter((sem) => sem.semester)
//         .forEach((sem, i) => {
//           payload.append(`syllabus[${i}][semester]`, sem.semester);
//           sem.subjects
//             .filter((s) => s.trim() !== "")
//             .forEach((sub) =>
//               payload.append(`syllabus[${i}][subjects]`, sub)
//             );
//         });

//       // ✅ Send to backend
//       await api.post("/api/v1/course", payload, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("✅ Course Created Successfully!");
//       fetchCourses();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Error creating course");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ UI STARTS HERE
//   return (
//     <main className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-2xl font-semibold text-gray-800 mb-6">
//         🎓 Course Management
//       </h1>

//       <form
//         onSubmit={handleSubmit}
//         encType="multipart/form-data"
//         className="bg-white shadow p-6 rounded-xl space-y-8"
//       >
//         {/* BASIC DETAILS */}
//         <section className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label>Category</label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="w-full border p-2 rounded-md"
//             >
//               <option value="">Select</option>
//               <option value="UG">UG</option>
//               <option value="PG">PG</option>
//               <option value="Doctorate">Doctorate</option>
//               <option value="JobGuarantee">Job Guarantee</option>
//             </select>
//           </div>

//           <div>
//             <label>Name</label>
//             <input
//               type="text"
//               placeholder=" add Course name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border p-2 rounded-md"
//               required
//             />
//           </div>

//           <div>
//             <label>Duration</label>
//             <input
//               type="text"
//               placeholder="Course ki durection"
//               name="duration"
//               value={formData.duration}
//               onChange={handleChange}
//               className="w-full border p-2 rounded-md"
//               required
//             />
//           </div>

//           <div>
//             <label>Tag</label>
//             <input
//               type="text"
//               placeholder="like card ke uper side optional "
//               name="tag"
//               value={formData.tag}
//               onChange={handleChange}
//               className="w-full border p-2 rounded-md"
//             />
//           </div>

//           <div>
//             <label>Course Logo</label>
//             <input
//               type="file"
//               placeholder="course ka logo  show card"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="w-full border p-2 rounded-md"
//             />
//           </div>
//         </section>

//         {/* SPECIALIZATIONS */}
//         <section>
//           <h2 className="font-semibold text-lg mb-2">Specializations</h2>
//           {specializations.map((spec, i) => (
//             <div key={i} className="flex gap-2 mb-2">
//               <input
//                 type="text"
//                 placeholder=" Please add the relevant branches assigned to each specific course "
//                 value={spec}
//                 onChange={(e) =>
//                   handleSpecializationChange(i, e.target.value)
//                 }
//                 className="w-full border p-2 rounded-md"
//               />
//               {i > 0 && (
//                 <button
//                   type="button"
//                   onClick={() => removeSpecialization(i)}
//                   className="bg-red-500 text-white px-3 rounded"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={addSpecialization}
//             className="text-blue-600"
//           >
//             + Add
//           </button>
//         </section>

//         {/* OVERVIEW */}
//         <section>
//           <h2 className="font-semibold text-lg mb-2">Overview</h2>
//           {overview.map((item, i) => (
//             <div
//               key={i}
//               className="grid md:grid-cols-2 gap-2 mb-4 border p-3 rounded-md"
//             >
//               <input
//                 type="text"
//                 placeholder="Heading  course ka name complete "
//                 value={item.heading}
//                 onChange={(e) =>
//                   handleDynamicChange(setOverview, i, "heading", e.target.value)
//                 }
//                 className="border p-2 rounded-md"
//               />
//               <input
//                 type="text"
//                 placeholder="Video Link"
//                 value={item.videoLink}
//                 onChange={(e) =>
//                   handleDynamicChange(
//                     setOverview,
//                     i,
//                     "videoLink",
//                     e.target.value
//                   )
//                 }
//                 className="border p-2 rounded-md"
//               />
//               <textarea
//                 placeholder="Description"
//                 value={item.description}
//                 onChange={(e) =>
//                   handleDynamicChange(
//                     setOverview,
//                     i,
//                     "description",
//                     e.target.value
//                   )
//                 }
//                 className="border p-2 rounded-md md:col-span-2"
//               />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) =>
//                   handleDynamicChange(
//                     setOverview,
//                     i,
//                     "image",
//                     e.target.files[0]
//                   )
//                 }
//                 className="border p-2 rounded-md md:col-span-2"
//               />
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() =>
//               addField(setOverview, {
//                 heading: "",
//                 description: "",
//                 image: null,
//                 videoLink: "",
//               })
//             }
//             className="text-blue-600"
//           >
//             + Add Overview
//           </button>
//         </section>

//         {/* WHY CHOOSE US */}
//         <section>
//           <h2 className="font-semibold text-lg mb-2">Why Choose Us</h2>
//           {whyChooseUs.map((item, i) => (
//             <div
//               key={i}
//               className="flex flex-col md:flex-row gap-2 mb-4 border p-3 rounded-md"
//             >
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) =>
//                   handleDynamicChange(
//                     setWhyChooseUs,
//                     i,
//                     "image",
//                     e.target.files[0]
//                   )
//                 }
//                 className="border p-2 rounded-md"
//               />
//               <textarea
//                 placeholder="Description"
//                 value={item.description}
//                 onChange={(e) =>
//                   handleDynamicChange(
//                     setWhyChooseUs,
//                     i,
//                     "description",
//                     e.target.value
//                   )
//                 }
//                 className="border p-2 rounded-md w-full"
//               />
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() =>
//               addField(setWhyChooseUs, { image: null, description: "" })
//             }
//             className="text-blue-600"
//           >
//             + Add
//           </button>
//         </section>

//         {/* GOOD THINGS */}
//         <section>
//           <h2 className="font-semibold text-lg mb-2">Good Things</h2>
//           {goodThings.map((g, i) => (
//             <div key={i} className="flex gap-2 mb-2">
//               <input
//                 type="text"
//                 placeholder="point about the course "
//                 value={g}
//                 onChange={(e) =>
//                   setGoodThings((prev) =>
//                     prev.map((val, idx) => (idx === i ? e.target.value : val))
//                   )
//                 }
//                 className="w-full border p-2 rounded-md"
//               />
//               {i > 0 && (
//                 <button
//                   type="button"
//                   onClick={() => removeField(setGoodThings, i)}
//                   className="bg-red-500 text-white px-3 rounded"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() => addField(setGoodThings, "")}
//             className="text-blue-600"
//           >
//             + Add
//           </button>
//         </section>

//         {/* TOP UNIVERSITIES */}
//         <section>
//           <h2 className="font-semibold text-lg mb-2">Top Universities</h2>
//           {topUniversities.map((item, i) => (
//             <div
//               key={i}
//               className="grid md:grid-cols-2 gap-2 mb-4 border p-3 rounded-md"
//             >
//               <input
//                 type="text"
//                 placeholder="Name"
//                 value={item.name}
//                 onChange={(e) =>
//                   handleDynamicChange(
//                     setTopUniversities,
//                     i,
//                     "name",
//                     e.target.value
//                   )
//                 }
//                 className="border p-2 rounded-md"
//               />
//               <textarea
//                 placeholder="Description or approvels"
//                 value={item.description}
//                 onChange={(e) =>
//                   handleDynamicChange(
//                     setTopUniversities,
//                     i,
//                     "description",
//                     e.target.value
//                   )
//                 }
//                 className="border p-2 rounded-md"
//               />
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() =>
//               addField(setTopUniversities, { name: "", description: "" })
//             }
//             className="text-blue-600"
//           >
//             + Add
//           </button>
//         </section>

//         {/* KEY HIGHLIGHTS */}
//         <section>
//           <h2 className="font-semibold text-lg mb-2">Key Highlights</h2>
//           {keyHighlights.map((item, i) => (
//             <div
//               key={i}
//               className="grid md:grid-cols-3 gap-2 mb-4 border p-3 rounded-md"
//             >
//               <input
//                 type="text"
//                 placeholder="Heading"
//                 value={item.heading}
//                 onChange={(e) =>
//                   handleDynamicChange(
//                     setKeyHighlights,
//                     i,
//                     "heading",
//                     e.target.value
//                   )
//                 }
//                 className="border p-2 rounded-md"
//               />
//               <input
//                 type="text"
//                 placeholder="Sub Heading"
//                 value={item.subHeading}
//                 onChange={(e) =>
//                   handleDynamicChange(
//                     setKeyHighlights,
//                     i,
//                     "subHeading",
//                     e.target.value
//                   )
//                 }
//                 className="border p-2 rounded-md"
//               />
//               <textarea
//                 placeholder="Description"
//                 value={item.description}
//                 onChange={(e) =>
//                   handleDynamicChange(
//                     setKeyHighlights,
//                     i,
//                     "description",
//                     e.target.value
//                   )
//                 }
//                 className="border p-2 rounded-md md:col-span-3"
//               />
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() =>
//               addField(setKeyHighlights, {
//                 heading: "",
//                 subHeading: "",
//                 description: "",
//               })
//             }
//             className="text-blue-600"
//           >
//             + Add
//           </button>
//         </section>

//         {/* SYLLABUS */}
//         <section>
//           <h2 className="font-semibold text-lg mb-2">Syllabus</h2>
//           {syllabus.map((sem, i) => (
//             <div key={i} className="border p-4 rounded-md mb-4">
//               <input
//                 type="text"
//                 placeholder="Semester"
//                 value={sem.semester}
//                 onChange={(e) =>
//                   handleDynamicChange(setSyllabus, i, "semester", e.target.value)
//                 }
//                 className="border p-2 rounded-md w-full mb-2"
//               />
//               {sem.subjects.map((sub, j) => (
//                 <input
//                   key={j}
//                   type="text"
//                   placeholder={`Subject ${j + 1}`}
//                   value={sub}
//                   onChange={(e) => handleSubjectChange(i, j, e.target.value)}
//                   className="border p-2 rounded-md w-full mb-1"
//                 />
//               ))}
//               <button
//                 type="button"
//                 onClick={() => addSubject(i)}
//                 className="text-blue-600"
//               >
//                 + Add Subject
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() =>
//               addField(setSyllabus, { semester: "", subjects: [""] })
//             }
//             className="text-blue-600"
//           >
//             + Add Semester
//           </button>
//         </section>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700"
//         >
//           {loading ? "Saving..." : "Create Course"}
//         </button>
//       </form>
//     </main>
//   );
// }



// "use client";

// import { useState, useEffect } from "react";
// import api from "@/utlis/api.js";

// export default function CoursesPage() {
//   const [formData, setFormData] = useState({
//     category: "",
//     name: "",
//     duration: "",
//     tag: "",
//   });

//   const [specializations, setSpecializations] = useState([""]);
//   const [courseLogo, setCourseLogo] = useState(null);

//   const [overview, setOverview] = useState([{ heading: "", description: "", image: null, videoLink: "" }]);
//   const [whyChooseUs, setWhyChooseUs] = useState([{ image: null, description: "" }]);
//   const [goodThings, setGoodThings] = useState([""]);
//   const [topUniversities, setTopUniversities] = useState([{ name: "", description: "" }]);
//   const [keyHighlights, setKeyHighlights] = useState([{ heading: "", subHeading: "", description: "" }]);
//   const [syllabus, setSyllabus] = useState([{ semester: "", subjects: [""] }]);

//   // New fields
//   const [offeredCourses, setOfferedCourses] = useState([{ heading: "", points: [""] }]);
//   const [onlineEligibility, setOnlineEligibility] = useState([{ heading: "", description: "", subHeading: "", subDescription: "" }]);
//   const [feeStructureSidebar, setFeeStructureSidebar] = useState([{ heading: "", points: [""] }]);
//   const [detailedFees, setDetailedFees] = useState([{ heading: "", description: "", table: [{ universityName: "", courseFees: "", detailedFeeStructure: "" }] }]);
//   const [onlineCourseWorthIt, setOnlineCourseWorthIt] = useState({ description: "", topics: [{ subHeading: "", description: "" }], image: null });
//   const [jobOpportunities, setJobOpportunities] = useState([{ heading: "", description: "", jobPost: "", salary: "" }]);
//   const [topRecruiters, setTopRecruiters] = useState([{ companyName: "", packageOffered: "" }]);

//   const [loading, setLoading] = useState(false);

//   // --- HANDLERS ---
//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
//   const handleFileChange = (e) => setCourseLogo(e.target.files[0]);

//   // 1. For Arrays of Strings (e.g., specializations, goodThings)
//   const handleStringArrayChange = (setter, index, value) => {
//     setter((prev) => prev.map((item, i) => (i === index ? value : item)));
//   };

//   // 2. For Arrays of Objects (e.g., overview[i].heading)
//   const handleDynamicChange = (setter, index, key, value) => {
//     setter((prev) => {
//       const updated = [...prev];
//       updated[index][key] = value;
//       return updated;
//     });
//   };

//   // 3. For Nested Arrays of Strings (e.g., syllabus[i].subjects[j])
//   const handleNestedArrayElementChange = (setter, outerIndex, innerKey, innerIndex, value) => {
//     setter((prev) => {
//       const updated = [...prev];
//       // Ensure the inner array exists before trying to update it
//       if (updated[outerIndex] && updated[outerIndex][innerKey]) {
//         updated[outerIndex][innerKey][innerIndex] = value;
//       }
//       return updated;
//     });
//   };

//   const addField = (setter, newObj) => setter((prev) => [...prev, newObj]);
//   const removeField = (setter, index) => setter((prev) => prev.filter((_, i) => i !== index));

//   // --- SUBMIT FUNCTION (CRITICAL FIXES HERE) ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const payload = new FormData();

//       const slugify = (text) =>
//         text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");

//       Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
//       payload.append("slug", slugify(formData.name));
//       if (courseLogo) payload.append("courseLogo", courseLogo);

//       // Arrays of Strings
//       specializations.filter(s => s.trim() !== "").forEach(spec => payload.append("specialization", spec));
//       goodThings.filter(g => g.trim() !== "").forEach(g => payload.append("goodThings", g));

//       // Existing Sections (No change required here, but keeping for context)
//       overview.forEach((item, i) => {
//         payload.append(`overview[${i}][heading]`, item.heading);
//         payload.append(`overview[${i}][description]`, item.description);
//         payload.append(`overview[${i}][videoLink]`, item.videoLink);
//         if (item.image) payload.append("overviewImages", item.image);
//       });

//       whyChooseUs.forEach((item, i) => {
//         payload.append(`whyChooseUs[${i}][description]`, item.description);
//         if (item.image) payload.append("whyChooseUsImages", item.image);
//       });
      
//       topUniversities.filter(item => item.name).forEach((item, i) => {
//         payload.append(`topUniversities[${i}][name]`, item.name);
//         payload.append(`topUniversities[${i}][description]`, item.description);
//       });

//       keyHighlights.filter(item => item.heading).forEach((item, i) => {
//         payload.append(`keyHighlights[${i}][heading]`, item.heading);
//         payload.append(`keyHighlights[${i}][subHeading]`, item.subHeading);
//         payload.append(`keyHighlights[${i}][description]`, item.description);
//       });

//       // Syllabus (Nested Array)
//       syllabus.filter(sem => sem.semester).forEach((sem, i) => {
//         payload.append(`syllabus[${i}][semester]`, sem.semester);
//         sem.subjects.filter(s => s.trim() !== "").forEach(sub => payload.append(`syllabus[${i}][subjects]`, sub));
//       });

//       // Offered Courses (Nested Array)
//       offeredCourses.forEach((item, i) => {
//         payload.append(`offeredCourses[${i}][heading]`, item.heading);
//         item.points.forEach(p => payload.append(`offeredCourses[${i}][points]`, p));
//       });

//       onlineEligibility.forEach((item, i) => {
//         payload.append(`onlineEligibility[${i}][heading]`, item.heading);
//         payload.append(`onlineEligibility[${i}][description]`, item.description);
//         payload.append(`onlineEligibility[${i}][subHeading]`, item.subHeading);
//         payload.append(`onlineEligibility[${i}][subDescription]`, item.subDescription);
//       });

//       // Fee Structure Sidebar (Nested Array)
//       feeStructureSidebar.forEach((item, i) => {
//         payload.append(`feeStructureSidebar[${i}][heading]`, item.heading);
//         item.points.forEach(p => payload.append(`feeStructureSidebar[${i}][points]`, p));
//       });

//       // Detailed Fees (NESTED ARRAY FIX APPLIED HERE)
//       detailedFees.forEach((item, i) => {
//         payload.append(`detailedFees[${i}][heading]`, item.heading);
//         payload.append(`detailedFees[${i}][description]`, item.description);
//         item.table.forEach((t, j) => { // <-- FIX: Added 'j' index
//           payload.append(`detailedFees[${i}][table][${j}][universityName]`, t.universityName);
//           payload.append(`detailedFees[${i}][table][${j}][courseFees]`, t.courseFees);
//           payload.append(`detailedFees[${i}][table][${j}][detailedFeeStructure]`, t.detailedFeeStructure);
//         });
//       });

//       // Online Course Worth It
//       payload.append(`onlineCourseWorthIt[description]`, onlineCourseWorthIt.description);
//       if (onlineCourseWorthIt.image) payload.append("onlineCourseWorthItImage", onlineCourseWorthIt.image);
//       onlineCourseWorthIt.topics.forEach((t, i) => {
//         payload.append(`onlineCourseWorthIt[topics][${i}][subHeading]`, t.subHeading);
//         payload.append(`onlineCourseWorthIt[topics][${i}][description]`, t.description);
//       });

//       jobOpportunities.forEach((item, i) => {
//         payload.append(`jobOpportunities[${i}][heading]`, item.heading);
//         payload.append(`jobOpportunities[${i}][description]`, item.description);
//         payload.append(`jobOpportunities[${i}][jobPost]`, item.jobPost);
//         payload.append(`jobOpportunities[${i}][salary]`, item.salary);
//       });

//       topRecruiters.forEach((item, i) => {
//         payload.append(`topRecruiters[${i}][companyName]`, item.companyName);
//         payload.append(`topRecruiters[${i}][packageOffered]`, item.packageOffered);
//       });

//       await api.post("/api/v1/course", payload, { headers: { "Content-Type": "multipart/form-data" } });
//       alert("✅ Course Created Successfully!");
//       // Optionally reset form state here
//     } catch (err) {
//       console.error(err);
//       alert("❌ Error creating course");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- REFACTORED RENDER COMPONENT (for Array of Objects with nested string arrays) ---
//   const renderArrayInput = (arr, setter, fields, addBtnLabel, defaultData) => (
//     <section>
//       <h2 className="font-semibold text-lg mb-2">{addBtnLabel}</h2>
//       {arr.map((item, i) => (
//         <div key={i} className="border p-3 mb-3 rounded-md bg-gray-50">
//           {fields.map(f => (
//             <div key={f.key} className="mb-2">
//               <label className="block text-sm font-medium text-gray-700">{f.placeholder}</label>
//               {f.type === "text" && (
//                 <input
//                   type="text"
//                   placeholder={f.placeholder}
//                   value={item[f.key]}
//                   onChange={e => handleDynamicChange(setter, i, f.key, e.target.value)}
//                   className="border p-2 rounded-md w-full"
//                 />
//               )}
//               {f.type === "textarea" && (
//                 <textarea
//                   placeholder={f.placeholder}
//                   value={item[f.key]}
//                   onChange={e => handleDynamicChange(setter, i, f.key, e.target.value)}
//                   className="border p-2 rounded-md w-full"
//                 />
//               )}
//               {f.type === "file" && (
//                 <input type="file" accept="image/*" onChange={e => handleDynamicChange(setter, i, f.key, e.target.files[0])} className="border p-2 rounded-md w-full" />
//               )}
//               {/* Handling Nested Arrays of Strings (subjects, points) */}
//               {f.type === "array" && (
//                 <div className="pl-4 border-l-2 border-blue-200">
//                   {item[f.key].map((val, idx) => (
//                     <div key={idx} className="flex gap-2 mb-1">
//                       <input
//                         type="text"
//                         placeholder={`${f.placeholder} ${idx + 1}`}
//                         value={val}
//                         // Use the corrected handler for nested string array elements
//                         onChange={e => handleNestedArrayElementChange(setter, i, f.key, idx, e.target.value)} 
//                         className="border p-2 rounded-md w-full text-sm"
//                       />
//                       <button type="button" className="bg-red-500 text-white px-3 text-sm rounded" onClick={() => {
//                         const newArr = item[f.key].filter((_, subIdx) => subIdx !== idx);
//                         handleDynamicChange(setter, i, f.key, newArr);
//                       }}>
//                         ✕
//                       </button>
//                     </div>
//                   ))}
//                   <button type="button" onClick={() => {
//                     const newArr = [...item[f.key], f.defaultValue || ""]; // Add new empty element
//                     handleDynamicChange(setter, i, f.key, newArr);
//                   }} className="text-blue-600 text-sm mt-1">
//                     + Add {f.placeholder}
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//           <button type="button" onClick={() => removeField(setter, i)} className="bg-red-500 text-white p-2 rounded text-sm mt-2">
//             Remove {addBtnLabel.slice(0, -1)}
//           </button>
//         </div>
//       ))}
//       <button type="button" onClick={() => addField(setter, defaultData)} className="text-blue-600 font-medium mb-4">
//         + Add New {addBtnLabel.slice(0, -1)}
//       </button>
//     </section>
//   );

//   return (
//     <main className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-2xl font-semibold text-gray-800 mb-6">🎓 Course Management</h1>
//       <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white shadow p-6 rounded-xl space-y-8">
        
//         {/* Basic Fields */}
//         <h2 className="font-semibold text-xl border-b pb-2">Basic Course Details</h2>
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* ... (Basic Fields remain the same) ... */}
//           <div>
//             <label>Category</label>
//             <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded-md">
//               <option value="">Select</option>
//               <option value="UG">UG</option>
//               <option value="PG">PG</option>
//               <option value="Doctorate">Doctorate</option>
//               <option value="JobGuarantee">Job Guarantee</option>
//             </select>
//           </div>
//           <div>
//             <label>Name</label>
//             <input type="text" name="name" placeholder="Course Name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded-md" required />
//           </div>
//           <div>
//             <label>Duration</label>
//             <input type="text" name="duration" placeholder="Course Duration" value={formData.duration} onChange={handleChange} className="w-full border p-2 rounded-md" required />
//           </div>
//           <div>
//             <label>Tag</label>
//             <input type="text" name="tag" placeholder="Optional Tag" value={formData.tag} onChange={handleChange} className="w-full border p-2 rounded-md" />
//           </div>
//           <div>
//             <label>Course Logo</label>
//             <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border p-2 rounded-md" />
//           </div>
//         </div>
        
//         <hr/>

//         {/* Specializations (Simple Array of Strings - Rendered Manually) */}
//         <section>
//           <h2 className="font-semibold text-lg mb-2">Specializations</h2>
//           {specializations.map((spec, i) => (
//             <div key={i} className="flex gap-2 mb-2">
//               <input type="text" placeholder="Specialization Name" value={spec} onChange={e => handleStringArrayChange(setSpecializations, i, e.target.value)} className="w-full border p-2 rounded-md" />
//               {i > 0 && <button type="button" onClick={() => removeField(setSpecializations, i)} className="bg-red-500 text-white px-3 rounded">✕</button>}
//             </div>
//           ))}
//           <button type="button" onClick={() => setSpecializations([...specializations, ""])} className="text-blue-600">+ Add Specialization</button>
//         </section>

//         <hr/>

//         {/* Good Things (Simple Array of Strings - Rendered Manually) */}
//         <section>
//           <h2 className="font-semibold text-lg mb-2">Good Things/Features</h2>
//           {goodThings.map((thing, i) => (
//             <div key={i} className="flex gap-2 mb-2">
//               <input type="text" placeholder="Good Thing/Feature" value={thing} onChange={e => handleStringArrayChange(setGoodThings, i, e.target.value)} className="w-full border p-2 rounded-md" />
//               {i > 0 && <button type="button" onClick={() => removeField(setGoodThings, i)} className="bg-red-500 text-white px-3 rounded">✕</button>}
//             </div>
//           ))}
//           <button type="button" onClick={() => setGoodThings([...goodThings, ""])} className="text-blue-600">+ Add Good Thing</button>
//         </section>

//         <hr/>

//         {/* Dynamic Sections using renderArrayInput */}
        
//         {renderArrayInput(overview, setOverview, [
//           { key: "heading", type: "text", placeholder: "Heading" },
//           { key: "description", type: "textarea", placeholder: "Description" },
//           { key: "videoLink", type: "text", placeholder: "Video Link" },
//           { key: "image", type: "file", placeholder: "Image" },
//         ], "Overview Sections", { heading: "", description: "", image: null, videoLink: "" })}

//         <hr/>
        
//         {renderArrayInput(whyChooseUs, setWhyChooseUs, [
//           { key: "description", type: "textarea", placeholder: "Description" },
//           { key: "image", type: "file", placeholder: "Image" },
//         ], "Why Choose Us Points", { image: null, description: "" })}
        
//         <hr/>

//         {renderArrayInput(topUniversities, setTopUniversities, [
//           { key: "name", type: "text", placeholder: "University Name" },
//           { key: "description", type: "textarea", placeholder: "Description" },
//         ], "Top Universities", { name: "", description: "" })}
        
//         <hr/>

//         {renderArrayInput(keyHighlights, setKeyHighlights, [
//           { key: "heading", type: "text", placeholder: "Heading" },
//           { key: "subHeading", type: "text", placeholder: "Sub Heading" },
//           { key: "description", type: "textarea", placeholder: "Description" },
//         ], "Key Highlights", { heading: "", subHeading: "", description: "" })}
        
//         <hr/>

//         {/* Syllabus - Uses Nested Array Handler */}
//         {renderArrayInput(syllabus, setSyllabus, [
//           { key: "semester", type: "text", placeholder: "Semester/Year Name" },
//           { key: "subjects", type: "array", placeholder: "Subject", defaultValue: "" },
//         ], "Syllabus Sections", { semester: "", subjects: [""] })}
        
//         <hr/>

//         {/* Offered Courses - Uses Nested Array Handler */}
//         {renderArrayInput(offeredCourses, setOfferedCourses, [
//           { key: "heading", type: "text", placeholder: "Course Type Heading" },
//           { key: "points", type: "array", placeholder: "Course Name/Point", defaultValue: "" },
//         ], "Offered Courses", { heading: "", points: [""] })}
        
//         <hr/>

//         {/* Online Eligibility */}
//         {renderArrayInput(onlineEligibility, setOnlineEligibility, [
//           { key: "heading", type: "text", placeholder: "Main Heading" },
//           { key: "description", type: "textarea", placeholder: "Description" },
//           { key: "subHeading", type: "text", placeholder: "Sub Heading" },
//           { key: "subDescription", type: "textarea", placeholder: "Sub Description" },
//         ], "Online Eligibility Sections", { heading: "", description: "", subHeading: "", subDescription: "" })}
        
//         <hr/>

//         {/* Fee Structure Sidebar - Uses Nested Array Handler */}
//         {renderArrayInput(feeStructureSidebar, setFeeStructureSidebar, [
//           { key: "heading", type: "text", placeholder: "Sidebar Heading" },
//           { key: "points", type: "array", placeholder: "Point", defaultValue: "" },
//         ], "Fee Structure Sidebar Points", { heading: "", points: [""] })}
        
//         <hr/>

//         {/* DETAILED FEES - RENDERED MANUALLY DUE TO TRIPLE NESTING (Array -> Object -> Array of Objects) */}
//         <section>
//           <h2 className="font-semibold text-lg mb-2">Detailed Fees (Table)</h2>
//           {detailedFees.map((item, i) => (
//             <div key={i} className="border p-3 mb-3 rounded-md bg-gray-50">
//               <input type="text" placeholder="Heading" value={item.heading} onChange={e => handleDynamicChange(setDetailedFees, i, "heading", e.target.value)} className="border p-2 rounded-md w-full mb-2" />
//               <textarea placeholder="Description" value={item.description} onChange={e => handleDynamicChange(setDetailedFees, i, "description", e.target.value)} className="border p-2 rounded-md w-full mb-2" />
              
//               <h4 className="font-medium text-gray-700 mt-3">Fee Table Entries:</h4>
//               <div className="pl-4 border-l-2 border-green-200">
//                 {item.table.map((row, j) => (
//                   <div key={j} className="border p-2 mb-2 bg-white rounded-md">
//                     <input type="text" placeholder="University Name" value={row.universityName} 
//                            onChange={e => handleNestedArrayElementChange(setDetailedFees, i, "table", j, { ...row, universityName: e.target.value })} 
//                            className="border p-1 rounded-md w-full mb-1 text-sm" />
//                     <input type="text" placeholder="Course Fees" value={row.courseFees} 
//                            onChange={e => handleNestedArrayElementChange(setDetailedFees, i, "table", j, { ...row, courseFees: e.target.value })} 
//                            className="border p-1 rounded-md w-full mb-1 text-sm" />
//                     <input type="text" placeholder="Detailed Fee Structure Link" value={row.detailedFeeStructure} 
//                            onChange={e => handleNestedArrayElementChange(setDetailedFees, i, "table", j, { ...row, detailedFeeStructure: e.target.value })} 
//                            className="border p-1 rounded-md w-full mb-1 text-sm" />
//                     <button type="button" onClick={() => handleDynamicChange(setDetailedFees, i, "table", item.table.filter((_, idx) => idx !== j))} className="bg-red-400 text-white px-2 py-1 text-xs rounded">Remove Row</button>
//                   </div>
//                 ))}
//                 <button type="button" onClick={() => handleDynamicChange(setDetailedFees, i, "table", [...item.table, { universityName: "", courseFees: "", detailedFeeStructure: "" }])} className="text-green-600 text-sm mt-1">
//                   + Add Table Row
//                 </button>
//               </div>
//               <button type="button" onClick={() => removeField(setDetailedFees, i)} className="bg-red-500 text-white p-2 rounded text-sm mt-2">
//                 Remove Detailed Fee Section
//               </button>
//             </div>
//           ))}
//           <button type="button" onClick={() => addField(setDetailedFees, { heading: "", description: "", table: [{ universityName: "", courseFees: "", detailedFeeStructure: "" }] })} className="text-blue-600 font-medium mb-4">
//             + Add New Detailed Fee Section
//           </button>
//         </section>

//         <hr/>
        
//         {/* Online Course Worth It - Rendered Manually (Nested Object) */}
//         <div className="border p-3 mb-3 rounded-md bg-gray-50">
//           <h3 className="font-semibold mb-2">Online Course Worth It?</h3>
//           <textarea placeholder="Description" value={onlineCourseWorthIt.description} onChange={e => setOnlineCourseWorthIt({ ...onlineCourseWorthIt, description: e.target.value })} className="border p-2 rounded-md w-full mb-2" />
//           <input type="file" accept="image/*" onChange={e => setOnlineCourseWorthIt({ ...onlineCourseWorthIt, image: e.target.files[0] })} className="border p-2 rounded-md w-full mb-2" />
          
//           <h4 className="font-medium text-gray-700 mt-3">Topics:</h4>
//           {onlineCourseWorthIt.topics.map((t, i) => (
//             <div key={i} className="border p-2 mb-2 bg-white rounded-md">
//               <input type="text" placeholder="Sub Heading" value={t.subHeading} onChange={e => {
//                 const topics = [...onlineCourseWorthIt.topics];
//                 topics[i].subHeading = e.target.value;
//                 setOnlineCourseWorthIt({ ...onlineCourseWorthIt, topics });
//               }} className="border p-1 rounded-md w-full mb-1 text-sm" />
//               <textarea placeholder="Description" value={t.description} onChange={e => {
//                 const topics = [...onlineCourseWorthIt.topics];
//                 topics[i].description = e.target.value;
//                 setOnlineCourseWorthIt({ ...onlineCourseWorthIt, topics });
//               }} className="border p-1 rounded-md w-full mb-1 text-sm" />
//               <button type="button" onClick={() => {
//                 const topics = onlineCourseWorthIt.topics.filter((_, idx) => idx !== i);
//                 setOnlineCourseWorthIt({ ...onlineCourseWorthIt, topics });
//               }} className="bg-red-400 text-white px-2 py-1 text-xs rounded">Remove Topic</button>
//             </div>
//           ))}
//           <button type="button" onClick={() => setOnlineCourseWorthIt({ ...onlineCourseWorthIt, topics: [...onlineCourseWorthIt.topics, { subHeading: "", description: "" }] })} className="text-blue-600 mt-1">+ Add Topic</button>
//         </div>

//         <hr/>
        
//         {/* Job Opportunities */}
//         {renderArrayInput(jobOpportunities, setJobOpportunities, [
//           { key: "heading", type: "text", placeholder: "Heading" },
//           { key: "description", type: "textarea", placeholder: "Description" },
//           { key: "jobPost", type: "text", placeholder: "Job Post" },
//           { key: "salary", type: "text", placeholder: "Salary" },
//         ], "Job Opportunities", { heading: "", description: "", jobPost: "", salary: "" })}
        
//         <hr/>

//         {/* Top Recruiters */}
//         {renderArrayInput(topRecruiters, setTopRecruiters, [
//           { key: "companyName", type: "text", placeholder: "Company Name" },
//           { key: "packageOffered", type: "text", placeholder: "Package Offered" },
//         ], "Top Recruiters", { companyName: "", packageOffered: "" })}


//         <button type="submit" disabled={loading} className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700">
//           {loading ? "Saving..." : "Create Course"}
//         </button>
//       </form>
//     </main>
//   );
// }





"use client";

import { useState, useEffect } from "react";
import api from "@/utlis/api.js"; // ✅ your axios instance
import UniversitiesFetchComponent from "@/app/admin/getonlinecourese/UniversitiesFetchComponent";

export default function CoursesPage() {
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    duration: "",
    tag: "",
  });
  const [specializations, setSpecializations] = useState([""]);
  const [courseLogo, setCourseLogo] = useState(null);

  const [overview, setOverview] = useState([
    { heading: "", description: "", image: null, videoLink: "" },
  ]);
  const [whyChooseUs, setWhyChooseUs] = useState([
    { image: null, description: "" },
  ]);
  const [goodThings, setGoodThings] = useState([""]);
  const [topUniversities, setTopUniversities] = useState([
    { name: "", description: "" },
  ]);
  const [keyHighlights, setKeyHighlights] = useState([
    { heading: "", subHeading: "", description: "" },
  ]);
  const [syllabus, setSyllabus] = useState([{ semester: "", subjects: [""] }]);

  // ⭐ NEW STATE VARIABLES ADDED HERE
  const [offeredCourses, setOfferedCourses] = useState([
    { heading: "", points: [""] },
  ]);
  const [onlineEligibility, setOnlineEligibility] = useState([
    { heading: "", description: "", subHeading: "", subDescription: "" },
  ]);
  const [feeStructureSidebar, setFeeStructureSidebar] = useState([
    { heading: "", points: [""] },
  ]);
  const [detailedFees, setDetailedFees] = useState([
    {
      heading: "",
      description: "",
      table: [{ universityName: "", courseFees: "", detailedFeeStructure: "" }],
    },
  ]);
  const [onlineCourseWorthIt, setOnlineCourseWorthIt] = useState({
    description: "",
    topics: [{ subHeading: "", description: "" }],
    image: null,
  });
  const [jobOpportunities, setJobOpportunities] = useState([
    { heading: "", description: "", jobPost: "", salary: "" },
  ]);
  const [topRecruiters, setTopRecruiters] = useState([
    { companyName: "", packageOffered: "" },
  ]);
  // ⭐ END OF NEW STATE VARIABLES

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing courses
  const fetchCourses = async () => {
    try {
      const res = await api.get("/api/v1/course");
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ Input Handlers

  // Basic form field change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Course Logo file change
  const handleFileChange = (e) => setCourseLogo(e.target.files[0]);

  // Handle file change for onlineCourseWorthIt section
  const handleOnlineCourseWorthItImageChange = (e) => {
    setOnlineCourseWorthIt((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  // Generic handler for dynamic arrays of objects (e.g., overview)
  const handleDynamicChange = (setter, index, key, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  // Generic handler for nested dynamic fields (e.g., offeredCourses points)
  const handleNestedDynamicChange = (setter, outerIndex, innerKey, innerIndex, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[outerIndex][innerKey][innerIndex] = value;
      return updated;
    });
  };

  // Generic handler for single object state (onlineCourseWorthIt)
  const handleSingleObjectChange = (key, value) => {
    setOnlineCourseWorthIt((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  // Generic handler for dynamic array fields (e.g., specialization, goodThings)
  const handleArrayChange = (setter, index, value) => {
    setter((prev) => prev.map((val, i) => (i === index ? value : val)));
  };

  // Generic add/remove array item functions
  const addField = (setter, newObj) => setter((prev) => [...prev, newObj]);
  const removeField = (setter, index) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  // Handler for adding/removing items in arrays *nested inside* an array of objects
  const addNestedArrayItem = (setter, index, key, defaultValue = "") => {
    setter((prev) => {
      const updated = [...prev];
      updated[index][key].push(defaultValue);
      return updated;
    });
  };

  const removeNestedArrayItem = (setter, index, key, innerIndex) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index][key] = updated[index][key].filter((_, i) => i !== innerIndex);
      // Ensure there's at least one item if removing the last one
      if (updated[index][key].length === 0) {
        updated[index][key].push("");
      }
      return updated;
    });
  };
  
  // Handler for nested table data (detailedFees.table)
  const handleDetailedFeesTableChange = (outerIndex, tableIndex, key, value) => {
    setDetailedFees((prev) => {
      const updated = [...prev];
      updated[outerIndex].table[tableIndex][key] = value;
      return updated;
    });
  };

  const addDetailedFeesTableItem = (index) => {
    setDetailedFees((prev) => {
      const updated = [...prev];
      updated[index].table.push({ universityName: "", courseFees: "", detailedFeeStructure: "" });
      return updated;
    });
  };

  const removeDetailedFeesTableItem = (outerIndex, tableIndex) => {
    setDetailedFees((prev) => {
      const updated = [...prev];
      updated[outerIndex].table = updated[outerIndex].table.filter((_, i) => i !== tableIndex);
      return updated;
    });
  };

  // Handler for onlineCourseWorthIt topics
  const handleOnlineCourseWorthItTopicChange = (i, key, value) => {
    setOnlineCourseWorthIt((prev) => {
      const updatedTopics = [...prev.topics];
      updatedTopics[i][key] = value;
      return { ...prev, topics: updatedTopics };
    });
  };

  const addOnlineCourseWorthItTopic = () => {
    setOnlineCourseWorthIt((prev) => ({
      ...prev,
      topics: [...prev.topics, { subHeading: "", description: "" }],
    }));
  };

  const removeOnlineCourseWorthItTopic = (i) => {
    setOnlineCourseWorthIt((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, idx) => idx !== i),
    }));
  };


  // Custom handlers for existing fields now using generic helper functions
  const handleSpecializationChange = (i, val) => handleArrayChange(setSpecializations, i, val);
  const addSpecialization = () => setSpecializations([...specializations, ""]);
  const removeSpecialization = (i) => removeField(setSpecializations, i);

  const handleGoodThingChange = (i, val) => handleArrayChange(setGoodThings, i, val);
  const addGoodThing = () => addField(setGoodThings, "");
  const removeGoodThing = (i) => removeField(setGoodThings, i);


  // Syllabus subjects handlers
  const handleSubjectChange = (semIndex, subIndex, value) =>
    handleNestedDynamicChange(setSyllabus, semIndex, "subjects", subIndex, value);
  const addSubject = (semIndex) => addNestedArrayItem(setSyllabus, semIndex, "subjects");
  const removeSubject = (semIndex, subIndex) => removeNestedArrayItem(setSyllabus, semIndex, "subjects", subIndex);
  // End of existing handlers

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = new FormData();

      // Helper function for slug
      const slugify = (text) =>
        text
          .toString()
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-");

      // Basic fields
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
      payload.append("slug", slugify(formData.name));

      if (courseLogo) payload.append("courseLogo", courseLogo);

      // Specializations (Existing)
      specializations
        .filter((s) => s.trim() !== "")
        .forEach((spec) => payload.append("specialization", spec));

      // Overview (Existing - handles files via 'overviewImages')
      overview.forEach((item, i) => {
        payload.append(`overview[${i}][heading]`, item.heading);
        payload.append(`overview[${i}][description]`, item.description);
        payload.append(`overview[${i}][videoLink]`, item.videoLink);
        if (item.image) {
          payload.append("overviewImages", item.image);
        }
      });

      // Why Choose Us (Existing - handles files via 'whyChooseUsImages')
      whyChooseUs.forEach((item, i) => {
        payload.append(`whyChooseUs[${i}][description]`, item.description);
        if (item.image) {
          payload.append("whyChooseUsImages", item.image);
        }
      });

      // Good Things (Existing)
      goodThings
        .filter((g) => g.trim() !== "")
        .forEach((g) => payload.append("goodThings", g));

      // Top Universities (Existing)
      topUniversities
        .filter((item) => item.name)
        .forEach((item, i) => {
          payload.append(`topUniversities[${i}][name]`, item.name);
          payload.append(`topUniversities[${i}][description]`, item.description);
        });

      // Key Highlights (Existing)
      keyHighlights
        .filter((item) => item.heading)
        .forEach((item, i) => {
          payload.append(`keyHighlights[${i}][heading]`, item.heading);
          payload.append(`keyHighlights[${i}][subHeading]`, item.subHeading);
          payload.append(`keyHighlights[${i}][description]`, item.description);
        });

      // Syllabus (Existing)
      syllabus
        .filter((sem) => sem.semester)
        .forEach((sem, i) => {
          payload.append(`syllabus[${i}][semester]`, sem.semester);
          sem.subjects
            .filter((s) => s.trim() !== "")
            .forEach((sub) =>
              payload.append(`syllabus[${i}][subjects]`, sub)
            );
        });

      // ⭐ NEW FIELD PAYLOAD APPENDING

      // Offered Courses
      offeredCourses
        .filter((item) => item.heading)
        .forEach((item, i) => {
          payload.append(`offeredCourses[${i}][heading]`, item.heading);
          item.points.forEach((p) => {
            if (p.trim() !== "") {
              payload.append(`offeredCourses[${i}][points]`, p);
            }
          });
        });

      // Online Eligibility
      onlineEligibility
        .filter((item) => item.heading)
        .forEach((item, i) => {
          payload.append(`onlineEligibility[${i}][heading]`, item.heading);
          payload.append(`onlineEligibility[${i}][description]`, item.description);
          payload.append(`onlineEligibility[${i}][subHeading]`, item.subHeading);
          payload.append(`onlineEligibility[${i}][subDescription]`, item.subDescription);
        });

      // Fees Structure Sidebar
      feeStructureSidebar
        .filter((item) => item.heading)
        .forEach((item, i) => {
          payload.append(`feeStructureSidebar[${i}][heading]`, item.heading);
          item.points.forEach((p) => {
            if (p.trim() !== "") {
              payload.append(`feeStructureSidebar[${i}][points]`, p);
            }
          });
        });

      // Detailed Fees
      detailedFees
        .filter((item) => item.heading)
        .forEach((item, i) => {
          payload.append(`detailedFees[${i}][heading]`, item.heading);
          payload.append(`detailedFees[${i}][description]`, item.description);
          item.table.forEach((row, j) => {
            if (row.universityName && row.courseFees) {
              payload.append(`detailedFees[${i}][table][${j}][universityName]`, row.universityName);
              payload.append(`detailedFees[${i}][table][${j}][courseFees]`, row.courseFees);
              payload.append(`detailedFees[${i}][table][${j}][detailedFeeStructure]`, row.detailedFeeStructure);
            }
          });
        });


      // Online Course Worth It (handles files via 'onlineCourseWorthItImage')
      if (onlineCourseWorthIt.description) {
        payload.append("onlineCourseWorthIt[description]", onlineCourseWorthIt.description);
      }
      onlineCourseWorthIt.topics.forEach((topic, i) => {
        if (topic.subHeading) {
          payload.append(`onlineCourseWorthIt[topics][${i}][subHeading]`, topic.subHeading);
          payload.append(`onlineCourseWorthIt[topics][${i}][description]`, topic.description);
        }
      });
      if (onlineCourseWorthIt.image) {
        payload.append("onlineCourseWorthItImage", onlineCourseWorthIt.image);
      }
      
      // Job Opportunities
      jobOpportunities
        .filter((item) => item.heading)
        .forEach((item, i) => {
          payload.append(`jobOpportunities[${i}][heading]`, item.heading);
          payload.append(`jobOpportunities[${i}][description]`, item.description);
          payload.append(`jobOpportunities[${i}][jobPost]`, item.jobPost);
          payload.append(`jobOpportunities[${i}][salary]`, item.salary);
        });

      // Top Recruiters
      topRecruiters
        .filter((item) => item.companyName)
        .forEach((item, i) => {
          payload.append(`topRecruiters[${i}][companyName]`, item.companyName);
          payload.append(`topRecruiters[${i}][packageOffered]`, item.packageOffered);
        });
      
      // ⭐ END OF NEW FIELD PAYLOAD

      // ✅ Send to backend
      await api.post("/api/v1/course", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Course Created Successfully!");
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert("❌ Error creating course");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UI STARTS HERE
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        🎓 Course Management
      </h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white shadow p-6 rounded-xl space-y-8"
      >
        {/* BASIC DETAILS (Existing) */}
        <section className="grid md:grid-cols-2 gap-6">
          <div>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select</option>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
              <option value="Doctorate">Doctorate</option>
              <option value="JobGuarantee">Job Guarantee</option>
            </select>
          </div>

          <div>
            <label>Name</label>
            <input
              type="text"
              placeholder=" add Course name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>

          <div>
            <label>Duration</label>
            <input
              type="text"
              placeholder="Course ki durection"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>

          <div>

            <label>Tag</label>
            <input
              type="text"
              placeholder="like card ke uper side optional "
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          <div>
            <label>Course Logo</label>
            <input
              type="file"
              placeholder="course ka logo  show card"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
        </section>
        
        {/* --- */}

        {/* SPECIALIZATIONS (Existing) */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Specializations</h2>
          {specializations.map((spec, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder=" Please add the relevant branches assigned to each specific course "
                value={spec}
                onChange={(e) =>
                  handleSpecializationChange(i, e.target.value)
                }
                className="w-full border p-2 rounded-md"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeSpecialization(i)}
                  className="bg-red-500 text-white px-3 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecialization}
            className="text-blue-600"
          >
            + Add
          </button>
        </section>

        {/* --- */}

        {/* OVERVIEW (Existing) */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Overview</h2>
          {overview.map((item, i) => (
            <div
              key={i}
              className="grid md:grid-cols-2 gap-2 mb-4 border p-3 rounded-md"
            >
              <input
                type="text"
                placeholder="Heading  course ka name complete "
                value={item.heading}
                onChange={(e) =>
                  handleDynamicChange(setOverview, i, "heading", e.target.value)
                }
                className="border p-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Video Link"
                value={item.videoLink}
                onChange={(e) =>
                  handleDynamicChange(
                    setOverview,
                    i,
                    "videoLink",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md"
              />
              <textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleDynamicChange(
                    setOverview,
                    i,
                    "description",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md md:col-span-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleDynamicChange(
                    setOverview,
                    i,
                    "image",
                    e.target.files[0]
                  )
                }
                className="border p-2 rounded-md md:col-span-2"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(setOverview, {
                heading: "",
                description: "",
                image: null,
                videoLink: "",
              })
            }
            className="text-blue-600"
          >
            + Add Overview
          </button>
        </section>
        
        {/* --- */}

        {/* WHY CHOOSE US (Existing) */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Why Choose Us</h2>
          {whyChooseUs.map((item, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row gap-2 mb-4 border p-3 rounded-md"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleDynamicChange(
                    setWhyChooseUs,
                    i,
                    "image",
                    e.target.files[0]
                  )
                }
                className="border p-2 rounded-md"
              />
              <textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleDynamicChange(
                    setWhyChooseUs,
                    i,
                    "description",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md w-full"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(setWhyChooseUs, { image: null, description: "" })
            }
            className="text-blue-600"
          >
            + Add
          </button>
        </section>

        {/* --- */}

        {/* GOOD THINGS (Existing) */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Program And Highlight </h2>
          {goodThings.map((g, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="point about the course "
                value={g}
                onChange={(e) => handleGoodThingChange(i, e.target.value)}
                className="w-full border p-2 rounded-md"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeGoodThing(i)}
                  className="bg-red-500 text-white px-3 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addGoodThing}
            className="text-blue-600"
          >
            + Add
          </button>
        </section>

        {/* --- */}

        {/* TOP UNIVERSITIES (Existing) */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Top Universities</h2>
          {topUniversities.map((item, i) => (
            <div
              key={i}
              className="grid md:grid-cols-2 gap-2 mb-4 border p-3 rounded-md"
            >
              <input
                type="text"
                placeholder="Name"
                value={item.name}
                onChange={(e) =>
                  handleDynamicChange(
                    setTopUniversities,
                    i,
                    "name",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md"
              />
              <textarea
                placeholder="Description or approvels"
                value={item.description}
                onChange={(e) =>
                  handleDynamicChange(
                    setTopUniversities,
                    i,
                    "description",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(setTopUniversities, { name: "", description: "" })
            }
            className="text-blue-600"
          >
            + Add
          </button>
           <UniversitiesFetchComponent />
        </section>

        {/* --- */}

        {/* KEY HIGHLIGHTS (Existing) */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Key Highlights</h2>
          {keyHighlights.map((item, i) => (
            <div
              key={i}
              className="grid md:grid-cols-3 gap-2 mb-4 border p-3 rounded-md"
            >
              <input
                type="text"
                placeholder="Heading"
                value={item.heading}
                onChange={(e) =>
                  handleDynamicChange(
                    setKeyHighlights,
                    i,
                    "heading",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Sub Heading"
                value={item.subHeading}
                onChange={(e) =>
                  handleDynamicChange(
                    setKeyHighlights,
                    i,
                    "subHeading",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md"
              />
              <textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleDynamicChange(
                    setKeyHighlights,
                    i,
                    "description",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md md:col-span-3"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(setKeyHighlights, {
                heading: "",
                subHeading: "",
                description: "",
              })
            }
            className="text-blue-600"
          >
            + Add
          </button>
        </section>

        {/* --- */}

        {/* SYLLABUS (Existing) */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Syllabus</h2>
          {syllabus.map((sem, i) => (
            <div key={i} className="border p-4 rounded-md mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Semester"
                  value={sem.semester}
                  onChange={(e) =>
                    handleDynamicChange(setSyllabus, i, "semester", e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                />
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => removeField(setSyllabus, i)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <h4 className="font-medium text-sm my-2">Subjects:</h4>
              {sem.subjects.map((sub, j) => (
                <div key={j} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    placeholder={`Subject ${j + 1}`}
                    value={sub}
                    onChange={(e) => handleSubjectChange(i, j, e.target.value)}
                    className="border p-2 rounded-md w-full"
                  />
                  {j > 0 && (
                    <button
                      type="button"
                      onClick={() => removeSubject(i, j)}
                      className="bg-red-500 text-white px-3 rounded text-sm"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSubject(i)}
                className="text-blue-600 text-sm mt-2"
              >
                + Add Subject
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(setSyllabus, { semester: "", subjects: [""] })
            }
            className="text-blue-600"
          >
            + Add Semester
          </button>
        </section>

        {/* --- */}
        {/* ⭐ NEW UI SECTIONS START HERE ⭐ */}
        {/* --- */}

        {/* OFFERED COURSE SECTION */}
        <section>
          <h2 className="font-semibold text-xl mb-3 border-b pb-1">Offered Courses</h2>
          {offeredCourses.map((item, i) => (
            <div key={i} className="border p-4 rounded-md mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Heading (e.g., 'Core Courses')"
                  value={item.heading}
                  onChange={(e) =>
                    handleDynamicChange(setOfferedCourses, i, "heading", e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                  required
                />
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => removeField(setOfferedCourses, i)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <h4 className="font-medium text-sm my-2">Points:</h4>
              {item.points.map((point, j) => (
                <div key={j} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    placeholder={`Point ${j + 1}`}
                    value={point}
                    onChange={(e) => handleNestedDynamicChange(setOfferedCourses, i, "points", j, e.target.value)}
                    className="border p-2 rounded-md w-full"
                  />
                  {j > 0 && (
                    <button
                      type="button"
                      onClick={() => removeNestedArrayItem(setOfferedCourses, i, "points", j)}
                      className="bg-red-500 text-white px-3 rounded text-sm"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addNestedArrayItem(setOfferedCourses, i, "points")}
                className="text-blue-600 text-sm mt-2"
              >
                + Add Point
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(setOfferedCourses, { heading: "", points: [""] })}
            className="text-blue-600"
          >
            + Add Offered Course Section
          </button>
        </section>

        {/* --- */}

        {/* ONLINE COURSE ELIGIBILITY */}
        <section>
          <h2 className="font-semibold text-xl mb-3 border-b pb-1">Online Course Eligibility</h2>
          {onlineEligibility.map((item, i) => (
            <div key={i} className="border p-4 rounded-md mb-4">
              <div className="grid md:grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Heading (e.g., 'Minimum Qualification')"
                  value={item.heading}
                  onChange={(e) =>
                    handleDynamicChange(setOnlineEligibility, i, "heading", e.target.value)
                  }
                  className="border p-2 rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Sub Heading (Optional)"
                  value={item.subHeading}
                  onChange={(e) =>
                    handleDynamicChange(setOnlineEligibility, i, "subHeading", e.target.value)
                  }

                  className="border p-2 rounded-md"
                />
                <textarea
                  placeholder="Description (Required)"
                  value={item.description}
                  onChange={(e) =>
                    handleDynamicChange(setOnlineEligibility, i, "description", e.target.value)
                  }
                  className="border p-2 rounded-md"
                  required
                />
                <textarea
                  placeholder="Sub Description (Optional)"
                  value={item.subDescription}
                  onChange={(e) =>
                    handleDynamicChange(setOnlineEligibility, i, "subDescription", e.target.value)
                  }
                  className="border p-2 rounded-md"
                />
              </div>
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeField(setOnlineEligibility, i)}
                  className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                >
                  ✕ Remove Eligibility
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(setOnlineEligibility, { heading: "", description: "", subHeading: "", subDescription: "" })
            }
            className="text-blue-600"
          >
            + Add Eligibility
          </button>
        </section>

        {/* --- */}

        {/* FEES STRUCTURE (Sidebar) */}
        <section>
          <h2 className="font-semibold text-xl mb-3 border-b pb-1">Fees Structure (Sidebar)</h2>
          {feeStructureSidebar.map((item, i) => (
            <div key={i} className="border p-4 rounded-md mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Heading (e.g., 'Total Course Fee')"
                  value={item.heading}
                  onChange={(e) =>
                    handleDynamicChange(setFeeStructureSidebar, i, "heading", e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                  required
                />
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => removeField(setFeeStructureSidebar, i)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <h4 className="font-medium text-sm my-2">Points:</h4>
              {item.points.map((point, j) => (
                <div key={j} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    placeholder={`Point ${j + 1} (e.g., 'Approx. ₹1,50,000')`}
                    value={point}
                    onChange={(e) => handleNestedDynamicChange(setFeeStructureSidebar, i, "points", j, e.target.value)}
                    className="border p-2 rounded-md w-full"
                  />
                  {j > 0 && (
                    <button
                      type="button"
                      onClick={() => removeNestedArrayItem(setFeeStructureSidebar, i, "points", j)}
                      className="bg-red-500 text-white px-3 rounded text-sm"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addNestedArrayItem(setFeeStructureSidebar, i, "points")}
                className="text-blue-600 text-sm mt-2"
              >
                + Add Point
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(setFeeStructureSidebar, { heading: "", points: [""] })}
            className="text-blue-600"
          >
            + Add Fee Structure Section
          </button>
        </section>

        {/* --- */}

        {/* DETAILED FEES TABLE */}
        <section>
          <h2 className="font-semibold text-xl mb-3 border-b pb-1">Detailed Fees Table</h2>
          {detailedFees.map((item, i) => (
            <div key={i} className="border p-4 rounded-md mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Heading (e.g., 'University-wise Fee')"
                  value={item.heading}
                  onChange={(e) => handleDynamicChange(setDetailedFees, i, "heading", e.target.value)}
                  className="border p-2 rounded-md w-full"
                  required
                />
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => removeField(setDetailedFees, i)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
              <textarea
                placeholder="Description (Optional)"
                value={item.description}
                onChange={(e) => handleDynamicChange(setDetailedFees, i, "description", e.target.value)}
                className="border p-2 rounded-md w-full mb-2"
              />

              <h4 className="font-medium text-base my-2">Fee Table Rows:</h4>
              {item.table.map((row, j) => (
                <div key={j} className="grid md:grid-cols-3 gap-2 mb-2 p-2 border rounded-md bg-gray-50">
                  <input
                    type="text"
                    placeholder="University Name (Required)"
                    value={row.universityName}
                    onChange={(e) => handleDetailedFeesTableChange(i, j, "universityName", e.target.value)}
                    className="border p-2 rounded-md"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Course Fees (Required)"
                    value={row.courseFees}
                    onChange={(e) => handleDetailedFeesTableChange(i, j, "courseFees", e.target.value)}
                    className="border p-2 rounded-md"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Detailed Fee Link (Optional)"
                      value={row.detailedFeeStructure}
                      onChange={(e) => handleDetailedFeesTableChange(i, j, "detailedFeeStructure", e.target.value)}
                      className="border p-2 rounded-md w-full"
                    />
                    {j > 0 && (
                      <button
                        type="button"
                        onClick={() => removeDetailedFeesTableItem(i, j)}
                        className="bg-red-500 text-white px-3 rounded text-sm"
                      >
                        -
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addDetailedFeesTableItem(i)}
                className="text-blue-600 text-sm mt-2"
              >
                + Add Table Row
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(setDetailedFees, {
                heading: "",
                description: "",
                table: [{ universityName: "", courseFees: "", detailedFeeStructure: "" }],
              })
            }
            className="text-blue-600"
          >
            + Add Detailed Fees Section
          </button>
        </section>

        {/* --- */}

        {/* ONLINE COURSE WORTH IT? */}
        <section>
          <h2 className="font-semibold text-xl mb-3 border-b pb-1">Online Course Worth It?</h2>
          <textarea
            placeholder="Main Description"
            value={onlineCourseWorthIt.description}
            onChange={(e) => handleSingleObjectChange("description", e.target.value)}
            className="border p-2 rounded-md w-full mb-4"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleOnlineCourseWorthItImageChange}
            className="border p-2 rounded-md w-full mb-4"
          />

          <h4 className="font-medium text-base my-2">Topics:</h4>
          {onlineCourseWorthIt.topics.map((topic, i) => (
            <div key={i} className="border p-3 rounded-md mb-2 bg-gray-50">
              <input
                type="text"
                placeholder="Sub Heading"
                value={topic.subHeading}
                onChange={(e) => handleOnlineCourseWorthItTopicChange(i, "subHeading", e.target.value)}
                className="border p-2 rounded-md w-full mb-2"
              />
              <textarea
                placeholder="Description"
                value={topic.description}
                onChange={(e) => handleOnlineCourseWorthItTopicChange(i, "description", e.target.value)}
                className="border p-2 rounded-md w-full"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeOnlineCourseWorthItTopic(i)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm mt-2"
                >
                  - Remove Topic
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOnlineCourseWorthItTopic}
            className="text-blue-600"
          >
            + Add Topic
          </button>
        </section>

        {/* --- */}

        {/* JOB OPPORTUNITIES */}
        <section>
          <h2 className="font-semibold text-xl mb-3 border-b pb-1">Job Opportunities</h2>
          {jobOpportunities.map((item, i) => (
            <div key={i} className="border p-4 rounded-md mb-4">
              <div className="grid md:grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Heading (Required)"
                  value={item.heading}
                  onChange={(e) => handleDynamicChange(setJobOpportunities, i, "heading", e.target.value)}
                  className="border p-2 rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Job Post"
                  value={item.jobPost}
                  onChange={(e) => handleDynamicChange(setJobOpportunities, i, "jobPost", e.target.value)}
                  className="border p-2 rounded-md"
                />
                <textarea
                  placeholder="Description (Optional)"
                  value={item.description}
                  onChange={(e) => handleDynamicChange(setJobOpportunities, i, "description", e.target.value)}
                  className="border p-2 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Salary"
                  value={item.salary}
                  onChange={(e) => handleDynamicChange(setJobOpportunities, i, "salary", e.target.value)}
                  className="border p-2 rounded-md"
                />
              </div>
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeField(setJobOpportunities, i)}
                  className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                >
                  ✕ Remove Opportunity
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(setJobOpportunities, { heading: "", description: "", jobPost: "", salary: "" })}
            className="text-blue-600"
          >
            + Add Job Opportunity
          </button>
        </section>

        {/* --- */}

        {/* TOP RECRUITERS */}
        <section>
          <h2 className="font-semibold text-xl mb-3 border-b pb-1">Top Recruiters</h2>
          {topRecruiters.map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Company Name (Required)"
                value={item.companyName}
                onChange={(e) =>
                  handleDynamicChange(setTopRecruiters, i, "companyName", e.target.value)
                }
                className="border p-2 rounded-md w-full"
                required
              />
              <input
                type="text"
                placeholder="Package Offered (Optional)"
                value={item.packageOffered}
                onChange={(e) =>
                  handleDynamicChange(setTopRecruiters, i, "packageOffered", e.target.value)
                }
                className="border p-2 rounded-md w-full"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeField(setTopRecruiters, i)}
                  className="bg-red-500 text-white px-3 rounded"
                >
                  ✕
                </button>
               
              )}
              
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(setTopRecruiters, { companyName: "", packageOffered: "" })}
            className="text-blue-600"
          >
            + Add Recruiter
          </button>
        </section>

        {/* --- */}
        {/* ⭐ NEW UI SECTIONS END HERE ⭐ */}
        {/* --- */}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Create Course"}
        </button>
      </form>

      {/* Existing Courses List (Optional - not modified) */}
      <h2 className="text-xl font-semibold text-gray-800 mt-10 mb-4">
        Existing Courses ({courses.length})
      </h2>
      <ul className="space-y-2">
        {courses.map((course) => (
          <li
            key={course._id}
            className="bg-white p-3 rounded-md shadow-sm border border-gray-100"
          >
            {course.name} - **{course.category}** (Slug: {course.slug})
          </li>
        ))}
      </ul>
    </main> 
  );
}
// "use client";

// import { useState, useEffect } from "react";
// import api from "@/utlis/api.js"; // ✅ your axios instance

// export default function CoursesPage() {
//   const [formData, setFormData] = useState({
//     category: "",
//     name: "",
//     duration: "",
//     tag: "",
//   });
//   const [specializations, setSpecializations] = useState([""]);
//   const [courseLogo, setCourseLogo] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ Fetch Courses
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

//   // ✅ Handle basic field changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ✅ Handle specialization
//   const handleSpecializationChange = (index, value) => {
//     const updated = [...specializations];
//     updated[index] = value;
//     setSpecializations(updated);
//   };

//   const addSpecialization = () => setSpecializations([...specializations, ""]);
//   const removeSpecialization = (index) => {
//     const updated = [...specializations];
//     updated.splice(index, 1);
//     setSpecializations(updated);
//   };

//   // ✅ Image upload
//   const handleFileChange = (e) => {
//     setCourseLogo(e.target.files[0]);
//   };

//   // ✅ Submit new course
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.category || !formData.name || !formData.duration) {
//       alert("Please fill all required fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const payload = new FormData();
//       payload.append("category", formData.category);
//       payload.append("name", formData.name);
//       payload.append("duration", formData.duration);
//       payload.append("tag", formData.tag);

//       specializations.forEach((spec) =>
//         payload.append("specialization", spec.trim())
//       );

//       if (courseLogo) payload.append("courseLogo", courseLogo);

//       await api.post("/api/v1/course", payload, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("✅ Course created successfully!");
//       setFormData({ category: "", name: "", duration: "", tag: "" });
//       setSpecializations([""]);
//       setCourseLogo(null);
//       fetchCourses();
//     } catch (err) {
//       console.error("Error creating course:", err);
//       alert("❌ Failed to create course.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Delete course
//   const handleDelete = async (id) => {
//     if (!confirm("Delete this course?")) return;
//     try {
//       await api.delete(`/api/v1/course/${id}`);
//       alert("✅ Course deleted successfully!");
//       fetchCourses();
//     } catch (err) {
//       console.error("Error deleting course:", err);
//       alert("❌ Failed to delete course.");
//     }
//   };

//   // ✅ Filtered Courses
//   const filteredCourses = courses.filter((c) =>
//     [c.name, c.category, c.duration, c.tag]
//       .filter(Boolean)
//       .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <main className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-2xl font-semibold text-gray-800 mb-6">
//         🎓 Course Management
//       </h1>

//       {/* FORM (landscape layout) */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded-xl p-6 mb-10 grid md:grid-cols-2 gap-6"
//         encType="multipart/form-data"
//       >
//         {/* Left section */}
//         <div className="space-y-4">
//           <div>
//             <label className="block mb-1 text-gray-700 font-medium">
//               Category
//             </label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
//               required
//             >
//               <option value="">Select Category</option>
//               <option value="UG">UG</option>
//               <option value="PG">PG</option>
//               <option value="Doctorate">Doctorate</option>
//               <option value="JobGuarantee">Job Guarantee</option>
//               <option value="StudyAbroad">Study Abroad</option>
//               <option value="AdvancedDiploma">Advanced Diploma</option>
//             </select>
//           </div>

//           <div>
//             <label className="block mb-1 text-gray-700 font-medium">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Course Name"
//               className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-gray-700 font-medium">
//               Duration
//             </label>
//             <input
//               type="text"
//               name="duration"
//               value={formData.duration}
//               onChange={handleChange}
//               placeholder="e.g., 3 Years"
//               className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-gray-700 font-medium">Tag</label>
//             <input
//               type="text"
//               name="tag"
//               value={formData.tag}
//               onChange={handleChange}
//               placeholder="e.g., Engineering, MBA"
//               className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
//             />
//           </div>
//         </div>

//         {/* Right section */}
//         <div className="space-y-4">
//           {/* Specializations */}
//           <div>
//             <label className="block mb-1 text-gray-700 font-medium">
//               Specializations
//             </label>
//             {specializations.map((spec, i) => (
//               <div key={i} className="flex gap-2 mb-2">
//                 <input
//                   type="text"
//                   value={spec}
//                   onChange={(e) =>
//                     handleSpecializationChange(i, e.target.value)
//                   }
//                   placeholder={`Specialization ${i + 1}`}
//                   className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
//                 />
//                 {specializations.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeSpecialization(i)}
//                     className="bg-red-500 text-white px-3 rounded"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={addSpecialization}
//               className="text-blue-600 text-sm hover:underline"
//             >
//               ➕ Add Specialization
//             </button>
//           </div>

//           {/* Image Upload */}
//           <div>
//             <label className="block mb-1 text-gray-700 font-medium">
//               Course Logo
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="w-full border border-gray-300 p-2 rounded-md"
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition"
//           >
//             {loading ? "Saving..." : "Create Course"}
//           </button>
//         </div>
//       </form>

//       {/* SEARCH */}
//       <div className="mb-5 max-w-md">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           placeholder="🔍 Search by name, category, duration, or tag..."
//           className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
//         />
//       </div>

//       {/* COURSE TABLE */}
//       <div className="bg-white shadow rounded-xl overflow-x-auto">
//         <table className="min-w-full border border-gray-200 text-sm">
//           <thead className="bg-gray-100 text-gray-700">
//             <tr>
//               <th className="p-3 text-left">Logo</th>
//               <th className="p-3 text-left">Category</th>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Duration</th>
//               <th className="p-3 text-left">Specializations</th>
//               <th className="p-3 text-left">Slug</th>
//               <th className="p-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredCourses.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="text-center p-4 text-gray-500">
//                   No courses found
//                 </td>
//               </tr>
//             ) : (
//               filteredCourses.map((course) => (
//                 <tr key={course._id} className="border-t hover:bg-gray-50">
//                   <td className="p-3">
//                     {course.courseLogo?.url ? (
//                       <img
//                         src={course.courseLogo.url}
//                         alt="logo"
//                         className="w-10 h-10 object-contain rounded"
//                       />
//                     ) : (
//                       "—"
//                     )}
//                   </td>
//                   <td className="p-3">{course.category}</td>
//                   <td className="p-3">{course.name}</td>
//                   <td className="p-3">{course.duration}</td>
//                   <td className="p-3">
//                     {course.specialization?.join(", ") || "—"}
//                   </td>
//                   <td className="p-3 text-gray-500 text-xs">
//                     {course.slug || "—"}
//                   </td>
//                   <td className="p-3 text-center">
//                     <button
//                       onClick={() => handleDelete(course._id)}
//                       className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   );
// }




"use client";

import { useState, useEffect } from "react";
 import api from "@/utlis/api.js"; // ✅ your axios instance

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
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setCourseLogo(e.target.files[0]);

  const handleDynamicChange = (setter, index, key, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  const addField = (setter, newObj) => setter((prev) => [...prev, newObj]);
  const removeField = (setter, index) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  const handleSpecializationChange = (i, val) => {
    const updated = [...specializations];
    updated[i] = val;
    setSpecializations(updated);
  };

  const addSpecialization = () => setSpecializations([...specializations, ""]);
  const removeSpecialization = (i) =>
    setSpecializations(specializations.filter((_, idx) => idx !== i));

  // ✅ Handle Syllabus subjects
  const handleSubjectChange = (semIndex, subIndex, value) => {
    const updated = [...syllabus];
    updated[semIndex].subjects[subIndex] = value;
    setSyllabus(updated);
  };

  const addSubject = (semIndex) => {
    const updated = [...syllabus];
    updated[semIndex].subjects.push("");
    setSyllabus(updated);
  };

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

      // Specializations
      specializations
        .filter((s) => s.trim() !== "")
        .forEach((spec) => payload.append("specialization", spec));

      // Overview
      overview
        .filter((item) => item.heading || item.description)
        .forEach((item, i) => {
          payload.append(`overview[${i}][heading]`, item.heading);
          payload.append(`overview[${i}][description]`, item.description);
          payload.append(`overview[${i}][videoLink]`, item.videoLink);
          if (item.image) payload.append(`overview[${i}][image]`, item.image);
        });

      // Why Choose Us
      whyChooseUs
        .filter((item) => item.description)
        .forEach((item, i) => {
          payload.append(`whyChooseUs[${i}][description]`, item.description);
          if (item.image)
            payload.append(`whyChooseUs[${i}][image]`, item.image);
        });

      // Good Things
      goodThings
        .filter((g) => g.trim() !== "")
        .forEach((g) => payload.append("goodThings", g));

      // Top Universities
      topUniversities
        .filter((item) => item.name)
        .forEach((item, i) => {
          payload.append(`topUniversities[${i}][name]`, item.name);
          payload.append(
            `topUniversities[${i}][description]`,
            item.description
          );
        });

      // Key Highlights
      keyHighlights
        .filter((item) => item.heading)
        .forEach((item, i) => {
          payload.append(`keyHighlights[${i}][heading]`, item.heading);
          payload.append(`keyHighlights[${i}][subHeading]`, item.subHeading);
          payload.append(`keyHighlights[${i}][description]`, item.description);
        });

      // Syllabus
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
        {/* BASIC DETAILS */}
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
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
        </section>

        {/* SPECIALIZATIONS */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Specializations</h2>
          {specializations.map((spec, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
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

        {/* OVERVIEW */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Overview</h2>
          {overview.map((item, i) => (
            <div
              key={i}
              className="grid md:grid-cols-2 gap-2 mb-4 border p-3 rounded-md"
            >
              <input
                type="text"
                placeholder="Heading"
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

        {/* WHY CHOOSE US */}
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

        {/* GOOD THINGS */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Good Things</h2>
          {goodThings.map((g, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={g}
                onChange={(e) =>
                  setGoodThings((prev) =>
                    prev.map((val, idx) => (idx === i ? e.target.value : val))
                  )
                }
                className="w-full border p-2 rounded-md"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeField(setGoodThings, i)}
                  className="bg-red-500 text-white px-3 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(setGoodThings, "")}
            className="text-blue-600"
          >
            + Add
          </button>
        </section>

        {/* TOP UNIVERSITIES */}
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
                placeholder="Description"
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
        </section>

        {/* KEY HIGHLIGHTS */}
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

        {/* SYLLABUS */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Syllabus</h2>
          {syllabus.map((sem, i) => (
            <div key={i} className="border p-4 rounded-md mb-4">
              <input
                type="text"
                placeholder="Semester"
                value={sem.semester}
                onChange={(e) =>
                  handleDynamicChange(setSyllabus, i, "semester", e.target.value)
                }
                className="border p-2 rounded-md w-full mb-2"
              />
              {sem.subjects.map((sub, j) => (
                <input
                  key={j}
                  type="text"
                  placeholder={`Subject ${j + 1}`}
                  value={sub}
                  onChange={(e) => handleSubjectChange(i, j, e.target.value)}
                  className="border p-2 rounded-md w-full mb-1"
                />
              ))}
              <button
                type="button"
                onClick={() => addSubject(i)}
                className="text-blue-600"
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

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Create Course"}
        </button>
      </form>
    </main>
  );
}

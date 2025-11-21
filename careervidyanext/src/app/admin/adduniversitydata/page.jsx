// "use client";

// import { useState } from "react";
// import api from "@/utlis/api.js";
// import Link from "next/link";

// export default function AddUniversityPage() {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [universityImage, setUniversityImage] = useState(null);
//   const [courses, setCourses] = useState([{ name: "", logo: null, duration: "" }]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [errors, setErrors] = useState({});

//   const addCourse = () =>
//     setCourses([...courses, { name: "", logo: null, duration: "" }]);

//   const removeCourse = (index) => {
//     const updated = [...courses];
//     updated.splice(index, 1);
//     setCourses(updated);
//   };

//   const handleCourseChange = (index, field, value) => {
//     const updated = [...courses];
//     updated[index][field] = value;
//     setCourses(updated);
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!name.trim()) newErrors.name = "University name is required";
//     courses.forEach((c, i) => {
//       if (!c.name.trim()) newErrors[`courseName${i}`] = "Course name is required";
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setErrors({});
//     if (!validateForm()) return setMessage("❌ Please fill all required fields.");

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("description", description);
//       if (universityImage) formData.append("universityImage", universityImage);

//       courses.forEach((course, index) => {
//         formData.append(`courses[${index}][name]`, course.name);
//         formData.append(`courses[${index}][duration]`, course.duration);
//         if (course.logo) formData.append(`courses[${index}][logo]`, course.logo);
//       });

//       const response = await api.post("/api/v1/university", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setMessage("✅ University added successfully!");
//       setName("");
//       setDescription("");
//       setUniversityImage(null);
//       setCourses([{ name: "", logo: null, duration: "" }]);
//     } catch (error) {
//       console.error("Error Response:", error);
//       setMessage("❌ Error: " + (error.response?.data?.message || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold text-[#0056B3]">Add University</h2>
//         <Link
//           href="/admin/getuniversites"
//           className="bg-[#0056B3] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//         >
//           View Universities
//         </Link>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* University Name */}
//         <div>
//           <label className="block font-medium mb-1">University Name *</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className={`w-full border rounded-lg p-2 ${
//               errors.name ? "border-red-500" : ""
//             }`}
//             placeholder="e.g. Delhi University"
//           />
//           {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block font-medium mb-1">Description</label>
//           <textarea
//             rows="3"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full border rounded-lg p-2"
//             placeholder="Brief info about the university"
//           />
//         </div>

//         {/* University Image */}
//         <div>
//           <label className="block font-medium mb-1">University Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setUniversityImage(e.target.files[0])}
//           />
//         </div>

//         {/* Courses */}
//         <div className="border rounded-lg p-4 bg-gray-50">
//           <h3 className="font-semibold text-lg mb-2 text-[#0056B3]">Courses</h3>

//           {courses.map((course, index) => (
//             <div key={index} className="grid md:grid-cols-3 gap-4 items-center mb-4">
//               <div>
//                 <label className="block text-sm mb-1">Course Name *</label>
//                 <input
//                   type="text"
//                   value={course.name}
//                   onChange={(e) => handleCourseChange(index, "name", e.target.value)}
//                   className={`w-full border rounded-lg p-2 ${
//                     errors[`courseName${index}`] ? "border-red-500" : ""
//                   }`}
//                   placeholder="e.g. B.Tech"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm mb-1">Duration</label>
//                 <input
//                   type="text"
//                   value={course.duration}
//                   onChange={(e) => handleCourseChange(index, "duration", e.target.value)}
//                   className="w-full border rounded-lg p-2"
//                   placeholder="e.g. 4 Years"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm mb-1">Course Logo</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) =>
//                     handleCourseChange(index, "logo", e.target.files[0])
//                   }
//                 />
//               </div>

//               {courses.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeCourse(index)}
//                   className="text-red-500 text-sm underline col-span-full"
//                 >
//                   Remove this course
//                 </button>
//               )}
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={addCourse}
//             className="bg-[#0056B3] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
//           >
//             + Add Another Course
//           </button>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-[#0056B3] text-white w-full py-2 rounded-lg hover:bg-blue-700"
//         >
//           {loading ? "Saving..." : "Add University"}
//         </button>

//         {message && (
//           <p
//             className={`text-center mt-2 text-sm ${
//               message.includes("✅") ? "text-green-600" : "text-red-500"
//             }`}
//           >
//             {message}
//           </p>
//         )}
//       </form>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import api from "@/utlis/api.js";
import Link from "next/link";

export default function AddUniversityPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [universityImage, setUniversityImage] = useState(null);

  // const [courses, setCourses] = useState([{ name: "", logo: null, duration: "" }]);  ❌ COMMENTED
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "University name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    if (!validateForm()) return setMessage("❌ Please fill all required fields.");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (universityImage) formData.append("universityImage", universityImage);

      // -------------------------------
      // ❌ COURSE SENDING COMMENTED
      // courses.forEach((course, index) => {
      //   formData.append(`courses[${index}][name]`, course.name);
      //   formData.append(`courses[${index}][duration]`, course.duration);
      //   if (course.logo) formData.append(`courses[${index}][logo]`, course.logo);
      // });
      // -------------------------------

      const response = await api.post("/api/v1/university", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ University added successfully!");
      setName("");
      setDescription("");
      setUniversityImage(null);
      // setCourses([{ name: "", logo: null, duration: "" }]);
    } catch (error) {
      console.error("Error Response:", error);
      setMessage("❌ Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#0056B3]">Add University</h2>
        <Link
          href="/admin/getuniversites"
          className="bg-[#0056B3] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          View Universities
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* University Name */}
        <div>
          <label className="block font-medium mb-1">University Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full border rounded-lg p-2 ${
              errors.name ? "border-red-500" : ""
            }`}
            placeholder="e.g. Delhi University"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Brief info about the university"
          />
        </div>

        {/* University Image */}
        <div>
          <label className="block font-medium mb-1">University Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUniversityImage(e.target.files[0])}
          />
        </div>

        {/* ---------------------------------------------
            ❌ COURSE SECTION COMPLETELY COMMENTED
        ---------------------------------------------- */}

        {/* 
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-lg mb-2 text-[#0056B3]">Courses</h3>

          {courses.map((course, index) => (
            <div key={index} className="grid md:grid-cols-3 gap-4 items-center mb-4">
              <div>
                <label className="block text-sm mb-1">Course Name *</label>
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => handleCourseChange(index, "name", e.target.value)}
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g. B.Tech"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Duration</label>
                <input
                  type="text"
                  value={course.duration}
                  onChange={(e) => handleCourseChange(index, "duration", e.target.value)}
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g. 4 Years"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Course Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleCourseChange(index, "logo", e.target.files[0])
                  }
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCourse}
            className="bg-[#0056B3] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            + Add Another Course
          </button>
        </div>
        */}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0056B3] text-white w-full py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Add University"}
        </button>

        {message && (
          <p
            className={`text-center mt-2 text-sm ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

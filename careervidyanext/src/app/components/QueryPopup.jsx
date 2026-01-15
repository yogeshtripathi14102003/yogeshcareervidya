// "use client";

// import { useState, useEffect } from "react";
// import { X, Send } from "lucide-react";
// import api from "@/utlis/api";

// export default function QueryPopup() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     city: "",
//     course: "",
//     branch: "",
//     message: "",
//   });

//   useEffect(() => {
//     const timer = setTimeout(() => setShowPopup(true), 5000);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/api/v1/getintouch", formData);
//       alert("✅ Query submitted successfully!");
//       setFormData({
//         name: "",
//         email: "",
//         mobile: "",
//         city: "",
//         course: "",
//         branch: "",
//         message: "",
//       });
//       setShowPopup(false);
//     } catch (error) {
//       console.error(error);
//       alert("❌ Something went wrong!");
//     }
//   };

//   if (!showPopup) return null;

//   return (
//     <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-3 backdrop-blur-sm overflow-y-auto">
//       <div className="bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row relative animate-slideUpMobile md:animate-fadeIn">

//         {/* Close Button */}
//         <button
//           onClick={() => setShowPopup(false)}
//           className="absolute top-2 right-2 z-[110] bg-white/90 md:bg-gray-100 p-1.5 rounded-full shadow-md text-gray-500 hover:text-blue-600"
//         >
//           <X size={20} />
//         </button>

//         {/* Left Panel */}
//         <div className="bg-[#05347f] text-white w-full md:w-1/3 p-6 flex flex-col justify-center items-center text-center">
//           <div className="bg-white/10 p-3 rounded-full mb-3">
//             <img
//               src="/images/may.png"
//               alt="help"
//               className="w-14 h-14 object-contain"
//             />
//           </div>
//           <h3 className="text-base font-bold mb-1">Share your query</h3>
//           <p className="text-xs opacity-80">
//             We’re here to guide you at every step.
//           </p>
//         </div>

//         {/* Right Form */}
//         <div className="w-full md:w-2/3 p-4 md:p-6 text-gray-900">
//           <h2 className="text-lg font-bold mb-4 text-[#05347f] hidden md:block">
//             Quick Enquiry
//           </h2>

//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Your Name"
//               required
//               className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//             />

//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Your Email"
//               required
//               className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//             />

//             <input
//               type="tel"
//               name="mobile"
//               value={formData.mobile}
//               onChange={handleChange}
//               placeholder="Mobile No"
//               required
//               className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//             />

//             <input
//               type="text"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               placeholder="City"
//               required
//               className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//             />

//             <input
//               type="text"
//               name="course"
//               value={formData.course}
//               onChange={handleChange}
//               placeholder="Course"
//               required
//               className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//             />

//             <input
//               type="text"
//               name="branch"
//               value={formData.branch}
//               onChange={handleChange}
//               placeholder="Branch"
//               required
//               className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//             />

//             <textarea
//               name="message"
//               value={formData.message}
//               onChange={handleChange}
//               placeholder="How can we help you?"
//               required
//               rows="2"
//               className="md:col-span-2 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//             />

//             <div className="md:col-span-2">
//               <button
//                 type="submit"
//                 className="w-full bg-[#05347f] text-white py-2.5 rounded-lg font-semibold hover:bg-blue-800 flex items-center justify-center gap-2"
//               >
//                 <span>Send Message</span>
//                 <Send size={16} />
//               </button>

//               <p className="text-center text-[10px] text-gray-600 mt-2">
//                 🔒 All your information is safe and secure with us.
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//         @keyframes slideUpMobile {
//           from {
//             opacity: 0;
//             transform: translateY(30%);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out forwards;
//         }
//         .animate-slideUpMobile {
//           animation: slideUpMobile 0.4s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // ✅ FIX: Image import added
import { X, Send } from "lucide-react";
import api from "@/utlis/api";

export default function QueryPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    course: "",
    branch: "",
    message: "",
  });

  /* Popup delay */
  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  /* Fetch courses safely from backend */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/v1/course");

        const courseArray =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data?.courses)
            ? res.data.courses
            : [];

        setCourses(courseArray);
      } catch (err) {
        console.error("Course fetch error", err);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "course") {
      const selected = courses.find((c) => c.name === value);

      setSpecializations(selected?.specializations || []);

      setFormData((prev) => ({
        ...prev,
        course: value,
        branch: "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/getintouch", formData);
      alert("✅ Query submitted successfully!");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        city: "",
        course: "",
        branch: "",
        message: "",
      });
      setShowPopup(false);
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong!");
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-3 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row relative animate-slideUpMobile md:animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-3 right-3 z-[110] bg-white/90 md:bg-gray-100 w-9 h-9 flex items-center justify-center rounded-full shadow-md text-gray-500 hover:text-blue-600"
        >
          <X size={20} />
        </button>

        {/* Left Panel */}
        <div className="bg-[#05347f] text-white w-full md:w-1/3 p-6 flex flex-col justify-center items-center text-center">
          <div className="bg-white/10 w-18 h-18 flex items-center justify-center rounded-full mb-3">
            <img
              src="/images/may.png"
              alt="help"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h3 className="text-base font-bold mb-1">Share your query</h3>
          <p className="text-xs opacity-80">
            We’re here to guide you at every step.
          </p>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-2/3 p-4 md:p-6 text-gray-900">
          <div className="flex items-center gap-3 mb-3">
            <Image
              src="/images/n12.png"
              alt="Career Vidya"
              width={85}
              height={42}
            />
            <div>
              <p className="text-sm font-bold text-[#253b7a]">
                #VidyaHaiTohSuccessHai
              </p>
              <p className="text-[12px] text-gray-500">
                Student's Trusted Education Guidance Platform
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile No"
              required
              className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
              className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>

            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              disabled={!specializations.length}
              className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Branch</option>
              {specializations.map((sp, i) => (
                <option key={i} value={sp}>
                  {sp}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help you?"
              required
              rows="2"
              className="md:col-span-2 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-[#05347f] text-white py-2.5 rounded-lg font-semibold hover:bg-blue-800 flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <Send size={16} />
              </button>
              <p className="text-center text-[10px] text-gray-600 mt-2">
                🔒 All your information is safe and secure with us.
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideUpMobile {
          from {
            opacity: 0;
            transform: translateY(30%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slideUpMobile {
          animation: slideUpMobile 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

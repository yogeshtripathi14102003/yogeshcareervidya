// "use client";
// import { useState, useEffect } from "react";
// import { Mail, Phone } from "lucide-react";
// import api from "@/utlis/api.js"; // ✅ Your existing API setup

// export default function ContactUsPage() {
//   const [isClient, setIsClient] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // ✅ Match backend model field names exactly
//   const [formData, setFormData] = useState({
//     name: "",
//     city: "",
//     email: "",
//     mobile: "",
//     message: "",
//      course: "",
//         branch: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ✅ API POST call
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await api.post("/api/v1/getintouch", formData);

//       if (res.status === 200 || res.status === 201) {
//         alert("✅ Thank you! Your message has been sent successfully.");
//         setFormData({
//           name: "",
//           city: "",
//           email: "",
//           mobile: "",
//           message: "",
//            course: "",
//         branch: "",
//         });
//       } else {
//         alert("⚠️ Something went wrong. Please try again later.");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("❌ Unable to send message. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Testimonials data
//   const testimonials = [
//     {
//       name: "Aditi Sharma",
//       location: "Delhi University",
//       message:
//         "Career Vidya’s guidance helped me find the right course and college. Their counselors are friendly and truly care about students.",
//       image: "https://randomuser.me/api/portraits/women/65.jpg",
//     },
//     {
//       name: "Rohan Patel",
//       location: "Ahmedabad",
//       message:
//         "I was confused about which course to choose, but Career Vidya made everything easy and clear. Thank you for guiding me.",
//       image: "https://randomuser.me/api/portraits/men/75.jpg",
//     },
//     {
//       name: "Sneha Verma",
//       location: "Pune",
//       message:
//         "The free counseling session was very helpful. They explained the admission process and gave honest suggestions.",
//       image: "https://randomuser.me/api/portraits/women/45.jpg",
//     },
//   ];

//   const [currentTestimonial, setCurrentTestimonial] = useState(0);

//   useEffect(() => {
//     if (!isClient) return;
//     const interval = setInterval(() => {
//       setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [isClient]);

//   if (!isClient) return null;

//   return (
//     <div className=" bg-gradient-to-b from-blue-50 to-blue-100 py-16 px-6">
//       <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-10">
//         {/* Header */}
//         <h2 className="text-3xl font-semibold text-center text-[#0056A4] mb-6">
//           Let’s Discuss Your Future!
//         </h2>
//         <p className="text-center text-gray-600 mb-5 max-w-2xl mx-auto">
//           Get <strong>free career guidance</strong> from our experts to choose the best course, college,
//           or career path for you. Your data is <strong>100% confidential</strong> — we’re here to help,
//           not to sell.
//         </p>

//         {/* Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* LEFT SIDE */}
//           <div className="space-y-8">
//             <div>
//               <h2 className="text-xl font-bold text-gray-800 mb-4">Student Support</h2>
//               <ul className="space-y-3 text-gray-700">
//                 <li className="flex items-center gap-2">
//                   <Mail className="text-blue-500" size={18} /> Info@careervidya.in
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <Phone className="text-blue-500" size={18} /> +91 9289716667
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h2 className="text-xl font-bold text-gray-800 mb-4">For Collaboration</h2>
//               <ul className="space-y-3 text-gray-700">
//                 <li className="flex items-center gap-2">
//                   <Mail className="text-blue-500" size={18} /> Careervidya.edu@gmail.com
//                 </li>
//               </ul>
//             </div>

//             {/* Rotating testimonial */}
//             {/* <div className="bg-[#0056A4] text-white rounded-2xl p-6 shadow-lg flex gap-4 items-center transition-all duration-500">
//               <img
//                 src={testimonials[currentTestimonial].image}
//                 alt={testimonials[currentTestimonial].name}
//                 className="w-16 h-16 rounded-full object-cover border-2 border-white"
//               />
//               <div>
//                 <h3 className="font-semibold text-lg">
//                   {testimonials[currentTestimonial].name}
//                 </h3>
//                 <p className="text-sm opacity-90">{testimonials[currentTestimonial].location}</p>
//                 <p className="text-sm mt-2 opacity-90">
//                   {testimonials[currentTestimonial].message}
//                 </p>
//               </div>
//             </div> */}
//           </div>

//           {/* RIGHT SIDE - FORM */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//     <input
//       type="text"
//       name="name"
//       placeholder="Full Name *"
//       value={formData.name}
//       onChange={handleChange}
//       required
//       className="border rounded-lg p-3 w-full"
//     />
//     <input
//       type="text"
//       name="city"
//       placeholder="City *"
//       value={formData.city}
//       onChange={handleChange}
//       required
//       className="border rounded-lg p-3 w-full"
//     />
//   </div>

//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//     <input
//       type="email"
//       name="email"
//       placeholder="Email *"
//       value={formData.email}
//       onChange={handleChange}
//       required
//       className="border rounded-lg p-3 w-full"
//     />
//     <input
//       type="text"
//       name="mobile"
//       placeholder="Mobile *"
//       value={formData.mobile}
//       onChange={handleChange}
//       required
//       className="border rounded-lg p-3 w-full"
//     />
//   </div>

//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//     <input
//       type="text"
//       name="course"
//       placeholder="Course *"
//       value={formData.course}
//       onChange={handleChange}
//       required
//       className="border rounded-lg p-3 w-full"
//     />
//     <input
//       type="text"
//       name="branch"
//       placeholder="Branch *"
//       value={formData.branch}
//       onChange={handleChange}
//       required
//       className="border rounded-lg p-3 w-full"
//     />
//   </div>

//   <textarea
//     name="message"
//     placeholder="How can we help you? *"
//     rows={4}
//     value={formData.message}
//     onChange={handleChange}
//     required
//     className="border rounded-lg p-3 w-full"
//   />

//   <button
//     type="submit"
//     disabled={loading}
//     className={`w-full bg-[#c15304] text-white py-3 rounded-lg transition-all ${
//       loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#c15304]"
//     }`}
//   >
//     {loading ? "Submitting..." : "Submit"}
//   </button>
// </form>

//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { Target, Zap, CheckCircle, Mail, Phone } from "lucide-react";
import api from "@/utlis/api.js";

const INITIAL_FORM = { name: "", city: "", email: "", mobile: "", message: "", course: "", branch: "" };

// const FEATURES = [
//   { icon: Target, color: "orange", title: "Personalized Guidance", desc: "Expert advice tailored to your goals and interests." },
//   { icon: Zap, color: "blue", title: "Quick Response", desc: "Our team connects with you within 24 hours." },
//   { icon: CheckCircle, color: "green", title: "Trusted by Learners", desc: "Thousands of students trust us with their future." },
// ];

const inputClass = "w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all appearance-none";

export default function ContactUsPage() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => setIsClient(true), []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/v1/getintouch", formData);
      if (res.status === 200 || res.status === 201) {
        alert("✅ Thank you! Your message has been sent successfully.");
        setFormData(INITIAL_FORM);
      } else {
        alert("⚠️ Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Unable to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  const colorMap = {
    orange: "bg-orange-50 text-[#F97316]",
    blue: "bg-blue-50 text-blue-500",
    green: "bg-green-50 text-green-500",
  };

  return (
    <div className="bg-[#FFF9F5] py-16 px-6 font-sans">
      {/* 3-Column Grid Layout to match image */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* COLUMN 1: TEXT & FEATURES (Takes 4/12 space) */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <p className="text-[#F97316] font-bold tracking-wider text-xs mb-2 uppercase">Have Questions?</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] leading-tight mb-4">
              We're Here to Help <br />You Get <span className="text-[#F97316]">Started!</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-sm">
              Connect with our counsellors to get personalized guidance for your career journey.
            </p>
          </div>

          {/* <div className="space-y-6">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="flex gap-3 items-start">
                <div className={`p-1.5 rounded-full mt-0.5 ${colorMap[color]}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div> */}

          {/* --- NEW SUPPORT & COLLABORATION SECTION START --- */}
          <div className="pt-4 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-gray-800 mb-3">Student Support</h2>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <Mail className="text-blue-500" size={16} /> Info@careervidya.in
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="text-blue-500" size={16} /> +91 9289716667
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-800 mb-3">For Collaboration</h2>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <Mail className="text-blue-500" size={16} /> Careervidya.edu@gmail.com
                </li>
              </ul>
            </div>
          </div>
          {/* --- NEW SUPPORT & COLLABORATION SECTION END --- */}

        </div>

        {/* COLUMN 2: ILLUSTRATION (Takes 4/12 space, centered) */}
        <div className="hidden lg:flex lg:col-span-4 justify-center">
          <img
            src="/images/inquiry.png"
            alt="Student Guidance Illustration"
            className="w-full max-w-[320px] object-contain"
          />
        </div>

        {/* COLUMN 3: FORM (Takes 4/12 space) */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 border border-gray-100">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">Inquiry</h2>
            <p className="text-gray-500 text-xs mt-1">Let us know how we can assist you.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" placeholder="name" value={formData.name} onChange={handleChange} required className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                <input type="email" name="email" placeholder="email" value={formData.email} onChange={handleChange} required className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                <input type="text" name="mobile" placeholder="mobile" value={formData.mobile} onChange={handleChange} required className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Course <span className="text-red-500">*</span></label>
                <input type="text" name="course" placeholder="course" value={formData.course} onChange={handleChange} required className={inputClass} />
              </div> 
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700"> Branch</label>
              <input type="text" name="branch" placeholder="branch" value={formData.branch} onChange={handleChange} className={inputClass} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Your Message</label>
              <textarea name="message" placeholder="message" rows={2} value={formData.message} onChange={handleChange} required className={`${inputClass} resize-none`} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#F97316] text-white py-2.5 rounded-md font-semibold text-sm shadow-sm transition-all mt-2 ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#EA580C] hover:shadow-md"
              }`}
            >
              {loading ? "Submitting..." : "Submit Inquiry →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import TopOfferBanner from "../components/TopOfferBanner";
// import api from "@/utlis/api";

// export default function Footer() {
//   const [mounted, setMounted] = useState(false);

//   /* Newsletter */
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* Courses */
//   const [pgCourses, setPgCourses] = useState([]);
//   const [ugCourses, setUgCourses] = useState([]);
//   const [diplomaCourses, setDiplomaCourses] = useState([]);

//   /* Mount */
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   /* Fetch Courses */
//   useEffect(() => {
//     const fetchFooterCourses = async () => {
//       try {
//         const res = await api.get("/api/v1/course");

//         // ✅ Sort: Oldest → Newest
//         const allCourses = (res.data.courses || []).sort(
//           (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//         );

//         const pg = allCourses.filter(
//           (c) =>
//             c.category === "PG" ||
//             c.level === "PG" ||
//             c.programType === "PG" ||
//             c.type === "PG"
//         );

//         const ug = allCourses.filter(
//           (c) =>
//             c.category === "UG" ||
//             c.level === "UG" ||
//             c.programType === "UG" ||
//             c.type === "UG"
//         );

//         const diploma = allCourses.filter(
//           (c) =>
//             c.category === "Diploma" ||
//             c.level === "Diploma" ||
//             c.programType === "Diploma" ||
//             c.type === "Certificate" ||
//             c.type === "Diploma"
//         );

//         setPgCourses(pg);
//         setUgCourses(ug);
//         setDiplomaCourses(diploma);

//       } catch (err) {
//         console.error("Footer Course Error:", err);
//       }
//     };

//     fetchFooterCourses();
//   }, []);

//   /* Newsletter */
//   const handleSubscribe = async () => {
//     if (!email) {
//       setMessage("Please enter your email");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await fetch(
//         "https://api.careervidya.in/api/v1/subscribe",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email }),
//         }
//       );

//       const data = await res.json();

//       setMessage(data.msg || "Subscribed successfully!");
//       setEmail("");

//     } catch (error) {
//       setMessage("Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!mounted) {
//     return <footer className="bg-[#0f172a] min-h-[200px]" />;
//   }

//   return (
//     <footer className="bg-[#0f172a] text-white font-[Inter]">

//       <div className="max-w-7xl mx-auto px-6 py-12">

//         {/* TOP */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-300 mb-10">

//           {/* Head Office */}
//           <div>
//             <h3 className="text-lg font-semibold text-[#c15304] mb-2">
//               Head Office (Noida)
//             </h3>

//             <p className="text-sm leading-relaxed">
//               SF-27, 2nd Floor, Gaur City Center
//               <br /> Greater Noida, Uttar Pradesh 201318
//             </p>

//             <p className="mt-2 text-sm">📞 +91 9289712364</p>
//             <p className="mt-2 text-sm">📧 Info@careervidya.in</p>
//           </div>

//           {/* Corporate Office */}
//           <div>
//             <h3 className="text-lg font-semibold text-[#c15304] mb-2">
//               Corporate Office (Noida)
//             </h3>

//             <p className="text-sm leading-relaxed">
//               H-160, Sector 63, Noida - 201305
//             </p>

//             <p className="mt-2 text-sm">📞 +91 1201847695</p>
//           </div>

//           {/* Newsletter */}
//           <div>
//             <h3 className="text-lg font-semibold text-[#c15304] mb-3">
//               Subscribe
//             </h3>

//             <div className="flex gap-3">

//               <input
//                 type="email"
//                 placeholder="Enter email"
//                 className="w-full bg-white text-black rounded-md p-2 text-sm"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />

//               <button
//                 onClick={handleSubscribe}
//                 disabled={loading}
//                 className="bg-[#c15304] px-4 py-2 rounded-md text-sm"
//               >
//                 {loading ? "..." : "Subscribe"}
//               </button>

//             </div>

//             {message && (
//               <p className="text-xs mt-2">{message}</p>
//             )}
//           </div>

//         </div>

//         {/* COURSES */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-gray-700 pt-8 text-gray-300">

//           {/* About */}
//           <div>
//             <h4 className="text-white font-semibold mb-3 text-lg">About</h4>

//             <ul className="space-y-2 text-sm">
//               <li><Link href="/Aboutus">About</Link></li>
//               <li><Link href="/contactus">Contact</Link></li>
//               <li><Link href="/career">Careers</Link></li>
//               <li><Link href="/blog">Blog</Link></li>
//             </ul>
//           </div>

//           {/* PG */}
//           <div className="max-h-72 overflow-y-auto">
//             <h4 className="text-white font-semibold mb-3 text-lg">
//               PG Programs
//             </h4>

//             <ul className="space-y-2 text-sm">

//               {pgCourses.map((course) => (
//                 <li key={course._id}>
//                   <Link
//                     href={`/course/${course.slug}`}
//                     className="hover:text-[#c15304]"
//                   >
//                     {course.name}
//                   </Link>
//                 </li>
//               ))}

//             </ul>
//           </div>

//           {/* UG */}
//           <div className="max-h-72 overflow-y-auto">
//             <h4 className="text-white font-semibold mb-3 text-lg">
//               UG Programs
//             </h4>

//             <ul className="space-y-2 text-sm">

//               {ugCourses.map((course) => (
//                 <li key={course._id}>
//                   <Link
//                     href={`/course/${course.slug}`}
//                     className="hover:text-[#c15304]"
//                   >
//                     {course.name}
//                   </Link>
//                 </li>
//               ))}

//             </ul>
//           </div>

//           {/* Diploma */}
//           <div className="max-h-72 overflow-y-auto">
//             <h4 className="text-white font-semibold mb-3 text-lg">
//               Diploma & Certificates
//             </h4>

//             <ul className="space-y-2 text-sm">

//               {diplomaCourses.map((course) => (
//                 <li key={course._id}>
//                   <Link
//                     href={`/course/${course.slug}`}
//                     className="hover:text-[#c15304]"
//                   >
//                     {course.name}
//                   </Link>
//                 </li>
//               ))}

//             </ul>
//           </div>

//         </div>
// {/* ---------- DISCLAIMER ---------- */}
//          <div className="border-t border-gray-700 mt-10 pt-6 text-gray-300 text-sm leading-relaxed text-center max-w-3xl mx-auto">
//            <h4 className="text-[#c15304] font-semibold mb-3 text-base md:text-lg">
//              Disclaimer
//            </h4>
//            <p className="text-gray-300 max-w-2xl mx-auto">
//              Career Vidya Edu-Tech Pvt. Ltd. provides unbiased educational and career guidance for informational purposes only. 
//              We do not guarantee admissions, placements, or job outcomes. Users should verify course, fee, and institution details 
//              independently. Career Vidya is not liable for any loss or reliance on website content or third-party links.
//            </p>
//          </div>
//         {/* Bottom */}
//         <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">

//           <p>© 2025 CareerVidya.in | All Rights Reserved</p>

//         </div>

//       </div>

//       <TopOfferBanner />

//     </footer>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import TopOfferBanner from "../components/TopOfferBanner";
import api from "@/utlis/api";

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  /* Newsletter State */
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* Courses State */
  const [pgCourses, setPgCourses] = useState([]);
  const [ugCourses, setUgCourses] = useState([]);
  const [diplomaCourses, setDiplomaCourses] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Fetch Courses Logic (Unchanged) */
  useEffect(() => {
    const fetchFooterCourses = async () => {
      try {
        const res = await api.get("/api/v1/course");
        const allCourses = (res.data.courses || []).sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        setPgCourses(allCourses.filter((c) => 
          c.category === "PG" || c.level === "PG" || c.programType === "PG" || c.type === "PG"
        ));

        setUgCourses(allCourses.filter((c) => 
          c.category === "UG" || c.level === "UG" || c.programType === "UG" || c.type === "UG"
        ));

        setDiplomaCourses(allCourses.filter((c) => 
          c.category === "Diploma" || c.level === "Diploma" || c.type === "Certificate" || c.type === "Diploma"
        ));
      } catch (err) {
        console.error("Footer Course Error:", err);
      }
    };
    fetchFooterCourses();
  }, []);

  const handleSubscribe = async () => {
    if (!email) { setMessage("Please enter your email"); return; }
    setLoading(true);
    try {
      const res = await fetch("https://api.careervidya.in/api/v1/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.msg || "Subscribed successfully!");
      setEmail("");
    } catch (error) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return <footer className="bg-[#000d2d] min-h-[200px]" />;

  return (
    <footer className="bg-[#000d2d] text-white pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TOP ROW: Addresses & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Office Locations */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2 inline-block w-full">Head Office (Noida)</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                SF-27, 2nd Floor, Gaur City Center<br /> Greater Noida, UP 201318
              </p>
              <p className="text-gray-400 text-sm mt-2">📞 +91 9289712364</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2 inline-block w-full">Corporate Office</h3>
              <p className="text-gray-400 text-sm leading-relaxed">H-160, Sector 63, Noida - 201305</p>
              <p className="text-gray-400 text-sm mt-2">📧 Info@careervidya.in</p>
            </div>
          </div>

          {/* Quick Links / About */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2 inline-block w-full">Quick Links</h3>
            <ul className="space-y-3 mt-4 text-gray-400 text-sm">
              <li><Link href="/Aboutus" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/contactus" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/career" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="/Blog" className="hover:text-white transition">Latest Blogs</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2 inline-block w-full">Newsletter</h3>
            <p className="text-gray-400 text-sm mt-4 mb-6">Subscribe to our newsletter for updates</p>
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-[#001642] border border-gray-700 rounded-md py-4 px-4 text-white focus:outline-none focus:border-blue-500 placeholder:text-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full bg-white text-black font-bold py-4 rounded-full hover:bg-gray-200 transition text-md"
              >
                {loading ? "..." : "Subscribe Now"}
              </button>
              {message && <p className="text-[10px] text-center text-orange-400">{message}</p>}
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: Dynamic Courses (UG, PG, Diploma) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-800 pt-10 mb-10">
          {/* PG Column */}
          <div>
            <h4 className="text-white font-bold mb-4 text-md">PG Programs</h4>
            <ul className="space-y-2 text-sm text-gray-400 max-h-52 overflow-y-auto custom-scrollbar">
              {pgCourses.map((c) => (
                <li key={c._id}><Link href={`/course/${c.slug}`} className="hover:text-white">{c.name}</Link></li>
              ))}
            </ul>
          </div>
          {/* UG Column */}
          <div>
            <h4 className="text-white font-bold mb-4 text-md">UG Programs</h4>
            <ul className="space-y-2 text-sm text-gray-400 max-h-52 overflow-y-auto custom-scrollbar">
              {ugCourses.map((c) => (
                <li key={c._id}><Link href={`/course/${c.slug}`} className="hover:text-white">{c.name}</Link></li>
              ))}
            </ul>
          </div>
          {/* Diploma Column */}
          <div>
            <h4 className="text-white font-bold mb-4 text-md">Diploma & Certificates</h4>
            <ul className="space-y-2 text-sm text-gray-400 max-h-52 overflow-y-auto custom-scrollbar">
              {diplomaCourses.map((c) => (
                <li key={c._id}><Link href={`/course/${c.slug}`} className="hover:text-white">{c.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION: Disclaimer */}
        <div className="border-t border-gray-800 pt-10 text-center">
          <h4 className="text-[#c15304] font-bold mb-3 text-base">Disclaimer</h4>
          <p className="text-xs text-gray-500 max-w-3xl mx-auto leading-relaxed">
           
           Career Vidya Edu-Tech Pvt. Ltd. provides unbiased educational and career guidance for informational purposes only. 
              We do not guarantee admissions, placements, or job outcomes. Users should verify course, fee, and institution details 
             independently. Career Vidya is not liable for any loss or reliance on website content or third-party links.
           
           
          </p>
          <p className="mt-8 text-gray-600 text-[10px] tracking-widest uppercase">
            © 2025 CAREERVIDYA.IN | ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
      <TopOfferBanner />
    </footer>
  );
}
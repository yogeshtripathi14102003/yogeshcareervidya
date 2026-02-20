// "use client";
// import TopOfferBanner from "../components/TopOfferBanner";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";

// export default function Footer() {
//   const [mounted, setMounted] = useState(false);
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

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
//       console.error(error);
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
//         {/* ---------- TOP SECTION ---------- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-300 mb-10">
//           {/* Office 1 */}
//           <div>
//             <h3 className="text-lg font-semibold text-[#c15304] mb-2">
//               Head Office (Noida)
//             </h3>
//             <p className="text-sm leading-relaxed">
//               SF-27, 2nd Floor, Gaur City Center
//               <br /> Greater Noida, Uttar Pradesh 201318
//             </p>
          
//             <p className="mt-2 text-sm font-medium">📞  +91 9289712364</p>
//             <p className="mt-2 text-sm font-medium">
//               📧 Info@careervidya.in
//             </p>
//             <p className="mt-2 text-sm font-medium">
//               📧 Careervidya.edu@gmail.com
//             </p>
//           </div>

//           {/* Office 2 */}
//           <div>
//             <h3 className="text-lg font-semibold text-[#c15304] mb-2">
//               Corporate office (Noida)
//             </h3>
//             <p className="text-sm leading-relaxed">
//               H-160, Sector 63, H Block,
//               <br /> BSI Building, Ground Floor, Office No. 7
//               <br /> Noida, Uttar Pradesh - 201305
//             </p>
//             <p className="mt-2 text-sm font-medium">📞 +91 9289712364</p>
//               <p className="mt-2 text-sm font-medium">📞 +91 12018447695</p>
//             <p className="mt-2 text-sm font-medium">
//               📧 Info@careervidya.in
//             </p>
//             <p className="mt-2 text-sm font-medium">
//               📧 Careervidya.edu@gmail.com
//             </p>
//           </div>

//           {/* Newsletter */}
//           <div>
//             <h3 className="text-lg font-semibold text-[#c15304] mb-3">
//               Subscribe to Newsletter
//             </h3>
//             <div className="flex flex-col sm:flex-row items-center gap-3">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="w-full bg-white text-black rounded-md text-sm p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c15304]"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
//               />
//               <button
//                 onClick={handleSubscribe}
//                 className="w-full sm:w-auto bg-[#c15304]  text-white rounded-md px-4 py-2 text-sm transition"
//                 disabled={loading}
//               >
//                 {loading ? "..." : "Subscribe"}
//               </button>
//             </div>
//             {message && (
//               <p className="text-xs mt-2 text-gray-200">{message}</p>
//             )}
//           </div>
//         </div>

//         {/* ---------- MIDDLE SECTION ---------- */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-gray-700 pt-8 text-gray-300">
//           {/* Column 1 - ABOUT */}
//           <div>
//             <h4 className="text-white font-semibold mb-3 text-lg">About</h4>
//             <ul className="space-y-2 text-sm">
//               <li>
//                 <Link href="/Aboutus" className="hover:text-[#c15304]">
//                   About Us
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/contactus" className="hover:text-[#c15304]">
//                   Contact
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/career" className="hover:text-[#c15304]">
//                   Careers
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/blog" className="hover:text-[#c15304]">
//                   Blog
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Column 2 - Online MBA Programs */}
//           <div>
//             <h4 className="text-white font-semibold mb-3 text-lg">
//               Online MBA Programs
//             </h4>
//             <ul className="space-y-2 text-sm">
//               {[
//                 "Online MBA in Finance",
//                 "Online MBA in Business Analytics",
//                 "Online MBA in Healthcare Management",
//                 "Online MBA in HR",
//                 "Online MBA in Marketing",
//                 "Online MBA in IT",
//               ].map((item, i) => (
//                 <li key={i} className="hover:text-[#c15304] cursor-pointer">
//                   {item}
//                 </li>
//               ))}
//               <li className="text-[#c15304] flex items-center gap-1 cursor-pointer">
//                 View All <span className="text-white text-lg">+</span>
//               </li>
//             </ul>
//           </div>

//           {/* Column 3 - Online UG Courses */}
//           <div>
//             <h4 className="text-white font-semibold mb-3 text-lg">
//               Online UG Courses
//             </h4>
//             <ul className="space-y-2 text-sm">
//               {[
//                 "Online BBA",
//                 "Online BCA",
//                 "Online B.Com",
//                 "Online BA",
//                 "Online B.Sc in Data Science",
//               ].map((item, i) => (
//                 <li key={i} className="hover:text-[#c15304] cursor-pointer">
//                   {item}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Column 4 - Certificates */}
//           <div>
//             <h4 className="text-white font-semibold mb-3 text-lg">
//               PG Diploma & Certificates
//             </h4>
//             <ul className="space-y-2 text-sm">
//               {[
//                 "PG Diploma in Applied Statistics",
//                 "Certificate in Data Analytics",
//                 "Certificate in UI/UX Design",
//               ].map((item, i) => (
//                 <li key={i} className="hover:text-[#c15304] cursor-pointer">
//                   {item}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* ---------- DISCLAIMER ---------- */}
//         <div className="border-t border-gray-700 mt-10 pt-6 text-gray-300 text-sm leading-relaxed text-center max-w-3xl mx-auto">
//           <h4 className="text-[#c15304] font-semibold mb-3 text-base md:text-lg">
//             Disclaimer
//           </h4>
//           <p className="text-gray-300 max-w-2xl mx-auto">
//             Career Vidya Edu-Tech Pvt. Ltd. provides unbiased educational and career guidance for informational purposes only. 
//             We do not guarantee admissions, placements, or job outcomes. Users should verify course, fee, and institution details 
//             independently. Career Vidya is not liable for any loss or reliance on website content or third-party links.
//           </p>
//         </div>

//         {/* ---------- BOTTOM ---------- */}
//         <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col items-center justify-center gap-3 text-center text-sm text-gray-400">
//           <div className="flex flex-wrap justify-center gap-4 mb-2">
//             <Link href="/Terms&Conditions">Terms & Conditions</Link>
//             <span>|</span>
//             <Link href="/PrivacyPolicy">Privacy Policy</Link>
//           </div>
//           <p>© 2025 CareerVidya.in | All Rights Reserved</p>

//           <div className="flex justify-center gap-4 mt-3">
//             {[
//               { src: "/icons/y1.svg", alt: "X", link: "https://x.com/CareerVidya" },
//               { src: "/icons/y2.svg", alt: "Instagram", link: "https://www.instagram.com/career_vidya/" },
//               { src: "/icons/y3.svg", alt: "Facebook", link: "https://www.facebook.com/Career-Vidya" },
//               { src: "/icons/linked.svg", alt: "LinkedIn", link: "https://www.linkedin.com/company/career-vidya/" },
//             ].map((icon, i) => (
//               <a key={i} href={icon.link} target="_blank" rel="noopener noreferrer">
//                 <img
//                   src={icon.src}
//                   alt={icon.alt}
//                   className="h-5 w-5 hover:scale-110 transition-transform"
//                 />
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>
//           <TopOfferBanner />
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

  /* ================= NEWSLETTER ================= */
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= COURSES ================= */
  const [pgCourses, setPgCourses] = useState([]);
  const [ugCourses, setUgCourses] = useState([]);
  const [diplomaCourses, setDiplomaCourses] = useState([]);

  /* ================= MOUNT ================= */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= FETCH + FILTER ================= */
  useEffect(() => {
    const fetchFooterCourses = async () => {
      try {
        // ✅ Single API Call
        const res = await api.get("/api/v1/course");

        const allCourses = res.data.courses || [];

        /* ✅ Frontend Filtering (Safe for any backend format) */

        const pg = allCourses.filter(
          (c) =>
            c.category === "PG" ||
            c.level === "PG" ||
            c.programType === "PG" ||
            c.type === "PG"
        );

        const ug = allCourses.filter(
          (c) =>
            c.category === "UG" ||
            c.level === "UG" ||
            c.programType === "UG" ||
            c.type === "UG"
        );

        const diploma = allCourses.filter(
          (c) =>
            c.category === "Diploma" ||
            c.level === "Diploma" ||
            c.programType === "Diploma" ||
            c.type === "Certificate" ||
            c.type === "Diploma"
        );

        setPgCourses(pg);
        setUgCourses(ug);
        setDiplomaCourses(diploma);

      } catch (err) {
        console.error("Footer Course Error:", err);
      }
    };

    fetchFooterCourses();
  }, []);

  /* ================= NEWSLETTER ================= */
  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "https://api.careervidya.in/api/v1/subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      setMessage(data.msg || "Subscribed successfully!");
      setEmail("");

    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Try again.");

    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <footer className="bg-[#0f172a] min-h-[200px]" />;
  }

  return (
    <footer className="bg-[#0f172a] text-white font-[Inter]">

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ================= TOP ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-300 mb-10">

          {/* Head Office */}
          <div>
            <h3 className="text-lg font-semibold text-[#c15304] mb-2">
              Head Office (Noida)
            </h3>

            <p className="text-sm leading-relaxed">
              SF-27, 2nd Floor, Gaur City Center
              <br /> Greater Noida, Uttar Pradesh 201318
            </p>

            <p className="mt-2 text-sm">📞 +91 9289712364</p>
            <p className="mt-2 text-sm">📧 Info@careervidya.in</p>
            <p className="mt-2 text-sm">📧 Careervidya.edu@gmail.com</p>
          </div>

          {/* Corporate Office */}
          <div>
            <h3 className="text-lg font-semibold text-[#c15304] mb-2">
              Corporate Office (Noida)
            </h3>

            <p className="text-sm leading-relaxed">
              H-160, Sector 63, H Block,
              <br /> BSI Building, Ground Floor, Office No. 7
              <br /> Noida, Uttar Pradesh - 201305
            </p>

            <p className="mt-2 text-sm">📞 +91 9289712364</p>
            <p className="mt-2 text-sm">📞 +91 1201847695</p>
            <p className="mt-2 text-sm">📧 Info@careervidya.in</p>
            <p className="mt-2 text-sm">📧 Careervidya.edu@gmail.com</p>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-[#c15304] mb-3">
              Subscribe to Newsletter
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white text-black rounded-md text-sm p-2 border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              />

              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="bg-[#c15304] px-4 py-2 rounded-md text-sm"
              >
                {loading ? "..." : "Subscribe"}
              </button>

            </div>

            {message && (
              <p className="text-xs mt-2 text-gray-200">{message}</p>
            )}
          </div>

        </div>

        {/* ================= MIDDLE ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-gray-700 pt-8 text-gray-300">

          {/* About */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-lg">About</h4>

            <ul className="space-y-2 text-sm">
              <li><Link href="/Aboutus">About Us</Link></li>
              <li><Link href="/contactus">Contact</Link></li>
              <li><Link href="/career">Careers</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* PG */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-lg">
              PG Programs
            </h4>

            <ul className="space-y-2 text-sm">

              {pgCourses.slice(0, 6).map((course) => (
                <li key={course._id}>
                  <Link
                    href={`/course/${course.slug}`}
                    className="hover:text-[#c15304]"
                  >
                    {course.name}
                  </Link>
                </li>
              ))}

              <li className="text-[#c15304]">
                <Link href="/courses?category=PG">
                  View All +
                </Link>
              </li>

            </ul>
          </div>

          {/* UG */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-lg">
              UG Programs
            </h4>

            <ul className="space-y-2 text-sm">

              {ugCourses.slice(0, 5).map((course) => (
                <li key={course._id}>
                  <Link
                    href={`/course/${course.slug}`}
                    className="hover:text-[#c15304]"
                  >
                    {course.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          {/* Diploma */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-lg">
              Diploma & Certificates
            </h4>

            <ul className="space-y-2 text-sm">

              {diplomaCourses.slice(0, 5).map((course) => (
                <li key={course._id}>
                  <Link
                    href={`/course/${course.slug}`}
                    className="hover:text-[#c15304]"
                  >
                    {course.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

        </div>

        {/* ================= DISCLAIMER ================= */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-300 max-w-3xl mx-auto">

          <h4 className="text-[#c15304] font-semibold mb-3">
            Disclaimer
          </h4>

          <p>
            Career Vidya Edu-Tech Pvt. Ltd. provides unbiased educational
            guidance. Users should verify details independently.
          </p>

        </div>

        {/* ================= BOTTOM ================= */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">

          <div className="flex justify-center gap-4 mb-2">
            <Link href="/Terms&Conditions">Terms & Conditions</Link>
            <span>|</span>
            <Link href="/PrivacyPolicy">Privacy Policy</Link>
          </div>

          <p>© 2025 CareerVidya.in | All Rights Reserved</p>

        </div>

      </div>

      <TopOfferBanner />

    </footer>
  );
}
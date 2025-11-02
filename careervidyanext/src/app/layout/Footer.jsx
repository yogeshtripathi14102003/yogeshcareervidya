// "use client";
// import React, { useState } from "react";
// import Link from "next/link";

// export default function Footer() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubscribe = async () => {
//     if (!email) {
//       setMessage("Please enter your email");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await fetch("http://localhost:8080/api/admin/newsletter/subscribe", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();
//       setMessage(data.msg);
//       setEmail("");
//     } catch (error) {
//       console.error(error);
//       setMessage("Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSubscribe();
//   };

//   return (
//     <footer className="bg-[#0f172a] text-white py-12 px-6 md:px-12 font-[Inter]">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
//         {/* ========== COLUMN 1: ABOUT + NEWSLETTER ========== */}
//         <div>
//           <h4 className="text-[#FFD700] font-semibold text-lg mb-4">ABOUT</h4>
//           <ul className="space-y-2 text-sm text-gray-300">
//             <li>Contact Us</li>
//             <li>About Us</li>
//             <li>Careers</li>
//             <li>Career Vidya Stories</li>
//             <li>Press</li>
//             <li>Corporate Information</li>
//           </ul>

//           {/* Newsletter Section */}
//           <div className="mt-6">
//             <h5 className="font-semibold mb-2 text-[#FFD700] text-sm">
//               Subscribe to Newsletter
//             </h5>
//             <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="w-full sm:flex-1 bg-white text-black rounded-md text-sm p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 onKeyDown={handleKeyPress}
//               />
//               <button
//                 onClick={handleSubscribe}
//                 className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm transition"
//                 disabled={loading}
//               >
//                 {loading ? "..." : "Subscribe"}
//               </button>
//             </div>
//             {message && (
//               <p className="text-xs mt-2 text-gray-200 text-center sm:text-left">
//                 {message}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* ========== COLUMN 2: ONLINE & DISTANCE MBA ========== */}
//         <div>
//           <h4 className="text-[#FFD700] font-semibold text-lg mb-4 border-b border-[#FFD700] inline-block pb-1">
//             Online & Distance MBA
//           </h4>
//           <ul className="space-y-2 text-sm text-gray-300">
//             <li>Finance</li>
//             <li>Business Analytics</li>
//             <li>Healthcare Management</li>
//             <li>Hospital Management</li>
//             <li>HR</li>
//             <li>Operations</li>
//             <li>Marketing</li>
//             <li>Information Technology</li>
//             <li>Digital Marketing</li>
//             <li>Pharmaceutical Management</li>
//             <li>Logistics And Supply Chain (Dual)</li>
//             <li>Data Science</li>
//             <li>Project Management</li>
//             <li>Entrepreneurship and Leadership (Dual)</li>
//             <li>General</li>
//             <li className="text-blue-400 cursor-pointer hover:underline">View All +</li>
//           </ul>
//         </div>

//         {/* ========== COLUMN 3: ONLINE & DISTANCE UG COURSES ========== */}
//         <div>
//           <h4 className="text-[#FFD700] font-semibold text-lg mb-4 border-b border-[#FFD700] inline-block pb-1">
//             Online & Distance UG Courses
//           </h4>
//           <ul className="space-y-2 text-sm text-gray-300">
//             <li>1 Year MBA Online</li>
//             <li>IIM Online Courses</li>
//             <li>IIIT Online Courses</li>
//             <li>Data Science & Analytics</li>
//             <li>Executive M.Tech for Working Professionals</li>
//             <li>AI and Machine Learning</li>
//             <li>Generative AI</li>
//             <li>UI UX Certificate Program</li>
//             <li>Leadership & Management</li>
//             <li>Finance</li>
//             <li>Marketing</li>
//             <li>Human Resource (HR)</li>
//             <li>Healthcare</li>
//             <li>Operations</li>
//             <li>Business Analytics</li>
//             <li>Software & Technology</li>
//             <li>PG Diploma Applied Statistics</li>
//             <li>IIT Courses Online</li>
//             <li>Blockchain</li>
//             <li>Cloud Computing</li>
//             <li>PG Program in Technology Management</li>
//             <li>Big Data Engineering</li>
//             <li>DevOps</li>
//             <li>Quantum Computing</li>
//           </ul>
//         </div>

//         {/* ========== COLUMN 4: ONLINE & DISTANCE BEST COLLEGES ========== */}
//         <div>
//           <h4 className="text-[#FFD700] font-semibold text-lg mb-4 border-b border-[#FFD700] inline-block pb-1">
//             Online & Distance Best Colleges for
//           </h4>
//           <ul className="space-y-2 text-sm text-gray-300">
//             <li>Best Colleges for Online MBA</li>
//             <li>Best Colleges for 1 Year MBA Online</li>
//             <li>Best Colleges for Distance MBA</li>
//             <li>Best Colleges for Executive MBA</li>
//             <li>Best Colleges for Online Global MBA</li>
//             <li>Best Colleges for Online MCA</li>
//             <li>Best Colleges for M.Tech</li>
//             <li>Best Colleges for Online M.Sc</li>
//             <li>Best Colleges for Online MA</li>
//             <li>Best Colleges for Online M.Com</li>
//             <li>Best Colleges for Online Master of Design</li>
//             <li>Best Colleges for Dual MBA Online</li>
//             <li>Best Colleges for Online MBA after Diploma</li>
//             <li>Best Colleges for Online M.Ed</li>
//             <li>Best Colleges for Online Global MCA</li>
//             <li>Best Colleges for Online PGDM</li>
//             <li>Best Colleges for Online PG Diploma</li>
//             <li>Best Colleges for Distance MCA</li>
//             <li>Best Colleges for Distance M.Com</li>
//             <li>Best Colleges for Distance MBA</li>
//           </ul>
//         </div>
//       </div>

//       {/* ========== BOTTOM SECTION ========== */}
//       <div className="border-t border-gray-600 mt-12 pt-6 text-center text-sm text-gray-300">
//         <div className="flex flex-wrap justify-center gap-4 mb-3">
//           <Link href="/vendor_dashboard/landing">👜 Become a Seller</Link>
//           <span>📢 Advertise</span>
//           <span>🎁 Gift Cards</span>
//           <span>❓ Help Center</span>
//         </div>

//         <div>© 2025 CareerVidya.in</div>

//         <div className="flex justify-center gap-4 mt-4 flex-wrap">
//           <img
//             src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
//             alt="Visa"
//             className="h-6 object-contain"
//           />
//           <img
//             src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
//             alt="Mastercard"
//             className="h-6 object-contain"
//           />
//           <img
//             src="https://companieslogo.com/img/orig/RUPAY.NS_BIG-2b1c80ff.png?t=1648933314"
//             alt="Rupay"
//             className="h-6 object-contain"
//           />
//           <img
//             src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
//             alt="PayPal"
//             className="h-6 object-contain"
//           />
//         </div>
//       </div>
//     </footer>
//   );
// }


"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8080/api/admin/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.msg);
      setEmail("");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#0f172a] text-white font-[Inter]">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ---------- TOP SECTION ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-300 mb-10">
          {/* Office 1 */}
          <div>
            <h3 className="text-lg font-semibold text-[#FFD700] mb-2">🇮🇳 India (Noida) HQ</h3>
            <p className="text-sm leading-relaxed">
              H-160, Sector 63, H Block,
              <br /> BSI Building, Ground Floor, Office No. 7
              <br /> Noida, Uttar Pradesh - 201305
            </p>
            <p className="mt-2 text-sm font-medium">📞 +91 9289712364</p>
          </div>

          {/* Office 2 */}
          <div>
            <h3 className="text-lg font-semibold text-[#FFD700] mb-2">🇮🇳 India (Noida)</h3>
            <p className="text-sm leading-relaxed">
              SF-27, 2nd Floor, Gaur City Center
              <br /> Greater Noida, Uttar Pradesh 201318
            </p>
            <p className="mt-2 text-sm font-medium">📞 +91 12018447695</p>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-[#FFD700] mb-3">Subscribe to Newsletter</h3>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white text-black rounded-md text-sm p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              />
              <button
                onClick={handleSubscribe}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm transition"
                disabled={loading}
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </div>
            {message && <p className="text-xs mt-2 text-gray-200">{message}</p>}
          </div>
        </div>

        {/* ---------- MIDDLE SECTION : UPDATED ORDER ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-gray-700 pt-8 text-gray-300">
          {/* Column 1 - ABOUT */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-lg">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-[#FFD700]">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#FFD700]">Contact</Link></li>
              <li><Link href="#" className="hover:text-[#FFD700]">Careers</Link></li>
              <li><Link href="#" className="hover:text-[#FFD700]">Blog</Link></li>
              <li><Link href="/PrivacyPolicy" className="hover:text-[#FFD700]">Privacy Policy</Link></li>
              <li><Link href="/Terms&Conditions" className="hover:text-[#FFD700]">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-[#FFD700]">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Column 2 - Online MBA Programs */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-lg">Online MBA Programs</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Online MBA in Finance",
                "Online MBA in Business Analytics",
                "Online MBA in Healthcare Management",
                "Online MBA in Hospital Management",
                "Online MBA in HR",
                "Online MBA in Operations",
                "Online MBA in Marketing",
                "Online MBA in Information Technology",
                "Online MBA in Digital Marketing",
                "Online MBA in Pharmaceutical Management",
                "Online MBA in Logistics and Supply Chain (Dual)",
                "Online MBA in Data Science",
                "Online MBA in Project Management",
                "Online MBA in Entrepreneurship and Leadership (Dual)",
                "Online General MBA",
              ].map((item, i) => (
                <li key={i} className="hover:text-[#FFD700] cursor-pointer">{item}</li>
              ))}
              <li className="text-[#FFD700] flex items-center gap-1 cursor-pointer">
                View All <span className="text-white text-lg">+</span>
              </li>
            </ul>
          </div>

          {/* Column 3 - Online UG Courses */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-lg">Online UG Courses</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Online BBA",
                "Online BCA",
                "Online B.Com",
                "Online BA",
                "Online B.Sc in Data Science",
                "Online B.Sc in AI and ML",
                "Online B.Sc in Cloud Computing",
                "Online B.Sc in Cyber Security",
                "Online B.Sc in IT",
                "Online B.Sc in Blockchain",
              ].map((item, i) => (
                <li key={i} className="hover:text-[#FFD700] cursor-pointer">{item}</li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Online Certification & PG Diploma */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-lg">Online PG Diploma & Certificates</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Online PG Diploma in Applied Statistics",
                "Online Certificate in Data Analytics",
                "Online Certificate in UI/UX Design",
                "Online Certificate in Generative AI",
                "Online Certificate in Technology Management",
              ].map((item, i) => (
                <li key={i} className="hover:text-[#FFD700] cursor-pointer">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- BOTTOM SECTION ---------- */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col items-center justify-center gap-3 text-center text-sm text-gray-400">
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            <Link href="/Terms&Conditions">Terms & Conditions</Link>
            <span>|</span>
            <Link href="/PrivacyPolicy">Privacy Policy</Link>
            <span>|</span>
            <Link href="#">Sitemap</Link>
          </div>
          <p>© 2025 CareerVidya.in | All Rights Reserved</p>
          <div className="flex justify-center gap-4 mt-3">
  {/* x */}
  <a
    href="https://x.com/CareerVidya"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src="/icons/y1.svg" alt="X" className="h-5 w-5 hover:scale-110 transition-transform" />
  </a>

  {/* insta */}
  <a
    href="https://www.instagram.com/career_vidya/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src="/icons/y2.svg" alt="insta" className="h-5 w-5 hover:scale-110 transition-transform" />
  </a>

  {/* fb */}
  <a
    href="https://www.facebook.com/Career-Vidya"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src="/icons/y3.svg" alt="fb" className="h-5 w-5 hover:scale-110 transition-transform" />
  </a>

  {/* linkedin / X */}
  <a
    href="https://www.linkedin.com/company/career-vidya/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src="/icons/linked.svg" alt="linkedin" className="h-5 w-5 hover:scale-110 transition-transform" />
  </a>

  {/* Instagram */}
  {/* <a
    href="https://www.instagram.com/yourpage"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src="/icons/instagram.svg" alt="Instagram" className="h-5 w-5 hover:scale-110 transition-transform" />
  </a> */}
</div>

        </div>
      </div>
    </footer>
  );
}

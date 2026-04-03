

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import TopOfferBanner from "../components/TopOfferBanner";
import api from "@/utlis/api";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Mobile check state

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
    
    // ✅ Check for mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* Fetch Courses Logic */
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
              <p className="text-gray-300 text-sm leading-relaxed">
                SF-27, 2nd Floor, Gaur City Center<br /> Greater Noida, UP 201318
              </p>
              <p className="text-gray-300 text-sm mt-2">📞 +91 9289712364</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2 inline-block w-full">Corporate Office</h3>
              <p className="text-gray-300 text-sm leading-relaxed">H-160, Sector 63, Noida - 201305</p>
              <p className="text-gray-300 text-sm mt-2">📧 Info@careervidya.in</p>
            </div>
          </div>

          {/* Quick Links / About */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2 inline-block w-full">Quick Links</h3>
            <ul className="space-y-3 mt-4 text-gray-300 text-sm">
              <li><Link href="/Aboutus" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/contactus" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/career" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="/Blog" className="hover:text-white transition">Latest Blogs</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2 inline-block w-full">Newsletter</h3>
            <p className="text-gray-300 text-sm mt-4 mb-6">Subscribe to our newsletter for updates</p>
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

        {/* MIDDLE ROW: Dynamic Courses */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-800 pt-10 mb-10">
          {/* PG Column */}
          <div>
            <h4 className="text-white font-bold mb-4 text-md">PG Programs</h4>
            <ul className="space-y-2 text-sm text-gray-300 max-h-52 overflow-y-auto custom-scrollbar">
              {pgCourses.map((c) => (
                <li key={c._id}><Link href={`/course/${c.slug}`} className="hover:text-white">{c.name}</Link></li>
              ))}
            </ul>
          </div>
          {/* UG Column */}
          <div>
            <h4 className="text-white font-bold mb-4 text-md">UG Programs</h4>
            <ul className="space-y-2 text-sm text-gray-300 max-h-52 overflow-y-auto custom-scrollbar">
              {ugCourses.map((c) => (
                <li key={c._id}><Link href={`/course/${c.slug}`} className="hover:text-white">{c.name}</Link></li>
              ))}
            </ul>
          </div>
          {/* Diploma Column */}
          <div>
            <h4 className="text-white font-bold mb-4 text-md">Diploma & Certificates</h4>
            <ul className="space-y-2 text-sm text-gray-300 max-h-52 overflow-y-auto custom-scrollbar">
              {diplomaCourses.map((c) => (
                <li key={c._id}><Link href={`/course/${c.slug}`} className="hover:text-white">{c.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION: Disclaimer */}
        <div className="border-t border-gray-800 pt-10 text-center">
          <h4 className="text-[#c15304] font-bold mb-3 text-base">Disclaimer</h4>
          <p className="text-xs text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Career Vidya Edu-Tech Pvt. Ltd. provides unbiased educational and career guidance for informational purposes only. 
            We do not guarantee admissions, placements, or job outcomes. Users should verify course, fee, and institution details 
            independently. Career Vidya is not liable for any loss or reliance on website content or third-party links.
          </p>
          <p className="mt-8 text-gray-200 text-[10px] tracking-widest uppercase">
            © {new Date().getFullYear()} CAREERVIDYA.IN | ALL RIGHTS RESERVED
          </p>
        </div>
      </div>

      {/* ✅ Yahan change hai: Agar mobile hai toh banner render hi nahi hoga */}
      {!isMobile && <TopOfferBanner />}
    </footer>
    
  );
}
// src/app/placement/page.jsx
// Server Component — logos fetched on server, no NEXT_PUBLIC URL, no useEffect

import Image from "next/image";
import Header from "@/app/layout/Header.jsx";
import Studentimageslider from "@/app/components/Studentimageslider.jsx";
import TestimonialsSlider from "@/app/components/TestimonialsSlider.jsx";
import Getintuch from "@/app/components/getintuch.jsx"
;import { serverFetch } from "@/utlis/serverFetch";

// ─── Static Data ──────────────────────────────────────────────────────────────

const stats = [
  { label: "Highest Package", val: "12 LPA" },
  { label: "Avg. Package",    val: "5.5 LPA" },
  { label: "Hiring Partners", val: "200+" },
  { label: "Placement Rate",  val: "95%" },
];

const careerMapPoints = [
  "Regular updates",
  "50+ job posting each month",
  "Customized plan according to your interest",
  "Interview Tips",
  "Networking sessions",
];

const services = [
  { title: "Resume Building", desc: "Hum aapka resume ATS-friendly aur professional banate hain." },
  { title: "Mock Interviews", desc: "Industry experts ke saath real interview ki practice." },
  { title: "Soft Skills",     desc: "Communication aur personality development workshops." },
  { title: "Job Referrals",   desc: "Direct interview opportunities hamare hiring network se." },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `/${path}`;
};

// ─── Server fetch logos ───────────────────────────────────────────────────────

async function getLogos() {
  try {
    const res = await serverFetch("/api/v1/ourstudent", {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];

    const json = await res.json();
    const data = json?.data || json || [];

    const seen = new Set();
    const logos = [];
    data.forEach((student) => {
      if (student.companyLogo && !seen.has(student.companyLogo)) {
        logos.push({ logo: student.companyLogo, company: student.company });
        seen.add(student.companyLogo);
      }
    });
    return logos;
  } catch (err) {
    console.error("PlacementPage: logo fetch failed →", err);
    return [];
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PlacementPage() {
  const logos = await getLogos();

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen font-sans">

        {/* ── Hero ── */}
        <header className="bg-blue-900 py-20 px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              CareerVidya  Placement Support<span className="text-yellow-400"></span>
            </h1>
            <p className="text-xl text-blue-100 mb-8">
             Empowering you to become industry-ready and securing your dream career
            </p>
            {/* <button className="bg-[#c15304] text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-all shadow-lg">
              Get Started
            </button> */}
          </div>
        </header>

        {/* ── Stats ── */}
        <section className="max-w-6xl mx-auto px-4 -mt-10 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-600 text-center">
                <h2 className="text-3xl font-bold text-blue-600">{item.val}</h2>
                <p className="text-gray-600 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Career Map ── */}
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <div className="bg-[#D9E3F0] rounded-2xl p-8 md:p-12 shadow-sm border border-blue-100">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Career Map Laid By  Professionals <span className="text-blue-600"></span>
              </h2>
              <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                Our team of experts have step-by-step laid out plans for learners to boost
                their careers and reach their full potential.
              </p>
            </div>
            <ul className="space-y-4">
              {careerMapPoints.map((point, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0" />
                  <span className="text-gray-800 text-lg md:text-xl font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Alternating Features ── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 space-y-24">

            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
              <div className="flex-1 order-2 md:order-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Networking sessions with  Industry Experts <span className="text-blue-600"></span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  What better than a strong network? Get to know decision makers from top brands
                  and grow your network. Enhance your knowledge with bright minds of your industry.
                </p>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="relative w-full h-44 md:h-60">
                  <Image src="/images/freebu.png" alt="Networking" fill className="object-contain border border-gray-300 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
              <div className="flex-1">
                <div className="relative w-full h-44 md:h-60">
                  <Image src="/images/networking.jpg" alt="Live Projects" fill className="object-contain border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Live Projects & Extra-curricular sessions <span className="text-blue-600"></span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Participate in live projects and get industry experience relevant to your career.
                  Work on real-world problems that'll add value to your resume and will assist you
                  to grab the right opportunities.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
              <div className="flex-1 order-2 md:order-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Career Path  Guidance <span className="text-blue-600"></span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Get guidance from experts with years of experience and knowledge in the same field.
                  Reap benefits such as personalized growth maps, guidance from alumni and experts,
                  and access to opportunities.
                </p>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="relative w-full h-64 md:h-80">
                  <Image src="/images/i5.jpeg" alt="Career Path Guidance" fill className="object-contain" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Logo Slider ── */}
        {logos.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 mb-4">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-10 md:p-16 shadow-5xl border border-white relative overflow-hidden">

              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-200/20 rounded-full blur-xl" />

              <div className="relative z-10">
                <div className="mb-4 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Our Hiring  Partner's{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-extrabold">
                     
                    </span>
                  </h2>
                  <div className="w-20 h-1.5 bg-yellow-400 mt-3 rounded-full mx-auto md:mx-0" />
                </div>

                <div className="relative flex overflow-hidden">
                  <div className="flex placement-logo-scroll gap-12 md:gap-20 items-center py-4">
                    {[...logos, ...logos, ...logos].map((logo, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-36 md:w-44 flex items-center justify-center p-4 bg-white/60 border border-white hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:scale-110 rounded-lg"
                      >
                        <Image
                          src={getFullUrl(logo.logo)}
                          alt={logo.company || "Company"}
                          width={160}
                          height={80}
                          className="object-contain max-h-12 w-auto filter grayscale hover:grayscale-0 transition-all duration-300"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Services ── */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Career Vidya?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div key={index} className="flex gap-5 p-6 border border-gray-100 rounded-2xl bg-gray-50">
                  <div className="flex-shrink-0 text-3xl text-green-500 bg-white w-12 h-12 flex items-center justify-center rounded-full shadow-sm">
                    ✔
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{service.title}</h3>
                    <p className="text-gray-600">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials & Student Slider ── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            {/* <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Hear From Our Students</h2> */}
            <TestimonialsSlider />
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Placement Highlights</h2>
              <Studentimageslider />
            </div>
          </div>
        </section>

        <Getintuch />

        {/* ── Footer CTA ── */}
     <footer className="bg-[#0a192f] text-white pt-16 pb-8">
  <div className="max-w-7xl mx-auto px-4">
    
    {/* Main Footer Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
      
      {/* Column 1: Brand Info */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">
          Career<span className="text-blue-500">Vidya</span>
        </h2>
        <p className="text-gray-400 leading-relaxed">
At Career Vidya, we transform you into an industry-ready professional. Join our dedicated placement support program and secure your dream career today        </p>
        <div className="flex gap-4">
          {/* Social Icons Placeholder */}
          {/* <a href="#" className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all">
            <span className="sr-only">LinkedIn</span>
            <i className="fab fa-linkedin-in"></i> 
          </a>
          <a href="#" className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all">
            <i className="fab fa-facebook-f"></i>
          </a> */}
        </div>
      </div>

      {/* Column 2: Quick Links */}
      <div>
        <h3 className="text-lg font-bold mb-6 border-b-2 border-blue-600 w-fit pb-1">Quick Links</h3>
        <ul className="space-y-4 text-gray-400">
          <li><a href="/" className="hover:text-blue-400 transition-colors">Home</a></li>
          <li><a href="/explore" className="hover:text-blue-400 transition-colors">All Courses</a></li>
          <li><a href="/placement" className="hover:text-blue-400 transition-colors">Placement Support</a></li>
          <li><a href="/Aboutus" className="hover:text-blue-400 transition-colors">About Us</a></li>
        </ul>
      </div>

      {/* Column 3: Support */}
      <div>
        <h3 className="text-lg font-bold mb-6 border-b-2 border-blue-600 w-fit pb-1">Support</h3>
        <ul className="space-y-4 text-gray-400">
          <li><a href="#" className="hover:text-blue-400 transition-colors">Success Stories</a></li>
          <li><a href="/PrivacyPolicy" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
          <li><a href="/Terms&Conditions" className="hover:text-blue-400 transition-colors">Terms & Conditions</a></li>
          <li><a href="/contactus" className="hover:text-blue-400 transition-colors">Contact Placement Cell</a></li>
        </ul>
      </div>

      {/* Column 4: Contact Info */}
      <div>
        <h3 className="text-lg font-bold mb-6 border-b-2 border-blue-600 w-fit pb-1">Contact Us</h3>
        <ul className="space-y-4 text-gray-400">
          <li className="flex items-start gap-3">
            <span className="text-blue-500">📍</span>
            <span>H-160, Sector 63, Noida - 201305</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-blue-500">📧</span>
            <a href="mailto:info@careervidya.in" className="hover:text-blue-400">info@careervidya.in</a>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-blue-500">📞</span>
            <span> +91 9289712364</span>
          </li>
        </ul>
      </div>

    </div>

    {/* Bottom Bar */}
  {/* Bottom Bar with Auto-Updating Year */}
<div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
  <p>
    © {new Date().getFullYear()} <span className="font-semibold text-gray-400">CareerVidya</span>. All rights reserved.
  </p>
  
  <div className="flex items-center gap-2">
    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
    <p>System Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
  </div>
  
  <div className="flex gap-6">
    <p>Made with ❤️ Careervidya Team </p>
  </div>
</div>
  </div>
</footer>

      </div>

      {/* ── Animation ── */}
      <style>{`
        @keyframes placement-logo-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .placement-logo-scroll {
          width: max-content;
          animation: placement-logo-scroll 35s linear infinite;
        }
      `}</style>
    </>
  );
}
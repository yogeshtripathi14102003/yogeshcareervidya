
// "use client";

// import { useState, useRef, useEffect, useCallback } from "react";
// import { Star, MessageSquare, ChevronRight } from "lucide-react";
// import Image from "next/image";

// // Layout
// import Header from "@/app/layout/Header";
// import Footer from "@/app/layout/Footer.jsx";

// // Popups
// import Applictionpopup from "@/app/university/Applictionpopup";
// import TalkToUniversity from "@/app/university/TalkToUniversity.jsx";
// import DiscountPopup from "@/app/components/DiscountPopup.jsx";
// import ReviewRatingstatic from "@/app/components/ReviewRatingstatic.jsx";

// // =====================================================
// // SECTIONS (Existing)
// // =====================================================
// import UniversityCertificate from "@/app/university/UniversityCertificate.jsx";
// import UniversityHighlights from "@/app/university/UniversityHighlights.jsx";
// import Approvel from "@/app/university/Approvel.jsx";
// import FeesStructureSection from "@/app/university/Feesstracture.jsx";
// import Eligibility from "@/app/university/Eligibility.jsx";
// import FactsSection from "@/app/university/FactsSection.jsx";
// import AdmissionProcess from "@/app/university/AdmissionProcess.jsx";
// import FaqSection from "@/app/university/FaqSection.jsx";

// // =====================================================
// // SECTIONS (✅ NEW - Backend ke naye sections)
// // =====================================================
// import CareerVidyaBenefits from "@/app/university/CareerBenefitsSection.jsx";
// import EmiOptions from "@/app/university/EmiOptionsSection.jsx";
// import LmsSection from "@/app/university/LmsSection.jsx";
// import ExamPatternSection from "@/app/university/ExamPatternSection.jsx";

// // Utils
// import { cleanHtml } from "@/utlis/cleanHtml.js";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
// const SITE_URL = "https://careervidya.in";

// const getImagePath = (path) => {
//     if (!path) return "/fallback-logo.png";
//     if (path.startsWith("http")) return path;
//     if (!BASE_URL) return "/fallback-logo.png";
//     return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
// };

// // Strip HTML tags (for schema text)
// const stripHtml = (html) => {
//     if (!html) return "";
//     return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
// };

// // ✅ Safe numeric price extract (for schema)
// const extractNumericPrice = (feesString) => {
//     if (!feesString) return null;
//     const cleaned = String(feesString).replace(/[^0-9]/g, "");
//     if (!cleaned) return null;
//     // Limit to reasonable length to avoid overflow
//     const price = cleaned.substring(0, 7);
//     return price || null;
// };

// // =====================================================
// // OFFSET SETTINGS
// // =====================================================
// const HEADER_HEIGHT = 80;
// const TABS_HEIGHT = 60;
// const SCROLL_OFFSET = HEADER_HEIGHT + TABS_HEIGHT + 20;

// export default function UniversityDetail({ initialData }) {
//     const [data] = useState(initialData);
//     const [popupOpen, setPopupOpen] = useState(false);
//     const [popupType, setPopupType] = useState("apply");
//     const [activeTab, setActiveTab] = useState("Overview");

//     // ============ REFS ============
//     const overviewRef = useRef(null);
//     const certificateRef = useRef(null);
//     const coursesRef = useRef(null);
//     const highlightRef = useRef(null);
//     const careerBenefitsRef = useRef(null);
//     const approvalRef = useRef(null);
//     const feesRef = useRef(null);
//     const emiRef = useRef(null);
//     const eligibilityRef = useRef(null);
//     const lmsRef = useRef(null);
//     const examPatternRef = useRef(null);
//     const factsRef = useRef(null);
//     const admissionRef = useRef(null);
//     const faqRef = useRef(null);

//     // ============ TABS ============
//     const tabs = [
//         { id: "Overview", slug: "overview", ref: overviewRef },
//         { id: "Certificate", slug: "certificate", ref: certificateRef },
//         { id: "Courses", slug: "courses", ref: coursesRef },
//         { id: "Key Highlight", slug: "key-highlight", ref: highlightRef },
//         { id: "Career Benefits", slug: "career-benefits", ref: careerBenefitsRef },
//         { id: "Approval", slug: "approval", ref: approvalRef },
//         { id: "Fee Structure", slug: "fee-structure", ref: feesRef },
//         { id: "EMI Options", slug: "emi-options", ref: emiRef },
//         { id: "Eligibility", slug: "eligibility", ref: eligibilityRef },
//         { id: "LMS", slug: "lms", ref: lmsRef },
//         { id: "Exam Pattern", slug: "exam-pattern", ref: examPatternRef },
//         { id: "Admission Process", slug: "admission-process", ref: admissionRef },
//         { id: "Placement", slug: "placement", ref: factsRef },
//         { id: "FAQ", slug: "faq", ref: faqRef },
//     ];

//     // =====================================================
//     // HELPER: Scroll to a section by slug
//     // =====================================================
//     const scrollToSlug = useCallback((slug, updateHash = true) => {
//         const tab = tabs.find((t) => t.slug === slug);
//         if (!tab || !tab.ref.current) return;

//         const y =
//             tab.ref.current.getBoundingClientRect().top +
//             window.pageYOffset -
//             SCROLL_OFFSET;

//         window.scrollTo({ top: y, behavior: "smooth" });
//         setActiveTab(tab.id);

//         if (updateHash) {
//             window.history.replaceState(null, "", `#${slug}`);
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const handleTabClick = (tab) => {
//         scrollToSlug(tab.slug, true);
//     };

//     // =====================================================
//     // ON MOUNT: Check URL hash
//     // =====================================================
//     useEffect(() => {
//         const hash = window.location.hash.replace("#", "");
//         if (hash) {
//             setTimeout(() => {
//                 scrollToSlug(hash, false);
//             }, 100);
//         }
//     }, [scrollToSlug]);

//     // =====================================================
//     // AUTO HIGHLIGHT ACTIVE TAB ON SCROLL
//     // =====================================================
//     useEffect(() => {
//         const handleScroll = () => {
//             const scrollPosition = window.scrollY + SCROLL_OFFSET;

//             for (let i = tabs.length - 1; i >= 0; i--) {
//                 const ref = tabs[i].ref;
//                 if (ref?.current) {
//                     const elementTop = ref.current.offsetTop;
//                     if (scrollPosition >= elementTop) {
//                         setActiveTab(tabs[i].id);
//                         break;
//                     }
//                 }
//             }
//         };

//         window.addEventListener("scroll", handleScroll, { passive: true });
//         handleScroll();

//         return () => window.removeEventListener("scroll", handleScroll);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     // =====================================================
//     // HANDLE BROWSER BACK/FORWARD
//     // =====================================================
//     useEffect(() => {
//         const handleHashChange = () => {
//             const hash = window.location.hash.replace("#", "");
//             if (hash) {
//                 scrollToSlug(hash, false);
//             }
//         };

//         window.addEventListener("hashchange", handleHashChange);
//         return () =>
//             window.removeEventListener("hashchange", handleHashChange);
//     }, [scrollToSlug]);

//     // ============ LOCK BODY SCROLL WHEN POPUP OPEN ============
//     useEffect(() => {
//         if (popupOpen) {
//             document.body.style.overflow = "hidden";
//         } else {
//             document.body.style.overflow = "";
//         }
//         return () => {
//             document.body.style.overflow = "";
//         };
//     }, [popupOpen]);

//     if (!data) {
//         return (
//             <div className="p-10 text-center bg-white text-black font-semibold">
//                 University not found.
//             </div>
//         );
//     }

//     const reviewsCount =
//         data.reviewsCount ||
//         (data._id ? 500 + (parseInt(data._id.slice(-3), 16) % 300) : 650);

//     // =====================================================
//     // ✅ SEO SCHEMAS (JSON-LD)
//     // =====================================================

//     // ---------- Breadcrumb Schema ----------
//     const breadcrumbSchema = {
//         "@context": "https://schema.org",
//         "@type": "BreadcrumbList",
//         itemListElement: [
//             {
//                 "@type": "ListItem",
//                 position: 1,
//                 name: "Home",
//                 item: SITE_URL,
//             },
//             {
//                 "@type": "ListItem",
//                 position: 2,
//                 name: "Universities",
//                 item: `${SITE_URL}/university`,
//             },
//             {
//                 "@type": "ListItem",
//                 position: 3,
//                 name: data.name,
//                 item: `${SITE_URL}/university/${data.slug}`,
//             },
//         ],
//     };

//     // ---------- University Schema (EducationalOrganization) ----------
//     const cleanDesc =
//         stripHtml(data.description).substring(0, 160) ||
//         `Explore ${data.name} online programs, courses, fees, eligibility, and admission process.`;

//     const universitySchema = {
//         "@context": "https://schema.org",
//         "@type": "EducationalOrganization",
//         name: data.name,
//         alternateName: `${data.name} Online`,
//         url: `${SITE_URL}/university/${data.slug}`,
//         logo: data.universityImage
//             ? getImagePath(data.universityImage)
//             : `${SITE_URL}/images/fallback-logo.png`,
//         description: cleanDesc,
//         address: {
//             "@type": "PostalAddress",
//             addressCountry: "IN",
//         },
//         // ✅ aggregateRating sirf tab include karo jab real rating data ho
//         ...(data.rating && reviewsCount > 0
//             ? {
//                   aggregateRating: {
//                       "@type": "AggregateRating",
//                       ratingValue: String(data.rating),
//                       reviewCount: String(reviewsCount),
//                       bestRating: "5",
//                       worstRating: "1",
//                   },
//               }
//             : {}),
//     };

//     // ---------- Course Schema ----------
//     const courseSchema =
//         data.courses?.length > 0
//             ? {
//                   "@context": "https://schema.org",
//                   "@type": "ItemList",
//                   name: `Online Programs at ${data.name}`,
//                   itemListElement: data.courses.map((course, index) => {
//                       // ✅ Safe numeric price extraction
//                       const numericPrice = extractNumericPrice(course.fees);

//                       return {
//                           "@type": "ListItem",
//                           position: index + 1,
//                           item: {
//                               "@type": "Course",
//                               name: course.name,
//                               description:
//                                   course.details ||
//                                   `${course.name} online program at ${data.name}`,
//                               provider: {
//                                   "@type": "EducationalOrganization",
//                                   name: data.name,
//                                   sameAs: `${SITE_URL}/university/${data.slug}`,
//                               },
//                               hasCourseInstance: {
//                                   "@type": "CourseInstance",
//                                   courseMode: "online",
//                                   courseWorkload: course.duration || "N/A",
//                               },
//                               // ✅ Offers sirf tab jab valid numeric price ho
//                               ...(numericPrice
//                                   ? {
//                                         offers: {
//                                             "@type": "Offer",
//                                             price: numericPrice,
//                                             priceCurrency: "INR",
//                                             availability:
//                                                 "https://schema.org/InStock",
//                                             description: course.fees,
//                                         },
//                                     }
//                                   : {}),
//                           },
//                       };
//                   }),
//               }
//             : null;

//     return (
//         <>
//             <div className="bg-white text-black min-h-screen w-full">
//                 {/* ✅ SEO SCHEMAS (JSON-LD) */}
//                 <script
//                     type="application/ld+json"
//                     dangerouslySetInnerHTML={{
//                         __html: JSON.stringify(breadcrumbSchema),
//                     }}
//                 />
//                 <script
//                     type="application/ld+json"
//                     dangerouslySetInnerHTML={{
//                         __html: JSON.stringify(universitySchema),
//                     }}
//                 />
//                 {courseSchema && (
//                     <script
//                         type="application/ld+json"
//                         dangerouslySetInnerHTML={{
//                             __html: JSON.stringify(courseSchema),
//                         }}
//                     />
//                 )}

//                 <Header />

//                 {/* =====================================================
//                     HERO SECTION
//                 ===================================================== */}
//                 <section
//                     className="relative w-full overflow-hidden bg-no-repeat bg-center shadow-lg"
//                     style={{
//                         backgroundImage: `url(${getImagePath(
//                             data.background?.backgroundImage
//                         )})`,
//                         backgroundSize: "cover",
//                         backgroundPosition: "center",
//                     }}
//                     aria-labelledby="university-name"
//                 >
//                     <div className="absolute inset-0 bg-black/50"></div>

//                     <div className="relative z-10 px-6 md:px-20 py-10 lg:py-14 w-full">
//                         <div className="max-w-4xl">
//                             {/* ✅ H1 with ID for aria-labelledby */}
//                             <h1
//                                 id="university-name"
//                                 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight text-white"
//                             >
//                                 {data.name}
//                             </h1>

//                             {/* ✅ SEO: Hidden description for context */}
//                             <p className="sr-only">{cleanDesc}</p>

//                             <div className="flex items-center mb-4 text-sm">
//                                 <Star
//                                     fill="#ffc107"
//                                     color="#ffc107"
//                                     size={16}
//                                     className="mr-1"
//                                     aria-hidden="true"
//                                 />
//                                 <span className="text-yellow-300 font-bold text-lg">
//                                     ({reviewsCount} Reviews)
//                                 </span>
//                             </div>

//                             <div className="mb-5">
//                                 <div className="relative h-[75px] w-[150px] bg-white rounded-xl shadow-2xl overflow-hidden p-2">
//                                     <Image
//                                         src={getImagePath(data.universityImage)}
//                                         alt={`${data.name} official logo`}
//                                         fill
//                                         className="object-contain p-2"
//                                         priority
//                                         sizes="150px"
//                                     />
//                                 </div>
//                             </div>

//                             {data.approvals?.length > 0 && (
//                                 <div
//                                     className="flex items-center gap-4 mb-6 flex-wrap items-start"
//                                     aria-label="University approvals"
//                                 >
//                                     {data.approvals
//                                         .slice(0, 6)
//                                         .map((approval, index) => (
//                                             <div
//                                                 key={index}
//                                                 className="flex flex-col items-center w-20"
//                                             >
//                                                 <div className="relative w-full h-12 bg-white rounded-lg p-1 shadow-md flex items-center justify-center overflow-hidden">
//                                                     <Image
//                                                         src={getImagePath(
//                                                             approval.logo
//                                                         )}
//                                                         alt={`${
//                                                             approval.name ||
//                                                             "Approval"
//                                                         } logo`}
//                                                         fill
//                                                         className="object-contain"
//                                                         sizes="80px"
//                                                     />
//                                                 </div>
//                                                 <p className="text-[10px] md:text-[11px] font-semibold text-white text-center leading-tight mt-1.5 break-words">
//                                                     {approval.name}
//                                                 </p>
//                                             </div>
//                                         ))}
//                                 </div>
//                             )}

//                             <div className="flex flex-col sm:flex-row gap-3 max-w-md">
//                                 {/* ✅ Apply Now — Orange (consistent with website) */}
//                                 <button
//                                     className="cursor-pointer flex-1 bg-[#c15304] text-white font-bold py-3 rounded-xl hover:bg-[#a04503] transition shadow-lg text-sm uppercase"
//                                     onClick={() => {
//                                         setPopupType("apply");
//                                         setPopupOpen(true);
//                                     }}
//                                     aria-label={`Apply now for ${data.name}`}
//                                 >
//                                     Apply Now →
//                                 </button>

//                                 {/* ✅ Talk to University — White */}
//                                 <button
//                                     className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-100 transition shadow-lg text-sm uppercase flex items-center justify-center"
//                                     onClick={() => {
//                                         setPopupType("talk");
//                                         setPopupOpen(true);
//                                     }}
//                                     aria-label={`Talk to ${data.name}`}
//                                 >
//                                     <MessageSquare
//                                         size={18}
//                                         className="mr-2"
//                                         aria-hidden="true"
//                                     />
//                                     Talk to University
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* =====================================================
//                     STICKY TABS (Navigation with aria)
//                 ===================================================== */}
//                 <nav
//                     className="sticky z-40 bg-white border-b border-gray-200 shadow-md overflow-x-auto"
//                     style={{ top: `${HEADER_HEIGHT}px` }}
//                     aria-label="University page sections"
//                 >
//                     <div className="max-w-7xl mx-auto px-4 py-3">
//                         <div className="flex items-center gap-2 min-w-max">
//                             {tabs.map((tab, index) => {
//                                 const isActive = activeTab === tab.id;
//                                 return (
//                                     <a
//                                         key={index}
//                                         href={`#${tab.slug}`}
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             handleTabClick(tab);
//                                         }}
//                                         aria-current={
//                                             isActive ? "true" : undefined
//                                         }
//                                         className={`px-5 py-2.5 rounded-lg border font-semibold text-sm transition-all whitespace-nowrap cursor-pointer ${
//                                             isActive
//                                                 ? "bg-[#c15304] text-white border-[#c15304] shadow-md"
//                                                 : "text-gray-600 border-gray-200 hover:text-[#c15304] hover:border-orange-300 bg-white"
//                                         }`}
//                                     >
//                                         {tab.id}
//                                     </a>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 </nav>

//                 {/* =====================================================
//                     MAIN CONTENT
//                 ===================================================== */}
//                 <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
//                     {/* ---------- 1. OVERVIEW ---------- */}
//                     <section
//                         id="overview"
//                         ref={overviewRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                         aria-labelledby="overview-heading"
//                     >
//                         <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
//                             <h2
//                                 id="overview-heading"
//                                 className="text-[#0056D2] text-3xl md:text-4xl font-bold mb-6"
//                             >
//                                 Overview of {data.name}
//                             </h2>
//                             <div
//                                 className="rich-content"
//                                 dangerouslySetInnerHTML={{
//                                     __html: cleanHtml(
//                                         data.description ||
//                                             "No description available."
//                                     ),
//                                 }}
//                             />
//                         </div>
//                     </section>

//                     {/* ---------- 2. RECOGNITION / CERTIFICATE ---------- */}
//                     <section
//                         id="certificate"
//                         ref={certificateRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <UniversityCertificate data={data} />
//                     </section>

//                     {/* ---------- 3. COURSES ---------- */}
//                     <section
//                         id="courses"
//                         ref={coursesRef}
//                         className="shadow-lg rounded-2xl overflow-hidden border border-gray-100"
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                         aria-labelledby="courses-heading"
//                     >
//                         <h2
//                             id="courses-heading"
//                             className="text-xl font-bold text-white bg-[#0b3a6f] p-5 text-center uppercase tracking-wide"
//                         >
//                             Explore Online Programs at {data.name}
//                         </h2>

//                         <div className="bg-white p-2">
//                             {data.courses?.length > 0 ? (
//                                 <div className="grid grid-cols-1 md:grid-cols-2">
//                                     {data.courses.map((course, index) => (
//                                         <div
//                                             key={index}
//                                             className={`transition hover:bg-gray-50 border-gray-100 ${
//                                                 index % 2 === 0
//                                                     ? "md:border-r"
//                                                     : ""
//                                             } border-b`}
//                                         >
//                                             <div className="p-5 flex items-center justify-between gap-4">
//                                                 <span className="text-blue-900 font-bold flex-1">
//                                                     {course.name}
//                                                 </span>
//                                                 <button
//                                                     onClick={() => {
//                                                         setPopupType("apply");
//                                                         setPopupOpen(true);
//                                                     }}
//                                                     aria-label={`Apply for ${course.name}`}
//                                                     className="cursor-pointer bg-[#c15304] text-white text-[10px] sm:text-xs font-bold py-1.5 px-3 rounded-full hover:bg-[#a04503] transition-all shadow-sm whitespace-nowrap flex items-center gap-1"
//                                                 >
//                                                     Apply Now
//                                                     <ChevronRight
//                                                         size={12}
//                                                         aria-hidden="true"
//                                                     />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <p className="p-6 text-center text-gray-500">
//                                     No courses listed yet.
//                                 </p>
//                             )}
//                         </div>
//                     </section>

//                     {/* ---------- 4. KEY HIGHLIGHTS ---------- */}
//                     <section
//                         id="key-highlight"
//                         ref={highlightRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <UniversityHighlights data={data} />
//                     </section>

//                     {/* ---------- 5. CAREER VIDYA BENEFITS ---------- */}
//                     <section
//                         id="career-benefits"
//                         ref={careerBenefitsRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <CareerVidyaBenefits data={data} />
//                     </section>

//                     {/* ---------- 6. APPROVALS ---------- */}
//                     <section
//                         id="approval"
//                         ref={approvalRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <Approvel data={data} />
//                     </section>

//                     {/* ---------- 7. FEE STRUCTURE ---------- */}
//                     <section
//                         id="fee-structure"
//                         ref={feesRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <FeesStructureSection data={data} />
//                     </section>

//                     {/* ---------- 8. EMI OPTIONS ---------- */}
//                     <section
//                         id="emi-options"
//                         ref={emiRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <EmiOptions data={data} />
//                     </section>

//                     {/* ---------- 9. ELIGIBILITY ---------- */}
//                     <section
//                         id="eligibility"
//                         ref={eligibilityRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <Eligibility slug={data.slug} data={data} />
//                     </section>

//                     {/* ---------- 10. LMS ---------- */}
//                     <section
//                         id="lms"
//                         ref={lmsRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <LmsSection data={data} />
//                     </section>

//                     {/* ---------- 11. EXAM PATTERN ---------- */}
//                     <section
//                         id="exam-pattern"
//                         ref={examPatternRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <ExamPatternSection data={data} />
//                     </section>

//                     {/* ---------- 12. ADMISSION PROCESS ---------- */}
//                     <section
//                         id="admission-process"
//                         ref={admissionRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <AdmissionProcess data={data} />
//                     </section>

//                     {/* ---------- 13. PLACEMENT / FACTS ---------- */}
//                     <section
//                         id="placement"
//                         ref={factsRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <FactsSection data={data} />
//                     </section>

//                     {/* ---------- 14. FAQ ---------- */}
//                     <section
//                         id="faq"
//                         ref={faqRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <FaqSection data={data} />
//                     </section>
//                 </main>

//                 {/* =====================================================
//                     POPUPS
//                 ===================================================== */}
//                 {popupOpen && popupType === "apply" && (
//                     <Applictionpopup
//                         open={popupOpen}
//                         onClose={() => setPopupOpen(false)}
//                         type={popupType}
//                         universityName={data.name}
//                     />
//                 )}

//                 {popupOpen && popupType === "talk" && (
//                     <TalkToUniversity
//                         open={popupOpen}
//                         onClose={() => setPopupOpen(false)}
//                         universityName={data.name}
//                         phone={data.contactNumber || "+919319998717"}
//                         whatsapp={data.whatsappNumber || "+919319998717"}
//                     />
//                 )}
//             </div>

//             <ReviewRatingstatic />
//             <Footer />
//             <DiscountPopup />
//         </>
//     );
// }



// "use client";

// import { useState, useRef, useEffect, useCallback } from "react";
// import { Star, MessageSquare, ChevronRight, ChevronLeft } from "lucide-react";
// import Image from "next/image";

// // Layout
// import Header from "@/app/layout/Header";
// import Footer from "@/app/layout/Footer.jsx";

// // Auth
// import { useAuth } from "@/context/AuthContext.jsx";
// // import AuthModal from "@/app/components/AuthModal.jsx"; // ⚠️ adjust path if different — was used but not imported in original file

// // Popups
// import Applictionpopup from "@/app/university/Applictionpopup.jsx";
// import TalkToUniversity from "@/app/university/TalkToUniversity.jsx";
// import DiscountPopup from "@/app/components/DiscountPopup.jsx";
// import ReviewRatingstatic from "@/app/components/ReviewRatingstatic.jsx";

// // =====================================================
// // SECTIONS (Existing)
// // =====================================================
// import UniversityCertificate from "@/app/university/UniversityCertificate.jsx";
// import UniversityHighlights from "@/app/university/UniversityHighlights.jsx";
// import Approvel from "@/app/university/Approvel.jsx";
// import FeesStructureSection from "@/app/university/Feesstracture.jsx";
// import Eligibility from "@/app/university/Eligibility.jsx";
// import FactsSection from "@/app/university/FactsSection.jsx";
// import AdmissionProcess from "@/app/university/AdmissionProcess.jsx";
// import FaqSection from "@/app/university/FaqSection.jsx";

// // =====================================================
// // SECTIONS (✅ NEW)
// // =====================================================
// import CareerVidyaBenefits from "@/app/university/CareerBenefitsSection.jsx";
// import EmiOptions from "@/app/university/EmiOptionsSection.jsx";
// import LmsSection from "@/app/university/LmsSection.jsx";
// import ExamPatternSection from "@/app/university/ExamPatternSection.jsx";

// // Utils
// import { cleanHtml } from "@/utlis/cleanHtml.js";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
// const SITE_URL = "https://careervidya.in";

// const getImagePath = (path) => {
//     if (!path) return "/fallback-logo.png";
//     if (path.startsWith("http")) return path;
//     if (!BASE_URL) return "/fallback-logo.png";
//     return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
// };

// const stripHtml = (html) => {
//     if (!html) return "";
//     return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
// };

// const extractNumericPrice = (feesString) => {
//     if (!feesString) return null;
//     const cleaned = String(feesString).replace(/[^0-9]/g, "");
//     if (!cleaned) return null;
//     return cleaned.substring(0, 7) || null;
// };

// // =====================================================
// // OFFSET SETTINGS
// // =====================================================
// const HEADER_HEIGHT = 80;
// const TABS_HEIGHT = 60;
// const SCROLL_OFFSET = HEADER_HEIGHT + TABS_HEIGHT + 20;

// export default function UniversityDetail({ initialData }) {
//     const [data] = useState(initialData);
//     const [popupOpen, setPopupOpen] = useState(false);
//     const [popupType, setPopupType] = useState("apply");
//     const [activeTab, setActiveTab] = useState("Overview");

//     // ✅ AUTH
//     const { isAuthenticated, isLoading: authLoading } = useAuth();

//     // ✅ Auth modal state + pending action
//     const [authOpen, setAuthOpen] = useState(false);
//     const [pendingAction, setPendingAction] = useState(null);

//     // ============ REFS ============
//     const tabsScrollRef = useRef(null);
//     const overviewRef = useRef(null);
//     const certificateRef = useRef(null);
//     const coursesRef = useRef(null);
//     const highlightRef = useRef(null);
//     const careerBenefitsRef = useRef(null);
//     const approvalRef = useRef(null);
//     const feesRef = useRef(null);
//     const emiRef = useRef(null);
//     const eligibilityRef = useRef(null);
//     const lmsRef = useRef(null);
//     const examPatternRef = useRef(null);
//     const factsRef = useRef(null);
//     const admissionRef = useRef(null);
//     const faqRef = useRef(null);

//     // ============ TABS ============
//     const tabs = [
//         { id: "Overview", slug: "overview", ref: overviewRef },
//         { id: "Certificate", slug: "certificate", ref: certificateRef },
//         { id: "Courses", slug: "courses", ref: coursesRef },
//         { id: "Key Highlight", slug: "key-highlight", ref: highlightRef },
//         { id: "Career Benefits", slug: "career-benefits", ref: careerBenefitsRef },
//         { id: "Approval", slug: "approval", ref: approvalRef },
//         { id: "Fee Structure", slug: "fee-structure", ref: feesRef },
//         { id: "EMI Options", slug: "emi-options", ref: emiRef },
//         { id: "Eligibility", slug: "eligibility", ref: eligibilityRef },
//         { id: "LMS", slug: "lms", ref: lmsRef },
//         { id: "Exam Pattern", slug: "exam-pattern", ref: examPatternRef },
//         { id: "Admission Process", slug: "admission-process", ref: admissionRef },
//         { id: "Placement", slug: "placement", ref: factsRef },
//         { id: "FAQ", slug: "faq", ref: faqRef },
//     ];

//     // =====================================================
//     // ✅ SMART ACTION OPENER (Auth-aware)
//     // =====================================================
//     const openActionPopup = useCallback(
//         (type) => {
//             if (authLoading) return;

//             if (isAuthenticated) {
//                 // Logged in → direct popup
//                 setPopupType(type);
//                 setPopupOpen(true);
//             } else {
//                 // Not logged in → show AuthModal
//                 setPendingAction(type);
//                 setAuthOpen(true);
//             }
//         },
//         [isAuthenticated, authLoading]
//     );

//     // =====================================================
//     // ✅ AFTER SUCCESSFUL LOGIN → Open pending popup
//     // =====================================================
//     const handleAuthSuccess = useCallback(() => {
//         setAuthOpen(false);

//         if (pendingAction) {
//             setTimeout(() => {
//                 setPopupType(pendingAction);
//                 setPopupOpen(true);
//                 setPendingAction(null);
//             }, 250);
//         }
//     }, [pendingAction]);

//     // =====================================================
//     // HELPER: Scroll to a section by slug
//     // =====================================================
//     const scrollToSlug = useCallback((slug, updateHash = true) => {
//         const tab = tabs.find((t) => t.slug === slug);
//         if (!tab || !tab.ref.current) return;

//         const y =
//             tab.ref.current.getBoundingClientRect().top +
//             window.pageYOffset -
//             SCROLL_OFFSET;

//         window.scrollTo({ top: y, behavior: "smooth" });
//         setActiveTab(tab.id);

//         if (updateHash) {
//             window.history.replaceState(null, "", `#${slug}`);
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const handleTabClick = (tab) => {
//         scrollToSlug(tab.slug, true);
//     };

//     // =====================================================
//     // ✅ TABS ROW: scroll left/right via arrow buttons
//     // =====================================================
//     const scrollTabsRow = (direction) => {
//         if (!tabsScrollRef.current) return;
//         const amount = 220;
//         tabsScrollRef.current.scrollBy({
//             left: direction === "left" ? -amount : amount,
//             behavior: "smooth",
//         });
//     };

//     // =====================================================
//     // ON MOUNT: Check URL hash
//     // =====================================================
//     useEffect(() => {
//         const hash = window.location.hash.replace("#", "");
//         if (hash) {
//             setTimeout(() => {
//                 scrollToSlug(hash, false);
//             }, 100);
//         }
//     }, [scrollToSlug]);

//     // =====================================================
//     // AUTO HIGHLIGHT ACTIVE TAB ON SCROLL
//     // =====================================================
//     useEffect(() => {
//         const handleScroll = () => {
//             const scrollPosition = window.scrollY + SCROLL_OFFSET;

//             for (let i = tabs.length - 1; i >= 0; i--) {
//                 const ref = tabs[i].ref;
//                 if (ref?.current) {
//                     const elementTop = ref.current.offsetTop;
//                     if (scrollPosition >= elementTop) {
//                         setActiveTab(tabs[i].id);
//                         break;
//                     }
//                 }
//             }
//         };

//         window.addEventListener("scroll", handleScroll, { passive: true });
//         handleScroll();

//         return () => window.removeEventListener("scroll", handleScroll);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     // =====================================================
//     // HANDLE BROWSER BACK/FORWARD
//     // =====================================================
//     useEffect(() => {
//         const handleHashChange = () => {
//             const hash = window.location.hash.replace("#", "");
//             if (hash) {
//                 scrollToSlug(hash, false);
//             }
//         };

//         window.addEventListener("hashchange", handleHashChange);
//         return () =>
//             window.removeEventListener("hashchange", handleHashChange);
//     }, [scrollToSlug]);

//     // ============ LOCK BODY SCROLL WHEN POPUP OPEN ============
//     useEffect(() => {
//         if (popupOpen || authOpen) {
//             document.body.style.overflow = "hidden";
//         } else {
//             document.body.style.overflow = "";
//         }
//         return () => {
//             document.body.style.overflow = "";
//         };
//     }, [popupOpen, authOpen]);

//     if (!data) {
//         return (
//             <div className="p-10 text-center bg-white text-black font-semibold">
//                 University not found.
//             </div>
//         );
//     }

//     const reviewsCount =
//         data.reviewsCount ||
//         (data._id ? 500 + (parseInt(data._id.slice(-3), 16) % 300) : 650);

//     // =====================================================
//     // ✅ SEO SCHEMAS
//     // =====================================================
//     const breadcrumbSchema = {
//         "@context": "https://schema.org",
//         "@type": "BreadcrumbList",
//         itemListElement: [
//             { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
//             {
//                 "@type": "ListItem",
//                 position: 2,
//                 name: "Universities",
//                 item: `${SITE_URL}/university`,
//             },
//             {
//                 "@type": "ListItem",
//                 position: 3,
//                 name: data.name,
//                 item: `${SITE_URL}/university/${data.slug}`,
//             },
//         ],
//     };

//     const cleanDesc =
//         stripHtml(data.description).substring(0, 160) ||
//         `Explore ${data.name} online programs, courses, fees, eligibility, and admission process.`;

//     const universitySchema = {
//         "@context": "https://schema.org",
//         "@type": "EducationalOrganization",
//         name: data.name,
//         alternateName: `${data.name} Online`,
//         url: `${SITE_URL}/university/${data.slug}`,
//         logo: data.universityImage
//             ? getImagePath(data.universityImage)
//             : `${SITE_URL}/images/fallback-logo.png`,
//         description: cleanDesc,
//         address: { "@type": "PostalAddress", addressCountry: "IN" },
//         ...(data.rating && reviewsCount > 0
//             ? {
//                   aggregateRating: {
//                       "@type": "AggregateRating",
//                       ratingValue: String(data.rating),
//                       reviewCount: String(reviewsCount),
//                       bestRating: "5",
//                       worstRating: "1",
//                   },
//               }
//             : {}),
//     };

//     const courseSchema =
//         data.courses?.length > 0
//             ? {
//                   "@context": "https://schema.org",
//                   "@type": "ItemList",
//                   name: `Online Programs at ${data.name}`,
//                   itemListElement: data.courses.map((course, index) => {
//                       const numericPrice = extractNumericPrice(course.fees);
//                       return {
//                           "@type": "ListItem",
//                           position: index + 1,
//                           item: {
//                               "@type": "Course",
//                               name: course.name,
//                               description:
//                                   course.details ||
//                                   `${course.name} online program at ${data.name}`,
//                               provider: {
//                                   "@type": "EducationalOrganization",
//                                   name: data.name,
//                                   sameAs: `${SITE_URL}/university/${data.slug}`,
//                               },
//                               hasCourseInstance: {
//                                   "@type": "CourseInstance",
//                                   courseMode: "online",
//                                   courseWorkload: course.duration || "N/A",
//                               },
//                               ...(numericPrice
//                                   ? {
//                                         offers: {
//                                             "@type": "Offer",
//                                             price: numericPrice,
//                                             priceCurrency: "INR",
//                                             availability:
//                                                 "https://schema.org/InStock",
//                                             description: course.fees,
//                                         },
//                                     }
//                                     : {}),
//                           },
//                       };
//                   }),
//               }
//             : null;

//     return (
//         <>
//             <div className="bg-white text-black min-h-screen w-full">
//                 {/* ✅ SEO SCHEMAS */}
//                 <script
//                     type="application/ld+json"
//                     dangerouslySetInnerHTML={{
//                         __html: JSON.stringify(breadcrumbSchema),
//                     }}
//                 />
//                 <script
//                     type="application/ld+json"
//                     dangerouslySetInnerHTML={{
//                         __html: JSON.stringify(universitySchema),
//                     }}
//                 />
//                 {courseSchema && (
//                     <script
//                         type="application/ld+json"
//                         dangerouslySetInnerHTML={{
//                             __html: JSON.stringify(courseSchema),
//                         }}
//                     />
//                 )}

//                 <Header />

//                 {/* =====================================================
//                     ✅ VISIBLE BREADCRUMB (matches breadcrumbSchema above)
//                     Responsive: full trail on desktop, truncates + scrolls
//                     horizontally on mobile so long university names don't
//                     break the layout.
//                 ===================================================== */}
//                 {/* <nav
//                     aria-label="Breadcrumb"
//                     className="w-full bg-gray-50 border-b border-gray-200"
//                 >
//                     <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5">
//                         <ol className="flex items-center flex-nowrap overflow-x-auto whitespace-nowrap gap-1.5 text-xs md:text-sm scrollbar-hide">
//                             <li className="flex items-center gap-1.5 shrink-0">
//                                 <a
//                                     href="/"
//                                     className="text-gray-500 hover:text-[#c15304] transition-colors"
//                                 >
//                                     Home
//                                 </a>
//                                 <ChevronRight
//                                     size={12}
//                                     className="text-gray-400"
//                                     aria-hidden="true"
//                                 />
//                             </li>
//                             <li className="flex items-center gap-1.5 shrink-0">
//                                 <a
//                                     href="/university"
//                                     className="text-gray-500 hover:text-[#c15304] transition-colors"
//                                 >
//                                     Universities
//                                 </a>
//                                 <ChevronRight
//                                     size={12}
//                                     className="text-gray-400"
//                                     aria-hidden="true"
//                                 />
//                             </li>
//                             <li
//                                 className="text-gray-800 font-semibold truncate max-w-[160px] sm:max-w-[280px] md:max-w-none shrink"
//                                 aria-current="page"
//                                 title={data.name}
//                             >
//                                 {data.name}
//                             </li>
//                         </ol>
//                     </div>
//                 </nav> */}

//                 {/* =====================================================
//                     HERO SECTION
//                 ===================================================== */}
//                 <section
//                     className="relative w-full overflow-hidden bg-no-repeat bg-center shadow-lg"
//                     style={{
//                         backgroundImage: `url(${getImagePath(
//                             data.background?.backgroundImage
//                         )})`,
//                         backgroundSize: "cover",
//                         backgroundPosition: "center",
//                     }}
//                     aria-labelledby="university-name"
//                 >
//                     <div className="absolute inset-0 bg-black/50"></div>

//                     <div className="relative z-10 px-6 md:px-20 py-10 lg:py-14 w-full">
//                         <div className="max-w-4xl">
//                             <h1
//                                 id="university-name"
//                                 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight text-white"
//                             >
//                                 {data.name}
//                             </h1>

//                             <p className="sr-only">{cleanDesc}</p>

//                             <div className="flex items-center mb-4 text-sm">
//                                 <Star
//                                     fill="#ffc107"
//                                     color="#ffc107"
//                                     size={16}
//                                     className="mr-1"
//                                     aria-hidden="true"
//                                 />
//                                 <span className="text-yellow-300 font-bold text-lg">
//                                     ({reviewsCount} Reviews)
//                                 </span>
//                             </div>

//                             <div className="mb-5">
//                                 <div className="relative h-[75px] w-[150px] bg-white rounded-xl shadow-2xl overflow-hidden p-2">
//                                     <Image
//                                         src={getImagePath(data.universityImage)}
//                                         alt={`${data.name} official logo`}
//                                         fill
//                                         className="object-contain p-2"
//                                         priority
//                                         sizes="150px"
//                                     />
//                                 </div>
//                             </div>

//                             {data.approvals?.length > 0 && (
//                                 <div
//                                     className="flex items-center gap-4 mb-6 flex-wrap items-start"
//                                     aria-label="University approvals"
//                                 >
//                                     {data.approvals
//                                         .slice(0, 6)
//                                         .map((approval, index) => (
//                                             <div
//                                                 key={index}
//                                                 className="flex flex-col items-center w-20"
//                                             >
//                                                 <div className="relative w-full h-12 bg-white rounded-lg p-1 shadow-md flex items-center justify-center overflow-hidden">
//                                                     <Image
//                                                         src={getImagePath(
//                                                             approval.logo
//                                                         )}
//                                                         alt={`${
//                                                             approval.name ||
//                                                             "Approval"
//                                                         } logo`}
//                                                         fill
//                                                         className="object-contain"
//                                                         sizes="80px"
//                                                     />
//                                                 </div>
//                                                 <p className="text-[10px] md:text-[11px] font-semibold text-white text-center leading-tight mt-1.5 break-words">
//                                                     {approval.name}
//                                                 </p>
//                                             </div>
//                                         ))}
//                                 </div>
//                             )}

//                             <div className="flex flex-col sm:flex-row gap-3 max-w-md">
//                                 {/* ✅ SMART: Apply Now */}
//                                 <button
//                                     className="cursor-pointer flex-1 bg-[#c15304] text-white font-bold py-3 rounded-xl hover:bg-[#a04503] transition shadow-lg text-sm uppercase disabled:opacity-60"
//                                     onClick={() => openActionPopup("apply")}
//                                     disabled={authLoading}
//                                     aria-label={`Apply now for ${data.name}`}
//                                 >
//                                     {authLoading ? "Loading..." : "Apply Now →"}
//                                 </button>

//                                 {/* ✅ SMART: Talk to University */}
//                                 <button
//                                     className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-100 transition shadow-lg text-sm uppercase flex items-center justify-center disabled:opacity-60"
//                                     onClick={() => openActionPopup("talk")}
//                                     disabled={authLoading}
//                                     aria-label={`Talk to ${data.name}`}
//                                 >
//                                     <MessageSquare
//                                         size={18}
//                                         className="mr-2"
//                                         aria-hidden="true"
//                                     />
//                                     Talk to University
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* =====================================================
//                     STICKY TABS
//                 ===================================================== */}
//                 <nav
//                     className="sticky z-40 bg-white border-b border-gray-200 shadow-md"
//                     style={{ top: `${HEADER_HEIGHT}px` }}
//                     aria-label="University page sections"
//                 >
//                     <div className="max-w-7xl mx-auto relative flex items-center">
//                         {/* Left arrow */}
//                         <button
//                             type="button"
//                             onClick={() => scrollTabsRow("left")}
//                             aria-label="Scroll tabs left"
//                             className="shrink-0 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-gray-500 hover:text-[#c15304] hover:bg-gray-50 transition-colors ml-1"
//                         >
//                             <ChevronLeft size={18} aria-hidden="true" />
//                         </button>

//                         {/* Scrollable tabs row */}
//                         <div
//                             ref={tabsScrollRef}
//                             className="flex items-center gap-6 md:gap-8 overflow-x-auto whitespace-nowrap px-2 py-3 scrollbar-hide scroll-smooth flex-1"
//                         >
//                             {tabs.map((tab, index) => {
//                                 const isActive = activeTab === tab.id;
//                                 return (
//                                     <a
//                                         key={index}
//                                         href={`#${tab.slug}`}
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             handleTabClick(tab);
//                                         }}
//                                         aria-current={isActive ? "true" : undefined}
//                                         className={`relative pb-2 text-sm md:text-[15px] whitespace-nowrap cursor-pointer transition-colors ${
//                                             isActive
//                                                 ? "text-black font-bold"
//                                                 : "text-gray-500 font-medium hover:text-gray-800"
//                                         }`}
//                                     >
//                                         {tab.id}
//                                         {isActive && (
//                                             <span
//                                                 className="absolute left-0 right-0 -bottom-0.5 h-[2.5px] bg-[#0b63e5] rounded-full"
//                                                 aria-hidden="true"
//                                             />
//                                         )}
//                                     </a>
//                                 );
//                             })}
//                         </div>

//                         {/* Right arrow */}
//                         <button
//                             type="button"
//                             onClick={() => scrollTabsRow("right")}
//                             aria-label="Scroll tabs right"
//                             className="shrink-0 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-gray-500 hover:text-[#c15304] hover:bg-gray-50 transition-colors mr-1"
//                         >
//                             <ChevronRight size={18} aria-hidden="true" />
//                         </button>
//                     </div>
//                 </nav>

//                 {/* =====================================================
//                     MAIN CONTENT
//                 ===================================================== */}
//                 <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
//                     {/* 1. OVERVIEW */}
//                     <section
//                         id="overview"
//                         ref={overviewRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                         aria-labelledby="overview-heading"
//                     >
//                         <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
//                             <h2
//                                 id="overview-heading"
//                                 className="text-[#0056D2] text-3xl md:text-4xl font-bold mb-6"
//                             >
//                                 Overview of {data.name}
//                             </h2>
//                             <div
//                                 className="rich-content"
//                                 dangerouslySetInnerHTML={{
//                                     __html: cleanHtml(
//                                         data.description ||
//                                             "No description available."
//                                     ),
//                                 }}
//                             />
//                         </div>
//                     </section>

//                     {/* 2. CERTIFICATE */}
//                     <section
//                         id="certificate"
//                         ref={certificateRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <UniversityCertificate data={data} />
//                     </section>

//                     {/* 3. COURSES */}
//                     <section
//                         id="courses"
//                         ref={coursesRef}
//                         className="shadow-lg rounded-2xl overflow-hidden border border-gray-100"
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                         aria-labelledby="courses-heading"
//                     >
//                         <h2
//                             id="courses-heading"
//                             className="text-xl font-bold text-white bg-[#0b3a6f] p-5 text-center uppercase tracking-wide"
//                         >
//                             Explore Online Programs at {data.name}
//                         </h2>

//                         <div className="bg-white p-2">
//                             {data.courses?.length > 0 ? (
//                                 <div className="grid grid-cols-1 md:grid-cols-2">
//                                     {data.courses.map((course, index) => (
//                                         <div
//                                             key={index}
//                                             className={`transition hover:bg-gray-50 border-gray-100 ${
//                                                 index % 2 === 0
//                                                     ? "md:border-r"
//                                                     : ""
//                                             } border-b`}
//                                         >
//                                             <div className="p-5 flex items-center justify-between gap-4">
//                                                 <span className="text-blue-900 font-bold flex-1">
//                                                     {course.name}
//                                                 </span>
//                                                 {/* ✅ SMART: Course Apply Now */}
//                                                 <button
//                                                     onClick={() =>
//                                                         openActionPopup("apply")
//                                                     }
//                                                     disabled={authLoading}
//                                                     aria-label={`Apply for ${course.name}`}
//                                                     className="cursor-pointer bg-[#c15304] text-white text-[10px] sm:text-xs font-bold py-1.5 px-3 rounded-full hover:bg-[#a04503] transition-all shadow-sm whitespace-nowrap flex items-center gap-1 disabled:opacity-60"
//                                                 >
//                                                     Apply Now
//                                                     <ChevronRight
//                                                         size={12}
//                                                         aria-hidden="true"
//                                                     />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <p className="p-6 text-center text-gray-500">
//                                     No courses listed yet.
//                                 </p>
//                             )}
//                         </div>
//                     </section>

//                     {/* 4. KEY HIGHLIGHTS */}
//                     <section
//                         id="key-highlight"
//                         ref={highlightRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <UniversityHighlights data={data} />
//                     </section>

//                     {/* 5. CAREER BENEFITS */}
//                     <section
//                         id="career-benefits"
//                         ref={careerBenefitsRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <CareerVidyaBenefits data={data} />
//                     </section>

//                     {/* 6. APPROVALS */}
//                     <section
//                         id="approval"
//                         ref={approvalRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <Approvel data={data} />
//                     </section>

//                     {/* 7. FEE STRUCTURE */}
//                     <section
//                         id="fee-structure"
//                         ref={feesRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <FeesStructureSection data={data} />
//                     </section>

//                     {/* 8. EMI OPTIONS */}
//                     <section
//                         id="emi-options"
//                         ref={emiRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <EmiOptions data={data} />
//                     </section>

//                     {/* 9. ELIGIBILITY */}
//                     <section
//                         id="eligibility"
//                         ref={eligibilityRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <Eligibility slug={data.slug} data={data} />
//                     </section>

//                     {/* 10. LMS */}
//                     <section
//                         id="lms"
//                         ref={lmsRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <LmsSection data={data} />
//                     </section>

//                     {/* 11. EXAM PATTERN */}
//                     <section
//                         id="exam-pattern"
//                         ref={examPatternRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <ExamPatternSection data={data} />
//                     </section>

//                     {/* 12. ADMISSION PROCESS */}
//                     <section
//                         id="admission-process"
//                         ref={admissionRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <AdmissionProcess data={data} />
//                     </section>

//                     {/* 13. PLACEMENT */}
//                     <section
//                         id="placement"
//                         ref={factsRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <FactsSection data={data} />
//                     </section>

//                     {/* 14. FAQ */}
//                     <section
//                         id="faq"
//                         ref={faqRef}
//                         style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
//                     >
//                         <FaqSection data={data} />
//                     </section>
//                 </main>

//                 {/* =====================================================
//                     ✅ AUTH MODAL (Only when user not logged in)
//                 ===================================================== */}
//                 {/* {authOpen && (
//                     <AuthModal
//                         onClose={() => {
//                             setAuthOpen(false);
//                             setPendingAction(null);
//                         }}
//                         defaultTab="login"
//                         onSuccess={handleAuthSuccess}
//                     />
//                 )} */}

//                 {/* =====================================================
//                     POPUPS (Only when logged in)
//                 ===================================================== */}
//                 {popupOpen && popupType === "apply" && (
//                     <Applictionpopup
//                         open={popupOpen}
//                         onClose={() => setPopupOpen(false)}
//                         type={popupType}
//                         universityName={data.name}
//                     />
//                 )}

//                 {popupOpen && popupType === "talk" && (
//                     <TalkToUniversity
//                         open={popupOpen}
//                         onClose={() => setPopupOpen(false)}
//                         universityName={data.name}
//                         phone={data.contactNumber || "+919319998717"}
//                         whatsapp={data.whatsappNumber || "+919319998717"}
//                     />
//                 )}
//             </div>

//             <ReviewRatingstatic />
//             <Footer />
//             <DiscountPopup />
//         </>
//     );
// }

// /* =====================================================
//    ✅ ADD THIS TO YOUR GLOBAL CSS (e.g. globals.css)
//    Hides the scrollbar on the mobile breadcrumb row while
//    keeping it horizontally scrollable.
// =====================================================

// .scrollbar-hide::-webkit-scrollbar { display: none; }
// .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

// ===================================================== */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Star, MessageSquare, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";

// Layout
import Header from "@/app/layout/Header";
import Footer from "@/app/layout/Footer.jsx";

// Auth
import { useAuth } from "@/context/AuthContext.jsx";
// import AuthModal from "@/app/components/AuthModal.jsx";

// Popups
import Applictionpopup from "@/app/university/Applictionpopup.jsx";
import TalkToUniversity from "@/app/university/TalkToUniversity.jsx";
import DiscountPopup from "@/app/components/DiscountPopup.jsx";
import ReviewRatingstatic from "@/app/components/ReviewRatingstatic.jsx";

// =====================================================
// SECTIONS (Existing)
// =====================================================
import UniversityCertificate from "@/app/university/UniversityCertificate.jsx";
import UniversityHighlights from "@/app/university/UniversityHighlights.jsx";
import Approvel from "@/app/university/Approvel.jsx";
import FeesStructureSection from "@/app/university/Feesstracture.jsx";
import Eligibility from "@/app/university/Eligibility.jsx";
import FactsSection from "@/app/university/FactsSection.jsx";
import AdmissionProcess from "@/app/university/AdmissionProcess.jsx";
import FaqSection from "@/app/university/FaqSection.jsx";

// =====================================================
// SECTIONS (NEW)
// =====================================================
import CareerVidyaBenefits from "@/app/university/CareerBenefitsSection.jsx";
import EmiOptions from "@/app/university/EmiOptionsSection.jsx";
import LmsSection from "@/app/university/LmsSection.jsx";
import ExamPatternSection from "@/app/university/ExamPatternSection.jsx";

// Utils
import { cleanHtml } from "@/utlis/cleanHtml.js";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
const SITE_URL = "https://careervidya.in";

const getImagePath = (path) => {
    if (!path) return "/fallback-logo.png";
    if (path.startsWith("http")) return path;
    if (!BASE_URL) return "/fallback-logo.png";
    return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
};

const extractNumericPrice = (feesString) => {
    if (!feesString) return null;
    const cleaned = String(feesString).replace(/[^0-9]/g, "");
    if (!cleaned) return null;
    return cleaned.substring(0, 7) || null;
};

// =====================================================
// OFFSET SETTINGS
// =====================================================
const TABS_HEIGHT = 60;
const SCROLL_OFFSET = TABS_HEIGHT + 20;

export default function UniversityDetail({ initialData }) {
    const [data] = useState(initialData);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupType, setPopupType] = useState("apply");
    const [activeTab, setActiveTab] = useState("Overview");

    // ✅ AUTH
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    // ✅ Auth modal state + pending action
    const [authOpen, setAuthOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    // ============ REFS ============
    const tabsScrollRef = useRef(null);
    const overviewRef = useRef(null);
    const certificateRef = useRef(null);
    const coursesRef = useRef(null);
    const highlightRef = useRef(null);
    const careerBenefitsRef = useRef(null);
    const approvalRef = useRef(null);
    const feesRef = useRef(null);
    const emiRef = useRef(null);
    const eligibilityRef = useRef(null);
    const lmsRef = useRef(null);
    const examPatternRef = useRef(null);
    const factsRef = useRef(null);
    const admissionRef = useRef(null);
    const faqRef = useRef(null);

    // ============ TABS ============
    const tabs = [
        { id: "Overview", slug: "overview", ref: overviewRef },
        { id: "Certificate", slug: "certificate", ref: certificateRef },
        { id: "Courses", slug: "courses", ref: coursesRef },
        { id: "Key Highlight", slug: "key-highlight", ref: highlightRef },
        { id: "Career Benefits", slug: "career-benefits", ref: careerBenefitsRef },
        { id: "Approval", slug: "approval", ref: approvalRef },
        { id: "Fee Structure", slug: "fee-structure", ref: feesRef },
        { id: "EMI Options", slug: "emi-options", ref: emiRef },
        { id: "Eligibility", slug: "eligibility", ref: eligibilityRef },
        { id: "LMS", slug: "lms", ref: lmsRef },
        { id: "Exam Pattern", slug: "exam-pattern", ref: examPatternRef },
        { id: "Admission Process", slug: "admission-process", ref: admissionRef },
        { id: "Placement", slug: "placement", ref: factsRef },
        { id: "FAQ", slug: "faq", ref: faqRef },
    ];

    // =====================================================
    // ✅ SMART ACTION OPENER (Auth-aware)
    // =====================================================
    const openActionPopup = useCallback(
        (type) => {
            if (authLoading) return;

            if (isAuthenticated) {
                setPopupType(type);
                setPopupOpen(true);
            } else {
                setPendingAction(type);
                setAuthOpen(true);
            }
        },
        [isAuthenticated, authLoading]
    );

    // =====================================================
    // ✅ AFTER SUCCESSFUL LOGIN → Open pending popup
    // =====================================================
    const handleAuthSuccess = useCallback(() => {
        setAuthOpen(false);

        if (pendingAction) {
            setTimeout(() => {
                setPopupType(pendingAction);
                setPopupOpen(true);
                setPendingAction(null);
            }, 250);
        }
    }, [pendingAction]);

    // =====================================================
    // HELPER: Scroll to a section by slug
    // =====================================================
    const scrollToSlug = useCallback((slug, updateHash = true) => {
        const tab = tabs.find((t) => t.slug === slug);
        if (!tab || !tab.ref.current) return;

        const y =
            tab.ref.current.getBoundingClientRect().top +
            window.pageYOffset -
            SCROLL_OFFSET;

        window.scrollTo({ top: y, behavior: "smooth" });
        setActiveTab(tab.id);

        if (updateHash) {
            window.history.replaceState(null, "", `#${slug}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTabClick = (tab) => {
        scrollToSlug(tab.slug, true);
    };

    // =====================================================
    // ✅ TABS ROW: scroll left/right via arrow buttons
    // =====================================================
    const scrollTabsRow = (direction) => {
        if (!tabsScrollRef.current) return;
        const amount = 220;
        tabsScrollRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    // =====================================================
    // ON MOUNT: Check URL hash
    // =====================================================
    useEffect(() => {
        const hash = window.location.hash.replace("#", "");
        if (hash) {
            setTimeout(() => {
                scrollToSlug(hash, false);
            }, 100);
        }
    }, [scrollToSlug]);

    // =====================================================
    // AUTO HIGHLIGHT ACTIVE TAB ON SCROLL
    // =====================================================
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + SCROLL_OFFSET;

            for (let i = tabs.length - 1; i >= 0; i--) {
                const ref = tabs[i].ref;
                if (ref?.current) {
                    const elementTop = ref.current.offsetTop;
                    if (scrollPosition >= elementTop) {
                        setActiveTab(tabs[i].id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // =====================================================
    // HANDLE BROWSER BACK/FORWARD
    // =====================================================
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace("#", "");
            if (hash) {
                scrollToSlug(hash, false);
            }
        };

        window.addEventListener("hashchange", handleHashChange);
        return () =>
            window.removeEventListener("hashchange", handleHashChange);
    }, [scrollToSlug]);

    // ============ LOCK BODY SCROLL WHEN POPUP OPEN ============
    useEffect(() => {
        if (popupOpen || authOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [popupOpen, authOpen]);

    if (!data) {
        return (
            <div className="p-10 text-center bg-white text-black font-semibold">
                University not found.
            </div>
        );
    }

    const reviewsCount =
        data.reviewsCount ||
        (data._id ? 500 + (parseInt(data._id.slice(-3), 16) % 300) : 650);

    // =====================================================
    // ✅ SEO SCHEMAS
    // =====================================================
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            {
                "@type": "ListItem",
                position: 2,
                name: "Universities",
                item: `${SITE_URL}/university`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: data.name,
                item: `${SITE_URL}/university/${data.slug}`,
            },
        ],
    };

    const cleanDesc =
        stripHtml(data.description).substring(0, 160) ||
        `Explore ${data.name} online programs, courses, fees, eligibility, and admission process.`;

    const universitySchema = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: data.name,
        alternateName: `${data.name} Online`,
        url: `${SITE_URL}/university/${data.slug}`,
        logo: data.universityImage
            ? getImagePath(data.universityImage)
            : `${SITE_URL}/images/fallback-logo.png`,
        description: cleanDesc,
        address: { "@type": "PostalAddress", addressCountry: "IN" },
        ...(data.rating && reviewsCount > 0
            ? {
                  aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: String(data.rating),
                      reviewCount: String(reviewsCount),
                      bestRating: "5",
                      worstRating: "1",
                  },
              }
            : {}),
    };

    const courseSchema =
        data.courses?.length > 0
            ? {
                  "@context": "https://schema.org",
                  "@type": "ItemList",
                  name: `Online Programs at ${data.name}`,
                  itemListElement: data.courses.map((course, index) => {
                      const numericPrice = extractNumericPrice(course.fees);
                      return {
                          "@type": "ListItem",
                          position: index + 1,
                          item: {
                              "@type": "Course",
                              name: course.name,
                              description:
                                  course.details ||
                                  `${course.name} online program at ${data.name}`,
                              provider: {
                                  "@type": "EducationalOrganization",
                                  name: data.name,
                                  sameAs: `${SITE_URL}/university/${data.slug}`,
                              },
                              hasCourseInstance: {
                                  "@type": "CourseInstance",
                                  courseMode: "online",
                                  courseWorkload: course.duration || "N/A",
                              },
                              ...(numericPrice
                                  ? {
                                        offers: {
                                            "@type": "Offer",
                                            price: numericPrice,
                                            priceCurrency: "INR",
                                            availability:
                                                "https://schema.org/InStock",
                                            description: course.fees,
                                        },
                                    }
                                    : {}),
                          },
                      };
                  }),
              }
            : null;

    return (
        <>
            <div className="bg-white text-black min-h-screen w-full">
                {/* ✅ SEO SCHEMAS */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(breadcrumbSchema),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(universitySchema),
                    }}
                />
                {courseSchema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(courseSchema),
                        }}
                    />
                )}

                <Header />

                {/* =====================================================
                    HERO SECTION
                ===================================================== */}
                <section
                    className="relative w-full overflow-hidden bg-no-repeat bg-center shadow-lg"
                    style={{
                        backgroundImage: `url(${getImagePath(
                            data.background?.backgroundImage
                        )})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    aria-labelledby="university-name"
                >
                    <div className="absolute inset-0 bg-black/50"></div>

                    <div className="relative z-10 px-6 md:px-20 py-10 lg:py-14 w-full">
                        <div className="max-w-4xl">
                            <h1
                                id="university-name"
                                className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight text-white"
                            >
                                {data.name}
                            </h1>

                            <p className="sr-only">{cleanDesc}</p>

                            <div className="flex items-center mb-4 text-sm">
                                <Star
                                    fill="#ffc107"
                                    color="#ffc107"
                                    size={16}
                                    className="mr-1"
                                    aria-hidden="true"
                                />
                                <span className="text-yellow-300 font-bold text-lg">
                                    ({reviewsCount} Reviews)
                                </span>
                            </div>

                            <div className="mb-5">
                                <div className="relative h-[75px] w-[150px] bg-white rounded-xl shadow-2xl overflow-hidden p-2">
                                    <Image
                                        src={getImagePath(data.universityImage)}
                                        alt={`${data.name} official logo`}
                                        fill
                                        className="object-contain p-2"
                                        priority
                                        sizes="150px"
                                    />
                                </div>
                            </div>

                            {data.approvals?.length > 0 && (
                                <div
                                    className="flex items-center gap-4 mb-6 flex-wrap items-start"
                                    aria-label="University approvals"
                                >
                                    {data.approvals
                                        .slice(0, 6)
                                        .map((approval, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col items-center w-20"
                                            >
                                                <div className="relative w-full h-12 bg-white rounded-lg p-1 shadow-md flex items-center justify-center overflow-hidden">
                                                    <Image
                                                        src={getImagePath(
                                                            approval.logo
                                                        )}
                                                        alt={`${
                                                            approval.name ||
                                                            "Approval"
                                                        } logo`}
                                                        fill
                                                        className="object-contain"
                                                        sizes="80px"
                                                    />
                                                </div>
                                                <p className="text-[10px] md:text-[11px] font-semibold text-white text-center leading-tight mt-1.5 break-words">
                                                    {approval.name}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                                {/* ✅ SMART: Apply Now */}
                                <button
                                    className="cursor-pointer flex-1 bg-[#c15304] text-white font-bold py-3 rounded-xl hover:bg-[#a04503] transition shadow-lg text-sm uppercase disabled:opacity-60"
                                    onClick={() => openActionPopup("apply")}
                                    disabled={authLoading}
                                    aria-label={`Apply now for ${data.name}`}
                                >
                                    {authLoading ? "Loading..." : "Apply Now →"}
                                </button>

                                {/* ✅ SMART: Talk to University */}
                                <button
                                    className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-100 transition shadow-lg text-sm uppercase flex items-center justify-center disabled:opacity-60"
                                    onClick={() => openActionPopup("talk")}
                                    disabled={authLoading}
                                    aria-label={`Talk to ${data.name}`}
                                >
                                    <MessageSquare
                                        size={18}
                                        className="mr-2"
                                        aria-hidden="true"
                                    />
                                    Talk to University
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    ✅ STICKY TABS — moved to the very top (top-0)
                    Breadcrumb removed.
                ===================================================== */}
                <nav
                    className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]"
                    aria-label="University page sections"
                >
                    <div className="max-w-7xl mx-auto relative flex items-center bg-white/95">
                        {/* Left arrow */}
                        <button
                            type="button"
                            onClick={() => scrollTabsRow("left")}
                            aria-label="Scroll tabs left"
                            className="shrink-0 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white text-gray-500 hover:text-[#c15304] hover:bg-gray-50 transition-colors ml-1"
                        >
                            <ChevronLeft size={18} aria-hidden="true" />
                        </button>

                        {/* Scrollable tabs row */}
                        <div
                            ref={tabsScrollRef}
                            className="tabs-scroll-row flex items-center gap-5 md:gap-7 overflow-x-auto whitespace-nowrap px-2 py-2.5 scroll-smooth flex-1"
                        >
                            {tabs.map((tab, index) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <a
                                        key={index}
                                        href={`#${tab.slug}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleTabClick(tab);
                                        }}
                                        aria-current={isActive ? "true" : undefined}
                                        className={`inline-block pb-1.5 border-b-[2.5px] text-sm md:text-[15px] whitespace-nowrap cursor-pointer transition-colors ${
                                            isActive
                                                ? "text-black font-bold border-[#0b63e5]"
                                                : "text-gray-500 font-medium border-transparent hover:text-gray-800"
                                        }`}
                                    >
                                        {tab.id}
                                    </a>
                                );
                            })}
                        </div>

                        {/* Right arrow */}
                        <button
                            type="button"
                            onClick={() => scrollTabsRow("right")}
                            aria-label="Scroll tabs right"
                            className="shrink-0 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white text-gray-500 hover:text-[#c15304] hover:bg-gray-50 transition-colors mr-1"
                        >
                            <ChevronRight size={18} aria-hidden="true" />
                        </button>
                    </div>

                    {/* Scoped scrollbar hide */}
                    <style jsx>{`
                        .tabs-scroll-row::-webkit-scrollbar {
                            display: none;
                        }
                        .tabs-scroll-row {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>
                </nav>

                {/* =====================================================
                    MAIN CONTENT
                ===================================================== */}
                <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                    {/* 1. OVERVIEW */}
                    <section
                        id="overview"
                        ref={overviewRef}
                        style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                        aria-labelledby="overview-heading"
                    >
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                            <h2
                                id="overview-heading"
                                className="text-[#0056D2] text-3xl md:text-4xl font-bold mb-6"
                            >
                                Overview of {data.name}
                            </h2>
                            <div
                                className="rich-content"
                                dangerouslySetInnerHTML={{
                                    __html: cleanHtml(
                                        data.description ||
                                            "No description available."
                                    ),
                                }}
                            />
                        </div>
                    </section>

                    {/* 2. CERTIFICATE */}
                    <section
                        id="certificate"
                        ref={certificateRef}
                        style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                    >
                        <UniversityCertificate data={data} />
                    </section>

                    {/* 3. COURSES */}
                    <section
                        id="courses"
                        ref={coursesRef}
                        className="shadow-lg rounded-2xl overflow-hidden border border-gray-100"
                        style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                        aria-labelledby="courses-heading"
                    >
                        <h2
                            id="courses-heading"
                            className="text-xl font-bold text-white bg-[#0b3a6f] p-5 text-center uppercase tracking-wide"
                        >
                            Explore Online Programs at {data.name}
                        </h2>

                        <div className="bg-white p-2">
                            {data.courses?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    {data.courses.map((course, index) => (
                                        <div
                                            key={index}
                                            className={`transition hover:bg-gray-50 border-gray-100 ${
                                                index % 2 === 0
                                                    ? "md:border-r"
                                                    : ""
                                            } border-b`}
                                        >
                                            <div className="p-5 flex items-center justify-between gap-4">
                                                <span className="text-blue-900 font-bold flex-1">
                                                    {course.name}
                                                </span>
                                                {/* ✅ SMART: Course Apply Now */}
                                                <button
                                                    onClick={() =>
                                                        openActionPopup("apply")
                                                    }
                                                    disabled={authLoading}
                                                    aria-label={`Apply for ${course.name}`}
                                                    className="cursor-pointer bg-[#c15304] text-white text-[10px] sm:text-xs font-bold py-1.5 px-3 rounded-full hover:bg-[#a04503] transition-all shadow-sm whitespace-nowrap flex items-center gap-1 disabled:opacity-60"
                                                >
                                                    Apply Now
                                                    <ChevronRight
                                                        size={12}
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="p-6 text-center text-gray-500">
                                    No courses listed yet.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* 4. KEY HIGHLIGHTS */}
                    <section
                        id="key-highlight"
                        ref={highlightRef}
                        style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                    >
                        <UniversityHighlights data={data} />
                    </section>

                    {/* 5. CAREER BENEFITS */}
                    <section
                        id="career-benefits"
                        ref={careerBenefitsRef}
                        style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                    >
                        <CareerVidyaBenefits data={data} />
                    </section>

                    {/* 6. APPROVALS */}
                    <section
                        id="approval"
                        ref={approvalRef}
                        style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                    >
                        <Approvel data={data} />
                    </section>

                    {/* 7. FEE STRUCTURE */}
                    <section
                        id="fee-structure"
                        ref={feesRef}
                        style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                    >
                        <FeesStructureSection data={data} />
                    </section>

                    {/* 8. EMI OPTIONS */}
                    <section
                        id="emi-options"
                        ref={emiRef}
                        style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                    >
                        <EmiOptions data={data} />
                    </section>

                    {/* 9. ELIGIBILITY */}
                    <section
                        id="eligibility"
                        ref={eligibilityRef}
                        style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                    >
                        <Eligibility slug={data.slug} data={data} />
                    </section>

                    {/* 10. LMS */}
                    <section
                        id="lms"
                        ref={lmsRef}
                        style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                    >
                        <LmsSection data={data} />
                    </section>

                    {/* 11. EXAM PATTERN */}
                    <section
                        id="exam-pattern"
                        ref={examPatternRef}
                        style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                    >
                        <ExamPatternSection data={data} />
                    </section>

                    {/* 12. ADMISSION PROCESS */}
                    <section
                        id="admission-process"
                        ref={admissionRef}
                        style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                    >
                        <AdmissionProcess data={data} />
                    </section>

                    {/* 13. PLACEMENT */}
                    <section
                        id="placement"
                        ref={factsRef}
                        style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                    >
                        <FactsSection data={data} />
                    </section>

                    {/* 14. FAQ */}
                    <section
                        id="faq"
                        ref={faqRef}
                        style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                    >
                        <FaqSection data={data} />
                    </section>
                </main>

                {/* =====================================================
                    ✅ AUTH MODAL (Only when user not logged in)
                ===================================================== */}
                {authOpen && (
                    <AuthModal
                        onClose={() => {
                            setAuthOpen(false);
                            setPendingAction(null);
                        }}
                        defaultTab="login"
                        onSuccess={handleAuthSuccess}
                    />
                )}

                {/* =====================================================
                    POPUPS (Only when logged in)
                ===================================================== */}
                {popupOpen && popupType === "apply" && (
                    <Applictionpopup
                        open={popupOpen}
                        onClose={() => setPopupOpen(false)}
                        type={popupType}
                        universityName={data.name}
                    />
                )}

                {popupOpen && popupType === "talk" && (
                    <TalkToUniversity
                        open={popupOpen}
                        onClose={() => setPopupOpen(false)}
                        universityName={data.name}
                        phone={data.contactNumber || "+919319998717"}
                        whatsapp={data.whatsappNumber || "+919319998717"}
                    />
                )}
            </div>

            <ReviewRatingstatic />
            <Footer />
            <DiscountPopup />
        </>
    );
}
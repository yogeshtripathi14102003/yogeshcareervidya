//     "use client";

//     import { useState } from "react";
//     import Header from "@/app/layout/Header";
//     import Footer from "@/app/layout/Footer";
//     /**
//      * Continuing Education Program for Working Professionals — CONTENT ONLY
//      * Header/Footer already aapki site se import ho rahe hain.
//      */

//     const ELIGIBLE_PROGRAMMES = [
//     "Polytechnic Diploma",
//     "Bachelor of Technology (B. Tech)",
//     "Master of Technology (M. Tech)",
//     "Master of Computer Applications (MCA)",
//     "Master of Business Administration (MBA)",
//     "Lateral Entry (Diploma and B. Tech)",
//     ];

//     const ELIGIBILITY = [
//     {
//         title: "Employment Status",
//         body: "The applicant should be an employee of a Registered Industry/Organization, Central Government, State Government, Public Sector Undertaking (PSU), Private/Public Limited Company, or MSME.",
//     },
//     {
//         title: "Academic & Professional Eligibility",
//         body: "To apply, the applicant must meet the minimum academic eligibility requirements of the programme they are applying to. A minimum of one year full-time / regular working experience is required.",
//     },
//     {
//         title: "Changing Jobs After Admission",
//         body: "An applicant who discontinues employment after admission may continue the programme, subject to approval by the University and fulfillment of all academic requirements.",
//     },
//     ];

//     const SCHEDULES = [
//     "Evening Classes",
//     "Weekend and Holiday Classes",
//     "Hybrid Learning Model",
//     "Intensive Campus Contact Programmes",
//     ];

//     const FAQS = [
//     {
//         q: "Who is eligible to apply?",
//         a: "The Continuing Education Programme is available to any working professional employed by a) government bodies, b) public sector undertakings, c) private sector companies, d) industry, or e) a registered business establishment — provided they meet the eligibility criteria of their selected programme.",
//     },
//     {
//         q: "Can I continue to work while I am enrolled?",
//         a: "Yes — the Continuing Education Programme has been developed for the sole purpose of allowing working professionals to continue working while obtaining an education.",
//     },
//     {
//         q: "What programmes can be pursued through this scheme?",
//         a: "Examples include Polytechnic Diploma, B. Tech, M. Tech, MBA, MCA and Lateral Entry (Diploma & B. Tech).",
//     },
//     {
//         q: "What documentation do I need to submit to enroll?",
//         a: "An application with your previous academic records, plus proof of employment — a No Objection Certificate / Employment Certificate / Appointment Letter — along with a self-declaration of your current employment status.",
//     },
//     {
//         q: "What if I stop working while admitted to the programme?",
//         a: "A student who discontinues employment after admission may continue the programme, subject to approval by the University and fulfillment of all academic requirements.",
//     },
//     {
//         q: "Do you offer evening / weekend classes?",
//         a: "Yes — the University offers weekend, evening and holiday classes, a hybrid learning model, and intensive campus contact programmes.",
//     },
//     {
//         q: "Is work experience required for admission?",
//         a: "A minimum of one year full-time / regular working experience is required.",
//     },
//     {
//         q: "Is this programme approved by the university & governing authorities?",
//         a: "Yes — the programme is valid under current regulations set by the University and the appropriate statutory authorities, inclusive of all approvals required for each individual programme.",
//     },
//     ];

//     export default function ContinuingEducationContent() {
//     const [openFaq, setOpenFaq] = useState(0);

//     return (
//         <>
//         <Header />
//         <div className="bg-[#F4F1E9] text-[#141B22] font-[Inter,sans-serif]">
// {/* Hero Banner */}
// <section
//   className="relative py-24 px-6 text-center overflow-hidden"
//   style={{
//     backgroundImage:
//       "linear-gradient(rgba(6,17,28,0.92), rgba(9,30,42,0.92)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop')",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//   }}
// >
//   <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#D4A72C]/10 blur-3xl" />
//   <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#1E5F74]/20 blur-3xl" />
//   <p className="relative uppercase tracking-[0.35em] text-xs text-[#D4A72C] font-semibold mb-4">
//     Admissions For Working Professionals
//   </p>
//   <h1 className="relative text-white text-2xl md:text-4xl lg:text-3xl font-bold max-w-6xl mx-auto leading-tight ">
//     CONTINUING EDUCATION PROGRAM FOR WORKING PROFESSIONALS
//   </h1>
//   <div className="relative w-16 h-1 bg-[#D4A72C] mx-auto mt-6 rounded-full" />

//   {/* NEW: Top 3 Programme Highlight Cards */}
//   <div className="relative flex flex-wrap justify-center gap-4 mt-9 max-w-3xl mx-auto">
//     {[ "B. Tech", "M. Tech", "Diploma"].map((p) => (
//       <div
//         key={p}
//         className="group relative px-8 py-3 rounded-full text-sm md:text-base font-bold text-white
//                    bg-gradient-to-r from-white/[0.12] to-white/[0.06] border border-[#D4A72C]/40
//                    backdrop-blur-md shadow-[0_0_20px_rgba(212,167,44,0.15)]
//                    hover:border-[#D4A72C] hover:shadow-[0_0_25px_rgba(212,167,44,0.4)]
//                    hover:-translate-y-0.5 transition-all duration-300"
//       >
//         <span className="relative z-10">{p}</span>
//         <span className="absolute inset-0 rounded-full bg-[#D4A72C]/0 group-hover:bg-[#D4A72C]/10 transition-all duration-300" />
//       </div>
//     ))}
//   </div>
// </section>

//             {/* Intro */}
//             <section className="max-w-7xl mx-auto px-6 pt-14 pb-14">
//             <div className="border-l-4 border-[#D4A72C] pl-6">
//                 <p className="text-[#1C2430] text-base md:text-lg leading-relaxed max-w-3xl font-medium">
//                 At Vikrant University, we feel that academic success is part of being successful
//                 in your profession. The Continuing Education Scheme for Working Professionals lets
//                 you continue your studies without losing your present professional obligations —
//                 learn new things, improve your qualifications, and secure your career while you
//                 stay employed.
//                 </p>
//             </div>
//             </section>

//             {/* Eligible programmes + image */}
//             <section className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-12 items-start">
//             <div>
//                 <h2 className="font-[Fraunces,serif] text-3xl text-[#08131F] font-bold mb-2">
//                 Eligible Academic Programmes
//                 </h2>
//                 <p className="text-sm text-[#3A4552] mb-6">
//                 This policy is applicable to the following programmes (all branches, wherever
//                 applicable) offered by the University:
//                 </p>
//                 <ol className="space-y-3">
//                 {ELIGIBLE_PROGRAMMES.map((p, i) => (
//                     <li
//                     key={p}
//                     className="flex items-center gap-4 border border-[#08131F]/10 rounded-lg px-4 py-3 bg-white shadow-sm hover:shadow-md hover:border-[#D4A72C]/60 transition-all"
//                     >
//                     <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1E5F9E] text-white font-[Fraunces,serif] text-sm font-bold shrink-0">
//                         {i + 1}
//                     </span>
//                     <span className="text-sm text-[#141B22] font-semibold">{p}</span>
//                     </li>
//                 ))}
//                 </ol>
//                 <p className="text-l text-[#3A4552] mt-4 ">
//                 Note: all of the above programmes are subject to obtaining relevant approvals,
//                 recognitions and permissions of the applicable statutory and regulatory bodies
//                 prior to commencement.
//                 </p>
//             </div>
//             <div className="rounded-2xl overflow-hidden border border-[#08131F]/10 shadow-xl relative">
//                 <div className="absolute inset-0 bg-gradient-to-t from-[#08131F]/50 to-transparent" />
//                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                 <img
//                 src="https://vikrantuniversity.ac.in/static/images/working.webp"
//                 alt="Working professional"
//                 className="w-full h-full object-cover"
//                 />
//             </div>
//             </section>

//             {/* Admission & Eligibility conditions */}
//             <section className="bg-gradient-to-br from-[#0B2036] via-[#0F2A45] to-[#1B4A63] py-20 relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4A72C]/10 rounded-full blur-3xl" />
//             <div className="max-w-7xl mx-auto px-6 relative">
//                 <h2 className="font-[Fraunces,serif] text-3xl text-white font-bold mb-2">
//                 Admission &amp; Eligibility Conditions
//                 </h2>
//                 <p className="text-[#9FB2C6] text-sm mb-10 max-w-2xl">
//                 Eligibility criteria for admission in this scheme are as follows:
//                 </p>
//                 <div className="grid md:grid-cols-3 gap-6">
//                 {ELIGIBILITY.map((e, i) => (
//                     <div
//                     key={e.title}
//                     className="bg-white/[0.06] border border-white/10 rounded-xl p-6 hover:bg-white/[0.1] hover:border-[#D4A72C]/40 transition-all"
//                     >
//                     <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#D4A72C] text-[#08131F] font-[Fraunces,serif] text-sm font-bold">
//                         0{i + 1}
//                     </span>
//                     <h3 className="text-white font-semibold mt-4 mb-2">{e.title}</h3>
//                     <p className="text-[#AFC0D2] text-sm leading-relaxed">{e.body}</p>
//                     </div>
//                 ))}
//                 </div>
//             </div>
//             </section>

//             {/* Documents required */}
//             <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-[1fr_1fr] gap-12">
//             <div>
//                 <h2 className="font-[Fraunces,serif] text-2xl text-[#08131F] font-bold mb-4">
//                 Documents Required at the Time of Admission
//                 </h2>
//                 <p className="text-sm text-[#3A4552] mb-4">Applicants must submit:</p>
//                 <ul className="space-y-3">
//                 <li className="flex gap-3 items-start text-sm text-[#141B22] bg-white border border-[#08131F]/10 rounded-lg px-4 py-3 shadow-sm">
//                     <span className="flex items-center justify-center w-7 h-7 rounded-md bg-[#1E5F9E] text-white font-[Fraunces,serif] text-xs font-bold shrink-0">
//                     01
//                     </span>
//                     <span>Educational certificates and academic transcripts, as applicable.</span>
//                 </li>
//                 <li className="flex gap-3 items-start text-sm text-[#141B22] bg-white border border-[#08131F]/10 rounded-lg px-4 py-3 shadow-sm">
//                     <span className="flex items-center justify-center w-7 h-7 rounded-md bg-[#1E5F9E] text-white font-[Fraunces,serif] text-xs font-bold shrink-0">
//                     02
//                     </span>
//                     <span>
//                     No Objection Certificate (NOC) from the employer / Employment Certificate /
//                     Appointment Letter, along with a self-declaration confirming current employment
//                     status.
//                     </span>
//                 </li>
//                 </ul>
//             </div>

//             <div>
//                 <h2 className="font-[Fraunces,serif] text-2xl text-[#08131F] font-bold mb-4">
//                 Academic Delivery &amp; Flexible Scheduling
//                 </h2>
//                 <p className="text-sm text-[#3A4552] mb-4">
//                 To accommodate the needs of working professionals, the University offers flexible
//                 learning options, including:
//                 </p>
//                 <div className="grid grid-cols-2 gap-3">
//                 {SCHEDULES.map((s, i) => (
//                     <div
//                     key={s}
//                     className="flex items-center gap-3 border border-[#08131F]/10 bg-white rounded-lg px-4 py-3 text-sm font-semibold text-[#141B22] shadow-sm hover:border-[#D4A72C]/60 hover:shadow-md transition-all"
//                     >
//                     <span className="flex items-center justify-center w-7 h-7 rounded-md bg-[#1E5F9E] text-white font-[Fraunces,serif] text-xs font-bold shrink-0">
//                         {i + 1}
//                     </span>
//                     {s}
//                     </div>
//                 ))}
//                 </div>
//             </div>
//             </section>

//             {/* Industry sponsorship & compliance */}
//             <section className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-8">
//             <div className="border-t-4 border-[#D4A72C] bg-white rounded-lg p-7 shadow-lg hover:-translate-y-1 transition-transform">
//                 <h3 className="font-[Fraunces,serif] text-xl text-[#08131F] font-bold mb-3">
//                 Industry Sponsorship
//                 </h3>
//                 <p className="text-sm text-[#2B3546] leading-relaxed">
//                 Vikrant University fosters collaboration between industry, corporations, the
//                 government, and other institutions through defined partnerships and Memoranda of
//                 Understanding (MoUs) that support the sponsorship of employees for training and
//                 education.
//                 </p>
//             </div>
//             <div className="border-t-4 border-[#08131F] bg-white rounded-lg p-7 shadow-lg hover:-translate-y-1 transition-transform">
//                 <h3 className="font-[Fraunces,serif] text-xl text-[#08131F] font-bold mb-3">
//                 Regulatory Compliance
//                 </h3>
//                 <p className="text-sm text-[#2B3546] leading-relaxed">
//                 This policy has been established in accordance with the provisions of the
//                 University Grants Commission (UGC) Act 1956, and is subject to oversight from the
//                 Vikrant University Academic Council. The Vice Chancellor has the authority to
//                 interpret, amend and/or change this policy at any time.
//                 </p>
//             </div>
//             </section>

//             {/* FAQ */}
//             <section className="bg-gradient-to-br from-[#0B2036] via-[#0F2A45] to-[#1B4A63] py-20 relative overflow-hidden">
//             <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1E5F74]/20 rounded-full blur-3xl" />
//             <div className="max-w-6xl mx-auto px-6 relative">
//                 <h2 className="font-[Fraunces,serif] text-3xl text-white font-bold mb-10 text-center">
//                 Frequently Asked Questions
//                 </h2>
//                 <div className="grid md:grid-cols-2 gap-4">
//                 {FAQS.map((item, i) => {
//                     const isOpen = openFaq === i;
//                     return (
//                     <div
//                         key={item.q}
//                         className={`rounded-lg border overflow-hidden h-fit transition-colors ${
//                         isOpen
//                             ? "bg-white/[0.08] border-[#D4A72C]/50"
//                             : "bg-white/[0.04] border-white/10"
//                         }`}
//                     >
//                         <button
//                         onClick={() => setOpenFaq(isOpen ? null : i)}
//                         className="w-full flex items-center justify-between text-left px-5 py-4"
//                         >
//                         <span className="text-sm font-semibold text-white pr-4">{item.q}</span>
//                         <span
//                             className={`text-[#D4A72C] text-lg shrink-0 transition-transform ${
//                             isOpen ? "rotate-45" : ""
//                             }`}
//                         >
//                             +
//                         </span>
//                         </button>
//                         {isOpen && (
//                         <div className="px-5 pb-4 text-sm text-[#B9C6DE] leading-relaxed">
//                             {item.a}
//                         </div>
//                         )}
//                     </div>
//                     );
//                 })}
//                 </div>
//             </div>
//             </section>

//             {/* CTA */}
//             <section className="max-w-7xl mx-auto px-6 py-20">
//             <div className="bg-gradient-to-br from-[#08131F] via-[#0F2438] to-[#1E5F74] rounded-2xl px-8 py-14 text-center relative overflow-hidden">
//                 <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#D4A72C]/10 rounded-full blur-3xl" />
//                 <h2 className="relative font-[Fraunces,serif] text-2xl md:text-3xl text-white font-bold mb-3">
//                 Ready to continue your education?
//                 </h2>
//                 <p className="relative text-[#B9C6DE] text-sm max-w-xl mx-auto mb-9">
//                 Keep working, keep earning, and keep learning — apply to the Continuing Education
//                 Programme today.
//                 </p>
//                 <div className="relative flex flex-wrap justify-center gap-4">
//                 <a
//                     href="/apply-now"
//                     className="bg-[#c15304] text-[#08131F] font-bold text-sm px-7 py-3.5 rounded-full hover:bg-white transition-colors shadow-lg"
//                 >
//                     Apply Now
//                 </a>
//                 <a
//                     href="/brochure"
//                     className="border border-white/30 text-white font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors"
//                 >
//                     Download Brochure
//                 </a>
//                 <a
//                     href="/admission-notifications"
//                     className="border border-white/30 text-white font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors"
//                 >
//                     Contact for Admissions
//                 </a>
//                 </div>
//             </div>
//             </section>
//         </div>
//         <Footer />
//         </>
//     );
//     }



"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/app/layout/Header";
import Footer from "@/app/layout/Footer";

const ELIGIBLE_PROGRAMMES = [
  "Polytechnic Diploma",
  "Bachelor of Technology (B. Tech)",
  "Master of Technology (M. Tech)",
  "Master of Computer Applications (MCA)",
  "Master of Business Administration (MBA)",
  "Lateral Entry (Diploma and B. Tech)",
];

const ELIGIBILITY = [
  {
    title: "Employment Status",
    body: "The applicant should be an employee of a Registered Industry/Organization, Central Government, State Government, Public Sector Undertaking (PSU), Private/Public Limited Company, or MSME.",
  },
  {
    title: "Academic & Professional Eligibility",
    body: "To apply, the applicant must meet the minimum academic eligibility requirements of the programme they are applying to. A minimum of one year full-time / regular working experience is required.",
  },
  {
    title: "Changing Jobs After Admission",
    body: "An applicant who discontinues employment after admission may continue the programme, subject to approval by the University and fulfillment of all academic requirements.",
  },
];

const SCHEDULES = [
  "Evening Classes",
  "Weekend and Holiday Classes",
  "Hybrid Learning Model",
  "Intensive Campus Contact Programmes",
];


const FAQS = [
  {
    q: "Who can apply for the Continuing Education Programme?",
    a: "The Continuing Education Programme is open to working professionals employed by government organizations, public sector undertakings, private companies, industries, or registered business establishments, subject to meeting the eligibility requirements of the programme they wish to pursue.",
  },
  {
    q: "Can I continue working while pursuing the programme?",
    a: "Yes. The Continuing Education Programme is specifically designed for working professionals, allowing them to continue their employment while pursuing their academic studies and enhancing their professional qualifications.",
  },
  {
    q: "Which programmes are available under the Continuing Education Scheme?",
    a: "Working professionals can pursue programmes such as Polytechnic Diploma, B. Tech, M. Tech, MBA, MCA, and Lateral Entry programmes in Diploma and B. Tech, subject to the applicable eligibility criteria.",
  },
  {
    q: "What documents are required for admission?",
    a: "Applicants are required to submit their previous academic records along with valid proof of employment, such as a No Objection Certificate (NOC), Employment Certificate, or Appointment Letter. A self-declaration confirming their current employment status may also be required.",
  },
  {
    q: "Can I continue the programme if I leave my job after admission?",
    a: "Yes. A student who leaves or discontinues employment after admission may be permitted to continue the programme, subject to approval from the University and fulfillment of all applicable academic requirements.",
  },
  {
    q: "Are evening and weekend classes available?",
    a: "Yes. To support the needs of working professionals, the University provides flexible learning options that may include evening classes, weekend and holiday classes, a hybrid learning model, and intensive campus contact programmes.",
  },
  {
    q: "Is prior work experience required for admission?",
    a: "Yes. Applicants are required to have a minimum of one year of full-time or regular work experience to be eligible for admission under the Continuing Education Programme.",
  },
  {
    q: "Is the programme approved by the University and relevant authorities?",
    a: "The programmes are offered in accordance with the applicable regulations and requirements of the University and relevant statutory and regulatory authorities. The necessary approvals, recognitions, and permissions are applicable to each individual programme before its commencement.",
  },
];



export default function ContinuingEducationContent() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <Header />
      <div className="bg-slate-50 text-slate-800 font-[Inter,sans-serif]">

        {/* Hero Section */}
        <section className="relative py-12 px-6 text-center bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-wide">
              CONTINUING EDUCATION PROGRAM FOR <span className="text-amber-600">WORKING PROFESSIONALS</span>
            </h1>
            <div className="w-12 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />

            <div className="mt-8 max-w-xl mx-auto grid grid-cols-3 gap-3">
              {["B. Tech", "M. Tech", "Diploma"].map((p) => (
                <div
                  key={p}
                  className="group cursor-pointer py-4 px-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all shadow-sm"
                >
                  <p className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                    {p}
                  </p>
                  <span className="block w-4 h-[2px] bg-amber-400 mx-auto mt-1.5 group-hover:w-8 group-hover:bg-amber-500 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="border-l-4 border-amber-500 bg-white p-6 rounded-r-xl border-y border-r border-slate-200 shadow-sm">
            <p className="text-slate-700 text-base md:text-lg leading-relaxed font-medium">
            Academic success plays an important role in building a strong and successful professional career. The Continuing Education Programme for Working Professionals is designed to help individuals pursue higher education while continuing to meet their existing professional responsibilities. It provides an opportunity to enhance knowledge, develop new skills, improve academic qualifications, and stay competitive in today’s evolving professional environment. With flexible learning options, working professionals can continue their education without having to leave their jobs, allowing them to learn, grow, and progress in their careers while maintaining a balance between work and education.

            </p>
          </div>
        </section>

        {/* Eligible programmes + Image */}
        <section className="max-w-7xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="font-[Fraunces,serif] text-2xl md:text-3xl text-slate-900 font-bold mb-2">
              Eligible Academic Programmes
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              This policy is applicable to the following programmes (all branches, wherever
              applicable) offered by the University:
            </p>
            <ol className="space-y-3">
              {ELIGIBLE_PROGRAMMES.map((p, i) => (
                <li
                  key={p}
                  className="flex items-center gap-4 border border-slate-200 rounded-lg px-4 py-3 bg-white shadow-sm hover:border-amber-500 hover:shadow-md transition-all"
                >
                  {/* Purana Blue Badge Color */}
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1E5F9E] text-white font-[Fraunces,serif] text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-800 font-semibold">{p}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
             **Note:** The availability of these programmes is subject to the necessary approvals, recognitions, and permissions from the relevant statutory and regulatory authorities. Each programme will be offered only after fulfilling the applicable academic, legal, and regulatory requirements.

            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md relative bg-slate-100 min-h-[350px]">
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop"
              alt="Working professional"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Admission & Eligibility conditions */}
        <section className="bg-slate-100 py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-[Fraunces,serif] text-2xl md:text-3xl text-slate-900 font-bold mb-2">
              Admission &amp; Eligibility Conditions
            </h2>
            <p className="text-slate-600 text-sm mb-8 max-w-2xl">
              Eligibility criteria for admission in this scheme are as follows:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {ELIGIBILITY.map((e, i) => (
                <div
                  key={e.title}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-amber-500 transition-all"
                >
                  {/* Purana Gold/Yellow Badge */}
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#D4A72C] text-[#08131F] font-[Fraunces,serif] text-sm font-bold">
                    0{i + 1}
                  </span>
                  <h3 className="text-slate-900 font-bold mt-4 mb-2">{e.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{e.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Documents & Scheduling */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-[Fraunces,serif] text-2xl text-slate-900 font-bold mb-3">
              Documents Required at Admission
            </h2>
            <p className="text-sm text-slate-600 mb-4">Applicants must submit:</p>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-sm">
                {/* Purana Blue Badge Color */}
                <span className="flex items-center justify-center w-7 h-7 rounded bg-[#1E5F9E] text-white font-[Fraunces,serif] text-xs font-bold shrink-0 mt-0.5">
                  01
                </span>
                <span>Educational certificates and academic transcripts, as applicable.</span>
              </li>
              <li className="flex gap-3 items-start text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-sm">
                {/* Purana Blue Badge Color */}
                <span className="flex items-center justify-center w-7 h-7 rounded bg-[#1E5F9E] text-white font-[Fraunces,serif] text-xs font-bold shrink-0 mt-0.5">
                  02
                </span>
                <span>
                  No Objection Certificate (NOC) from the employer / Employment Certificate /
                  Appointment Letter, along with a self-declaration confirming current employment
                  status.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-[Fraunces,serif] text-2xl text-slate-900 font-bold mb-3">
              Academic Delivery &amp; Scheduling
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Flexible learning options offered to working professionals:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {SCHEDULES.map((s, i) => (
                <div
                  key={s}
                  className="flex items-center gap-3 border border-slate-200 bg-white rounded-lg px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:border-amber-500 transition-all"
                >
                  {/* Purana Blue Badge Color */}
                  <span className="flex items-center justify-center w-7 h-7 rounded bg-[#1E5F9E] text-white font-[Fraunces,serif] text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry sponsorship & compliance */}
        <section className="max-w-7xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-6">
          <div className="border-t-4 border-[#D4A72C] bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-[Fraunces,serif] text-lg text-slate-900 font-bold mb-2">
              Industry Sponsorship
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
           The University promotes strong collaboration with industries, corporate organizations, government bodies, and other professional institutions through structured partnerships and Memorandums of Understanding (MoUs). These collaborations help create opportunities for employee training, professional development, skill enhancement, and continuing education, enabling working professionals to strengthen their knowledge and advance their careers while continuing their employment.

            </p>
          </div>
          <div className="border-t-4 border-[#08131F] bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-[Fraunces,serif] text-lg text-slate-900 font-bold mb-2">
              Regulatory Compliance
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              This policy has been established in accordance with UGC Act 1956 provisions and is
              subject to oversight from the Academic Council. The Vice Chancellor holds authority to
              amend policy directives as required.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-slate-100 py-16 border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-[Fraunces,serif] text-2xl md:text-3xl text-slate-900 font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {FAQS.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={item.q}
                    className={`rounded-lg border transition-all h-fit bg-white ${
                      isOpen
                        ? "border-[#D4A72C] shadow-sm"
                        : "border-slate-200"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between text-left px-5 py-4"
                    >
                      <span className="text-sm font-semibold text-slate-900 pr-4">{item.q}</span>
                      <span className="text-[#D4A72C] font-bold text-lg shrink-0">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 text-center shadow-md">
            <h2 className="font-[Fraunces,serif] text-2xl md:text-3xl text-slate-900 font-bold mb-3">
              Ready to continue your education?
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto mb-8">
              Keep working, keep earning, and keep learning — apply to the Continuing Education
              Programme today.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="bg-[#c15304] text-white font-bold text-sm px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
              >
                Apply Now
              </Link>
              <Link
                href="/signup"
                className="bg-[#08131F] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Download Brochure
              </Link>
              <Link
                href="/signup"
                className="border border-slate-300 text-slate-700 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Contact for Admissions
              </Link>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
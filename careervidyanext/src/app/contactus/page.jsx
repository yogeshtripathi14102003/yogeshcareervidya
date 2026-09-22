


// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { MapPin, Phone, Mail } from "lucide-react";
//  import ContactBanner from "../components/ContactBanner ";

// import Getintuch from "../components/getintuch";
// import Header from "@/app/layout/Header.jsx";
// import Footer from "@/app/layout/Footer.jsx";

// export default function ContactUs() {
//   return (
//     <>
//       <Header />

//       {/* Hero Banner */}
//       <section className="relative w-full overflow-hidden">
//         <Image
//           src="/images/contact2.jpeg"
//           alt="Contact CareerVidya for educational guidance and support"
//           width={1920}
//           height={650}
//           priority
//           className="w-full h-auto block"
//           sizes="100vw"
//         />

//         {/* No opacity / no overlay */}
//         <div className="absolute inset-0 flex items-center justify-center">
//           <h1 className="text-white text-3xl sm:text-4xl md:text-6xl font-black tracking-tight drop-shadow-lg text-center px-4">
//             Get in Touch
//           </h1>
//         </div>
//       </section>

//       <main className="bg-gray-50">

//         {/* Introduction */}
//         <section
//           aria-labelledby="contact-intro"
//           className="py-14 px-4 sm:px-6 lg:px-8"
//         >
//           <div className="max-w-3xl mx-auto text-center">
//             <h2
//               id="contact-intro"
//               className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
//             >
//               We’d Love to Hear From You
//             </h2>

//             <p className="text-gray-600 text-base md:text-lg leading-relaxed">
//               Whether you have questions about online courses, university
//               admissions, career guidance, or partnership opportunities,
//               the CareerVidya team is here to help.
//             </p>
//           </div>
//         </section>

//         {/* Contact Information */}
//         <section
//           aria-label="CareerVidya contact information"
//           className="px-4 sm:px-6 lg:px-8 pb-16"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">

//             <ContactCard
//               icon={<MapPin size={34} aria-hidden="true" />}
//               title="Visit Us"
//               text="H-160, Sector 63, H Block, BSI Building, Ground Floor, Office No. 7, Noida, Uttar Pradesh - 201305"
//               link="https://maps.google.com/?cid=3481723661691813782"
//               linkText="View on Google Maps →"
//             />

//             <ContactCard
//               icon={<Phone size={34} aria-hidden="true" />}
//               title="Call Us"
//               text="Have questions about courses, admissions, or career guidance? Speak directly with our support team."
//               link="tel:+919289716667"
//               linkText="+91 9289716667"
//             />

//             <ContactCard
//               icon={<Mail size={34} aria-hidden="true" />}
//               title="Email Us"
//               text="Have a question or partnership enquiry? Send us an email and our team will get back to you."
//               link="mailto:hr@careervidya.in"
//               linkText="hr@careervidya.in"
//             />

//           </div>
//         </section>

//         {/* Google Map */}
//         <section
//           aria-labelledby="office-location"
//           className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
//         >
//           <h2
//             id="office-location"
//             className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center"
//           >
//             Our Office Location
//           </h2>

//           <div className="w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-md bg-gray-200">
//             <iframe
//               title="CareerVidya office location in Sector 63, Noida"
//               src="https://www.google.com/maps?q=28.6251888,77.3777653&z=18&output=embed"
//               width="100%"
//               height="100%"
//               style={{ border: 0 }}
//               allowFullScreen
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//             />
//           </div>
//         </section>

//         {/* Contact CTA */}
//         <ContactBanner />

//         {/* Contact Form */}
//         <Getintuch />
//       </main>

//       <Footer />
//     </>
//   );
// }

// /**
//  * Reusable Contact Card
//  */
// function ContactCard({ icon, title, text, link, linkText }) {
//   return (
//     <article className="bg-white rounded-2xl border border-blue-50 shadow-md p-7 md:p-8 text-center transition-transform duration-300 hover:-translate-y-1">

//       <div
//         className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6600] to-[#0056A4] text-white mb-5"
//         aria-hidden="true"
//       >
//         {icon}
//       </div>

//       <h3 className="text-xl font-bold text-[#0056A4] mb-3">
//         {title}
//       </h3>

//       <p className="text-gray-700 leading-relaxed mb-5">
//         {text}
//       </p>

//       <Link
//         href={link}
//         className="inline-block text-[#FF6600] font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:ring-offset-2 rounded"
//       >
//         {linkText}
//       </Link>
//     </article>
//   );
// }


"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

import ContactBanner from "../components/ContactBanner ";

import Getintuch from "../components/getintuch";
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";

export default function ContactUs() {
  return (
    <>
      <Header />

   {/* =========================================================
    HERO SECTION
========================================================= */}
<section className="relative w-full overflow-hidden">

  {/* Mobile image — apni real height ke hisaab se */}
  <div className="block md:hidden relative w-full">
    <Image
      src="/images/contact1.jpeg"
      alt="Contact CareerVidya for courses, university admissions and career guidance"
      width={750}
      height={900}
      priority
      sizes="100vw"
      className="w-full h-auto object-contain"
    />
  </div>

  {/* Desktop/Tablet image — apni real height ke hisaab se */}
  <div className="hidden md:block relative w-full">
    <Image
      src="/images/contact2.jpeg"
      alt="Contact CareerVidya for courses, university admissions and career guidance"
      width={1920}
      height={650}
      priority
      sizes="100vw"
      className="w-full h-auto object-contain"
    />
  </div>

  {/* Text readability gradient */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#002f55]/65 via-[#002f55]/25 to-transparent" />

  {/* Hero Content */}
  <div className="absolute inset-0 flex items-center">
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
      <div className="max-w-[650px]">

        {/* Small Label */}
        <p className="text-[#c15304] text-2xl sm:text-sm md:text-2xl font-bold uppercase tracking-[2px] mb-2 sm:mb-3 drop-shadow-md">
          Contact Career Vidya
        </p>

        {/* Main Heading */}
        <h1 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-[62px] font-black leading-[1.05] tracking-tight drop-shadow-xl">
          Have Questions?
          <br />
          <span className="text-[#c15304] italic">
            We’re Here to Help.
          </span>
        </h1>

        {/* Divider */}
        <div className="w-24 sm:w-32 md:w-48 h-1 md:h-2 bg-[#c15304] rounded-full my-3 sm:my-5 md:my-6" />

        {/* Description */}
        <p className="text-white text-xs sm:text-sm md:text-lg lg:text-xl font-medium leading-relaxed max-w-xl drop-shadow-lg">
          Get expert guidance on courses, universities,
          admissions, and your career journey.
        </p>

      </div>
    </div>
  </div>
</section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <main className="bg-gray-50">

        {/* =======================================================
            INTRODUCTION
        ======================================================= */}
        <section
          aria-labelledby="contact-intro"
          className="py-12 md:py-14 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto text-center">

            <h2
              id="contact-intro"
              className="text-3xl md:text-4xl font-bold text-[#05347f] mb-4"
            >
              Let’s Start a Conversation
            </h2>

            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              Our team is here to answer your questions and help you make
              informed decisions about your education and career.
            </p>

          </div>
        </section>

        {/* =======================================================
            CONTACT INFORMATION
        ======================================================= */}
        <section
          aria-labelledby="contact-information"
          className="px-4 sm:px-6 lg:px-8 pb-14 md:pb-16"
        >
          <div className="max-w-6xl mx-auto">

            <h2
              id="contact-information"
              className="sr-only"
            >
              CareerVidya Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

              {/* Visit Us */}
              <ContactCard
                icon={<MapPin size={34} aria-hidden="true" />}
                title="Visit Us"
                text="H-160, Sector 63, H Block, BSI Building, Ground Floor, Office No. 7, Noida, Uttar Pradesh - 201305"
                link="https://maps.google.com/?cid=3481723661691813782"
                linkText="View on Google Maps →"
              />

              {/* Call Us */}
              <ContactCard
                icon={<Phone size={34} aria-hidden="true" />}
                title="Call Us"
                text="Have questions about courses, admissions, or career guidance? Speak directly with our support team."
                link="tel:+919289716667"
                linkText="+91 9289716667"
              />

              {/* Email Us */}
              <ContactCard
                icon={<Mail size={34} aria-hidden="true" />}
                title="Email Us"
                text="Have a question or partnership enquiry? Send us an email and our team will get back to you."
                link="mailto:hr@careervidya.in"
                linkText="hr@careervidya.in"
              />

            </div>
          </div>
        </section>

        {/* =======================================================
            GOOGLE MAP
        ======================================================= */}
        <section
          aria-labelledby="office-location"
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 md:pb-16"
        >
          <div className="text-center mb-6">

            <h2
              id="office-location"
              className="text-2xl md:text-3xl font-bold text-[#05347f] mb-2"
            >
              Our Office Location
            </h2>

            <p className="text-gray-600">
              Visit our CareerVidya office in Sector 63, Noida.
            </p>

          </div>

          <div className="w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-md bg-gray-200">

            <iframe
              title="CareerVidya office location in Sector 63, Noida"
              src="https://www.google.com/maps?q=28.6251888,77.3777653&z=18&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

          </div>
        </section>

        {/* =======================================================
            CONTACT BANNER
        ======================================================= */}
        <ContactBanner />

        {/* =======================================================
            CONTACT FORM
        ======================================================= */}
        <Getintuch />

      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <Footer />
    </>
  );
}

/* ===============================================================
   CONTACT CARD
=============================================================== */

function ContactCard({
  icon,
  title,
  text,
  link,
  linkText,
}) {
  return (
    <article className="group bg-white rounded-2xl border border-blue-50 shadow-md p-7 md:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Icon */}
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6600] to-[#0056A4] text-white mb-5 transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-[#0056A4] mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed mb-5">
        {text}
      </p>

      {/* Link */}
      <Link
        href={link}
        className="inline-block text-[#FF6600] font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:ring-offset-2 rounded"
      >
        {linkText}
      </Link>

    </article>
  );
}
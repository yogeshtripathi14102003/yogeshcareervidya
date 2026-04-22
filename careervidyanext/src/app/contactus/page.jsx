

"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import Getintuch from "../components/getintuch";
import ContactBanner from "../components/ContactBanner ";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

// SEO metadata ko page.js mein rakhein (jaisa humne AboutUs mein kiya)
export default function ContactUs() {
  return (
    <>
      <Header />

      {/* Banner */}
      <section className="relative overflow-hidden w-full md:h-[60vh] h-[30vh]">
        <img
          src="/images/contact1.png"
          alt="Contact Career Vidya for educational guidance and support"
          className="w-full h-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          {/* SEO: Main H1 Heading */}
          <h1 className="text-white text-4xl md:text-6xl font-black drop-shadow-lg uppercase tracking-tight">
            Get in Touch
          </h1>
        </div>
      </section>

      <main className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            We’d love to hear from you!
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Whether you have a question about our courses, university admissions, or partnership opportunities — our expert team is here to help.
          </p>
        </section>

        {/* Contact Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Card Component Structure (Simplified for readability) */}
          <ContactCard 
            icon={<MapPin size={36} />} 
            title="Visit Us" 
            text="H-160, Sector 63, H Block, BSI Building, Ground Floor, Office No. 7, Noida, Uttar Pradesh - 201305"
            link="https://www.google.com/maps" 
            linkText="View on Google Maps →"
          />
          <ContactCard 
            icon={<Phone size={36} />} 
            title="Call Us" 
            text="Have questions? Call our support team directly."
            link="tel:+9112018447695" 
            linkText="+91 120 1844 7695"
          />
          <ContactCard 
            icon={<Mail size={36} />} 
            title="Contact Us" 
            text="Prefer writing? Drop an email and we’ll respond shortly."
            link="mailto:contact@careervidya.in" 
            linkText="contact@careervidya.in"
          />
        </section>

        {/* Google Map */}
        <section className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md mb-16">
          <iframe
            title="Career Vidya Office Location in Noida"
            src="https://www.google.com/maps/embed?..." // Yahan apna sahi embed link dalein
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </section>

        <ContactBanner />
        <Getintuch />
      </main>

      <Footer />
    </>
  );
}

// Helper Component for cleaner code
function ContactCard({ icon, title, text, link, linkText }) {
  return (
    <div className="rounded-2xl shadow-lg p-8 bg-white border border-blue-50 text-center hover:-translate-y-1 transition-all">
      <div className="bg-gradient-to-br from-[#FF6600] to-[#0056A4] p-4 rounded-full mb-5 inline-block text-white">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-[#0056A4] mb-3">{title}</h3>
      <p className="text-gray-700 leading-relaxed mb-4">{text}</p>
      <Link href={link} className="text-[#FF6600] font-bold hover:underline">{linkText}</Link>
    </div>
  );
}
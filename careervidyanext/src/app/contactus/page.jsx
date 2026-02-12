"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import Getintuch from "../components/getintuch";
import ContactBanner from "../components/ContactBanner ";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function ContactUs() {
  return (
    <>
      <Header />

      {/* Banner */}
      <div className="relative overflow-hidden w-auto md:h-[70vh] h-[30vh]">
        <img
          src="/images/contact1.png"
          alt="Contact Banner"
          className="w-full h-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">
            Get in Touch
          </h1>
        </div>
      </div>

      <main className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            We’d love to hear from you!
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Whether you have a question about our services, pricing, or
            partnership opportunities — we’re here to help.
          </p>
        </section>

        {/* Contact Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Visit Us */}
          <div
            className="rounded-2xl border border-transparent shadow-lg overflow-hidden transition-all duration-500
            bg-gradient-to-br from-[#FFF7F2] via-[#EAF3FF] to-[#F2FAFF]
            hover:from-[#FFF0E6] hover:to-[#E6F0FF] hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex flex-col items-center p-8 text-center">
              <div className="bg-gradient-to-br from-[#FF6600] to-[#0056A4] p-4 rounded-full mb-5">
                <MapPin className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-semibold text-[#0056A4] mb-3">
                Visit Us
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                H-160, Sector 63, H Block, BSI Building, Ground Floor, Office No.
                7, Noida, Uttar Pradesh - 201305
              </p>
              <Link
                href="https://www.google.com/maps/place/Crystal+Tower,+C+30,+Sector+63,+Noida,+Uttar+Pradesh+201301"
                target="_blank"
                className="text-[#FF6600] font-medium hover:text-[#0056A4] transition-colors"
              >
                View on Google Maps →
              </Link>
            </div>
          </div>

          {/* Call Us */}
          <div
            className="rounded-2xl border border-transparent shadow-lg overflow-hidden transition-all duration-500
            bg-gradient-to-br from-[#FFF8F2] via-[#F2F8FF] to-[#FFFFFF]
            hover:from-[#FFEFE2] hover:to-[#E6F0FF] hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex flex-col items-center p-8 text-center">
              <div className="bg-gradient-to-br from-[#FF6600] to-[#0056A4] p-4 rounded-full mb-5">
                <Phone className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-semibold text-[#0056A4] mb-3">
                Call Us
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Have any questions or need immediate support? Call our team
                directly.
              </p>
              <Link
                href="tel:+911205056981"
                className="text-[#FF6600] font-medium hover:text-[#0056A4] transition-colors"
              >
                +91 12018447695
              </Link>
            </div>
          </div>

          {/* Contact Us */}
          <div
            className="rounded-2xl border border-transparent shadow-lg overflow-hidden transition-all duration-500
            bg-gradient-to-br from-[#FFF9F5] via-[#EAF5FF] to-[#FFFFFF]
            hover:from-[#FFF1E9] hover:to-[#E6F0FF] hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex flex-col items-center p-8 text-center">
              <div className="bg-gradient-to-br from-[#FF6600] to-[#0056A4] p-4 rounded-full mb-5">
                <Mail className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-semibold text-[#0056A4] mb-3">
                Contact Us
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Prefer writing to us? Drop an email and we’ll respond as soon as
                possible.
              </p>
              <Link
                href="mailto:contact@careervidya.in"
                className="text-[#FF6600] font-medium hover:text-[#0056A4] transition-colors"
              >
                contact@careervidya.in
              </Link>
            </div>
          </div>
        </section>

        {/* Google Map */}
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md mb-16">
          <iframe
            title="Career Vidya Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14015.41717938627!2d77.3728467!3d28.6285122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce56b61db71e1%3A0x88b2e5b03e67bfa7!2sCrystal%20Tower%2C%20C%2030%2C%20Sector%2063%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1730881125301!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Get In Touch */}
        <ContactBanner />
        <Getintuch />
      </main>

      <Footer />
    </>
  );
}

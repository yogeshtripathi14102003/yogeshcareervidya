"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import Getintuch from "../components/getintuch";
import ContactBanner from "../components/ContactBanner ";

export default function ContactUs() {
  return (
    <main className="bg-gray-50 min-h-screen py-10">
      {/* Title */}
      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#0056A4] mb-2">
          Visit Our Office
        </h1>
      </section>

      {/* Google Map */}
      <div className="w-full h-[400px] mb-12">
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

      {/* Contact Info Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto text-center mb-16">
        {/* Visit Us */}
        <Link
          href="https://www.google.com/maps/place/Crystal+Tower,+C+30,+Sector+63,+Noida,+Uttar+Pradesh+201301"
          target="_blank"
          className="group bg-white rounded-2xl p-6 shadow-md border border-transparent transition-all duration-500 
                     hover:border-[#0056A4]/40 hover:shadow-[0_4px_20px_rgba(0,86,164,0.15)]
                     hover:bg-gradient-to-br hover:from-orange-50 hover:to-blue-50"
        >
          <div className="flex justify-center mb-4">
            <MapPin
              className="text-[#FF6600] transition-transform duration-500 group-hover:scale-110"
              size={32}
            />
          </div>
          <h3 className="font-semibold text-gray-800 uppercase group-hover:text-[#0056A4] transition-colors duration-500">
            Visit Us
          </h3>
          <p className="text-gray-600 mt-2 leading-relaxed">
            H-160, Sector 63, H Block, BSI Building, Ground Floor, Office No. 7,
            Noida, Uttar Pradesh - 201305
          </p>
        </Link>

        {/* Call Us */}
        <Link
          href="tel:+911205056981"
          className="group bg-white rounded-2xl p-6 shadow-md border border-transparent transition-all duration-500 
                     hover:border-[#0056A4]/40 hover:shadow-[0_4px_20px_rgba(0,86,164,0.15)]
                     hover:bg-gradient-to-br hover:from-orange-50 hover:to-blue-50"
        >
          <div className="flex justify-center mb-4">
            <Phone
              className="text-[#FF6600] transition-transform duration-500 group-hover:scale-110"
              size={32}
            />
          </div>
          <h3 className="font-semibold text-gray-800 uppercase group-hover:text-[#0056A4] transition-colors duration-500">
            Call Us
          </h3>
          <p className="text-gray-600 mt-2">+91 12018447695</p>
        </Link>

        {/* Contact Us */}
        <Link
          href="mailto:contact@careervidya.in"
          className="group bg-white rounded-2xl p-6 shadow-md border border-transparent transition-all duration-500 
                     hover:border-[#0056A4]/40 hover:shadow-[0_4px_20px_rgba(0,86,164,0.15)]
                     hover:bg-gradient-to-br hover:from-orange-50 hover:to-blue-50"
        >
          <div className="flex justify-center mb-4">
            <Mail
              className="text-[#FF6600] transition-transform duration-500 group-hover:scale-110"
              size={32}
            />
          </div>
          <h3 className="font-semibold text-gray-800 uppercase group-hover:text-[#0056A4] transition-colors duration-500">
            Contact Us
          </h3>
          <p className="text-gray-600 mt-2">contact@careervidya.in</p>
        </Link>
      </section>

      {/* Get In Touch Component */}
      <ContactBanner />
      <Getintuch />
    </main>
  );
}

"use client";

import { useEffect } from "react";

import Topbar from "@/app/WP/Topbar";
import Slider from "@/app/WP/Slider";
import Counter from "@/app/WP/Counter";
import Keyand from "@/app/WP/Keyand";
import Topuniversities from "@/app/WP/Topuniversities";
import Programand from "@/app/WP/Programand";
import Choose from "@/app/WP/Choose";
import FAQ from "@/app/WP/FAQ";
import Footer from "@/app/WP/Footer";

export default function Home() {

  // 👉 Smooth scrolling enabled globally (JS-based)
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);

  return (
    <>
      {/* TOP BAR */}
      <Topbar />

      {/* SLIDER */}
         <section id="enquire">
   <Slider />
   
         </section>
   

      {/* COUNTER */}
      <Counter />

      {/* ABOUT COURSE SECTION */}
      <section id="about">
        <Keyand />
      </section>

      {/* TOP UNIVERSITIES SECTION */}
      <section id="university">
        <Topuniversities />
      </section>

      {/* HIGHLIGHTS / PROGRAM SECTION */}
      <section id="highlights">
        <Programand />
      </section>

      {/* ENQUIRE NOW SECTION */}
      <section id="enquire">
        <Choose />
      </section>

      {/* FAQ SECTION */}
      <FAQ />

      {/* FOOTER */}
      <Footer />
    </>
  );
}

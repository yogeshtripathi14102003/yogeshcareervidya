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
import LearnersSlider from "@/app/WP/LearnersSlider";

export default function Home() {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);

  return (
    <>
      <Topbar />
      <section id="enquire">
        <Slider />
      </section>
      <Counter />
      <section id="about">
        <Keyand />
      </section>
      <section id="university">
        <Topuniversities />
      </section>
      <section id="highlights">
        <Programand />
      </section>
      <section id="enquire">
        <Choose />
      </section>
      <FAQ />
      <LearnersSlider />
      <Footer />
    </>
  );
}
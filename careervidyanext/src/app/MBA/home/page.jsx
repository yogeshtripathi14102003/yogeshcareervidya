"use client";

import Topbar from "../Topbar";
import Slider from "../slider"; // ✅ only your component
import Title from "../Title";
import Programme from "../Programme";
 import SEM from "../SEM";
 import Emi from "../Emi";
 import Footer from "../Footer";
import ContactBanner from "@/app/components/ContactBanner ";
import Counter from "@/app/components/counter/page";
import Student from "../Student";
import Imageslider from "../imageslider";
export default function MBAHome() {
  return (
    <>
      <Topbar />
      <Title />
 
      
      <Slider />
      <Programme />
      <SEM />
      <Emi />
      <ContactBanner />
      <Student />
      <Imageslider />
           <Counter />
      <Footer />
    </>
  );
}

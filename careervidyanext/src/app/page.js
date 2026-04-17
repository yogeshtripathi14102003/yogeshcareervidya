// import CardSlider from "./components/cardslider/page";
import Counter from "./components/counter/page";
import Slider from "./components/slider/page";
import TeamSection from "./components/TeamSection";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Studentimageslider from "./components/Studentimageslider";
import Getcourse from "./components/Getcourse";
import FAQ from "./components/FAQ";
import FLOW from "./components/FLOW";
import Studentstrustus from "./components/Studentstrustus";
import TestimonialsSlider from "./components/TestimonialsSlider";
import LogoSlider from "./components/LogoSlider";
  import QueryPopup from "./components/QueryPopup";
import  Universityimage  from "../app/components/universityimage";
import ChatbotFloating from "./components/ChatbotFloating";
import SocialSidebar from "./components/SocialSidebar";
import ServiceSlider from "./components/ServiceSlider";
import Notification from "../app/components/Notification";
import VideoSlider from "./components/VideoSlider";
import CareervidyaFormModal from "./components/CareervidyaFormModal";
export default function Home() {
  return (
    <div> 
      <Header />
      <Notification />
      <Slider />
      <Counter /> 
      <Getcourse  />
        <Universityimage  />
      <FLOW />
      <Studentstrustus />
         <TeamSection />
          <TestimonialsSlider />
          <Studentimageslider />
          <LogoSlider />
      <ServiceSlider />
   
       
     
   <QueryPopup />  
     
      <CareervidyaFormModal />
         
         
         {/* <CardSlider /> */}
      <VideoSlider />
      <FAQ />

      <Footer />
        <ChatbotFloating />
        <SocialSidebar />
    </div>
  );
}

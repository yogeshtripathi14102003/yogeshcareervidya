import CardSlider from "./components/cardslider/page";
import Counter from "./components/counter/page";
import Slider from "./components/slider/page";
import TeamSection from "./components/TeamSection";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Studentimageslider from "./components/Studentimageslider";
import Getcourse from "./components/Getcourse";
import FAQ from "./components/FAQ";
import FLOW from "./components/FLOW";
export default function Home() {
  return (
   <div>
<Header/>
<Slider/>
<Counter />
<Getcourse />
<FLOW />
<TeamSection />
<CardSlider />
<Studentimageslider />

<FAQ />

<Footer/>
   </div>
  );
}

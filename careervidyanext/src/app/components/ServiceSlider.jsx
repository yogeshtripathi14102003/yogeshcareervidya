"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  FaBullhorn,
  FaProjectDiagram,
  FaCogs,
  FaLaptopCode,
  FaMobileAlt,
  FaDigitalOcean,
  FaCode,
} from "react-icons/fa";

// slick styles (client only)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// disable SSR for react-slick
const Slider = dynamic(() => import("react-slick"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

/* ===================== SERVICES DATA ===================== */
const services = [
  {
    id: 1,
    title: "Digital Marketing Service",
    icon: <FaBullhorn size={60} />,
    bgColor: "bg-blue-500",
    textColor: "text-white",
  },
  {
    id: 2,
    title: "CRM Development",
    icon: <FaProjectDiagram size={60} />,
    bgColor: "bg-orange-300",
    textColor: "text-black",
  },
  {
    id: 3,
    title: "ERP Development",
    icon: <FaCogs size={60} />,
    bgColor: "bg-blue-500",
    textColor: "text-white",
  },
  {
    id: 4,
    title: "Web Development",
    icon: <FaLaptopCode size={60} />,
    bgColor: "bg-orange-300",
    textColor: "text-black",
  },
  {
    id: 5,
    title: "Mobile Development",
    icon: <FaMobileAlt size={60} />,
    bgColor: "bg-blue-500",
    textColor: "text-black",
  },
  {
    id: 6,
    title: "Digital Services",
    icon: <FaDigitalOcean size={60} />,
    bgColor: "bg-orange-300",
    textColor: "text-black",
  },
  {
    id: 7,
    title: "Software Development",
    icon: <FaCode size={60} />,
    bgColor: "bg-blue-500",
    textColor: "text-black",
  },
];

/* ===================== SLIDER COMPONENT ===================== */
const ServiceSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 0,
    pauseOnHover: false,
    cssEase: "linear",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="px-2 md:px-8">
      <Slider {...settings}>
        {services.map((service) => (
          <div key={service.id} className="px-2">
            <div
              className={`h-64 rounded-xl p-6 flex flex-col justify-center items-center ${service.bgColor}`}
            >
              <div className="mb-4">{service.icon}</div>
              <h3
                className={`text-lg font-semibold text-center ${service.textColor}`}
              >
                {service.title}
              </h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

/* ===================== MAIN COMPONENT ===================== */
const COMP = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          ".animate-left",
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".animate-left",
              start: "top 60%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="bg px-5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6">

        {/* LEFT */}
        <div className="md:col-span-4 flex flex-col justify-center text-center md:text-left">
          <div className="animate-left space-y-4 px-2 md:px-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900">
              Empowering Your Vision, Accelerating Your Growth
            </h2>
            <p className="text-base md:text-lg text-gray-700">
              Web analytics is pointless without actionable insights. Our experts
              guide you through data-driven strategies that deliver results.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-8 text-center space-y-12">
          <h2 className="text-xl md:text-4xl text-blue-900 font-semibold">
            Our Core Services
          </h2>

          <ServiceSlider />

          <button className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default COMP;

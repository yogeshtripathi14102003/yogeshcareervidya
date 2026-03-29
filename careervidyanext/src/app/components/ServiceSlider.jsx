  "use client";

  import { useState, useEffect, useRef, useMemo } from "react";
  import Image from "next/image";
  import dynamic from "next/dynamic";
  import api from "@/utlis/api.js";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { useGSAP } from "@gsap/react";

  // slick styles
  import "slick-carousel/slick/slick.css";
  import "slick-carousel/slick/slick-theme.css";

  const Slider = dynamic(() => import("react-slick"), { ssr: false });

  gsap.registerPlugin(ScrollTrigger);

  /* ===================== STATIC BANNERS ===================== */
  const staticBanners = [
    { 
      id: "static1",
      title: "IBA 2024",
      image: "/images/a4.jpg",
      isBanner: true,
    },
  
    {
      id: "static3",
      title: "IBA 2025",
      image: "/images/a5.jpeg",
      isBanner: true,
    },
    {
      id: "static4",
      title: "IBA 2023",
      image: "/images/a1.jpeg",
      isBanner: true,
    },
  ];

  /* ===================== SLIDER ===================== */
  const ServiceSlider = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
      const fetchBanners = async () => {
        try {
          const res = await api.get("/api/v1/banner");

          const stripBanners = res.data.filter(
            (b) => b.position === "STRIP"
          );

          setBanners(stripBanners);
        } catch (error) {
          console.error("Error fetching banners:", error);
        }
      };

      fetchBanners();
    }, []);

    const sliderItems = useMemo(() => {
      return [
        ...staticBanners,
        ...banners.map((banner) => ({
          id: banner._id,
          title:
            banner.title ||
            "Digital Marketing & Web Development Services",
          image:
            banner.desktopImage?.url ||
            banner.mobileImage?.url,
          isBanner: true,
        })),
      ];
    }, [banners]);

    const settings = {
      infinite: true,
      speed: 4000,
      slidesToShow: 3,
      autoplay: true,
      autoplaySpeed: 0,
      cssEase: "linear",
      arrows: false,
      pauseOnHover: true,
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 2 } },
        { breakpoint: 640, settings: { slidesToShow: 1 } },
      ],
    };

    return (
      <section
        aria-label="Our Services and Promotional Banners"
        className="px-2 md:px-8"
      >
        <Slider {...settings}>
          {sliderItems.map((item, index) => (
            <article key={item.id} className="px-2">
              <div className="h-72 md:h-80 rounded-xl overflow-hidden bg-white shadow-sm">
                
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={500}
                    height={300}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full hover:scale-105 transition duration-500"
                    priority={index === 0} // LCP optimize
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                )}

              </div>
            </article>
          ))}
        </Slider>
      </section>
    );
  };

  /* ===================== MAIN ===================== */
  const COMP = () => {
    const containerRef = useRef(null);

    useGSAP(
      () => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          gsap.fromTo(
            ".animate-left",
            { x: -80, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ".animate-left",
                start: "top 70%",
              },
            }
          );
        });

        return () => mm.revert();
      },
      { scope: containerRef }
    );

    return (
      <section
        ref={containerRef}
        className="px-5 py-8 bg-gray-50"
        aria-labelledby="services-heading"
      >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* LEFT CONTENT */}
        <div className="md:col-span-4 text-center md:text-left mt-8 md:mt-14">
            <div className="animate-left space-y-4 px-2 md:px-6">
              
              <h1
                id="services-heading"
                className="text-2xl md:text-3xl font-extrabold text-[#0056B3]"
              >
              Where Real Stories Meet Honest Truth and Real Impact.
              </h1>

              <p className="text-base md:text-l text-gray-700 text-justify ">
  Career Vidya Is Proudly Recognized with The Prestigious Indian Business Award for Transforming Student Careers Through Expert Guidance and Online Education. From Simplifying Career Choices to Creating Success Stories, We Continue to Set New Benchmarks in Career Development.
  With A Strong Network of Top Universities and Industry Experts, We Ensure Every Student Receives Personalized Guidance Tailored to Their Goals. Our Commitment Goes Beyond Admissions. We Focus on Long-Term Career Growth, Skill Development, And Real-World Opportunities. Thousands Of Learners Trust Career Vidya to Make Informed Decisions and Achieve Success with Confidence.            </p>

            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="md:col-span-8 text-center space-y-10">
            
              <h2 className="text-xl md:text-3xl font-black text-[#0056B3] uppercase tracking-tight">
            India’s Leading Career Platform Awarded at IBA
            </h2>

            <ServiceSlider />

            {/* <a
              href="/Aboutus"
              className="inline-block bg-[#c15304] text-white px-6 py-2 rounded hover:bg-[#c15304] transition"
            >
              Explore 
            </a> */}

          </div>
        </div>
      </section>
    );
  };

  export default COMP;
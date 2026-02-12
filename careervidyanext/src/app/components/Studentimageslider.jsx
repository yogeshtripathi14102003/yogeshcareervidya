"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules"; // 1. FreeMode import karein

// CSS imports
import "swiper/css";
import "swiper/css/free-mode";

export default function StudentPlacementSlider() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/api/v1/ourstudent");
        if (res.data.success) {
          setStudents(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading)
    return <div className="text-center text-white py-10">Loading...</div>;

  return (
    <section className="bg-[#001a41] text-white py-16 overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-extrabold"> 10000+ Alumni Network </h2>
        <p className="mt-2">
          <span className="bg-[#0056B3] px-4 py-1 rounded-md font-semibold">
            #VidyaHaiTohSuccessHai!
          </span>
        </p>
      </div>

      <div className="w-full">
        <Swiper
          modules={[Autoplay, FreeMode]} // 2. FreeMode add karein
          loop={true}
          speed={2000} // Speed badha di hai smoothness ke liye
          freeMode={true} // 3. Isse slide kahin bhi ruk sakti hai (fluid movement)
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          allowTouchMove={true}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 7 },
          }}
          className="smooth-swiper"
        >
          {students.map((student) => (
            <SwiperSlide key={student._id}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-md h-44">
                <img
                  src={student.image}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 4. Yeh CSS sabse important hai smoothness ke liye */}
      <style jsx global>{`
        .smooth-swiper .swiper-wrapper {
          transition-timing-function: linear !important; /* Continuous motion */
          -webkit-transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import api from "@/utlis/api.js"; 
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import "swiper/css";

// export default function StudentPlacementSlider() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const res = await api.get("/api/v1/ourstudent");
//         if (res.data.success) {
//           setStudents(res.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching students:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStudents();
//   }, []);

//   if (loading) return <div className="text-center text-white py-10">Loading...</div>;

//   return (
//     <section className="bg-[#001a41] text-white py-20 px-6 lg:px-20 overflow-hidden">
//       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        
//         {/* LEFT SIDE: Text Content */}
//         <div className="lg:w-[40%] space-y-6 text-center lg:text-left">
//           <div>
//             <h4 className="text-blue-300 font-semibold tracking-widest mb-2 text-sm uppercase">STRENGTHEN YOUR BUSINESS EDGE</h4>
//             <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
//               Empower your workforce with <br />
//               {/* <span className="text-red-500">Careervidya</span> */}
//             </h2>
//           </div>
//           <p className="text-gray-200 text-lg leading-relaxed opacity-90">
//             Discover the right skills, nurture talent, and grow a future-ready workforce. 
//             Trusted by 800+ companies worldwide.
//           </p>
//           {/* <button className="bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-md font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl">
//             Learn more
//           </button> */}
//         </div>

//         {/* RIGHT SIDE: Smooth Continuous Slider */}
//         <div className="lg:w-[60%] relative w-full">
          
//           {/* Slider Container */}
//           <div className="rounded-3xl overflow-hidden bg-[#002659] border border-blue-800/50 p-6">
//             <Swiper
//               modules={[Autoplay]}
//               loop={true}
//               speed={6000} 
//               autoplay={{
//                 delay: 0,
//                 disableOnInteraction: false,
//               }}
//               slidesPerView={1}
//               spaceBetween={25}
//               breakpoints={{
//                 480: { slidesPerView: 2 },
//                 1024: { slidesPerView: 3 }, 
//               }}
//               allowTouchMove={false}
//               className="smooth-swiper-flow"
//             >
//               {students.map((student) => (
//                 <SwiperSlide key={student._id}>
//                   {/* CARD BG: White background with slight shadow */}
//                   <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-4 h-[350px] shadow-lg transition-transform duration-300 hover:scale-[1.02]">
//                     <div className="w-full h-[85%] flex items-center justify-center overflow-hidden">
//                       <img
//                         src={student.image}
//                         alt={student.name}
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                     {/* Text changed to dark for contrast on white background */}
//                     <div className="mt-3 text-center">
//                        <p className="text-[#001a41] font-bold text-sm tracking-wide">{student.name}</p>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         .smooth-swiper-flow .swiper-wrapper {
//           transition-timing-function: linear !important;
//         }
//       `}</style>
//     </section>
//   );
// }
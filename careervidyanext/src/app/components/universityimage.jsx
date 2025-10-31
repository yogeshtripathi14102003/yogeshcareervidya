"use client";

import Image from "next/image";

export default function UniversitiesPage() {
  const universities = [
    { name: "Amity University Online", courses: 78, logo: "/logos/amity.png" },
    { name: "Jain University Online", courses: 69, logo: "/logos/jain.png" },
    { name: "DY Patil University Online", courses: 38, logo: "/logos/dypatil.png" },
    { name: "Liverpool John Moores University", courses: 28, logo: "/logos/liverpool.png" },
    { name: "Golden Gate University", courses: 35, logo: "/logos/goldengate.png" },
    { name: "MAHE Manipal Online", courses: 37, logo: "/logos/manipal.png" },
    { name: "IIM Nagpur", courses: 9, logo: "/logos/iimnagpur.png" },
    { name: "Rushford Business School", courses: 13, logo: "/logos/rushford.png" },
    { name: "IIM Indore", courses: 16, logo: "/logos/iimindore.png" },
    { name: "NMIMS Online", courses: 24, logo: "/logos/nmims.png" },
    { name: "Sanskriti University Engineering", courses: 31, logo: "/logos/sanskriti.png" },
    { name: "Birchwood University Online", courses: 108, logo: "/logos/birchwood.png" },
    { name: "Kalinga University Engineering", courses: 10, logo: "/logos/kalinga.png" },
    { name: "Manipal University Online", courses: 50, logo: "/logos/online-manipal.png" },
    { name: "LPU Online", courses: 55, logo: "/logos/lpu.png" },
    { name: "Deakin Business School Online", courses: 7, logo: "/logos/deakin.png" },
    { name: "Chandigarh University Online", courses: 64, logo: "/logos/chandigarh.png" },
    { name: "BIMTECH Online", courses: 16, logo: "/logos/bimtech.png" },
  ];

  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-4xl font-bold mb-8">
        Explore over 100 online universities & Compare on 30+ factors
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-6 lg:px-16">
        {universities.map((uni, index) => (
          <div
            key={index}
            className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center justify-center"
          >
            <div className="relative w-32 h-16 mb-4">
              <Image
                src={uni.logo}
                alt={uni.name}
                fill
                className="object-contain"
              />
            </div>
            <p className="font-semibold text-lg text-gray-800">
              {uni.courses} Courses
            </p>
            <p className="text-gray-600 mt-1 text-sm">{uni.name}</p>
          </div>
        ))}
      </div>

      <button className="mt-10 bg-[#0056B3] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#003d82] transition">
        VIEW MORE UNIVERSITIES →
      </button>
    </section>
  );
}

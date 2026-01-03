"use client";
import Image from "next/image";

const universityData = [
  {
    id: 1,
    name: "Vikrant University",
    logoSrc: "/images/vikrant.jpeg",
    rating: 4.9,
    specializations: [
      "Civil Engineering",
      "Electrical Engineering",
      "Mechanical Engineering",
    ],
    duration: "3 Year",
    emi: "6000",
  },
  {
    id: 2,
    name: "Dr Priteeglobal university",
    logoSrc: "/images/drpatil.png",
    rating: 4.6,
    specializations: [
      "Computer Science Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Electrical Engineering",
    ],
    duration: "3 Year",
    emi: "6000",
  },
  {
    id: 3,
    name: "Glocal University",
    logoSrc: "/images/glocal.png",
    rating: 4.5,
    specializations: [
      "Civil Engineering",
      "Computer Science Engineering",
      "Electronics & Communication Engineering",
    ],
    duration: "3 Year",
    emi: "7000",
  },
  // {
  //   id: 4,
  //   name: "Lingaya's University",
  //   logoSrc: "/images/lingag.jpg",
  //   rating: 4.3,
  //   specializations: [
  //     "Civil Engineering",
  //     "Computer Science Engineering",
  //     "Electronics & Communication Engineering",
  //     "Mechanical Engineering",
  //   ],
  //   duration: "3 Year",
  //   emi: "8000",
  // },
];

const UniversityCard = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 mx-2">

      {/* Logo + Rating */}
      <div className="relative mb-6">
        <div className="w-full h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border">
          <Image
            src={data.logoSrc}
            alt={data.name}
            width={200}
            height={60}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
        </div>

        {/* Rating */}
        <div className="absolute right-3 -bottom-3 bg-gray-100 px-3 py-1 rounded-full flex items-center shadow text-sm font-semibold">
          ⭐ {data.rating}/5
        </div>
      </div>

      {/* Specs */}
      <p className="font-bold text-lg mb-2">Specialization Offered</p>

      <div className="border p-3 rounded-lg max-h-28 overflow-y-auto custom-scrollbar">
        {data.specializations.map((spec, index) => (
          <div key={index} className="flex items-center text-gray-800 mb-1 text-[15px]">
            <input type="checkbox" checked readOnly className="mr-2 accent-blue-600" />
            {spec}
          </div>
        ))}
      </div>

      {/* Duration + EMI */}
      <div className="mt-6">
        <p className="font-semibold">
          Duration: <span className="text-blue-600">{data.duration}</span>
        </p>
        <p className="font-semibold mt-1">
          EMI Starting: <span className="text-blue-600">₹ {data.emi}/Month</span>
        </p>
      </div>
    </div>
  );
};

export default function UniversitySelector() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

        {/* Title Margin Perfect */}
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-14">
          Universities You Can Choose From
        </h2>

        {/* Grid with good spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {universityData.map((uni) => (
            <UniversityCard key={uni.id} data={uni} />
          ))}
        </div>

      </div>
    </section>
  );
}

"use client";

import Image from "next/image";

const cards = [
  {
    id: 1,
    title: "Web Development",
    image: "/images/i2.jpeg",
  },
  {
    id: 2,
    title: "App Development",
    image: "/images/i6.jpeg",
  },
  {
    id: 3,
    title: "UI/UX Design",
    image: "/images/i4.jpeg",
  },
];

export default function HoverCards() {
  return (
    <div className="relative w-full h-[500px]">
      {/* Background */}
      <Image
        src="/images/CU png.png"
        alt="bg"
        fill
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group relative w-[320px] h-[400px] bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* TEXT (slides up & hide) */}
              <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold z-10 transform transition-all duration-500 group-hover:-translate-y-full">
                {card.title}
              </div>

              {/* IMAGE (slides from bottom) */}
              <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center p-4">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* optional overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
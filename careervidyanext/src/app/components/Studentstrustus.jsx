"use client";

import Image from "next/image";

export default function WhyStudentsTrustUs() {
  const features = [
  
      {
      icon: "/icons/export.png",
      title: "#1 Application Platform for Students",
      description:
        "Simplify your admission journey — apply to top universities in minutes through our trusted and efficient platform.",
    },
     {
      icon: "/icons/gudence.png",
      title: "Learning Flexibility",
      description:
        "Explore programs that allow you to learn anytime, anywhere — perfect for working professionals and students with busy schedules.",
    },
     {
      icon: "/icons/Recommendation.png",
      title: "Course Recommendation",
      description:
        "We match your career aspirations with industry-relevant, accredited programs that enhance employability and growth.",
    },
     {
      icon: "/icons/Assistance.png",
      title: "University Selection Assistance",
      description:
        "Get access to top-ranked and recognized universities offering flexible online and distance programs.",
    },
      {
      icon: "/icons/end.png",
      title: "End-to-End Assistance",
      description:
        "From choosing the right path to completing your program successfully, we’re with you every step of the way.",
    },
  
    {
      icon: "/icons/callsupport.png",
      title: "24/7 Support",
      description:
        "Career Vidya offers round-the-clock tech support, online mentoring, and tutoring to assist you anytime you need help.",
    },
    // {
    //   icon: "/icons/export.png",
    //   title: "Expert Guidance",
    //   description:
    //     "Our experienced mentors provide personalized career and education guidance, helping you align your academic and career goals effectively.",
    // },
    // {
    //   icon: "/icons/gudence.png",
    //   title: "Career Guidance & Counselling",
    //   description:
    //     "Personalized support to help you choose the right course and university based on your background, goals, and interests.",
    // },
   
   
    // {
    //   icon: "/icons/admission.png",
    //   title: "Admission Support",
    //   description:
    //     "Hassle-free guidance through the entire admission process — from application to enrolment, all made simple.",
    // },
   
  
  ];

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-semibold text-center mb-12">
          Why{" "}
          <span className="text-[#0056B3] font-bold italic">
            Students Trust
          </span>{" "}
          Us
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white border border-transparent rounded-xl p-6 shadow-sm transition-all duration-300 hover:border-[#0056B3] hover:bg-gradient-to-br hover:from-[#FFF5EE] hover:to-[#E6F0FF] hover:shadow-[0_4px_12px_rgba(0,86,179,0.15)]"
            >
              {/* Icon */}
              <div className="flex justify-start mb-3">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mb-2 text-[#0056B3]">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>

              {/* Blue border animation (subtle) */}
              <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[#0056B3] transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

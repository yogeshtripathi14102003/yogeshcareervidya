// components/Footer.jsx
import Image from "next/image";

export default function Footer() {
  const universities = [
    "Amity University Online",
    "Chandigarh University Online",
    "OP Jindal Global Online",
    "DY Patil University Online",
    "GLA University Online",
    "Kurukshetra University Online",
  ];

  const courses = [
    "Online B.Tech",
    "B.Tech Lateral Entry",
    "Online MBA",
    "Online MCA",
    "Online BCA",
    "Online BBA",
  ];

  const socials = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/career-vidya/",
      img: "/images/i5.png",
    },
    {
      name: "X",
      url: "https://x.com/CareerVidya",
      img: "/images/i4.png",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/career_vidya/",
      img: "/images/i3.png",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/Career-Vidya",
      img: "/images/i2.png",
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@careervidya02",
      img: "/images/i1.png",
    },
  ];

  return (
    <footer className="bg-[#1f1f1f] text-white py-14">
      <div className="max-w-7xl mx-auto px-6">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-300 text-sm mb-10">

          {/* SOCIAL ICONS */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Follow Us
            </h3>
            <div className="flex gap-3">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-full hover:scale-110 transition"
                >
                  <Image
                    src={social.img}
                    alt={social.name}
                    width={24}
                    height={24}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* UNIVERSITIES */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Universities
            </h3>
            <ul className="space-y-2">
              {universities.map((uni, index) => (
                <li
                  key={index}
                  className="hover:text-white transition cursor-pointer"
                >
                  {uni}
                </li>
              ))}
            </ul>
          </div>

          {/* COURSES */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Courses
            </h3>
            <ul className="space-y-2">
              {courses.map((course, index) => (
                <li
                  key={index}
                  className="hover:text-white transition cursor-pointer"
                >
                  {course}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}
        <p className="text-center text-gray-400 text-sm">
          © 2026 Careervidya, Inc. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
}

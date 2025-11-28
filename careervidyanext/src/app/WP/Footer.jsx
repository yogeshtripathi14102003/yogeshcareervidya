// components/Footer.jsx

export default function Footer() {
  const column1 = [
"   AICTE–approved part-time B.Tech programs",

"Lateral entry admission for B.Tech",

"Distance learning B.Tech courses",

"B.Tech through online distance mode",

"Part-time B.Tech colleges list",

"B.Tech lateral entry after diploma",

"Open university B.Tech engineering program",

"Direct 2nd-year B.Tech lateral entry",

"Top colleges for B.Tech lateral entry",

"Part-time B.Tech courses for diploma holders",

"Part-time B.Tech after completing diploma",

"Nearby evening B.Tech colleges",

"Online B.Tech degree programs",

"Direct admission to 2nd-year engineering",

"Correspondence B.Tech for diploma holders",

"Evening-mode B.Tech degree programs",
  ];

  const column2 = [
   "Online B.Tech degree through distance mode",
"B.Tech online learning programs",

"Distance education B.Tech courses",
"DSY engineering admission 2025",

"Online B.Tech degree program",

"B.Tech through online mode",

"Part-time B.Tech course options",

"B.Tech through distance education",
"Diploma to B.Tech lateral entry",
"B.Tech lateral entry program",

"B.Tech lateral entry admission guide",


  ];

  const column3 = [
    "distance btech after diploma",
    "distance btech course",
    "distance b tech aicte approved",
    "b tech distance education universities",
    "b tech part time colleges near me",
    "part time btech for diploma holders",
    "online btech in mechanical engineering",
    "b tech evening colleges",
    "online btech courses",
    "b tech online admission",
    "engineering direct second year admission",
    "direct 2nd year engineering admission",
    "b tech lateral entry direct admission",
    "b tech lateral",
    "b tech admission lateral entry",
  ];

  return (
    <footer className="bg-[#1f1f1f] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TITLE */}
        <h2 className="text-2xl font-semibold mb-6">Top Query</h2>

        {/* 3 COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-gray-300 leading-relaxed">

          {/* COLUMN 1 */}
          <ul className="space-y-1">
            {column1.map((item, index) => (
              <li key={index} className="list-disc ml-5">{item}</li>
            ))}
          </ul>

          {/* COLUMN 2 */}
          <ul className="space-y-1">
            {column2.map((item, index) => (
              <li key={index} className="list-disc ml-5">{item}</li>
            ))}
          </ul>

          {/* COLUMN 3 */}
          <ul className="space-y-1">
            {column3.map((item, index) => (
              <li key={index} className="list-disc ml-5">{item}</li>
            ))}
          </ul>

        </div>

        {/* LINE */}
        <div className="my-10 border-t border-gray-600" />

        {/* COPYRIGHT */}
        <p className="text-center text-gray-400">
          © 2025 Careervidya, Inc. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

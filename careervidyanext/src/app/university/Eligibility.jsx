

// "use client";

// import { useEffect, useState } from "react";
// import api from "@/utlis/api";
// import Image from "next/image";
// import {
//   Globe,
//   Headset,
//   UserCheck,
//   CreditCard,
//   GraduationCap,
//   Briefcase,
//   Users,
//   Award,
//   FileText,
//   BookOpen,
//   Search,
//   CheckCircle2,
//   Download // Naya icon download ke liye
// } from "lucide-react";

// const getSmartIcon = (text) => {
//   const t = text.toLowerCase();
//   if (t.includes("flexible") || t.includes("university")) return Globe;
//   if (t.includes("counselling") || t.includes("expert")) return Headset;
//   if (t.includes("one-on-one") || t.includes("advisor")) return UserCheck;
//   if (t.includes("emi") || t.includes("payment")) return CreditCard;
//   if (t.includes("loan") || t.includes("scholarship")) return GraduationCap;
//   if (t.includes("placement") || t.includes("job")) return Briefcase;
//   if (t.includes("alumni") || t.includes("network")) return Users;
//   if (t.includes("verified") || t.includes("degree")) return Award;
//   if (t.includes("admission") || t.includes("documentation")) return FileText;
//   if (t.includes("academic") || t.includes("post-admission")) return BookOpen;
//   if (t.includes("transparent") || t.includes("unbiased")) return Search;
//   return CheckCircle2;
// };

// export default function OnlineExamPattern({ slug }) {
//   const [data, setData] = useState({
//     universityName: "",
//     shareDescription: "",
//     cardDescription: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [hoveredIndex, setHoveredIndex] = useState(null);

//   useEffect(() => {
//     if (!slug) return;
//     api.get(`/api/v1/university/slug/${slug}`)
//       .then((res) => {
//         setData({
//           universityName: res.data?.data?.name || "",
//           shareDescription: res.data?.data?.shareDescription || "",
//           cardDescription: res.data?.data?.cardDescription || "",
//         });
//       })
//       .finally(() => setLoading(false));
//   }, [slug]);

//   if (loading) return null;

//   const renderPoints = (text) => {
//     const lines = text.split("\n").filter(Boolean);
//     if (!lines.length) return null;

//     const firstLine = lines[0];
//     const remainingLines = lines.slice(1);

//     return (
//       <div style={{ marginBottom: "20px" }}>
//         <p style={{
//             fontSize: "17px",
//             fontWeight: 500,
//             color: "#4b5563",
//             marginBottom: "15px", 
//             lineHeight: "1.6",
//           }}>
//           {firstLine}
//         </p>

//         <div style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
//             gap: "16px",
//           }}>
//           {remainingLines.map((point, index) => {
//             const Icon = getSmartIcon(point);
//             const isHovered = hoveredIndex === index;

//             return (
//               <div
//                 key={index}
//                 onMouseEnter={() => setHoveredIndex(index)}
//                 onMouseLeave={() => setHoveredIndex(null)}
//                 style={{
//                   position: "relative",
//                   padding: "14px 18px",
//                   borderRadius: "12px",
//                   background: "#ffffff",
//                   transition: "all 0.3s ease",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "14px",
//                   boxShadow: isHovered
//                     ? "0 8px 20px rgba(30,58,138,0.15)"
//                     : "0 2px 8px rgba(0,0,0,0.04)",
//                   border: "1.5px solid",
//                   borderColor: isHovered ? "#1e3a8a" : "#e5e7eb", 
//                 }}
//               >
//                 <div style={{
//                     minWidth: "34px",
//                     height: "34px",
//                     borderRadius: "8px",
//                     background: "#1e3a8a",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: "#fff",
//                     flexShrink: 0,
//                     transition: "transform 0.3s ease",
//                     transform: isHovered ? "scale(1.05)" : "scale(1)"
//                   }}>
//                   <Icon size={16} strokeWidth={2.5} />
//                 </div>

//                 <p style={{
//                     fontSize: "14.5px",
//                     lineHeight: "1.4",
//                     fontWeight: 500,
//                     color: "#374151",
//                     margin: 0
//                   }}>
//                   {point}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <section style={{ background: "#fcfdff", padding: "50px 16px" }}>
//       <div style={{ maxWidth: "1200px", margin: "auto" }}>
        
//         {/* HEADING SECTION WITH BUTTON */}
//         <div style={{ 
//           display: "flex", 
//           justifyContent: "space-between", 
//           alignItems: "center", 
//           flexWrap: "wrap",
//           gap: "20px",
//           marginBottom: "25px" 
//         }}>
//           <h2 style={{
//               fontSize: "30px",
//               fontWeight: 800,
//               color: "#111827",
//               letterSpacing: "-0.5px",
//               margin: 0
//             }}>
//             {data.universityName} With Career Vidya Benefits
//           </h2>

//           {/* DOWNLOAD BUTTON */}
//           <button 
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//               backgroundColor: "#c15304", // Dark Orange/Brown matching your AuthModal
//               color: "white",
//               padding: "12px 24px",
//               borderRadius: "50px",
//               fontSize: "15px",
//               fontWeight: "700",
//               border: "none",
//               cursor: "pointer",
//               boxShadow: "0 4px 15px rgba(224, 231, 25, 0.3)",
//               transition: "all 0.3s ease",
//             }}
//             onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c15304"}
//             onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#c15304"}
//             onClick={() => alert("Brochure Download Starting...")}
//           >
//             <Download size={18} />
//             Download Brochure
//           </button>
//         </div>

//         <div style={{ display: "grid", gap: "10px" }}>
//           {data.shareDescription && renderPoints(data.shareDescription)}
//           {data.cardDescription && renderPoints(data.cardDescription)}
//         </div>

//         <div style={{ marginTop: "40px" }}>
//           <Image
//             src="/images/wpuni.webp"
//             alt="Career Vidya Benefits"
//             width={1400}
//             height={400}
//             style={{
//               borderRadius: "12px",
//               width: "100%",
//               height: "auto",
//               boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
//             }}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";
import Image from "next/image";
import {
  Globe,
  Headset,
  UserCheck,
  CreditCard,
  GraduationCap,
  Briefcase,
  Users,
  Award,
  FileText,
  BookOpen,
  Search,
  CheckCircle2,
  Download
} from "lucide-react";

const getSmartIcon = (text) => {
  const t = text.toLowerCase();
  if (t.includes("flexible") || t.includes("university")) return Globe;
  if (t.includes("counselling") || t.includes("expert")) return Headset;
  if (t.includes("one-on-one") || t.includes("advisor")) return UserCheck;
  if (t.includes("emi") || t.includes("payment")) return CreditCard;
  if (t.includes("loan") || t.includes("scholarship")) return GraduationCap;
  if (t.includes("placement") || t.includes("job")) return Briefcase;
  if (t.includes("alumni") || t.includes("network")) return Users;
  if (t.includes("verified") || t.includes("degree")) return Award;
  if (t.includes("admission") || t.includes("documentation")) return FileText;
  if (t.includes("academic") || t.includes("post-admission")) return BookOpen;
  if (t.includes("transparent") || t.includes("unbiased")) return Search;
  return CheckCircle2;
};

export default function OnlineExamPattern({ slug }) {
  const [data, setData] = useState({
    universityName: "",
    shareDescription: "",
    cardDescription: "",
  });

  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (!slug) return;
    api.get(`/api/v1/university/slug/${slug}`)
      .then((res) => {
        setData({
          universityName: res.data?.data?.name || "",
          shareDescription: res.data?.data?.shareDescription || "",
          cardDescription: res.data?.data?.cardDescription || "",
        });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return null;

  const renderPoints = (text) => {
    const lines = text.split("\n").filter(Boolean);
    if (!lines.length) return null;

    const firstLine = lines[0];
    const remainingLines = lines.slice(1);

    return (
      <div style={{ marginBottom: "20px" }}>
        <p style={{
          fontSize: "16px",
          fontWeight: 500,
          color: "#4b5563",
          marginBottom: "12px",
          lineHeight: "1.5",
        }}>
          {firstLine}
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", // 🔥 fix
          gap: "12px",
        }}>
          {remainingLines.map((point, index) => {
            const Icon = getSmartIcon(point);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: isHovered
                    ? "0 6px 16px rgba(30,58,138,0.12)"
                    : "0 2px 6px rgba(0,0,0,0.04)",
                  border: "1px solid",
                  borderColor: isHovered ? "#1e3a8a" : "#e5e7eb",
                }}
              >
                <div style={{
                  minWidth: "30px",
                  height: "30px",
                  borderRadius: "6px",
                  background: "#1e3a8a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}>
                  <Icon size={14} />
                </div>

                <p style={{
                  fontSize: "13.5px",
                  lineHeight: "1.4",
                  fontWeight: 500,
                  color: "#374151",
                  margin: 0
                }}>
                  {point}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section style={{ background: "#fcfdff", padding: "30px 12px" }}>
      <div style={{ maxWidth: "1200px", margin: "auto" }}>

        {/* HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px"
        }}>
          <h2 style={{
            fontSize: "clamp(20px, 5vw, 30px)", // 🔥 responsive font
            fontWeight: 800,
            color: "#111827",
            margin: 0
          }}>
            {data.universityName} With Career Vidya Benefits
          </h2>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#c15304",
              color: "white",
              padding: "10px 18px",
              borderRadius: "40px",
              fontSize: "14px",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              width: "100%", // 🔥 mobile full width
              maxWidth: "220px"
            }}
          >
            <Download size={16} />
            Download Brochure
          </button>
        </div>

        <div style={{ display: "grid", gap: "10px" }}>
          {data.shareDescription && renderPoints(data.shareDescription)}
          {data.cardDescription && renderPoints(data.cardDescription)}
        </div>

        <div style={{ marginTop: "30px" }}>
          <Image
            src="/images/wpuni.webp"
            alt="Career Vidya Benefits"
            width={1400}
            height={400}
            style={{
              borderRadius: "10px",
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      </div>
    </section>
  );
}
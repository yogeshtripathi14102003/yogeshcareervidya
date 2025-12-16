// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import api from "@/utlis/api"; // ✅ your axios instance

// export default function MemberDetailPage() {
//   const { id } = useParams();

//   const [member, setMember] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!id) return;

//     const fetchMember = async () => {
//       try {
//         const res = await api.get(`/api/v1/team/${id}`);
//         setMember(res.data); // 👈 backend response
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load member details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMember();
//   }, [id]);

//   if (loading) {
//     return <p style={styles.center}>Loading profile...</p>;
//   }

//   if (error) {
//     return <p style={{ ...styles.center, color: "red" }}>{error}</p>;
//   }

//   if (!member) {
//     return <p style={styles.center}>Member not found</p>;
//   }

//   return (
//     <div style={styles.container}>
//       {/* ================= HEADER ================= */}
//       <div style={styles.headerBox}>
//         <div style={styles.headerContent}>
//           <img
//             src={member.image || "/images/placeholder.jpg"}
//             alt={member.name}
//             style={styles.profileImage}
//           />

//           <div style={styles.details}>
//             <h1 style={styles.name}>{member.name}</h1>
//             <p style={styles.subtitle}>{member.designation}</p>
//             <p style={styles.location}>{member.location}</p>
//           </div>

//           <button style={styles.messageButton}>Send Message</button>
//         </div>
//       </div>

//       {/* ================= BODY ================= */}
//       <div style={styles.bodyGrid}>
//         {/* LEFT COLUMN */}
//         <div>
//           <div style={styles.infoBox}>
//             <h2 style={styles.sectionTitle}>Professional Bio</h2>
//             <div style={styles.bioExperience}>
//               {member.experience} years experience
//             </div>
//             <p style={styles.bioText}>{member.description}</p>
//           </div>

//           <div style={styles.infoBox}>
//             <h2 style={styles.sectionTitle}>Expertise</h2>
//             <p style={styles.bioText}>{member.expertise}</p>
//           </div>
//         </div>

//         {/* RIGHT COLUMN */}
//         <div>
//           <div style={styles.infoBox}>
//             <h2 style={styles.sectionTitle}>Key Professional Details</h2>
//             <ul style={styles.detailList}>
//               <li style={styles.detailListItem}>
//                 <strong>Fee per Session:</strong> ₹{member.fee}
//               </li>
//               <li style={styles.detailListItem}>
//                 <strong>Mobile:</strong> {member.mobileNumber}
//               </li>
//               <li style={styles.detailListItem}>
//                 <strong>Education:</strong> {member.education}
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= STYLES ================= */

// const styles = {
//   container: {
//     fontFamily: "Arial, sans-serif",
//     padding: "20px",
//     backgroundColor: "#f5f7f9",
//   },
//   center: {
//     textAlign: "center",
//     marginTop: "50px",
//     fontSize: "16px",
//   },
//   headerBox: {
//     backgroundColor: "#fff",
//     borderRadius: "8px",
//     border: "1px solid #e0e0e0",
//     padding: "20px",
//     marginBottom: "20px",
//   },
//   headerContent: {
//     display: "flex",
//     alignItems: "center",
//   },
//   profileImage: {
//     width: "120px",
//     height: "120px",
//     borderRadius: "50%",
//     objectFit: "cover",
//     marginRight: "20px",
//     border: "2px solid #ddd",
//   },
//   details: {
//     flexGrow: 1,
//   },
//   name: {
//     margin: 0,
//     fontSize: "24px",
//     fontWeight: "600",
//   },
//   subtitle: {
//     margin: "5px 0",
//     fontSize: "16px",
//     color: "#333",
//   },
//   location: {
//     fontSize: "14px",
//     color: "#666",
//   },
//   messageButton: {
//     backgroundColor: "#0070c7",
//     color: "#fff",
//     border: "none",
//     padding: "10px 18px",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },
//   bodyGrid: {
//     display: "grid",
//     gridTemplateColumns: "2fr 1fr",
//     gap: "20px",
//   },
//   infoBox: {
//     backgroundColor: "#fff",
//     padding: "15px",
//     borderRadius: "8px",
//     border: "1px solid #e0e0e0",
//     marginBottom: "20px",
//   },
//   sectionTitle: {
//     fontSize: "16px",
//     fontWeight: "bold",
//     marginBottom: "10px",
//     borderBottom: "2px solid #0070c7",
//     paddingBottom: "5px",
//   },
//   bioExperience: {
//     textAlign: "right",
//     fontSize: "13px",
//     color: "#888",
//     marginBottom: "10px",
//   },
//   bioText: {
//     fontSize: "14px",
//     lineHeight: "1.6",
//     color: "#444",
//   },
//   detailList: {
//     listStyle: "none",
//     padding: 0,
//     margin: 0,
//     fontSize: "14px",
//   },
//   detailListItem: {
//     marginBottom: "10px",
//     borderBottom: "1px dotted #eee",
//     paddingBottom: "5px",
//   },
// };




"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utlis/api";
import Header from "@/app/layout/Header";
import Footer from "@/app/layout/Footer";

export default function TeamDetailPage() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMentor = async () => {
      try {
        const res = await api.get(`/api/v1/team/${id}`);
        setMentor(res.data.data || res.data);
      } catch (err) {
        console.error("Get by ID error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [id]);

  if (loading) {
    return <div className="py-32 text-center">Loading...</div>;
  }

  if (!mentor) {
    return <div className="py-32 text-center">Counsellor not found</div>;
  }

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto py-10 px-4">
        <img
          src={mentor.image || "/images/default-avatar.png"}
          className="w-40 h-40 rounded-xl object-cover"
        />

        <h1 className="text-3xl font-bold mt-4">{mentor.name}</h1>
        <p className="text-gray-600">{mentor.designation}</p>

        <p className="mt-4 text-gray-700">{mentor.description}</p>

        <div className="mt-4 space-y-1 text-sm">
          <p><b>Experience:</b> {mentor.experience} years</p>
          <p><b>Location:</b> {mentor.location}</p>
          <p><b>Fee:</b> ₹{mentor.fee || "Free"}</p>
          <p><b>Mobile:</b> {mentor.mobileNumber}</p>
        </div>
      </div>

      <Footer />
    </>
  );
}

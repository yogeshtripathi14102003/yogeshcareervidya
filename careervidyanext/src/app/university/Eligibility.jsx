

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
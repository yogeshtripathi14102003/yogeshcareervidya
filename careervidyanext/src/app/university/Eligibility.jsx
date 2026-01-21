"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";
import {
  CheckCircle,
  Star,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const icons = [
  CheckCircle,
  Star,
  ShieldCheck,
  GraduationCap,
  Sparkles,
];

export default function OnlineExamPattern({ slug }) {
  const [data, setData] = useState({
    universityName: "",
    shareDescription: "",
    cardDescription: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    api.get(`/api/v1/university/slug/${slug}`).then((res) => {
      setData({
        universityName: res.data?.data?.name || "",
        shareDescription: res.data?.data?.shareDescription || "",
        cardDescription: res.data?.data?.cardDescription || "",
      });
      setLoading(false);
    });
  }, [slug]);

  if (loading) return null;

  const renderPoints = (text) => {
    const lines = text.split("\n").filter((p) => p.trim() !== "");

    if (lines.length === 0) return null;

    const firstLine = lines[0];
    const remainingLines = lines.slice(1);

    return (
      <div>
        {/* First line as description */}
        <p
          style={{
            fontSize: "18px",
            fontWeight: 500,
            color: "#51575eff",
            marginBottom: "20px",
          }}
        >
          {firstLine}
        </p>

        {/* Remaining points as cards */}
        <div style={{ display: "grid", gap: "20px" }}>
          {remainingLines.map((point, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "20px",
                  borderRadius: "16px",
                  cursor: "pointer",
                  background: "#ffffff",
                  transition: "all 0.35s ease",
                  border: "1px solid #e5e7eb",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 18px 40px rgba(37,99,235,0.25)";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #f0f6ff, #ffffff)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.background = "#ffffff";
                }}
              >
                {/* Icon Badge */}
                <div
                  style={{
                    minWidth: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #2563eb, #60a5fa)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    boxShadow: "0 6px 16px rgba(37,99,235,0.35)",
                  }}
                >
                  <Icon size={22} />
                </div>

                {/* Text */}
                <p
                  style={{
                    fontSize: "18px",
                    lineHeight: "1.65",
                    fontWeight: 600,
                    color: "#1f2937",
                  }}
                >
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
    <section
      style={{
        background:
          "linear-gradient(180deg, #f8fbff 0%, #ffffff 60%)",
        padding: "80px 16px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "auto" }}>
        <h2
          style={{
            fontSize: "36px",
            fontWeight: 700,
            marginBottom: "48px",
            color: "#111827",
          }}
        >
          Why {data.universityName} With Career Vidya?
        </h2>

        <div style={{ display: "grid", gap: "30px" }}>
          {data.shareDescription && renderPoints(data.shareDescription)}
          {data.cardDescription && renderPoints(data.cardDescription)}
        </div>
      </div>
    </section>
  );
}

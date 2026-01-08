"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utlis/api";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ids) return;

    const fetchCompare = async () => {
      try {
        const res = await api.get(`/api/v1/compare?ids=${ids}`);
        setData(res.data.data);
      } catch (err) {
        console.error("Compare error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompare();
  }, [ids]);

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">University Comparison</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((uni) => (
          <div key={uni._id} className="border p-4 rounded-lg bg-white">
            <img
              src={uni.universityImage}
              alt={uni.name}
              className="h-24 mx-auto object-contain mb-4"
            />
            <h2 className="font-bold text-center">{uni.name}</h2>

            <p className="text-sm mt-2">
              <strong>Courses:</strong> {uni.courses?.length || 0}
            </p>

            <p className="text-sm mt-1">
              <strong>Approvals:</strong>{" "}
              {Array.isArray(uni.approvals)
                ? uni.approvals.join(", ")
                : "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

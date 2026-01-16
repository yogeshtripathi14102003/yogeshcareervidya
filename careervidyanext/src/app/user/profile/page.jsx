"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/utlis/api";
import { Loader2, User } from "lucide-react";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token =
        localStorage.getItem("usertoken") ||
        Cookies.get("usertoken");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await api.get("/api/v1/students/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.student);
      } catch (err) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const formatDateTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1889b9]" />
        <span className="ml-2 text-sm text-gray-500">
          Loading profile...
        </span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 p-6 border-b bg-[#1889b9]/10 rounded-t-2xl">
          <div className="h-12 w-12 rounded-xl bg-[#1889b9] text-white flex items-center justify-center">
            <User size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {user.name}
            </h2>
            <p className="text-xs text-gray-500">
              Student Profile
            </p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="p-6 text-sm space-y-3">
          <ProfileRow label="Email" value={user.email} />
          <ProfileRow label="Mobile" value={user.mobileNumber} />
          <ProfileRow label="Course" value={user.course} />
          <ProfileRow label="Branch" value={user.branch} />
          <ProfileRow label="City" value={user.city} />
          <ProfileRow label="State" value={user.state} />
          <ProfileRow label="Gender" value={user.gender} />
          <ProfileRow
            label="Offer Applied"
            value={user.subsidyCoupon || "-"}
          />
          <ProfileRow
            label="Registered On"
            value={formatDateTime(user.createdAt)}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= ROW ================= */

const ProfileRow = ({ label, value }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="text-gray-500">{label}</div>
    <div className="font-medium text-gray-800">
      {value || "-"}
    </div>
  </div>
);

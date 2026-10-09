
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/utlis/api";
import {
  Loader2,
  User,
  Mail,
  Phone,
  BookOpen,
  GitBranch,
  MapPin,
  Map,
  Venus,
  TicketPercent,
  CalendarDays,
  ArrowLeft,
} from "lucide-react";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token =
        localStorage.getItem("accessToken") ||
        Cookies.get("accessToken");

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

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-[#1889b9]" />
        <span className="text-sm text-slate-500">
          Loading profile...
        </span>
      </div>
    );
  }

  if (!user) return null;

  const details = [
    { label: "Full Name", value: user.name, icon: User },
    { label: "Email Address", value: user.email, icon: Mail },
    { label: "Mobile Number", value: user.mobileNumber, icon: Phone },
    { label: "Course", value: user.course, icon: BookOpen },
    { label: "Branch", value: user.branch, icon: GitBranch },
    { label: "City", value: user.city, icon: MapPin },
    { label: "State", value: user.state, icon: Map },
    { label: "Gender", value: user.gender, icon: Venus },
    {
      label: "Offer Applied",
      value: user.subsidyCoupon,
      icon: TicketPercent,
    },
    {
      label: "Registered On",
      value: formatDateTime(user.createdAt),
      icon: CalendarDays,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f7fa] px-3 py-5 sm:px-5 sm:py-7">
      <div className="mx-auto max-w-4xl">

        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#1889b9]"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Main container */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.035)]">

          {/* Compact header */}
          <div className="flex items-center gap-3 border-b border-slate-200 bg-[#f8fbfd] px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1889b9] text-white">
              <User size={23} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <h1 className="break-words text-lg font-semibold text-slate-800 sm:text-xl">
                {user.name || "Student Profile"}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Student Account Information
              </p>
            </div>
          </div>

          {/* Details section */}
          <div className="p-4 sm:p-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-800 sm:text-base">
                Personal Details
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Your registered information
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              {details.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex min-w-0 items-start gap-3 border-b border-slate-100 py-3.5 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sky-50 text-[#1889b9]">
                      <Icon size={16} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-1 break-words text-sm font-medium leading-5 text-slate-800">
                        {item.value || "-"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Support note */}
            <div className="mt-4 border-l-2 border-[#1889b9] bg-slate-50 px-3 py-2.5">
              <p className="text-xs leading-5 text-slate-600">
                Need to update your details? Please contact CareerVidya
                support.
              </p>
            </div>
          </div>
        </section>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          CareerVidya · Student Profile
        </p>
      </div>
    </main>
  );
}


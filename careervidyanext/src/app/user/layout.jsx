"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  User,
  BookOpen,
  LogOut,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import api from "@/utlis/api";

const PRIMARY = "#1889b9";
const PRIMARY_LIGHT = "#e7f4f9";

export default function UserLayout({ children }) {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) {
      router.replace("/login");
      return;
    }

    api
      .get("/api/v1/students/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserData(res.data.student))
      .catch(() => handleLogout());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usertoken");
    Cookies.remove("usertoken", { path: "/" });
    router.replace("/login");
  };

  if (!userData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" style={{ color: PRIMARY }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className="hidden md:flex w-60 flex-col text-white"
        style={{ backgroundColor: PRIMARY }}
      >
        <div className="h-16 px-5 flex items-center gap-2 border-b border-white/20">
          <GraduationCap size={18} />
          <span className="text-sm font-semibold">CareerVidya</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <SidebarLink href="/user" icon={<LayoutDashboard size={16} />} label="Dashboard" />
          <SidebarLink href="/user/profile" icon={<User size={16} />} label="My Profile" />
          <SidebarLink href="/user/courses" icon={<BookOpen size={16} />} label="My Courses" />
        </nav>

        <div className="p-3 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-red-600 rounded"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        {/* HEADER */}
        <div
          className="px-6 py-4 border-b"
          style={{ backgroundColor: PRIMARY_LIGHT }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-medium text-gray-800">
                Welcome, <span style={{ color: PRIMARY }}>{userData.name}</span>
              </h1>
              <p className="text-xs text-gray-500">Student dashboard</p>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-2 border rounded">
              <div
                className="h-8 w-8 rounded flex items-center justify-center text-xs text-white"
                style={{ backgroundColor: PRIMARY }}
              >
                {userData.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-medium">{userData.name}</p>
                <p className="text-[10px] text-gray-400">Student</p>
              </div>
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

const SidebarLink = ({ href, icon, label }) => (
  <Link
    href={href}
    className="flex items-center gap-2 px-3 py-2 rounded text-xs text-white/90 hover:bg-white/10"
  >
    {icon}
    {label}
  </Link>
);

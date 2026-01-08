"use client";

import { GraduationCap, User, BookOpen, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ================= SIDEBAR ================= */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">

        {/* LOGO */}
        <div className="h-16 px-6 flex items-center gap-2 border-b">
          <div className="h-9 w-9 rounded-lg bg-green-600 text-white flex items-center justify-center">
            <GraduationCap size={18} />
          </div>
          <span className="text-lg font-bold text-gray-800">
            EduDashboard
          </span>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">

          <SidebarLink href="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" active />

          <SidebarLink href="/dashboard/profile" icon={<User size={16} />} label="Profile" />

          <SidebarLink href="/dashboard/courses" icon={<BookOpen size={16} />} label="My Courses" />

        </nav>

        {/* LOGOUT */}
        <div className="p-3 border-t">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-6">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back 👋
          </h1>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700">Yogesh</p>
              <p className="text-xs text-gray-400">Student</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
              Y
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <StatCard icon={<BookOpen className="text-green-600" />} title="Query " value="03" />
          <StatCard icon={<User className="text-blue-600" />} title="Profile Status" value="80%" />
          <StatCard icon={<GraduationCap className="text-purple-600" />} title="Certificates" value="01" />
        </div>

        {/* WELCOME */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Start Your Learning Journey 🚀
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Explore courses, track your progress, and achieve your academic goals with us.
          </p>

          <Link
            href="/"
            className="inline-block bg-green-600 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-green-700 transition"
          >
            Browse Courses
          </Link>
        </div>

      </main>
    </div>
  );
}

/* ================= SIDEBAR LINK ================= */
const SidebarLink = ({ href, icon, label, active }) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition
        ${active
          ? "bg-green-50 text-green-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"}
      `}
    >
      {icon}
      {label}
    </Link>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ icon, title, value }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

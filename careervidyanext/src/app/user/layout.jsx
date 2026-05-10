"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  User,
  BookOpen,
  LogOut,
  Loader2,
  Wallet,
  Search,
  Video,
  Users,
  MessageSquare,
  Ticket,
  X, // Close icon ke liye
} from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import api from "@/utlis/api";

import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";

const PRIMARY = "#2563eb";

export default function UserLayout({ children }) {
  const [userData, setUserData] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Route change hone par mobile sidebar ko band karne ke liye
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin" style={{ color: PRIMARY }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* 1. MOBILE OVERLAY: Sidebar ke bahar click karne par band hoga */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* TOP HEADER */}
     <div className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md shadow-sm">
  <Header />
</div>

      <div className="flex flex-1 relative">
        {/* SIDEBAR */}
        <aside
          className={`fixed md:sticky top-0 md:top-[64px] inset-y-0 left-0 z-[70] w-72 flex flex-col bg-white
          transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-300 ease-in-out
          shadow-2xl md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-full md:h-[calc(100vh-64px)]`}
        >
          {/* Mobile Close Button */}
          <div className="md:hidden flex justify-end p-4">
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
            >
              <X size={24} />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="flex flex-col items-center pt-4 md:pt-8 pb-6 px-4 text-center">
            <div className="relative">
              <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200 rotate-3 group-hover:rotate-0 transition-transform">
                <User size={40} className="text-white -rotate-3" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-4 border-white rounded-full"></div>
            </div>

            <h2 className="font-bold text-xl text-slate-800 leading-tight">
              {userData.name}
            </h2>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
              Student ID: #CV-{userData._id?.slice(-4) || "2026"}
            </p>
          </div>

          <div className="px-6 mb-2">
            <div className="h-px bg-slate-100 w-full"></div>
          </div>

          {/* NAV LINKS */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-6">
            <SidebarLink href="/user" icon={<LayoutDashboard size={20} />} label="Dashboard" active={pathname === "/user"} />
            <SidebarLink href="/user/profile" icon={<User size={20} />} label="My Profile" active={pathname === "/user/profile"} />
            <SidebarLink href="/user/UserStatus" icon={<GraduationCap size={20} />} label="Admission Status" active={pathname === "/user/UserStatus"} />
            <SidebarLink href="/user/courses" icon={<BookOpen size={20} />} label="My Courses" active={pathname === "/user/courses"} />

            <div className="pt-1 pb-2 px-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Resources</span>
            </div>

            <SidebarLink href="#" icon={<Wallet size={20} />} label="Best EMI Options" />
            <SidebarLink href="#" icon={<Search size={20} />} label="Career Finder" />
            <SidebarLink href="#" icon={<Video size={20} />} label="University Expo" />
            
            <div className="relative group">
              <SidebarLink href="#" icon={<Users size={20} />} label="Become a Mentor" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm shadow-emerald-200">EARN</span>
            </div>

            <SidebarLink href="#" icon={<MessageSquare size={20} />} label="Q&A Panel" />
            <SidebarLink href="#" icon={<Ticket size={20} />} label="Raise a ticket" />
          </nav>

          {/* SIDEBAR FOOTER ACTIONS */}
          <div className="p-4 mt-auto">
            <div className="bg-slate-50 rounded-2xl p-2 space-y-1">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 font-semibold hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group">
                <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> 
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Mobile Menu Bar (Sticky) */}
          <div className="md:hidden p-4 bg-white/80 backdrop-blur-md sticky top-[64px] z-30 flex items-center justify-between shadow-sm border-b border-slate-100">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMobileOpen(true)} 
                className="p-2.5 bg-blue-50 text-blue-600 rounded-xl active:scale-95 transition-transform"
              >
                <LayoutDashboard size={20} />
              </button>
              <span className="font-bold text-slate-700">Student Portal</span>
            </div>
          </div>

          <div className="p-4 md:p-8 flex-1">
            {/* Page Content Card */}
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 min-h-[60vh]">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* GLOBAL FOOTER */}
      <footer className="w-full bg-white border-t border-slate-100">
        <Footer />
      </footer>
    </div>
  );
}

const SidebarLink = ({ href, icon, label, active = false }) => (
  <Link
    href={href}
    className={`flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 group
    ${active 
        ? "bg-blue-400 text-white shadow-lg shadow-blue-100" 
        : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
    }`}
  >
    <span className={`${active ? "text-white" : "text-slate-400 group-hover:text-blue-600"} transition-colors`}>
      {icon}
    </span>
    <span className={`text-[14px] ${active ? "font-bold" : "font-semibold"}`}>{label}</span>
  </Link>
);
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  User,
  Mail,
  LogOut,
  BadgeCheck,
  Menu,
  X,
  LayoutDashboard,
  Users,
  Settings,
  Lock,
} from "lucide-react";

const SIDEBAR_LINKS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/counselordashbord/report" },
  { name: "Lead", icon: Users, path: "/counselordashbord/lead" },
  { name: "Profile", icon: User, path: "/counselordashbord/profile" },
  { name: "Referral & Admission", icon: Settings, path: "/counselordashbord/refr" },
  { name: "Admissions", icon: BadgeCheck, path: "/counselordashbord/admission" },
  { name: "Generate Ticket", icon: Mail, path: "/counselordashbord/genrateticket" },
];

export default function CounselorLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  // Mobile view mein route change hote hi sidebar band ho jaye
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-indigo-700 font-bold">
        Loading...
      </div>
    );
  }

  const isUserActive = user.status?.toLowerCase() === "active";

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      
      {/* 1. MOBILE OVERLAY (Peeche ka parda) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. SIDEBAR (Managed for all screens) */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-indigo-700 text-white transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-5 border-b border-indigo-600 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">Counselor Panel</span>
          {/* Close button for mobile only */}
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
          {SIDEBAR_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={isUserActive ? item.path : "#"}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive ? "bg-white text-indigo-700 shadow-md scale-105" : "hover:bg-indigo-600 text-indigo-100"}
                ${!isUserActive ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
                {!isUserActive && <Lock size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 3. MAIN WRAPPER */}
      <div className="flex-1 flex flex-col w-full min-w-0">

        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-30">
          
          <div className="flex items-center gap-4">
            {/* Hamburger Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg md:hidden text-gray-600"
            >
              <Menu size={24} />
            </button>

            {/* Logo area */}
            <div className="flex items-center">
              <Image
                src="/images/n12.png"
                alt="Logo"
                width={80}
                height={30}
                className="object-contain h-8 w-auto"
                priority
              />
              <div className="hidden sm:block h-6 w-px bg-gray-300 mx-4"></div>
              <span className="hidden sm:block text-sm font-semibold text-gray-500 uppercase tracking-widest">
                Counselor
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* User Info Hidden on very small mobile */}
            <div className="hidden xs:flex flex-col text-right">
               <span className="text-sm font-bold text-gray-800 leading-tight">{user.name}</span>
               <span className="text-[10px] text-green-600 font-bold uppercase">{user.status}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors border border-red-100"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* 4. PAGE CONTENT (Scrollable area) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
           <div className="max-w-7xl mx-auto h-full">
              {children}
           </div>
        </main>

      </div>
    </div>
  );
}
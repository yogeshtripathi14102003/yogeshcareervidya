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

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const isUserActive = user.status?.toLowerCase() === "active";

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-indigo-700 text-white transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >

        <div className="p-5 border-b border-indigo-600 text-xl font-bold">
          Counselor Panel
        </div>

        <nav className="p-3 space-y-1">
          {SIDEBAR_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={isUserActive ? item.path : "#"}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all
                ${isActive ? "bg-indigo-800" : "hover:bg-indigo-600"}
                ${!isUserActive ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon size={18} />
                <span className="flex-1">{item.name}</span>
                {!isUserActive && <Lock size={14} />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="bg-white shadow px-4 py-3 flex items-center justify-between">

          {/* LEFT: MENU + LOGO + TEXT */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu />
            </button>

            {/* LOGO */}
            <Image
              src="/images/n12.png"
              alt="CareerVidyaki Logo"
              width={90}
              height={35}
              className="object-contain"
              priority
            />

            {/* TEXT NEXT TO LOGO */}
            <span className="text-lg font-bold text-gray-800">
              Counselor Dashboard
            </span>

          </div>

          {/* RIGHT */}
          <button
            onClick={handleLogout}
            className="text-red-500 text-sm font-semibold"
          >
            Logout
          </button>

        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>

      </div>
    </div>
  );
}

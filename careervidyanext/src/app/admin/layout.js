"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ Added
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Tag,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  Lock,
  LogOut,
  Award,
} from "lucide-react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("admintoken");

    if (!token) {
      router.replace("/404");
      return;
    }

    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-lg font-semibold">
        Checking Permission...
      </div>
    );
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/v1/logout",
        {},
        { withCredentials: true }
      );
    } catch {}

    localStorage.removeItem("admintoken");
    Cookies.remove("admintoken");
    router.push("/");
  };

  /* MENU (ALL SAME) */
  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/applyadmission", label: "applyadmission", icon: Users },
    { href: "/admin/visitors", label: "Visitors", icon: Users },
    { href: "/admin/placestudent", label: "Placed Students", icon: Award },
    { href: "/admin/addteam", label: "Add Team", icon: Users },
    { href: "/admin/Getalluser", label: "All Students", icon: Users },
    { href: "/admin/bannerlist", label: "Banners", icon: ImageIcon },
    { href: "/admin/adduniversitydata", label: "Universities", icon: Users },
    { href: "/admin/getuniversites", label: "Universities Data", icon: Users },
    { href: "/admin/getquery", label: "Get Queries", icon: MessageSquare },
    { href: "/admin/getonlinecourese", label: "Online Courses", icon: Tag },
    { href: "/admin/job", label: "Job Posts", icon: Tag },
    { href: "/admin/getresume", label: "Applications", icon: Tag },
    { href: "/admin/getonelyonline", label: "OnlyL Online", icon: Tag },
    { href: "/admin/Q&A", label: "Q & A", icon: MessageSquare },
    { href: "/admin/add-subsid", label: "add-subsid", icon: MessageSquare },
    { href: "/admin/addblog", label: "addblog", icon: MessageSquare },
    {href:"/admin/getbloglist", label: "getbloglist", icon: MessageSquare},
    { href: "/admin/state", label: "state", icon: MessageSquare },
    { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
    { href: "/admin/Addcounsler", label: "Addcounselor", icon: Mail },
    { href: "/admin/Security", label: "Security", icon: Lock },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-12 bg-white shadow flex items-center justify-between px-3 z-50">

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1.5 rounded hover:bg-gray-200"
          >
            <Menu size={18} />
          </button>

          {/* ✅ Logo + Admin Panel */}
          <div className="flex items-center gap-2">
            <Image
              src="/images/n12.png" // 👉 public/logo.png
              alt="Logo"
              width={90}
              height={80}
              className="rounded"
            />

            <h1 className="text-sm font-semibold text-gray-700">
              Admin Panel
            </h1>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded"
        >
          <LogOut size={14} />
          Logout
        </button>

      </header>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-12 left-0 h-full w-60 bg-white shadow transition-transform duration-300 z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <nav className="px-2 py-2 overflow-y-auto h-full">

          <ul className="space-y-0.5">

            {menuItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded transition
                  ${
                    pathname === href
                      ? "bg-sky-100 text-sky-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={16} className="text-sky-600" />
                  <span className="text-[12px] leading-tight">
                    {label}
                  </span>
                </Link>
              </li>
            ))}

          </ul>

        </nav>
      </aside>

      {/* MAIN */}
      <main
        className={`flex-1 pt-14 md:ml-60 px-4 py-3 overflow-y-auto transition-all
        ${isSidebarOpen ? "blur-sm md:blur-0" : ""}`}
      >
        {children}
      </main>

      {/* OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;
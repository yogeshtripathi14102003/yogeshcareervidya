"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Tag,
  Image as ImageIcon,
  DollarSign,
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
  const [hasToken, setHasToken] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admintoken");
      setHasToken(!!token);
      if (!token) router.push("/");
    }
  }, [router]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/v1/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("admintoken");
      Cookies.remove("admintoken");
      setHasToken(false);
      router.push("/");
    }
  };

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/placestudent", label: "Placed Students", icon: Award },
    { href: "/admin/addteam", label: "Add Team", icon: Users },
    { href: "/admin/Getalluser", label: "All Students", icon: Users },
    { href: "/admin/bannerlist", label: "Banners", icon: ImageIcon },
    { href: "/admin/adduniversitydata", label: "Universities", icon: Users },
    { href: "/admin/getquery", label: "Get Queries", icon: MessageSquare },
  
    { href: "/admin/getonlinecourese", label: "Online Courses", icon: Tag },
    { href: "/admin/getonelyonline", label: "OnlyL Online", icon: Tag },
    { href: "/admin/Q&A", label: "Q & A", icon: MessageSquare },
    { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
    { href: "/admin/Security", label: "Security", icon: Lock },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ✅ Mobile topbar */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-4 py-3 md:hidden z-50">
        <h1 className="text-lg font-semibold text-gray-700">Admin Panel</h1>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-200 transition"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ✅ Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl flex flex-col transform transition-transform duration-300 z-40 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h1 className="text-lg font-semibold text-gray-700">Admin Panel</h1>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-200 md:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    pathname === href
                      ? "bg-sky-100 text-sky-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setIsSidebarOpen(false); // ✅ Close on mobile click
                  }}
                >
                  <Icon
                    size={20}
                    className={`${
                      pathname === href ? "text-sky-600" : "text-sky-500"
                    }`}
                  />
                  <span className="text-sm">{label}</span>
                </Link>
              </li>
            ))}

            {hasToken && (
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-red-100 text-gray-700 transition-colors"
                >
                  <LogOut size={20} className="text-red-500" />
                  <span className="text-sm">Logout</span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* ✅ Main Content */}
      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? "blur-sm md:blur-0" : ""
        } mt-14 md:mt-0 p-6`}
      >
        {children}
      </div>

      {/* ✅ Overlay on mobile when sidebar is open */}
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

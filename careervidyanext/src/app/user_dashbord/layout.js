"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  User,
  BookOpen,
  GraduationCap,
  MessageCircle,
  LogOut,
  Settings,
  Home,
} from "lucide-react";

import axios from "axios";
import { useRouter, usePathname } from "next/navigation";

const UserLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 🔒 USER AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("usertoken");

    if (!token) {
      router.replace("/login"); // ❌ No user → Go login
      return;
    }

    setCheckingAuth(false); // done
  }, []);

  if (checkingAuth) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
        Checking User...
      </div>
    );
  }

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // 🔐 Logout
  const handleLogout = () => {
    localStorage.removeItem("usertoken");
    router.push("/");
  };

  // MENU ITEMS FOR USER
  const menuItems = [
    { href: "/user_dashbord", label: "Dashboard", icon: Home },
    { href: "/user_dashbord/profile", label: "My Profile", icon: User },
    { href: "/user_dashbord/mycourses", label: "My Courses", icon: BookOpen },
    { href: "/user_dashbord/certificate", label: "Certificates", icon: GraduationCap },
    { href: "/user_dashbord/support", label: "Support", icon: MessageCircle },
    { href: "/user_dashbord/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* MOBILE TOP BAR */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-4 py-3 md:hidden z-50">
        <h1 className="text-lg font-semibold text-gray-700">User Dashboard</h1>
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-200 transition">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl flex flex-col transform transition-transform duration-300 z-40 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h1 className="text-lg font-semibold text-gray-700">User Panel</h1>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-200 md:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* MENU LINKS */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    pathname === href
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon size={20} className={pathname === href ? "text-blue-600" : "text-blue-500"} />
                  <span className="text-sm">{label}</span>
                </Link>
              </li>
            ))}

            {/* LOGOUT */}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-red-100 text-gray-700 transition-colors"
              >
                <LogOut size={20} className="text-red-500" />
                <span className="text-sm">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? "blur-sm md:blur-0" : ""
        } mt-14 md:mt-0 p-6`}
      >
        {children}
      </div>

      {/* OVERLAY FOR MOBILE */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default UserLayout;

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu, X, LayoutDashboard, Users, Tag, Image as ImageIcon,
  MessageSquare, Mail, Lock, LogOut, Award,
} from "lucide-react";

// ✅ Correct Imports
import api from "@/utlis/api.js"; // Aapka api.js utility
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userRole, setUserRole] = useState(""); 
  const [permissions, setPermissions] = useState([]); 

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchAuth = async () => {
      // Admin dashboard ke liye token key 'admintoken' check karein
      const token = localStorage.getItem("admintoken");
      
      if (!token) {
        router.replace("/login"); // Token nahi hai toh login bhejein
        return;
      }

      try {
        // ✅ API.js use karke call karein (No need to write full URL)
        const response = await api.get("/api/v1/me");

        console.log("Admin Data:", response.data);

        setUserRole(response.data.role); 
        const allowedData = response.data.allowedModules || response.data.permissions || [];
        setPermissions(allowedData);
        
        setCheckingAuth(false);
      } catch (error) {
        console.error("Admin Auth Error:", error);
        // Unauthorized hone par local storage saaf karein
        localStorage.removeItem("admintoken");
        router.replace("/login");
      }
    };

    fetchAuth();
  }, [router]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // ✅ Updated Logout with api.js
  const handleLogout = async () => {
    try {
      // Backend ko call karein (Cookie clear karne ke liye)
      await api.post("/api/v1/logout"); 
      
      const isLocal = window.location.hostname === "localhost";
      const options = { path: "/", domain: isLocal ? undefined : ".careervidya.in" };
      
      // Saare tokens aur roles clear karein
      Cookies.remove("admintoken", options);
      Cookies.remove("usertoken", options);
      Cookies.remove("userRole", options);
      localStorage.clear();

      // Redirect to Login
      window.location.href = "/login"; 
    } catch (error) {
      console.error("Logout failed", error);
      // Agar API fail bhi ho, tab bhi frontend saaf karein
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  // ... (menuItems wala part wahi rahega)
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
    { href: "/admin/getbloglist", label: "getbloglist", icon: MessageSquare },
    { href: "/admin/state", label: "state", icon: MessageSquare },
    { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
    { href: "/admin/Addcounsler", label: "Addcounselor", icon: Mail },
    { href: "/admin/Security", label: "Security", icon: Lock },
  ];

  const filteredMenu = menuItems.filter((item) => {
    if (userRole === "admin") return true;
    return permissions.some(p => p.toLowerCase().trim() === item.label.toLowerCase().trim());
  });

  if (checkingAuth) {
    return <div className="w-full h-screen flex justify-center items-center font-semibold">Verifying Access...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ... Header & Sidebar UI (Wahi rahega) */}
      <header className="fixed top-0 left-0 right-0 h-12 bg-white shadow flex items-center justify-between px-3 z-50">
         <div className="flex items-center gap-2">
           <button onClick={toggleSidebar} className="md:hidden p-1.5 rounded hover:bg-gray-200"><Menu size={18} /></button>
           <Image src="/images/n12.png" alt="Logo" width={90} height={80} />
           <h1 className="text-sm font-semibold uppercase">{userRole} Portal</h1>
         </div>
         <button onClick={handleLogout} className="text-xs text-red-500 px-2 py-1 rounded flex items-center gap-1">
           <LogOut size={14} /> Logout
         </button>
      </header>

      <aside className={`fixed top-12 left-0 h-full w-60 bg-white transition-transform z-40 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <nav className="px-2 py-2 overflow-y-auto h-[calc(100vh-48px)]">
          <ul className="space-y-0.5 pb-20">
            {filteredMenu.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className={`flex items-center gap-2 px-2 py-1.5 rounded text-[12px] ${pathname === href ? "bg-sky-100 text-sky-600" : "text-gray-700 hover:bg-gray-100"}`}>
                  <Icon size={16} className="text-sky-600" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className={`flex-1 pt-14 md:ml-60 px-4 py-3 overflow-y-auto ${isSidebarOpen ? "blur-sm md:blur-0" : ""}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
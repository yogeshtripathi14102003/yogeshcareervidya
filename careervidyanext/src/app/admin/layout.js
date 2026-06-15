"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu, X, LayoutDashboard, Users, Tag, Image as ImageIcon,
  MessageSquare, Mail, Lock, LogOut, Award, Sun, Moon
} from "lucide-react";

// ✅ Correct Imports
import api from "@/utlis/api.js";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userRole, setUserRole] = useState(""); 
  const [permissions, setPermissions] = useState([]); 
  const [darkMode, setDarkMode] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const fetchAuth = async () => {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        router.replace("/login"); 
        return;
      }
      try {
        const response = await api.get("/api/v1/me");
        setUserRole(response.data.role); 
        const allowedData = response.data.allowedModules || response.data.permissions || [];
        setPermissions(allowedData);
        setCheckingAuth(false);
      } catch (error) {
        console.error("Admin Auth Error:", error);
        localStorage.removeItem("admintoken");
        router.replace("/login");
      }
    };

    fetchAuth();
  }, [router]);

  const toggleDarkMode = () => {
    if (darkMode) {
      localStorage.setItem("theme", "light");
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/logout"); 
      const isLocal = window.location.hostname === "localhost";
      const options = { path: "/", domain: isLocal ? undefined : ".careervidya.in" };
      Cookies.remove("admintoken", options);
      Cookies.remove("usertoken", options);
      Cookies.remove("userRole", options);
      localStorage.removeItem("admintoken");
      window.location.href = "/login"; 
    } catch (error) {
      console.error("Logout failed", error);
      localStorage.removeItem("admintoken");
      window.location.href = "/login";
    }
  };

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
    { href: "/admin/VideoPage", label: "Videos", icon: Lock },
    { href: "/admin/CounselorsReprt", label: "Counselor Report", icon: Lock},
    { href: "/admin/Adminremark", label: "Adminremark", icon: Lock},
    { href: "/admin/AdminDocumentcheck", label: "AdminDocumentcheck", icon: Lock},
    { href: "/admin/DocumentDelete", label: "Document Delete", icon: Lock, id: "DocumentDelete" },
    {href: "/admin/DocReport", label: "DocReport", icon: Lock, id: "DocReport"},
    { href: "/admin/empmanagement/upload", label: "Employee Upload", icon: Users, id: "employeeupload" },
    { href: "/admin/empmanagement/dashbord", label: "Employee Dashboard", icon: Users, id: "dashbord" },
    { href: "/admin/empmanagement/alerts", label: "Employee Alerts", icon: Users, id: "employeealerts" },
    { href: "/admin/empmanagement/emp", label: "Employee List", icon: Users, id: "employeelist" },
    {href: "/admin/slotsquery", label: "Slot Management", icon: Users, id: "slotmanagement" },

  ];

  const filteredMenu = menuItems.filter((item) => {
    if (userRole === "admin") return true;
    const matchKey = (item.id || item.label).toLowerCase().trim();
    return permissions.some(p => p.toLowerCase().trim() === matchKey);
  });

  if (checkingAuth) {
    return <div className={`w-full h-screen flex justify-center items-center font-semibold ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>Verifying Access...</div>;
  }

  return (
    <div className={`flex h-screen overflow-hidden antialiased ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      
      {/* 🛠️ MASTER INJECTION: Yeh style tag sub-pages ke default components (table, tr, td, card) ka color force badal dega */}
      {darkMode && (
        <style dangerouslySetInnerHTML={{__html: `
          .dark-force-container table, 
          .dark-force-container tr, 
          .dark-force-container td, 
          .dark-force-container th,
          .dark-force-container div[class*="bg-white"],
          .dark-force-container .bg-white {
            background-color: #1f2937 !important; /* gray-800 background */
            color: #f3f4f6 !important;            /* gray-100 bright crisp text */
            border-color: #374151 !important;      /* gray-700 soft borders */
          }
          /* Agar text par classes ki wajah se color light ho rha hai toh use white/bright karein */
          .dark-force-container td *, 
          .dark-force-container p, 
          .dark-force-container span {
            color: #e5e7eb !important; 
          }
        `}} />
      )}

      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 h-12 shadow flex items-center justify-between px-3 z-50 transition-colors duration-200 ${darkMode ? "bg-gray-800 border-b border-gray-700 text-white" : "bg-white text-gray-900"}`}>
         <div className="flex items-center gap-2">
           <button onClick={toggleSidebar} className={`md:hidden p-1.5 rounded ${darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200"}`}>
             <Menu size={18} />
           </button>
           <Image src="/images/n12.png" alt="Logo" width={90} height={80} className={`${darkMode ? "brightness-110 contrast-125" : ""}`} />
           <h1 className="text-sm font-semibold uppercase">{userRole} Portal</h1>
         </div>
         
         <div className="flex items-center gap-4">
           {/* Dark / Light Mode Toggle Button */}
           <button 
             onClick={toggleDarkMode} 
             className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded transition-all font-medium border subpixel-antialiased ${
               darkMode ? "bg-gray-700 text-yellow-400 border-gray-600 hover:bg-gray-600" : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
             }`}
           >
             {darkMode ? (
               <>
                 <Sun size={14} /> <span>Light Screen</span>
               </>
             ) : (
               <>
                 <Moon size={14} /> <span>Dark Screen</span>
               </>
             )}
           </button>

           <button onClick={handleLogout} className="text-xs text-red-500 px-2 py-1 rounded flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-950/20">
             <LogOut size={14} /> Logout
           </button>
         </div>
      </header>

      {/* SIDEBAR */}
      <aside className={`fixed top-12 left-0 h-full w-60 transition-transform z-40 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 ${darkMode ? "bg-gray-800 border-r border-gray-700 text-gray-200" : "bg-white text-gray-700"}`}>
        <nav className="px-2 py-2 overflow-y-auto h-[calc(100vh-48px)]">
          <ul className="space-y-0.5 pb-20">
            {filteredMenu.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className={`flex items-center gap-2 px-2 py-1.5 rounded text-[12px] transition-colors ${
                  pathname === href 
                    ? (darkMode ? "bg-sky-950 text-sky-400 font-semibold" : "bg-sky-100 text-sky-600 font-semibold") 
                    : (darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100")
                }`}>
                  <Icon size={16} className={pathname === href ? "text-sky-400" : "text-sky-600"} />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* MAIN CONTAINER */}
      <main className={`flex-1 pt-14 md:ml-60 px-4 py-3 overflow-y-auto subpixel-antialiased transition-colors duration-200 ${isSidebarOpen ? "blur-sm md:blur-0" : ""} ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
        {/* 🚀 Wrapper with 'dark-force-container' class to apply injection on children */}
        <div className={`w-full dark-force-container ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   Menu, X, LayoutDashboard, Users, Tag, Image as ImageIcon,
//   MessageSquare, Mail, Lock, LogOut, Award, Sun, Moon, TrendingUp, Settings2, Clock3, Flame, Calendar
// } from "lucide-react";

// import { usePathname } from "next/navigation";
// import { useAuth } from "@/context/AuthContext.jsx";
// import RoleGuard from "@/app/components/RoleGuard.jsx";
// import AdminNotificationBell from "@/app/admin/components/AdminNotificationBell.jsx";
// import { disconnectSocket } from "@/utlis/socket.js";

// const Layout = ({ children }) => {
//   return (
//     <RoleGuard allow={["admin", "subadmin"]}>
//       <AdminShell>{children}</AdminShell>
//     </RoleGuard>
//   );
// };

// const AdminShell = ({ children }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);

//   const pathname = usePathname();
//   const { role, permissions, logout } = useAuth();
//   const userRole = role;

//   React.useEffect(() => {
//     const savedTheme = localStorage.getItem("theme");
//     if (savedTheme === "dark") {
//       setDarkMode(true);
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, []);

//   const toggleDarkMode = () => {
//     if (darkMode) {
//       localStorage.setItem("theme", "light");
//       setDarkMode(false);
//       document.documentElement.classList.remove("dark");
//     } else {
//       localStorage.setItem("theme", "dark");
//       setDarkMode(true);
//       document.documentElement.classList.add("dark");
//     }
//   };

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   const handleLogout = () => {
//     disconnectSocket();
//     logout({ redirectTo: "/login" });
//   };

//   const menuItems = [
//     { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
//     { href: "/admin/applyadmission", label: "applyadmission", icon: Users },
//     { href: "/admin/visitors", label: "Visitors", icon: Users },
//     { href: "/admin/placestudent", label: "Placed Students", icon: Award },
//     { href: "/admin/addteam", label: "Add Team", icon: Users },
//     {href:"/admin/manageteam", label: "ourteam", icon: Users},
//     { href: "/admin/Getalluser", label: "All Students", icon: Users },
//     { href: "/admin/bannerlist", label: "Banners", icon: ImageIcon },
//     { href: "/admin/adduniversitydata", label: "Universities", icon: Users },
//     { href: "/admin/getuniversites", label: "Universities Data", icon: Users },
//     { href: "/admin/getquery", label: "Get Queries", icon: MessageSquare },
//     { href: "/admin/getonlinecourese", label: "Online Courses", icon: Tag },
//     { href: "/admin/job", label: "Job Posts", icon: Tag },
//     { href: "/admin/getresume", label: "Applications", icon: Tag },
//     { href: "/admin/getonelyonline", label: "OnlyL Online", icon: Tag },
//     { href: "/admin/Q&A", label: "Q & A", icon: MessageSquare },
//     { href: "/admin/add-subsid", label: "add-subsid", icon: MessageSquare },
//     { href: "/admin/addblog", label: "addblog", icon: MessageSquare },
//     { href: "/admin/getbloglist", label: "getbloglist", icon: MessageSquare },
//     { href: "/admin/state", label: "state", icon: MessageSquare },
//     { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
//     { href: "/admin/Addcounsler", label: "Addcounselor", icon: Mail },
//     { href: "/admin/Security", label: "Security", icon: Lock },
//     { href: "/admin/VideoPage", label: "Videos", icon: Lock },
//     { href: "/admin/CounselorsReprt", label: "Counselor Report", icon: Lock},
//     { href: "/admin/LeadAnalytics", label: "Lead Analytics", icon: TrendingUp, id: "leadanalytics" },
//     { href: "/admin/CounselorLeaderboard", label: "Counselor Leaderboard", icon: TrendingUp, id: "counselorleaderboard" },
//     { href: "/admin/AssignmentConfig", label: "Smart Assignment", icon: Settings2, id: "assignmentconfig" },
//     { href: "/admin/FollowUpAutomation", label: "Follow-up Automation", icon: Clock3, id: "followupautomation" },
//     { href: "/admin/LeadScoring", label: "AI Lead Scoring", icon: Flame, id: "leadscoring" },
//     { href: "/admin/Reports", label: "Reports", icon: Calendar, id: "reports" },
//     { href: "/admin/QAPanel", label: "Student Q&A", icon: MessageSquare, id: "qapanel" },
//     { href: "/admin/SecuritySettings", label: "Security Settings", icon: Lock, id: "securitysettings" },
//     { href: "/admin/Adminremark", label: "Adminremark", icon: Lock},
//     { href: "/admin/AdminDocumentcheck", label: "AdminDocumentcheck", icon: Lock},
//     { href: "/admin/DocumentDelete", label: "Document Delete", icon: Lock, id: "DocumentDelete" },
//     {href: "/admin/DocReport", label: "DocReport", icon: Lock, id: "DocReport"},
//     { href: "/admin/empmanagement/upload", label: "Employee Upload", icon: Users, id: "employeeupload" },
//     { href: "/admin/empmanagement/dashbord", label: "Employee Dashboard", icon: Users, id: "dashbord" },
//     { href: "/admin/empmanagement/alerts", label: "Employee Alerts", icon: Users, id: "employeealerts" },
//     { href: "/admin/empmanagement/emp", label: "Employee List", icon: Users, id: "employeelist" },
//     {href: "/admin/slotsquery", label: "Slot Management", icon: Users, id: "slotmanagement" },

//   ];

//   const filteredMenu = menuItems.filter((item) => {
//     if (userRole === "admin") return true;
//     const matchKey = (item.id || item.label).toLowerCase().trim();
//     return permissions.some(p => p.toLowerCase().trim() === matchKey);
//   });

//   return (
//     <div className={`flex h-screen overflow-hidden antialiased ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      
//       {/* 🛠️ MASTER INJECTION: Yeh style tag sub-pages ke default components (table, tr, td, card) ka color force badal dega */}
//       {darkMode && (
//         <style dangerouslySetInnerHTML={{__html: `
//           .dark-force-container table, 
//           .dark-force-container tr, 
//           .dark-force-container td, 
//           .dark-force-container th,
//           .dark-force-container div[class*="bg-white"],
//           .dark-force-container .bg-white {
//             background-color: #1f2937 !important; /* gray-800 background */
//             color: #f3f4f6 !important;            /* gray-100 bright crisp text */
//             border-color: #374151 !important;      /* gray-700 soft borders */
//           }
//           /* Agar text par classes ki wajah se color light ho rha hai toh use white/bright karein */
//           .dark-force-container td *, 
//           .dark-force-container p, 
//           .dark-force-container span {
//             color: #e5e7eb !important; 
//           }
//         `}} />
//       )}

//       {/* HEADER */}
//       <header className={`fixed top-0 left-0 right-0 h-12 shadow flex items-center justify-between px-3 z-50 transition-colors duration-200 ${darkMode ? "bg-gray-800 border-b border-gray-700 text-white" : "bg-white text-gray-900"}`}>
//          <div className="flex items-center gap-2">
//            <button onClick={toggleSidebar} className={`md:hidden p-1.5 rounded ${darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200"}`}>
//              <Menu size={18} />
//            </button>
//            <Image src="/images/n12.png" alt="Logo" width={90} height={80} className={`${darkMode ? "brightness-110 contrast-125" : ""}`} />
//            <h1 className="text-sm font-semibold uppercase">{userRole} Portal</h1>
//          </div>
         
//          <div className="flex items-center gap-4">
//            {/* Dark / Light Mode Toggle Button */}
//            <button 
//              onClick={toggleDarkMode} 
//              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded transition-all font-medium border subpixel-antialiased ${
//                darkMode ? "bg-gray-700 text-yellow-400 border-gray-600 hover:bg-gray-600" : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
//              }`}
//            >
//              {darkMode ? (
//                <>
//                  <Sun size={14} /> <span>Light Screen</span>
//                </>
//              ) : (
//                <>
//                  <Moon size={14} /> <span>Dark Screen</span>
//                </>
//              )}
//            </button>

//            <AdminNotificationBell />

//            <button onClick={handleLogout} className="text-xs text-red-500 px-2 py-1 rounded flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-950/20">
//              <LogOut size={14} /> Logout
//            </button>
//          </div>
//       </header>

//       {/* SIDEBAR */}
//       <aside className={`fixed top-12 left-0 h-full w-60 transition-transform z-40 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 ${darkMode ? "bg-gray-800 border-r border-gray-700 text-gray-200" : "bg-white text-gray-700"}`}>
//         <nav className="px-2 py-2 overflow-y-auto h-[calc(100vh-48px)]">
//           <ul className="space-y-0.5 pb-20">
//             {filteredMenu.map(({ href, label, icon: Icon }) => (
//               <li key={href}>
//                 <Link href={href} className={`flex items-center gap-2 px-2 py-1.5 rounded text-[12px] transition-colors ${
//                   pathname === href 
//                     ? (darkMode ? "bg-sky-950 text-sky-400 font-semibold" : "bg-sky-100 text-sky-600 font-semibold") 
//                     : (darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100")
//                 }`}>
//                   <Icon size={16} className={pathname === href ? "text-sky-400" : "text-sky-600"} />
//                   <span>{label}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </aside>

//       {/* MAIN CONTAINER */}
//       <main className={`flex-1 pt-14 md:ml-60 px-4 py-3 overflow-y-auto subpixel-antialiased transition-colors duration-200 ${isSidebarOpen ? "blur-sm md:blur-0" : ""} ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
//         {/* 🚀 Wrapper with 'dark-force-container' class to apply injection on children */}
//         <div className={`w-full dark-force-container ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Layout;


"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu, X, LayoutDashboard, Users, Tag, Image as ImageIcon,
  MessageSquare, Mail, Lock, LogOut, Award, Sun, Moon, TrendingUp, Settings2, Clock3, Flame, Calendar,
  ChevronDown, FolderKanban, FileText, BarChart3
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext.jsx";
import RoleGuard from "@/app/components/RoleGuard.jsx";
import AdminNotificationBell from "@/app/admin/components/AdminNotificationBell.jsx";
import { disconnectSocket } from "@/utlis/socket.js";
import SecuritySettingsPage from "./SecuritySettings/page";

const Layout = ({ children }) => {
  return (
    <RoleGuard allow={["admin", "subadmin"]}>
      <AdminShell>{children}</AdminShell>
    </RoleGuard>
  );
};

const AdminShell = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [openGroups, setOpenGroups] = useState({}); // { groupId: true/false }

  const pathname = usePathname();
  const { role, permissions, logout } = useAuth();
  const userRole = role;

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

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

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleLogout = () => {
    disconnectSocket();
    logout({ redirectTo: "/login" });
  };

  // ----------------------------------------------------------------
  // MENU STRUCTURE
  // Har item ya toh top-level link hoga (href hoga), ya group hoga
  // (children array hoga, dropdown ki tarah expand/collapse hoga).
  // ----------------------------------------------------------------
  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/visitors", label: "Visitors", icon: Users },

     {
      id:"queryadmission",
       label: "queryadmission",
      icon: BarChart3,
      children:[
 { href: "/admin/Getalluser", label: "All Students", icon: Users },
     { href: "/admin/getquery", label: "Get Queries", icon: MessageSquare },
         { href: "/admin/applyadmission", label: "applyadmission", icon: Users },
             { href: "/admin/add-subsid", label: "add-subsid", icon: MessageSquare },



      ],
    },
    {
      id:"courseAndUniversity",
      label:"courseAndUniversity",
      icon: "Tag",
      children:[
 { href: "/admin/getonlinecourese", label: "Online Courses", icon: Tag },
     { href: "/admin/getonelyonline", label: "OnlyL Online", icon: Tag },
      { href: "/admin/adduniversitydata", label: "Universities", icon: Users },
    { href: "/admin/getuniversites", label: "Universities Data", icon: Users },
        { href: "/admin/addblog", label: "addblog", icon: MessageSquare },
    { href: "/admin/getbloglist", label: "getbloglist", icon: MessageSquare },
       { href: "/admin/placestudent", label: "Placed Students", icon: Award },
    { href: "/admin/addteam", label: "Add Team", icon: Users },
    { href: "/admin/manageteam", label: "ourteam", icon: Users },
    { href: "/admin/bannerlist", label: "Banners", icon: ImageIcon },

    { href: "/admin/state", label: "state", icon: MessageSquare },
    { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
    { href: "/admin/Addcounsler", label: "Addcounselor", icon: Mail },
      ],

    },
  
    { href: "/admin/job", label: "Job Posts", icon: Tag },
    { href: "/admin/getresume", label: "Applications", icon: Tag },
    { href: "/admin/VideoPage", label: "Videos", icon: Lock },


    // ---------------- CRM / Counselor group ----------------
    {
      id: "crm",
      label: "CRM",
      icon: BarChart3,
      children: [
        { href: "/admin/CounselorsReprt", label: "Counselor Report", icon: Lock },
        { href: "/admin/LeadAnalytics", label: "Lead Analytics", icon: TrendingUp, id: "leadanalytics" },
        { href: "/admin/CounselorLeaderboard", label: "Counselor Leaderboard", icon: TrendingUp, id: "counselorleaderboard" },
        { href: "/admin/AssignmentConfig", label: "Smart Assignment", icon: Settings2, id: "assignmentconfig" },
        { href: "/admin/FollowUpAutomation", label: "Follow-up Automation", icon: Clock3, id: "followupautomation" },
        { href: "/admin/LeadScoring", label: "AI Lead Scoring", icon: Flame, id: "leadscoring" },
        { href: "/admin/Reports", label: "Reports", icon: Calendar, id: "reports" },
        { href: "/admin/QAPanel", label: "Student Q&A", icon: MessageSquare, id: "qapanel" },
      ],
    },

    // ---------------- Document Management group ----------------
    {
      id: "docmanagement",
      label: "Document Management",
      icon: FileText,
      children: [
        { href: "/admin/Adminremark", label: "Adminremark", icon: Lock },
        { href: "/admin/AdminDocumentcheck", label: "AdminDocumentcheck", icon: Lock },
        { href: "/admin/DocumentDelete", label: "Document Delete", icon: Lock, id: "DocumentDelete" },
        { href: "/admin/DocReport", label: "DocReport", icon: Lock, id: "DocReport" },
      ],
    },

    // ---------------- Employee Management group ----------------
    {
      id: "empmanagement",
      label: "Employee Management",
      icon: FolderKanban,
      children: [
        { href: "/admin/empmanagement/upload", label: "Employee Upload", icon: Users, id: "employeeupload" },
        { href: "/admin/empmanagement/dashbord", label: "Employee Dashboard", icon: Users, id: "dashbord" },
        { href: "/admin/empmanagement/alerts", label: "Employee Alerts", icon: Users, id: "employeealerts" },
        { href: "/admin/empmanagement/emp", label: "Employee List", icon: Users, id: "employeelist" },
      ],
    },

    {
      id:"Security",
      label:" Security ",
         icon: FolderKanban,
         children:[
        { href: "/admin/SecuritySettings", label: "Security Settings", icon: Lock, id: "securitysettings" },
    { href: "/admin/Security", label: "Security", icon: Lock },

         ],
    },

    { href: "/admin/slotsquery", label: "Slot Management", icon: Users, id: "slotmanagement" },
  ];

  // ----------------------------------------------------------------
  // Permission check helper (same logic as pehle tha)
  // ----------------------------------------------------------------
  const hasAccess = (item) => {
    if (userRole === "admin") return true;
    const matchKey = (item.id || item.label).toLowerCase().trim();
    return permissions.some((p) => p.toLowerCase().trim() === matchKey);
  };

  // Groups ko filter karo: agar group ke andar kam se kam ek child accessible hai to group dikhao,
  // aur sirf accessible children hi group ke andar dikhao.
  const filteredMenu = menuItems
    .map((item) => {
      if (item.children) {
        const visibleChildren = item.children.filter((child) => hasAccess(child));
        if (visibleChildren.length === 0) return null;
        return { ...item, children: visibleChildren };
      }
      return hasAccess(item) ? item : null;
    })
    .filter(Boolean);

  // Agar current pathname kisi group ke andar hai to us group ko default open rakho
  React.useEffect(() => {
    filteredMenu.forEach((item) => {
      if (item.children && item.children.some((c) => c.href === pathname)) {
        setOpenGroups((prev) => ({ ...prev, [item.id]: true }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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

           <AdminNotificationBell />

           <button onClick={handleLogout} className="text-xs text-red-500 px-2 py-1 rounded flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-950/20">
             <LogOut size={14} /> Logout
           </button>
         </div>
      </header>

      {/* SIDEBAR */}
      <aside className={`fixed top-12 left-0 h-full w-60 transition-transform z-40 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 ${darkMode ? "bg-gray-800 border-r border-gray-700 text-gray-200" : "bg-white text-gray-700"}`}>
        <nav className="px-2 py-2 overflow-y-auto h-[calc(100vh-48px)]">
          <ul className="space-y-0.5 pb-20">
            {filteredMenu.map((item) => {
              // ---------- Group item (dropdown) ----------
              if (item.children) {
                const isOpen = !!openGroups[item.id];
                const isChildActive = item.children.some((c) => c.href === pathname);
                const GroupIcon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.id)}
                      className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded text-[12px] transition-colors ${
                        isChildActive
                          ? (darkMode ? "bg-sky-950 text-sky-400 font-semibold" : "bg-sky-100 text-sky-600 font-semibold")
                          : (darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100")
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <GroupIcon size={16} className={isChildActive ? "text-sky-400" : "text-sky-600"} />
                        <span>{item.label}</span>
                      </span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Dropdown children */}
                    <ul
                      className={`overflow-hidden transition-all duration-200 ${
                        isOpen ? "max-h-96 opacity-100 mt-0.5" : "max-h-0 opacity-0"
                      }`}
                    >
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`flex items-center gap-2 pl-7 pr-2 py-1.5 rounded text-[12px] transition-colors ${
                              pathname === child.href
                                ? (darkMode ? "bg-sky-950 text-sky-400 font-semibold" : "bg-sky-100 text-sky-600 font-semibold")
                                : (darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")
                            }`}
                          >
                            <child.icon size={14} className={pathname === child.href ? "text-sky-400" : "text-sky-600"} />
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              // ---------- Normal top-level link ----------
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link href={item.href} className={`flex items-center gap-2 px-2 py-1.5 rounded text-[12px] transition-colors ${
                    pathname === item.href
                      ? (darkMode ? "bg-sky-950 text-sky-400 font-semibold" : "bg-sky-100 text-sky-600 font-semibold")
                      : (darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100")
                  }`}>
                    <Icon size={16} className={pathname === item.href ? "text-sky-400" : "text-sky-600"} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
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
// "use client";
// import React, { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";

// import {
//   User, Mail, LogOut, BadgeCheck, Menu, X,
//   LayoutDashboard, Users, Settings, Lock, MapPin, MessageSquare
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext.jsx";
// import RoleGuard from "@/app/components/RoleGuard.jsx";
// import api from "@/utlis/api.js";
// import NotificationBell from "@/app/counselordashbord/components/NotificationBell.jsx";
// import { disconnectSocket } from "@/utlis/socket.js";

// const SIDEBAR_LINKS = [
//   { name: "Dashboard", icon: LayoutDashboard, path: "/counselordashbord/report" },
//   { name: "My Performance", icon: BadgeCheck, path: "/counselordashbord/myperformance" },
//   { name: "Lead", icon: Users, path: "/counselordashbord/lead" },
//   { name: "My Team", icon: Users, path: "/counselordashbord/myteam", teamLeadOnly: true },
//   { name: "Profile", icon: User, path: "/counselordashbord/profile" },
//   { name: "Referral & Admission", icon: Settings, path: "/counselordashbord/refr" },
//   { name: "Admissions", icon: BadgeCheck, path: "/counselordashbord/admission" },
//   { name: "Generate Ticket", icon: Mail, path: "/counselordashbord/genrateticket" },
//   {name: "Document Upload", icon: Users, path: "/counselordashbord/DocumentUpload" },
//   {name: "Remark History", icon: Users, path:"/counselordashbord/Remarkactivitypage"},
//   {name: "Student Q&A", icon: MessageSquare, path: "/counselordashbord/qa"},
// ];

// export default function CounselorLayout({ children }) {
//   return (
//     <RoleGuard allow={["counselor"]} fallback="/Counslerlogin">
//       <CounselorShell>{children}</CounselorShell>
//     </RoleGuard>
//   );
// }

// function CounselorShell({ children }) {
//   const pathname = usePathname();
//   const { user, logout } = useAuth();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   // Date, Time aur Location ke states add kiye hain
//   const [dateTime, setDateTime] = useState(new Date());
//   const [location, setLocation] = useState("Noida, IN");

//   useEffect(() => {
//     const timer = setInterval(() => setDateTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Module 9: working-hours / idle-time tracking heartbeat
//   useEffect(() => {
//     const sendHeartbeat = () => {
//       api.post("/api/v1/counselor/session/heartbeat").catch(() => {});
//     };
//     sendHeartbeat(); // immediately on mount
//     const heartbeatTimer = setInterval(sendHeartbeat, 60 * 1000);
//     return () => clearInterval(heartbeatTimer);
//   }, []);

//   // Mobile view mein route change hote hi sidebar band ho jaye
//   useEffect(() => {
//     setSidebarOpen(false);
//   }, [pathname]);

//   const handleLogout = () => {
//     disconnectSocket();
//     logout({ redirectTo: "/Counslerlogin" });
//   };

//   if (!user) {
//     return null; // RoleGuard already renders the loading/verifying state
//   }

//   const isUserActive = user.status?.toLowerCase() === "active";

//   return (
//     <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      
//       {/* 1. MOBILE OVERLAY */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* 2. SIDEBAR */}
//       <aside
//         className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-indigo-700 text-white transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
//       >
//         <div className="p-5 border-b border-indigo-600 flex items-center justify-between">
//           <span className="text-xl font-bold tracking-tight">Counselor Panel</span>
//           <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
//             <X size={24} />
//           </button>
//         </div>

//         <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
//           {SIDEBAR_LINKS.filter((item) => !item.teamLeadOnly || user?.isTeamLead).map((item) => {
//             const Icon = item.icon;
//             const isActive = pathname === item.path;

//             return (
//               <Link
//                 key={item.name}
//                 href={isUserActive ? item.path : "#"}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
//                 ${isActive ? "bg-white text-indigo-700 shadow-md scale-105" : "hover:bg-indigo-600 text-indigo-100"}
//                 ${!isUserActive ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 <Icon size={20} />
//                 <span className="font-medium">{item.name}</span>
//                 {!isUserActive && <Lock size={14} className="ml-auto" />}
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>

//       {/* 3. MAIN WRAPPER */}
//       <div className="flex-1 flex flex-col w-full min-w-0">

//         {/* HEADER */}
//         <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-30">
          
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="p-2 hover:bg-gray-100 rounded-lg md:hidden text-gray-600"
//             >
//               <Menu size={24} />
//             </button>

//             <div className="flex items-center">
//               <Image
//                 src="/images/n12.png"
//                 alt="Logo"
//                 width={80}
//                 height={30}
//                 className="object-contain h-8 w-auto"
//                 priority
//               />
//               <div className="hidden sm:block h-6 w-px bg-gray-300 mx-4"></div>
//               <span className="hidden sm:block text-sm font-semibold text-gray-500 uppercase tracking-widest">
//                 Counselor
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* DATE, TIME & LOCATION SECTION (Added) */}
//             <div className="hidden lg:flex flex-col items-end text-gray-500 mr-2">
//               <span className="text-[10px] font-bold uppercase">{dateTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
//               <span className="text-xs font-mono font-bold text-indigo-600">{dateTime.toLocaleTimeString()}</span>
//               <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
//                 <MapPin size={10} /> {location}
//               </div>
//             </div>

//             <NotificationBell />

//             <div className="hidden xs:flex flex-col text-right">
//                <span className="text-sm font-bold text-gray-800 leading-tight">{user.name}</span>
//                <span className="text-[10px] text-green-600 font-bold uppercase">{user.status}</span>
//             </div>

//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors border border-red-100"
//             >
//               <LogOut size={16} />
//               <span className="hidden md:inline">Logout</span>
//             </button>
//           </div>
//         </header>

//         {/* 4. PAGE CONTENT */}
//         <main className="flex-1 overflow-y-auto p-4 md:p-8">
//            <div className="max-w-7xl mx-auto h-full">
//              {children}
//            </div>
//         </main>

//       </div>
//     </div>
//   );
// }


"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  User, Mail, LogOut, BadgeCheck, Menu, X,
  LayoutDashboard, Users, Settings, Lock, MapPin, MessageSquare
} from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import RoleGuard from "@/app/components/RoleGuard.jsx";
import api from "@/utlis/api.js";
import NotificationBell from "@/app/counselordashbord/components/NotificationBell.jsx";
import { disconnectSocket } from "@/utlis/socket.js";

const SIDEBAR_LINKS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/counselordashbord/report" },
  { name: "My Performance", icon: BadgeCheck, path: "/counselordashbord/myperformance" },
  { name: "Lead", icon: Users, path: "/counselordashbord/lead" },
  { name: "My Team", icon: Users, path: "/counselordashbord/myteam", teamLeadOnly: true },
  { name: "Profile", icon: User, path: "/counselordashbord/profile" },
  { name: "Referral & Admission", icon: Settings, path: "/counselordashbord/refr" },
  { name: "Admissions", icon: BadgeCheck, path: "/counselordashbord/admission" },
  { name: "Generate Ticket", icon: Mail, path: "/counselordashbord/genrateticket" },
  {name: "Document Upload", icon: Users, path: "/counselordashbord/DocumentUpload" },
  {name: "Remark History", icon: Users, path:"/counselordashbord/Remarkactivitypage"},
  {name: "Student Q&A", icon: MessageSquare, path: "/counselordashbord/qa"},
];

export default function CounselorLayout({ children }) {
  return (
    <RoleGuard allow={["counselor"]} fallback="/Counslerlogin">
      <CounselorShell>{children}</CounselorShell>
    </RoleGuard>
  );
}

function CounselorShell({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Date, Time aur Location ke states add kiye hain
  const [dateTime, setDateTime] = useState(new Date());
  const [location, setLocation] = useState("Noida, IN");

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Module 9: working-hours / idle-time tracking heartbeat
  useEffect(() => {
    const sendHeartbeat = () => {
      api.post("/api/v1/counselor/session/heartbeat").catch(() => {});
    };
    sendHeartbeat(); // immediately on mount
    const heartbeatTimer = setInterval(sendHeartbeat, 60 * 1000);
    return () => clearInterval(heartbeatTimer);
  }, []);

  // Mobile view mein route change hote hi sidebar band ho jaye
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    disconnectSocket();
    logout({ redirectTo: "/Counslerlogin" });
  };

  if (!user) {
    return null; // RoleGuard already renders the loading/verifying state
  }

  const isUserActive = user.status?.toLowerCase() === "active";

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">

      {/* 1. MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. SIDEBAR — navy blue theme with subtle dotted texture */}
      <aside
        className={`cv-sidebar fixed md:relative inset-y-0 left-0 z-50 w-64 text-white transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <style>{`
          .cv-sidebar {
            background:
              radial-gradient(circle at 1px 1px, rgba(148,180,255,0.16) 1px, transparent 0) 0 0/22px 22px,
              linear-gradient(180deg, #0a1a3f 0%, #0d2456 55%, #0b1f4d 100%);
          }
          .cv-side-link {
            color: #c7d3f5;
          }
          .cv-side-link:hover {
            background: rgba(255,255,255,0.07);
            color: #ffffff;
          }
          .cv-side-link.active {
            background: linear-gradient(90deg, rgba(56,189,248,0.22), rgba(56,189,248,0.06));
            color: #ffffff;
            font-weight: 600;
            box-shadow: inset 3px 0 0 0 #38bdf8;
          }
          .cv-side-icon { color: #7dd3fc; }
          .cv-side-link.active .cv-side-icon { color: #38bdf8; }
        `}</style>

        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">Counselor Panel</span>
          <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-80px)]">
          {SIDEBAR_LINKS.filter((item) => !item.teamLeadOnly || user?.isTeamLead).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={isUserActive ? item.path : "#"}
                className={`cv-side-link flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive ? "active" : ""}
                ${!isUserActive ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon size={20} className="cv-side-icon" />
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
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg md:hidden text-gray-600"
            >
              <Menu size={24} />
            </button>

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
            {/* DATE, TIME & LOCATION SECTION (Added) */}
            <div className="hidden lg:flex flex-col items-end text-gray-500 mr-2">
              <span className="text-[10px] font-bold uppercase">{dateTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className="text-xs font-mono font-bold text-indigo-600">{dateTime.toLocaleTimeString()}</span>
              <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                <MapPin size={10} /> {location}
              </div>
            </div>

            <NotificationBell />

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

        {/* 4. PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
           <div className="max-w-7xl mx-auto h-full">
             {children}
           </div>
        </main>

      </div>
    </div>
  );
}
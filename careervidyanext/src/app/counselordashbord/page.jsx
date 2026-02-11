"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  User,
  Mail,
  Phone,
  LogOut,
  BadgeCheck,
  Menu,
  LayoutDashboard,
  Users,
  Settings,
  Lock,
} from "lucide-react";

/* ================= SIDEBAR LINKS ================= */
const SIDEBAR_LINKS = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/counselordashbord/report",
  },
  {
    name: "Lead",
    icon: Users,
    path: "/counselordashbord/lead",
  },
  {
    name: "Profile",
    icon: User,
    path: "/counselordashbord/profile",
  },
  {
    name: "Referral & Admission",
    icon: Settings,
    path: "/counselordashbord/refr",
  },
];

const CounselorDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ================= AUTH & STATUS CHECK ================= */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  // Define if the user is active
  const isUserActive = user.status?.toLowerCase() === "active";

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-indigo-700 text-white
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* LOGO */}
        <div className="p-5 border-b border-indigo-600 text-xl font-bold">
          Counselor Panel
        </div>

        {/* USER INFO IN SIDEBAR */}
        <div className="p-4 border-b border-indigo-600">
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-indigo-200">{user.email}</p>
          <div className={`mt-2 inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold ${isUserActive ? 'bg-green-500' : 'bg-red-500'}`}>
            {user.status || "Inactive"}
          </div>
        </div>

        {/* LINKS */}
        <nav className="p-3 space-y-1">
          {SIDEBAR_LINKS.map((item) => {
            const Icon = item.icon;
            // Allow clicking ONLY if user is active
            const canAccess = isUserActive;

            return (
              <button
                key={item.name}
                onClick={() => canAccess && router.push(item.path)}
                disabled={!canAccess}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all
                  ${canAccess 
                    ? "hover:bg-indigo-600 cursor-pointer" 
                    : "opacity-40 cursor-not-allowed grayscale"
                  }`}
                style={{ pointerEvents: canAccess ? 'auto' : 'none' }}
              >
                <Icon size={18} />
                <span className="flex-1">{item.name}</span>
                {!canAccess && <Lock size={14} className="text-indigo-300" />}
              </button>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-600">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm hover:text-red-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* ================= HEADER ================= */}
        <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-600"
            >
              <Menu />
            </button>
            <h1 className="text-lg font-bold text-gray-700">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-500 text-sm hover:underline"
            >
              Logout
            </button>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 p-4 md:p-6">
          
          {/* INACTIVE WARNING BANNER */}
          {!isUserActive && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
              <div className="flex items-center gap-3">
                <Lock className="text-red-500" size={20} />
                <div>
                  <p className="text-red-800 font-bold">Account Access Restricted</p>
                  <p className="text-red-700 text-sm">
                    Your account status is currently <strong>"{user.status || "Inactive"}"</strong>. 
                    Navigation links are disabled. Please contact your administrator to activate your account.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Info icon={User} label="Name" value={user.name} />
            <Info icon={Mail} label="Email" value={user.email} />
            <Info icon={Phone} label="Phone" value={user.phone || "N/A"} />
            <Info 
              icon={BadgeCheck} 
              label="Status" 
              value={user.status || "Inactive"} 
              isAlert={!isUserActive}
            />
          </div>

          {/* HELLO CARD */}
          <div className={`${isUserActive ? 'bg-indigo-600' : 'bg-gray-500'} text-white rounded-xl p-6 text-center shadow-lg transition-colors`}>
            <h2 className="text-xl font-bold mb-2">
              Hello {user.name}! {isUserActive ? '🎉' : '🔒'}
            </h2>
            <p className={`${isUserActive ? 'text-indigo-100' : 'text-gray-200'}`}>
              {isUserActive 
                ? "Welcome to your dashboard. Use the sidebar to navigate." 
                : "Your dashboard is currently locked due to your account status."}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

/* ================= INFO CARD COMPONENT ================= */
const Info = ({ icon: Icon, label, value, isAlert }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex gap-3 items-center">
      <Icon className={isAlert ? "text-red-500" : "text-indigo-600"} size={22} />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`font-semibold ${isAlert ? "text-red-600" : "text-gray-800"}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default CounselorDashboard;
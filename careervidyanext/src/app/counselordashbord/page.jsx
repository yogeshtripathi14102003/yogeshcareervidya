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
  BookOpen,
  Settings,
} from "lucide-react";


/* ================= SIDEBAR LINKS ================= */

const SIDEBAR_LINKS = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/counselor/dashboard",
  },
  {
    name: "Lead",
    icon: Users,
    path: "/counselordashbord/lead",
  },
  {
    name: "Courses",
    icon: BookOpen,
    path: "/counselor/courses",
  },
  {
    name: "Profile",
    icon: User,
    path: "/counselor/profile",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/counselor/settings",
  },
];


const CounselorDashboard = () => {

  const router = useRouter();

  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  /* ================= AUTH ================= */
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


        {/* USER */}
        <div className="p-4 border-b border-indigo-600">

          <p className="font-semibold">{user.name}</p>

          <p className="text-xs text-indigo-200">
            {user.email}
          </p>

        </div>


        {/* LINKS */}
        <nav className="p-3 space-y-1">

          {SIDEBAR_LINKS.map((item) => {

            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-600 text-left"
              >
                <Icon size={18} />
                {item.name}
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

            {/* MOBILE MENU */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-600"
            >
              <Menu />
            </button>

            <h1 className="text-lg font-bold text-gray-700">
              Dashboard
            </h1>

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


          {/* PROFILE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">


            <Info
              icon={User}
              label="Name"
              value={user.name}
            />

            <Info
              icon={Mail}
              label="Email"
              value={user.email}
            />

            <Info
              icon={Phone}
              label="Phone"
              value={user.phone || "Not Available"}
            />

            <Info
              icon={BadgeCheck}
              label="Status"
              value={user.status || "Active"}
            />

          </div>


          {/* HELLO CARD */}
          <div className="bg-indigo-600 text-white rounded-xl p-6 text-center">

            <h2 className="text-xl font-bold mb-2">
              Hello {user.name}! 🎉
            </h2>

            <p className="text-indigo-100">
              Welcome to your dashboard.
              Use sidebar to navigate.
            </p>

          </div>

        </main>

      </div>

    </div>
  );
};

export default CounselorDashboard;



/* ================= INFO CARD ================= */

const Info = ({ icon: Icon, label, value }) => {

  return (
    <div className="bg-white rounded-xl shadow p-4 flex gap-3 items-center">

      <Icon className="text-indigo-600" size={22} />

      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>

    </div>
  );
};

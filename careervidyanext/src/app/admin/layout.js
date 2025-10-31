'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu, X, LayoutDashboard, Users, Tag, Image as ImageIcon,
  DollarSign, MessageSquare, Sliders, BarChart, Mail,
  Lock, LogOut, Award
} from 'lucide-react';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie'; // ✅ added for cookie control

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Check for token when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admintoken');
      setHasToken(!!token);

      // 🚨 If no token, redirect to login page (extra safety)
      if (!token) {
        router.push('/');
      }
    }
  }, [router]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // ✅ Secure logout handler
  const handleLogout = async () => {
    try {
      // Optional backend logout request
      await axios.post('http://localhost:8080/api/v1/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // ✅ Remove both cookie & localStorage token
      localStorage.removeItem('admintoken');
      Cookies.remove('admintoken');

      setHasToken(false);
      router.push('/'); // Redirect to home or login
    }
  };

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    {href: '/admin/placestudent', label: 'placed Students', icon: Award},
    { href: '/admin/addteam', label: 'Add Team', icon: Users },
   {href: '/admin/Getalluser', label: 'All Students', icon: Users},
    { href: '/admin/bannerlist', label: 'Banners', icon: ImageIcon },
    { href: '/admin/adduniversitydata', label: 'Universities', icon: Users },
    { href: '/admin/finance_management', label: 'Finances', icon: DollarSign },
    {href: ' /admin/getonlinecourese', label: 'Online Courses', icon: Tag},    
    { href: '/admin/Q&A', label: 'Q & A', icon: MessageSquare },
    { href: '/admin/customization', label: 'Customization', icon: Sliders },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    { href: '/admin/Security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Topbar (mobile) */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-4 py-3 z-50">
        <h1 className="text-lg font-semibold text-gray-700">Admin Panel</h1>
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-200">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-xl flex flex-col transition-transform duration-300 z-40
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:w-[18vw]`}
      >
        <div className="hidden md:flex items-center justify-between p-4 border-b bg-gray-50">
          <h1 className="text-lg font-semibold text-gray-700">Admin Panel</h1>
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-200">
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    pathname === href
                      ? 'bg-sky-100 text-sky-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsSidebarOpen(false)} // auto close on mobile
                >
                  <Icon
                    size={20}
                    className={`${pathname === href ? 'text-sky-600' : 'text-sky-500'}`}
                  />
                  <span className="text-sm">{label}</span>
                </Link>
              </li>
            ))}

            {/* ✅ Logout button visible only if logged in */}
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

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto w-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;

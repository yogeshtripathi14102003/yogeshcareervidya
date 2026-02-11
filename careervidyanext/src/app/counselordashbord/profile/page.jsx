"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Mail, Phone, LogOut, LayoutDashboard,
  Users, CreditCard, MapPin, CalendarDays, Hash, Briefcase, ChevronLeft
} from "lucide-react";

const CounselorProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 font-bold text-indigo-600 animate-pulse">
      Loading...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-inter text-slate-900">
      
      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-sm font-black text-slate-800 tracking-tight uppercase">Profile</h1>
        </div>

        <div className="hidden md:flex items-center gap-5 mr-auto ml-8">
            <button onClick={() => router.push('/counselordashbord')} className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-2">
                <LayoutDashboard size={13}/> Dashboard
            </button>
            <button onClick={() => router.push('/counselordashbord/lead')} className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-2">
                <Users size={13}/> Leads
            </button>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-md transition-all"
        >
          <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-5xl mx-auto p-4 md:p-6">
        
        {/* PROFILE TOP CARD - Compact Version */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row items-center gap-5 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 opacity-[0.03] text-indigo-900 pointer-events-none">
              <User size={150} />
          </div>
          
          <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-3xl font-black border-2 border-white shadow-lg z-10">
              {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="text-center md:text-left z-10 flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                  <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{user.name}</h2>
                  <span className="w-fit mx-auto md:mx-0 px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-[9px] font-black uppercase tracking-wider border border-emerald-200">
                      {user.status || 'Active'}
                  </span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-1">
                <p className="text-indigo-600 font-bold text-[11px] flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded">
                    <Briefcase size={12} /> ID: {user.userid}
                </p>
                <p className="text-slate-500 font-semibold text-[11px] flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                    <Mail size={12} /> {user.email}
                </p>
              </div>
          </div>
        </div>

        {/* DATA GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          <div className="lg:col-span-2 space-y-5">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">General Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoCard icon={Mail} label="Email" value={user.email} color="blue" />
                    <InfoCard icon={Phone} label="Phone" value={user.phone} color="indigo" />
                    <div className="md:col-span-2">
                        <InfoCard icon={MapPin} label="Address" value={user.address} color="rose" />
                    </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoCard 
                      icon={CalendarDays} 
                      label="Birth Date" 
                      value={user.dob ? new Date(user.dob).toLocaleDateString('en-GB') : null} 
                      color="violet" 
                    />
                    <InfoCard 
                      icon={Briefcase} 
                      label="Joining Date" 
                      value={user.doj ? new Date(user.doj).toLocaleDateString('en-GB') : null} 
                      color="emerald" 
                    />
                </div>
              </div>
          </div>

          <div className="space-y-5">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Documents</h3>
              <div className="flex flex-col gap-3">
                  <InfoCard icon={CreditCard} label="PAN" value={user.pan} color="amber" />
                  <InfoCard icon={Hash} label="Aadhar" value={user.aadhar} color="cyan" />
                  
                  <div className="mt-2 p-4 rounded-xl bg-slate-800 text-white relative overflow-hidden shadow-md">
                      <div className="relative z-10">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Security</p>
                        <p className="text-[11px] font-medium opacity-90">Profile is verified & encrypted.</p>
                      </div>
                  </div>
              </div>
          </div>
        </div>

        <footer className="mt-12 pb-6 text-center">
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                ID: {user._id || 'N/A'} • Secured Access
            </p>
        </footer>

      </main>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 p-3 flex gap-3 items-center transition-all hover:border-indigo-300">
      <div className={`p-2 rounded-lg border transition-transform group-hover:scale-105 ${colors[color]}`}>
        <Icon size={16} />
      </div>
      <div className="overflow-hidden">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0">{label}</p>
        <p className="font-bold text-slate-700 truncate text-xs">
            {value && value !== "" ? value : "Pending"}
        </p>
      </div>
    </div>
  );
};

export default CounselorProfile;
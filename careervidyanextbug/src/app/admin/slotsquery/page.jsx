"use client";

import AdminSlots from "../components/AdminSlots.jsx";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminSlotsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 shadow-sm">
        <Link 
          href="/admin/dashboard" // या जो भी आपका मेन डैशबोर्ड राउट हो
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Counseling Slots Directory</h1>
          <p className="text-xs text-slate-500">Slot Management and Student Booking Approval Panel</p>
        </div>
      </div>

      {/* Main Component Render */}
      <div className="p-4 md:p-8">
        <AdminSlots />
      </div>
    </div>
  );
}
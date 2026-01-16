"use client";

import { useState } from "react";
import GetAdmissionForm from "@/app/user/component/Getadmissionfrom.jsx"; // make sure path is correct

export default function DashboardPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Queries" value="12" />
        <StatCard title="Profile Completion" value="80%" />
        <StatCard title="Certificates" value="2" />
      </div>

      <div className="bg-white border rounded p-6">
        <h2 className="text-sm font-medium text-[#1889b9] mb-2">
          Continue Learning
        </h2>
        <p className="text-xs text-gray-500 mb-3">
          Access your enrolled courses.
        </p>
        <button
          onClick={openForm}
          className="px-4 py-2 bg-[#1889b9] text-white text-sm rounded hover:bg-blue-700"
        >
          Get Access
        </button>
      </div>

      {/* Modal / Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md relative">
            <button
              onClick={closeForm}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <GetAdmissionForm closeForm={closeForm} />
          </div>
        </div>
      )}
    </>
  );
}

const StatCard = ({ title, value }) => (
  <div className="bg-white border rounded p-4">
    <p className="text-[11px] text-gray-500">{title}</p>
    <p className="text-lg font-medium text-[#1889b9]">{value}</p>
  </div>
);

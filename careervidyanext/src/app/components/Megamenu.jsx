"use client";
import { useState } from "react";
import { Search } from "lucide-react";

export default function Megamenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-24 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-[80%] max-w-6xl flex p-6 gap-8"
        onClick={(e) => e.stopPropagation()} // Prevent close on inner click
      >
        {/* Left Menu */}
        <div className="w-1/4 border-r pr-4 flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-3">Browse by Domains</h2>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex justify-between">
            PG Courses <span className="text-xs">After Graduation</span>
          </button>

          <button className="flex justify-between items-center text-left text-gray-700 hover:text-blue-600">
            Executive Education <span className="text-xs text-blue-600">CXOs</span>
          </button>

          <button className="flex justify-between items-center text-left text-gray-700 hover:text-blue-600">
            Doctorate/Ph.D. <span className="text-xs text-blue-600">After UG + Work Ex</span>
          </button>

          <button className="flex justify-between items-center text-left text-gray-700 hover:text-blue-600">
            UG Courses <span className="text-xs text-blue-600">After 12th</span>
          </button>

          <button className="flex justify-between items-center text-left text-gray-700 hover:text-blue-600">
            Job Guarantee <span className="text-xs text-blue-600">100% Placement</span>
          </button>

          <button className="flex justify-between items-center text-left text-gray-700 hover:text-blue-600">
            Study Abroad <span className="text-xs text-blue-600">Hybrid Mode</span>
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder='Search "University"'
              className="w-full border rounded-full pl-10 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* MBA Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: "Online MBA",
                subtitle: "80+ Specializations",
                compare: "Compare 37 Universities",
              },
              {
                title: "1 Year MBA Online",
                subtitle: "1 Year",
                compare: "Compare 10 Universities",
                highlight: "ROI 100%",
              },
              {
                title: "Distance MBA",
                subtitle: "2 Years",
                compare: "Compare 15 Universities",
              },
              {
                title: "Executive MBA for Working Professionals",
                subtitle: "12 - 24 Months",
                compare: "Compare 13 Universities",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="border rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  {item.highlight && (
                    <span className="text-xs font-bold text-green-600">
                      ⚡ {item.highlight}
                    </span>
                  )}
                </div>
                <p className="text-sm text-blue-600 font-medium mb-1">
                  {item.subtitle}
                </p>
                <p className="text-sm text-gray-700">{item.compare}</p>
                <a
                  href="#"
                  className="text-blue-600 text-sm font-medium mt-2 inline-block"
                >
                  View Specialisations →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

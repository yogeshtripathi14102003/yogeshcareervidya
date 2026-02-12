"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "@/utlis/api.js";
import {
  Bell,
  Phone,
  CalendarClock,
  User,
  Search,
} from "lucide-react";

/* ================= HELPERS ================= */

// check reminder is today
const isToday = (dateString) => {
  if (!dateString) return false;

  const d = new Date(dateString);
  const today = new Date();

  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
};

// format date
const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

/* ================= COMPONENT ================= */

const MyReminders = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  /* ================= AUTH ================= */
  useEffect(() => {
    const saved = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!saved || !token) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(saved));
  }, [router]);

  /* ================= FETCH REMINDERS ================= */
  useEffect(() => {
    if (user?._id) fetchMyReminders();
  }, [user]);

  const fetchMyReminders = async () => {
    try {
      const res = await api.get("/api/v1/leads/my");

      if (res.data.success) {
        const withReminder = res.data.data.filter(
          (l) => l.followUpDate
        );
        setLeads(withReminder);
      }
    } catch (err) {
      console.log("Reminder Fetch Error", err);
      if (err.response?.status === 401) router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const q = search.toLowerCase();

      return (
        l.name?.toLowerCase().includes(q) ||
        l.phone?.includes(q) ||
        l.course?.toLowerCase().includes(q)
      );
    });
  }, [leads, search]);

  /* ================= TODAY COUNT ================= */
  const todayCount = filteredLeads.filter((l) =>
    isToday(l.followUpDate)
  ).length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* ================= HEADER ================= */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between gap-4">

          <div className="flex items-center gap-4">
            <Bell className="text-indigo-600" size={28} />
            <div>
              <h1 className="text-xl font-bold">My Reminders</h1>
              <p className="text-gray-500 text-sm">
                {user.name}'s follow-ups
              </p>
            </div>
          </div>

          {/* TODAY COUNT */}
          <div
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              todayCount > 0
                ? "bg-red-100 text-red-700 animate-pulse"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Today: {todayCount}
          </div>

        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="max-w-6xl mx-auto bg-white p-4 rounded-xl shadow mb-5 flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, phone or course"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* ================= LIST ================= */}
      <div className="max-w-6xl mx-auto">

        {loading ? (
          <p className="text-center py-10 text-gray-500">
            Loading reminders...
          </p>
        ) : filteredLeads.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No reminders found
          </p>
        ) : (
          <div className="grid gap-4">

            {filteredLeads.map((l) => {
              const today = isToday(l.followUpDate);

              return (
                <div
                  key={l._id}
                  className={`bg-white rounded-xl shadow p-5 border-l-4 transition ${
                    today
                      ? "border-red-500 bg-red-50 animate-pulse"
                      : "border-indigo-600"
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">

                    {/* INFO */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <User size={18} />
                        {l.name}
                      </h3>

                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={16} />
                        {l.phone}
                      </p>

                      <p className="text-sm text-gray-500">
                        Course: {l.course || "N/A"}
                      </p>
                    </div>

                    {/* REMINDER */}
                    <div className="text-right space-y-2">
                      <p
                        className={`flex items-center gap-2 justify-end font-semibold ${
                          today ? "text-red-600" : "text-indigo-600"
                        }`}
                      >
                        <CalendarClock size={18} />
                        {formatDate(l.followUpDate)}
                      </p>

                      <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                        Status: {l.status}
                      </span>

                      {today && (
                        <div className="text-xs font-bold text-red-600">
                          🔔 Today Reminder
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default MyReminders;

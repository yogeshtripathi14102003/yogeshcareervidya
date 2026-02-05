"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utlis/api.js";

import {
  Bell,
  Phone,
  CalendarClock,
  User,
} from "lucide-react";

const MyReminders = () => {

  const router = useRouter();

  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterDate, setFilterDate] = useState("");


  /* ================= AUTH ================= */
  useEffect(() => {

    const saved = localStorage.getItem("user");

    if (!saved) {
      router.push("/login");
    } else {
      setUser(JSON.parse(saved));
    }

  }, [router]);


  /* ================= LOAD REMINDERS ================= */
  useEffect(() => {

    if (user?._id) {
      fetchMyReminders();
    }

  }, [user]);


  const fetchMyReminders = async () => {

    try {

      const res = await api.get(
        `/api/v1/leads?assignedTo=${user._id}`
      );

      if (res.data.success) {

        // Only leads with reminder
        const withReminder = res.data.data.filter(
          (l) => l.followUpDate
        );

        setLeads(withReminder);
      }

    } catch (err) {

      console.log("Reminder Fetch Error", err);

    } finally {

      setLoading(false);
    }
  };


  /* ================= FILTER ================= */
  const filteredLeads = leads.filter((l) => {

    if (!filterDate) return true;

    const date = new Date(l.followUpDate)
      .toISOString()
      .slice(0, 10);

    return date === filterDate;
  });


  /* ================= FORMAT ================= */
  const formatDate = (date) => {

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };


  if (!user) return null;


  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">


      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-6">

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">

          <Bell className="text-indigo-600" size={28} />

          <div>
            <h1 className="text-xl font-bold">
              My Reminders
            </h1>

            <p className="text-gray-500 text-sm">
              {user.name}'s Follow-ups
            </p>
          </div>

        </div>

      </div>


      {/* FILTER */}
      <div className="max-w-6xl mx-auto bg-white p-4 rounded-xl shadow mb-5 flex gap-4">

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border p-2 rounded w-full md:w-52"
        />

        <button
          onClick={() => setFilterDate("")}
          className="text-sm text-indigo-600"
        >
          Clear
        </button>

      </div>


      {/* LIST */}
      <div className="max-w-6xl mx-auto">


        {loading ? (

          <p className="text-center py-10">
            Loading reminders...
          </p>

        ) : filteredLeads.length === 0 ? (

          <p className="text-center text-gray-500 py-10">
            No reminders found
          </p>

        ) : (

          <div className="grid gap-4">


            {filteredLeads.map((l) => (

              <div
                key={l._id}
                className="bg-white rounded-xl shadow p-5 border-l-4 border-indigo-600"
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
                      Course: {l.course}
                    </p>

                  </div>


                  {/* REMINDER */}
                  <div className="text-right space-y-2">

                    <p className="flex items-center gap-2 justify-end text-indigo-600 font-semibold">

                      <CalendarClock size={18} />
                      {formatDate(l.followUpDate)}

                    </p>

                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100">

                      Status: {l.status}

                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default MyReminders;

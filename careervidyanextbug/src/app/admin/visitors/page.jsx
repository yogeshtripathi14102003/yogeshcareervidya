"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

import VisitorList from "@/app/admin/components/VisitorList.jsx";
import ViewVisitorModal from "@/app/admin/components/ViewVisitorModal.jsx";

export default function VisitorDashboard() {
  const [total, setTotal] = useState(0);
  const [daily, setDaily] = useState([]);
  const [showList, setShowList] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [topCourses, setTopCourses] = useState([]);
  const [topCoursesBy, setTopCoursesBy] = useState("views");

  const fetchStats = async () => {
    try {
      const [totalRes, dailyRes] = await Promise.all([
        api.get("/api/v1/total"),
        api.get("/api/v1/daily"),
      ]);
      setTotal(totalRes.data?.totalVisitors || 0);
      setDaily(dailyRes.data?.dailyVisitors || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTopCourses = async (by) => {
    try {
      const res = await api.get("/api/v1/analytics/courses/top", { params: { by, limit: 10 } });
      setTopCourses(res.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { fetchTopCourses(topCoursesBy); }, [topCoursesBy]);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">📊 Visitor Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat title="Total Visits" value={total} />
        <Stat title="Today Visits" value={daily.length ? daily[0].count : 0} />
        <Stat title="Days Tracked" value={daily.length} />
      </div>

      <button onClick={() => setShowList(!showList)} className="px-4 py-2 bg-blue-600 text-white rounded">
        {showList ? "Hide Visitors" : "View Visitors"}
      </button>

      {showList && <VisitorList onView={setSelectedVisitor} />}
      {selectedVisitor && <ViewVisitorModal visitorId={selectedVisitor} onClose={() => setSelectedVisitor(null)} />}

      <div className="bg-white p-6 shadow rounded">
        <h2 className="font-semibold mb-4">📈 Daily Visits</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 shadow rounded">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">🎓 Course Analytics</h2>
          <div className="flex gap-2 text-xs">
            {[
              { key: "views", label: "Top Viewed" },
              { key: "conversion", label: "Top Converted" },
              { key: "registrations", label: "Most Registered" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setTopCoursesBy(opt.key)}
                className={`px-3 py-1.5 rounded-full font-medium ${
                  topCoursesBy === opt.key ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {topCourses.length === 0 ? (
          <p className="text-sm text-gray-400">No course view data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b">
                  <th className="py-2 pr-4">Course</th>
                  <th className="py-2 pr-4">Views</th>
                  <th className="py-2 pr-4">Unique Visitors</th>
                  <th className="py-2 pr-4">Brochure DL</th>
                  <th className="py-2 pr-4">Apply Clicks</th>
                  <th className="py-2 pr-4">Registrations</th>
                  <th className="py-2 pr-4">Conversion %</th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map((c) => (
                  <tr key={c.courseId} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">{c.name || c.slug || c.courseId}</td>
                    <td className="py-2 pr-4">{c.totalViews}</td>
                    <td className="py-2 pr-4">{c.uniqueVisitors}</td>
                    <td className="py-2 pr-4">{c.brochureDownloads}</td>
                    <td className="py-2 pr-4">{c.applyClicks}</td>
                    <td className="py-2 pr-4">{c.registrations}</td>
                    <td className="py-2 pr-4">{c.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const Stat = ({ title, value }) => (
  <div className="bg-white p-5 shadow rounded">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-3xl font-bold">{value}</h2>
  </div>
);

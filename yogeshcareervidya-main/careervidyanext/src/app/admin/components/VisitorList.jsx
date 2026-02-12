"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";

export default function VisitorList({ onView }) {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    api.get("/api/v1/unique").then((res) => {
      setVisitors(res.data.visitors || []);
    }).catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white p-6 shadow rounded mt-4">
      <h2 className="font-semibold mb-4">👥 Visitors</h2>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">IP</th>
            <th className="border p-2">Visits</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map(v => (
            <tr key={v._id}>
              <td className="border p-2">{v.ip}</td>
              <td className="border p-2 text-center">{v.visits}</td>
              <td className="border p-2 text-center">
                <button onClick={() => onView(v._id)} className="text-blue-600 underline">
                  View
                </button>
              </td>
            </tr>
          ))}
          {visitors.length === 0 && <tr><td colSpan="3" className="text-center p-4">No visitors found</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

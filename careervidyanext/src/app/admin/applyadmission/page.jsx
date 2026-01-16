"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Check, Eye } from "lucide-react";

export default function AdminAdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/admissions");
      setAdmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await api.patch(`/api/v1/admissions/${id}/verify`);
      fetchAdmissions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Admission Applications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Course</th>
              <th className="border px-3 py-2">Verified</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions.map((adm) => (
              <tr key={adm._id}>
                <td className="border px-3 py-2">{adm.name}</td>
                <td className="border px-3 py-2">{adm.email}</td>
                <td className="border px-3 py-2">{adm.course}</td>
                <td className="border px-3 py-2">{adm.verified ? "Yes" : "No"}</td>
                <td className="border px-3 py-2 flex gap-2">
                  <button onClick={() => setSelected(adm)} className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded">
                    <Eye size={16} /> View
                  </button>
                  {!adm.verified && (
                    <button onClick={() => handleVerify(adm._id)} className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded">
                      <Check size={16} /> Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for viewing a submission */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded p-6 w-full max-w-2xl relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-600">X</button>
            <h2 className="text-xl font-bold mb-4">{selected.name} - Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(selected).map(([key, value]) => (
                <div key={key}>
                  <span className="font-semibold">{key.replace(/([A-Z])/g, " $1")}</span>: {value instanceof Object && value?.filename ? value.filename : value?.toString()}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              {!selected.verified && (
                <button onClick={() => handleVerify(selected._id)} className="px-4 py-2 bg-green-500 text-white rounded">Verify</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

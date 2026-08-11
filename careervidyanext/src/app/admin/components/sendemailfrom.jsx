"use client";

import { useState } from "react";
import api from "@/utlis/api";

export default function SendEmailModal({ app, onClose, onUpdated }) {
  const [status, setStatus] = useState(app?.status || "Pending");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const sendEmail = async () => {
    if (!app?._id || !app?.email) {
      alert("Application data missing, modal ko dobara open karo.");
      return;
    }

    setLoading(true);
    try {
      // 1) Status DB me update
      await api.patch(`/api/v1/resume/${app._id}/status`, { status });

      // 2) Email bhejo
      const res = await api.post("/api/send-email", {
        email: app.email,
        status,
        description,
      });

      alert(res?.data?.message || "Email Sent!");

      onUpdated?.(); // parent list refresh
      onClose();
    } catch (error) {
      console.log("Send Email Error:", error.response?.data || error);
      alert(
        error.response?.data?.message ||
          "Failed to send email. Check console."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">
          Send Email to {app?.name} ({app?.email})
        </h2>

        {/* Status Dropdown */}
        <label className="font-semibold">Status</label>
        <select
          className="w-full border p-2 rounded mb-4"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Interview Scheduled">Interview Scheduled</option>
          <option value="Rejected">Rejected</option>
          <option value="Hired">Hired</option>
        </select>

        {/* Description */}
        <label className="font-semibold">Description</label>
        <textarea
          className="w-full border p-2 rounded mb-4"
          rows={3}
          placeholder="Write custom message..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={sendEmail}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
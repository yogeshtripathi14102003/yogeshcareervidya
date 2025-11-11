"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js"; // ✅ centralized axios instance

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // ✅ Fetch Subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/subscribers");
      setSubscribers(res.data.subscribers || []);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
      alert("⚠️ Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Newsletter Logs
  const fetchLogs = async () => {
    try {
      const res = await api.get("/api/v1/subscribers");
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  // ✅ Send Newsletter
  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !body) return alert("Please enter both subject and content.");

    try {
      setSending(true);
      const res = await api.post("/api/v1/send", { subject, body });
      if (res.status === 200) {
        alert("✅ Newsletter sent successfully!");
        setSubject("");
        setBody("");
        fetchLogs(); // Refresh logs
      }
    } catch (err) {
      console.error("Error sending newsletter:", err);
      alert("❌ Failed to send newsletter.");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white p-6 shadow-sm flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <i className="fas fa-newspaper text-blue-500"></i> Newsletter Management
        </h1>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 space-y-8">
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-6 flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 font-medium">Total Subscribers</h3>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? "..." : subscribers.length}
              </p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl">
              <i className="fas fa-users"></i>
            </div>
          </div>
        </div>

        {/* NEWSLETTER LOGS */}
        <section className="bg-white shadow rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Sent Newsletters</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-100">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                  <th className="p-3">Subject</th>
                  <th className="p-3">Recipients</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Sent At</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No newsletters sent yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-gray-800">{log.subject}</td>
                      <td className="p-3">{log.recipients?.length || 0}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            log.status === "sent"
                              ? "bg-green-100 text-green-700"
                              : log.status === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {log.sentAt ? new Date(log.sentAt).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* SEND NEWSLETTER FORM */}
        <section className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-plus-circle text-blue-500"></i> Create New Newsletter
          </h2>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Subject
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Write your newsletter content..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Newsletter"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

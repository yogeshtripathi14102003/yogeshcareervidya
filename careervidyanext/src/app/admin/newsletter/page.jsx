"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";

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
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Newsletter Logs (FIXED)
  const fetchLogs = async () => {
    try {
      const res = await api.get("/api/v1/logs");
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  // ✅ Send Newsletter
  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !body) return alert("Please enter both subject & content");

    try {
      setSending(true);

      const res = await api.post("/api/v1/send", {
        subject,
        body,
      });

      if (res.data.success) {
        alert("Newsletter sent successfully!");
        setSubject("");
        setBody("");
        fetchLogs();
      }
    } catch (err) {
      console.error("Error sending newsletter:", err);
      alert("Failed to send newsletter!");
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
      <header className="border-b p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800">
          Newsletter Management
        </h1>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-6 flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 font-medium">Total Subscribers</h3>
              <p className="text-3xl font-bold">
                {loading ? "..." : subscribers.length}
              </p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <i className="fas fa-users"></i>
            </div>
          </div>
        </div>

        {/* NEWSLETTER LOGS */}
        <section className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Sent Newsletters</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
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
                      <td className="p-3">{log.subject}</td>
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
                      <td className="p-3">
                        {log.sentAt
                          ? new Date(log.sentAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* SEND FORM */}
        <section className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Newsletter</h2>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm">
                Email Subject
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-3"
                placeholder="Enter subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Content</label>
              <textarea
                className="w-full border rounded-lg p-3 min-h-[150px]"
                placeholder="Write the newsletter..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Newsletter"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

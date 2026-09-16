"use client";

import { useState, useEffect } from "react";
import api from "@/utlis/api.js"; // Your existing api.js
import {
  Bell,
  X,
  Link as LinkIcon,
  Pencil,
  Trash2,
  Plus,
  RefreshCw,
} from "lucide-react";

const NotificationManager = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  /* ================= FETCH ================= */

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* ================= ADD / UPDATE ================= */

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = { title, description, url };

      if (editingId) {
        await api.put(`/api/v1/notifications/${editingId}`, payload);
      } else {
        await api.post("/api/v1/notifications", payload);
      }

      resetForm();
      fetchNotifications();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving the notification.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      await api.delete(`/api/v1/notifications/${id}`);
      if (editingId === id) resetForm();
      fetchNotifications();
    } catch (err) {
      console.error(err);
      alert("Failed to delete notification.");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (notification) => {
    setEditingId(notification._id);
    setTitle(notification.title || "");
    setDescription(notification.description || "");
    setUrl(notification.url || "");
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl relative my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Bell size={18} className="text-orange-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                Notification Manager
              </h2>
              <p className="text-xs text-slate-500">
                Create, edit and manage notifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchNotifications}
              className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-red-600 transition"
                title="Close"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6"
          >
            <p className="text-sm font-semibold text-slate-700 mb-3">
              {editingId ? "Update Notification" : "New Notification"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

              <div className="relative">
                <LinkIcon
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="URL (optional)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-3 resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                {editingId ? (
                  <>
                    <Pencil size={15} />
                    {submitting ? "Updating..." : "Update Notification"}
                  </>
                ) : (
                  <>
                    <Plus size={15} />
                    {submitting ? "Adding..." : "Add Notification"}
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Notification List */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
              All Notifications ({notifications.length})
            </p>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <RefreshCw size={24} className="text-blue-500 animate-spin" />
                <p className="text-sm text-slate-500 mt-2">
                  Loading notifications...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
                  <Bell size={20} className="text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-2">
                  No notifications found
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Create one using the form above.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`p-3.5 border rounded-lg flex justify-between items-start gap-3 transition ${
                      editingId === n._id
                        ? "border-blue-300 bg-blue-50/50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-slate-800 truncate">
                        {n.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-0.5 break-words">
                        {n.description}
                      </p>
                      {n.url && (
                        <a
                          href={n.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                        >
                          <LinkIcon size={11} />
                          {n.url}
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleEdit(n)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-500 hover:bg-amber-50 transition"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(n._id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationManager;
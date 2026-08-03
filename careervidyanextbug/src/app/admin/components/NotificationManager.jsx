"use client";

import { useState, useEffect } from "react";
import api from "@/utlis/api.js"; // Your existing api.js

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/v1/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Add or Update Notification
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, description, url };

      if (editingId) {
        // Update
        await api.put(`/api/v1/notifications/${editingId}`, payload);
        setEditingId(null);
      } else {
        // Add
        await api.post("/api/v1/notifications", payload);
      }

      setTitle("");
      setDescription("");
      setUrl("");
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      await api.delete(`/api/v1/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit notification
  const handleEdit = (notification) => {
    setEditingId(notification._id);
    setTitle(notification.title);
    setDescription(notification.description);
    setUrl(notification.url || "");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Notification Manager</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="URL (optional)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Notification" : "Add Notification"}
        </button>
      </form>

      {/* Notification List */}
      <div className="space-y-3">
        {notifications.length === 0 && <p>No notifications found.</p>}
        {notifications.map((n) => (
          <div
            key={n._id}
            className="p-3 border rounded flex justify-between items-start"
          >
            <div>
              <h3 className="font-semibold">{n.title}</h3>
              <p>{n.description}</p>
              {n.url && (
                <a href={n.url} target="_blank" className="text-blue-600">
                  {n.url}
                </a>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(n)}
                className="bg-yellow-400 px-2 py-1 rounded text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(n._id)}
                className="bg-red-500 px-2 py-1 rounded text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationManager;

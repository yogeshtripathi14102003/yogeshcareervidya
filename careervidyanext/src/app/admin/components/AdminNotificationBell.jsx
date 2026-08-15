"use client";

import { useEffect, useState } from "react";
import { connectSocket } from "@/utlis/socket.js";
import { Bell, X } from "lucide-react";

export default function AdminNotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    const socket = connectSocket();
    if (!socket) return;

    const handleNew = (notification) => {
      setNotifications((prev) => [{ ...notification, _localId: Date.now() }, ...prev].slice(0, 30));
      setToast(notification);
      setTimeout(() => setToast((cur) => (cur === notification ? null : cur)), 8000);

      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification(notification.title, { body: notification.message });
      }
    };

    socket.on("notification:new", handleNew);
    return () => socket.off("notification:new", handleNew);
  }, []);

  const fmtTime = (d) => {
    const diffMin = Math.round((Date.now() - new Date(d).getTime()) / 60000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    return `${Math.round(diffMin / 60)}h ago`;
  };

  return (
    <>
      <div className="relative">
        <button onClick={() => setOpen((v) => !v)} className="relative p-2 rounded-full hover:bg-slate-100">
          <Bell size={20} />
          {notifications.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-xl border z-50">
            <div className="p-3 border-b font-semibold text-sm flex justify-between items-center">
              Live Alerts
              <button onClick={() => setOpen(false)} className="text-gray-400">
                <X size={14} />
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className="p-4 text-xs text-gray-400">
                Nothing yet this session — connects live, doesn't back-fill history.
              </p>
            ) : (
              notifications.map((n) => (
                <div key={n._localId} className="p-3 border-b last:border-0">
                  <p className="text-xs font-semibold">{n.title}</p>
                  <p className="text-xs text-gray-500">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{fmtTime(n.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-white border shadow-2xl rounded-xl p-4 w-80 z-[100]">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
              <Bell size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{toast.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

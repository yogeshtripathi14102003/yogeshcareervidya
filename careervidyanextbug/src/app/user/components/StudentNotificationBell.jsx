"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utlis/api.js";
import { connectSocket } from "@/utlis/socket.js";
import { Bell, X, MessageSquare } from "lucide-react";

export default function StudentNotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/v1/students/notifications", { params: { limit: 30 } });
      setNotifications(res.data?.data || []);
      setUnreadCount(res.data?.unreadCount || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    const socket = connectSocket();
    if (!socket) return;

    const handleNew = (notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 30));
      setUnreadCount((prev) => prev + 1);
      setToast(notification);
      setTimeout(() => setToast((cur) => (cur?._id === notification._id ? null : cur)), 6000);

      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification(notification.title, { body: notification.message });
      }
    };

    socket.on("notification:new", handleNew);
    return () => socket.off("notification:new", handleNew);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const markAllRead = async () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.patch("/api/v1/students/notifications/read");
    } catch (err) {
      console.error(err);
    }
  };

  const goToQuestion = (notification) => {
    setOpen(false);
    setToast(null);
    if (notification.question) router.push(`/user/qa/${notification.question}`);
  };

  const fmtTime = (d) => {
    const diffMin = Math.round((Date.now() - new Date(d).getTime()) / 60000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffMin < 1440) return `${Math.round(diffMin / 60)}h ago`;
    return new Date(d).toLocaleDateString();
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => {
            setOpen((v) => !v);
            if (!open && unreadCount > 0) markAllRead();
          }}
          className="relative p-2 rounded-full hover:bg-slate-100"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-xl border z-50">
            <div className="p-3 border-b font-semibold text-sm">Notifications</div>
            {notifications.length === 0 ? (
              <p className="p-4 text-xs text-gray-400">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => goToQuestion(n)}
                  className={`w-full text-left p-3 border-b last:border-0 flex gap-2 hover:bg-slate-50 ${!n.read ? "bg-indigo-50/50" : ""}`}
                >
                  <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg h-fit">
                    <MessageSquare size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{n.title}</p>
                    <p className="text-xs text-gray-500 truncate">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{fmtTime(n.createdAt)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-white border shadow-2xl rounded-xl p-4 w-80 z-[100]">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
              <MessageSquare size={16} />
            </div>
            <button className="flex-1 text-left" onClick={() => goToQuestion(toast)}>
              <p className="text-sm font-semibold">{toast.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{toast.message}</p>
            </button>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/utlis/api.js";
import { connectSocket } from "@/utlis/socket.js";
import ReturningVisitorAlert from "@/app/counselordashbord/components/ReturningVisitorAlert.jsx";
import { Bell, X, UserPlus, LogIn, Eye, Download, FileCheck, UserCog, FolderUp } from "lucide-react";

const ICONS = {
  lead_assigned: UserPlus,
  lead_logged_in: LogIn,
  lead_revisited: Eye,
  lead_viewed_fees: Eye,
  lead_brochure_download: Download,
  lead_applied: FileCheck,
  lead_profile_updated: UserCog,
  lead_documents_uploaded: FolderUp,
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/v1/counselor/notifications", { params: { limit: 30 } });
      setNotifications(res.data?.data || []);
      setUnreadCount(res.data?.unreadCount || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Ask for browser notification permission once, quietly — no point
    // nagging if they've already said no.
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    const socket = connectSocket();
    if (!socket) return;

    const handleNew = (notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 30));
      setUnreadCount((prev) => prev + 1);

      // In-dashboard popup
      setToast(notification);
      const dismissAfter = notification.type === "lead_revisited" ? 20000 : 6000;
      setTimeout(() => setToast((cur) => (cur?._id === notification._id ? null : cur)), dismissAfter);

      // Browser notification, if permitted
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification(notification.title, { body: notification.message });
      }
    };

    socket.on("notification:new", handleNew);

    return () => {
      socket.off("notification:new", handleNew);
      // Don't disconnect here — this component can mount/unmount across
      // route changes within the dashboard; the layout owns the connection
      // lifecycle. Actual disconnect happens on logout (see layout).
    };
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
      await api.patch("/api/v1/counselor/notifications/read");
    } catch (err) {
      console.error(err);
    }
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
              notifications.map((n) => {
                const Icon = ICONS[n.type] || Bell;
                return (
                  <div
                    key={n._id}
                    className={`p-3 border-b last:border-0 flex gap-2 ${!n.read ? "bg-indigo-50/50" : ""}`}
                  >
                    <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg h-fit">
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold">{n.title}</p>
                      <p className="text-xs text-gray-500 truncate">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{fmtTime(n.createdAt)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* In-dashboard popup toast */}
      {toast && toast.type === "lead_revisited" ? (
        <ReturningVisitorAlert notification={toast} onClose={() => setToast(null)} />
      ) : toast ? (
        <div className="fixed bottom-6 right-6 bg-white border shadow-2xl rounded-xl p-4 w-80 z-[100] animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
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
      ) : null}
    </>
  );
}

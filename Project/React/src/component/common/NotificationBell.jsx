import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useSocket } from "../../context/SocketContext";

const typeIcon = {
    NEW_TRIP:        "✈️",
    TRIP_CANCEL:     "🚨",
    CANCEL_STATUS:   "📋",
    SUPPORT_MESSAGE: "💬",
};

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell({ theme = "dark" }) {
    const [open, setOpen] = useState(false);
    const dropdownRef     = useRef(null);
    const navigate        = useNavigate();
    const isDark          = theme === "dark";

    const ctx = useSocket();
    const notifications = ctx?.notifications || [];
    const unreadCount   = ctx?.unreadCount   || 0;
    const markOneRead   = ctx?.markOneRead;
    const markAllRead   = ctx?.markAllRead;

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleClick = async (notif) => {
        if (!notif.isRead) await markOneRead?.(notif._id);
        setOpen(false);
        navigate(notif.link);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* ── Bell button ─────────────────────────────────────────────── */}
            <button
                onClick={() => setOpen((o) => !o)}
                title="Notifications"
                className={`relative p-2 rounded-xl transition-all ${
                    isDark
                        ? "text-gray-300 hover:text-white hover:bg-white/10"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
            >
                <FaBell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* ── Dropdown ────────────────────────────────────────────────── */}
            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[200] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex items-center gap-2">
                            <FaBell className="text-indigo-500" size={14} />
                            <span className="font-black text-slate-800 text-sm">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="bg-indigo-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllRead?.()}
                                className="text-[11px] text-indigo-500 hover:text-indigo-700 font-semibold transition-colors"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <FaBell size={28} className="mb-2 opacity-30" />
                                <p className="text-sm font-semibold">No notifications yet</p>
                                <p className="text-xs mt-1 opacity-70">You're all caught up!</p>
                            </div>
                        ) : (
                            notifications.map((notif, idx) => (
                                <button
                                    key={notif._id || idx}
                                    onClick={() => handleClick(notif)}
                                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-indigo-50 ${
                                        !notif.isRead ? "bg-indigo-50/50" : "bg-white"
                                    }`}
                                >
                                    {/* Icon pill */}
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                                        {typeIcon[notif.type] || "🔔"}
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className={`text-xs font-black truncate ${
                                                !notif.isRead ? "text-slate-900" : "text-slate-500"
                                            }`}>
                                                {notif.title}
                                            </p>
                                            {!notif.isRead && (
                                                <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                            {notif.message}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-1">
                                            {timeAgo(notif.createdAt)}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center">
                            <p className="text-[10px] text-slate-400">
                                Showing {notifications.length} most recent notifications
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

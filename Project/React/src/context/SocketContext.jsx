import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import {
    getMyNotifications,
    markNotificationRead,
    markAllNotificationsRead,
} from "../services/notificationService";

const SocketContext = createContext(null);

// Strip /api suffix so socket.io connects to server root, not the REST prefix
const getSocketUrl = () => {
    const url = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return url.replace(/\/api\/?$/, "");
};

export function SocketProvider({ children }) {
    const { user } = useAuth();
    const socketRef = useRef(null);
    const pollRef = useRef(null);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [liveNotif, setLiveNotif] = useState(null);

    // ── Fetch all notifications from DB (initial load + fallback poll) ────────
    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        const res = await getMyNotifications();
        setNotifications(res.data || []);
        setUnreadCount(res.unreadCount || 0);
    }, [user]);

    // Run on mount and whenever user changes
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // ── Socket connection ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!user) {
            socketRef.current?.disconnect();
            socketRef.current = null;
            clearInterval(pollRef.current);
            return;
        }

        const token = sessionStorage.getItem("token");
        if (!token) return;

        // Disconnect any existing socket before creating a new one
        socketRef.current?.disconnect();

        const socket = io(getSocketUrl(), {
            auth: { token },
            transports: ["websocket", "polling"],
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
            timeout: 10000,
        });

        socket.on("connect", () => {
            console.log("🟢 Socket connected:", socket.id, "| role:", user?.role);
        });

        socket.on("disconnect", (reason) => {
            console.log("🔴 Socket disconnected:", reason);
        });

        socket.on("connect_error", (err) => {
            console.warn("⚠️  Socket connect error:", err.message);
        });

        // ── Incoming live notification ─────────────────────────────────────────
        socket.on("new_notification", (notif) => {
            console.log("🔔 Live notification received:", notif.title);

            // Add to top of list
            setNotifications((prev) => {
                // Avoid duplicates (can happen if DB poll and socket fire at same time)
                const isDuplicate = prev.some(
                    (n) => n._id && notif._id && n._id === notif._id
                );
                return isDuplicate ? prev : [notif, ...prev];
            });

            setUnreadCount((prev) => prev + 1);

            // Trigger toast popup
            setLiveNotif({ ...notif, _toastId: Date.now() });
        });

        socketRef.current = socket;

        // ── Fallback: re-fetch from DB every 60 s (catches missed socket emits) -
        clearInterval(pollRef.current);
        pollRef.current = setInterval(() => {
            fetchNotifications();
        }, 60_000);

        return () => {
            socket.disconnect();
            socketRef.current = null;
            clearInterval(pollRef.current);
        };
    }, [user]); // re-run when user logs in / out

    // ── Mark one as read ──────────────────────────────────────────────────────
    const markOneRead = useCallback(async (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        await markNotificationRead(id);
    }, []);

    // ── Mark all as read ──────────────────────────────────────────────────────
    const markAllRead = useCallback(async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        await markAllNotificationsRead();
    }, []);

    const clearLiveNotif = useCallback(() => setLiveNotif(null), []);

    return (
        <SocketContext.Provider value={{
            notifications,
            unreadCount,
            liveNotif,
            clearLiveNotif,
            markOneRead,
            markAllRead,
            refetchNotifications: fetchNotifications,
        }}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);

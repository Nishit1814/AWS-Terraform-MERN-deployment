import axiosInstance from "./axios";

// Get all notifications for the logged-in user/admin
export const getMyNotifications = async () => {
    try {
        const res = await axiosInstance.get("/notifications/my");
        return res.data;
    } catch (err) {
        console.error("getMyNotifications error:", err);
        return { data: [], unreadCount: 0 };
    }
};

// Mark a single notification as read
export const markNotificationRead = async (id) => {
    try {
        await axiosInstance.put(`/notifications/read/${id}`);
    } catch (err) {
        console.error("markNotificationRead error:", err);
    }
};

// Mark all notifications as read
export const markAllNotificationsRead = async () => {
    try {
        await axiosInstance.put("/notifications/read-all");
    } catch (err) {
        console.error("markAllNotificationsRead error:", err);
    }
};

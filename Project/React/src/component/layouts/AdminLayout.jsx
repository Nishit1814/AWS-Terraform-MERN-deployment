import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import AdminSidebar from "../admin/AdminSidebar";
import AdminHeader from "../admin/AdminHeader";
import ProfileSidebar from "./ProfileSidebar";
import { useAuth } from "../../context/AuthContext";

export const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const { user, logout } = useAuth();

    const location = useLocation();

    const getHeaderData = () => {
        switch (location.pathname) {
            case "/payments":
                return {
                    title: "Payments",
                    subtitle: "Total Transactions Overview"
                };

            case "/overview":
                return {
                    title: "Admin Panel",
                    subtitle: "Dashboard"
                };

            case "/admin/edit-profile":
                return {
                    title: "Your Profile",
                    subtitle: ""
                };
            case "/admin/settings":
                return {
                    title: "settings",
                    subtitle: ""
                };

            case "/users":
                return {
                    title: "Users",
                    subtitle: "Manage Explorers"
                };

            case "/trips":
                return {
                    title: "Trips",
                    subtitle: "Inventory Control"
                };

            case "/expired":
                return {
                    title: "Expired Inventory",
                    subtitle: "Passed Capacity Units"
                }

            case "/reviews":
                return {
                    title: "Reviews",
                    subtitle: "User Feedback"
                };

            case "/messages":
                return {
                    title: "Messages",
                    subtitle: "User Queries"
                };
            case "/refund":
                return {
                    title: "Cancellation",
                    subtitle: `Total Cancellation`
                };

            default:
                return {
                    title: "Admin Panel",
                    subtitle: "Dashboard"
                };
        }
    };

    const { title, subtitle } = getHeaderData();

    return (
        <div className="h-screen flex bg-slate-50 overflow-hidden">

            {/* ✅ Sidebar (fixed) */}
            <AdminSidebar
                isCollapsed={isCollapsed}
                onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
            />

            {/* ✅ Main Content */}
            <main
                className={`flex-grow overflow-y-auto transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-72"
                    }`}
            >

                <AdminHeader
                    title={title}
                    subtitle={subtitle}
                    user={user}
                    onProfileClick={() => setIsProfileOpen(true)}
                />

                {/* 🔥 THIS IS IMPORTANT */}
                <div className="p-6">
                    <Outlet />
                </div>
            </main>

            {/* Profile Sidebar */}
            {isProfileOpen && (
                <ProfileSidebar
                    user={user}
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    logout={logout}
                />
            )}
        </div>
    );
};

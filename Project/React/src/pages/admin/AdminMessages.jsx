
import { useState, useEffect, useCallback } from 'react';
import { deleteMessage, getMessages, updateMessageStatus } from '../../services/messageServices';
import { useAuth } from '../../context/AuthContext';

import AdminSidebar from '../../component/admin/AdminSidebar'
import AdminHeader from '../../component/admin/AdminHeader';
import ProfileSidebar from '../../component/layouts/ProfileSidebar';
import Swal from 'sweetalert2';
import { toast } from "react-hot-toast";

const AdminMessages = () => {
    const { user, logout } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [resolutionText, setResolutionText] = useState('');
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [messageFilter, setMessageFilter] = useState('ALL'); // ALL | READ | UNREAD

    const loadMessages = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getMessages();
            console.log("loadMessages:", data)
            setMessages(Array.isArray(data.data) ? data.data : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load messages ❌");
        } finally {
            setLoading(false);
        }
    }, []);
    console.log("messages : ", messages)
    const filteredMessages = messages?.filter(msg => {
        if (messageFilter === 'ALL') return true;
        if (messageFilter === 'READED') return msg.status === 'RESOLVED';
        if (messageFilter === 'UNREAD') return msg.status !== 'RESOLVED';
        return true;
    });

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const handleStatusUpdate = async (id, status, resolution = null) => {
        try {
            const res = updateMessageStatus(id, status, resolution);
            setMessages(res)
            loadMessages();
            setShowResolveModal(false);
            setResolutionText('');
            setSelectedMessage(null);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: err.message,
                confirmButtonColor: "#ef4444"
            });
        }
    };

    const openResolveModal = (msg) => {
        setSelectedMessage(msg);
        setShowResolveModal(true);
    };

    const handleDelete = (id) => {
        toast((t) => (
            <div className=" rounded-xl p-4 w-[300px]">
                <p className="text-sm font-bold text-slate-800 mb-3">
                    Delete this message?
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t._id)}
                        className="px-3 py-1 text-xs bg-gray-200 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={async () => {
                            toast.dismiss(t._id);

                            try {
                                await deleteMessage(id);

                                toast.success("Message deleted ✅");
                                loadMessages();
                            } catch (err) {
                                toast.error("Failed to delete ❌", err);
                            }
                        }}
                        className="px-3 py-1 text-xs bg-rose-500 text-white rounded-lg"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ));
    };

    const handleDeleteAll = async () => {
        if (messages.length === 0) {
            return Swal.fire("Info", "No messages to delete", "info");
        }

        const result = await Swal.fire({
            title: "Delete all messages?",
            text: "This will delete all messages permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e11d48",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete all!"
        });

        if (!result.isConfirmed) return;

        try {
            const results = await Promise.allSettled(
                messages.map((msg) => deleteMessage(msg._id))
            );

            const failed = results.filter(r => r.status === "rejected");

            if (failed.length > 0) {
                Swal.fire("Warning", "Some messages failed to delete", "warning");
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "All messages deleted successfully",
                    timer: 1500,
                    showConfirmButton: false
                });
            }

            loadMessages(); // refresh list
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    const handleDeleteResolved = async () => {
        const resolvedMessages = messages.filter(
            (msg) => msg.status === "RESOLVED"
        );

        if (resolvedMessages.length === 0) {
            return Swal.fire("Info", "No resolved messages found", "info");
        }

        const result = await Swal.fire({
            title: "Delete resolved messages?",
            text: `This will delete ${resolvedMessages.length} resolved messages!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e11d48",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete!"
        });

        if (!result.isConfirmed) return;

        try {
            // 🔥 delete only resolved
            const results = await Promise.allSettled(
                resolvedMessages.map((msg) => deleteMessage(msg._id))
            );

            const failed = results.filter(r => r.status === "rejected");

            if (failed.length > 0) {
                Swal.fire("Warning", "Some messages failed to delete", "warning");
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Resolved messages deleted successfully",
                    timer: 1500,
                    showConfirmButton: false
                });
            }

            loadMessages();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    return (
        <div className="h-screen bg-slate-50 flex text-slate-900 overflow-hidden">
            <AdminSidebar
                isCollapsed={isCollapsed}
                onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
            />

            {/* <main className="flex-grow h-full overflow-y-auto p-8"> */}
            <main
                className={`flex-grow h-full  overflow-y-auto overflow-x-hidden transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-72"}`}
            >
                <AdminHeader
                    title="Support & Inquiries"
                    subtitle={`Total Messages : ${messages.length}`}
                    user={user}
                    onProfileClick={() => setIsProfileOpen(true)}

                />

                <div className="max-w-6xl  m-8 mt-12">
                    <div className="flex justify-between items-center mb-12 flex-wrap gap-4">

                        {/* LEFT SIDE (optional title) */}
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Message Actions
                        </div>

                        {/* RIGHT SIDE BUTTONS */}
                        <div className="flex gap-3">

                            {/* 🟩 Delete Resolved */}
                            <button
                                onClick={handleDeleteResolved}
                                disabled={!messages.some(m => m.status === "RESOLVED")}
                                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all"
                            >
                                Delete Resolved
                            </button>

                            {/* 🟥 Clear All */}
                            <button
                                onClick={handleDeleteAll}
                                disabled={messages.length === 0}
                                className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all"
                            >
                                Clear All
                            </button>

                        </div>
                    </div>
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-6">
                        {['ALL', 'UNREAD', 'READED'].map(type => (
                            <button
                                key={type}
                                onClick={() => setMessageFilter(type)}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${messageFilter === type
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : filteredMessages?.length === 0 ? (
                        <div className="bg-white rounded-[48px] p-20 text-center border border-slate-100 shadow-xl">
                            <div className="text-6xl mb-6">
                                {messageFilter === 'READED' ? '📭' : '📬'}
                            </div>

                            <h2 className="text-2xl font-black text-slate-900">
                                {messageFilter === 'ALL' && "No messages yet"}
                                {messageFilter === 'READED' && "No read messages"}
                                {messageFilter === 'UNREAD' && "No unread messages"}
                            </h2>

                            <p className="text-slate-400 font-medium mt-2">
                                {messageFilter === 'ALL' && "When users contact you, they will appear here."}
                                {messageFilter === 'READED' && "Resolved messages will appear here."}
                                {messageFilter === 'UNREAD' && "New incoming messages will appear here."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredMessages?.map((msg) => (
                                <div key={msg?._id} className={`bg-slate-100 rounded-[32px] py-4 px-3 mb-4 shadow-sm border-l-8 hover:shadow-lg ${msg?.status === 'RESOLVED' ? 'border-l-emerald-400 opacity-75' : 'border-l-indigo-500'}`}>
                                    <div className="flex justify-between items-start ">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl">
                                                {msg?.type === 'CONTACT' ? '👤' : '🎫'}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-900 text-lg">{msg?.fullname}</h3>
                                                <p className="text-xs font-bold text-slate-400">{msg?.email} • {new Date(msg?.createdAt).toLocaleString('en-GB')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${msg?.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {msg?.status}
                                            </span>
                                            <button
                                                onClick={() => handleDelete(msg?._id)}
                                                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-slate-200 rounded-2xl my-4">
                                        <p className="text-[10px] font-black text-slate-400 pt-4 m-4 uppercase tracking-widest mb-2">Subject: {msg?.subject}</p>
                                        <div className="">
                                            <p className="text-slate-800 rounded-sm mx-6 pb-4 font-medium leading-relaxed">{msg?.message}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        {msg?.status !== 'RESOLVED' && (
                                            <button
                                                onClick={() => openResolveModal(msg)}
                                                className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                                            >
                                                Mark as Resolved
                                            </button>
                                        )}
                                        <a
                                            href={`mailto:${msg?.email}?subject=Re: ${msg?.subject}`}
                                            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
                                        >
                                            Reply via Email
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Resolve Modal */}
            {showResolveModal && selectedMessage && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowResolveModal(false)} />
                    <div className="relative bg-white rounded-[48px] p-12 max-w-lg w-full shadow-2xl border-8 border-emerald-50">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Resolve Issue</h3>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Message ID: #{selectedMessage?._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <button
                                onClick={() => setShowResolveModal(false)}
                                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="p-6 bg-slate-100 rounded-3xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">User&apos;s Message</p>
                                <p className="text-sm font-medium text-slate-600 line-clamp-3 italic">&quot;{selectedMessage.message}&quot;</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Resolution Note (Visible to User)</label>
                                <textarea
                                    value={resolutionText}
                                    onChange={(e) => setResolutionText(e.target.value)}
                                    placeholder="Explain how the issue was resolved..."
                                    className="w-full px-8 py-5 bg-slate-100 border border-slate-100 rounded-[32px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium resize-none"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => handleStatusUpdate(selectedMessage._id, 'RESOLVED', resolutionText)}
                                className="w-full bg-emerald-500 text-white py-5 rounded-3xl font-black text-center hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 uppercase tracking-widest text-xs"
                            >
                                Confirm Resolution
                            </button>
                            <button
                                onClick={() => setShowResolveModal(false)}
                                className="w-full bg-slate-100 text-slate-600 py-5 rounded-3xl font-bold hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isProfileOpen && (
                <ProfileSidebar
                    user={user}
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    logout={logout}  // ✅ properly wired
                />
            )}
        </div>
    );
};

export default AdminMessages;

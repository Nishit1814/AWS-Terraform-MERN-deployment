import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { deleteUserbyId, fetchUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import ProfileSidebar from '../../component/layouts/ProfileSidebar';
import Swal from 'sweetalert2';

// ─── Config ──────────────────────────────────────────────────────────────────
const USERS_PER_PAGE = 7;

const AdminUsers = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();


    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    // ─── Pagination State ─────────────────────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);

    // ─── Derived Values ───────────────────────────────────────────────────────
    const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const currentUsers = users.slice(startIndex, startIndex + USERS_PER_PAGE);

    // ─── Load Users ───────────────────────────────────────────────────────────
    const loadUsers = async () => {
        try {
            const res = await fetchUser();
            setUsers(res.users);
        } catch (err) {
            Swal.fire({ title: "Error", text: err.message, icon: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUsers(); }, []);

    const handleDeleteUser = async (id) => {
        if (id === user._id) {
            Swal.fire({
                title: "Not Allowed",
                text: "You cannot delete your own admin account.",
                icon: "warning"
            });
            return;
        }

        // ✅ SweetAlert2 correct confirm syntax
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently remove the user and all their data.",
            icon: "warning",
            showCancelButton: true,       // ✅ This was missing
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#e11d48", // rose-600
            cancelButtonColor: "#64748b",  // slate-500
        });

        if (!result.isConfirmed) return;  // ✅ SweetAlert2 uses result.isConfirmed

        try {
            await deleteUserbyId(id);
            Swal.fire({ title: "Deleted", text: "Account removed successfully.", icon: "success" });
            const updated = users.filter(u => u._id !== id);
            setUsers(updated);
            const newTotalPages = Math.ceil(updated.length / USERS_PER_PAGE);
            if (currentPage > newTotalPages) setCurrentPage(newTotalPages || 1);
        } catch (e) {
            Swal.fire({ title: "Error", text: e.message, icon: "error" });
        }
    };

    // ─── Pagination Controls ──────────────────────────────────────────────────
    const goToPage = (page) => setCurrentPage(page);
    const goToPrev = () => setCurrentPage(p => Math.max(p - 1, 1));
    const goToNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));

    // Generate page numbers with ellipsis: [1] ... [4][5][6] ... [10]
    const getPageNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
        if (currentPage >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="h-screen bg-slate-50 flex text-slate-900 transition-all duration-300 overflow-hidden">

            <main className={`flex-grow h-full  overflow-y-auto overflow-x-hidden transition-all duration-300`}>

                <div className="p-8">
                    <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">

                        {/* ── Table ── */}
                        {loading ? (
                            <div className="flex justify-center items-center py-24 text-slate-400 font-black uppercase tracking-widest text-xs">
                                Loading members...
                            </div>
                        ) : currentUsers.length === 0 ? (
                            <div className="flex justify-center items-center py-24 text-slate-400 font-black uppercase tracking-widest text-xs">
                                No users found.
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                                    <tr>
                                        <th className="px-10 py-6">Member Identity</th>
                                        <th className="px-10 py-6 text-right">System Controls</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {currentUsers.map(u => (
                                        <tr key={u._id} className="text-slate-600 hover:bg-slate-50/50 transition-all group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-5">
                                                    {u?.profilePhoto ? (
                                                        <img
                                                            src={u.profilePhoto}
                                                            className="w-14 h-14 rounded-2xl border-2 border-white shadow-md object-cover"
                                                            alt={u.fullname}
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-indigo-600 text-white text-xl rounded-xl flex items-center justify-center font-bold">
                                                            {u?.fullname?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-black text-slate-900 text-base tracking-tight leading-none mb-1">{u.fullname}</p>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => navigate(`/users/profile/${u._id}`)}
                                                        className="bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        View Profile
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(u._id)}
                                                        className="bg-rose-50 text-rose-600 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        Delete Account
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* ── Pagination Bar ── */}
                        {!loading && totalPages > 1 && (
                            <div className="flex items-center justify-between px-10 py-5 border-t border-slate-100">

                                {/* Result count */}
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                    Showing {startIndex + 1}–{Math.min(startIndex + USERS_PER_PAGE, users.length)} of {users.length} members
                                </p>

                                {/* Page buttons */}
                                <div className="flex items-center gap-2">

                                    {/* Prev */}
                                    <button
                                        onClick={goToPrev}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        ← Prev
                                    </button>

                                    {/* Page Numbers */}
                                    {getPageNumbers().map((page, idx) =>
                                        page === "..." ? (
                                            <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-xs font-black">...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`w-9 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                                    ${currentPage === page
                                                        ? "bg-indigo-600 text-white shadow-md"
                                                        : "bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}

                                    {/* Next */}
                                    <button
                                        onClick={goToNext}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

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

export default AdminUsers;
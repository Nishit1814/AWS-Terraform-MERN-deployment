
import { useState, useEffect, useMemo } from 'react';
import { fetchPayment } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { fetchUser } from '../../services/authService';
import { AnimatePresence, motion } from 'motion/react';
import useTrips from '../../hooks/useTrips';
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const AdminPayments = () => {

    const { trips } = useTrips();
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserForModal, setSelectedUserForModal] = useState(null);
    const [filterType, setFilterType] = useState('ALL'); // ALL, DAY, DATE, YEAR
    const [filterDate, setFilterDate] = useState('');
    const [users, setUsers] = useState([]);


    // useEffect(() => {
    //     const loadData = async () => {
    //         try {
    //             const [p, u] = await Promise.all([
    //                 fetchPayment(),
    //                 fetchUser()
    //             ]);
    //             setPayments(p.payments);
    //             setUsers(u.users);
    //         } catch (err) {
    //             console.error("Failed to load Payments data", err);

    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Load Failed",
    //                 text: "Unable to fetch payments data",
    //                 confirmButtonColor: "#ef4444"
    //             });
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     loadData();
    // }, [user]);


    // const filteredPayments = payments.filter(p => {
    //     if (filterType === 'ALL') return true;

    //     const pDate = new Date(p.createdAt);
    //     const now = new Date();

    //     if (filterType === 'TODAY') {
    //         return (
    //             pDate.getDate() === now.getDate() &&
    //             pDate.getMonth() === now.getMonth() &&
    //             pDate.getFullYear() === now.getFullYear()
    //         );
    //     }

    //     if (filterType === 'MONTH') {
    //         return (
    //             pDate.getMonth() === now.getMonth() &&
    //             pDate.getFullYear() === now.getFullYear()
    //         );
    //     }

    //     if (filterType === 'DATE' && filterDate) {
    //         return pDate.toDateString() === new Date(filterDate).toDateString();
    //     }

    //     if (filterType === 'YEAR') {
    //         return pDate.getFullYear() === now.getFullYear();
    //     }

    //     return true;
    // });

    // const uniqueUsers = Object.values(
    //     filteredPayments.reduce((acc, p) => {
    //         const userId = p.userId._id;

    //         if (!acc[userId]) {
    //             acc[userId] = p; // store first transaction only
    //         }

    //         return acc;
    //     }, {})
    // );

    // const userPaymentsForModal = selectedUserForModal
    //     ? payments.filter(p => p.userId._id === selectedUserForModal._id)
    //     : [];
    // console.log("selectedUserForModal : ", selectedUserForModal)

    // useEffect(() => {
    //     if (!loading && filteredPayments.length === 0) {
    //         toast("No payments found for selected filter");
    //     }
    // }, [filteredPayments, loading]);
    // 🔥 Load Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const [p, u] = await Promise.all([
                    fetchPayment(),
                    fetchUser()
                ]);

                setPayments(p.payments);
                setUsers(u.users);

            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Load Failed",
                    text: "Unable to fetch payments data".$(err),
                });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    // 🔥 Maps for fast lookup
    const userMap = useMemo(() => {
        return Object.fromEntries(users.map(u => [u._id, u]));
    }, [users]);

    const tripMap = useMemo(() => {
        return Object.fromEntries(trips.map(t => [t._id, t]));
    }, [trips]);

    // 🔥 Filter logic
    const filteredPayments = useMemo(() => {
        return payments.filter(p => {
            if (filterType === 'ALL') return true;

            const pDate = new Date(p.createdAt);
            const now = new Date();

            if (filterType === 'TODAY') {
                return pDate.toDateString() === now.toDateString();
            }

            if (filterType === 'MONTH') {
                return (
                    pDate.getMonth() === now.getMonth() &&
                    pDate.getFullYear() === now.getFullYear()
                );
            }

            if (filterType === 'YEAR') {
                return pDate.getFullYear() === now.getFullYear();
            }

            if (filterType === 'DATE' && filterDate) {
                return pDate.toDateString() === new Date(filterDate).toDateString();
            }

            return true;
        });
    }, [payments, filterType, filterDate]);

    // 🔥 Trip count per user
    // const tripCountMap = useMemo(() => {
    //     return payments.reduce((acc, p) => {
    //         acc[p.userId._id] = (acc[p.userId._id] || 0) + 1;
    //         return acc;
    //     }, {});
    // }, [payments]);

    // ✅ Fix — count only within filtered period
    const tripCountMap = useMemo(() => {
        return filteredPayments.reduce((acc, p) => {
            acc[p.userId._id] = (acc[p.userId._id] || 0) + 1;
            return acc;
        }, {});
    }, [filteredPayments]);


    // 🔥 Unique Users
    const uniqueUsers = useMemo(() => {
        const map = {};
        filteredPayments.forEach(p => {
            if (!map[p.userId._id]) {
                map[p.userId._id] = p;
            }
        });
        return Object.values(map);
    }, [filteredPayments]);

    // 🔥 Clean Table Data
    const tableData = useMemo(() => {
        return uniqueUsers.map(p => ({
            ...p,
            cust: userMap[p.userId._id],
            trip: tripMap[p.tripId],
            tripCount: tripCountMap[p.userId._id]
        }));
    }, [uniqueUsers, userMap, tripMap, tripCountMap]);

    // 🔥 Modal Data
    // const userPaymentsForModal = useMemo(() => {
    //     if (!selectedUserForModal) return [];
    //     return payments.filter(p => p.userId._id === selectedUserForModal._id);
    // }, [selectedUserForModal, payments]);

    // ✅ Fix — respects the active date filter
    const userPaymentsForModal = useMemo(() => {
        if (!selectedUserForModal) return [];
        return filteredPayments.filter(p => p.userId._id === selectedUserForModal._id);
    }, [selectedUserForModal, filteredPayments]);

    useEffect(() => {
        if (!loading && filteredPayments.length === 0) {
            toast("No payments found");
        }
    }, [filteredPayments, loading]);

    return (
        <div className="h-screen bg-slate-50 flex text-slate-900 transition-all duration-300 overflow-hidden">


            <main
                className={"flex-grow h-full  overflow-y-auto overflow-x-hidden transition-all duration-300"}
            >


                <div className="p-2 space-y-6">
                    {/* Filters */}
                    <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
                        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                            {['ALL', 'TODAY', 'MONTH', 'YEAR'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setFilterType('DATE')}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === 'DATE' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                                    }`}
                            >
                                Custom Date
                            </button>
                            {filterType === 'DATE' && (
                                <input
                                    type="date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="bg-slate-100 border-none rounded-2xl px-4 py-2 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-600"
                                />
                            )}
                        </div>

                        <div className="ml-auto text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Showing {filteredPayments.length} Signals
                        </div>
                    </div>

                    {filteredPayments?.length === 0 ? (
                        <div className="bg-white rounded-[40px] p-24 text-center border border-slate-200 shadow-sm">
                            <span className="text-7xl block mb-6 opacity-10">💸</span>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Registry Silent</h2>
                            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">No transaction signals detected for this period</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">

                            {filteredPayments.length > 0 && (
                                <div className="grid grid-cols-3 m-5 gap-5">
                                    {[
                                        {
                                            label: "Total Revenue",
                                            value: `₹${filteredPayments.reduce((s, p) => s + p.amount, 0).toLocaleString("en-IN")}`,
                                            color: "text-emerald-600"
                                        },
                                        {
                                            label: "Unique Customers",
                                            value: uniqueUsers.length,
                                            color: "text-indigo-600"
                                        },
                                        {
                                            label: "Avg. Transaction",
                                            value: `₹${Math.round(filteredPayments.reduce((s, p) => s + p.amount, 0) / filteredPayments.length).toLocaleString()}`,
                                            color: "text-slate-900"
                                        }
                                    ].map(stat => (
                                        <div key={stat.label} className="bg-white rounded-[24px] border border-slate-200 p-6">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                                            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}


                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-6">Protocol Hash</th>
                                        <th className="px-8 py-6">Source Node</th>
                                        <th className="px-8 py-6"> total Destination</th>
                                        <th className="px-8 py-6">Volume</th>
                                        <th className="px-8 py-6">Timestamp</th>
                                        <th className="px-8 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tableData.map(p => {
                                        // const cust = users.find(u => u._id === p.userId._id);
                                        // const trip = trips.find(t => t._id === p.tripId);
                                        // const tripCount = payments.filter(x => x.userId._id === p.userId._id).length;

                                        return (
                                            <tr key={p._id} className="text-slate-600 hover:bg-slate-50 transition-colors group">

                                                {/* Protocol */}
                                                <td className="px-8 py-6 font-mono text-[10px] text-indigo-600 font-black">
                                                    #{p.transactionId}
                                                </td>

                                                {/* User */}
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={p.cust?.profilePhoto || "https://ui-avatars.com/api/?name=" + (p.cust?.fullname || "User")}
                                                            className="w-10 h-10 rounded-2xl border-2 border-white shadow-sm ring-1 ring-slate-100"
                                                            alt=""
                                                        />
                                                        <div>
                                                            <span className="block font-black text-xs text-slate-900">
                                                                {p.cust?.fullname || 'Anonymous Node'}
                                                            </span>
                                                            {/* <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                                {p.paymentMethod}
                                                            </span> */}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Destination */}
                                                <td className="px-8 py-6">
                                                    <span className="font-black text-xs text-slate-900 block">
                                                        {p.tripCount || 'Unknown'}
                                                    </span>
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                        #{p?.tripId?.slice(-6)}
                                                    </span>
                                                </td>
                                                {console.log("Destination:", p.trip?.to)}
                                                {/* Volume */}
                                                <td className="px-8 py-6 font-black text-slate-900 text-lg">
                                                    ₹{p.amount.toLocaleString()}
                                                </td>

                                                {/* Timestamp */}
                                                <td className="px-8 py-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {new Date(p.createdAt).toLocaleString('en-GB')}
                                                </td>

                                                {/* Action */}
                                                <td className="px-8 py-6 text-right">
                                                    <button
                                                        onClick={() => setSelectedUserForModal(p.cust)}
                                                        className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-[8px] font-black uppercase"
                                                    >
                                                        View Transactions
                                                    </button>
                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main >

            {/* User Transactions Modal */}
            <AnimatePresence >
                {selectedUserForModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[48px] overflow-hidden flex flex-col shadow-2xl relative"
                        >
                            <button
                                onClick={() => {
                                    setSelectedUserForModal(null);
                                }}
                                className="absolute top-8 right-8 w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 transition-all font-black"
                            >
                                ✕
                            </button>

                            <div className="p-12 border-b border-slate-100 flex items-center gap-6">


                                {/* selectedUserForModal.profilePhoto ? */}
                                <img src={selectedUserForModal?.profilePhoto || `https://ui-avatars.com/api/?name=${selectedUserForModal?.fullname}`} className="w-20 h-20 rounded-[28px] shadow-xl border-4 border-white" alt="" />
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Transaction Node History</h3>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                                        Audit Stream for {selectedUserForModal?.fullname}
                                        {filterType !== 'ALL' && (
                                            <span className="ml-2 text-indigo-400">· Filtered: {filterType}</span>
                                        )}

                                    </p>
                                </div>
                                <div className="ml-auto bg-emerald-50 px-8 py-4 rounded-3xl text-center">
                                    <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Volume</p>
                                    <p className="text-2xl font-black text-emerald-700 tracking-tighter">
                                        ₹{userPaymentsForModal?.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-grow overflow-y-auto p-12 custom-scrollbar">
                                {userPaymentsForModal.length === 0 ? (
                                    <p className="text-center py-20 font-black text-slate-300 uppercase tracking-widest">No transaction records found</p>
                                ) : (
                                    <div className="space-y-4">
                                        {userPaymentsForModal.map(p => {
                                            const trip = trips.find(t => t._id === p.tripId);
                                            return (
                                                <div key={p.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100 hover:border-indigo-200 transition-all group">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                                            {p.paymentMethod.includes('UPI') ? '📱' : '💳'}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-black text-slate-900">{p?.tripname || trip?.to || 'Unknown Trip'}</span>
                                                                <span className="text-[9px] font-mono text-indigo-600 font-black">#{p.transactionId}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(p.createdAt).toLocaleString()}</span>
                                                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{p.paymentMethod}</span>
                                                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{p.numPersons || 1} Travelers</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xl font-black text-slate-900 tracking-tight">₹{p.amount.toLocaleString()}</div>
                                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Completed</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Transition : {userPaymentsForModal.length}</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >
        </div >
    );
};

export default AdminPayments;

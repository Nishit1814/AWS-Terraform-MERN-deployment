
import React, { useCallback, useState } from 'react';
import Footer from '../../component/layouts/Footer';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { clearHistory, fetchHistoryByUserId } from '../../services/historyService';
import { fetchTrip } from '../../services/tripServices';
import { fetchPaymentByUserId } from '../../services/paymentService';
import { deleteMessage, getUserMessages } from '../../services/messageServices';
import { InvoiceButton } from '../../component/layouts/InvoiceButton';
import { getUserCancellations } from '../../services/cancellationService';
import { ActionButtons, ImageStatusBadge, imageTint, PriceLabel } from '../../component/common/ImageStatusBadge';


const HistoryPage = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [trips, setTrips] = useState([]);
    const [payments, setPayments] = useState([]);
    const [cancellations, setCancellations] = useState([]);
    const [userMessages, setUserMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('history');
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const tab = queryParams.get("active");
        setActiveTab(tab || "history");
    }, [])
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [filterState, setFilterState] = useState({ all: true, created: false, joined: false });

    const loadData = useCallback(async () => {
        if (!user?._id) { setLoading(false); return; }
        try {
            const [h, t, p, m, c] = await Promise.all([
                fetchHistoryByUserId(user._id),
                fetchTrip(),
                fetchPaymentByUserId(),
                getUserMessages(user._id),
                getUserCancellations(),
            ]);
            setHistory(h.history || []);
            setTrips(t.trip);
            setPayments(p.payments || []);
            setUserMessages(m.data);
            setCancellations(c || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);
    console.log("userMessages :", userMessages)
    useEffect(() => { if (user?._id) loadData(); }, [user]);

    const handleCheckboxChange = (name) => {
        if (name === 'all') {
            setFilterState({ all: true, created: false, joined: false });
        } else {
            setFilterState({ ...filterState, all: false, [name]: !filterState[name] });
        }
    };
    console.log("payments : ", payments)

    const filteredHistory = history.filter(h => {
        if (filterState.all) return true;
        if (filterState.created && h.type === 'CREATED') return true;
        if (filterState.joined && h.type === 'JOINED') return true;
        return false;
    });

    const handleClearHistory = async () => {
        try {
            if (activeTab === 'history') {
                await clearHistory(user._id);
                setHistory([]);
            } else {
                await deleteMessage(user._id);
                setUserMessages([]);
            }
            setShowClearConfirm(false);
        } catch (err) {
            console.error(err);
            alert(`Failed to clear ${activeTab === 'history' ? 'history' : 'support requests'}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <main className="max-w-5xl mx-auto px-4 py-12 flex-grow w-full">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">Travel Journey</h1>
                        <p className="text-xl text-slate-500 font-medium">Relive your planned and joined adventures.</p>
                    </div>
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        className="bg-white text-rose-500 border-2 border-rose-100 px-8 py-3 rounded-2xl font-black hover:bg-rose-50 transition-all text-sm uppercase tracking-widest shadow-lg shadow-rose-100"
                    >
                        {activeTab === 'history' ? 'Clear My History' : 'Clear Support Requests'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
                    >
                        Trip History
                    </button>
                    <button
                        onClick={() => setActiveTab('support')}
                        className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3 ${activeTab === 'support' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
                    >
                        Support Requests ({userMessages?.length + cancellations?.length})
                        {(userMessages?.some(m => m?.status === 'RESOLVED') || cancellations?.some(c => c?.status === 'APPROVED' || c?.status === 'REJECTED')) && (
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        )}
                    </button>
                </div>

                {/* ── TRIP HISTORY TAB ──────────────────────────────────────── */}
                {activeTab === 'history' ? (
                    <>
                        {/* Filter */}
                        <div className="flex flex-wrap items-center gap-8 mb-12 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Filter Records:</span>
                            {[
                                { key: 'all', label: 'All Trips' },
                                { key: 'created', label: 'Created Trip' },
                                { key: 'joined', label: 'Joined Trips' },
                            ].map(({ key, label }) => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filterState[key]}
                                        onChange={() => handleCheckboxChange(key)}
                                        className="w-6 h-6 rounded-lg border-2 border-slate-200 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                                    />
                                    <span className={`font-bold transition-all ${filterState[key] ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-800'}`}>
                                        {label}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {filteredHistory?.length === 0 ? (
                            <div className="bg-white rounded-[48px] p-24 text-center border border-slate-100 shadow-xl">
                                <div className="text-8xl mb-8 opacity-20">🏜️</div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4">No records found</h2>
                                <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">Either you haven&apos;t booked anything yet or the filters are active.</p>
                                <Link to="/join-trip" className="bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 inline-block transition-all uppercase tracking-widest text-sm">
                                    Discover Tours
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8">
                                {filteredHistory?.map(item => {
                                    const trip = trips.find(t => t._id === item?.tripId?._id);
                                    if (!trip) return null;

                                    const payment = payments?.find(p => {
                                        const pid = p?.tripId?._id || p?.tripId;
                                        console.log("History pid : ", pid);
                                        return pid?.toString() === trip?._id?.toString()
                                            && p?.userId?.toString() === user?._id?.toString();
                                    });
                                    console.log("History payment : ", payment);
                                    // Find any cancellation for this payment
                                    const cancellation = cancellations.find(c =>
                                        c?.paymentId?._id?.toString() === payment?._id?.toString()
                                        || c?.paymentId?.toString() === payment?._id?.toString()
                                    );

                                    const cancelStatus = cancellation?.status || null;

                                    return (
                                        <div
                                            key={item?._id}
                                            className={" overflow-hidden shadow-sm hover:shadow-2xl flex flex-col md:flex-row transition-all group rounded-4xl"}
                                        // className={`bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 flex flex-col md:flex-row transition-all group border-l-8 ${borderColor(cancelStatus)}`}
                                        >
                                            {/* ── Image panel ─────────────────────────────────── */}
                                            <div className="md:w-80 h-48 md:h-auto overflow-hidden relative flex-shrink-0">
                                                <img
                                                    src={trip?.images[0]}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    alt=""
                                                />

                                                {/* Tint overlay for cancelled/pending */}
                                                {cancelStatus && (
                                                    <div className={`absolute inset-0 ${imageTint(cancelStatus)}`} />
                                                )}

                                                {/* Trip type badge (top-left) */}
                                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-md z-10">
                                                    {item?.type === 'CREATED' ? 'AI Planned' : 'Community'}
                                                </div>

                                                {/* Status badge (bottom-centre) */}
                                                <ImageStatusBadge status={cancelStatus} />
                                            </div>

                                            {/* ── Content panel ───────────────────────────────── */}
                                            <div className="flex-grow p-10 flex flex-col justify-between  ">
                                                <div>
                                                    {/* Title + price row */}
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <h3 className="text-3xl font-black text-slate-900">{trip?.to}</h3>
                                                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
                                                                {trip?.from} &bull; {trip?.startDate}
                                                            </p>
                                                        </div>
                                                        <PriceLabel
                                                            status={cancelStatus}
                                                            price={trip?.price}
                                                            type={item?.type}
                                                        />
                                                    </div>

                                                    {/* Info grid */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-slate-100">
                                                        <div>
                                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Departure</p>
                                                            <p className="text-sm font-bold text-slate-800">{new Date(trip?.startDate).toLocaleDateString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Travel Mode</p>
                                                            <p className="text-sm font-bold text-slate-800">{trip?.transportMode}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Ref ID</p>
                                                            <p className="text-sm font-bold text-slate-800">#{item?._id?.slice(-6)?.toUpperCase()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Agency</p>
                                                            <p className="text-sm font-bold text-slate-800">
                                                                {trip?.description?.includes('Organized by')
                                                                    ? trip?.description?.split('.')[0].replace('Organized by ', '')
                                                                    : 'AI Planner'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ── Action buttons (smart, based on cancel status) */}
                                                <ActionButtons
                                                    status={cancelStatus}
                                                    cancellation={cancellation}
                                                    trip={trip}
                                                    payment={payment}
                                                    item={item}
                                                    onSupport={(t) => { setSelectedTrip(t); setShowSupportModal(true); }}
                                                    onLoadData={loadData}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-y-12">

                        {/* ══ SECTION 1: REFUND / CANCELLATION REQUESTS ════════ */}
                        {cancellations.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-base">💸</div>
                                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">Refund Requests</h2>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black">{cancellations.length}</span>
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    {cancellations.map(c => {
                                        const tripForCancel = trips.find(t => t._id?.toString() === (c.tripId?._id || c.tripId)?.toString());
                                        const isApproved = c.status === 'APPROVED';
                                        const isRejected = c.status === 'REJECTED';
                                        const isPending = c.status === 'PENDING';

                                        return (
                                            <div key={c._id} className={`bg-white rounded-[28px] p-8 shadow-sm border-l-4 ${isApproved ? 'border-l-emerald-400 border border-emerald-100' : isRejected ? 'border-l-red-400 border border-red-50' : 'border-l-amber-400 border border-amber-50'}`}>
                                                {/* ── Header row ──────────────────────── */}
                                                <div className="flex justify-between items-start mb-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isApproved ? 'bg-emerald-50' : isRejected ? 'bg-red-50' : 'bg-amber-50'}`}>
                                                            {isApproved ? '✅' : isRejected ? '❌' : '⏳'}                                                         </div>
                                                        <div>
                                                            <h3 className="font-black text-slate-900 text-base">
                                                                Cancellation — {tripForCancel?.to || c.tripId?.to || 'Trip'}
                                                            </h3>                                                            <p className="text-xs font-bold text-slate-400 mt-0.5">
                                                                Submitted on {new Date(c.createdAt).toLocaleString('en-GB')}                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Status badge */}
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isApproved ? 'bg-emerald-50 text-emerald-600' :
                                                        isRejected ? 'bg-red-50 text-red-500' :
                                                            'bg-amber-50 text-amber-600'
                                                        }`}>
                                                        {isPending ? 'Pending Review' : c.status}
                                                    </span>                                                </div>

                                                {/* ── Details grid ─────────────────────── */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-y border-slate-100 mb-5">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Refund Amount</p>
                                                        <p className="text-lg font-black text-slate-900">₹{c.refundAmount?.toLocaleString() || '—'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Refund %</p>
                                                        <p className="text-lg font-black text-slate-900">{c.refundPercent ?? '—'}%</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">UPI ID</p>
                                                        <p className="text-sm font-bold text-slate-700 truncate">{c.upiId || '—'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Days Before Trip</p>
                                                        <p className="text-lg font-black text-slate-900">{c.diffDays ?? '—'}</p>
                                                    </div>
                                                </div>

                                                {/* ── Reason ───────────────────────────── */}
                                                <div className="bg-slate-50 px-5 py-4 rounded-2xl mb-4">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Reason</p>
                                                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{c.reason}</p>
                                                </div>

                                                {/* ── APPROVED: refund success message ─── */}
                                                {isApproved && <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-black">✓</span>
                                                        <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Refund Approved</p>
                                                    </div>
                                                    <p className="text-sm font-medium text-emerald-800 leading-relaxed mb-3">
                                                        Your refund of <span className="font-black">₹{c.refundAmount?.toLocaleString()}</span> has been approved and will be transferred to your UPI account <span className="font-black">{c.upiId}</span>.
                                                    </p>
                                                    {/* Show TXN ID if refund already processed */}
                                                    {c.paymentId?.refundTxnId && (
                                                        <div className="mt-2 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-100 w-fit">
                                                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">TXN ID</span>
                                                            <span className="text-xs font-black text-slate-800">#{c.paymentId.refundTxnId}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                }                                                {/* ── REJECTED: admin note ─────────────── */}
                                                {isRejected && (
                                                    <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="w-5 h-5 bg-red-400 text-white rounded-full flex items-center justify-center text-[10px] font-black">✕</span>
                                                            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Request Rejected</p>                                                         </div>
                                                        <p className="text-sm font-medium text-red-800 leading-relaxed italic">
                                                            {c.resolution || 'Your cancellation request was rejected. Please contact support for more information.'}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* ── PENDING: waiting message ──────────── */}
                                                {isPending && (
                                                    <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-5 h-5 bg-amber-400 text-white rounded-full flex items-center justify-center text-[10px] animate-pulse">⏳</span>
                                                            <p className="text-sm font-bold text-amber-700">Your request is under review. We will notify you once a decision is made.</p>
                                                        </div>
//                                                     </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ══ SECTION 2: SUPPORT MESSAGES ══════════════════════ */}
                        <div>
                            {cancellations.length > 0 && (
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-base">💬</div>
                                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">Support Messages</h2>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black">{userMessages.length}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-5">
                                {userMessages.length === 0 && cancellations.length === 0 ? (
                                    <div className="bg-white rounded-[48px] p-24 text-center border border-slate-100 shadow-xl">
                                        <div className="text-8xl mb-8 opacity-20">📩</div>
                                        <h2 className="text-3xl font-black text-slate-900 mb-4">No requests found</h2>
                                        <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">You haven&apos;t raised any support tickets yet.</p>
                                    </div>
                                ) : userMessages.length === 0 ? (
                                    <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 text-slate-400 font-medium text-sm">
                                        No support messages yet.
                                    </div>
                                ) : (
                                    userMessages.map(msg => (
                                        <div key={msg?._id} className="bg-white rounded-[28px] p-8 shadow-sm border border-slate-100">
                                            <div className="flex justify-between items-start mb-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">🎫</div>
                                                    <div>
                                                        <h3 className="font-black text-slate-900 text-base">{msg?.subject}</h3>
                                                        <p className="text-xs font-bold text-slate-400 mt-0.5">Raised on {new Date(msg?.createdAt).toLocaleString('en-GB')}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${msg?.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {msg?.status}
                                                </span>
                                            </div>

                                            <div className="bg-slate-50 px-5 py-4 rounded-2xl">
                                                <p className="text-sm font-medium text-slate-700 leading-relaxed">{msg?.message}</p>
                                            </div>

                                            {/* Admin reply when resolved */}
                                            {msg?.status === 'RESOLVED' && (
                                                <div className="mt-4 p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                                                    <div className="flex items-center gap-2 text-emerald-700 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                                                        <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px]">✓</span>
                                                        Admin Reply
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                                        {msg?.resolution || 'This request has been successfully resolved by our support team.'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="mt-20">
                            <div className="text-center mb-16">
                                <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Support Center</h2>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Frequently Asked Questions</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { q: "How does the AI trip planning work?", a: "Our AI analyzes thousands of data points including weather, local events, and user preferences to generate a custom itinerary in seconds." },
                                    { q: "Can I modify my itinerary after it's generated?", a: "Yes! You can manually edit any part of your trip, add new stops, or ask the AI to regenerate specific days." },
                                    { q: "Is my payment information secure?", a: "Absolutely. We use industry-standard encryption and secure payment gateways to ensure your data is always protected." },
                                    { q: "Do you offer group discounts?", a: "We do! For groups of 10 or more, please contact our corporate travel team for special rates." }
                                ].map((faq, i) => (
                                    <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                        <h4 className="text-xl font-black text-slate-900 mb-4">{faq.q}</h4>
                                        <p className="text-slate-500 font-medium leading-relaxed text-sm">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                )}
            </main>

            {/* ── Clear confirm modal ───────────────────────────────────────── */}
            {showClearConfirm && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowClearConfirm(false)} />
                    <div className="relative bg-white rounded-[48px] p-12 max-w-md w-full text-center shadow-2xl border-8 border-slate-50">
                        <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <svg xmlns="http:www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-4">Clear History?</h3>
                        <p className="text-slate-500 font-medium mb-10 leading-relaxed text-sm">This will permanently delete your booking records. This action cannot be undone.</p>
                        <div className="flex flex-col gap-4">
                            <button onClick={handleClearHistory} className="w-full bg-rose-500 text-white py-4 rounded-3xl font-black hover:bg-rose-600 transition-all shadow-xl shadow-rose-100 uppercase tracking-[0.2em] text-xs">
                                Yes, Clear All
                            </button>
                            <button onClick={() => setShowClearConfirm(false)} className="w-full bg-slate-100 text-slate-600 py-4 rounded-3xl font-bold hover:bg-slate-200 transition-all uppercase tracking-[0.2em] text-xs">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Support modal ─────────────────────────────────────────────── */}
            {showSupportModal && selectedTrip && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowSupportModal(false)} />
                    <div className="relative bg-white rounded-[48px] p-12 max-w-lg w-full shadow-2xl border-8 border-indigo-50">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Need Help?</h3>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Reference ID: #{selectedTrip.refId?.slice(-6)?.toUpperCase()}</p>
                            </div>
                            <button onClick={() => setShowSupportModal(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">✕</button>
                        </div>
                        <div className="space-y-6 mb-10">
                            <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Trip Destination</p>
                                <p className="text-xl font-black text-indigo-900">{selectedTrip?.to}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">📧</div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Email</p>
                                        <p className="font-bold text-slate-700">support@tripplanner.ai</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">📞</div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">24/7 Helpline</p>
                                        <p className="font-bold text-slate-700">+91 98765 43210</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Link to="/contact" className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-center hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs">
                                Raise a Support Ticket
                            </Link>
                            <button onClick={() => setShowSupportModal(false)} className="w-full bg-slate-100 text-slate-600 py-5 rounded-3xl font-bold hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">
                                Close
                            </button>
                        </div>
                        <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Our team typically responds within 2–4 hours.</p>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default HistoryPage;

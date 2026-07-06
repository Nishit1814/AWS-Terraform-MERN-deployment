import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getAllCancellations, updateCancellation } from "../../services/cancellationService"
import { useAuth } from '../../context/AuthContext';
// import { useNotificationContext } from '../src/context/NotificationContext';

const AdminCancellations = () => {
    const { user } = useAuth();
    const [cancellations, setCancellations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [resolutionText, setResolutionText] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [adminTxnId, setAdminTxnId] = useState('');
    const [processing, setProcessing] = useState(false);
    // const { refreshNotifications } = useNotificationContext();

    useEffect(() => {
        loadCancellations();
    }, []);

    const loadCancellations = async () => {
        try {
            const data = await getAllCancellations();
            console.log("getAllCancellations : ", data)
            setCancellations(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status, paymentId, userId, txnId = null) => {
        setProcessing(true);
        try {
            console.log("id :::", id)
            const res = await updateCancellation(id, {
                status,
                resolution: resolutionText,
                paymentId,
                refundTxnId: txnId
            }, user);
            console.log("object ", res);
            // refreshNotifications();
            setSelectedRequest(null);
            setShowPaymentModal(false);
            setAdminTxnId('');
            setResolutionText('');
            loadCancellations();
            alert(`Request ${status === 'APPROVED' ? 'Settled' : 'Declined'} successfully.`);
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        } finally {
            setProcessing(false);
        }
    };

    // UPI Link generation: upi://pay?pa=VPA&pn=NAME&am=AMOUNT&cu=INR
    const upiDeepLink = selectedRequest ? `upi://pay?pa=${selectedRequest?.upiId}&pn=${encodeURIComponent(selectedRequest?.fullname)}&am=${selectedRequest?.refundAmount}&cu=INR&tn=${encodeURIComponent('Refund-TripPlanner')}` : '';
    const qrCodeUrl = selectedRequest ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiDeepLink)}` : '';
    console.log("cancellations : ", cancellations)
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

            {/* <main className="flex-grow overflow-y-hiddden "> */}
            <main className="flex-grow overflow-y-auto custom-scrollbar">
                <div className="m-2">
                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
                        </div>
                    ) : cancellations.length === 0 ? (
                        <div className="bg-white p-20 rounded-[48px] text-center border-4 border-dashed border-slate-100 italic font-bold text-slate-300 uppercase tracking-widest">
                            No active cancellation requests
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {cancellations.map(req => (

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={req._id}
                                    className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group"
                                >
                                    <div className="flex flex-wrap justify-between items-start gap-6">
                                        <div className="flex gap-6">
                                            <div className="w-20 h-20 bg-rose-50 rounded-[28px] flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                                                💸
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{req?.fullname}</h3>
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${req?.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                                                        req?.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                                                        }`}>
                                                        {req?.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>📍 {req?.tripTo}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                    <span>📅 {new Date(req?.createdAt)?.toLocaleDateString()}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                    <span>
                                                        💰 Refund: ₹{req?.refundAmount ? req.refundAmount.toLocaleString() : "0"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setSelectedRequest(req)}
                                                className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100"
                                            >
                                                Review Audit
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            {console.log("selectedRequest :", selectedRequest)}
            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[56px] overflow-hidden flex flex-col shadow-2xl relative border-8 border-indigo-50"
                        >
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="absolute top-10 right-10 w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all font-black text-xs"
                            >
                                ✕
                            </button>

                            <div className="p-12 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Audit Verification</h3>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Analyzing Cancellation Evidence for {selectedRequest?.fullname}</p>
                                </div>
                                <div className="bg-indigo-50 px-8 py-4 rounded-3xl text-right">
                                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Approved Refund</p>
                                    <p className="text-2xl font-black text-indigo-900 tracking-tight">₹{selectedRequest?.refundAmount?.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex-grow overflow-y-auto p-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div className="bg-slate-50 p-8 rounded-[40px] space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Identity Proof</p>
                                                    <p className="text-sm font-black text-slate-900">{selectedRequest?.fullname}</p>
                                                    <p className="text-[10px] font-bold text-slate-500">{selectedRequest?.email}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 underline">{selectedRequest?.phone}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Transit Context</p>
                                                    <p className="text-sm font-black text-slate-900">{selectedRequest?.tripTo}</p>
                                                    <p className="text-[10px] font-bold text-indigo-600 underline">#{selectedRequest?.transactionId}</p>
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-slate-200">
                                                <div className="flex justify-between items-center mb-3">
                                                    <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Refund Destination (UPI)</p>
                                                    <div className="flex gap-2">
                                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" title="Auto-SMS Ready"></span>
                                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-75" title="Auto-Email Ready"></span>
                                                    </div>
                                                </div>
                                                <div className="bg-indigo-600 text-white p-4 rounded-2xl flex justify-between items-center shadow-lg">
                                                    <span className="font-mono text-sm font-black">{selectedRequest?.upiId}</span>
                                                    <span className="text-xs">💳</span>
                                                </div>
                                                <p className="text-[8px] font-bold text-slate-400 mt-3 italic">
                                                    * System will automatically dispatch SMS to {selectedRequest?.phone} and Email to {selectedRequest?.email} upon settlement.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="px-4">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Client Statement (Reason)</p>
                                            <div className="bg-white p-6 rounded-3xl border border-slate-100 italic transition-colors hover:border-indigo-100">
                                                <p className="text-slate-600 text-sm leading-relaxed font-medium">&ldquo;{selectedRequest?.reason}&rdquo;</p>
                                            </div>
                                        </div>

                                        {selectedRequest.status === 'PENDING' && (
                                            <div className="space-y-4">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Resolution Response</p>
                                                <input
                                                    type='text'
                                                    value={resolutionText}
                                                    onChange={(e) => setResolutionText(e.target.value)}
                                                    placeholder="Internal notes or reason for rejection..."
                                                    className="bg-whitev text-left text-black border border-slate-200 py-1 px-30 rounded-xl focus:border-indigo-500 min-h-[50px] text-sm font-bold"
                                                />
                                                <div className="flex gap-4">
                                                    <button
                                                        disabled={processing}
                                                        onClick={() => setShowPaymentModal(true)}
                                                        className="flex-1 bg-emerald-500 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-50 disabled:opacity-50"
                                                    >
                                                        Approve & Settle Refund
                                                    </button>
                                                    {/* {selectedRequest.id} */}
                                                    <button
                                                        disabled={processing}
                                                        onClick={() => handleStatusUpdate(selectedRequest?.id, 'REJECTED', selectedRequest?.paymentId, selectedRequest?.userId)}
                                                        className="flex-1 bg-rose-500 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-50 disabled:opacity-50"
                                                    >
                                                        Decline Audit
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Evidence Capture (Invoice)</p>
                                        <div className=" border-1 border-white  rounded-[44px] overflow-hidden custom-scrollbar aspect-[3/4] group cursor-zoom-in">
                                            <iframe
                                                src={selectedRequest?.invoicePhoto}
                                                className="w-full h-full rounded-[44px] pdfview"
                                                alt="Invoice Evidence"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showPaymentModal && selectedRequest && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-white h-150 w-100 rounded-[48px] overflow-hidden shadow-2xl border-4 border-emerald-50"
                        >
                            <div className="pt-2 text-center border-b border-slate-50">
                                <div className="w-10 h-10 text-center bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                                    🏦
                                </div>
                                <h3 className="text-sm text-center font-black text-slate-900 tracking-tight">UPI Settlement</h3>
                                <p className="text-slate-400 text-center text-[10px] font-black uppercase tracking-widest mt-1">Execute digital refund transfer</p>
                            </div>

                            <div>
                                <div className="m-2 bg-slate-100 p-2 rounded-3xl flex flex-col items-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Scan using any UPI App</p>
                                    <div className="bg-white p-4 rounded-3xl shadow-lg mb-6 border-2 border-slate-100">
                                        <img src={qrCodeUrl} alt="UPI QR" className="w-33 h-33" />
                                    </div>
                                    <div className=" text-center">
                                    </div>
                                    <p className="text-xs text-center font-black text-slate-900">{selectedRequest?.upiId}</p>
                                    <p className="text-[10px] text-center font-bold text-slate-400">AMOUNT: ₹{selectedRequest?.refundAmount?.toLocaleString()}</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Reference / Transaction ID</label>
                                        <input
                                            type="text"
                                            value={adminTxnId}
                                            onChange={(e) => setAdminTxnId(e.target.value)}
                                            placeholder="UTR or Ref Number (Required)"
                                            className="w-90 mx-3 bg-slate-50 border-2 border-slate-100 p-3 rounded-2xl outline-none focus:border-emerald-500 text-sm font-bold uppercase"
                                        />
                                    </div>

                                    <div className=" mx-4 flex gap-6 pt-4">
                                        <button
                                            disabled={!adminTxnId || processing}
                                            onClick={() => handleStatusUpdate(selectedRequest?.id, 'APPROVED', selectedRequest?.paymentId, selectedRequest?.userId, adminTxnId)}
                                            className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-50 disabled:opacity-90"
                                        >
                                            {processing ? 'Processing...' : 'Confirm Payment'}
                                        </button>
                                        <button
                                            onClick={() => setShowPaymentModal(false)}
                                            className="px-10 py-5 bg-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-300 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCancellations;

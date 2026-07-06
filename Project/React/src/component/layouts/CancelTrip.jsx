
// import { useState } from 'react';
// import { createCancellation } from '../../services/cancellationService';
// import { useAuth } from '../../context/AuthContext';

// const CancellationManager = ({ trip, payment, onSuccess }) => {
//     // console.log("payment : ",payment)
//     const { user } = useAuth();
//     const [showCancelModal, setShowCancelModal] = useState(false);
//     const [cancelStep, setCancelStep] = useState(1); // 1: Policy, 2: Form
//     const [cancelTarget, setCancelTarget] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [cancelForm, setCancelForm] = useState({
//         fullname: '',
//         email: '',
//         phone: '',
//         upiId: '',
//         reason: '',
//         invoicePhoto: null
//     });

//     const handleCancelTrip = () => {
//         const tripDate = new Date(trip.startDate);
//         const now = new Date();
//         const diffMs = tripDate - now;
//         const diffDays = Math.max(0, diffMs / (1000 * 60 * 60 * 24));

//         let refundPercent;
//         let cancellationFee;

//         if (diffDays > 10) {
//             refundPercent = 90;
//             cancellationFee = 10;
//         } else if (diffDays > 5) {
//             refundPercent = 80;
//             cancellationFee = 20;
//         } else if (diffDays > 2) {
//             refundPercent = 60;
//             cancellationFee = 40;
//         } else if (diffDays > 1) {
//             refundPercent = 40;
//             cancellationFee = 60;
//         } else if (diffDays > 0) {
//             refundPercent = 10;
//             cancellationFee = 90;
//         } else {
//             refundPercent = 0;
//             cancellationFee = 100;
//         }

//         const totalAmount = trip.price * (payment?.numPersons || 1);

//         const refundAmount = (totalAmount * refundPercent) / 100;
//         const feeAmount = (totalAmount * cancellationFee) / 100;

//         setCancelTarget({
//             payment,
//             trip,
//             refundPercent,
//             refundAmount,
//             feeAmount,
//             diffDays: Math.floor(diffDays)
//         });
//         setCancelForm({
//             fullname: user.fullname || '',
//             email: user.email || '',
//             phone: user.mobile || '',
//             upiId: '',
//             reason: '',
//             invoicePhoto: null
//         });
//         setCancelStep(1);
//         setShowCancelModal(true);
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setCancelForm(prev => ({ ...prev, invoicePhoto: reader.result }));
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const confirmCancellation = async () => {
//         if (!cancelTarget) return;
//         if (!cancelForm.upiId || !cancelForm.reason || !cancelForm.invoicePhoto) {
//             alert("Please fill all fields including the invoice photo.");
//             return;
//         }

//         setLoading(true);
//         const { payment, trip, refundAmount } = cancelTarget;

//         try {
//             const response = await createCancellation({
//                 tripId: trip?._id,
//                 paymentId: payment?._id,
//                 transactionId: payment?.transactionId,
//                 fullname: cancelForm?.fullname,
//                 email: cancelForm?.email,
//                 phone: cancelForm?.phone,
//                 upiId: cancelForm?.upiId,
//                 reason: cancelForm?.reason,
//                 invoicePhoto: cancelForm?.invoicePhoto,
//                 refundAmount,
//                 refundPercent: cancelTarget?.refundPercent,
//                 diffDays: cancelTarget?.diffDays
//             });

//             if (!response.success) {
//                 alert(response.message);
//                 return;
//             }
//             alert("Cancellation request submitted successfully. Our team will verify your details and process the refund.");
//             setShowCancelModal(false);
//             if (onSuccess) onSuccess();
//         } catch (err) {
//             console.error(err);
//             alert("Failed to submit request.");
//         } finally {
//             setLoading(false);
//         }
//     };
//     console.log({
//         tripId: trip?._id,
//         paymentId: payment?._id,
//         upiId: cancelForm?.upiId,
//         reason: cancelForm?.reason
//     });
//     return (
//         <>
//             <button
//                 onClick={handleCancelTrip}
//                 className="px-8 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl font-bold hover:bg-rose-100 transition-all uppercase tracking-widest text-[10px]"
//             >
//                 Cancel Trip
//             </button>

//             {showCancelModal && cancelTarget && (
//                 <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
//                     <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-lg" onClick={() => setShowCancelModal(false)} />
//                     <div className="relative bg-white rounded-[56px] p-12 max-w-2xl w-full shadow-2xl border-8 border-rose-50 overflow-hidden overflow-y-auto max-h-[90vh] custom-scrollbar">
//                         <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full translate-x-1/2 -translate-y-1/2 -z-1 opacity-50" />

//                         <div className="relative">
//                             <div className="flex justify-between items-start mb-10">
//                                 <div>
//                                     <h3 className="text-4xl font-black text-slate-900 tracking-tight">
//                                         {cancelStep === 1 ? 'Refund Policy' : 'Cancellation Form'}
//                                     </h3>
//                                     <p className="text-rose-500 font-black uppercase text-[10px] tracking-[0.2em] mt-2">
//                                         {cancelStep === 1 ? 'Notice-Based Calculation' : 'Submit Refund Details'}
//                                     </p>
//                                 </div>
//                                 <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center text-2xl">
//                                     {cancelStep === 1 ? '⚠️' : '📝'}
//                                 </div>
//                             </div>

//                             {cancelStep === 1 ? (
//                                 <>
//                                     <div className="space-y-6 mb-12">
//                                         <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
//                                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trip to {cancelTarget?.trip?.to}</p>
//                                             <div className="flex justify-between items-end">
//                                                 <div>
//                                                     <p className="text-xs font-bold text-slate-500">Departure Date</p>
//                                                     <p className="text-lg font-black text-slate-900">{new Date(cancelTarget?.trip?.startDate).toLocaleDateString()}</p>
//                                                 </div>
//                                                 <div className="text-right">
//                                                     <p className="text-xs font-bold text-slate-500 underline decoration-rose-200 underline-offset-4">Notice Period</p>
//                                                     <p className="text-lg font-black text-rose-600">{cancelTarget?.diffDays} Days Remaining</p>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="grid grid-cols-2 gap-4">
//                                             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
//                                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
//                                                 <p className="text-2xl font-black text-slate-900">₹{(cancelTarget?.trip?.price * (cancelTarget?.payment?.numPersons || 1)).toLocaleString()}</p>
//                                             </div>
//                                             <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
//                                                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Refund ({cancelTarget?.refundPercent}%)</p>
//                                                 <p className="text-2xl font-black text-emerald-700">₹{cancelTarget?.refundAmount?.toLocaleString()}</p>
//                                             </div>
//                                         </div>

//                                         <div className="p-6 bg-rose-50/50 rounded-3xl border border-rose-100">
//                                             <div className="flex justify-between items-center mb-2">
//                                                 <p className="text-xs font-bold text-rose-700">Cancellation Fee (Admin Charge)</p>
//                                                 <p className="text-lg font-black text-rose-800">₹{cancelTarget?.feeAmount?.toLocaleString()}</p>
//                                             </div>
//                                             <p className="text-[10px] font-medium text-rose-500 leading-relaxed">
//                                                 *This amount is deducted to cover pre-booked stay, food arrangements, and transit reservations that cannot be fully recouped.
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <div className="flex flex-col gap-4">
//                                         <button
//                                             onClick={() => setCancelStep(2)}
//                                             className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-2xl shadow-slate-200"
//                                         >
//                                             Proceed to Form &rarr;
//                                         </button>
//                                         <button
//                                             onClick={() => setShowCancelModal(false)}
//                                             className="w-full bg-slate-100 text-slate-500 py-6 rounded-3xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
//                                         >
//                                             Keep My Adventure
//                                         </button>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <div className="space-y-8 animate-in slide-in-from-right duration-500">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div className="space-y-2">
//                                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
//                                             <input
//                                                 type="text"
//                                                 value={cancelForm.fullname}
//                                                 onChange={(e) => setCancelForm(prev => ({ ...prev, fullname: e.target.value }))}
//                                                 className="w-full bg-slate-50 text-slate-700 border border-slate-100 p-5 rounded-2xl font-bold text-sm outline-none focus:border-indigo-500 transition-all"
//                                                 placeholder="Legal Name"
//                                             />
//                                         </div>
//                                         <div className="space-y-2">
//                                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">UPI ID (For Refund)</label>
//                                             <input
//                                                 type="text"
//                                                 value={cancelForm.upiId}
//                                                 onChange={(e) => setCancelForm(prev => ({ ...prev, upiId: e.target.value }))}
//                                                 className="w-full bg-rose-50 border text-slate-700 border-rose-100 p-5 rounded-2xl font-bold text-sm outline-none focus:border-rose-500 transition-all text-rose-900"
//                                                 placeholder="example@upi"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div className="space-y-2">
//                                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
//                                             <input
//                                                 type="email"
//                                                 value={cancelForm.email}
//                                                 onChange={(e) => setCancelForm(prev => ({ ...prev, email: e.target.value }))}
//                                                 className="w-full bg-slate-50 border text-slate-700 border-slate-100 p-5 rounded-2xl font-bold text-sm outline-none focus:border-indigo-500 transition-all"
//                                             />
//                                         </div>
//                                         <div className="space-y-2">
//                                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
//                                             <input
//                                                 type="text"
//                                                 value={cancelForm.phone}
//                                                 onChange={(e) => setCancelForm(prev => ({ ...prev, phone: e.target.value }))}
//                                                 className="w-full bg-slate-50 border text-slate-700 border-slate-100 p-5 rounded-2xl font-bold text-sm outline-none focus:border-indigo-500 transition-all"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Reason for Cancellation</label>
//                                         <textarea
//                                             value={cancelForm.reason}
//                                             onChange={(e) => setCancelForm(prev => ({ ...prev, reason: e.target.value }))}
//                                             className="w-full bg-slate-50 border text-slate-700 border-slate-100 p-5 rounded-2xl font-bold text-sm outline-none focus:border-indigo-500 transition-all min-h-[120px]"
//                                             placeholder="Please describe why you are cancelling..."
//                                         />
//                                     </div>

//                                     <div className="space-y-4">
//                                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Upload Invoice Photo (Verification Required)</label>
//                                         <div className="relative h-40 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 flex flex-col items-center justify-center group overflow-hidden">
//                                             {cancelForm.invoicePhoto ? (
//                                                 <div className="absolute inset-0 group">
//                                                     <img src={cancelForm.invoicePhoto} className="w-full h-full object-cover opacity-60" alt="Preview" />
//                                                     <div className="absolute inset-0 flex text-slate-700 items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all">
//                                                         <p className="text-white font-black text-xs uppercase tracking-widest">Change Photo</p>
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <>
//                                                     <span className="text-3xl mb-2 opacity-40">📸</span>
//                                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drag & Drop or Click</p>
//                                                 </>
//                                             )}
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 onChange={handleFileChange}
//                                                 className="absolute inset-0 opacity-0 cursor-pointer"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="flex gap-4">
//                                         <button
//                                             onClick={() => setCancelStep(1)}
//                                             className="flex-1 bg-slate-100 text-slate-500 py-6 rounded-3xl font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
//                                         >
//                                             Back
//                                         </button>
//                                         <button
//                                             disabled={loading}
//                                             onClick={confirmCancellation}
//                                             className="flex-[2] bg-indigo-600 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
//                                         >
//                                             {loading ? 'Submitting...' : 'Submit Request'}
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}

//                             <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-3">
//                                 <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs">🛡️</div>
//                                 <p className="text-[9px] font-bold text-slate-400 leading-tight uppercase tracking-tight">
//                                     Ref: {cancelTarget?.payment?.transactionId} • Secure Encryption Active • Data Managed by InEx Audit
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default CancellationManager;






import { useEffect, useState } from 'react';
import { createCancellation, getUserCancellations } from '../../services/cancellationService';
import { useAuth } from '../../context/AuthContext';
// import useTrips from '../../hooks/useTrips';

const CancellationManager = ({ trip, payment, onSuccess }) => {
    console.log("CancellationManager payment  : ", payment)
    console.log("CancellationManager trip  : ", trip)
    // const [trip, setTrip] = useState()
    // const fetchCancelTrip = async () => {
    //     try {
    //         const allTrips = await getUserCancellations();
    //         console.log("allTrips : ",allTrips);
    //         setTrip(allTrips);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    // useEffect(() => {
    //     fetchCancelTrip()
    // }, [])

    //     const getUserCancellations = () => {
    // try
    //     }
    // const { } = useTrips
    const { user } = useAuth();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelStep, setCancelStep] = useState(1); // 1: Policy, 2: Form
    const [cancelTarget, setCancelTarget] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cancelForm, setCancelForm] = useState({
        fullname: '',
        email: '',
        phone: '',
        upiId: '',
        reason: '',
        invoicePhoto: null
    });

    const handleCancelTrip = () => {
        const tripDate = new Date(trip?.startDate);
        console.log("trip startDate : ", tripDate)
        const now = new Date();
        const diffMs = tripDate - now;
        const diffDays = Math.max(0, diffMs / (1000 * 60 * 60 * 24));

        let refundPercent;
        let cancellationFee;

        if (diffDays > 10) {
            refundPercent = 90;
            cancellationFee = 10;
        } else if (diffDays > 5) {
            refundPercent = 80;
            cancellationFee = 20;
        } else if (diffDays > 2) {
            refundPercent = 60;
            cancellationFee = 40;
        } else if (diffDays > 1) {
            refundPercent = 40;
            cancellationFee = 60;
        } else if (diffDays > 0) {
            refundPercent = 10;
            cancellationFee = 90;
        } else {
            refundPercent = 0;
            cancellationFee = 100;
        }

        const totalAmount = trip.price * (payment?.numPersons || 1);

        const refundAmount = (totalAmount * refundPercent) / 100;
        const feeAmount = (totalAmount * cancellationFee) / 100;

        setCancelTarget({
            payment,
            trip,
            refundPercent,
            refundAmount,
            feeAmount,
            diffDays: Math.floor(diffDays)
        });
        setCancelForm({
            fullname: user.fullname || '',
            email: user.email || '',
            phone: user.mobile || '',
            upiId: '',
            reason: '',
            invoicePhoto: null
        });
        setCancelStep(1);
        setShowCancelModal(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCancelForm(prev => ({ ...prev, invoicePhoto: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };
    console.log("cancelTarget : ", cancelTarget)
    const confirmCancellation = async () => {
        if (!cancelTarget) return;
        console.log("confirmCancellation : ", confirmCancellation)

        // Guard: payment must exist — if undefined the trip card wasn't matched to a payment record
        if (!cancelTarget.payment?._id) {
            alert("Payment details could not be found for this trip. Please refresh the page and try again.");
            return;
        }

        if (!cancelForm.upiId || !cancelForm.reason || !cancelForm.invoicePhoto) {
            alert("Please fill all fields including the invoice photo.");
            return;
        }

        setLoading(true);
        const { payment, trip, refundAmount } = cancelTarget;

        try {
            const response = await createCancellation({
                tripId: trip?._id,
                paymentId: payment?._id,
                transactionId: payment?.transactionId,
                fullname: cancelForm?.fullname,
                email: cancelForm?.email,
                phone: cancelForm?.phone,
                upiId: cancelForm?.upiId,
                reason: cancelForm?.reason,
                invoicePhoto: cancelForm?.invoicePhoto,
                refundAmount,
                refundPercent: cancelTarget?.refundPercent,
                diffDays: cancelTarget?.diffDays
            });

            if (!response.success) {
                alert(response.message);
                return;
            }
            alert("Cancellation request submitted successfully. Our team will verify your details and process the refund.");
            setShowCancelModal(false);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            alert("Failed to submit request.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <button
                onClick={handleCancelTrip}
                className="px-8 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl font-bold hover:bg-rose-100 transition-all uppercase tracking-widest text-[10px]"
            >
                Cancel Trip
            </button>

            {showCancelModal && cancelTarget && (
                <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-lg" onClick={() => setShowCancelModal(false)} />
                    <div className="relative bg-white rounded-[56px] p-12 max-w-2xl w-full shadow-2xl border-8 border-rose-50 overflow-hidden overflow-y-auto max-h-[90vh] custom-scrollbar">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full translate-x-1/2 -translate-y-1/2 -z-1 opacity-50" />
                        {/* {console.log("cancelTarget inside cancelltion", cancelTarget)} */}
                        <div className="relative">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                                        {cancelStep === 1 ? 'Refund Policy' : 'Cancellation Form'}
                                    </h3>
                                    <p className="text-rose-500 font-black uppercase text-[10px] tracking-[0.2em] mt-2">
                                        {cancelStep === 1 ? 'Notice-Based Calculation' : 'Submit Refund Details'}
                                    </p>
                                </div>
                                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center text-2xl">
                                    {cancelStep === 1 ? '⚠️' : '📝'}
                                </div>
                            </div>

                            {cancelStep === 1 ? (
                                <>
                                    <div className="space-y-6 mb-12">
                                        <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trip to {cancelTarget?.trip?.to}</p>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500">Departure Date</p>
                                                    <p className="text-lg font-black text-slate-900">{new Date(cancelTarget?.trip?.startDate).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-500 underline decoration-rose-200 underline-offset-4">Notice Period</p>
                                                    <p className="text-lg font-black text-rose-600">{cancelTarget?.diffDays} Days Remaining</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                                                <p className="text-2xl font-black text-slate-900">₹{(cancelTarget?.trip?.price * (cancelTarget?.payment?.numPersons || 1)).toLocaleString()}</p>
                                            </div>
                                            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Refund ({cancelTarget?.refundPercent}%)</p>
                                                <p className="text-2xl font-black text-emerald-700">₹{cancelTarget?.refundAmount?.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-rose-50/50 rounded-3xl border border-rose-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-xs font-bold text-rose-700">Cancellation Fee (Admin Charge)</p>
                                                <p className="text-lg font-black text-rose-800">₹{cancelTarget?.feeAmount?.toLocaleString()}</p>
                                            </div>
                                            <p className="text-[10px] font-medium text-rose-500 leading-relaxed">
                                                *This amount is deducted to cover pre-booked stay, food arrangements, and transit reservations that cannot be fully recouped.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <button
                                            onClick={() => setCancelStep(2)}
                                            className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-2xl shadow-slate-200"
                                        >
                                            Proceed to Form &rarr;
                                        </button>
                                        <button
                                            onClick={() => setShowCancelModal(false)}
                                            className="w-full bg-slate-100 text-slate-500 py-6 rounded-3xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
                                        >
                                            Keep My Adventure
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                                            <input
                                                type="text"
                                                value={cancelForm.fullname}
                                                onChange={(e) => setCancelForm(prev => ({ ...prev, fullname: e.target.value }))}
                                                className="w-full bg-slate-50 text-slate-700 border border-slate-100 p-5 rounded-2xl font-bold text-sm outline-none focus:border-indigo-500 transition-all"
                                                placeholder="Legal Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">UPI ID (For Refund)</label>
                                            <input
                                                type="text"
                                                value={cancelForm.upiId}
                                                onChange={(e) => setCancelForm(prev => ({ ...prev, upiId: e.target.value }))}
                                                className="w-full bg-rose-50 border text-slate-700 border-rose-100 p-5 rounded-2xl font-bold text-sm outline-none focus:border-rose-500 transition-all text-rose-900"
                                                placeholder="example@upi"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                                            <input
                                                type="email"
                                                value={cancelForm.email}
                                                onChange={(e) => setCancelForm(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full bg-slate-50 border text-slate-700 border-slate-100 p-5 rounded-2xl font-bold text-sm outline-none focus:border-indigo-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
                                            <input
                                                type="text"
                                                value={cancelForm.phone}
                                                onChange={(e) => setCancelForm(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full bg-slate-50 border text-slate-700 border-slate-100 p-5 rounded-2xl font-bold text-sm outline-none focus:border-indigo-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Reason for Cancellation</label>
                                        <textarea
                                            value={cancelForm.reason}
                                            onChange={(e) => setCancelForm(prev => ({ ...prev, reason: e.target.value }))}
                                            className="w-full bg-slate-50 border text-slate-700 border-slate-100 p-5 rounded-2xl font-bold text-sm outline-none focus:border-indigo-500 transition-all min-h-[120px]"
                                            placeholder="Please describe why you are cancelling..."
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Upload Invoice Photo (Verification Required)</label>
                                        <div className="relative h-40 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 flex flex-col items-center justify-center group overflow-hidden">
                                            {cancelForm.invoicePhoto ? (
                                                <div className="absolute inset-0 group">
                                                    <iframe src={cancelForm.invoicePhoto} className="w-full h-full object-cover opacity-60" alt="Preview" />
                                                    <div className="absolute inset-0 flex text-slate-700 items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all">
                                                        <p className="text-white font-black text-xs uppercase tracking-widest">Change Photo</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-3xl mb-2 opacity-40">📸</span>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drag & Drop or Click</p>
                                                </>
                                            )}
                                            <input
                                                type='file'
                                                accept="application/pdf ,image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setCancelStep(1)}
                                            className="flex-1 bg-slate-100 text-slate-500 py-6 rounded-3xl font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            disabled={loading}
                                            onClick={confirmCancellation}
                                            className="flex-[2] bg-indigo-600 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                                        >
                                            {loading ? 'Submitting...' : 'Submit Request'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs">🛡️</div>
                                <p className="text-[9px] font-bold text-slate-400 leading-tight uppercase tracking-tight">
                                    Ref: {cancelTarget?.payment?.transactionId} • Secure Encryption Active • Data Managed by InEx Audit
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CancellationManager;

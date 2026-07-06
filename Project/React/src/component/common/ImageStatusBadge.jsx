import { Link } from "react-router-dom";
import { InvoiceButton } from "../layouts/InvoiceButton";
import CancellationManager from "../layouts/CancelTrip";

// ─── Status badge shown over the trip image ───────────────────────────────────
export const ImageStatusBadge = ({ status }) => {
    if (!status) return null;

    const map = {
        PENDING: { label: 'PENDING', bg: 'bg-amber-500', text: 'text-white' },
        APPROVED: { label: 'CANCELLED', bg: 'bg-rose-500', text: 'text-white cntent-middle' },
        REJECTED: { label: 'REJECTED', bg: 'bg-slate-700', text: 'text-white' },
    };
    const cfg = map[status];
    if (!cfg) return null;

    return (
        <div className={`absolute bottom-35 left-1/2 -translate-x-1/2 ${cfg.bg} ${cfg.text} px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg z-10`}>
            {cfg.label}
        </div>
    );
};


export const imageTint = (status) => {
    if (status === 'APPROVED') return 'bg-rose-100/70 backdrop-grayscale';
    if (status === 'PENDING') return 'bg-amber-100/50';
    return '';
};

// ─── Price label (top-right) ──────────────────────────────────────────────────
export const PriceLabel = ({ status, price, type }) => {
    if (status === 'APPROVED') {
        return (
            <div className="text-right">
                <p className="text-2xl font-black text-slate-900 leading-none">₹{price?.toLocaleString()}</p>
                <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-emerald-500">Refund Processed</p>
            </div>
        );
    }
    if (status === 'PENDING') {
        return (
            <div className="text-right">
                <p className="text-2xl font-black text-slate-900 leading-none">₹{price?.toLocaleString()}</p>
                <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-amber-500">Cancel Pending</p>
            </div>
        );
    }
    return (
        <div className="text-right">
            <p className="text-2xl font-black text-slate-900 leading-none">₹{price?.toLocaleString()}</p>
            <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${type === 'JOINED' ? 'text-emerald-500' : 'text-slate-400'}`}>
                {type === 'JOINED' ? 'Paid & Booked' : 'Saved Plan'}
            </p>
        </div>
    );
};

// ─── Bottom action buttons ────────────────────────────────────────────────────
export const ActionButtons = ({ status, cancellation, trip, payment, item, onSupport, onLoadData }) => {
    console.log("trip : ", trip)
    console.log("payment : ", payment)
    // ── APPROVED: Refund completed row ────────────────────────────────────────
    if (status === 'APPROVED') {
        return (
            <div className="flex gap-4 mt-8 flex-wrap">
                <Link
                    to={`/trip/${trip?._id}?review=true&booked=true`}
                    className="flex-1 text-center bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest text-xs min-w-[140px]"
                >
                    View Full Details
                </Link>

                {/* Refund completed badge — styled like the screenshot green button */}
                <div className="flex flex-col items-center justify-center px-6 py-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50 min-w-[160px]">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Refund Completed</span>
                    {cancellation?.paymentId?.refundTxnId && (
                        <span className="text-[9px] font-bold text-emerald-500 mt-0.5">
                            TXN: #{cancellation.paymentId.refundTxnId}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    // ── PENDING: Request submitted row ────────────────────────────────────────
    if (status === 'PENDING') {
        return (
            <div className="flex gap-4 mt-8 flex-wrap">
                <Link
                    to={`/trip/${trip?._id}?review=true&booked=true`}
                    className="flex-1 text-center bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest text-xs min-w-[140px]"
                >
                    View Full Details
                </Link>

                {/* Requested successfully chip */}
                <div className="flex flex-col items-center justify-center px-6 py-3 rounded-2xl border-2 border-amber-200 bg-amber-50 min-w-[160px]">
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Requested Successfully</span>
                    <span className="text-[9px] font-bold text-amber-500 mt-0.5">Awaiting admin review</span>
                </div>

                <button
                    onClick={() => onSupport({ ...trip, refId: item._id })}
                    className="px-8 bg-slate-900 text-slate-100 border border-slate-100 rounded-2xl font-bold hover:bg-slate-950 hover:shadow-lg transition-all uppercase tracking-widest text-[10px]"
                >
                    Support
                </button>
            </div>
        );
    }

    // ── REJECTED: Show rejected badge + allow re-cancel ───────────────────────
    if (status === 'REJECTED') {
        return (
            <div className="flex gap-4 mt-8 flex-wrap">
                <Link
                    to={`/trip/${trip?._id}?review=true&booked=true`}
                    className="flex-1 text-center bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest text-xs min-w-[140px]"
                >
                    View Full Details
                </Link>

                <InvoiceButton
                    trip={trip}
                    persons={payment?.numPersons || 1}
                    txnId={payment?.transactionId || item._id}
                    passengers={payment?.passengers || []}
                    contact={{
                        email: payment?.contactEmail,
                        mobile: payment?.contactMobile,
                        emergencyName: payment?.emergencyContactName,
                        emergencyPhone: payment?.emergencyContactPhone
                    }}
                />

                <div className="flex flex-col items-center justify-center px-6 py-3 rounded-2xl border-2 border-slate-200 bg-slate-50 min-w-[140px]">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Request Rejected</span>
                    <span className="text-[9px] font-bold text-slate-400 mt-0.5">Contact support</span>
                </div>

                <button
                    onClick={() => onSupport({ ...trip, refId: item._id })}
                    className="px-8 bg-slate-900 text-slate-100 border border-slate-100 rounded-2xl font-bold hover:bg-slate-950 hover:shadow-lg transition-all uppercase tracking-widest text-[10px]"
                >
                    Support
                </button>
            </div>
        );
    }

    // ── DEFAULT: Normal active trip ───────────────────────────────────────────
    return (
        <div className="flex gap-4 mt-8 flex-wrap">
            <Link
                to={`/trip/${trip?._id}?review=true&booked=true`}
                className="flex-1 text-center bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest text-xs min-w-[140px]"
            >
                View Full Details
            </Link>

            <InvoiceButton
                trip={trip}
                persons={payment?.numPersons || 1}
                txnId={payment?.transactionId || item._id}
                passengers={payment?.passengers || []}
                contact={{
                    email: payment?.contactEmail,
                    mobile: payment?.contactMobile,
                    emergencyName: payment?.emergencyContactName,
                    emergencyPhone: payment?.emergencyContactPhone
                }}
            />
            {console.log("payment image :",payment)}
            <CancellationManager
                trip={trip}
                payment={payment}
                onSuccess={onLoadData}
            />

            <button
                onClick={() => onSupport({ ...trip, refId: item._id })}
                className="px-8 bg-slate-900 text-slate-100 border border-slate-100 rounded-2xl font-bold hover:bg-slate-950 hover:shadow-lg transition-all uppercase tracking-widest text-[10px]"
            >
                Support
            </button>
        </div>
    );
};

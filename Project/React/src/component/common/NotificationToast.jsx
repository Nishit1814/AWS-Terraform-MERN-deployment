import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";

const typeIcon = {
    NEW_TRIP:        "✈️",
    TRIP_CANCEL:     "🚨",
    CANCEL_STATUS:   "📋",
    SUPPORT_MESSAGE: "💬",
};

const typeBg = {
    NEW_TRIP:        "from-indigo-500 to-purple-600",
    TRIP_CANCEL:     "from-red-500 to-rose-600",
    CANCEL_STATUS:   "from-amber-500 to-orange-500",
    SUPPORT_MESSAGE: "from-blue-500 to-cyan-500",
};

export default function NotificationToast() {
    const { liveNotif, clearLiveNotif } = useSocket() || {};
    const [visible, setVisible]         = useState(false);
    const [current, setCurrent]         = useState(null);
    const navigate                       = useNavigate();

    useEffect(() => {
        if (!liveNotif) return;

        setCurrent(liveNotif);
        setVisible(true);

        // Auto-dismiss after 5 s
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => { setCurrent(null); clearLiveNotif?.(); }, 400);
        }, 5000);

        return () => clearTimeout(timer);
    }, [liveNotif?._toastId]);    // re-run when a NEW notification arrives

    const handleClick = () => {
        setVisible(false);
        setTimeout(() => {
            setCurrent(null);
            clearLiveNotif?.();
            if (current?.link) navigate(current.link);
        }, 300);
    };

    const handleDismiss = (e) => {
        e.stopPropagation();
        setVisible(false);
        setTimeout(() => { setCurrent(null); clearLiveNotif?.(); }, 300);
    };

    if (!current) return null;

    const bg = typeBg[current.type] || "from-indigo-500 to-purple-600";

    return (
        <div
            className={`
                fixed top-5 right-5 z-[9999] w-80 cursor-pointer
                transition-all duration-400 ease-out
                ${visible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-4 scale-95 pointer-events-none"}
            `}
            onClick={handleClick}
        >
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                {/* Coloured top strip */}
                <div className={`h-1 bg-gradient-to-r ${bg}`} />

                <div className="flex items-start gap-3 px-4 py-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center text-xl flex-shrink-0 shadow-md`}>
                        {typeIcon[current.type] || "🔔"}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm font-black text-slate-800 leading-tight truncate">
                            {current.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {current.message}
                        </p>
                        <p className="text-[10px] text-indigo-500 font-semibold mt-1">
                            Tap to view →
                        </p>
                    </div>

                    {/* Dismiss × */}
                    <button
                        onClick={handleDismiss}
                        className="text-slate-400 hover:text-slate-600 text-lg leading-none flex-shrink-0 mt-0.5 transition-colors"
                        title="Dismiss"
                    >
                        ×
                    </button>
                </div>

                {/* Progress bar */}
                <div className="px-4 pb-3">
                    <div className="h-0.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${bg} rounded-full`}
                            style={{
                                animation: "shrink 5s linear forwards",
                            }}
                        />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to   { width: 0%;   }
                }
            `}</style>
        </div>
    );
}

import NotificationBell from "../common/NotificationBell";

export default function AdminHeader({
    title,
    subtitle,
    user,
    onProfileClick,
    rightContent
}) {
    return (
        <header className="bg-gradient-to-r from-white via-slate-50 to-white border-b border-slate-200 shadow-sm px-4 py-4 flex justify-between items-center sticky top-0 z-40">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-6">

                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">

                {/* Extra buttons (optional) */}
                {rightContent}

                {/* Notification Bell — light theme for white header */}
                <NotificationBell theme="light" />


                {/* Profile */}
                <button
                    onClick={onProfileClick}
                    className="flex items-center gap-3 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all p-2 pl-3 rounded-2xl group"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-slate-800 font-black text-xs group-hover:text-indigo-600">
                            {user?.fullname}
                        </p>
                        <p className="text-indigo-600 text-[8px] text-center font-black uppercase tracking-widest">
                            {user?.role}
                        </p>
                    </div>

                    {user?.profilePhoto ? (
                        <img
                            src={user?.profilePhoto}
                            className="w-10 h-10 rounded-xl border-2 border-white shadow-md"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-xl font-bold">
                            {user?.fullname?.charAt(0)?.toUpperCase()}
                        </div>
                    )}
                </button>
            </div>

        </header>
    );
}

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBolt, FaUsers, FaMap, FaMoneyBill, FaStar, FaEnvelope } from "react-icons/fa";

const sidebarLinks = [
    { path: '/overview', label: 'Overview', icon: <FaBolt className="text-amber-500 text-lg" /> },
    { path: '/users', label: 'Explorers', icon: <FaUsers className="text-blue-400 text-lg" /> },
    { path: '/trips', label: 'Inventory', icon: <FaMap className="text-green-400 text-lg" /> },
    { path: '/expired', label: 'Expired', icon: '🕰️' },
    { path: '/payments', label: 'Payments', icon: <FaMoneyBill className="text-emerald-500 text-lg" /> },
    { path: '/reviews', label: 'Reviews', icon: <FaStar className="text-orange-500 text-lg" /> },
    { path: '/messages', label: 'Messages', icon: <FaEnvelope className="text-yellow-400 text-lg" /> },
    { path: '/refund', label: 'refund', icon: <FaEnvelope className="text-yellow-400 text-lg" /> },
];
export default function AdminSidebar({ isCollapsed, onToggleSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    return (

        <aside
            onWheel={(e) => e.stopPropagation()}
            className={`

    fixed top-0 left-0 h-screen bg-[#0a0f1d] hover:[#111827] border-r border-white/10 flex flex-col z-50 shadow-xl
    transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden
    ${isCollapsed ? "w-20 px-2" : "w-72 px-4"}`}>

            <div className="flex items-center justify-between py-6">
                <div
                    onClick={onToggleSidebar}
                    className={`flex items-center cursor-pointer ${isCollapsed ? "justify-start pl-2" : "space-x-3"
                        }`}
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        A
                    </div>

                    {!isCollapsed && (
                        <div>
                            <p className="text-white font-black text-lg leading-none">CORE</p>
                            <p className="text-[9px] text-indigo-400 uppercase tracking-widest">
                                Administrator
                            </p>
                        </div>
                    )}
                </div>

                {!isCollapsed && (
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all flex flex-col gap-1 items-center justify-center w-10 h-10"
                    >
                        <span className="w-5 h-0.5 bg-white rounded-full" />
                        <span className="w-3 h-0.5 bg-white rounded-full" />
                        <span className="w-5 h-0.5 bg-white rounded-full" />
                    </button>
                )}
            </div>


            <nav className="flex-grow mt-4 space-y-2">
                {sidebarLinks.map((link) => {
                    const isActive = location.pathname === link.path;

                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            title={isCollapsed ? link.label : ""}
                            className={`
          relative flex items-center 
          ${isCollapsed ? "justify-start pl-5" : "space-x-3"}
          py-3 px-3 rounded-xl 
          transition-all duration-300
          group
          ${isActive ? "bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white shadow-lg" : "text-slate-50 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {/* ICON */}
                            {/* <span className="text-lg  ">{link.icon}</span> */}
                            <span className="text-lg group-hover:text-indigo-400 transition-all">
                                {link.icon}
                            </span>

                            {/* TEXT */}
                            {!isCollapsed && (
                                <span className="text-[11px] font-bold uppercase tracking-widest">
                                    {link.label}
                                </span>
                            )}

                        </Link>
                    );
                })}
            </nav>
            <div className="mt-auto py-6">
                <button
                    onClick={() => {
                        logout();        // ✅ central logout
                        navigate("/");   // redirect
                    }}
                    title={isCollapsed ? "Logout" : ""}
                    className={`w-full flex items-center justify-center ${isCollapsed ? "" : "gap-2"} py-3 rounded-xl border border-white/10 text-rose-400 font-bold text-[11px]
                    hover:bg-rose-500 hover:text-white transition-all duration-300`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-6 h-6"
                        fill="currentColor"
                    >
                        {/* Door */}
                        <path d="M3 3h10a2 2 0 0 1 2 2v3h-2V5H5v14h8v-3h2v3a2 2 0 0 1-2 2H3V3z" />

                        {/* Arrow */}
                        <path d="M21 12l-4-4v3H9v2h8v3l4-4z" />
                    </svg>
                    {!isCollapsed && "Log Out"}
                </button>
            </div>
        </aside >
    )
}

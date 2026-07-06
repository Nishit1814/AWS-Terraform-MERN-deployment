
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    Users,
    History,
    X,
    Home,
    Info,
    Briefcase,
    Mail,
    Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileSidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = user ? [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Create Trip', path: '/create-trip', icon: PlusCircle },
        { label: 'Join Trip', path: '/join-trip', icon: Users },
        { label: 'History', path: '/history', icon: History },
    ] : [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Services', path: '/services', icon: Briefcase },
        { label: 'About', path: '/about', icon: Info },
        { label: 'Contact', path: '/contact', icon: Mail },
        { label: 'Privacy', path: '/privacy-policy', icon: Shield },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] lg:hidden"
                    />
                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[201] lg:hidden flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-lg">T</div>
                                <span className="text-sm font-black text-white tracking-tighter uppercase">Trip Planner</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation */}
                        <div className="flex-grow py-6 px-4 space-y-2 overflow-y-auto">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <button
                                        key={item.label}
                                        onClick={() => handleNavigate(item.path)}
                                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-sm transition-all border-2 ${isActive
                                            ? 'bg-indigo-50 border-indigo-600 text-indigo-600 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.2)]'
                                            : 'bg-white border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                            }`}
                                    >
                                        <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                                        <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer / User Section */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50">
                            {user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 px-2">
                                       
                                        {user?.profilePhoto ? (
                                            <img
                                                src={user?.profilePhoto}
                                                className=" w-33 h-32 border-5 border-black rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 text-xl rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                                                {user?.fullname?.charAt().toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-grow min-w-0">
                                            <p className="text-sm font-black text-slate-900 truncate capitalize">{user.fullName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{user.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();        // ✅ central logout
                                            navigate("/");   // redirect
                                        }}
                                        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-rose-100 hover:bg-rose-100 transition-all"
                                    >
                                        <logout size={18} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleNavigate('/login')}
                                        className="px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => handleNavigate('/register')}
                                        className="px-4 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                                    >
                                        Register
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


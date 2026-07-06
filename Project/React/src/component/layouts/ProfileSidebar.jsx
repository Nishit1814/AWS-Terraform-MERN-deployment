
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';


const ProfileSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const location = useLocation();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  if (!isOpen) return null;


  return (
    <div className="fixed  inset-0 z-[1000] ">
      {/* Backdrop to close the menu */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute right-4 top-16 w-[300px] overflow-hidden max-h-[80vh] overflow-y-auto  bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl shadow-black/40 backdrop-blur-xl"

      >
        {/* User Header */}
        <div className="flex flex-col items-center justify-center py-6 border-b border-[#30363d] bg-gradient-to-b from-indigo-500/10 to-transparent">

          <div className="w-16 h-16 rounded-full  overflow-hidden border-2 border-indigo-500 shadow-sm shadow-indigo-500/30">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-3xl">
                {user?.fullname?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h3 className="text-sm font-semibold text-white">
            {user?.fullname}
          </h3>

          <p className="text-xs text-[#8b949e] capitalize">
            {user?.role}
          </p>

        </div>

        <div className="border-t border-[#30363d] py-3 space-y-1">
          <p className="px-3 mt-2 text-[10px] text-[#8b949e] uppercase tracking-wider">
            Account
          </p>

          <Link
            to={isAdmin ? "/admin/settings" : "/settings"}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all
             ${location.pathname === "/settings"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-[#c9d1d9] hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10 hover:translate-x-1 transition-all duration-200 hover:text-white"
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Your profile
          </Link>

          {/* Only USER (not admin) */}
          {!isAdmin && (
            <>
              <Link
                to="/favourites"
                onClick={onClose}
                className="flex items-center gap-3 px-3 text-[#c9d1d9] py-2 text-sm hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10 hover:translate-x-1 transition-all duration-200 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Your favourites
              </Link>

              <Link
                to="/user-reviews"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 text-[#c9d1d9] text-sm hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10 hover:translate-x-1 transition-all duration-200 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Your reviews
              </Link>
            </>
          )}
        </div>


        <div className="border-t border-[#30363d] py-2">
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full flex items-center text-[#c9d1d9] gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:translate-x-1 hover:text-red-300 transition-all duration-200 transition-all text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </motion.div>

    </div >
  );
};

export default ProfileSidebar;
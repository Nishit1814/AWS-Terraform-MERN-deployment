
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';
import { MobileSidebar } from './MobileSidebar';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../common/NotificationBell';

export const Navbar = () => {
  // const [isSidebarOpen, setSidebarOpen] = useState(false);
  // const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // ❗ Hide navbar for admin
  if (user?.role === "ADMIN") {
    return <Outlet />;   // only render pages, no navbar
  }

  // useEffect(() => {
  //   let timeout;

  //   const handleScroll = () => {
  //     document.body.classList.add("show-scrollbar");

  //     clearTimeout(timeout);

  //     timeout = setTimeout(() => {
  //       document.body.classList.remove("show-scrollbar");
  //     }, 800);
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);


  useEffect(() => {
    let timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide navbar when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        // Show navbar when scrolling up
        setShowNavbar(true);
      }

      // Show navbar after scrolling stops
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setShowNavbar(true);
      }, 1600);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);




  const navButtons = user ? [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Create Trip', path: '/create-trip' },
    { label: 'Join Trip', path: '/join-trip' },
    { label: 'History', path: '/history' },
  ] : [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy', path: '/privacy-policy' },
  ];

  return (
    <>
      {/* <nav className="sticky top-0 z-[100] bg-slate-900 h-16 border-b border-white/10 shadow-lg"> */}


      <nav
        className={`fixed top-0 left-0 w-full z-[100]
           bg-slate-900 h-16 border-b border-white/10 shadow-lg
              transition-all duration-500 ease-in-out
             ${showNavbar ? "translate-y-0" : "-translate-y-full"}
`}
      >
        <div className="max-w-[1400px] m-auto p-4 flex items-center justify-between h-full">
          {/* Profile & Name on the Left */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
            >
              <Menu size={24} />
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div onClick={() => navigate('/dashboard')} className="w-10 h-10 bg-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">T</div>
                <span className="text-sm font-black text-white tracking-tighter uppercase">Trip Planner</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div onClick={() => navigate('/')} className="w-10 h-10 bg-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">T</div>
                <span className="text-sm font-black text-white tracking-tighter uppercase">Trip Planner</span>
              </div>
            )}
          </div>

          {/* Navigation Buttons in the Center */}
          <div className="hidden lg:flex items-center space-x-4">
            {navButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={() => navigate(btn.path)}

                className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${location.pathname === btn.path
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 h-full">
            {user && (
              <NotificationBell theme="dark" />
            )}

            {user ? (
              <div className="relative ">
                <button
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                  className="flex items-center justify-center h-10 w-10 hover:bg-white/10 rounded-full transition"
                >
                  <div className="w-13 h-10 rounded-3xl border-2 border-indigo-600/70 shadow-md overflow-hidden bg-white">
                    {user?.profilePhoto ? (
                      <img src={user.profilePhoto} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <div className="w-full h-full flex items-center font-bold justify-center bg-indigo-600 text-white text-xl">
                        {user?.fullname?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </button>

                <ProfileSidebar
                  user={user}
                  isOpen={isSidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                  logout={logout}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button onClick={() => navigate('/login')} className="px-5 py-2 rounded-xl text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition">
                  Login
                </button>

                <button onClick={() => navigate('/register')} className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md hover:scale-105 transition">
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <MobileSidebar
        user={user}
        isOpen={isMobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        logout={logout}
      />
      <div className="pt-14">
        <Outlet />
      </div>
    </>
  );
};


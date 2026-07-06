
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoriesConst } from '../constants/categories';
import { useAuth } from '../context/AuthContext';

import Footer from '../component/layouts/Footer';
import useTrips from '../hooks/useTrips';
import CategorySection from '../component/common/CategorySection';


const Home = () => {
  const navigate = useNavigate();
  const { trips, loading, error } = useTrips();
  const { user } = useAuth();

  const [activeCategory, setActiveCategory] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] bg-gradient-to-br from-slate-100 to-slate-200">

        {/* Spinner */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold text-slate-700 mb-2 tracking-wide">
          Loading your trips...
        </h2>

        <p className="text-slate-500 text-sm">
          Preparing amazing experiences for you ✈️
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Something went wrong</h2>
        <p className="text-slate-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }
  if (!trips || trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-xl font-bold text-slate-700">No trips available</h2>
        <p className="text-slate-500">Please check back later</p>
      </div>
    );
  }

  const categories = categoriesConst;

  const filteredCategories = activeCategory
    ? categories.filter(c => c?.name === activeCategory)
    : categories;

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <main className="flex-grow">
        {/* Cinematic Hero */}
        <section className="relative h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] flex items-center justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=2070"
              className="w-full h-full object-cover blur-sm md:blur-md"
              alt="India Landscape"
            />
            {/* Fixed: Removed the white 'reflection' gradient and using a clean dark overlay */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 text-center pb-10 md:pb-0 px-4 sm:px-6 max-w-4xl w-full">

            <h1 className=" text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight sm:leading-[1.1] tracking-tighter">
              Discover the <br />
              <span className="bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">Incredible India </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-12 max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
              Personalized adventures, group journeys, and seamless bookings powered by cutting-edge AI.
            </p>
            <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-xl mx-auto">
              <Link to="/join-trip" className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-indigo-600 text-white rounded-3xl font-black text-sm hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-900/40 uppercase tracking-widest">Start Exploring</Link>

              <Link to="/login" className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-3xl font-black text-sm hover:bg-white/20 uppercase tracking-widest">Sign In to Plan</Link>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg> */}
          </div>
        </section>


        {/* Category Icons Bar (Matching reference image 3) */}
        <section className="relative z-20 w-full max-w-5xl mx-auto px-4 -mt-10 md:-mt-16 overflow-hidden">
          <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border  p-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {categories.map((cat) => {
              const Icon = cat.icon;

              const themeStyles = {
                indigo: "bg-indigo-100 text-indigo-600",
                blue: "bg-blue-100 text-blue-600",
                emerald: "bg-emerald-100 text-emerald-600",
                orange: "bg-orange-100 text-orange-600",
              };

              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setActiveCategory(cat.name);

                    setTimeout(() => {
                      const section = document.getElementById(`section-${cat.name.toLowerCase()}`);

                      if (section) {
                        const navbar = document.querySelector("nav"); // or your navbar class
                        const navbarHeight = navbar?.offsetHeight || 100;

                        const y =
                          section.getBoundingClientRect().top +
                          window.pageYOffset -
                          navbarHeight -
                          10; // small gap

                        if (!section) {
                          console.warn("Section not found:", cat.name);
                          return;
                        }

                        window.scrollTo({
                          top: y,
                          behavior: "smooth",
                        });
                      }
                    }, 50);
                  }}
                  className="group flex flex-col items-center rounded-2xl transition-all hover:scale-105"
                >
                  {/* ICON BOX */}
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl shadow-md ${themeStyles[cat.theme]} group-hover:shadow-xl transition`}
                  >
                    <Icon size={32} weight="duotone" />
                  </div>

                  {/* TEXT */}
                  <span className="text-[11px] mt-4 font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Tripping Lists by Category as per request */}
        <div className="space-y-32 py-32 bg-gray-200">
          {filteredCategories.map((cat) => {
            if (!cat) return null;
            return (
              <section
                key={cat?.name}
                id={`section-${cat?.name.toLowerCase()}`}
                className="max-w-7xl mx-auto px-6 scroll-mt-24 md:scroll-mt-28 md:-mt-16"
              >
                <CategorySection
                  cat={cat}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  trips={trips}
                  user={user}
                  onBookClick={() => {
                    if (!user) {
                      setShowLoginPopup(true);
                    } else {
                      navigate("/booking"); // or whatever route
                    }
                  }}
                />
              </section>
            )
          })}
        </div>


      </main>
      <Footer />

      {/* Login Popup */}
      {
        showLoginPopup && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-slate-900/80 backdrop-blur-md">
            <div className="bg-white rounded-[48px] p-12 max-w-md w-full text-center shadow-2xl animate-bounce-in border-8 border-slate-50">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">🌍</div>
              <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">Login Required</h3>
              <p className="text-slate-500 mb-10 font-medium leading-relaxed">To view itineraries and book group adventures, please sign in to your Explorer account.</p>
              <div className="flex flex-col gap-4">
                <button onClick={() => navigate('/login')} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest">Sign In Now</button>
                <button onClick={() => setShowLoginPopup(false)} className="w-full text-slate-400 py-3 font-black text-[10px] uppercase tracking-widest hover:text-slate-600">Explore Public Data</button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Home;

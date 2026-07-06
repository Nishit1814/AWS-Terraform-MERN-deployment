import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { toggleFavourite } from '../../services/favourite';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';


const TripCard = ({ trip, isAuthenticated, onBookClick }) => {
  const { user, setUser } = useAuth();

  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(user?.favourites?.includes(trip._id));
  }, [user, trip._id]);



  const toggleFav = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      if (onBookClick) onBookClick();
      return;
    }

    const updatedFavs = isFav
      ? user.favourites.filter(id => id !== trip._id)
      : [...user.favourites, trip._id];

    // 🔥 instant UI
    setIsFav(prev => !prev);

    try {
      await toggleFavourite({ tripId: trip._id });

      // ✅ update global user
      const updatedUser = { ...user, favourites: updatedFavs };
      setUser(updatedUser);

      sessionStorage.setItem("user", JSON.stringify(updatedUser));             // ✅ sync with sessionStorage

      if (isFav) {
        toast.success("Removed from favourites 💔");
      } else {
        toast.success("Added to favourites ❤️");
      }

    } catch (error) {
      console.log("error:", error)
      setIsFav(prev => !prev);
    }
  };

  return (
    <div className="bg-white rounded-[30px] overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-slate-100 group relative flex flex-col h-full">
      <button
        onClick={toggleFav}
        className={`absolute top-3 right-3 z-10 p-2.5  rounded-4xl backdrop-blur-md transition-all border ${isFav ? 'bg-rose-500 text-white border-rose-500 shadow-lg' : 'bg-white/80 text-slate-400 border-white/40 hover:text-rose-500'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="relative h-56 overflow-hidden">
        <img
          src={trip.images[0]}
          alt={trip.to}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 bg-slate-200 backdrop-blur-lg px-2 py-1 rounded-full text-[8px] font-black text-indigo-500 uppercase">


          {trip.tripType === "AI" ? 'AI Itinerary' : 'Verified Group'}


        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{trip.from} to {trip.to}</p>
          <h3 className="text-xl font-black">{trip.to}</h3>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-6">
          <div className="text-[10px] font-bold text-black uppercase tracking-widest">
            <span className="block">{new Date(trip.startDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
            <span>{new Date(trip.endDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-black leading-none">₹{trip.price.toLocaleString()}</p>
            <p className="text-[10px] text-black uppercase tracking-tighter">Est. Price</p>
          </div>
        </div>

        <div className="mt-auto">
          {isAuthenticated ? (
            <Link
              to={`/trip/${trip._id}`}
              className="group relative block w-full text-center bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-100 overflow-hidden"
            >
              <span className="relative z-10">View Detailed Plan</span>
              <div className="absolute inset-0 bg-indigo-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          ) : (
            <button
              onClick={onBookClick}
              className="group relative block w-full text-center bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-100 overflow-hidden"
            >
              <span className="relative z-10">Book Adventure</span>
              <div className="absolute inset-0 bg-indigo-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;

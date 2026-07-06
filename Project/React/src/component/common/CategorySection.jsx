import { useAuth } from "../../context/AuthContext";
import useTrips from "../../hooks/useTrips";
import TripCard from "./TripCard"
import { Link } from 'react-router-dom';

export default function CategorySection({ onBookClick, setActiveCategory, activeCategory, cat }) {
    const { user } = useAuth();
    const { trips } = useTrips();

    const getTripsByCategory = (catName) => {
        if (!catName) return [];

        return trips
            ?.filter(t =>
                t.category &&
                t.category.toLowerCase().trim().includes(catName.toLowerCase().trim())
            )

    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 px-2">
                <div className="max-w-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-12 h-1.5 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">{cat?.name} Collection</span>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">
                        {cat?.name} <span className="text-slate-300">Adventures</span>
                    </h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">{cat?.desc}</p>
                </div>
                <div className="flex gap-4">
                    {activeCategory === cat?.name && (
                        <button
                            onClick={() => setActiveCategory(null)}
                            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl"
                        >
                            Clear Filter
                        </button>
                    )}
                    <Link to="/join-trip" state={{ selectedCategory: cat?.name }} className="px-10 py-3 bg-indigo-50 border-2 border-indigo-100 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">Discover All {cat?.name} &rarr;</Link>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {getTripsByCategory(cat.name)?.map(trip => (
                    <TripCard
                        key={trip._id}
                        trip={trip}
                        isAuthenticated={!!user}
                        currentUser={user}
                        onBookClick={onBookClick}
                        onRefresh={() => { }}
                    />
                ))}
                {getTripsByCategory(cat?.name)?.length === 0 && (
                    <div className="col-span-full py-24 bg-indigo-50/30 rounded-[48px] border-4 border-dashed border-indigo-100 text-center">
                        <p className="font-black text-indigo-300 uppercase tracking-widest text-xs">Expanding our {cat?.name} reach...</p>
                    </div>
                )}
            </div>
        </div>
    )
}

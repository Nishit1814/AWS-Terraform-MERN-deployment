
import { useState, useEffect } from 'react';
import Footer from '../../component/layouts/Footer';
import TripCard from '../../component/common/TripCard';
import { useAuth } from '../../context/AuthContext';
import useTrips from '../../hooks/useTrips';
import { useLocation } from 'react-router-dom';


const JoinTrip = () => {

    const { trips } = useTrips();
    console.log("my trip ", trips);
    const { user } = useAuth();

    const [allTrips, setAllTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [category, setCategory] = useState("All");
    const location = useLocation();
    const selectedCategory = location.state?.selectedCategory;
    useEffect(() => {
        if (selectedCategory) {
            setCategory(selectedCategory);
        }
    }, [selectedCategory]);
    const fetchTrips = async () => {
        try {
            console.log("fetchTrips:", trips)
            setAllTrips(
                trips.filter(t => t.tripType?.includes("JOIN"))
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips()
    }, [trips]);

    const categories = ["All", "Heritage", "Mountains", "Cities", "Beaches"];

    const filteredTrips = allTrips.filter(t => {
        const search = filter.toLowerCase();

        const matchesSearch =
            t.to.toLowerCase().includes(search) ||
            t.from.toLowerCase().includes(search) ||
            t.description?.toLowerCase().includes(search);

        const matchesCategory =
            category === "All" ||
            t.category?.toLowerCase() === category.toLowerCase();

        return matchesSearch && matchesCategory;
    });


    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

            <main className="max-w-7xl  mx-auto px-4 py-16 w-full flex-grow">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-xl">
                        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Explore Community Trips</h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed">
                            Curated by experts, joined by people like you. Discover the spirit of India.
                        </p>
                    </div>
                    <div className="w-full md:w-[450px] relative">
                        <input
                            type="text"
                            placeholder="Search e.g. Dwarka, Leh, Kerala..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full px-8 py-5 bg-white border-2 border-slate-100 focus:border-indigo-600 rounded-[32px] shadow-2xl focus:ring-0 transition-all font-bold pr-16 text-slate-800"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-2xl shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-5 py-2 rounded-2xl font-bold text-sm transition ${category === cat
                                ? "bg-indigo-600 text-white"
                                : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-600"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {filteredTrips.length === 0 ? (
                    <div className="py-32 text-center bg-white rounded-[48px] border border-dashed border-slate-200">
                        <div className="text-8xl mb-6 opacity-30">🏜️</div>
                        <p className="text-2xl font-black text-slate-900">No match found</p>
                        <p className="font-medium text-slate-400 mt-2">Try searching "Dwarka" or "Varanasi"</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredTrips.map(trip => (
                            <TripCard
                                key={trip._id}
                                trip={trip}
                                isAuthenticated={!!user}
                                currentUser={user}
                                onRefresh={fetchTrips}
                            />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default JoinTrip;

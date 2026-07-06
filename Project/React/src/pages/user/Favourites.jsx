import  { useState, useEffect } from 'react';
import Footer from '../../component/layouts/Footer';
import TripCard from '../../component/common/TripCard';
import { Link } from 'react-router-dom';
import useTrips from '../../hooks/useTrips';

const Favourites = () => {

    const { trips, refetch } = useTrips();

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        setCurrentUser(user);
    }, []);

    const handleRefresh = async () => {
        refetch(); // refresh trips using hook
    };

    const favTrips = trips?.filter(t => currentUser?.favourites?.includes(t._id));

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <main className="max-w-7xl mx-auto px-4 py-16 w-full flex-grow">
                <h1 className="text-5xl font-black text-slate-900 mb-2">My Favourites</h1>
                <p className="text-xl text-slate-500 font-medium mb-12 uppercase tracking-widest">Trips you've marked for future exploration.</p>

                {favTrips.length === 0 ? (
                    <div className="bg-white rounded-[48px] p-24 text-center border border-slate-100 shadow-xl">
                        <div className="text-8xl mb-8 animate-pulse text-rose-500">❤️</div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Your Heart is Empty</h2>
                        <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">Start browsing trips and click the heart icon to save them here for later.</p>
                        <Link to="/join-trip" className="bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all uppercase text-xs tracking-widest">Discover Destinations</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {favTrips.map(trip => (
                            <TripCard
                                key={trip._id}
                                trip={trip}
                                isAuthenticated={true}
                                currentUser={currentUser}
                                onRefresh={handleRefresh}
                            />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Favourites;

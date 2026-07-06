
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteTrip, fetchTrip } from '../../services/tripServices';

const AdminExpiredTrips = () => {
    const navigate = useNavigate();
    const [expiredTrips, setExpiredTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTrips = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch all trips INCLUDING expired ones
            const data = await fetchTrip(true);
            console.log("AdminExpiredTrips:", data)
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const expired = data.trip.filter((trip) => {
                const endDate = new Date(trip.endDate);
                endDate.setHours(0, 0, 0, 0);
                return endDate < today;
            });
            console.log("expired", expired);

            // Filter for only those where endDate < today
            // const expired = data.filter(t => t.endDate < today);
            setExpiredTrips(expired);
        } catch (err) {
            console.error("Failed to load expired trips", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTrips();
    }, [loadTrips]);

    const handleEditTrip = (trip) => {
        navigate(`/trips/edit/${trip._id}`);
    };

    const handleDeleteTrip = async (id) => {
        if (window.confirm("Permanently delete this expired travel package?")) {
            try {
                await deleteTrip(id);
                await loadTrips();
                alert("Inventory package deleted.");
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div className="h-screen bg-slate-50 flex text-slate-900 transition-all duration-300 overflow-hidden">

            <main className="flex-grow h-full overflow-y-auto overflow-x-hidden transition-all duration-300 scroll-smooth">
                <div className="p-8">
                    {loading ? (
                        <div className="flex justify-center p-20">
                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : expiredTrips?.length === 0 ? (
                        <div className="bg-white rounded-[32px] p-20 text-center border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold">No expired trips found in the inventory.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {expiredTrips?.map(trip => (
                                <div key={trip._id} className="bg-white rounded-[32px] overflow-hidden border border-slate-200 flex flex-col group shadow-sm opacity-75 grayscale-[0.5] hover:grayscale-0 hover:opacity-100 transition-all">
                                    <div className="h-56 relative overflow-hidden">
                                        <img src={trip?.images[0]} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Expired</span>
                                        </div>
                                        <button
                                            onClick={() => handleEditTrip(trip)}
                                            className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black text-indigo-600 uppercase tracking-widest border border-slate-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                        >
                                            Edit
                                        </button>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="text-[8px] font-black text-indigo-100 uppercase tracking-widest mb-0.5">{trip?.from}</p>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-black tracking-tight leading-none">{trip?.to}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col justify-between">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Final Fare</p>
                                                <p className="text-lg font-black text-slate-600 leading-none">₹{trip?.price.toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Ended On</p>
                                                <p className="text-sm font-black text-rose-500 leading-none">{trip?.endDate}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4 border-t border-slate-50">
                                            <button
                                                onClick={() => handleDeleteTrip(trip._id)}
                                                className="flex-1 bg-rose-50 py-3 rounded-xl text-[9px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                                            >
                                                Delete Permanently
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminExpiredTrips;

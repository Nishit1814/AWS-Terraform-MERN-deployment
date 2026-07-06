import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchTripById } from "../../services/tripServices";

export const TripPhotos = ({ trip: propTrip }) => {
    const { id } = useParams();
    const [trip, setTrip] = useState(propTrip || null);
    const [showGallery, setShowGallery] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        if (!propTrip && id) {
            const loadTrip = async () => {
                const res = await fetchTripById(id);
                setTrip(res.trip);
            };
            loadTrip();
        }
    }, [id, propTrip]);
    
    useEffect(() => {
        setTrip(propTrip);
    }, [propTrip]);

    if (!trip) {
        return (
            <div className="text-center py-20 text-slate-400 font-bold">
                Loading photos...
            </div>
        );
    }
    return (
        <div>
            <section className="mb-16">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 px-4">
                    <div>
                        <h1 className="text-6xl font-black text-slate-900 mb-2 tracking-tight">
                            {trip.to}
                        </h1>
                        <p className="text-xl text-slate-500 font-bold uppercase tracking-widest">
                            <span className="block">{new Date(trip.startDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </p>
                    </div>

                    <div className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg">
                        {trip.dayPlan.length} DAY ADVENTURE
                    </div>
                </div>

                {/* Image Layout */}
                <div className="grid md:grid-cols-2 gap-4">
                    {/* LEFT BIG IMAGE */}
                    <div className="rounded-3xl overflow-hidden aspect-[15/9]">
                        <img
                            src={trip.images[0]}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* RIGHT GRID */}
                    <div className="grid grid-cols-2 gap-4">
                        {trip.images.slice(1, 5).map((img, i) => (
                            <div key={i} className="relative rounded-3xl overflow-hidden aspect-[15/9]">
                                <img
                                    src={img}
                                    className="w-full h-full object-cover"
                                    alt="trip"
                                />
                                {i === 3 && (
                                    <button
                                        onClick={() => {
                                            setActiveImage(0);
                                            setShowGallery(true);
                                        }}
                                        className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-sm font-semibold hover:bg-black/80 transition"
                                    >
                                        Show All Photos
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Modal */}
            {showGallery && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">
                    <button
                        onClick={() => setShowGallery(false)}
                        className="absolute top-6 right-8 text-white text-4xl"
                    >
                        ✕
                    </button>

                    <button
                        onClick={() =>
                            setActiveImage((prev) =>
                                prev === 0 ? trip.images.length - 1 : prev - 1
                            )
                        }
                        className="absolute left-6 text-white text-5xl"
                    >
                        ‹
                    </button>

                    <img
                        src={trip.images[activeImage]}
                        alt="gallery"
                        className="max-h-[85vh] max-w-[90vw] rounded-xl shadow-2xl object-contain"
                    />

                    <button
                        onClick={() =>
                            setActiveImage((prev) =>
                                prev === trip.images.length - 1 ? 0 : prev + 1
                            )
                        }
                        className="absolute right-6 text-white text-5xl"
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    )
}

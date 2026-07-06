import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useTrips from '../../hooks/useTrips';
import { useParams } from 'react-router-dom';
import { fetchTripById } from '../../services/tripServices';
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function RelatedTrips({ trip: propTrip }) {
    const { id } = useParams();
    const { trips } = useTrips();
    const trip = propTrip;
    const [relatedTrips, setRelatedTrips] = useState([]);

    useEffect(() => {
        if (!propTrip && id) {
            const loadTrip = async () => {
                await fetchTripById(id);

            };
            loadTrip();
        }
    }, [id, propTrip]);

    useEffect(() => {
        if (trip && trips?.length > 0) {
            const data = trips.filter(
                (f) => f.category === trip.category && f._id !== trip._id
            );
            setRelatedTrips(data);
        }
    }, [trip, trips]);


    const [sliderRef, instanceRef] = useKeenSlider({
        mode: "free-snap",
        slides: {
            perView: 3,
            spacing: 20,
        },
        breakpoints: {
            "(max-width: 768px)": {
                slides: { perView: 1.2, spacing: 10 },
            },
            "(max-width: 1024px)": {
                slides: { perView: 2, spacing: 15 },
            },
        },
        created(slider) {
            slider.container.scrollLeft = 0;
        }
    });

    if (!trip || relatedTrips.length === 0) return null;

    return (
        <div>
            {/* Related Trips Section */}
            {relatedTrips.length > 0 && (
                <section className="mt-24 mb-16">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-4">
                                <span className="w-2 h-10 bg-indigo-600 rounded-full" />
                                RELATED ADVENTURES
                            </h2>
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest px-6">Handpicked journeys similar to this one</p>
                        </div>
                        <div className="flex pr-4 gap-4">
                            <button
                                onClick={() => instanceRef.current?.prev()}
                                className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm"
                            >
                                &larr;
                            </button>
                            <button
                                onClick={() => instanceRef.current?.next()}
                                className="w-12 h-12  rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm"
                            >
                                &rarr;
                            </button>
                        </div>
                    </div>
                    <div key={id} ref={sliderRef} className="keen-slider pb-8">

                        {relatedTrips.map((Trip, index) => (
                            <Link
                                to={`/trip/${Trip._id}`}
                                key={Trip._id + "-" + index}
                                className="keen-slider__slide -mr-[1px] bg-white rounded-[48px] overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl transition-all group"
                            >
                                <div className="h-56 overflow-hidden relative">
                                    <img src={Trip.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={Trip.to} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-8 text-white">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">{Trip.from} to</p>
                                        <h4 className="text-2xl font-black tracking-tight">{Trip.to}</h4>
                                    </div>
                                    <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
                                        {Trip.dayPlan.length} Days
                                    </div>
                                </div>
                                <div className="p-8 flex justify-between items-center">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starting From</p>
                                        <p className="text-2xl font-black text-indigo-600">₹{Trip?.price.toLocaleString()}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        &rarr;
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

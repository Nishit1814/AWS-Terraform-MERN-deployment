import React from 'react';
import PackageValues from './PackageValues';

// export default function TripContent({ trip }) {
export default function TripContent({ trip, hidePaymentBox }) {
    if (!trip) return null;

    return (
        <>
            {/* Description */}
            <div className="mx-6 my-8">
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                    {trip.description}
                </p>
            </div>
            <div
                className={`grid gap-8 ${hidePaymentBox
                    ? "grid-cols-1"
                    : "grid-cols-1 xl:grid-cols-3"
                    }`}
            >

                {/* LEFT - ITINERARY */}

                <div
                    className={`space-y-12 ${!hidePaymentBox ? "lg:col-span-2" : "col-span-1"
                        }`}
                >
                    <section>
                        <h2 className="text-3xl font-black text-slate-900 mb-12 flex items-center gap-4">
                            <span className="w-2 h-10 bg-indigo-600 rounded-full" />
                            COMPLETE ITINERARY ({trip.dayPlan.length} DAYS)
                        </h2>
                        <div className="space-y-16">
                            {trip.dayPlan.map((day, idx) => (
                                <div key={idx} className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-xl hover:shadow-2xl transition-all relative">
                                    <div className="absolute -top-6 -left-6 w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-xl">
                                        {day.day}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Day {day.day} Activities</h3>
                                            <ul className="space-y-4">
                                                {day.activities.map((act, i) => (
                                                    <li key={i} className="flex items-start gap-4 text-slate-600 font-bold text-lg">
                                                        <span className="w-3 h-3 rounded-full bg-indigo-600 mt-2.5 shrink-0" />
                                                        {act}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="pt-6 mt-6 border-t flex flex-wrap gap-2 overflow-x-hidden">
                                                <div className="px-4 py-2 bg-indigo-50 rounded-2xl text-xs font-black text-indigo-600 uppercase">☕ Breakfast: {day.meals.breakfast}</div>
                                                <div className="px-4 py-2 bg-indigo-50 rounded-2xl text-xs font-black text-indigo-600 uppercase">🍲 Lunch: {day.meals.lunch}</div>
                                                <div className="px-4 py-2 bg-indigo-50 rounded-2xl text-xs font-black text-indigo-600 uppercase">🌃 Dinner: {day.meals.dinner}</div>
                                            </div>
                                        </div>
                                        <div className="h-80 rounded-[40px] overflow-hidden shadow-2xl border-8 border-slate-50">
                                            <img src={day.image} className="w-full h-full object-cover" alt={`Day ${day.day}`} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {!hidePaymentBox && (
                    <PackageValues trip={trip} />
                )}

            </div>
        </>
    );
}
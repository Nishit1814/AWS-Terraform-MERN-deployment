
import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { saveHistory } from '../../services/historyService';

const TripType = {
    AI: "AI",
    JOIN: "JOIN"
};


export default function PackageValues({ trip }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [numPersons, setNumPersons] = useState(1);

    const handleConfirmAction = async () => {
        if (!user) {
            alert("Please login to proceed with booking.");
            navigate('/login');
            return;
        }

        if (!trip) return;

        if (trip.tripType === TripType.AI) {
            await saveHistory({
                userId: user._id,
                tripId: trip._id,
                type: 'CREATED',
            });

            alert("Itinerary saved to your Created Trips!");

            navigate('/history');


        } else {
            navigate(`/payment/${trip._id}?persons=${numPersons}`);
            // admin/payments
        }
    };



    const totalPrice = (trip?.price || 0) * numPersons;
    return (
        <div>
            {/* <aside className="md:col-span-1">
                <div className="sticky top-24">

                    <div className="bg-white p-10 rounded-[56px] border border-slate-200 shadow-2xl text-center">
                        <p className="text-slate-400 font-black uppercase text-xs tracking-widest mb-4">Final Package Value</p>
                        <div className="text-6xl font-black text-slate-900 mb-12 leading-none tracking-tighter">₹{totalPrice?.toLocaleString()}</div>

                        {trip?.tripType === TripType.JOIN && (
                            <div className="mb-12 bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Group Size (Persons)</label>
                                <div className="flex items-center justify-center gap-8">
                                    <button
                                        onClick={() => setNumPersons(Math.max(1, numPersons - 1))}
                                        className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-black text-2xl hover:border-indigo-600 transition-all shadow-sm"
                                    >-</button>
                                    <span className="text-4xl font-black w-12 text-slate-900">{numPersons}</span>
                                    <button
                                        onClick={() => setNumPersons(numPersons + 1)}
                                        className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                                    >+</button>
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-50 p-8 rounded-[32px] space-y-6 mb-12 text-left border border-slate-100">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Route</span>
                                <span className="text-slate-900 ml-5 font-black text-lg">{trip?.from} &rarr; {trip?.to}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Transport</span>
                                <span className="text-slate-900 font-black text-lg">{trip?.transportMode}</span>
                            </div>
                        </div>




                        <button
                            onClick={handleConfirmAction}
                            className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-indigo-600 transition-all shadow-2xl uppercase tracking-widest"
                        >
                            {trip?.tripType === TripType.AI ? 'SAVE MY PLAN' : 'BOOK ADVENTURE'}
                        </button>
                    </div>
                </div>
            </aside> */}


            <aside className="lg:col-span-1">
                <div className="sticky top-24">
                    <div className="bg-white p-12 rounded-[56px] border border-slate-200 shadow-2xl text-center">
                        <p className="text-slate-400 font-black uppercase text-xs tracking-widest mb-4">Final Package Value</p>
                        <div className="text-6xl font-black text-slate-900 mb-12 leading-none tracking-tighter">₹{totalPrice.toLocaleString()}</div>

                        {trip.tripType === 'JOIN' && (
                            <div className="mb-12 bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Group Size (Persons)</label>
                                <div className="flex items-center justify-center gap-8">
                                    <button
                                        onClick={() => setNumPersons(Math.max(1, numPersons - 1))}
                                        className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-black text-2xl hover:border-indigo-600 transition-all shadow-sm"
                                    >-</button>
                                    <span className="text-4xl font-black w-12 text-slate-900">{numPersons}</span>
                                    <button
                                        onClick={() => setNumPersons(numPersons + 1)}
                                        className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                                    >+</button>
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-50 p-8 rounded-[32px] space-y-6 mb-12 text-left border border-slate-100">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Route</span>
                                <span className="text-slate-900 font-black text-lg">{trip?.from} &rarr; {trip?.to}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Transport</span>
                                <span className="text-slate-900 font-black text-lg">{trip?.transportMode}</span>
                            </div>
                            {trip.travelers && (
                                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Travelers</span>
                                    <span className="text-slate-900 font-black text-lg">{trip?.travelers} Person(s)</span>
                                </div>
                            )}
                            {trip.travelStyle && (
                                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Style</span>
                                    <span className="text-slate-900 font-black text-lg">{trip?.travelStyle}</span>
                                </div>
                            )}
                            {trip.budgetLevel && (
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Budget</span>
                                    <span className="text-slate-900 font-black text-lg">{trip?.budgetLevel}</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleConfirmAction}
                            className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-indigo-600 transition-all shadow-2xl uppercase tracking-widest mt-12"
                        >
                            {trip.tripType === 'AI' ? 'SAVE MY PLAN' : 'BOOK ADVENTURE'}
                        </button>
                    </div>
                </div>
            </aside>
        </div>


    )
}


import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { fetchUserReviews } from '../../services/reviewServices';

const UserReviews = () => {

    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const fetchMyReviews = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetchUserReviews();
            console.log("fetchMyReviews : ", res)
            setReviews(res.reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchMyReviews();
        }
    }, [user, fetchMyReviews]);

    if (!user) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setComment('');
            setRating(5);
        }, 3000);
    };

    return (
        <div className="min-h-screen  bg-slate-50 p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-16 text-center">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl font-black text-slate-900 tracking-tighter mb-4"
                    >
                        MY <span className="text-indigo-600">REVIEWS</span>
                    </motion.h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Your contribution to the explorer community</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Review Form - General App Feedback */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 bg-white p-10 rounded-[56px] shadow-2xl shadow-slate-200/50 border border-slate-100 h-fit sticky top-24"
                    >
                        <h2 className="text-2xl font-black text-slate-900 mb-2">App Feedback</h2>
                        <p className="text-slate-400 text-sm font-medium mb-8">How&apos;s your experience with the platform so far?</p>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Rating</label>
                                <div className="flex justify-between bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-3xl transition-all ${rating >= star ? 'text-amber-400 scale-125 drop-shadow-sm' : 'text-slate-200 grayscale'
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Your Thoughts</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us what you love or how we can improve..."
                                    className="w-full h-40 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-[32px] p-6 text-slate-700 font-bold outline-none transition-all resize-none shadow-inner"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitted}
                                className={`w-full py-6 rounded-[32px] font-black text-sm uppercase tracking-widest transition-all shadow-2xl ${submitted
                                    ? 'bg-emerald-500 text-white cursor-default shadow-emerald-100'
                                    : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-200'
                                    }`}
                            >
                                {submitted ? '✓ Submitted' : 'Post Feedback'}
                            </button>
                        </form>
                    </motion.div>

                    {/* User's Trip Reviews */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-slate-900">Adventure Reviews</h3>
                            <div className="bg-indigo-50 px-4 py-2 rounded-2xl text-indigo-600 font-black text-xs uppercase tracking-widest">
                                {reviews.length} Total
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Loading your stories...</p>
                            </div>
                        ) : reviews.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {reviews.map((review, idx) => (
                                    <motion.div
                                        key={review._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white p-10 rounded-[48px] shadow-xl shadow-slate-200/30 border border-slate-50 flex flex-col group hover:shadow-2xl transition-all"
                                    >
                                        <p className="text-xl font-black text-slate-900 mb-2">{review?.tripId?.to}</p>
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex text-amber-400 text-sm">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={i < review.rating ? 'opacity-100' : 'opacity-20'}>★</span>
                                                ))}
                                            </div>
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                                {new Date(review.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex-grow mb-8">
                                            <p className="text-slate-600 font-bold leading-relaxed italic relative">
                                                <span className="absolute -top-4 -left-2 text-4xl text-indigo-50 font-serif opacity-50">&quot;</span>
                                                {review.comment}
                                            </p>
                                        </div>
                                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs">
                                                    📍
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adventure Review</span>
                                            </div>
                                            {/* <button className="text-indigo-600 hover:text-indigo-700 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button> */}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border-4 border-dashed border-slate-100 rounded-[64px] p-32 text-center flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6">🏜️</div>
                                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">No reviews yet</h3>
                                <p className="text-slate-400 font-medium mt-2">Your adventures are waiting to be told.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserReviews;

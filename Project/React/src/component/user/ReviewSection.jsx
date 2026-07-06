import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createReview, fetchReviewByTripId } from '../../services/reviewServices';
import { useAuth } from '../../context/AuthContext';

export default function ReviewSection({ tripId: propTripId }) {
    const { id } = useParams();
    const tripId = propTripId || id;
    
    const navigate = useNavigate();
    const { user } = useAuth();

    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    // ✅ Fetch reviews
    useEffect(() => {
        if (!tripId) return;

        const getReviews = async () => {
            const res = await fetchReviewByTripId(tripId);
            setReviews(res.reviews);
        };

        getReviews();
    }, [tripId]);

    // ✅ Submit review
    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Please login to give a review.");
            navigate('/login');
            return;
        }

        if (!newReview.comment.trim()) {
            alert("Please enter a comment.");
            return;
        }

        setSubmittingReview(true);

        try {
            const res = await createReview({
                // tripId: id,
                tripId: tripId,
                rating: newReview.rating,
                comment: newReview.comment
            });

            const reviewWithUser = {
                ...res.review,
                fullname: user.fullname,
                profilePhoto: user.profilePhoto
            };

            setReviews((prev) => [reviewWithUser, ...prev]);
            setNewReview({ rating: 5, comment: '' });

            alert("Review posted successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to post review");
        } finally {
            setSubmittingReview(false);
        }
    };
    return (
        <div>
            {/* Reviews Section */}
            <section className="mt-24 mb-16">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">
                        EXPLORER <span className="text-indigo-600">REVIEWS</span>
                    </h2>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em]">Real stories from real travelers</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Review Form */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-2xl sticky top-24">
                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-slate-800 mb-2">Share Your Story</h3>
                                <p className="text-slate-400 text-sm font-medium">Your feedback helps fellow explorers find their perfect journey.</p>
                            </div>

                            <form onSubmit={handleReviewSubmit} className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">How would you rate it?</label>
                                    <div className="flex justify-between bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                                className={`text-3xl transition-all ${star <= newReview.rating ? 'text-amber-400 scale-125 drop-shadow-sm' : 'text-slate-200 grayscale'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Your Journey Details</label>
                                    <textarea
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        placeholder="Tell us about the highlights, the food, and the overall vibe..."
                                        className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-[32px] outline-none transition-all font-bold text-slate-700 min-h-[200px] resize-none shadow-inner"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 disabled:opacity-50 uppercase tracking-widest"
                                >
                                    {submittingReview ? 'Submitting...' : 'Post My Review'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-8 space-y-10">
                        {reviews.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {reviews.map((review) => (
                                    <div key={review._id} className="bg-white p-10 rounded-[48px] border border-slate-50 shadow-xl hover:shadow-2xl transition-all flex flex-col">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                                                    {/* <img src={review.profilePhoto} className="w-full h-full object-cover" alt={review.fullname} /> */}

                                                    {review.userId?.profilePhoto ? (
                                                        <img
                                                            src={review.userId?.profilePhoto}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        review.userId?.fullname ?
                                                            (
                                                                <div className="w-full h-full text-2xl  font-black bg-indigo-600 text-white flex items-center justify-center">
                                                                    {review?.userId?.fullname?.charAt(0).toUpperCase()}
                                                                </div>

                                                            ) : (
                                                                <div className="w-full h-full text-2xl  font-black bg-indigo-600 text-white flex items-center justify-center">
                                                                    {review?.fullname?.charAt(0).toUpperCase()}
                                                                </div>)

                                                    )}

                                                    {
                                                        review.profilePhoto ?
                                                            (
                                                                <img
                                                                    src={review.profilePhoto}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full text-2xl  font-black bg-indigo-600 text-white flex items-center justify-center">
                                                                    {review?.fullname?.charAt(0).toUpperCase()}
                                                                </div>
                                                            )

                                                    }

                                                </div>
                                                <div>
                                                    {
                                                        review?.userId?.fullname ?

                                                            (<h4 className="font-black text-slate-900 tracking-tight">{review?.userId?.fullname}</h4>) :
                                                            (<h4 className="font-black text-slate-900 tracking-tight">{review?.fullname}</h4>)

                                                    }
                                                    <div className="flex text-amber-400 text-xs mt-1">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <span key={i} className={i < review.rating ? 'opacity-100' : 'opacity-20'}>★</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 px-4 py-2 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                {/* {review.createdAt} */}
                                                {new Date(review.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <div className="relative flex-grow">
                                            <span className="absolute -top-4 -left-2 text-6xl text-indigo-50 font-serif">"</span>
                                            <p className="text-slate-600 font-bold leading-relaxed relative z-10 pl-4">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border-4 border-dashed border-slate-100 rounded-[64px] p-32 text-center flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6">✍️</div>
                                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">No stories yet</h3>
                                <p className="text-slate-400 font-medium mt-2">Be the first to share your adventure!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

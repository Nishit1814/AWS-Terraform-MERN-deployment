import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../../component/layouts/Footer';
import { fetchTripById } from '../../services/tripServices';
import RelatedTrips from '../../component/user/RelatedTrips';
import ReviewSection from '../../component/user/ReviewSection';
import TripContent from '../../component/user/TripContent';
import { TripPhotos } from '../../component/user/TripPhotos';
import PackageValues from "../../component/user/PackageValues";
import { useSearchParams } from 'react-router-dom';

const TripDetails = () => {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [searchParams] = useSearchParams();

    const canReview = searchParams.get("review") === "true";
    const isBookedUser = searchParams.get("booked") === "true";

    const allTrips = async () => {
        const res = await fetchTripById(id);
        setTrip(res.trip)
    }
    const loadTrip = async () => {
        const startTime = Date.now();

        const res = await fetchTripById(id);

        const elapsed = Date.now() - startTime;

        const minDelay = 1000; // 1 second

        if (elapsed < minDelay) {
            await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
        }

        setTrip(res.trip);
    };

    useEffect(() => {
        const loadData = async () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            await loadTrip();
            await allTrips();
        };
        loadData();
    }, [id]);  // ✅ runs every time the trip ID changes in the URL

    if (!trip) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">

                {/* Top Image Skeleton */}
                <div className="w-full h-[350px] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse"></div>

                <div className="px-8 py-10 space-y-8">

                    {/* Title + Info */}
                    <div className="space-y-4">
                        <div className="h-8 w-2/3 rounded bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse"></div>
                        <div className="h-5 w-1/3 rounded bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse"></div>
                    </div>

                    {/* Trip Content Card */}
                    <div className="p-6 bg-white rounded-2xl shadow-sm space-y-4">
                        <div className="h-4 w-full rounded bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse"></div>
                        <div className="h-4 w-5/6 rounded bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse"></div>
                        <div className="h-4 w-4/6 rounded bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse"></div>
                    </div>

                    {/* Gallery Skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="h-40 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse"
                            ></div>
                        ))}
                    </div>

                    {/* Reviews Skeleton */}
                    <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="p-4 bg-white rounded-xl shadow-sm space-y-2">
                                <div className="h-4 w-1/4 bg-slate-200 rounded animate-pulse"></div>
                                <div className="h-3 w-full bg-slate-200 rounded animate-pulse"></div>
                                <div className="h-3 w-3/4 bg-slate-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

            <main>
                <div className="w-full px-10 py-10 flex-grow">

                    <TripPhotos trip={trip} />

                    <TripContent
                        trip={trip}
                        hidePaymentBox={isBookedUser}
                    />

                    {canReview && (
                        <ReviewSection tripId={trip._id} />
                    )}
                </div>

                <div className="pl-8">

                    <RelatedTrips trip={trip} />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TripDetails;


import { useEffect, useState, useCallback } from "react"
import { fetchTrip } from "../services/tripServices";


const useTrips = () => {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    const loadTrips = useCallback(async () => {
        try {

            setLoading(true);
            const data = await fetchTrip();
            console.log("loadTrips:",data.trip)
            setTrips(data.trip);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTrips();
    }, [loadTrips])


    return { trips, loading, error, refetch: loadTrips };
};
export default useTrips;
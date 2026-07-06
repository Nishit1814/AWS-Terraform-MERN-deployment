import axios from "./axios";


export const toggleFavourite = async (tripId) => {

    try {
        console.log("toggleFavourite :", tripId);
        const res = await axios.post("/user/favourite", tripId);
        return res.data;

    } catch (error) {
        console.log(" Failed to toggle favourite ", error)
         throw new Error(error.customMessage); // 🔥 clean
    }
}
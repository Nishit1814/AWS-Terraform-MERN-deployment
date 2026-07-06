import axios from "./axios";

export const saveHistory = async (data) => {
    try {
        const res = await axios.post(`/history/save`, data);
        return res.data;

    } catch (error) {

        const message =
            error.response?.data?.message || "Something went wrong";

        console.log("Create Trip Error:", message);

         throw new Error(error.customMessage); // 🔥 clean
    }
};


export const fetchHistoryByUserId = async () => {
    try {
        const res = await axios.get("/history/get");
        return res.data;

    } catch (error) {
        const message =
            error.response?.data?.message || "Something went wrong";

        console.log("History Not Found:", message);

         throw new Error(error.customMessage); // 🔥 clean // send real message to frontend
    }
};


export const clearHistory = async () => {

    try {

        const res = await axios.delete("/history/clear");
        return res.data;

    } catch (error) {

        console.log(error.message);
        throw new Error(error.customMessage); // 🔥 clean
    }
};

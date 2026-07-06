
import axios from "./axios";

export const fetchauditUser = async (id) => {
    try {
        const res = await axios.get(`/user/audit/${id}`);
        console.log(res);
        return res.data;

    } catch (error) {

        // get backend message
        const message =
            error.response?.data?.message || "Something went wrong";

        console.log("User Not Found:", message);

        throw new Error(message); // send real message to frontend
    }
};
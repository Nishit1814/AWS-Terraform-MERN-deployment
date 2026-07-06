// import axios from "./axios";

// // ================= CREATE CANCELLATION =================

// export const createCancellation = async (data) => {
//     try {
//         const response = await axios.post("/cancellation/trip", data);

//         return {
//             success: true,
//             data: response?.data
//         };

//     } catch (error) {
//         console.error("Cancellation Error:", error);

//         return {
//             success: false,
//             message: error.customMessage || "Failed to submit cancellation"
//         };
//     }
// };

// // GET ALL CANCELLATIONS
// export const getAllCancellations = async () => {
//     try {
//         const res = await axios.get("/cancellation/all");
//         return res.data.data;

//     } catch (err) {
//         console.error("Get cancellations error:", err);
//         return [];
//     }
// }

// export const updateCancellation = async (id, data) => {
//     try {
//         const res = await axios.put(`/cancellation/update/${id}`, data);
//         return res.data;

//     } catch (err) {
//         console.error("Update cancellation error:", err);
//         throw err;
//     }
// };

// // GET LOGGED-IN USER'S OWN CANCELLATIONS
// export const getUserCancellations = async () => {
//     try {
//         const res = await axios.get("/cancellation/my");
//         return res.data.data || [];
//     } catch (err) {
//         console.error("getUserCancellations error:", err);
//         return [];
//     }
// };



import axios from "./axios";

// ================= CREATE CANCELLATION =================

export const createCancellation = async (data) => {
    try {
        const response = await axios.post("/cancellation/trip", data);

        return {
            success: true,
            data: response?.data
        };

    } catch (error) {
        console.error("Cancellation Error:", error);

        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to submit cancellation"
        };
    }
};

// GET ALL CANCELLATIONS
export const getAllCancellations = async () => {
    try {
        const res = await axios.get("/cancellation/all");
        return res.data.data;

    } catch (err) {
        console.error("Get cancellations error:", err);
        return [];
    }
}

export const updateCancellation = async (id, data) => {
    try {
        const res = await axios.put(`/cancellation/update/${id}`, data);
        return res.data;

    } catch (err) {
        console.error("Update cancellation error:", err);
        throw err;
    }
};



// GET LOGGED-IN USER'S OWN CANCELLATIONS
export const getUserCancellations = async () => {
    try {
        const res = await axios.get("/cancellation/my");
        return res.data.data || [];
    } catch (err) {
        console.error("getUserCancellations error:", err);
        return [];
    }
};

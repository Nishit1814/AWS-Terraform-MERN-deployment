import axios from "./axios";

export const fetchPayment = async () => {

    try {
        const res = await axios.get("/payments");
        return res?.data;

    } catch (error) {
        console.log("payment data Failed", error)
         throw new Error(error.customMessage); // 🔥 clean
    }

};

export const fetchPaymentByUserId = async () => {
    try {

        const res = await axios.get("/payments/get");
        return res.data;

    } catch (error) {

        const message =
            error.response?.data?.message || "Something went wrong";

        console.log("User Not Found:", message);

         throw new Error(error.customMessage); // 🔥 clean
    }
};

export const savePayment = async (paymentData) => {
    try {

        const res = await axios.post("/payments/create", paymentData);
        return res.data;

    } catch (error) {

        const message =
            error.response?.data?.message || "Payment failed";

        console.error("Payment Error:", message);

         throw new Error(error.customMessage); // 🔥 clean
    }
};
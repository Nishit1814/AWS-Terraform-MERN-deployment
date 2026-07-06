import axios from "axios";

const BASE_URl = import.meta.env.VITE_API_URL;
// console.log("baseURL ", BASE_URl);


const axiosInstance = axios.create({
    baseURL: BASE_URl,
    headers: {
        "Content-Type": "application/json",
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');

        //if token exists,add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`

        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {

        // ✅ Handle 401 globally
        // if (error?.response?.status === 401) {
        //     sessionStorage.removeItem("token");
        //     // window.location.href = "/login";
        //     window.location.replace("/login");
        // }

        if (error?.response?.status === 401) {
            sessionStorage.removeItem("token");

            if (window.location.pathname !== "/login") {
                window.location.replace("/login"); // ✅ prevents loop
            }
        }

        // ✅ Global error parsing
        let message = "Something went wrong. Please try again.";

        if (!error.response) {
            message = "Unable to reach server. Please check your connection.";
        } else if (error.response?.data?.message) {
            message = error.response.data.message;
        }
        // ✅ attach clean message
        error.customMessage = message;

        return Promise.reject(error);
    }
);

export default axiosInstance;

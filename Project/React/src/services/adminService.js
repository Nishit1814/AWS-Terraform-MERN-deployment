import axios from "./axios";

export const fetchAdminStats = async () => {
  try {


    const res = await axios.get("/user/stats");

    return res.data;

  } catch (error) {

    const message =
      error.response?.data?.message || "Something went wrong";

    console.log("fetchAdminStats :", message);
    throw new Error(error.customMessage,); // 🔥 clean
  }
};
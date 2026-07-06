import axios from "./axios";

export const createTrip = async (tripData) => {
  try {
    const res = await axios.post("/trip/create", tripData);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";
    console.error("createTrip error:", message);
    throw new Error(error.customMessage); // 🔥 clean
  }
};

export const fetchTrip = async () => {
  try {
    const res = await axios.get("/trip/get");
    console.log("fetchTrip:", res)
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";
    console.error("fetchTrip error:", message); // FIX: console.error not console.log
    throw new Error(error.customMessage); // 🔥 clean
  }
};

// Pass page + limit so the backend returns the correct slice
export const fetchTripWithPagination = async ({ page = 1, limit = 6 } = {}) => {
  try {
    const res = await axios.get(`/trip/getWithPage?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";
    console.error("fetchTrip error:", message);
    throw new Error(error.customMessage); // 🔥 clean
  }
};

export const fetchTripById = async (id) => {
  try {
    const res = await axios.get(`/trip/get/${id}`);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";
    console.error("fetchTripById error:", message);
    throw new Error(error.customMessage); // 🔥 clean
  }
};


export const updateTrip = async (id, tripData) => {
  // FIX: was missing entirely — needed for edit functionality
  try {
    console.log("userid :", id);
    console.log("user trip data :", tripData);

    const res = await axios.put(`/trip/update/${id}`, tripData);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update trip";
    console.error("updateTrip error:", message);
    throw new Error(error.customMessage); // 🔥 clean
  }
};

export const deleteTrip = async (id, tripType) => {
  try {
    const res = await axios.delete(`/trip/delete/${id}`, {
      data: { tripType }
    });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete trip";
    console.error("deleteTrip error:", message);
    throw new Error(error.customMessage); // 🔥 clean
  }
};


export const deployPackage = async (tripData, user) => {
  try {
    if (tripData.tripType !== "AI") {
      if (!user || user.role !== "ADMIN") {
        throw new Error("Only admin can deploy this package");
      }
    }

    const res = await axios.post("/trip/create", tripData);

    return res.data;

  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to deploy package";

    console.log("deployPackage:", message);
    throw new Error(message);
  }
};

// export const aiTrip = async (values) => {
//     try {
//         const res = await axios.post("/trip/generate", values);
//         return res.data;
//     } catch (error) {
//        console.log("aiTrip : ", error);
//     }
// };

export const aiTrip = async (values) => {
  try {
    const res = await axios.post("/trip/generate", values);
    return res.data;
  } catch (error) {
    console.log("aiTrip error:", error);

    return {
      success: false,
      message: error?.response?.data?.message || "Server error"
    };
  }
};
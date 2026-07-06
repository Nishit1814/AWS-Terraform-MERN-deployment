import axios from "./axios";

// CREATE REVIEW
export const createReview = async (reviewData) => {
  try {
    const res = await axios.post("/review/create", reviewData);
    return res.data;
  } catch (error) {
    console.error("Error creating review:", error);
     throw new Error(error.customMessage); // 🔥 clean
  }
};


//GET ALL REVIEWS
export const fetchReview = async () => {
  try {
    const res = await axios.get("/review");
    return res.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
     throw new Error(error.customMessage); // 🔥 clean
  }
};

export const fetchUserReviews = async () => {
  try {
    const res = await axios.get("/review/user");
     return res.data;

  } catch (error) {
    console.error("Error fetching reviews:", error);
     throw new Error(error.customMessage); // 🔥 clean
  }
};

export const fetchReviewByTripId = async (tripId) => {
  try {
    const res = await axios.get(`/review/trip/${tripId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
     throw new Error(error.customMessage); // 🔥 clean
  }
};


//DELETE REVIEW
export const deleteReview = async (reviewId) => {
  try {

    const res = await axios.delete(`/reviews/${reviewId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting review:", error);
     throw new Error(error.customMessage); // 🔥 clean
  }
};
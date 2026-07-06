
import { setAuth, removeAuth } from "../utils/auth";
import axios from "./axios";

export const login = async (data) => {
    try {
        const res = await axios.post("/user/login", data);
        setAuth(res.data.token);
        return res.data;
    } catch (error) {
        throw new Error(error.customMessage); // 🔥 clean
    }
};

export const signup = async (data) => {
    try {
        const res = await axios.post("/user/register", data);
        setAuth(res.data.token);
        return res.data;
    } catch (error) {
        throw new Error(error.customMessage); // 🔥 clean
    }
};

export const logout = () => {
    removeAuth(); // ✅ clear token on logout
};




// ─────────────────────────── FETCH ───────────────────────────────────
export const fetchUser = async () => {
    try {
        const res = await axios.get("/user/get");
        return res.data;
    } catch (error) {
        throw new Error(error.customMessage); // 🔥 clean
    }
};

export const fetchUserById = async () => {
    try {
        const res = await axios.get("/user/getUser");
        return res.data;
    } catch (error) {
        throw new Error(error.customMessage); // 🔥 clean
    }
};

export const updateUser = async (data) => {
    try {
        const res = await axios.put("/user/update", data);
        return res.data;
    } catch (error) {
        throw new Error(error.customMessage); // 🔥 clean
    }
};

export const deleteUserbyId = async (id) => {
    try {
        console.log("deleteUserbyId : ", id)
        const res = await axios.delete(`/user/delete/${id}`);
        console.log("response delete", res.data);
        return res.data;
    } catch (error) {
        throw new Error(error.customMessage); // 🔥 clean
    }
}
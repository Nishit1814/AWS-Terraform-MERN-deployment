import axios from "./axios";

// create

export const createMessage = async (messageData) => {
    try {
        const response = await axios.post("/messages/create", messageData);
        return response.data;

    } catch (error) {
        console.error("createMessage error:", error);

        return {
            success: false,
            message: error.customMessage || "Failed to send message",
        };
    }
};


// get
export const getMessages = async (params = {}) => {
    try {
        const response = await axios.get("/messages/all", {
            params, // { status, search }
        });

        return response.data;

    } catch (error) {
        console.error("getMessages error:", error);

        return {
            success: false,
            message: error?.response?.data?.message || "Failed to fetch messages",
        };
    }
};

export const getUserMessages = async (options = {}) => {
    try {
        const { status, search, page = 1, limit = 10 } = options;

        // build query params safely
        const params = new URLSearchParams();
        console.log("params : ", params)

        if (status) params.append("status", status);
        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        console.log("status : ", status);
        const response = await axios.get("/messages/user");

        // success response
        return {
            success: true,
            data: response.data?.data || [],
            count: response.data?.count || 0,
            message: response.data?.message || "Messages fetched successfully",
        };

    } catch (error) {
        console.error("getUserMessages error:", error);

        // server responded with error
        if (error.response) {
            return {
                success: false,
                message:
                    error.response.data?.message || "Server error occurred",
                status: error.response.status,
            };
        }

        // request made but no response
        if (error.request) {
            return {
                success: false,
                message: "No response from server. Check your network.",
            };
        }

        // other errors
        return {
            success: false,
            message: error.message || "Something went wrong",
        };
    }
};

// update

/**
 * Update message status
 * @param {string} id
 * @param {"PENDING" | "RESOLVED"} status
 */
export const updateMessageStatus = async (id, status, resolution = null) => {
    try {
        if (!id) {
            throw new Error("Message ID is required");
        }

        if (!["PENDING", "RESOLVED"].includes(status)) {
            throw new Error("Invalid status value");
        }

        const response = await axios.put(`/messages/update/${id}`, {
            status, resolution
        });

        // backend structure: { success, message, data }
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Update failed");
        }

        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
        };

    } catch (error) {
        console.error("updateMessageStatus error:", error);

        return {
            success: false,
            message:
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong while updating status",
        };
    }
};

// delete
export const deleteMessage = async (id) => {
    try {
        if (!id) {
            return {
                success: false,
                message: "Message ID is required",
            };
        }

        const response = await axios.delete(`/messages/delete/${id}`);

        return {
            success: true,
            message: response.data?.message || "Deleted successfully",
            data: response.data?.data,
        };

    } catch (error) {
        console.error("deleteMessage error:", error);

        return {
            success: false,
            message:
                error?.response?.data?.message ||
                error.message ||
                "Failed to delete message",
        };
    }
};
import axios from "./axios";

export const sendMessageToAI = async (message) => {
  const response = await axios.post("/api/chat", { message });
  return response.data;
};
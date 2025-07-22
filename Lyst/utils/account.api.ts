import axiosInstance from "./index";

export const createAccount = async (userId: string, email: string, displayName: string) => {
  try { 
    const response = await axiosInstance.post("/api/account", {userId, email, displayName});
    return response.data;
  } catch (error) {
    throw error;
  }
};

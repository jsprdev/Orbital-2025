import axiosInstance from "./index";
import { Gift } from "@/types";
import { FIREBASE_AUTH as auth } from "@/FirebaseConfig";

export const getGifts = async (token: string) => {
  try {
    const response = await axiosInstance.get("/api/gifts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.gifts;
  } catch (error) {
    console.error("Error fetching gifts:", error);
    throw error;
  }
};

export const createGift = async (giftData: Omit<Gift, "id" | "userId">, token: string) => {
  try {
    const data = {
      ...giftData,
      userId: auth.currentUser!.uid,
      createdAt: new Date().toISOString(),
    };
    const response = await axiosInstance.post("/api/gifts", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.gift;
  } catch (error) {
    console.error("Error creating gift:", error);
    throw error;
  }
};

export const deleteGift = async (giftId: string, token: string) => {
  try {
    await axiosInstance.delete(`/api/gifts/${giftId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting gift:", error);
    throw error;
  }
}; 
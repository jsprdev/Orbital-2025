import axiosInstance from "./index";
import { DatePlan } from "@/types";
import { FIREBASE_AUTH as auth } from "@/FirebaseConfig";

export const getDatePlans = async (token: string) => {
  try {
    const response = await axiosInstance.get("/api/date-plans", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.plans;
  } catch (error) {
    console.error("Error fetching date plans:", error);
    throw error;
  }
};

export const createDatePlan = async (planData: Omit<DatePlan, "id" | "userId" | "createdAt">, token: string) => {
  try {
    const data = {
      ...planData,
      userId: auth.currentUser!.uid,
      createdAt: new Date().toISOString(),
    };
    const response = await axiosInstance.post("/api/date-plans", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.plan;
  } catch (error) {
    console.error("Error creating date plan:", error);
    throw error;
  }
};

export const deleteDatePlan = async (planId: string, token: string) => {
  try {
    await axiosInstance.delete(`/api/date-plans/${planId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting date plan:", error);
    throw error;
  }
};

export const updateDatePlanStatus = async (planId: string, completed: boolean, token: string) => {
  try {
    await axiosInstance.patch(`/api/date-plans/${planId}/status`, { completed }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error updating date plan status:", error);
    throw error;
  }
};
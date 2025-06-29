import axiosInstance from "./index";
import { FIREBASE_AUTH as auth } from "@/FirebaseConfig";
import { Note } from "@/types";

// fetch notes
export const getNotes = async (token: string) => {
  try {
    const response = await axiosInstance.get("/api/notes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.notes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

// POST requests
export const createNote = async (noteData: Note, token: string) => {
  try {
    noteData.userId = auth.currentUser!.uid;
    const response = await axiosInstance.post("/api/notes", noteData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.note;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

// DELETE requests
export const deleteNote = async (noteId: string, token: string) => {
  try {
    const response = await axiosInstance.delete(`/api/notes/${noteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};

//FOR DATE GENERATION

// generate date route
export const generateDateRoute = async (cards: any, token: string) => {
  console.log("Token being sent:", token);
  console.log("1");
  try {
    const response = await axiosInstance.post(
      "/api/date-route/generate",
      { cards },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("2");
    return response.data.data;
  } catch (error) {
    console.error("Error generating date route:", error);
    throw error;
  }
};

// getting weather from weatherAPI, we just use fetch so its simpler in code
export const getWeatherForecast = async (location = "Singapore") => {
  try {
    const response = await fetch(
      `https://${process.env.EXPO_PUBLIC_HOST}/api/weather/forecast?location=${encodeURIComponent(location)}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
};

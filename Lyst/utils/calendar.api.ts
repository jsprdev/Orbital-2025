import axiosInstance from "./index";
import { CalendarEvent } from "@/types/calendar.dto";

export const getEvents = async (token: string, partnerId?: string) => {
  try { 
    const response = await axiosInstance.get('/api/calendar', {
      params: { partnerId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.events;
  } catch (error: any) {
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
};

export const createEvent = async (token: string, eventData: CalendarEvent) => {
  try {
    const response = await axiosInstance.post('/api/calendar', eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.event;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const deleteEvent = async (token: string, eventId: string) => {
  try {
    const response = await axiosInstance.delete(`/api/calendar/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  }).replace(/^(\d+:\d{2})/, '$1')
    .toLowerCase();
};

export const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${parseInt(day)} ${monthNames[parseInt(month) - 1]}`;
};
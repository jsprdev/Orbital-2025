import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { usePartner } from "@/providers/PartnerProvider";
import { getEvents, createEvent, deleteEvent } from "@/utils/calendar.api";
import { CalendarEvent } from "@/types/calendar.dto";

interface CalendarContextType {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  fetchEvents: () => Promise<void>;
  createEvent: (event: CalendarEvent) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
}


const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const { partnerUserId } = usePartner(); 

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const fetchEvents = useCallback(async () => {
    if (!token) return;
    try {
      const events = await getEvents(token, partnerUserId);
      setEvents(events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, [token, partnerUserId]);

  const addEvent = async (event: CalendarEvent) => {
    if (!token) return;
    try {
      const newEvent = await createEvent(token, event);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  }
  
  const deleteEventHandler = async (eventId: string) => {
    if (!token) return;
    try {
      const response = await deleteEvent(token, eventId);
      setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  } 

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);


  return (
    <CalendarContext.Provider
      value={{
        events,
        fetchEvents,
        addEvent,
        createEvent: addEvent,
        deleteEvent: deleteEventHandler,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};


export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}


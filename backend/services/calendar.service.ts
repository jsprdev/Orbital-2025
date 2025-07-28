import { db } from "../config/firebase-config";
import { CalendarEvent } from "../../Lyst/types/calendar.dto";

export class CalendarService {
  async getEvents(userId: string, partnerId?: string) {
      const eventsRef = db.collection('calendar');
      const snapshot = await eventsRef.where('userId', '==', userId).get();
      const events: CalendarEvent[] = [];
      snapshot.forEach(doc => {
        events.push({ ...doc.data(), id: doc.id } as CalendarEvent);
      });
  
      if (partnerId) {
        const partnerSnapshot = await eventsRef.where('userId', '==', partnerId).get();
        partnerSnapshot.forEach(doc => {
          events.push({ ...doc.data(),  id: doc.id } as CalendarEvent);
        });
      }
      return events;
    }
  
    async addEvent(event: CalendarEvent) {
      const docRef = await db.collection('calendar').add(event);
      return { ...event, id: docRef.id };
    }
  
    async deleteEvent(eventId: string) {
      await db.collection('calendar').doc(eventId).delete();
      return true;
    }
}

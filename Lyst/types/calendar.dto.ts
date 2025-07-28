export interface CalendarEvent {
  id?: string;
  title: string;
  location: string;
  noteId?: string;
  startTime: string; 
  endTime: string;   
  userId: string;
  createdAt: Date;
}
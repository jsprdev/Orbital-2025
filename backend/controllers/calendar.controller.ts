import { Request, Response, Router } from 'express';
import { CalendarService } from '../services/calendar.service';

const notesServiceInstance = new CalendarService();
const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const partnerId = req.query.partnerId?.toString();
        const events = await notesServiceInstance.getEvents(req.user.user_id, partnerId);
        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const event = req.body;
        event.userId = req.user.user_id;
        const addedEvent = await notesServiceInstance.addEvent(event);
        res.status(201).json({ event: addedEvent });
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    const eventId = req.params.id;
    if (!eventId) {
        res.status(400).json({ error: 'Event ID is required' });
        return;
    }
    try {
        const deletedEvent = await notesServiceInstance.deleteEvent(eventId);
        if (deletedEvent) {
            res.status(200).json({ message: 'Event deleted successfully' });
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
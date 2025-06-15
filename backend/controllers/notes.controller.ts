import { Request, Response, Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { NotesService } from '../services/notes.service';

const notesServiceInstance = new NotesService();
const router = Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const notes = await notesServiceInstance.getNotes(req.user.user_id);
        res.status(200).json({ notes });
      } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const note = req.body;
        note.userId = req.user.user_id;
        const addedNote = await notesServiceInstance.addNote(note);
        res.status(201).json({ note: addedNote });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
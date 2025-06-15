import { Request, Response, Router } from 'express';
import verifyToken from '../middleware/verifyToken';
import { notesService } from '../services/notes.service';

const { getNotes, addNote } = notesService;
const router = Router();

router.get("/notes", verifyToken, async (req: Request, res: Response) => {
    try {
        const notes = await getNotes(req.body.user.uid);
        res.status(200).json({ notes });
      } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/notes", verifyToken, async (req: Request, res: Response) => {
    try {
        const note = req.body;
        note.userId = req.body.user.uid; 
        const addedNote = await addNote(note);
        res.status(201).json({ note: addedNote });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
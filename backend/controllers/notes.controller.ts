import { Request, Response, Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { NotesService } from '../services/notes.service';

const notesServiceInstance = new NotesService();
const router = Router();

router.get("/", verifyToken, async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const notes = await notesServiceInstance.getNotes(req.user.user_id);
        res.status(200).json({ notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/", verifyToken, async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const note = req.body;
        note.userId = req.user.user_id;
        const addedNote = await notesServiceInstance.addNote(note);
        res.status(201).json({ note: addedNote });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
    const noteId = req.params.id;
    if (!noteId) {
        res.status(400).json({ error: 'Note ID is required' });
        return;
    }
    try {
        const deletedNote = await notesServiceInstance.deleteNote(noteId);
        if (deletedNote) {
            res.status(200).json({ message: 'Note deleted successfully' });
        } else {
            res.status(404).json({ error: 'Note not found' });
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
import { Request, Response, Router } from 'express';
import { NotesService } from '../services/notes.service';

const notesServiceInstance = new NotesService();
const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const notes = await notesServiceInstance.getNotes(req.user.user_id);
        res.status(200).json({ notes });
      } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/", async (req: Request, res: Response) => {
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

router.delete("/:id", async (req: Request, res: Response) => {
    const noteId = req.params.id;
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
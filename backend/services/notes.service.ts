import { db } from "../config/firebase-config";
import { Note } from "../../Lyst/types/note.dto";

export class NotesService {

  async getNotes(userId: string) {
    const notesRef = db.collection('tasks');
    const snapshot = await notesRef.where('userId', '==', userId).get();
    const notes: Note[] = [];
    snapshot.forEach(doc => {
      notes.push({ ...doc.data(), id: doc.id } as Note);
    });
    return notes;
  }

  async addNote(note: Note) {
    const docRef = await db.collection('tasks').add(note);
    return { ...note, id: docRef.id };
  }

  async deleteNote(noteId: string) {
    await db.collection('tasks').doc(noteId).delete();
    return true;
  }
}
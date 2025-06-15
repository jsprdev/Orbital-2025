import { db } from "../config/firebase-config.js";
import { Note } from "../../Lyst/types/note.dto.ts";

export const notesService = {

  async getNotes(userId) {
    const notesRef = db.collection('notes');
    const snapshot = await notesRef.where('userId', '==', userId).get();

    const notes: Note[] = [];
    snapshot.forEach(doc => {
      notes.push({ ...doc.data(), id: doc.id } as Note);
    });
    return notes;
  },

  async addNote(note: Note) {
    const docRef = await db.collection('notes').add(note);
    return { id: docRef.id, ...note};
  },

  async deleteNote(noteId: string) {
    await db.collection('notes').doc(noteId).delete();
    return true;
  }
}
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Note } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { usePartner } from "@/providers/PartnerProvider";
import { getNotes, createNote, deleteNote } from "@/utils/lyst.api";

interface NotesContextType {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  createNote: (note: Note) => Promise<void>;
  deleteNote: (eventId: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const { partnerUserId } = usePartner(); 

  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = useCallback(async () => {
      if (!token) return;
      try {
        const notes = await getNotes(token, partnerUserId);
        setNotes(notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }, [token, partnerUserId]);

  const createNoteHandler = async (note: Note) => {
    if (!token) return;
    try {
      const newNote = await createNote(note, token);
      setNotes((prev) => [newNote, ...prev]);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  }

  const deleteNoteHandler = async (noteId: string) => {
    if (!token) return;
    try {
      await deleteNote(token, noteId);
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };
  
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
  

  return (
    <NotesContext.Provider
      value={{
        notes,
        fetchNotes,
        createNote: createNoteHandler,
        deleteNote: deleteNoteHandler,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}


export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}

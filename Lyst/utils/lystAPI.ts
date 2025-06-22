import  axiosInstance  from './index';
import { FIREBASE_AUTH as auth } from '@/FirebaseConfig';
import { Note } from "@/types";

// GET requests
export const getNotes = async (token: string) => {

  try {
    const response = await axiosInstance.get('/api/notes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.notes;

  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

// POST requests
export const createNote = async (noteData: Note, token: string) => {
  try {
    noteData.userId = auth.currentUser!.uid;
    const response = await axiosInstance.post('/api/notes', noteData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.note;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

// DELETE requests
export const deleteNote = async (noteId: string, token: string) => {
  try {
    const response = await axiosInstance.delete(`/api/notes/${noteId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }

    });
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};



import axios from 'axios';
import { FIREBASE_AUTH as auth } from '@/FirebaseConfig';

// AXIOS Config
const axiosInstance = axios.create({
  baseURL: `http://${process.env.EXPO_PUBLIC_HOST}:${process.env.EXPO_PUBLIC_PORT}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// fetch notes
export const getNotes = async (token) => {

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


//create notes
export const createNote = async (noteData, token) => {
  try {
    noteData.userId = auth.currentUser.uid;
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


// deletere notes
export const deleteNote = async (noteId, token) => {
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


//FOR DATE GENERATION

// generate date route
export const generateDateRoute = async (cards, token) => {
  console.log("Token being sent:", token);
  try {
    const response = await axiosInstance.post('/api/date-route/generate', 
      { cards },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error generating date route:', error);
    throw error;
  }
};



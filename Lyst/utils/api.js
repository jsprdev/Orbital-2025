import axios from 'axios';
import dotenv from 'dotenv';
import { FIREBASE_AUTH as auth } from '@/FirebaseConfig';

dotenv.config();

// AXIOS Config
const axiosInstance = axios.create({
  baseURL: `http://${process.env.HOST}:${process.env.PORT}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// GET requests
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

// POST requests
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




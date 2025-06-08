import axios from 'axios';
import { FIREBASE_AUTH as auth } from '@/FirebaseConfig';

// AXIOS Config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// GET requests
export const getTasks = async (token) => {
  try {
    const response = await axiosInstance.get('/api/task', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.tasks;

  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// POST requests
export const createTask = async (taskData, token) => {
  try {
    taskData.userId = auth.currentUser.uid;
    const response = await axiosInstance.post('/api/task', taskData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};




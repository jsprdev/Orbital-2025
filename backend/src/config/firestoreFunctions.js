import { db } from "./firebase-config.js";

export const firestoreFunctions = {
    async getTasks(userId) {
      try {
        const todosRef = db.collection('tasks');
        const snapshot = await todosRef.where('userId', '==', userId).get();
  
        const todos = [];
        snapshot.forEach(doc => {
          todos.push({ id: doc.id, ...doc.data() });
        });
  
        return todos;
      } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
      }
    },
  
    async addTask(todo) {
      try {
        const docRef = await db.collection('tasks').add(todo);
        return { id: docRef.id, ...todo };
      } catch (error) {
        console.error('Error adding todo:', error);
        throw error;
      }
    },
    
    async deleteTask(todoId) {
      try {
        await db.collection('tasks').doc(todoId).delete();
        return true;
      } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
      }
    },
  
    async getTaskById(todoId) {
      try {
        const docRef = db.collection('tasks').doc(todoId);
        const docSnap = await docRef.get();
  
        if (!docSnap.exists) return null;
        return { id: docSnap.id, ...docSnap.data() };
      } catch (error) {
        console.error('Error fetching todo by id:', error);
        throw error;
      }
    }
  };
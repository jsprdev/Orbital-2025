import { View, Text } from 'react-native'
import React from 'react'
import { collection, addDoc, deleteDoc, doc, query, where, getDocs, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { Todo } from '../types';



export const firestoreFunctions = {
  async addTodo(todo: Omit<Todo, 'id'>) {
    try {
      const docRef = await addDoc(collection(FIREBASE_DB, 'tasks'), todo);
      return { ...todo, id: docRef.id };
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    }
  },

  async getTodos(userId: string) {
    try {
      const q = query(
        collection(FIREBASE_DB, 'tasks'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Todo));
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  },

  async deleteTodo(todoId: string, userId: string) {
    try {
      console.log("1");
      const todoRef = doc(FIREBASE_DB, 'tasks', todoId);
      console.log(todoId);
      console.log("2");
      
      await deleteDoc(todoRef);
      console.log('success:', todoId);
    } catch (error) {
      console.error('some other error deleting todo:', error);
      throw error;
    }
  }
};



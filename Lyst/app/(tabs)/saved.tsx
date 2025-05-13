import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Alert } from 'react-native';
import Header from '../List/Header';
import AddTodo from '../List/AddItem';
import TodoList from '../List/ToVisit';
import TodoFilters from '../List/FilterBar';
import { Todo, Category } from '../types';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';

const Saved = () => {

  const priColor = '#ff9898';
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  
  const categories: Category[] = [
    { id: '1', name: 'Food', color: priColor },
    { id: '2', name: 'Shopping', color: priColor },
    { id: '3', name: 'Entertainment', color: priColor },
    { id: '4', name: 'Others', color: priColor },
  ];

  
  useEffect(() => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;

    const todosRef = collection(FIREBASE_DB, 'todos');
    const q = query(todosRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData: Todo[] = [];
      snapshot.forEach((doc) => {
        todosData.push({ id: doc.id, ...doc.data() } as Todo);
      });
      setTodos(todosData);
    }, (error) => {
      Alert.alert('Error', 'Failed to fetch todos');
      console.error('Error fetching todos:', error);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTodo = async (text: string, category: string | undefined, priority: 'low' | 'medium' | 'high') => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to add todos');
      return;
    }

    try {
    
      const todoData: Record<string, any> = {
        text,
        category: category || null, 
        priority: priority || 'low',
        createdAt: new Date().toISOString(),
        userId,
      };

      Object.keys(todoData).forEach(key => 
        todoData[key] === null && delete todoData[key]
      );

      await addDoc(collection(FIREBASE_DB, 'todos'), todoData);
    } catch (error) {
      Alert.alert('Error', 'Failed to add todo');
      console.error('Error adding todo:', error);
    }
  };

  
  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(FIREBASE_DB, 'todos', id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete todo');
      console.error('Error deleting todo:', error);
    }
  };

  
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || todo.category === selectedCategory;
    const matchesPriority = !selectedPriority || todo.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <Header />
        <TodoFilters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          categories={categories}
          selectedPriority={selectedPriority}
          onPrioritySelect={setSelectedPriority}
        />
        <AddTodo 
          onAdd={handleAddTodo}
          categories={categories}
        />
        <TodoList 
          todos={filteredTodos}
          onDelete={handleDeleteTodo}
          categories={categories}
        />
      </View>
    </SafeAreaView>
  );
};

export default Saved;
import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import Header from '../(list)/Header';
import AddTodo from '../(list)/AddItem';
import TodoList from '../(list)/ToVisit';
import { Todo, Category } from '../types';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { firestoreFunctions } from '../(list)/firestoreFunctions';

const Saved = () => {

  const priColor = '#ff9898';
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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

    const loadTodos = async () => {
      try {
        setIsLoading(true);
        const loadedTodos = await firestoreFunctions.getTodos(userId);
        setTodos(loadedTodos);
      } catch (error) {
        Alert.alert('Error', 'Failed to load todos');
        console.error('Error loading todos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  const handleAddTodo = async (todo: Omit<Todo, "id">) => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to add todos');
      return;
    }

    try {
      const addedTodo = await firestoreFunctions.addTodo(todo);
      setTodos(prevTodos => [...prevTodos, addedTodo]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add todo');
      console.error('Error adding todo:', error);
    }
  };

  
  
  const handleDeleteTodo = async (id: string) => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) {
      Alert.alert('Incorrect userId');
      return;
    }

    try {
      await firestoreFunctions.deleteTodo(id, userId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
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
        <AddTodo 
          onAdd={handleAddTodo}
          categories={categories}
        />
        
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ff9898" />
          </View>
        ) : (
          <TodoList 
            todos={filteredTodos}
            onDelete={handleDeleteTodo}
            categories={categories}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Saved;
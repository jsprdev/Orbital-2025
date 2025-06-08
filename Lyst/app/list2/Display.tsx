import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { firestoreFunctions } from '../../utils/firestoreAPI';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH as auth} from '../../FirebaseConfig';
import { Priority ,Todo } from '../../types';
import Card from '../card/card';

const priorityColor: Record<Priority, string> = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500',
};

export default function Display({ filters } : {
  filters: { query: string; selectedTags: string[]; priority: Priority | null; }
}) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [userReady, setUserReady] = useState(false);
  
    { /* Listen for authentication state changes */ }
    { /* This is to allow the list to continue display even when user refreshes */ }
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserReady(true);
        } else {
          setUserReady(false);
          setTodos([]);
        }
      });
  
      return unsubscribe;
    }, []);
  
    useEffect(() => {
      if (!userReady) return;
  
      const fetchTodos = async () => {
        try {
          const fetchedTodos = await firestoreFunctions.getTodos();
          setTodos(fetchedTodos);
        } catch (error) {
          console.error("Error fetching todos:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTodos();
    }, [userReady]);
  
    // Filter todos based on the provided filters
    function applyFilters(todos: Todo[], filters: { query: string; selectedTags: string[]; priority: Priority | null }) {
        return todos.filter(todo => {
            const matchesQuery = todo.description.toLowerCase().includes(filters.query.toLowerCase());
            const matchesTags = filters.selectedTags.length === 0 || filters.selectedTags.some(tag => todo.tags?.includes(tag));
            const matchesPriority = !filters.priority || todo.priority === filters.priority;
            return matchesQuery && matchesTags && matchesPriority;
        });
        }
    const filteredTodos = applyFilters(todos, filters);

    if (!userReady || loading) {
      return <Text>Loading...</Text>;
    }
  
    return (
      <ScrollView className="flex-1 bg-white p-4">
        {filteredTodos.map((todo) => (
          <Card key={todo.id} todo={todo} onPress={(id) => console.log("Card pressed:", id)} />
        ))}
      </ScrollView>
    );
  }
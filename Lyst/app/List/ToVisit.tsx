import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Todo, Category } from '../types';

interface ToVisitProps {
  todos: Todo[];
  onDelete: (id: string) => void;
  categories: Category[];
}

export default function ToVisit({ todos, onDelete, categories }: ToVisitProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#dc3545';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const getCategoryColor = (categoryId: string | undefined) => {
    if (!categoryId) return undefined;
    const category = categories.find(c => c.id === categoryId);
    return category?.color;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <ScrollView className="flex-1 px-2.5">
      {todos.map(todo => (
        <View key={todo.id} className="flex-row bg-white p-4 rounded-lg mb-2.5 items-center shadow-md">
          <TouchableOpacity className="flex-1">
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-base flex-1 mr-2">
                {todo.text}
              </Text>
              <View className="flex-row items-center">
                {todo.category && (
                  <View className="px-2 py-0.5 rounded-full mr-1" 
                    style={{ backgroundColor: getCategoryColor(todo.category) }}>
                    <Text className="text-white text-xs font-medium">
                      {categories.find(c => c.id === todo.category)?.name}
                    </Text>
                  </View>
                )}
                <View className="px-2 py-0.5 rounded-full" 
                  style={{ backgroundColor: getPriorityColor(todo.priority) }}>
                  <Text className="text-white text-xs font-medium">
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
            {todo.dueDate && (
              <Text className="text-xs text-gray-500 mt-1">
                Due: {formatDate(todo.dueDate)}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 px-2.5 py-1.5 rounded ml-2.5"
            onPress={() => onDelete(todo.id)}
          >
            <Text className="text-white text-sm font-semibold">Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
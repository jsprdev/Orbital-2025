import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { Category } from '../types';

interface TodoFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  categories: Category[];
  selectedPriority: string | null;
  onPrioritySelect: (priority: string | null) => void;
}

export default function TodoFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  categories,
  selectedPriority,
  onPrioritySelect,
}: TodoFiltersProps) {
  const priorities = ['high', 'medium', 'low'];

  return (
    <View className="p-2.5 bg-white rounded-lg mx-2.5 mb-2.5 shadow-md">
      <TextInput
        className="h-10 border border-gray-200 rounded-lg px-2.5 mb-2.5 text-base"
        placeholder="Search todos..."
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mb-2.5"
      >
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 border 
            ${!selectedCategory ? 'bg-primary' : 'bg-white border-black-200'}`}
          onPress={() => onCategorySelect(null)}
        >
          <Text className={`text-sm ${!selectedCategory ? 'text-white' : 'text-gray-700'}`}>
            All
          </Text>
        </TouchableOpacity>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            className={`px-4 py-2 rounded-full mr-2 border border-gray-200
              ${selectedCategory === category.id ? 'bg-primary' : 'bg-white'}`}
            onPress={() => onCategorySelect(category.id)}
          >
            <Text className={`text-sm ${selectedCategory === category.id ? 'text-white' : 'text-gray-700'}`}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mb-2.5"
      >
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 border
            ${!selectedPriority ? 'bg-primary border-black' : 'bg-white border-gray-200'}`}
          onPress={() => onPrioritySelect(null)}
        >
          <Text className={`text-sm ${!selectedPriority ? 'text-white' : 'text-gray-700'}`}>
            All Priorities
          </Text>
        </TouchableOpacity>
        {priorities.map(priority => (
          <TouchableOpacity
            key={priority}
            className={`px-4 py-2 rounded-full mr-2 border
              ${selectedPriority === priority ? 'bg-primary border-blue-500' : 'bg-white border-gray-200'}`}
            onPress={() => onPrioritySelect(priority)}
          >
            <Text className={`text-sm ${selectedPriority === priority ? 'text-white' : 'text-gray-700'}`}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
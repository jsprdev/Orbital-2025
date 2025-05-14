import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Category } from '../types';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { Todo } from '../types';

interface AddTodoProps {
  onAdd: (todo: Omit<Todo, 'id'>) => void;
  categories: Category[];
}

export default function AddTodo({ onAdd, categories }: AddTodoProps) {
  
  const [text, setText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAdd = () => {
    const currentUser = FIREBASE_AUTH.currentUser;

    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to add items');
      return;
    }

    if (text.trim().length > 0) {

      const temp: Omit<Todo, 'id'> = {
        text: text.trim(),
        category: selectedCategory,
        priority: selectedPriority,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      };
      
      onAdd(temp);
      setText('');
      setSelectedCategory(null);
      setSelectedPriority('medium');
    }
  };

  const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

  return (
    <View className="bg-white mx-2.5 mb-2.5 rounded-lg shadow-md">
      <View className="flex-row p-2.5">
        <TextInput
          className="flex-1 h-10 px-2.5 text-base border border-gray-200 rounded-lg mr-2"
          placeholder="What's next on your Lyst?"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity
          className="bg-gray-500 px-4 justify-center items-center rounded-md mr-2"
          onPress={() => setShowModal(true)}
        >
          <Text className="text-white text-sm font-semibold">Options</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-primary px-5 justify-center items-center rounded-md"
          onPress={handleAdd}
        >
          <Text className="text-white text-base font-semibold">Add</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white p-5 rounded-t-3xl">
            <Text className="text-xl font-bold mb-5 text-center">Todo Options</Text>
            
            <Text className="text-base font-semibold mt-4 mb-2.5">Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row mb-4"
            >
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  className={`px-4 py-2 rounded-full mr-2 border border-gray-200 
                    ${selectedCategory === category.id ? 'bg-primary' : 'bg-white'}`}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text className={`text-sm ${selectedCategory === category.id ? 'text-white' : 'text-gray-700'}`}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text className="text-base font-semibold mb-2.5">Priority</Text>
            <View className="flex-row justify-between mb-4">
              {priorities.map(priority => (
                <TouchableOpacity
                  key={priority}
                  className={`flex-1 py-2 mx-1 rounded-full border 
                    ${selectedPriority === priority ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
                  onPress={() => setSelectedPriority(priority)}
                >
                  <Text className={`text-sm text-center 
                    ${selectedPriority === priority ? 'text-white' : 'text-gray-700'}`}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className="bg-primary p-4 rounded-lg mt-5"
              onPress={() => setShowModal(false)}
            >
              <Text className="text-white text-base font-semibold text-center">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
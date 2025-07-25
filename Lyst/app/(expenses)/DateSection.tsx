import React from 'react';
import { View, TextInput, TouchableOpacity, Alert, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ExpenseItem from './ExpenseItem';
import { ExpenseItemType } from '@/utils/expenses.api';

export default function DateSection({ title, items, onAddItem, onChangeItem, onChangeTitle, onDelete, prevTitle }: {
  title: string;
  items: ExpenseItemType[];
  onAddItem: () => void;
  onChangeItem: (itemIdx: number, updated: ExpenseItemType, newItems?: ExpenseItemType[]) => void;
  onChangeTitle: (newTitle: string) => void;
  onDelete: () => void;
  prevTitle: string;
}) {
  const [localTitle, setLocalTitle] = React.useState(title);
  React.useEffect(() => { setLocalTitle(title); }, [title]);

  const handleBlur = () => {
    if (!localTitle.trim()) {
      Alert.alert("Section name cannot be empty.");
      setLocalTitle(prevTitle || "New Section");
      onChangeTitle(prevTitle || "New Section");
    } else {
      onChangeTitle(localTitle);
    }
  };

  const onDeleteItem = (itemIdx: number) => {
    const newItems = items.filter((_, i) => i !== itemIdx);
    onChangeItem(-1, { name: '', amount: '' }, newItems);
  };

  return (
    <View className="mb-6 p-4 bg-gray-100 rounded-xl">
      <View className="flex-row items-center mb-2">
        <TextInput
          className="flex-1 text-xl font-bold bg-white px-2 py-1 rounded-lg border border-pink-500"
          value={localTitle}
          onChangeText={setLocalTitle}
          onBlur={handleBlur}
          placeholder="Enter a name..."
        />
        <TouchableOpacity onPress={onDelete} className="ml-2 p-1">
          <Feather name="trash-2" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>
      {items.map((item, idx) => (
        <ExpenseItem
          key={idx}
          item={item}
          onChange={updated => onChangeItem(idx, updated)}
          onDelete={() => onDeleteItem(idx)}
        />
      ))}
      <TouchableOpacity
        className="mt-2 bg-pink-500 py-2 px-4 rounded-lg items-center"
        onPress={onAddItem}
      >
        <Text className="text-white font-semibold">+ Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}